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
  BarChart3
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface SidebarProps {
  role: 'vendor' | 'admin';
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const vendorNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'RFPs', href: '/vendor/rfps', icon: FileText },
  { name: 'My Proposals', href: '/vendor/proposals', icon: Send },
  { name: 'Profile', href: '/vendor/profile', icon: User },
];

const adminNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Vendor Management', href: '/admin/vendors', icon: Users },
  { name: 'RFP Management', href: '/admin/rfps', icon: FileText },
  { name: 'Item Management', href: '/admin/items', icon: ClipboardList },
  { name: 'User & Roles', href: '/admin/users', icon: Shield },
  { name: 'Master Data', href: '/admin/master-data', icon: Database },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'System Config', href: '/admin/config', icon: Settings },
];

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const navItems = role === 'vendor' ? vendorNavItems : adminNavItems;
  const { collapsed } = useSidebar();

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-72'} fixed left-0 top-14 h-[calc(100vh-3.5rem)] border-r shadow-sm overflow-hidden`}
      style={{
        backgroundColor: 'var(--fnrc-secondary-dark-green)',
        borderColor: 'var(--fnrc-secondary-dark-green)',
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
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center rounded-button transition-all duration-150 relative overflow-hidden',
                collapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3',
                isActive
                  ? 'font-semibold text-white shadow-md shadow-black/15'
                  : 'text-white/70 hover:bg-white/8 hover:text-white'
              )}
              style={
                isActive
                  ? { backgroundColor: 'var(--fnrc-accent-gold)' }
                  : {}
              }
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1.25 bg-white rounded-r-full" />
              )}
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-150", isActive ? "scale-105" : "group-hover:scale-105")} strokeWidth={isActive ? 2 : 1.5} />
              {!collapsed && <span className="tracking-wide text-[14px] whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}