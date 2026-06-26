import { Link, useNavigate } from '@/app/context/RouterContext';
import { Building2, LogOut, User, Bell, Settings, Menu, MessageSquare } from 'lucide-react';
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
      {/* Prime Organization Pattern Strip at the top */}
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
              <img src="/prime-logo.png" alt="Prime Organization Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-[16px] font-bold tracking-wide leading-none" style={{ color: 'var(--fnrc-secondary-dark-green)' }}>
                {t('Prime Organization')}
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

          {role !== 'public' && (
            <>
              {/* Messages Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors">
                    <MessageSquare className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                      {role === 'admin' ? 3 : 2}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-xl border border-gray-100 p-2 space-y-1 bg-white font-sans text-start">
                  <DropdownMenuLabel className="flex items-center justify-between font-bold text-sm px-2.5 py-2 text-black">
                    <span>{t("Recent Messages")}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  
                  {role === 'admin' ? (
                    <>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 text-start">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[13px] text-gray-900">TechSolutions LLC</span>
                          <span className="text-[10px] text-gray-400 font-semibold">10m ago</span>
                        </div>
                        <div className="text-[10px] font-bold text-[var(--fnrc-primary-green)] bg-green-50 px-1.5 py-0.5 rounded mt-1">
                          {t("Tender ID")}: TEND-005
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 text-start">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[13px] text-gray-900">Modern Office Furnishings</span>
                          <span className="text-[10px] text-gray-400 font-semibold">2h ago</span>
                        </div>
                        <div className="text-[10px] font-bold text-[var(--fnrc-primary-green)] bg-green-50 px-1.5 py-0.5 rounded mt-1">
                          {t("Tender ID")}: TEND-004
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 text-start">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[13px] text-gray-900">Gulf Construction Services</span>
                          <span className="text-[10px] text-gray-400 font-semibold">1d ago</span>
                        </div>
                        <div className="text-[10px] font-bold text-[var(--fnrc-primary-green)] bg-green-50 px-1.5 py-0.5 rounded mt-1">
                          {t("Tender ID")}: TEND-001
                        </div>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 text-start">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[13px] text-gray-900">{t("Prime Organization Procurement Board")}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">15m ago</span>
                        </div>
                        <div className="text-[10px] font-bold text-[var(--fnrc-primary-green)] bg-green-50 px-1.5 py-0.5 rounded mt-1">
                          {t("RFP:")} Supply of IT Hardware for HQ
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 text-start">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[13px] text-gray-900">{t("Procurement Board")}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">3h ago</span>
                        </div>
                        <div className="text-[10px] font-bold text-[var(--fnrc-primary-green)] bg-green-50 px-1.5 py-0.5 rounded mt-1">
                          {t("RFP:")} Office Renovation Project
                        </div>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem 
                    className="flex justify-center p-2 rounded-lg hover:bg-gray-55 cursor-pointer focus:bg-gray-50 text-center font-bold text-xs text-[var(--fnrc-primary-green)]"
                    onClick={() => navigate(role === 'admin' ? '/admin/messages' : '/vendor/messages')}
                  >
                    {t("View All Messages")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                      2
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-xl border border-gray-100 p-2 space-y-1 bg-white font-sans text-start">
                  <DropdownMenuLabel className="flex items-center justify-between font-bold text-sm px-2.5 py-2 text-black">
                    <span>{t("Notifications")}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  
                  {role === 'admin' ? (
                    <>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 text-start">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[12px] text-gray-900">{t("New Registration")}</span>
                          <span className="text-[9px] text-gray-400">1h ago</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-tight">"New vendor registration proposal submitted by Gulf Construction Services."</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 text-start">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[12px] text-gray-900">{t("Verification Alert")}</span>
                          <span className="text-[9px] text-gray-400">4h ago</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-tight">"Document correction pending verification for TechSolutions LLC."</p>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 text-start">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[12px] text-gray-900">{t("Correction Checklist")}</span>
                          <span className="text-[9px] text-gray-400">2h ago</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-tight">"Your application status has been updated to 'Correction Required'."</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 text-start">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[12px] text-gray-900">{t("New RFP Campaign")}</span>
                          <span className="text-[9px] text-gray-400">1d ago</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-tight">"New Tender published: Supply of IT Hardware for HQ."</p>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem 
                    className="flex justify-center p-2 rounded-lg hover:bg-gray-55 cursor-pointer focus:bg-gray-50 text-center font-bold text-xs text-[var(--fnrc-primary-green)]"
                    onClick={() => navigate(role === 'admin' ? '/admin/notifications' : '/vendor/notifications')}
                  >
                    {t("View All Notifications")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

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