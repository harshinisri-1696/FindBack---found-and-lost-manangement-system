export type UserRole = 'student' | 'faculty' | 'admin';

export type ReportType = 'lost' | 'found';

export type ItemStatus = 
  | 'Pending Verification' 
  | 'Active' 
  | 'Possible Match' 
  | 'Recovery Requested' 
  | 'Recovered' 
  | 'Closed';

export type RecoveryStatus = 
  | 'Pending Verification' 
  | 'Under Verification' 
  | 'Approved' 
  | 'Rejected' 
  | 'Recovered';

export interface User {
  user_id: string;
  name: string;
  college_id: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'suspended';
  created_at: string;
  department?: string;
}

export interface Item {
  item_id: string;
  report_code: string; // e.g. FB-2026-00124
  user_id: string;
  reporter_name?: string;
  reporter_role?: UserRole;
  item_name: string;
  category: string;
  description: string;
  report_type: ReportType;
  location: string;
  report_date: string;
  color: string;
  brand: string;
  identifying_features: string;
  image: string;
  current_custody?: string; // where item is kept if found (e.g. Library Desk, Security)
  additional_info?: string;
  status: ItemStatus;
  created_at: string;
  updated_at?: string;
}

export interface RecoveryRequest {
  request_id: string;
  item_id: string;
  requester_id: string;
  requester_name: string;
  requester_college_id: string;
  requester_email: string;
  message: string;
  identifying_details: string;
  status: RecoveryStatus;
  created_at: string;
  request_date?: string;
  admin_remarks?: string;
}

export interface NotificationItem {
  notification_id: string;
  user_id: string;
  title: string;
  message: string;
  item_id?: string;
  link_item_id?: string;
  type: 'match' | 'status_change' | 'recovery' | 'system' | 'verification' | 'general';
  is_read: boolean;
  created_at: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  icon_name: string;
  count?: number;
}

export interface SmartMatchFactor {
  name: string;
  weight: number;
  score: number;
  matched: boolean;
  details: string;
}

export interface SmartMatchResult {
  lostItem: Item;
  foundItem: Item;
  overallScore: number;
  factors: SmartMatchFactor[];
}

export type ActiveView = 
  | 'home' 
  | 'browse' 
  | 'report_lost' 
  | 'report_found' 
  | 'smart_match' 
  | 'login' 
  | 'admin_login'
  | 'register' 
  | 'dashboard' 
  | 'my_reports' 
  | 'recovery_requests' 
  | 'notifications' 
  | 'profile' 
  | 'admin'
  | 'admin_dashboard' 
  | 'admin_reports' 
  | 'admin_users' 
  | 'admin_recovery';
