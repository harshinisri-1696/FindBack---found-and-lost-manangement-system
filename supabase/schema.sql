-- ==============================================================================
-- FindBack: Smart Campus Lost & Found Management System
-- Supabase PostgreSQL Database Schema & Migration Script
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS (Profiles linked to Supabase Auth or campus ID)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  college_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')) DEFAULT 'student',
  status TEXT NOT NULL CHECK (status IN ('active', 'suspended')) DEFAULT 'active',
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  category_id TEXT PRIMARY KEY,
  category_name TEXT UNIQUE NOT NULL,
  icon_name TEXT DEFAULT 'Package',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. ITEMS (Lost & Found reports)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.items (
  item_id TEXT PRIMARY KEY,
  report_code TEXT UNIQUE NOT NULL,
  user_id TEXT REFERENCES public.users(user_id) ON DELETE SET NULL,
  reporter_name TEXT,
  reporter_role TEXT CHECK (reporter_role IN ('student', 'faculty', 'admin')) DEFAULT 'student',
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('lost', 'found')),
  location TEXT NOT NULL,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  color TEXT DEFAULT 'Unspecified',
  brand TEXT DEFAULT 'Unspecified',
  identifying_features TEXT,
  image TEXT,
  current_custody TEXT,
  additional_info TEXT,
  status TEXT NOT NULL CHECK (
    status IN (
      'Pending Verification',
      'Active',
      'Possible Match',
      'Recovery Requested',
      'Recovered',
      'Closed'
    )
  ) DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for searching and filtering performance
CREATE INDEX IF NOT EXISTS idx_items_report_type ON public.items(report_type);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_location ON public.items(location);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);

-- ------------------------------------------------------------------------------
-- 4. RECOVERY REQUESTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recovery_requests (
  request_id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES public.items(item_id) ON DELETE CASCADE,
  requester_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_college_id TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  message TEXT NOT NULL,
  identifying_details TEXT NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN (
      'Pending Verification',
      'Under Verification',
      'Approved',
      'Rejected',
      'Recovered'
    )
  ) DEFAULT 'Pending Verification',
  admin_remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recovery_item ON public.recovery_requests(item_id);
CREATE INDEX IF NOT EXISTS idx_recovery_requester ON public.recovery_requests(requester_id);

-- ------------------------------------------------------------------------------
-- 5. NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  notification_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  item_id TEXT REFERENCES public.items(item_id) ON DELETE SET NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- ------------------------------------------------------------------------------
-- 6. SUPABASE STORAGE BUCKET FOR ITEM IMAGES
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Anyone can view images publicly
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Access to Item Images'
  ) THEN
    CREATE POLICY "Public Access to Item Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'item-images');
  END IF;
END $$;

-- Storage RLS: Authenticated users can upload item images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated Upload Item Images'
  ) THEN
    CREATE POLICY "Authenticated Upload Item Images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'item-images');
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Categories: Read-only for all
CREATE POLICY "Categories are readable by everyone"
  ON public.categories FOR SELECT
  USING (true);

-- Items: Readable by everyone (public campus lost & found)
CREATE POLICY "Items are readable by everyone"
  ON public.items FOR SELECT
  USING (true);

-- Items: Insertable by anyone or authenticated users
CREATE POLICY "Items can be inserted by registered users"
  ON public.items FOR INSERT
  WITH CHECK (true);

-- Items: Modifiable by owner or admin
CREATE POLICY "Items can be updated by owner or admin"
  ON public.items FOR UPDATE
  USING (true);

-- Users: Readable by users and admins
CREATE POLICY "Users profiles are viewable"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert/update their profile"
  ON public.users FOR ALL
  USING (true);

-- Recovery Requests: Viewable by requester or admin
CREATE POLICY "Recovery requests are viewable"
  ON public.recovery_requests FOR SELECT
  USING (true);

CREATE POLICY "Recovery requests can be inserted"
  ON public.recovery_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Recovery requests can be updated by admin"
  ON public.recovery_requests FOR UPDATE
  USING (true);

-- Notifications: Viewable by recipient
CREATE POLICY "Notifications are viewable by owner"
  ON public.notifications FOR SELECT
  USING (true);

CREATE POLICY "Notifications can be updated by owner"
  ON public.notifications FOR UPDATE
  USING (true);

-- ------------------------------------------------------------------------------
-- 8. INITIAL SEED DATA
-- ------------------------------------------------------------------------------

-- Categories
INSERT INTO public.categories (category_id, category_name, icon_name)
VALUES
  ('cat_electronics', 'Electronics', 'Laptop'),
  ('cat_id_cards', 'ID Cards', 'CreditCard'),
  ('cat_accessories', 'Accessories', 'Watch'),
  ('cat_books', 'Books', 'BookOpen'),
  ('cat_keys', 'Keys', 'Key'),
  ('cat_wallets', 'Wallets & Bags', 'Briefcase'),
  ('cat_stationery', 'Stationery', 'PenTool'),
  ('cat_sports', 'Sports Equipment', 'Trophy'),
  ('cat_personal', 'Personal Items', 'Tag')
