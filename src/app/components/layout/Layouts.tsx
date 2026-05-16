import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
      <Header role="vendor" userName="TechSolutions LLC" />
      <Sidebar role="vendor" />
      <main className="ml-64 pt-4 px-8 pb-8">
        {children}
      </main>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
      <Header role="admin" userName="Ahmed Al Mansoori" />
      <Sidebar role="admin" />
      <main className="ml-64 pt-4 px-8 pb-8">
        {children}
      </main>
    </div>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--fnrc-bg-light)' }}>
      <Header role="public" />
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
}