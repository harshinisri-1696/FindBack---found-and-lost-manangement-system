import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Database, 
  Code2, 
  Layers, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileCode, 
  Cpu, 
  Server
} from 'lucide-react';

export const ProjectInspectorModal: React.FC = () => {
  const { inspectorOpen, setInspectorOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'mysql' | 'php' | 'units' | 'architecture'>('mysql');
  const [copied, setCopied] = useState(false);

  if (!inspectorOpen) return null;

  const mysqlSchemaCode = `-- ============================================================
-- FINDBACK: SMART CAMPUS LOST & FOUND MANAGEMENT SYSTEM
-- Target Database: MySQL 8.0 / MariaDB
-- ============================================================

CREATE DATABASE IF NOT EXISTS findback_campus_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE findback_campus_db;

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    college_id VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL, -- bcrypt hashed
    role ENUM('student', 'faculty', 'admin') DEFAULT 'student',
    status ENUM('active', 'suspended') DEFAULT 'active',
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Table: categories
CREATE TABLE IF NOT EXISTS categories (
    category_id VARCHAR(50) PRIMARY KEY,
    category_name VARCHAR(60) NOT NULL UNIQUE,
    icon_name VARCHAR(50) DEFAULT 'HelpCircle'
) ENGINE=InnoDB;

-- 3. Table: items
CREATE TABLE IF NOT EXISTS items (
    item_id VARCHAR(50) PRIMARY KEY,
    report_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. FB-2026-00124
    user_id VARCHAR(50) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(60) NOT NULL,
    description TEXT NOT NULL,
    report_type ENUM('lost', 'found') NOT NULL,
    location VARCHAR(120) NOT NULL,
    report_date DATE NOT NULL,
    color VARCHAR(40),
    brand VARCHAR(60),
    identifying_features TEXT,
    image VARCHAR(500) NOT NULL,
    current_custody VARCHAR(200), -- Campus location/security office if found
    additional_info TEXT,
    status ENUM('Pending Verification', 'Active', 'Possible Match', 'Recovery Requested', 'Recovered', 'Closed') DEFAULT 'Pending Verification',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Table: recovery_requests
CREATE TABLE IF NOT EXISTS recovery_requests (
    request_id VARCHAR(50) PRIMARY KEY,
    item_id VARCHAR(50) NOT NULL,
    requester_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    identifying_details TEXT NOT NULL,
    status ENUM('Pending Verification', 'Under Verification', 'Approved', 'Rejected', 'Recovered') DEFAULT 'Pending Verification',
    admin_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
    notification_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    item_id VARCHAR(50),
    type ENUM('match', 'status_change', 'recovery', 'system') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indexes for performance
CREATE INDEX idx_items_type_status ON items(report_type, status);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_location ON items(location);
`;

  const phpBackendCode = `<?php
/**
 * FINDBACK: Server-Side Architecture
 */

// 1. Database Connection via PDO (db_connect.php)
class Database {
    private static $host = "localhost";
    private static $db   = "findback_campus_db";
    private static $user = "findback_admin";
    private static $pass = "SecureCampus#2026";
    private static $pdo  = null;

    public static function getConnection(): PDO {
        if (self::$pdo === null) {
            $dsn = "mysql:host=" . self::$host . ";dbname=" . self::$db . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            self::$pdo = new PDO($dsn, self::$user, self::$pass, $options);
        }
        return self::$pdo;
    }
}

// 2. Session Management & Auth (auth_check.php)
session_start([
    'cookie_lifetime' => 86400,
    'cookie_httponly' => true,
    'cookie_secure'   => true,
    'cookie_samesite' => 'Strict'
]);

function requireUserLogin() {
    if (!isset($_SESSION['user_id'])) {
        header("Location: /login.php");
        exit;
    }
}

function requireAdminRole() {
    requireUserLogin();
    if ($_SESSION['role'] !== 'admin') {
        http_response_code(403);
        die("Unauthorized campus administrative access.");
    }
}

// 3. File Upload & Sanitization (upload_handler.php)
function handleItemImageUpload($fileField): string {
    if (!isset($_FILES[$fileField]) || $_FILES[$fileField]['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Image upload failed or empty.");
    }

    $allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
    $fileInfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $fileInfo->file($_FILES[$fileField]['tmp_name']);

    if (!in_array($mime, $allowedMime)) {
        throw new Exception("Invalid image format. Allowed: JPG, PNG, WEBP.");
    }

    $ext = pathinfo($_FILES[$fileField]['name'], PATHINFO_EXTENSION);
    $filename = "fb_" . bin2hex(random_bytes(12)) . "." . $ext;
    $target = __DIR__ . "/../uploads/" . $filename;

    move_uploaded_file($_FILES[$fileField]['tmp_name'], $target);
    return "/uploads/" . $filename;
}

// 4. Prepared Statement CRUD Example (report_lost.php)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_lost_report'])) {
    requireUserLogin();
    
    $pdo = Database::getConnection();
    $stmt = $pdo->prepare("
        INSERT INTO items (
            item_id, report_code, user_id, item_name, category, 
            description, report_type, location, report_date, 
            color, brand, identifying_features, image, status
        ) VALUES (
            :id, :code, :uid, :name, :cat, 
            :desc, 'lost', :loc, :rdate, 
            :color, :brand, :ident, :img, 'Pending Verification'
        )
    ");
    
    // Bind parameters safely to prevent SQL injection
    $stmt->execute([
        ':id'    => uniqid('itm_'),
        ':code'  => 'FB-2026-' . str_pad(mt_rand(100, 99999), 5, '0', STR_PAD_LEFT),
        ':uid'   => $_SESSION['user_id'],
        ':name'  => htmlspecialchars(trim($_POST['item_name'])),
        ':cat'   => $_POST['category'],
        ':desc'  => htmlspecialchars(trim($_POST['description'])),
        ':loc'   => $_POST['location'],
        ':rdate' => $_POST['report_date'],
        ':color' => $_POST['color'] ?? '',
        ':brand' => $_POST['brand'] ?? '',
        ':ident' => htmlspecialchars($_POST['identifying_features'] ?? ''),
        ':img'   => handleItemImageUpload('item_image')
    ]);
    
    header("Location: /my_reports.php?success=1");
    exit;
}
`;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Code copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#1E3A8A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">FindBack System Architecture &amp; Database Inspector</h3>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Technical reference for Campus Database Schema &amp; Server-Side Processing.
              </p>
            </div>
          </div>
          <button
            onClick={() => setInspectorOpen(false)}
            className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 py-2">
            <button
              onClick={() => setActiveTab('mysql')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'mysql' ? 'bg-white text-[#4169E1] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Database className="w-4 h-4" />
              MySQL Schema (5 Tables)
            </button>
            <button
              onClick={() => setActiveTab('php')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'php' ? 'bg-white text-[#4169E1] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Server className="w-4 h-4" />
              PHP Server-Side Code
            </button>
            <button
              onClick={() => setActiveTab('units')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'units' ? 'bg-white text-[#4169E1] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Layers className="w-4 h-4" />
              Syllabus Units 2-5 Mapping
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'architecture' ? 'bg-white text-[#4169E1] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Cpu className="w-4 h-4" />
              Smart Match Math Model
            </button>
          </div>

          {(activeTab === 'mysql' || activeTab === 'php') && (
            <button
              onClick={() => copyCode(activeTab === 'mysql' ? mysqlSchemaCode : phpBackendCode)}
              className="flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-[#4169E1] px-2.5 py-1 rounded bg-white border border-slate-200 shadow-2xs transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'mysql' && (
            <div>
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-center justify-between">
                <div>
                  <strong>Relational Database:</strong> <code className="font-mono font-semibold">findback_campus_db</code> with foreign key constraints, indexes, and full support for <code className="font-mono">users</code>, <code className="font-mono">items</code>, <code className="font-mono">recovery_requests</code>, <code className="font-mono">notifications</code>, and <code className="font-mono">categories</code>.
                </div>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{mysqlSchemaCode}</code>
              </pre>
            </div>
          )}

          {activeTab === 'php' && (
            <div>
              <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                <strong>Unit 4 &amp; 5 Server-Side Implementation:</strong> Demonstrates PDO prepared statements to eliminate SQL injection, secure HTTPOnly session handling for Student/Faculty/Admin authentication, MIME-type validated file uploads, and CRUD endpoints.
              </div>
              <pre className="bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{phpBackendCode}</code>
              </pre>
            </div>
          )}

          {activeTab === 'units' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Unit 2: Web Designing (HTML5 &amp; CSS3)
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc">
                  <li><strong>HTML5 Forms &amp; Inputs:</strong> <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">type="text"</code>, <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">type="email"</code>, <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">type="tel"</code>, <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">type="date"</code>, <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">type="file"</code>, <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">type="password"</code>, radio groups, and select dropdowns.</li>
                  <li><strong>CSS3 Box Model &amp; Responsive Layouts:</strong> Flexbox, multi-column CSS grids, responsive breakpoints for mobile, tablet, and desktop viewports.</li>
                  <li><strong>Borders &amp; Shadows:</strong> Rounded cards with clean contrast, subtle hover elevations, accessible color palette.</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Unit 3: Client-Side Processing (JavaScript &amp; DOM)
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc">
                  <li><strong>Regular Expressions:</strong> RFC 5322 email regex (<code className="font-mono bg-slate-200 px-1 py-0.5 rounded">EMAIL_REGEX</code>), Indian 10-digit mobile number format (<code className="font-mono bg-slate-200 px-1 py-0.5 rounded">PHONE_REGEX</code>), and College ID pattern (<code className="font-mono bg-slate-200 px-1 py-0.5 rounded">COLLEGE_ID_REGEX</code>).</li>
                  <li><strong>Interactive Validation:</strong> Inline error messaging without blocking browser alert boxes; dynamic live password strength meter with length, case, number, and special character scoring.</li>
                  <li><strong>Events &amp; State:</strong> Live search filtering, multi-criteria category filtering, image instant preview, dynamic tabs, and modal controls.</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Unit 4: Server-Side Processing (PHP)
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc">
                  <li><strong>Variables, Operators &amp; Loops:</strong> PHP associative arrays for item payloads, loops for rendering table items, condition checks for role verification.</li>
                  <li><strong>File Handling &amp; Uploads:</strong> Secure image file upload handling, MIME-type validation via <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">finfo</code>, randomized filenames to avoid path traversal.</li>
                  <li><strong>Sessions &amp; Cookies:</strong> Session start with HTTPOnly and Secure cookie flags, user state persistence across page navigations.</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Unit 5: Database Connectivity (MySQL &amp; CRUD)
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc">
                  <li><strong>Full CRUD Operations:</strong> Create (Report Lost/Found), Read (Browse &amp; Search), Update (Change status to Recovered / Verified), Delete (Remove inappropriate reports).</li>
                  <li><strong>PDO Prepared Statements:</strong> Parameter binding (<code className="font-mono bg-slate-200 px-1 py-0.5 rounded">:uid</code>, <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">:name</code>) preventing SQL injection attacks.</li>
                  <li><strong>Foreign Key Cascades:</strong> Relational integrity linking users, reports, recovery requests, and alerts.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
                <strong>Transparent Smart Matching Formula:</strong> Weighted scoring model adhering to Section 19 of the specifications.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xl font-bold text-[#4169E1]">40%</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">Item Name Similarity</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Token Jaccard &amp; substring matching</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xl font-bold text-[#4169E1]">20%</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">Category Match</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Exact category classification</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xl font-bold text-[#4169E1]">20%</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">Campus Location</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Building &amp; floor proximity</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xl font-bold text-[#4169E1]">10%</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">Date Proximity</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Days delta (≤1 day: 10pts)</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xl font-bold text-[#4169E1]">10%</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">Description &amp; Color</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Features, brand &amp; colors</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Safety &amp; Privacy Mandate:</span> All matches are labeled <em>"Possible Match – Requires Verification"</em>. Never claims that the algorithm confirms ownership. Confidential identifiers (student phone numbers, private wallet contents) are held in custody until administrative verification.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div>FindBack Campus Lost &amp; Found Platform • Official System Specifications</div>
          <button
            onClick={() => setInspectorOpen(false)}
            className="px-4 py-1.5 bg-[#4169E1] text-white font-semibold rounded-lg hover:bg-[#1E3A8A] transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
