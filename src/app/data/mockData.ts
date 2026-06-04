// Mock data for FNRC Vendor Portal

export interface RFP {
  id: string;
  title: string;
  category: string[];
  description: string;
  scopeOfWork: string;
  timeline: string;
  submissionDeadline: string;
  status: 'draft' | 'published' | 'closed' | 'cancelled';
  eligibilityCriteria: string[];
  attachments: { name: string; url: string }[];
}

export interface Vendor {
  id: string;
  companyName: string;
  email: string;
  category: string[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'correction_requested';
  registrationDate: string;
  tradeLicense: string;
  taxNumber: string;
  address: string;
  rejectionReason?: string;
}

export interface Proposal {
  id: string;
  rfpId: string;
  rfpTitle: string;
  vendorId: string;
  vendorName: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'selected' | 'rejected' | 'technical_review' | 'technical_correction_requested' | 'technical_review_started' | 'commercial_review_started' | 'technical_review_completed' | 'commercial_review_completed' | 'correction_requested' | 'commercial_correction_requested' | 'technical_review_rejected' | 'commercial_review_rejected';
  submissionDate: string;
  technicalProposal: string;
  commercialAmount: number;
  remarks?: string;
  // Enhanced fields for comparison
  technicalStatus?: 'pending' | 'under_review' | 'approved' | 'rejected' | 'correction_requested';
  commercialStatus?: 'pending' | 'under_review' | 'approved' | 'rejected' | 'correction_requested';
  deliveryTimeline?: string;
  technicalScore?: number;
  compliance?: string;
  experience?: string;
  methodology?: string;
  resources?: string;
  boqSummary?: string;
  paymentTerms?: string;
  warranty?: string;
  vendorContact?: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  shortlistedDate?: string;
  technicalReviewer?: string;
  commercialReviewer?: string;
  uploadedDocuments?: { name: string; url: string; remarks: string; uploadedDate: string }[];
}

export interface ERPDocument {
  id: string;
  rfpId: string;
  vendorId: string;
  documentType: 'LPO' | 'Invoice' | 'Payment Receipt' | 'Delivery Note';
  documentNumber: string;
  date: string;
  amount?: number;
  status: 'pending' | 'approved' | 'paid' | 'delivered';
  fileUrl: string;
}

export interface VendorReview {
  id: string;
  rfpId: string;
  rfpTitle: string;
  vendorId: string;
  vendorName: string;
  reviewDate: string;
  reviewedBy: string;
  qualityRating: number;
  timelinessRating: number;
  communicationRating: number;
  complianceRating: number;
  overallRating: number;
  comments: string;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  name: string;
  documentType: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'verified' | 'pending' | 'rejected' | 'expired';
  fileSize: string;
  isRegulatory: boolean; // Whether this is a regulatory document that requires alerts
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'procurement_admin' | 'reviewer';
  status: 'active' | 'inactive';
  createdDate?: string;
}

// Mock RFPs
export const mockRFPs: RFP[] = [
  {
    id: 'RFP-001',
    title: 'Supply of IT Hardware for HQ',
    category: ['IT Hardware & Software', 'Equipment & Machinery'],
    description: 'Procurement of 50 laptops and 20 desktop units for the new headquarters',
    scopeOfWork: 'Delivery, installation, and initial setup of hardware',
    timeline: '2 months',
    submissionDeadline: '2026-06-15',
    createdAt: '2026-05-01',
    status: 'published',
    eligibilityCriteria: ['Must be an authorized reseller', 'Local presence in Dubai'],
    attachments: [{ name: 'Specs_IT.pdf', url: '#' }]
  },
  {
    id: 'RFP-002',
    title: 'Cloud Migration Services',
    category: ['IT Hardware & Software', 'Consultancy & Training'],
    description: 'Migration of local servers to a secure cloud environment',
    scopeOfWork: 'Audit of existing infrastructure, data migration, and staff training',
    timeline: '6 months',
    submissionDeadline: '2026-07-01',
    createdAt: '2026-05-05',
    status: 'published',
    eligibilityCriteria: ['Azure/AWS certification', 'ISO 27001 compliance'],
    attachments: [{ name: 'Migration_Plan.pdf', url: '#' }]
  },
  {
    id: 'RFP-003',
    title: 'Security Guard Services',
    category: ['Cleaning & Hospitality', 'Security Services'],
    description: '24/7 security services for the corporate office buildings',
    scopeOfWork: 'Provision of 5 SIRA certified security guards and monitoring services',
    timeline: '24 months',
    submissionDeadline: '2026-05-30',
    createdAt: '2026-04-10',
    status: 'published',
    eligibilityCriteria: ['SIRA license mandatory', 'Min 5 years experience'],
    attachments: [{ name: 'Security_SOP.pdf', url: '#' }]
  },
  {
    id: 'RFP-004',
    title: 'EV Charging Station Network',
    category: ['Contracting & Maintenance'],
    description: 'Establishment of EV charging points across all parking lots',
    scopeOfWork: 'Installation of 20 fast-charging points and management software',
    timeline: '5 months',
    submissionDeadline: '2026-05-20',
    createdAt: '2026-05-10',
    status: 'published',
    eligibilityCriteria: ['Electrical license', 'Smart city tech experience'],
    attachments: [{ name: 'EV_Specs.pdf', url: '#' }]
  },
  {
    id: 'RFP-005',
    title: 'Office Renovation Project',
    category: ['Contracting & Maintenance', 'Building Materials', 'Equipment & Machinery'],
    description: 'Interior renovation and fit-out for 2nd floor offices',
    scopeOfWork: 'Demolition, partition installation, electrical and MEP works',
    timeline: '3 months',
    submissionDeadline: '2026-04-15',
    createdAt: '2026-03-20',
    status: 'published',
    eligibilityCriteria: ['Valid trade license', 'Grade A contractor'],
    attachments: [{ name: 'Design_Layout.pdf', url: '#' }]
  },
  {
    id: 'RFP-006',
    title: 'Annual Security Audit 2026',
    category: ['IT Hardware & Software'],
    description: 'Comprehensive cybersecurity audit and penetration testing for all digital assets',
    scopeOfWork: 'Vulnerability assessment, network penetration testing, and compliance reporting',
    timeline: '2 months',
    submissionDeadline: '2026-08-30',
    createdAt: '2026-05-15',
    status: 'draft',
    eligibilityCriteria: ['CREST certified', 'Proven track record in financial sector'],
    attachments: []
  },
  {
    id: 'RFP-007',
    title: 'Closed RFP Sample',
    category: ['IT Hardware & Software'],
    description: 'Sample closed RFP for testing.',
    scopeOfWork: 'N/A',
    timeline: 'N/A',
    submissionDeadline: '2026-05-01',
    createdAt: '2026-04-01',
    status: 'closed',
    eligibilityCriteria: [],
    attachments: []
  }
];

// Initial default proposals
const initialProposals: Proposal[] = [
  // RFP-001 has 3 proposals
  {
    id: 'PROP-100',
    rfpId: 'RFP-001',
    rfpTitle: 'Supply of IT Hardware for HQ',
    vendorId: 'VEN-001',
    vendorName: 'TechSolutions LLC',
    status: 'commercial_review_completed',
    submissionDate: '2026-06-01',
    technicalProposal: 'Premium laptops and workstations',
    commercialAmount: 420000,
    technicalStatus: 'approved',
    commercialStatus: 'approved',
    technicalReviewer: 'Mohammed Al Zaabi',
    commercialReviewer: 'Sarah Al Hosani'
  },
  {
    id: 'PROP-101',
    rfpId: 'RFP-001',
    rfpTitle: 'Supply of IT Hardware for HQ',
    vendorId: 'VEN-002',
    vendorName: 'Modern Office Furnishings',
    status: 'shortlisted',
    submissionDate: '2026-06-02',
    shortlistedDate: '2026-06-15',
    technicalProposal: 'Standard enterprise hardware package',
    commercialAmount: 395000,
    technicalStatus: 'approved',
    commercialStatus: 'approved',
    uploadedDocuments: [
      {
        name: 'Bank_Guarantee_v1.pdf',
        url: '#',
        remarks: 'Initial Bank Guarantee submission as requested in the shortlist notification.',
        uploadedDate: '2026-06-16'
      }
    ]
  },
  {
    id: 'PROP-110',
    rfpId: 'RFP-001',
    rfpTitle: 'Supply of IT Hardware for HQ',
    vendorId: 'VEN-004',
    vendorName: 'ABC Trading',
    status: 'rejected',
    submissionDate: '2026-06-03',
    technicalProposal: 'Budget hardware package',
    commercialAmount: 250000,
    technicalStatus: 'rejected',
    commercialStatus: 'rejected',
    remarks: 'Hardware does not meet minimum technical specifications.'
  },

  // RFP-002 has 1 proposal
  {
    id: 'PROP-102',
    rfpId: 'RFP-002',
    rfpTitle: 'Cloud Migration Services',
    vendorId: 'VEN-001',
    vendorName: 'TechSolutions LLC',
    status: 'technical_correction_requested',
    submissionDate: '2026-05-10',
    technicalProposal: 'Hybrid cloud solution using Azure Stack Hub',
    commercialAmount: 850000,
    remarks: 'Technical proposal is missing detail about multi-zone failover mechanisms. Please provide specific redundant architecture details and update the technical document.',
    technicalStatus: 'correction_requested',
    commercialStatus: 'pending',
    deliveryTimeline: '6 months',
    technicalScore: 0,
    compliance: 'Awaiting evaluation',
    experience: '10+ years in cloud computing',
    methodology: 'Phased migration with zero downtime',
    resources: '5 Cloud Architects, 10 Engineers',
    boqSummary: 'Azure subscriptions, Migration tools, Support services',
    paymentTerms: '20% advance, 80% on milestones',
    warranty: '1 year post-migration support',
    vendorContact: 'contact@techsolutions.ae'
  },

  // RFP-003 has 1 proposal
  {
    id: 'PROP-103',
    rfpId: 'RFP-003',
    rfpTitle: 'Security Guard Services',
    vendorId: 'VEN-001',
    vendorName: 'TechSolutions LLC',
    status: 'rejected',
    submissionDate: '2026-04-25',
    technicalProposal: 'Integrated smart security with physical guards',
    commercialAmount: 1200000,
    remarks: 'Commercial bid exceeded the allocated budget for this project.',
    technicalStatus: 'approved',
    commercialStatus: 'rejected',
    deliveryTimeline: '24 months',
    technicalScore: 88,
    compliance: 'Fully compliant technically',
    experience: 'Relevant experience in corporate security',
    methodology: 'Surveillance-led security protocol',
    resources: '50 SIRA certified guards',
    boqSummary: 'Personnel, Equipment, Monitoring center',
    paymentTerms: 'Monthly payments',
    warranty: 'Service guarantee',
    vendorContact: 'contact@techsolutions.ae'
  },

  // RFP-004 has 1 proposal
  {
    id: 'PROP-104',
    rfpId: 'RFP-004',
    rfpTitle: 'EV Charging Station Network',
    vendorId: 'VEN-002',
    vendorName: 'Modern Office Furnishings',
    status: 'shortlisted',
    submissionDate: '2026-05-18',
    shortlistedDate: '2026-05-25',
    technicalProposal: 'Complete installation of 20 fast-charging units',
    commercialAmount: 850000,
    technicalStatus: 'approved',
    commercialStatus: 'approved',
    remarks: 'Shortlisted for final rollout.'
  },

  // RFP-005 has 2 proposals
  {
    id: 'PROP-105',
    rfpId: 'RFP-005',
    rfpTitle: 'Office Renovation Project',
    vendorId: 'VEN-001',
    vendorName: 'TechSolutions LLC',
    status: 'shortlisted',
    submissionDate: '2026-04-10',
    technicalProposal: 'Modern open-plan office renovation with sustainable materials',
    commercialAmount: 600000,
    remarks: 'Proposal shortlisted for final negotiation.',
    technicalStatus: 'approved',
    commercialStatus: 'approved',
    deliveryTimeline: '3 months',
    technicalScore: 92,
    compliance: 'Fully compliant with FNRC building standards',
    experience: 'Numerous fit-out projects completed in the region',
    methodology: 'Design-build approach with LEED certification',
    resources: 'Civil, Electrical, and MEP teams',
    boqSummary: 'Partitioning, Flooring, Electrical works, HVAC ducting',
    paymentTerms: 'Milestone based',
    warranty: '2 years defects liability period',
    vendorContact: 'contact@techsolutions.ae',
    uploadedDocuments: [
      {
        name: 'Trade_License_Update.pdf',
        url: '#',
        remarks: 'Updated trade license showing current validity.',
        uploadedDate: '2026-04-15'
      }
    ]
  },
  {
    id: 'PROP-106',
    rfpId: 'RFP-005',
    rfpTitle: 'Office Renovation Project',
    vendorId: 'VEN-003',
    vendorName: 'Gulf Construction Services',
    status: 'under_review',
    submissionDate: '2026-04-12',
    technicalProposal: 'Standard renovation with localized materials',
    commercialAmount: 520000,
    technicalStatus: 'under_review',
    commercialStatus: 'pending'
  },
  {
    id: 'PROP-107',
    rfpId: 'RFP-001',
    rfpTitle: 'Supply of IT Hardware for HQ',
    vendorId: 'VEN-002',
    vendorName: 'Modern Office Furnishings',
    status: 'submitted',
    submissionDate: '2026-04-14',
    technicalProposal: 'Premium office furniture setup and ergonomic design',
    commercialAmount: 480000,
    technicalStatus: 'pending',
    commercialStatus: 'pending'
  }
];

export const saveProposalsToStorage = (proposals: Proposal[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mock_proposals', JSON.stringify(proposals));
  }
};

export const mockProposals: Proposal[] = (() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mock_proposals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Proposal[];
        const p100 = parsed.find(p => p.id === 'PROP-100');
        let needsSave = false;
        if (p100 && p100.status !== 'commercial_review_completed') {
          p100.status = 'commercial_review_completed';
          p100.technicalStatus = 'approved';
          p100.commercialStatus = 'approved';
          p100.technicalReviewer = 'Mohammed Al Zaabi';
          p100.commercialReviewer = 'Sarah Al Hosani';
          needsSave = true;
        }
        const newProps = initialProposals.filter(ip => !parsed.find(p => p.id === ip.id));
        if (newProps.length > 0) {
          parsed.push(...newProps);
          needsSave = true;
        }
        if (needsSave) {
          localStorage.setItem('mock_proposals', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error("Failed parsing mock_proposals", e);
      }
    }
  }
  return initialProposals;
})();

