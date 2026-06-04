import { RouterProvider, useLocation } from '@/app/context/RouterContext';
import { SidebarProvider } from '@/app/context/SidebarContext';
import { Toaster } from '@/app/components/ui/sonner';

// Public & Role Selection
import RoleSelection from '@/app/pages/RoleSelection';
import { VendorLayout, AdminLayout } from '@/app/components/layout/Layouts';

// Vendor Pages
import VendorLanding from '@/app/pages/vendor/VendorLanding';
import VendorLogin from '@/app/pages/vendor/VendorLogin';
import VendorRegister from '@/app/pages/vendor/VendorRegister';
import VendorProfileSetup from '@/app/pages/vendor/VendorProfileSetup';
import VendorRegistrationStatus from '@/app/pages/vendor/VendorRegistrationStatus';
import VendorDashboard from '@/app/pages/vendor/VendorDashboard';
import VendorRFPList from '@/app/pages/vendor/VendorRFPList';
import VendorRFPDetail from '@/app/pages/vendor/VendorRFPDetail';
import VendorProposalSubmit from '@/app/pages/vendor/VendorProposalSubmit';
import VendorProposalList from '@/app/pages/vendor/VendorProposalList';
import VendorProposalTracking from '@/app/pages/vendor/VendorProposalTracking';
import VendorProfile from '@/app/pages/vendor/VendorProfile';

// Admin Pages
import AdminLogin from '@/app/pages/admin/AdminLogin';
import AdminDashboard from '@/app/pages/admin/AdminDashboard';
import AdminVendorManagement from '@/app/pages/admin/AdminVendorManagement';
import AdminVendorDetail from '@/app/pages/admin/AdminVendorDetail';
import AdminRFPManagement from '@/app/pages/admin/AdminRFPManagement';
import AdminRFPCreate from '@/app/pages/admin/AdminRFPCreate';
import AdminRFPDetail from '@/app/pages/admin/AdminRFPDetail';
import AdminItemManagement from '@/app/pages/admin/AdminItemManagement';
import AdminItemDetail from '@/app/pages/admin/AdminItemDetail';
import AdminProposalManagement from '@/app/pages/admin/AdminProposalManagement';
import AdminProposalDetail from '@/app/pages/admin/AdminProposalDetail';
import AdminUserManagement from '@/app/pages/admin/AdminUserManagement';
import AdminMasterData from '@/app/pages/admin/AdminMasterData';
import AdminReports from '@/app/pages/admin/AdminReports';
import AdminConfig from '@/app/pages/admin/AdminConfig';
import AdminExternalRating from '@/app/pages/admin/AdminExternalRating';

function AppRoutes() {
  const location = useLocation();
  const path = location.pathname;

  // Root path
  if (path === '/') return <RoleSelection />;

  // Standalone public routes
  if (path.startsWith('/rating/external-review')) return <AdminExternalRating />;

  // Vendor routes without layout
  if (path === '/vendor/landing') return <VendorLanding />;
  if (path === '/vendor/login') return <VendorLogin />;
  if (path === '/vendor/register') return <VendorRegister />;
  if (path === '/vendor/profile-setup') return <VendorProfileSetup />;
  if (path === '/vendor/registration-status') return <VendorRegistrationStatus />;

  // Vendor routes with layout
  if (path === '/vendor/dashboard') return <VendorLayout><VendorDashboard /></VendorLayout>;
  if (path === '/vendor/rfps') return <VendorLayout><VendorRFPList /></VendorLayout>;
  if (path.startsWith('/vendor/rfps/') && path.endsWith('/submit')) return <VendorLayout><VendorProposalSubmit /></VendorLayout>;
  if (path.startsWith('/vendor/rfps/')) return <VendorLayout><VendorRFPDetail /></VendorLayout>;
  if (path.startsWith('/vendor/proposals/')) return <VendorLayout><VendorProposalTracking /></VendorLayout>;
  if (path === '/vendor/proposals') return <VendorLayout><VendorProposalList /></VendorLayout>;
  if (path === '/vendor/profile') return <VendorLayout><VendorProfile /></VendorLayout>;

  // Admin routes without layout
  if (path === '/admin/login') return <AdminLogin />;

  // Admin routes with layout
  if (path === '/admin/dashboard') return <AdminLayout><AdminDashboard /></AdminLayout>;
  if (path === '/admin/vendors') return <AdminLayout><AdminVendorManagement /></AdminLayout>;
  if (path.startsWith('/admin/vendors/')) return <AdminLayout><AdminVendorDetail /></AdminLayout>;
  if (path === '/admin/rfps/create') return <AdminLayout><AdminRFPCreate /></AdminLayout>;
  if (path.startsWith('/admin/rfps/edit/')) return <AdminLayout><AdminRFPCreate /></AdminLayout>;
  if (path.startsWith('/admin/rfps/') && path !== '/admin/rfps/create' && !path.startsWith('/admin/rfps/edit/')) return <AdminLayout><AdminRFPDetail /></AdminLayout>;
  if (path === '/admin/rfps') return <AdminLayout><AdminRFPManagement /></AdminLayout>;
  if (path.startsWith('/admin/items/')) return <AdminLayout><AdminItemDetail /></AdminLayout>;
  if (path === '/admin/items') return <AdminLayout><AdminItemManagement /></AdminLayout>;
  if (path.startsWith('/admin/proposals/')) return <AdminLayout><AdminProposalDetail /></AdminLayout>;
  if (path === '/admin/proposals') return <AdminLayout><AdminProposalManagement /></AdminLayout>;
  if (path === '/admin/users') return <AdminLayout><AdminUserManagement /></AdminLayout>;
  if (path === '/admin/master-data') return <AdminLayout><AdminMasterData /></AdminLayout>;
  if (path === '/admin/reports') return <AdminLayout><AdminReports /></AdminLayout>;
  if (path === '/admin/config') return <AdminLayout><AdminConfig /></AdminLayout>;

  // Default fallback
  return <RoleSelection />;
}

export default function App() {
  return (
    <RouterProvider>
      <SidebarProvider>
        <AppRoutes />
        <Toaster />
      </SidebarProvider>
    </RouterProvider>
  );
}