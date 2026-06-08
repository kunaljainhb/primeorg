// Mock data for FNRC Vendor Portal

export interface Tender {
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
  estimatedBudget?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  milestones?: { title: string; date: string }[];
  visibility?: 'open' | 'restricted';
  technicalProposalRequired?: 'yes' | 'no';
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
  tenderId: string;
  tenderTitle: string;
  vendorId: string;
  vendorName: string;
  status: 'submitted' | 'under_review' | 'approved' | 'selected' | 'rejected' | 'technical_review' | 'technical_correction_requested' | 'technical_review_started' | 'commercial_review_started' | 'technical_review_completed' | 'commercial_review_completed' | 'correction_requested' | 'commercial_correction_requested' | 'technical_review_rejected' | 'commercial_review_rejected';
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
  approvedDate?: string;
  technicalReviewer?: string;
  commercialReviewer?: string;
  uploadedDocuments?: { name: string; url: string; remarks: string; uploadedDate: string }[];
}

export interface ERPDocument {
  id: string;
  tenderId: string;
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
  tenderId: string;
  tenderTitle: string;
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

// Mock Tenders
export const mockTenders: Tender[] = [
  {
    id: 'TEND-001',
    title: 'Supply of IT Hardware for HQ',
    category: ['IT Hardware & Software', 'Equipment & Machinery'],
    description: 'The Federal National Resource Council (FNRC) is initiating a comprehensive procurement campaign to upgrade the IT infrastructure at our newly constructed headquarters. This Tender covers the supply, installation, and commissioning of high-performance laptops and desktop workstations tailored for demanding administrative and analytical workloads.',
    scopeOfWork: '1. Supply of 50 enterprise-grade laptops and 20 advanced desktop units.\n2. Full deployment, imaging, and configuration on-site.\n3. Asset tagging and integration with the central FNRC inventory system.\n4. Secure disposal and data wiping of legacy hardware.\n5. Three-year comprehensive on-site warranty and dedicated support SLAs.',
    timeline: '2 months',
    submissionDeadline: '2026-06-15',
    createdAt: '2026-05-01',
    status: 'published',
    eligibilityCriteria: [
      'Must be an authorized tier-1 reseller or direct manufacturer',
      'Proven local presence and operational office in Dubai, UAE',
      'Minimum of 5 years experience handling large-scale government IT deployments',
      'ISO 27001 certification for data security and handling',
      'Demonstrated capacity to deliver hardware within 30 days of PO issuance'
    ],
    attachments: [
      { name: 'Hardware_Specifications_Annex_A.pdf', url: '#' },
      { name: 'FNRC_IT_Compliance_Guidelines.pdf', url: '#' },
      { name: 'Pricing_Matrix_Template.xlsx', url: '#' },
      { name: 'Standard_Terms_and_Conditions.pdf', url: '#' }
    ],
    estimatedBudget: 'AED 500,000',
    projectStartDate: '2026-07-01',
    projectEndDate: '2026-12-31',
    milestones: [
      { title: 'Project Kickoff', date: '2026-07-15' },
      { title: 'Mid-term Review', date: '2026-09-30' },
      { title: 'Final Delivery & Sign-off', date: '2026-12-15' }
    ],
    visibility: 'open',
    technicalProposalRequired: 'yes'
  },
  {
    id: 'TEND-002',
    title: 'Cloud Migration Services',
    category: ['IT Hardware & Software', 'Consultancy & Training'],
    description: 'Migration of local servers to a secure cloud environment',
    scopeOfWork: 'Audit of existing infrastructure, data migration, and staff training',
    timeline: '6 months',
    submissionDeadline: '2026-07-01',
    createdAt: '2026-05-05',
    status: 'published',
    eligibilityCriteria: ['Azure/AWS certification', 'ISO 27001 compliance'],
    attachments: [{ name: 'Migration_Plan.pdf', url: '#' }],
    estimatedBudget: 'AED 800,000',
    projectStartDate: '2026-08-01',
    projectEndDate: '2027-02-01',
    milestones: [
      { title: 'Infrastructure Audit', date: '2026-08-30' },
      { title: 'Migration Execution', date: '2026-11-30' },
      { title: 'Staff Training & Handover', date: '2027-01-15' }
    ],
    visibility: 'restricted',
    technicalProposalRequired: 'yes'
  },
  {
    id: 'TEND-003',
    title: 'Security Guard Services',
    category: ['Cleaning & Hospitality', 'Security Services'],
    description: '24/7 security services for the corporate office buildings',
    scopeOfWork: 'Provision of 5 SIRA certified security guards and monitoring services',
    timeline: '24 months',
    submissionDeadline: '2026-05-30',
    createdAt: '2026-04-10',
    status: 'published',
    eligibilityCriteria: ['SIRA license mandatory', 'Min 5 years experience'],
    attachments: [{ name: 'Security_SOP.pdf', url: '#' }],
    estimatedBudget: 'AED 240,000',
    projectStartDate: '2026-06-01',
    projectEndDate: '2028-06-01',
    milestones: [
      { title: 'Contract Commencement', date: '2026-06-01' },
      { title: 'Annual Review 1', date: '2027-06-01' },
      { title: 'Contract Completion', date: '2028-06-01' }
    ],
    visibility: 'open',
    technicalProposalRequired: 'no'
  },
  {
    id: 'TEND-004',
    title: 'EV Charging Station Network',
    category: ['Contracting & Maintenance'],
    description: 'Establishment of EV charging points across all parking lots',
    scopeOfWork: 'Installation of 20 fast-charging points and management software',
    timeline: '5 months',
    submissionDeadline: '2026-05-20',
    createdAt: '2026-05-10',
    status: 'published',
    eligibilityCriteria: ['Electrical license', 'Smart city tech experience'],
    attachments: [{ name: 'EV_Specs.pdf', url: '#' }],
    estimatedBudget: 'AED 150,000',
    projectStartDate: '2026-06-15',
    projectEndDate: '2026-11-15',
    milestones: [
      { title: 'Civil Works', date: '2026-07-15' },
      { title: 'Charger Installation', date: '2026-09-15' },
      { title: 'Software Integration', date: '2026-11-01' }
    ],
    visibility: 'open',
    technicalProposalRequired: 'yes'
  },
  {
    id: 'TEND-005',
    title: 'Office Renovation Project',
    category: ['Contracting & Maintenance', 'Building Materials', 'Equipment & Machinery'],
    description: 'Interior renovation and fit-out for 2nd floor offices',
    scopeOfWork: 'Demolition, partition installation, electrical and MEP works',
    timeline: '3 months',
    submissionDeadline: '2026-04-15',
    createdAt: '2026-03-20',
    status: 'published',
    eligibilityCriteria: ['Valid trade license', 'Grade A contractor'],
    attachments: [{ name: 'Design_Layout.pdf', url: '#' }],
    estimatedBudget: 'AED 350,005',
    projectStartDate: '2026-05-01',
    projectEndDate: '2026-08-01',
    milestones: [
      { title: 'Demolition', date: '2026-05-15' },
      { title: 'Fit-out Works', date: '2026-07-01' },
      { title: 'Handover', date: '2026-08-01' }
    ],
    visibility: 'restricted',
    technicalProposalRequired: 'yes'
  },
  {
    id: 'TEND-006',
    title: 'Annual Security Audit 2026',
    category: ['IT Hardware & Software'],
    description: 'Comprehensive cybersecurity audit and penetration testing for all digital assets',
    scopeOfWork: 'Vulnerability assessment, network penetration testing, and compliance reporting',
    timeline: '2 months',
    submissionDeadline: '2026-08-30',
    createdAt: '2026-05-15',
    status: 'draft',
    eligibilityCriteria: ['CREST certified', 'Proven track record in financial sector'],
    attachments: [],
    estimatedBudget: 'AED 90,000',
    projectStartDate: '2026-09-01',
    projectEndDate: '2026-11-01',
    milestones: [
      { title: 'Assessment Commencement', date: '2026-09-05' },
      { title: 'Vulnerability Scanning', date: '2026-09-30' },
      { title: 'Final Report Delivery', date: '2026-10-25' }
    ],
    visibility: 'open',
    technicalProposalRequired: 'yes'
  },
  {
    id: 'TEND-007',
    title: 'Closed Tender Sample',
    category: ['IT Hardware & Software'],
    description: 'Sample closed Tender for testing.',
    scopeOfWork: 'N/A',
    timeline: 'N/A',
    submissionDeadline: '2026-05-01',
    createdAt: '2026-04-01',
    status: 'closed',
    eligibilityCriteria: [],
    attachments: [],
    estimatedBudget: 'AED 50,000',
    projectStartDate: '2026-05-01',
    projectEndDate: '2026-06-01',
    milestones: [],
    technicalProposalRequired: 'no'
  },
  {
    id: 'TEND-008',
    title: 'HQ Security Systems Upgrade',
    category: ['Equipment & Machinery', 'IT Hardware & Software'],
    description: 'Upgrade of physical security systems, access gates, and CCTV surveillance at HQ.',
    scopeOfWork: 'Supply, installation, and configuration of access controllers and IP cameras.',
    timeline: '3 months',
    submissionDeadline: '2026-05-20',
    createdAt: '2026-04-15',
    status: 'published',
    eligibilityCriteria: ['SIRA certified installation contractor', 'Minimum 3 years experience'],
    attachments: [],
    estimatedBudget: 'AED 350,000',
    projectStartDate: '2026-06-01',
    projectEndDate: '2026-09-01',
    milestones: [],
    visibility: 'open',
    technicalProposalRequired: 'yes'
  },
  {
    id: 'TEND-009',
    title: 'Ergonomic Office Chairs Supply',
    category: ['Building Materials', 'Equipment & Machinery'],
    description: 'Bulk supply of ergonomic office chairs for executive and staff offices at HQ.',
    scopeOfWork: 'Supply and delivery of 120 ergonomic task chairs.',
    timeline: '1 month',
    submissionDeadline: '2026-05-25',
    createdAt: '2026-04-20',
    status: 'published',
    eligibilityCriteria: ['Must provide sample unit for testing', '5-year local warranty'],
    attachments: [],
    estimatedBudget: 'AED 150,000',
    projectStartDate: '2026-06-10',
    projectEndDate: '2026-07-10',
    milestones: [],
    visibility: 'open',
    technicalProposalRequired: 'no'
  }
];

// Initial default proposals
const initialProposals: Proposal[] = [
  // TEND-001 has 3 proposals
  {
    id: 'PROP-100',
    tenderId: 'TEND-001',
    tenderTitle: 'Supply of IT Hardware for HQ',
    vendorId: 'VEN-001',
    vendorName: 'TechSolutions LLC',
    status: 'commercial_review_completed',
    submissionDate: '2026-06-01',
    technicalProposal: `1. Executive Summary\nWe propose a comprehensive IT hardware refresh utilizing enterprise-grade Dell Latitude series laptops and Precision workstations.\n\n2. Architecture & Deployment Strategy\n- Staged rollout over 4 weeks to minimize operational disruption.\n- Pre-imaging of all machines with FNRC's custom corporate image (Windows 11 Enterprise + Security Stack).\n- Asset tagging and integration into existing ServiceNow CMDB prior to delivery.\n\n3. Value Addition\nIncluded 3-year ProSupport Plus with Next Business Day onsite service and Accidental Damage Protection.`,
    commercialAmount: 420000,
    technicalStatus: 'approved',
    commercialStatus: 'approved',
    technicalReviewer: 'Mohammed Al Zaabi',
    commercialReviewer: 'Sarah Al Hosani',
    paymentTerms: `- 30% Advance Payment upon LPO issuance and contract signing.\n- 50% Milestone Payment upon successful delivery and physical verification of all hardware at FNRC HQ.\n- 20% Final Payment upon completion of user migration, old asset retrieval, and final project sign-off.`
  },
  {
    id: 'PROP-101',
    tenderId: 'TEND-001',
    tenderTitle: 'Supply of IT Hardware for HQ',
    vendorId: 'VEN-002',
    vendorName: 'Modern Office Furnishings',
    status: 'approved',
    submissionDate: '2026-06-02',
    approvedDate: '2026-06-15',
    technicalProposal: `1. Technical Proposal Overview\nWe propose standard enterprise hardware package using high-durability modern workstations and ultrabooks.\n\n2. Service & Support SLA\n- 24/7 dedicated support desk access.\n- Staged implementation within 4 weeks.`,
    commercialAmount: 395000,
    technicalStatus: 'approved',
    commercialStatus: 'approved',
    deliveryTimeline: '4 weeks',
    paymentTerms: `- 20% Advance Payment upon LPO issuance and contract signing.\n- 60% Milestone Payment upon successful delivery and setup.\n- 20% Final Payment after UAT and sign-off.`,
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
    tenderId: 'TEND-001',
    tenderTitle: 'Supply of IT Hardware for HQ',
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

  // TEND-002 has 1 proposal
  {
    id: 'PROP-102',
    tenderId: 'TEND-002',
    tenderTitle: 'Cloud Migration Services',
    vendorId: 'VEN-001',
    vendorName: 'TechSolutions LLC',
    status: 'technical_correction_requested',
    submissionDate: '2026-05-10',
    technicalProposal: `1. Cloud Strategy Overview\nWe recommend a Hybrid Cloud architecture utilizing Microsoft Azure Stack Hub to ensure data sovereignty while leveraging scalable cloud services.\n\n2. Migration Methodology\n- Phase 1: Assessment and Discovery using Azure Migrate.\n- Phase 2: Foundation setup (Landing Zones, ExpressRoute networking).\n- Phase 3: Workload migration (Rehost, Refactor where applicable).\n\n3. Redundancy & Continuity\n- Active-Passive Disaster Recovery setup.\n- (NOTE: Further details regarding multi-zone failover mechanisms are currently pending as per reviewer request.)`,
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
    paymentTerms: `- 15% Mobilization Advance.\n- 25% Upon completion of Phase 1 (Assessment).\n- 40% Upon successful workload migration (Phase 3).\n- 20% Upon UAT sign-off and project handover.`,
    warranty: '1 year post-migration support',
    vendorContact: 'contact@techsolutions.ae'
  },

  // TEND-003 has 1 proposal
  {
    id: 'PROP-103',
    tenderId: 'TEND-003',
    tenderTitle: 'Security Guard Services',
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

  // TEND-004 has 1 proposal
  {
    id: 'PROP-104',
    tenderId: 'TEND-004',
    tenderTitle: 'EV Charging Station Network',
    vendorId: 'VEN-002',
    vendorName: 'Modern Office Furnishings',
    status: 'approved',
    submissionDate: '2026-05-18',
    approvedDate: '2026-05-25',
    technicalProposal: 'Complete installation of 20 fast-charging units',
    commercialAmount: 850000,
    technicalStatus: 'approved',
    commercialStatus: 'approved',
    remarks: 'Approved for final rollout.'
  },

  // TEND-005 has 2 proposals
  {
    id: 'PROP-105',
    tenderId: 'TEND-005',
    tenderTitle: 'Office Renovation Project',
    vendorId: 'VEN-001',
    vendorName: 'TechSolutions LLC',
    status: 'approved',
    submissionDate: '2026-04-10',
    technicalProposal: 'Modern open-plan office renovation with sustainable materials',
    commercialAmount: 600000,
    remarks: 'Proposal approved for final negotiation.',
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
    tenderId: 'TEND-005',
    tenderTitle: 'Office Renovation Project',
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
    tenderId: 'TEND-001',
    tenderTitle: 'Supply of IT Hardware for HQ',
    vendorId: 'VEN-002',
    vendorName: 'Modern Office Furnishings',
    status: 'submitted',
    submissionDate: '2026-04-14',
    technicalProposal: 'Premium office furniture setup and ergonomic design',
    commercialAmount: 480000,
    technicalStatus: 'pending',
    commercialStatus: 'pending'
  },
  {
    id: 'PROP-108',
    tenderId: 'TEND-008',
    tenderTitle: 'HQ Security Systems Upgrade',
    vendorId: 'VEN-001',
    vendorName: 'TechSolutions LLC',
    status: 'approved',
    submissionDate: '2026-05-15',
    approvedDate: '2026-05-28',
    technicalProposal: 'State-of-the-art IP camera system and biometric access gates.',
    commercialAmount: 320000,
    technicalStatus: 'approved',
    commercialStatus: 'approved',
    remarks: 'Approved for direct procurement.'
  },
  {
    id: 'PROP-109',
    tenderId: 'TEND-009',
    tenderTitle: 'Ergonomic Office Chairs Supply',
    vendorId: 'VEN-002',
    vendorName: 'Modern Office Furnishings',
    status: 'approved',
    submissionDate: '2026-05-22',
    approvedDate: '2026-05-30',
    technicalProposal: 'High-back ergonomic mesh chairs with multi-adjustable arms.',
    commercialAmount: 138000,
    technicalStatus: 'approved',
    commercialStatus: 'approved',
    remarks: 'Selected based on quality and price matching.'
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
        const parsed = JSON.parse(saved) as any[];
        let needsSave = false;

        // Migration for RFP to Tender terminology
        parsed.forEach(p => {
          if (p.rfpId) { p.tenderId = p.rfpId; delete p.rfpId; needsSave = true; }
          if (p.tenderId && p.tenderId.startsWith('RFP-')) { p.tenderId = p.tenderId.replace('RFP-', 'TEND-'); needsSave = true; }
          if (p.rfpTitle) { p.tenderTitle = p.rfpTitle; delete p.rfpTitle; needsSave = true; }
        });

        const p100 = parsed.find(p => p.id === 'PROP-100');
        if (p100 && p100.status !== 'commercial_review_completed') {
          p100.status = 'commercial_review_completed';
          p100.technicalStatus = 'approved';
          p100.commercialStatus = 'approved';
          p100.technicalReviewer = 'Mohammed Al Zaabi';
          p100.commercialReviewer = 'Sarah Al Hosani';
          needsSave = true;
        }
        const p101 = parsed.find(p => p.id === 'PROP-101');
        if (p101) {
          let updated = false;
          if (p101.status !== 'approved') {
            p101.status = 'approved';
            updated = true;
          }
          if (p101.technicalStatus !== 'approved') {
            p101.technicalStatus = 'approved';
            updated = true;
          }
          if (p101.commercialStatus !== 'approved') {
            p101.commercialStatus = 'approved';
            updated = true;
          }
          if (!p101.deliveryTimeline) {
            p101.deliveryTimeline = '4 weeks';
            updated = true;
          }
          if (!p101.paymentTerms) {
            p101.paymentTerms = `- 20% Advance Payment upon LPO issuance and contract signing.\n- 60% Milestone Payment upon successful delivery and setup.\n- 20% Final Payment after UAT and sign-off.`;
            updated = true;
          }
          if (!p101.technicalProposal || p101.technicalProposal === 'Standard enterprise hardware package') {
            p101.technicalProposal = `1. Technical Proposal Overview\nWe propose standard enterprise hardware package using high-durability modern workstations and ultrabooks.\n\n2. Service & Support SLA\n- 24/7 dedicated support desk access.\n- Staged implementation within 4 weeks.`;
            updated = true;
          }
          if (updated) {
            needsSave = true;
          }
        }
        const newProps = initialProposals.filter(ip => !parsed.find(p => p.id === ip.id));
        if (newProps.length > 0) {
          parsed.push(...newProps);
          needsSave = true;
        }
        if (needsSave) {
          localStorage.setItem('mock_proposals', JSON.stringify(parsed));
        }
        return parsed as Proposal[];
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
    role: 'technical_department',
    status: 'active',
    createdDate: '2026-03-01'
  },
  {
    id: 'ADM-004',
    name: 'Sarah Al Hosani',
    email: 'sarah.alhosani@fnrc.gov.ae',
    role: 'commercial_department',
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
  { name: 'Bank Guarantee', type: 'Tender', mandatory: 'Yes', status: 'Active' },
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
    permissions: ['vendor_management', 'tender_management', 'proposal_management', 'item_management']
  },
  {
    name: 'Reviewer',
    value: 'reviewer',
    permissions: ['proposal_commercial_and_technical_reviewer']
  },
  {
    name: 'Item Manager',
    value: 'item_manager',
    permissions: ['item_management']
  }
];

// Mock ERP Documents for approved vendors
export const mockERPDocuments: ERPDocument[] = [
  {
    id: 'DOC-001',
    tenderId: 'TEND-005',
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
    tenderId: 'TEND-005',
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
    tenderId: 'TEND-001',
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
    tenderId: 'TEND-001',
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
    tenderId: 'TEND-005',
    tenderTitle: 'Office Renovation Project',
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
  },
  {
    id: 'REV-002',
    tenderId: 'TEND-001',
    tenderTitle: 'Supply of IT Hardware for HQ',
    vendorId: 'VEN-004',
    vendorName: 'ABC Trading',
    reviewedBy: 'Mohammed Al Zaabi',
    reviewDate: '2026-06-05',
    overallRating: 2.0,
    qualityRating: 2,
    timelinessRating: 3,
    communicationRating: 2,
    complianceRating: 1,
    comments: 'Hardware specifications fell significantly short of the minimum baseline requirements. Critical features such as advanced security chips and processing power were missing.'
  },
  {
    id: 'REV-003',
    tenderId: 'TEND-001',
    tenderTitle: 'Supply of IT Hardware for HQ',
    vendorId: 'VEN-004',
    vendorName: 'ABC Trading',
    reviewedBy: 'Sarah Al Hosani',
    reviewDate: '2026-06-06',
    overallRating: 1.5,
    qualityRating: 2,
    timelinessRating: 2,
    communicationRating: 3,
    complianceRating: 1,
    comments: 'The pricing was low, but the proposed hardware lacks long-term value and does not meet our required lifespan criteria. Cannot proceed with this vendor.'
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