// Mock Vendors
export const mockVendors: Vendor[] = [
  {
    id: 'VEN-001',
    companyName: 'TechSolutions LLC',
    email: 'contact@techsolutions.ae',
    category: ['IT Hardware & Software', 'Consultancy & Training'],
    status: 'approved',
    registrationDate: '2025-11-15',
    tradeLicense: 'TL-123456',
    taxNumber: 'TRN-789012',
    address: 'Dubai Silicon Oasis, Dubai, UAE'
  },
  {
    id: 'VEN-002',
    companyName: 'Modern Office Furnishings',
    email: 'info@modernoffice.ae',
    category: ['Equipment & Machinery'],
    status: 'approved',
    registrationDate: '2025-12-01',
    tradeLicense: 'TL-234567',
    taxNumber: 'TRN-890123',
    address: 'Industrial Area, Sharjah, UAE'
  },
  {
    id: 'VEN-003',
    companyName: 'Gulf Construction Services',
    email: 'sales@gulfconst.ae',
    category: ['Contracting & Maintenance'],
    status: 'pending',
    registrationDate: '2026-01-20',
    tradeLicense: 'TL-345678',
    taxNumber: 'TRN-901234',
    address: 'Al Qusais, Dubai, UAE'
  },
  {
    id: 'VEN-004',
    companyName: 'ABC Trading',
    email: 'info@abctrading.ae',
    category: ['Equipment & Machinery'],
    status: 'rejected',
    registrationDate: '2025-10-10',
    tradeLicense: 'TL-456789',
    taxNumber: 'TRN-012345',
    address: 'Ajman, UAE',
    rejectionReason: 'Incomplete documentation - Trade license expired'
  },
  {
    id: 'VEN-005',
    companyName: 'Global Logistics Hub',
    email: 'info@globallogistics.ae',
    category: ['Cleaning & Hospitality', 'Equipment & Machinery'],
    status: 'correction_requested',
    registrationDate: '2026-02-10',
    tradeLicense: 'TL-567890',
    taxNumber: 'TRN-123456',
    address: 'Free Zone, Ras Al Khaimah, UAE'
  }
];

