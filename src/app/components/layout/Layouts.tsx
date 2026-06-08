import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useSidebar } from '@/app/context/SidebarContext';


export function VendorLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Header role="vendor" userName="TechSolutions LLC" />
      <Sidebar role="vendor" />
      <main className={`${collapsed ? 'ms-16' : 'ms-72'} pt-4 px-8 pb-8 animate-fade-in transition-[margin] duration-200 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Header role="admin" userName="Ahmed Al Mansoori" />
      <Sidebar role="admin" />
      <main className={`${collapsed ? 'ms-16' : 'ms-72'} pt-4 px-8 pb-8 animate-fade-in transition-[margin] duration-200 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F9FC' }}>
      <Header role="public" />
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
}