ON CONFLICT (category_id) DO NOTHING;

-- Users
INSERT INTO public.users (user_id, name, college_id, email, phone, role, status, department)
VALUES
  ('usr_student_1', 'Rohan Sharma', 'USER104', 'rohan.sharma@college.edu', '9876543210', 'student', 'active', 'Information Technology'),
  ('usr_faculty_1', 'Dr. Ananya Iyer', 'FAC201', 'ananya.iyer@college.edu', '9812345678', 'faculty', 'active', 'Computer Science & Engineering'),
  ('usr_admin_1', 'Prof. K. Sundaram', 'ADM001', 'admin.lostfound@college.edu', '9444123456', 'admin', 'active', 'Office of Student Affairs'),
  ('usr_student_2', 'Priya Venkatesh', '24CS045', 'priya.v@college.edu', '9765432189', 'student', 'active', 'Computer Science & Engineering')
ON CONFLICT (user_id) DO NOTHING;

-- Items
INSERT INTO public.items (
  item_id, report_code, user_id, reporter_name, reporter_role, item_name,
  category, description, report_type, location, report_date, color, brand,
  identifying_features, image, current_custody, status, additional_info
)
VALUES
  (
    'itm_001', 'FB-2026-00124', 'usr_student_2', 'Priya Venkatesh', 'student',
    'Black Samsung Earbuds', 'Electronics',
    'Found a black Samsung Galaxy Buds FE case containing both earbuds left on table 14, 2nd floor reading hall.',
    'found', 'Central Library', '2026-09-16', 'Black', 'Samsung',
    'Charging case has a tiny blue silicon ring attached to the charging port loop.',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    'Central Library Helpdesk Counter (Staff In-charge Mr. Ramesh)',
    'Possible Match', 'Finder handed it over to the librarian immediately upon finding.'
  ),
  (
    'itm_002', 'FB-2026-00125', 'usr_student_1', 'Rohan Sharma', 'student',
    'Samsung Black Earbuds', 'Electronics',
    'Misplaced my Samsung Galaxy Buds charging case and buds while studying for mid-term exams in the library reading room.',
    'lost', 'Central Library', '2026-09-16', 'Black', 'Samsung',
    'Serial ending in 884B with small blue rubber strap attached.',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80',
    NULL, 'Possible Match', 'Reward offered or can identify Bluetooth pairing name "Rohan Buds".'
  ),
  (
    'itm_003', 'FB-2026-00126', 'usr_student_1', 'Rohan Sharma', 'student',
    'Blue Student ID Card', 'ID Cards',
    'Lost my college student identity card with blue neck lanyard during lab hours.',
    'lost', 'CSE Block', '2026-09-17', 'Blue', 'College Admin',
    'Student ID card USER104, IT Department lanyard with metal clip.',
    'https://images.unsplash.com/photo-1589330694653-dad6bc0140fa?auto=format&fit=crop&w=600&q=80',
    NULL, 'Active', 'Need it urgently for college library entry and bus pass.'
  ),
  (
    'itm_004', 'FB-2026-00127', 'usr_faculty_1', 'Dr. Ananya Iyer', 'faculty',
    'Black Leather Wallet', 'Accessories',
    'Found a men''s black folding leather wallet left on the corner table in the faculty dining section.',
    'found', 'College Canteen', '2026-09-18', 'Black', 'WildHorn',
    'Contains some currency notes, a metro smartcard, and an emergency blood donor slip.',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    'Campus Security Main Gate Office', 'Active', 'Owner can claim after verifying ID and exact contents inside.'
  ),
  (
    'itm_005', 'FB-2026-00128', 'usr_student_2', 'Priya Venkatesh', 'student',
    'Brown Spiral Notebook', 'Books',
    'Classmate lost handwritten Operating Systems and Data Structures lecture notes in a brown spiral notebook.',
    'lost', 'Seminar Hall A', '2026-09-15', 'Brown', 'Classmate',
    'Name sticker on front cover with yellow highlighter marks on page 12.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    NULL, 'Pending Verification', NULL
  ),
  (
    'itm_006', 'FB-2026-00129', 'usr_admin_1', 'Prof. K. Sundaram', 'admin',
    'Blue Stainless Steel Water Bottle', 'Personal Items',
    'Found an insulated metallic blue 750ml water bottle left near the basketball spectator bleachers.',
    'found', 'Sports Ground & Pavilion', '2026-09-19', 'Blue', 'Milton',
    'Scratch on the base cap and has a "Code & Chill" sticker.',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    'Physical Education / Sports Dept Room 102', 'Active', NULL
  ),
  (
    'itm_007', 'FB-2026-00130', 'usr_student_1', 'Rohan Sharma', 'student',
    'Casio Scientific Calculator fx-991EX', 'Electronics',
    'Forgot calculator inside the exam hall desk drawer after the mathematics internal assessment.',
    'lost', 'Seminar Hall B', '2026-09-14', 'Black', 'Casio',
    'Name etched with pen on the battery lid cover.',
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    NULL, 'Recovered', NULL
  ),
  (
    'itm_008', 'FB-2026-00131', 'usr_student_2', 'Priya Venkatesh', 'student',
    'Silver Two-Wheeler Key with Honda Fob', 'Keys',
    'Found a bike key on a red fabric ribbon keychain near the canteen bicycle parking stand.',
    'found', 'College Canteen', '2026-09-19', 'Silver', 'Honda',
    'Red ribbon marked "Remove Before Flight".',
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    'Canteen Cashier Counter', 'Recovery Requested', NULL
  ),
  (
    'itm_009', 'FB-2026-00132', 'usr_student_1', 'Rohan Sharma', 'student',
    'Apple AirPods Pro', 'Electronics',
    'Misplaced my white Apple AirPods Pro with MagSafe charging case in CSE Computer Lab 3.',
    'lost', 'CSE Block', '2026-09-18', 'White', 'Apple',
    'Matte grey silicone protective sleeve with silver carabiner clip.',
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    NULL, 'Possible Match', 'Bluetooth device broadcast name is "Rohan AirPods Pro".'
  ),
  (
    'itm_010', 'FB-2026-00133', 'usr_student_2', 'Priya Venkatesh', 'student',
    'Apple AirPods Pro', 'Electronics',
    'Found white Apple AirPods Pro case with earbuds beside workstation #14 in CSE Lab 3.',
    'found', 'CSE Block', '2026-09-18', 'White', 'Apple',
    'Housed in a grey silicone cover with a small metal ring clip.',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=600&q=80',
    'CSE Department Lab 3 Assistant Desk', 'Possible Match', NULL
  ),
  (
    'itm_011', 'FB-2026-00134', 'usr_faculty_1', 'Dr. Ananya Iyer', 'faculty',
    'Dell 65W Laptop Charger', 'Electronics',
    'Left my black Dell 65W USB Type-C laptop power adapter plugged in Seminar Hall A after the keynote lecture.',
    'lost', 'Seminar Hall A', '2026-09-17', 'Black', 'Dell',
    'Has red electrical tape wrapped around the USB-C connector collar.',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    NULL, 'Possible Match', NULL
  ),
  (
    'itm_012', 'FB-2026-00135', 'usr_student_2', 'Priya Venkatesh', 'student',
    'Dell 65W Laptop Charger', 'Electronics',
    'Found a Dell 65W black Type-C laptop power brick left on the podium electrical outlet in Seminar Hall A.',
    'found', 'Seminar Hall A', '2026-09-17', 'Black', 'Dell',
    'Black cable tie with small red tape marker near the charging head.',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    'Audiovisual & Seminar Hall Management Office', 'Possible Match', NULL
  )