// Mock Admin Users
export const mockAdminUsers: AdminUser[] = [
  {
    id: 'ADM-001',
    name: 'Ahmed Al Mansoori',
    email: 'ahmed.almansoori@fnrc.gov.ae',
    role: 'super_admin',
    status: 'active',
    createdDate: '2026-01-10'
  },
  {
    id: 'ADM-002',
    name: 'Fatima Al Hammadi',
    email: 'fatima.alhammadi@fnrc.gov.ae',
    role: 'procurement_admin',
    status: 'active',
    createdDate: '2026-02-15'
  },
  {
    id: 'ADM-003',
    name: 'Mohammed Al Zaabi',
    email: 'mohammed.alzaabi@fnrc.gov.ae',
    role: 'reviewer',
    status: 'active',
    createdDate: '2026-03-01'
  },
  {
    id: 'ADM-004',
    name: 'Sarah Al Hosani',
    email: 'sarah.alhosani@fnrc.gov.ae',
    role: 'reviewer',
    status: 'active',
    createdDate: '2026-03-15'
  }
];

// Categories
export const vendorCategories = [
  'Stationery',
  'Advertising & Publications',
  'Cleaning & Hospitality',
  'Building Materials',
  'Equipment & Machinery',
  'Vehicle Supply & Maintenance',
  'Fuel Supply',
  'Travel Agencies',
  'Event Management',
  'Hotels',
  'Consultancy & Training',
  'Translation Services',
  'Contracting & Maintenance',
  'IT Hardware & Software',
  'Security Services',
  'Geology Services',
  'Banking & Auditing',
  'Government Agencies'
];

