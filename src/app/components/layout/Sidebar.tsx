import { useState } from 'react';
import { Link, useLocation } from '@/app/context/RouterContext';
import { useSidebar } from '@/app/context/SidebarContext';
import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  User, 
  Users, 
  Settings,
  ClipboardList,
  FolderOpen,
  Shield,
  Database,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface SidebarProps {
  role: 'vendor' | 'admin';
}

interface SubNavItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: SubNavItem[];
}

const vendorNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'Tenders', href: '/vendor/tenders', icon: FileText },
  { name: 'My Proposals', href: '/vendor/proposals', icon: Send },
  { name: 'My Projects', href: '/vendor/projects', icon: FolderOpen },
  { name: 'Profile', href: '/vendor/profile', icon: User },
];

const adminNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Vendor Management', href: '/admin/vendors', icon: Users },
  { name: 'Tender Management', href: '/admin/tenders', icon: FileText },
  { name: 'Item Management', href: '/admin/items', icon: ClipboardList },
  { name: 'User & Roles', href: '/admin/users', icon: Shield },
  { 
    name: 'Master Data', 
    href: '/admin/master-data', 
    icon: Database,
    subItems: [
      { name: 'Service Category', href: '/admin/master-data/service-category' },
      { name: 'Document Type', href: '/admin/master-data/document-type' },
      { name: 'Declaration Context', href: '/admin/master-data/declaration-context' },
      { name: 'Vendor Rating Question', href: '/admin/master-data/vendor-rating-question' },
    ]
  },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'System Config', href: '/admin/config', icon: Settings },
];

import { useTranslation } from '@/app/context/LanguageContext';

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const navItems = role === 'vendor' ? vendorNavItems : adminNavItems;
  const { collapsed } = useSidebar();
  const { t, language } = useTranslation();

  // Track expanded menu items. Default Master Data to always expanded (true)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'Master Data': true
  });

  const toggleExpand = (name: string) => {
    if (name === 'Master Data') return;
    setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-72'} fixed start-0 top-14 h-[calc(100vh-3.5rem)] border-e shadow-sm overflow-hidden`}
      style={{
        backgroundColor: 'var(--prime-secondary-dark-green)',
        borderColor: 'var(--prime-secondary-dark-green)',
        transition: 'width 0.2s ease',
      }}
    >
      {/* Subtle contour pattern background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
      <nav className={cn("flex h-full flex-col gap-1.5 relative z-10", collapsed ? "p-2" : "p-4")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = !!item.subItems;
          const isExpanded = !!expandedItems[item.name];
          const isSubActive = hasSubItems && item.subItems?.some(sub => location.pathname === sub.href);
          const isActive = location.pathname === item.href || isSubActive;

          const handleClick = (e: React.MouseEvent) => {
            if (hasSubItems) {
              e.preventDefault();
              if (item.name !== 'Master Data') {
                toggleExpand(item.name);
              }
            }
          };

          return (
            <div key={item.name} className="flex flex-col">
              <Link
                to={item.href}
                onClick={handleClick}
                className={cn(
                  'flex items-center rounded-button transition-all duration-150 relative overflow-hidden',
                  collapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3',
                  isActive
                    ? 'font-semibold text-white shadow-md shadow-black/15'
                    : 'text-white/70 hover:bg-white/8 hover:text-white'
                )}
                style={
                  isActive
                    ? { backgroundColor: 'var(--prime-accent-gold)' }
                    : {}
                }
              >
                {isActive && (
                  <div className="absolute start-0 top-2 bottom-2 w-1.25 bg-white rounded-e-full" />
                )}
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-150", isActive ? "scale-105" : "group-hover:scale-105")} strokeWidth={isActive ? 2 : 1.5} />
                {!collapsed && <span className="tracking-wide text-[14px] whitespace-nowrap flex-grow">{t(item.name)}</span>}
                {!collapsed && hasSubItems && item.name !== 'Master Data' && (
                  isExpanded ? <ChevronUp className="h-4 w-4 opacity-70" /> : <ChevronDown className="h-4 w-4 opacity-70" />
                )}
              </Link>
              
              {!collapsed && hasSubItems && isExpanded && (
                <div className="flex flex-col gap-1 mt-1 ps-6 border-s border-white/10 ms-6">
                  {item.subItems?.map((sub) => {
                    const isSubItemActive = location.pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        to={sub.href}
                        className={cn(
                          'flex items-center px-4 py-2 text-xs font-semibold rounded-button transition-all duration-150 relative overflow-hidden',
                          isSubItemActive
                            ? 'text-white font-bold'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        )}
                        style={
                          isSubItemActive
                            ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                            : {}
                        }
                      >
                        {isSubItemActive && (
                          <div className="absolute start-0 top-1.5 bottom-1.5 w-1 bg-white rounded-e-full" />
                        )}
                        <span className="tracking-wide">{t(sub.name)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}