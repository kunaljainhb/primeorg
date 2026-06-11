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
import VendorTenderList from '@/app/pages/vendor/VendorTenderList';
import VendorTenderDetail from '@/app/pages/vendor/VendorTenderDetail';
import VendorProposalSubmit from '@/app/pages/vendor/VendorProposalSubmit';
import VendorProposalList from '@/app/pages/vendor/VendorProposalList';
import VendorProposalTracking from '@/app/pages/vendor/VendorProposalTracking';
import VendorProfile from '@/app/pages/vendor/VendorProfile';

// Admin Pages
import AdminLogin from '@/app/pages/admin/AdminLogin';
import AdminDashboard from '@/app/pages/admin/AdminDashboard';
import AdminVendorManagement from '@/app/pages/admin/AdminVendorManagement';
import AdminVendorDetail from '@/app/pages/admin/AdminVendorDetail';
import AdminTenderManagement from '@/app/pages/admin/AdminTenderManagement';
import AdminTenderCreate from '@/app/pages/admin/AdminTenderCreate';
import AdminTenderDetail from '@/app/pages/admin/AdminTenderDetail';
import AdminItemManagement from '@/app/pages/admin/AdminItemManagement';
import AdminItemDetail from '@/app/pages/admin/AdminItemDetail';
import AdminProposalManagement from '@/app/pages/admin/AdminProposalManagement';
import AdminProposalDetail from '@/app/pages/admin/AdminProposalDetail';
import AdminUserManagement from '@/app/pages/admin/AdminUserManagement';
import AdminUserCreate from '@/app/pages/admin/AdminUserCreate';
import AdminUserEdit from '@/app/pages/admin/AdminUserEdit';
import AdminMasterData from '@/app/pages/admin/AdminMasterData';
import AdminReports from '@/app/pages/admin/AdminReports';
import AdminConfig from '@/app/pages/admin/AdminConfig';
import AdminExternalRating from '@/app/pages/admin/AdminExternalRating';

import VendorNotifications from '@/app/pages/vendor/VendorNotifications';
import VendorMessages from '@/app/pages/vendor/VendorMessages';
import AdminNotifications from '@/app/pages/admin/AdminNotifications';
import AdminMessages from '@/app/pages/admin/AdminMessages';
import VendorProjectList from '@/app/pages/vendor/VendorProjectList';
import VendorProjectDetail from '@/app/pages/vendor/VendorProjectDetail';

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
  if (path === '/vendor/tenders') return <VendorLayout><VendorTenderList /></VendorLayout>;
  if (path.startsWith('/vendor/tenders/') && path.endsWith('/submit')) return <VendorLayout><VendorProposalSubmit /></VendorLayout>;
  if (path.startsWith('/vendor/tenders/')) return <VendorLayout><VendorTenderDetail /></VendorLayout>;
  if (path.startsWith('/vendor/proposals/')) return <VendorLayout><VendorProposalTracking /></VendorLayout>;
  if (path === '/vendor/proposals') return <VendorLayout><VendorProposalList /></VendorLayout>;
  if (path === '/vendor/profile') return <VendorLayout><VendorProfile /></VendorLayout>;
  if (path === '/vendor/notifications') return <VendorLayout><VendorNotifications /></VendorLayout>;
  if (path === '/vendor/messages') return <VendorLayout><VendorMessages /></VendorLayout>;
  if (path === '/vendor/projects') return <VendorLayout><VendorProjectList /></VendorLayout>;
  if (path.startsWith('/vendor/projects/')) return <VendorLayout><VendorProjectDetail /></VendorLayout>;

  // Admin routes without layout
  if (path === '/admin/login') return <AdminLogin />;

  // Admin routes with layout
  if (path === '/admin/dashboard') return <AdminLayout><AdminDashboard /></AdminLayout>;
  if (path === '/admin/vendors') return <AdminLayout><AdminVendorManagement /></AdminLayout>;
  if (path.startsWith('/admin/vendors/')) return <AdminLayout><AdminVendorDetail /></AdminLayout>;
  if (path === '/admin/tenders/create') return <AdminLayout><AdminTenderCreate /></AdminLayout>;
  if (path.startsWith('/admin/tenders/edit/')) return <AdminLayout><AdminTenderCreate /></AdminLayout>;
  if (path.startsWith('/admin/tenders/') && path !== '/admin/tenders/create' && !path.startsWith('/admin/tenders/edit/')) return <AdminLayout><AdminTenderDetail /></AdminLayout>;
  if (path === '/admin/tenders') return <AdminLayout><AdminTenderManagement /></AdminLayout>;
  if (path.startsWith('/admin/items/')) return <AdminLayout><AdminItemDetail /></AdminLayout>;
  if (path === '/admin/items') return <AdminLayout><AdminItemManagement /></AdminLayout>;
  if (path.startsWith('/admin/proposals/')) return <AdminLayout><AdminProposalDetail /></AdminLayout>;
  if (path === '/admin/proposals') return <AdminLayout><AdminProposalManagement /></AdminLayout>;
  if (path === '/admin/users') return <AdminLayout><AdminUserManagement /></AdminLayout>;
  if (path === '/admin/users/create') return <AdminLayout><AdminUserCreate /></AdminLayout>;
  if (path.startsWith('/admin/users/edit/')) return <AdminLayout><AdminUserEdit /></AdminLayout>;
  if (path === '/admin/master-data' || path === '/admin/master-data/service-category') return <AdminLayout><AdminMasterData defaultTab="category" /></AdminLayout>;
  if (path === '/admin/master-data/document-type') return <AdminLayout><AdminMasterData defaultTab="doctype" /></AdminLayout>;
  if (path === '/admin/master-data/declaration-context') return <AdminLayout><AdminMasterData defaultTab="declaration" /></AdminLayout>;
  if (path === '/admin/master-data/vendor-rating-question') return <AdminLayout><AdminMasterData defaultTab="rubric" /></AdminLayout>;
  if (path === '/admin/reports') return <AdminLayout><AdminReports /></AdminLayout>;
  if (path === '/admin/config') return <AdminLayout><AdminConfig /></AdminLayout>;
  if (path === '/admin/notifications') return <AdminLayout><AdminNotifications /></AdminLayout>;
  if (path === '/admin/messages') return <AdminLayout><AdminMessages /></AdminLayout>;

  // Default fallback
  return <RoleSelection />;
}

import { LanguageProvider } from '@/app/context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider>
        <SidebarProvider>
          <AppRoutes />
          <Toaster />
        </SidebarProvider>
      </RouterProvider>
    </LanguageProvider>
  );
}