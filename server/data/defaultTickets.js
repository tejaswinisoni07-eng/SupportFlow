export const DEFAULT_TICKETS = [
  {
    id: "SF-1001",
    customerName: "Elena Rostova",
    customerEmail: "elena.rostova@acmecorp.io",
    subject: "Duplicate charge on annual enterprise subscription invoice",
    description: "Our finance department noticed two identical charges of $1,200 on our corporate credit card on October 25th for invoice #INV-9842. Please reverse the duplicate billing immediately and provide an updated receipt.",
    category: "Billing",
    priority: "Urgent",
    status: "In Progress",
    assignedTo: "Sarah Chen",
    isSample: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    replies: [
      {
        id: "rep-1",
        sender: "customer",
        authorName: "Elena Rostova",
        message: "Our finance department noticed two identical charges of $1,200 on our corporate credit card on October 25th for invoice #INV-9842. Please reverse the duplicate billing immediately and provide an updated receipt.",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: "rep-2",
        sender: "agent",
        authorName: "Sarah Chen",
        message: "Hello Elena, thank you for reaching out. I have verified your account and can confirm the duplicate transaction was flagged by our payment gateway. I have initiated a refund of $1,200 back to the original card ending in 4118. Funds should reflect in 3-5 business days.",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ]
  },
  {
    id: "SF-1002",
    customerName: "David Miller",
    customerEmail: "d.miller@techsolutions.com",
    subject: "Production API endpoint returning 504 Gateway Timeout",
    description: "Since 14:00 UTC today, all POST requests to /api/v2/webhooks are hanging for 60 seconds before failing with 504 Gateway Timeout. This is blocking our core customer sync pipeline. Our error logs show 412 dropped payloads.",
    category: "Technical",
    priority: "Urgent",
    status: "Open",
    assignedTo: "Marcus Vance",
    isSample: true,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    replies: [
      {
        id: "rep-3",
        sender: "customer",
        authorName: "David Miller",
        message: "Since 14:00 UTC today, all POST requests to /api/v2/webhooks are hanging for 60 seconds before failing with 504 Gateway Timeout. This is blocking our core customer sync pipeline. Our error logs show 412 dropped payloads.",
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      }
    ]
  },
  {
    id: "SF-1003",
    customerName: "Priya Sharma",
    customerEmail: "priya.s@clouddynamics.org",
    subject: "Emergency MFA reset required for lead administrator",
    description: "Our company recently migrated phone carriers and our primary IT administrator lost access to the hardware authenticator app. We need to reset MFA for admin@clouddynamics.org so we can approve employee access requests.",
    category: "Account Access",
    priority: "High",
    status: "Open",
    assignedTo: "Sarah Chen",
    isSample: true,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    replies: [
      {
        id: "rep-4",
        sender: "customer",
        authorName: "Priya Sharma",
        message: "Our company recently migrated phone carriers and our primary IT administrator lost access to the hardware authenticator app. We need to reset MFA for admin@clouddynamics.org so we can approve employee access requests.",
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      }
    ]
  },
  {
    id: "SF-1004",
    customerName: "Alexander Wright",
    customerEmail: "alex.wright@finvault.io",
    subject: "Request for automated CSV / JSON export of compliance audit trails",
    description: "Our annual SOC2 audit requires weekly compliance logs exported automatically to our AWS S3 bucket. Currently we must manually download each page. Could you enable scheduled automated exports or an export API endpoint?",
    category: "Feature Request",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Alex Morgan",
    isSample: true,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    replies: [
      {
        id: "rep-5",
        sender: "customer",
        authorName: "Alexander Wright",
        message: "Our annual SOC2 audit requires weekly compliance logs exported automatically to our AWS S3 bucket. Currently we must manually download each page. Could you enable scheduled automated exports or an export API endpoint?",
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        id: "rep-6",
        sender: "agent",
        authorName: "Alex Morgan",
        message: "Hi Alexander, thank you for this feature suggestion! Our product engineering team currently has automated audit log webhooks scheduled for Q4 release. I have linked your organization to the beta preview program.",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      }
    ]
  },
  {
    id: "SF-1005",
    customerName: "Claire Beauchamp",
    customerEmail: "claire.b@globalhealth.edu",
    subject: "Inquiry on educational pricing discounts and student seat allocations",
    description: "We are expanding our biomedical research team and would like to know if SupportFlow licenses qualify for higher education 50% discount tiers. We are looking to license 35 seats for the spring semester.",
    category: "General Inquiry",
    priority: "Low",
    status: "Open",
    assignedTo: "Unassigned",
    isSample: true,
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    replies: [
      {
        id: "rep-7",
        sender: "customer",
        authorName: "Claire Beauchamp",
        message: "We are expanding our biomedical research team and would like to know if SupportFlow licenses qualify for higher education 50% discount tiers. We are looking to license 35 seats for the spring semester.",
        createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
      }
    ]
  },
  {
    id: "SF-1006",
    customerName: "Liam O'Connor",
    customerEmail: "liam@dublinlogistics.ie",
    subject: "Custom domain SSL certificate handshake error",
    description: "Our custom vanity portal domain support.dublinlogistics.ie shows NET::ERR_CERT_COMMON_NAME_INVALID when accessed by customers. The Let's Encrypt renewal failed yesterday.",
    category: "Technical",
    priority: "High",
    status: "Resolved",
    assignedTo: "Marcus Vance",
    isSample: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    replies: [
      {
        id: "rep-8",
        sender: "customer",
        authorName: "Liam O'Connor",
        message: "Our custom vanity portal domain support.dublinlogistics.ie shows NET::ERR_CERT_COMMON_NAME_INVALID when accessed by customers. The Let's Encrypt renewal failed yesterday.",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        id: "rep-9",
        sender: "agent",
        authorName: "Marcus Vance",
        message: "Hi Liam, we identified that the DNS CAA record was restricting Let's Encrypt certificate issuance. We updated the certificate challenge and reissued a fresh wildcard SSL cert. Verification has succeeded.",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      }
    ]
  },
  {
    id: "SF-1007",
    customerName: "Siddharth Verma",
    customerEmail: "s.verma@apexretail.in",
    subject: "Billing contact email change and GST invoice revision",
    description: "Please update the accounts payable recipient email to accounts@apexretail.in and regenerate the tax invoice for September with the updated GSTIN format.",
    category: "Billing",
    priority: "Medium",
    status: "Closed",
    assignedTo: "Sarah Chen",
    isSample: true,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    replies: [
      {
        id: "rep-10",
        sender: "customer",
        authorName: "Siddharth Verma",
        message: "Please update the accounts payable recipient email to accounts@apexretail.in and regenerate the tax invoice for September with the updated GSTIN format.",
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
      {
        id: "rep-11",
        sender: "agent",
        authorName: "Sarah Chen",
        message: "Hello Siddharth, the billing email has been updated and the revised September invoice with your GSTIN number has been dispatched to accounts@apexretail.in. Closing this ticket as resolved.",
        createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
      }
    ]
  }
];