export const documentTypes = [
  { name: 'Trade License', type: 'Vendor', mandatory: 'Yes', status: 'Active' },
  { name: 'Tax Registration Certificate', type: 'Vendor', mandatory: 'Yes', status: 'Active' },
  { name: 'Company Profile', type: 'Vendor', mandatory: 'No', status: 'Active' },
  { name: 'ISO Certifications', type: 'Proposal', mandatory: 'No', status: 'Active' },
  { name: 'Bank Guarantee', type: 'RFP', mandatory: 'Yes', status: 'Active' },
  { name: 'Previous Project References', type: 'Proposal', mandatory: 'No', status: 'Active' },
  { name: 'Insurance Certificate', type: 'Vendor', mandatory: 'Yes', status: 'Inactive' }
];

// Roles and Permissions
export const roles = [
  {
    name: 'Super Admin',
    value: 'super_admin',
    permissions: ['all']
  },
  {
    name: 'Procurement Admin',
    value: 'procurement_admin',
    permissions: ['vendor_management', 'rfp_management', 'proposal_review']
  },
  {
    name: 'Reviewer',
    value: 'reviewer',
    permissions: ['proposal_review', 'vendor_view']
  }
];

// Mock ERP Documents for shortlisted vendors
export const mockERPDocuments: ERPDocument[] = [
  {
    id: 'DOC-001',
    rfpId: 'RFP-005',
    vendorId: 'VEN-001',
    documentType: 'LPO',
    documentNumber: 'LPO-2026-045',
    date: '2026-04-20',
    amount: 150000,
    status: 'approved',
    fileUrl: '#'
  },
  {
    id: 'DOC-002',
    rfpId: 'RFP-005',
    vendorId: 'VEN-001',
    documentType: 'Invoice',
    documentNumber: 'INV-2026-089',
    date: '2026-05-05',
    amount: 150000,
    status: 'paid',
    fileUrl: '#'
  },
  {
    id: 'DOC-003',
    rfpId: 'RFP-001',
    vendorId: 'VEN-002',
    documentType: 'LPO',
    documentNumber: 'LPO-2026-001',
    date: '2026-06-18',
    amount: 395000,
    status: 'approved',
    fileUrl: '#'
  },
  {
    id: 'DOC-004',
    rfpId: 'RFP-001',
    vendorId: 'VEN-002',
    documentType: 'Invoice',
    documentNumber: 'INV-2026-002',
    date: '2026-06-25',
    amount: 395000,
    status: 'pending',
    fileUrl: '#'
  }
];