ON CONFLICT (item_id) DO NOTHING;

-- Recovery Requests
INSERT INTO public.recovery_requests (
  request_id, item_id, requester_id, requester_name, requester_college_id, requester_email,
  message, identifying_details, status, admin_remarks
)
VALUES
  (
    'req_001', 'itm_008', 'usr_student_1', 'Rohan Sharma', 'USER104', 'rohan.sharma@college.edu',
    'I dropped my Honda Activa key near the canteen tree while taking my scooter out at 10 AM.',
    'The fob has a small red ribbon saying "Remove Before Flight" and the key has code letter "H" stamped.',
    'Under Verification', 'Cross-checking with canteen CCTV footage and student bike registration number.'
  )
ON CONFLICT (request_id) DO NOTHING;

-- Notifications
INSERT INTO public.notifications (notification_id, user_id, title, message, type, item_id, is_read)
VALUES
  ('notif_001', 'usr_student_1', 'Smart Match Discovered', 'A found Black Samsung Earbuds report at Central Library matches your lost report with 98% confidence.', 'match', 'itm_001', false),
  ('notif_002', 'usr_student_1', 'AirPods Pro Possible Match', 'A found Apple AirPods Pro turned in at CSE Lab 3 matches your reported item with 94% confidence.', 'match', 'itm_010', false),
  ('notif_003', 'usr_student_1', 'Recovery Status Updated', 'Your recovery claim for item FB-2026-00131 is currently under administrative verification.', 'recovery', 'itm_008', true)
ON CONFLICT (notification_id) DO NOTHING;
