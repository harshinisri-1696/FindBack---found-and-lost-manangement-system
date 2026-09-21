import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Trash2, 
  CheckCircle2,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { NotificationItem } from '../../types';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearAllNotifications, 
    setSelectedItemId,
    setCurrentView 
  } = useApp();

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'recovery':
        return <FileCheck className="w-5 h-5 text-[#4169E1]" />;
      case 'verification':
      case 'status_change':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'system':
      case 'general':
      default:
        return <MapPin className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.notification_id);
    const targetId = notif.link_item_id || notif.item_id;
    if (targetId) {
      setSelectedItemId(targetId);
    } else if (notif.type === 'match') {
      setCurrentView('smart_match');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#4169E1] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Campus Notifications &amp; Alerts
            </h1>
            <p className="text-xs text-slate-500">
              Real-time updates regarding your reports, match alerts, and administrator approvals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#4169E1] hover:bg-blue-50 border border-blue-200 flex items-center gap-1.5 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear list</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">You're completely up to date!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active notification alerts or pending verifications at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.notification_id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-2xl border transition flex items-start gap-4 cursor-pointer relative ${
                !notif.is_read
                  ? 'bg-blue-50/40 border-blue-200 shadow-2xs hover:bg-blue-50/80'
                  : 'bg-white border-slate-200 hover:bg-slate-50/80'
              }`}
            >
              {/* Unread indicator dot */}
              {!notif.is_read && (
                <span className="w-2 h-2 rounded-full bg-[#4169E1] absolute top-4 right-4 animate-pulse"></span>
              )}

              {/* Type icon */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs shrink-0">
                {getIcon(notif.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs font-bold truncate ${!notif.is_read ? 'text-[#1E3A8A]' : 'text-slate-900'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {notif.created_at}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pr-4">
                  {notif.message}
                </p>

                {(notif.link_item_id || notif.item_id) && (
                  <div className="pt-1">
                    <span className="inline-block text-[11px] font-semibold text-[#4169E1] hover:underline">
                      View Referenced Item →
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