// Mock Vendor Performance Reviews
export const mockVendorReviews: VendorReview[] = [
  {
    id: 'REV-001',
    rfpId: 'RFP-005',
    rfpTitle: 'Office Renovation Project',
    vendorId: 'VEN-001',
    vendorName: 'TechSolutions LLC',
    reviewedBy: 'Ahmed Al Mansoori',
    reviewDate: '2026-05-10',
    overallRating: 4.5,
    qualityRating: 5,
    timelinessRating: 4,
    communicationRating: 4,
    complianceRating: 5,
    comments: 'Excellent quality of work. Partitioning was done precisely according to design. Minor delay in MEP work but overall very satisfied.'
  }
];

// Mock Vendor Documents (with expiry dates for compliance tracking)
export const mockVendorDocuments: VendorDocument[] = [
  {
    id: 'DOC-001',
    vendorId: 'VEN-001',
    name: 'Trade License',
    documentType: 'Trade License',
    uploadDate: '2023-12-15',
    expiryDate: '2026-03-02', // Expires in 10 days relative to 2026-02-20
    status: 'verified',
    fileSize: '2.4 MB',
    isRegulatory: true
  },
  {
    id: 'DOC-002',
    vendorId: 'VEN-001',
    name: 'Tax Registration Certificate',
    documentType: 'Tax Registration Certificate',
    uploadDate: '2023-12-15',
    expiryDate: '2026-12-31',
    status: 'verified',
    fileSize: '1.8 MB',
    isRegulatory: true
  },
  {
    id: 'DOC-003',
    vendorId: 'VEN-001',
    name: 'ISO 27001 Certification',
    documentType: 'ISO Certifications',
    uploadDate: '2024-01-20',
    expiryDate: '2026-03-12', // Expires in 20 days relative to 2026-02-20
    status: 'verified',
    fileSize: '1.2 MB',
    isRegulatory: true
  },
  {
    id: 'DOC-004',
    vendorId: 'VEN-001',
    name: 'Company Profile Document',
    documentType: 'Company Profile',
    uploadDate: '2023-12-20',
    status: 'verified',
    fileSize: '3.2 MB',
    isRegulatory: false
  },
  {
    id: 'DOC-005',
    vendorId: 'VEN-001',
    name: 'Insurance Certificate',
    documentType: 'Insurance Certificate',
    uploadDate: '2024-02-01',
    expiryDate: '2026-02-10', // Expired 10 days ago relative to 2026-02-20
    status: 'expired',
    fileSize: '1.9 MB',
    isRegulatory: true
  },
  {
    id: 'DOC-006',
    vendorId: 'VEN-001',
    name: 'Other Document',
    documentType: 'Previous Project References',
    uploadDate: '2024-01-10',
    status: 'pending',
    fileSize: '1.5 MB',
    isRegulatory: false
  }
];