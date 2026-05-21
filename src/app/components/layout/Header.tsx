import { Link, useNavigate } from '@/app/context/RouterContext';
import { Building2, LogOut, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

interface HeaderProps {
  role: 'vendor' | 'admin' | 'public';
  userName?: string;
}

export function Header({ role, userName }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-sm relative" style={{ backgroundColor: 'var(--fnrc-bg-light)', borderColor: 'var(--fnrc-border-gray)' }}>
      {/* FNRC Pattern Strip at the top */}
      <div className="absolute top-0 w-full h-1" style={{ backgroundImage: 'linear-gradient(to right, var(--fnrc-primary-green), var(--fnrc-accent-gold), var(--fnrc-royal-blue))' }} />

      <div className="flex h-16 items-center justify-between px-6 pt-1">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center transition-transform group-hover:scale-105">
            <img src="/fnrc-logo.png" alt="FNRC Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-wide" style={{ color: 'var(--fnrc-secondary-dark-green)' }}>
              FNRC
            </div>
            <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--fnrc-primary-green)' }}>
              {role === 'admin' ? 'Admin Portal' : 'Vendor Portal'}
            </div>
          </div>
        </Link>

        {/* Right side - User menu */}
        <div className="flex items-center gap-6">
          {role !== 'public' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900" style={{ color: 'var(--fnrc-text-muted)' }}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px]">EN</span>
                  English
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">English</DropdownMenuItem>
                <DropdownMenuItem className="font-medium">العربية (Arabic)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {role === 'public' ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/vendor/login')}
                style={{ borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
              >
                Vendor Login
              </Button>
              <Button
                onClick={() => navigate('/admin/login')}
                style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                className="text-white hover:opacity-90"
              >
                Admin Login
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 hover:text-gray-900 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--fnrc-primary-green)' }}>
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span style={{ color: 'var(--fnrc-text-dark)' }}>{userName || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}