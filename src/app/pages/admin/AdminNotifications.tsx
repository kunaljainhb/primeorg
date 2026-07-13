import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Bell, Check, Trash2, AlertTriangle, Info, Calendar } from 'lucide-react';
import { useTranslation } from '@/app/context/LanguageContext';

export default function AdminNotifications() {
  const { t } = useTranslation();
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: t('New Registration'),
      message: t("New vendor registration proposal submitted by Gulf Construction Services. Action required: Verify trade license and bank certificate."),
      time: '1h ago',
      date: '2026-06-11',
      unread: true,
      type: 'warning'
    },
    {
      id: 2,
      title: t('Verification Alert'),
      message: t("Document correction pending verification for TechSolutions LLC. Review updated PDF deployment guide."),
      time: '4h ago',
      date: '2026-06-11',
      unread: true,
      type: 'info'
    },
    {
      id: 3,
      title: t('Tender Submission'),
      message: t("Modern Office Furnishings has submitted a new commercial and technical proposal for RFP TEND-004."),
      time: '2d ago',
      date: '2026-06-09',
      unread: false,
      type: 'success'
    },
    {
      id: 4,
      title: t('System Warning'),
      message: t("Document expiration scanner completed. 5 active suppliers have documents expiring within 30 days. Automated emails sent."),
      time: '3d ago',
      date: '2026-06-08',
      unread: false,
      type: 'danger'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <Check className="h-5 w-5 text-emerald-500" />;
      case 'danger':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string, unread: boolean) => {
    if (!unread) return 'bg-white';
    switch (type) {
      case 'warning':
        return 'bg-amber-50/40 border-l-4 border-l-amber-500 rtl:border-l-0 rtl:border-r-4 rtl:border-r-amber-500';
      case 'success':
        return 'bg-emerald-50/40 border-l-4 border-l-emerald-500 rtl:border-l-0 rtl:border-r-4 rtl:border-r-emerald-500';
      case 'danger':
        return 'bg-red-50/40 border-l-4 border-l-red-500 rtl:border-l-0 rtl:border-r-4 rtl:border-r-red-500';
      default:
        return 'bg-blue-50/40 border-l-4 border-l-blue-500 rtl:border-l-0 rtl:border-r-4 rtl:border-r-blue-500';
    }
  };

  return (
    <div className="space-y-6 text-start max-w-4xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="h-7 w-7 text-[var(--prime-primary-green)]" />
            {t('Notifications')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t('Procurement Alerts and System Event Notifications')}</p>
        </div>
        {notifications.some(n => n.unread) && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllRead}
            className="text-xs font-semibold cursor-pointer"
          >
            {t('Mark all as read')}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-gray-100 pb-1">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
          className={`text-xs font-semibold rounded-full px-4 cursor-pointer ${filter === 'all' ? 'bg-[var(--prime-primary-green)] text-white hover:bg-[var(--prime-primary-green)]/90' : 'text-gray-550'}`}
        >
          {t('All')} ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('unread')}
          className={`text-xs font-semibold rounded-full px-4 cursor-pointer ${filter === 'unread' ? 'bg-[var(--prime-primary-green)] text-white hover:bg-[var(--prime-primary-green)]/90' : 'text-gray-550'}`}
        >
          {t('Unread')} ({notifications.filter(n => n.unread).length})
        </Button>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map(n => (
          <Card 
            key={n.id} 
            className={`transition-all duration-200 border border-gray-150/70 shadow-2xs hover:shadow-xs rounded-xl ${getBgColor(n.type, n.unread)}`}
          >
            <CardContent className="p-4 sm:p-5 flex gap-4">
              <div className="p-2 rounded-full bg-white border border-gray-100 shadow-3xs shrink-0 self-start">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-semibold shrink-0 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {n.time}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-650 font-normal leading-relaxed text-start">
                  {n.message}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  {n.unread && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[11px] h-7 px-2.5 font-bold text-[var(--prime-primary-green)] hover:bg-[var(--prime-primary-green)]/5 cursor-pointer rounded-md"
                    >
                      {t('Mark as read')}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(n.id)}
                    className="text-[11px] h-7 px-2.5 font-bold text-red-650 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-md flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t('Delete')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-semibold">{t('No notifications found')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
