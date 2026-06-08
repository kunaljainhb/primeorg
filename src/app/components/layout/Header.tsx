import { Link, useNavigate } from '@/app/context/RouterContext';
import { Building2, LogOut, User, Bell, Settings, Menu } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useSidebar } from '@/app/context/SidebarContext';

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

import { useTranslation } from '@/app/context/LanguageContext';

export function Header({ role, userName }: HeaderProps) {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();

  const handleLogout = () => {
    navigate('/');
  };

  const { toggle } = useSidebar();
  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-sm relative bg-[#F7F9FC]" style={{ borderColor: 'var(--fnrc-border-gray)' }}>
      {/* FNRC Pattern Strip at the top */}
      <div className="absolute top-0 w-full h-1" style={{ backgroundImage: 'linear-gradient(to right, var(--fnrc-primary-green), var(--fnrc-accent-gold), var(--fnrc-royal-blue))' }} />

      <div className="flex h-14 items-center justify-between px-6 pt-1">

        {/* Left Side: Burger Menu + Logo */}
        <div className="flex items-center gap-3">
          {role !== 'public' && (
            <button 
              onClick={toggle} 
              aria-label="Toggle navigation" 
              className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
          )}
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center transition-transform group-hover:scale-105">
              <img src="/fnrc-logo.png" alt="FNRC Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-[16px] font-bold tracking-wide leading-none" style={{ color: 'var(--fnrc-secondary-dark-green)' }}>
                {t('FNRC')}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--fnrc-primary-green)' }}>
                {role === 'admin' ? t('Admin Portal') : role === 'vendor' ? t('Vendor Portal') : ''}
              </div>
            </div>
          </Link>
        </div>


        {/* Right side - User menu & Language toggle */}
        <div className="flex items-center gap-4">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 cursor-pointer" style={{ color: 'var(--fnrc-text-muted)' }}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] uppercase font-bold">{language}</span>
                {language === 'en' ? 'English' : 'العربية'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')} className="font-medium cursor-pointer">English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')} className="font-medium cursor-pointer">العربية (Arabic)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {role === 'public' ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/vendor/login')}
                style={{ borderColor: 'var(--fnrc-primary-green)', color: 'var(--fnrc-primary-green)' }}
              >
                {t('Vendor Login')}
              </Button>
              <Button
                onClick={() => navigate('/admin/login')}
                style={{ backgroundColor: 'var(--fnrc-primary-green)' }}
                className="text-white hover:opacity-90"
              >
                {t('Admin Login')}
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-gray-100/80 rounded-full transition-all duration-150 outline-none">
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fnrc-primary-green)] text-white shadow-sm font-bold text-sm">
                    {(userName || 'U').charAt(0)}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[14px] font-medium hidden sm:inline-block" style={{ color: 'var(--fnrc-text-dark)' }}>{userName || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-gray-100">
                <DropdownMenuLabel>{t('My Account')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50/50">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('Logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}