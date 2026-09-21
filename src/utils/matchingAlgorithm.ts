import { Item, SmartMatchResult, SmartMatchFactor } from '../types';

/**
 * Tokenize and normalize string for similarity comparison
 */
function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !['the', 'and', 'for', 'with', 'was', 'this', 'that'].includes(token));
}

/**
 * Calculate Jaccard similarity between two token arrays
 */
function calculateJaccardSimilarity(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  let intersectionCount = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      intersectionCount++;
    } else {
      // Also check if any token contains or is contained
      for (const b of setB) {
        if (token.includes(b) || b.includes(token)) {
          intersectionCount += 0.5;
          break;
        }
      }
    }
  }

  const unionSize = new Set([...tokensA, ...tokensB]).size;
  return Math.min(1, intersectionCount / Math.max(1, unionSize));
}

/**
 * Smart matching algorithm adhering strictly to the 40-20-20-10-10 weighting model
 */
export function evaluateSmartMatch(lostItem: Item, foundItem: Item): SmartMatchResult {
  // 1. Item Name Similarity (Weight: 40%)
  const nameTokensLost = tokenize(lostItem.item_name);
  const nameTokensFound = tokenize(foundItem.item_name);
  const nameSim = calculateJaccardSimilarity(nameTokensLost, nameTokensFound);
  const nameScore = Math.round(nameSim * 40 * 10) / 10;

  // 2. Category Match (Weight: 20%)
  const categoryMatched = lostItem.category.trim().toLowerCase() === foundItem.category.trim().toLowerCase();
  const categoryScore = categoryMatched ? 20 : 0;

  // 3. Location Match (Weight: 20%)
  const locTokensLost = tokenize(lostItem.location);
  const locTokensFound = tokenize(foundItem.location);
  const locSim = calculateJaccardSimilarity(locTokensLost, locTokensFound);
  let locationScore = 0;
  if (lostItem.location.trim().toLowerCase() === foundItem.location.trim().toLowerCase()) {
    locationScore = 20;
  } else if (locSim > 0.4) {
    locationScore = Math.round(locSim * 20 * 10) / 10;
  } else {
    locationScore = 0;
  }

  // 4. Date Proximity (Weight: 10%)
  let dateScore = 0;
  let dateDiffDays = 999;
  try {
    const d1 = new Date(lostItem.report_date).getTime();
    const d2 = new Date(foundItem.report_date).getTime();
    dateDiffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
    if (dateDiffDays <= 1) {
      dateScore = 10;
    } else if (dateDiffDays <= 3) {
      dateScore = 8;
    } else if (dateDiffDays <= 7) {
      dateScore = 5;
    } else if (dateDiffDays <= 14) {
      dateScore = 2;
    } else {
      dateScore = 0;
    }
  } catch {
    dateScore = 5;
  }

  // 5. Description & Identifying Features Similarity (Weight: 10%)
  const descLost = tokenize(`${lostItem.description} ${lostItem.color} ${lostItem.brand} ${lostItem.identifying_features}`);
  const descFound = tokenize(`${foundItem.description} ${foundItem.color} ${foundItem.brand} ${foundItem.identifying_features}`);
  const descSim = calculateJaccardSimilarity(descLost, descFound);
  const descScore = Math.round(descSim * 10 * 10) / 10;

  const totalScore = Math.min(100, Math.round(nameScore + categoryScore + locationScore + dateScore + descScore));

  const factors: SmartMatchFactor[] = [
    {
      name: 'Item Name Similarity',
      weight: 40,
      score: nameScore,
      matched: nameScore >= 20,
      details: `"${lostItem.item_name}" vs "${foundItem.item_name}" (${nameScore}/40)`
    },
    {
      name: 'Category Match',
      weight: 20,
      score: categoryScore,
      matched: categoryMatched,
      details: categoryMatched ? `Matched: ${lostItem.category} (20/20)` : `Different: ${lostItem.category} vs ${foundItem.category} (0/20)`
    },
    {
      name: 'Campus Location Match',
      weight: 20,
      score: locationScore,
      matched: locationScore >= 12,
      details: `"${lostItem.location}" vs "${foundItem.location}" (${locationScore}/20)`
    },
    {
      name: 'Date Proximity',
      weight: 10,
      score: dateScore,
      matched: dateScore >= 5,
      details: dateDiffDays < 99 ? `Recorded within ${Math.round(dateDiffDays)} day(s) (${dateScore}/10)` : `Reported dates (${dateScore}/10)`
    },
    {
      name: 'Description & Color Similarity',
      weight: 10,
      score: descScore,
      matched: descScore >= 4,
      details: `Color, brand & context overlap (${descScore}/10)`
    }
  ];

  return {
    lostItem,
    foundItem,
    overallScore: totalScore,
    factors
  };
}

/**
 * Scan all items to find possible matches for a given item (Lost against Found, or vice-versa)
 */
export function findMatchesForItem(targetItem: Item, allItems: Item[], minThreshold = 45): SmartMatchResult[] {
  const oppositeType = targetItem.report_type === 'lost' ? 'found' : 'lost';
  const candidatePool = allItems.filter(item => 
    item.report_type === oppositeType && 
    item.item_id !== targetItem.item_id &&
    item.status !== 'Closed'
  );

  const results: SmartMatchResult[] = [];

  for (const candidate of candidatePool) {
    const lost = targetItem.report_type === 'lost' ? targetItem : candidate;
    const found = targetItem.report_type === 'found' ? targetItem : candidate;
    const match = evaluateSmartMatch(lost, found);

    if (match.overallScore >= minThreshold) {
      results.push(match);
    }
  }

  return results.sort((a, b) => b.overallScore - a.overallScore);
}

/**
 * Get all existing pairings in the system above threshold
 */
export function getAllSmartMatches(allItems: Item[], minThreshold = 50): SmartMatchResult[] {
  const lostItems = allItems.filter(i => i.report_type === 'lost' && i.status !== 'Closed');
  const foundItems = allItems.filter(i => i.report_type === 'found' && i.status !== 'Closed');
  
  const matches: SmartMatchResult[] = [];
  const pairKeys = new Set<string>();

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const key = `${lost.item_id}_${found.item_id}`;
      if (pairKeys.has(key)) continue;
      
      const result = evaluateSmartMatch(lost, found);
      if (result.overallScore >= minThreshold) {
        pairKeys.add(key);
        matches.push(result);
      }
    }
  }

  return matches.sort((a, b) => b.overallScore - a.overallScore);
}
