// Netlify Function: matching.js
// Server-side multi-factor matching evaluation adhering strictly to the 40-20-20-10-10 weighting model

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !['the', 'and', 'for', 'with', 'left', 'lost', 'found', 'near', 'from', 'this', 'that'].includes(t));
}

function calculateJaccardSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersectionCount = 0;
  for (const a of setA) {
    if (setB.has(a)) {
      intersectionCount += 1;
    } else {
      for (const b of setB) {
        if (a.includes(b) || b.includes(a)) {
          intersectionCount += 0.5;
          break;
        }
      }
    }
  }
  const unionSize = new Set([...tokensA, ...tokensB]).size;
  return Math.min(1, intersectionCount / Math.max(1, unionSize));
}

function evaluateSmartMatch(lostItem, foundItem) {
  // 1. Item Name Similarity (40%)
  const nameTokensLost = tokenize(lostItem.item_name);
  const nameTokensFound = tokenize(foundItem.item_name);
  const nameSim = calculateJaccardSimilarity(nameTokensLost, nameTokensFound);
  const nameScore = Math.round(nameSim * 40 * 10) / 10;

  // 2. Category Match (20%)
  const categoryMatched = (lostItem.category || '').trim().toLowerCase() === (foundItem.category || '').trim().toLowerCase();
  const categoryScore = categoryMatched ? 20 : 0;

  // 3. Location Match (20%)
  const locTokensLost = tokenize(lostItem.location);
  const locTokensFound = tokenize(foundItem.location);
  const locSim = calculateJaccardSimilarity(locTokensLost, locTokensFound);
  let locationScore = 0;
  if ((lostItem.location || '').trim().toLowerCase() === (foundItem.location || '').trim().toLowerCase()) {
    locationScore = 20;
  } else if (locSim > 0.4) {
    locationScore = Math.round(locSim * 20 * 10) / 10;
  }

  // 4. Date Proximity (10%)
  let dateScore = 0;
  try {
    const d1 = new Date(lostItem.report_date).getTime();
    const d2 = new Date(foundItem.report_date).getTime();
    const dateDiffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
    if (dateDiffDays <= 1) dateScore = 10;
    else if (dateDiffDays <= 3) dateScore = 8;
    else if (dateDiffDays <= 7) dateScore = 5;
    else if (dateDiffDays <= 14) dateScore = 2;
  } catch {
    dateScore = 5;
  }

  // 5. Description & Identifying Features (10%)
  const descLost = tokenize(`${lostItem.description || ''} ${lostItem.color || ''} ${lostItem.brand || ''} ${lostItem.identifying_features || ''}`);
  const descFound = tokenize(`${foundItem.description || ''} ${foundItem.color || ''} ${foundItem.brand || ''} ${foundItem.identifying_features || ''}`);
  const descSim = calculateJaccardSimilarity(descLost, descFound);
  const descScore = Math.round(descSim * 10 * 10) / 10;

  const totalScore = Math.min(100, Math.round(nameScore + categoryScore + locationScore + dateScore + descScore));

  const factors = [
    { name: 'Item Name Similarity', weight: 40, score: nameScore, matched: nameScore >= 20, details: `"${lostItem.item_name}" vs "${foundItem.item_name}" (${nameScore}/40)` },
    { name: 'Category Match', weight: 20, score: categoryScore, matched: categoryMatched, details: categoryMatched ? `Matched: ${lostItem.category} (20/20)` : `Different: ${lostItem.category} vs ${foundItem.category} (0/20)` },
    { name: 'Campus Location Match', weight: 20, score: locationScore, matched: locationScore >= 10, details: `${lostItem.location} vs ${foundItem.location} (${locationScore}/20)` },
    { name: 'Date Proximity', weight: 10, score: dateScore, matched: dateScore >= 5, details: `Reported dates proximity (${dateScore}/10)` },
    { name: 'Description & Color Similarity', weight: 10, score: descScore, matched: descScore >= 4, details: `Color, brand & context overlap (${descScore}/10)` }
  ];

  return {
    lostItem,
    foundItem,
    overallScore: totalScore,
    factors
  };
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { lostItem, foundItem, candidates, targetItem, minThreshold = 50 } = body;

    if (lostItem && foundItem) {
      const match = evaluateSmartMatch(lostItem, foundItem);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, match })
      };
    }

    if (targetItem && Array.isArray(candidates)) {
      const results = [];
      for (const candidate of candidates) {
        const lost = targetItem.report_type === 'lost' ? targetItem : candidate;
        const found = targetItem.report_type === 'found' ? targetItem : candidate;
        const match = evaluateSmartMatch(lost, found);
        if (match.overallScore >= minThreshold) {
          results.push(match);
        }
      }
      results.sort((a, b) => b.overallScore - a.overallScore);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, matches: results })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid payload: provide either {lostItem, foundItem} or {targetItem, candidates}' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Matching error' })
    };
  }
};
