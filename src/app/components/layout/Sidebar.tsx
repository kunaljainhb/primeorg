import { Link, useLocation } from '@/app/context/RouterContext';
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
  { name: 'User & Roles', href: '/admin/users', icon: Shield },
  { name: 'Master Data', href: '/admin/master-data', icon: Database },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'System Config', href: '/admin/config', icon: Settings },
];

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const navItems = role === 'vendor' ? vendorNavItems : adminNavItems;

  return (
    <aside 
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-white shadow-sm"
      style={{ borderColor: 'var(--fnrc-border-gray)' }}
    >
      <nav className="flex h-full flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                isActive
                  ? 'font-medium text-white'
                  : 'hover:bg-gray-50'
              )}
              style={
                isActive
                  ? { backgroundColor: 'var(--fnrc-primary-green)' }
                  : { color: 'var(--fnrc-text-dark)' }
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}