import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Item, 
  User, 
  RecoveryRequest, 
  NotificationItem, 
  Category, 
  ActiveView,
  SmartMatchResult,
  ItemStatus,
  RecoveryStatus
} from '../types';
import { 
  INITIAL_ITEMS, 
  INITIAL_USERS, 
  INITIAL_RECOVERY_REQUESTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CATEGORIES 
} from '../data/sampleData';
import { findMatchesForItem, getAllSmartMatches } from '../utils/matchingAlgorithm';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Navigation & Views
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  selectedItemForRecovery: Item | null;
  setSelectedItemForRecovery: (item: Item | null) => void;
  inspectorOpen: boolean;
  setInspectorOpen: (open: boolean) => void;

  // Authentication & Sessions
  currentUser: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  switchUserRole: (role: 'student' | 'faculty' | 'admin' | 'guest') => void;

  // Data Store
  items: Item[];
  users: User[];
  recoveryRequests: RecoveryRequest[];
  notifications: NotificationItem[];
  categories: Category[];

  // CRUD Actions
  addItem: (itemData: Omit<Item, 'item_id' | 'report_code' | 'created_at' | 'status'> & { status?: ItemStatus }) => Item;
  updateItemStatus: (itemId: string, newStatus: ItemStatus) => void;
  deleteItem: (itemId: string) => void;
  
  // Recovery Requests
  submitRecoveryRequest: (itemId: string, message: string, identifyingDetails: string) => RecoveryRequest;
  updateRecoveryStatus: (requestId: string, newStatus: RecoveryStatus, adminRemarks?: string) => void;
  verifyRecoveryRequest: (requestId: string, newStatus: RecoveryStatus, adminRemarks?: string) => void;

  // Notifications
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  unreadNotificationsCount: number;

  // User Management
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Statistics
  stats: {
    totalReports: number;
    activeLost: number;
    activeFound: number;
    recovered: number;
    totalUsers: number;
    pendingVerification: number;
    recoveryRate: number;
  };

  // Smart Matching
  getMatchesForUserItems: () => SmartMatchResult[];
  allSystemMatches: SmartMatchResult[];

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedReportType: 'all' | 'lost' | 'found';
  setSelectedReportType: (type: 'all' | 'lost' | 'found') => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: 'newest' | 'oldest' | 'name';
  setSortBy: (sort: 'newest' | 'oldest' | 'name') => void;
  clearFilters: () => void;

  // Feedback Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Reset demo
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ITEMS: 'findback_items_v1',
  USERS: 'findback_users_v1',
  RECOVERY: 'findback_recovery_v1',
  NOTIFS: 'findback_notifs_v1',
  CURRENT_USER: 'findback_curr_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or Fallbacks
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) {
        const parsed: Item[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(i => i.item_id));
        const missing = INITIAL_ITEMS.filter(i => !existingIds.has(i.item_id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
      return INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [recoveryRequests, setRecoveryRequests] = useState<RecoveryRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECOVERY);
      return saved ? JSON.parse(saved) : INITIAL_RECOVERY_REQUESTS;
    } catch {
      return INITIAL_RECOVERY_REQUESTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
      // Default to student for instantaneous interactive testability
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemForRecovery, setSelectedItemForRecovery] = useState<Item | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedReportType, setSelectedReportType] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECOVERY, JSON.stringify(recoveryRequests));
  }, [recoveryRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loginUser = (user: User) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! (${user.role.toUpperCase()})`, 'success');
    if (user.role === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.', 'info');
    setCurrentView('home');
  };

  const switchUserRole = (role: 'student' | 'faculty' | 'admin' | 'guest') => {
    if (role === 'guest') {
      setCurrentUser(null);
      setCurrentView('home');
      showToast('Switched to Guest mode', 'info');
      return;
    }
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      showToast(`Switched active user: ${found.name} (${found.role})`, 'info');
      if (role === 'admin') {
        setCurrentView('admin_dashboard');
      } else {
        setCurrentView('dashboard');
      }
    }
  };

  // Add Item with sequential FB-2026-XXXXX generation
  const addItem = (itemData: Omit<Item, 'item_id' | 'report_code' | 'created_at' | 'status'> & { status?: ItemStatus }): Item => {
    const nextNum = 132 + items.length;
    const report_code = `FB-2026-${String(nextNum).padStart(5, '0')}`;
    const item_id = `itm_${Date.now()}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newItem: Item = {
      ...itemData,
      item_id,
      report_code,
      status: itemData.status || 'Pending Verification',
      created_at: now,
    };

    setItems(prev => [newItem, ...prev]);

    // Check for smart matches automatically!
    const matches = findMatchesForItem(newItem, items, 55);
    if (matches.length > 0 && currentUser) {
      const topMatch = matches[0];
      const matchName = newItem.report_type === 'lost' ? topMatch.foundItem.item_name : topMatch.lostItem.item_name;
      
      // Auto generate notification
      const newNotif: NotificationItem = {
        notification_id: `notif_${Date.now()}`,
        user_id: currentUser.user_id,
        title: 'Possible Match Found!',
        message: `High confidence match (${topMatch.overallScore}%) detected for "${newItem.item_name}" with "${matchName}".`,
        item_id: newItem.item_id,
        type: 'match',
        is_read: false,
        created_at: now,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    return newItem;
  };

  const updateItemStatus = (itemId: string, newStatus: ItemStatus) => {
    setItems(prev => prev.map(item => {
      if (item.item_id === itemId) {
        return { ...item, status: newStatus, updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19) };
      }
      return item;
    }));
    showToast(`Report status updated to: ${newStatus}`, 'info');
  };

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.item_id !== itemId));
    showToast('Report deleted successfully.', 'info');
  };

  const submitRecoveryRequest = (itemId: string, message: string, identifyingDetails: string): RecoveryRequest => {
    const req_id = `req_${Date.now()}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newReq: RecoveryRequest = {
      request_id: req_id,
      item_id: itemId,
      requester_id: currentUser ? currentUser.user_id : 'usr_student_1',
      requester_name: currentUser ? currentUser.name : 'Student Requester',
      requester_college_id: currentUser ? currentUser.college_id : 'USER104',
      requester_email: currentUser ? currentUser.email : 'student@college.edu',
      message,
      identifying_details: identifyingDetails,
      status: 'Pending Verification',
      created_at: now,
    };

    setRecoveryRequests(prev => [newReq, ...prev]);
    updateItemStatus(itemId, 'Recovery Requested');

    // Notify user
    if (currentUser) {
      const notif: NotificationItem = {
        notification_id: `notif_${Date.now()}`,
        user_id: currentUser.user_id,
        title: 'Recovery Request Submitted',
        message: `Your claim request for item ${itemId} has been logged and forwarded to campus administrators.`,
        item_id: itemId,
        type: 'recovery',
        is_read: false,
        created_at: now,
      };
      setNotifications(prev => [notif, ...prev]);
    }

    return newReq;
  };

  const updateRecoveryStatus = (requestId: string, newStatus: RecoveryStatus, adminRemarks?: string) => {
    setRecoveryRequests(prev => prev.map(req => {
      if (req.request_id === requestId) {
        // If approved or recovered, also update the item status
        if (newStatus === 'Recovered') {
          updateItemStatus(req.item_id, 'Recovered');
        } else if (newStatus === 'Approved') {
          updateItemStatus(req.item_id, 'Recovery Requested');
        }
        return { ...req, status: newStatus, admin_remarks: adminRemarks || req.admin_remarks };
      }
      return req;
    }));
    showToast(`Recovery request #${requestId.slice(-4)} marked as: ${newStatus}`, 'success');
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.notification_id === notifId ? { ...n, is_read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared', 'info');
  };

  const verifyRecoveryRequest = (requestId: string, newStatus: RecoveryStatus, adminRemarks?: string) => {
    updateRecoveryStatus(requestId, newStatus, adminRemarks);
  };

  const stats = {
    totalReports: items.length,
    activeLost: items.filter(i => i.report_type === 'lost' && i.status !== 'Recovered' && i.status !== 'Closed').length,
    activeFound: items.filter(i => i.report_type === 'found' && i.status !== 'Recovered' && i.status !== 'Closed').length,
    recovered: items.filter(i => i.status === 'Recovered').length,
    totalUsers: users.length,
    pendingVerification: items.filter(i => i.status === 'Pending Verification' || i.status === 'Recovery Requested').length,
    recoveryRate: items.length > 0 ? Math.round((items.filter(i => i.status === 'Recovered').length / items.length) * 100) : 0,
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.user_id === userId) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: newStatus };
      }
      return u;
    }));
    showToast('User account status toggled', 'info');
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.user_id !== userId));
    showToast('User removed from college registry', 'info');
  };

  const getMatchesForUserItems = (): SmartMatchResult[] => {
    if (!currentUser) return [];
    const userLostItems = items.filter(i => i.user_id === currentUser.user_id && i.report_type === 'lost');
    const allMatches: SmartMatchResult[] = [];
    
    for (const lost of userLostItems) {
      const matches = findMatchesForItem(lost, items, 45);
      allMatches.push(...matches);
    }
    return allMatches.sort((a, b) => b.overallScore - a.overallScore);
  };

  const allSystemMatches = getAllSmartMatches(items, 40);

  const unreadNotificationsCount = notifications.filter(n => !n.is_read && (currentUser ? n.user_id === currentUser.user_id : true)).length;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedReportType('all');
    setSelectedLocation('All');
    setSelectedStatus('All');
    setSortBy('newest');
  };

  const resetToSampleData = () => {
    setItems(INITIAL_ITEMS);
    setUsers(INITIAL_USERS);
    setRecoveryRequests(INITIAL_RECOVERY_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
    showToast('Database reset to fresh campus sample data!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedItemId,
        setSelectedItemId,
        selectedItemForRecovery,
        setSelectedItemForRecovery,
        inspectorOpen,
        setInspectorOpen,
        currentUser,
        loginUser,
        logoutUser,
        switchUserRole,
        items,
        users,
        recoveryRequests,
        notifications,
        categories: INITIAL_CATEGORIES,
        addItem,
        updateItemStatus,
        deleteItem,
        submitRecoveryRequest,
        updateRecoveryStatus,
        verifyRecoveryRequest,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        unreadNotificationsCount,
        toggleUserStatus,
        deleteUser,
        stats,
        getMatchesForUserItems,
        allSystemMatches,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedReportType,
        setSelectedReportType,
        selectedLocation,
        setSelectedLocation,
        selectedStatus,
        setSelectedStatus,
        sortBy,
        setSortBy,
        clearFilters,
        toasts,
        showToast,
        removeToast,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
