export const projectsData = [
  {
    id: 'devojas-city',
    name: 'Devojas City',
    tagline: "Varanasi's Premier Residential Township Project",
    location: 'Kaithi Toll Plaza & Markandeya Mahadev Corridor, Bhandaha Kalan, Ghazipur Road, Varanasi',
    description: 'Devojas City is a state-of-the-art residential plot development project offering premium plots of sizes 1000 SF and 1600 SF. Located along the main Ghazipur-Varanasi Highway (NH) right near Kaithi Toll Plaza and 1.5 KM from Markandeya Mahadev Mandir, the project features robust infrastructure, secure gated boundaries, and close proximity to holy temples and schools.',
    sizes: ['1000 SF', '1600 SF'],
    roads: ['20 Ft', '25 Ft', '30 Ft', '40 Ft'],
    priceLabel: 'Starting from ₹10.9 Lacs*',
    imageUrl: '/assets/layout_plan.png',
    pdfUrl: '/assets/devojas_city_layout.pdf',
    reraApproved: true,
    stats: {
      totalPlots: 72,
      soldPlots: 48,
      bookedPlots: 6,
      availablePlots: 18
    },
    landmarks: [
      { name: 'Kaithi NHAI Toll Plaza', distance: '0.5 KM / 1 Min' },
      { name: 'Markandey Mahadev Mandir (Sangam)', distance: '1.5 KM / 3 Min' },
      { name: 'ICB Public School', distance: 'Adjacent / 0 Min' },
      { name: 'Swarved Mahamandir', distance: '16 KM / 18 Min' },
      { name: 'Varanasi Junction (Cantt)', distance: '28 KM / 35 Min' },
      { name: 'Lal Bahadur Shastri Airport', distance: '42 KM / 50 Min' }
    ],
    features: [
      'Immediate Registry & Mutation (Khatauni)',
      'Direct access to Kaithi NHAI Toll Plaza & 4-lane Highway',
      '1.5 KM from Markandeya Mahadev Temple Corridor',
      'Secure gated township boundary wall outline',
      'Electricity poles and street lights installed',
      'Underground water drainage network',
      'Wide arterial roads (20, 25, 30 & 40 ft wide)',
      'Future extension blocks for commercial expansion',
      'Dedicated green park area & kids play zone',
      '100% dispute-free land with clear title registry',
      'Adjacent to premier public school (ICB School)'
    ],
    // Individual Plot Inventory (Matches Backend Database Schema)
    plots: [
      { id: 'DC-101', plotNo: 101, block: 'Block A', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'East (Main Road)', roadWidth: '30 Ft', price: '₹12.50 Lacs', status: 'Available', isCorner: true },
      { id: 'DC-102', plotNo: 102, block: 'Block A', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'East', roadWidth: '30 Ft', price: '₹11.90 Lacs', status: 'Sold', isCorner: false },
      { id: 'DC-103', plotNo: 103, block: 'Block A', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'East', roadWidth: '30 Ft', price: '₹11.90 Lacs', status: 'Sold', isCorner: false },
      { id: 'DC-104', plotNo: 104, block: 'Block A', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'East', roadWidth: '30 Ft', price: '₹11.90 Lacs', status: 'Available', isCorner: false },
      { id: 'DC-105', plotNo: 105, block: 'Block A', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'East', roadWidth: '30 Ft', price: '₹11.90 Lacs', status: 'Booked', isCorner: false },
      { id: 'DC-106', plotNo: 106, block: 'Block A', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'North-East', roadWidth: '25 Ft', price: '₹12.20 Lacs', status: 'Available', isCorner: true },
      { id: 'DC-107', plotNo: 107, block: 'Block A', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'North', roadWidth: '25 Ft', price: '₹11.50 Lacs', status: 'Sold', isCorner: false },
      { id: 'DC-108', plotNo: 108, block: 'Block A', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'North', roadWidth: '25 Ft', price: '₹11.50 Lacs', status: 'Sold', isCorner: false },
      
      { id: 'DC-201', plotNo: 201, block: 'Block B (Park Facing)', size: '1600 SF', dimensions: '32 x 50 Ft', facing: 'Park Facing (North)', roadWidth: '40 Ft', price: '₹19.20 Lacs', status: 'Available', isCorner: true },
      { id: 'DC-202', plotNo: 202, block: 'Block B (Park Facing)', size: '1600 SF', dimensions: '32 x 50 Ft', facing: 'Park Facing (North)', roadWidth: '40 Ft', price: '₹18.50 Lacs', status: 'Sold', isCorner: false },
      { id: 'DC-203', plotNo: 203, block: 'Block B (Park Facing)', size: '1600 SF', dimensions: '32 x 50 Ft', facing: 'Park Facing (North)', roadWidth: '40 Ft', price: '₹18.50 Lacs', status: 'Booked', isCorner: false },
      { id: 'DC-204', plotNo: 204, block: 'Block B (Park Facing)', size: '1600 SF', dimensions: '32 x 50 Ft', facing: 'Park Facing (North)', roadWidth: '40 Ft', price: '₹18.50 Lacs', status: 'Available', isCorner: false },
      { id: 'DC-205', plotNo: 205, block: 'Block B', size: '1600 SF', dimensions: '32 x 50 Ft', facing: 'West', roadWidth: '25 Ft', price: '₹17.80 Lacs', status: 'Sold', isCorner: false },
      { id: 'DC-206', plotNo: 206, block: 'Block B', size: '1600 SF', dimensions: '32 x 50 Ft', facing: 'West', roadWidth: '25 Ft', price: '₹17.80 Lacs', status: 'Sold', isCorner: false },
      { id: 'DC-207', plotNo: 207, block: 'Block B', size: '1600 SF', dimensions: '32 x 50 Ft', facing: 'West (Corner)', roadWidth: '25 Ft', price: '₹18.20 Lacs', status: 'Available', isCorner: true },

      { id: 'DC-301', plotNo: 301, block: 'Block C (Highway Access)', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'South-East', roadWidth: '30 Ft', price: '₹12.00 Lacs', status: 'Available', isCorner: true },
      { id: 'DC-302', plotNo: 302, block: 'Block C', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'South', roadWidth: '20 Ft', price: '₹10.90 Lacs', status: 'Sold', isCorner: false },
      { id: 'DC-303', plotNo: 303, block: 'Block C', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'South', roadWidth: '20 Ft', price: '₹10.90 Lacs', status: 'Sold', isCorner: false },
      { id: 'DC-304', plotNo: 304, block: 'Block C', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'South', roadWidth: '20 Ft', price: '₹10.90 Lacs', status: 'Available', isCorner: false },
      { id: 'DC-305', plotNo: 305, block: 'Block C', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'South', roadWidth: '20 Ft', price: '₹10.90 Lacs', status: 'Booked', isCorner: false },
      { id: 'DC-306', plotNo: 306, block: 'Block C', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'East', roadWidth: '20 Ft', price: '₹11.20 Lacs', status: 'Available', isCorner: false },
      { id: 'DC-307', plotNo: 307, block: 'Block C', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'East', roadWidth: '20 Ft', price: '₹11.20 Lacs', status: 'Sold', isCorner: false },
      { id: 'DC-308', plotNo: 308, block: 'Block C', size: '1000 SF', dimensions: '25 x 40 Ft', facing: 'East (Corner)', roadWidth: '25 Ft', price: '₹11.80 Lacs', status: 'Available', isCorner: true }
    ]
  },
  {
    id: 'devojas-enclave',
    name: 'Devojas Enclave',
    tagline: 'Premium Residential Plotting Near Swarved Mahamandir',
    location: 'Umaraha, Near Swarved Mahamandir, Ghazipur Road, Varanasi',
    description: 'Devojas Enclave offers highly desirable residential plots of sizes 1200 SF and 1500 SF. Nestled in a peaceful and spiritual environment near the world-famous Swarved Mahamandir, this gated community comes with complete street layouts, clean documentation, and instant khatauni registries.',
    sizes: ['1200 SF', '1500 SF'],
    roads: ['20 Ft', '25 Ft', '30 Ft'],
    priceLabel: 'Starting from ₹14.5 Lacs*',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
    pdfUrl: '/assets/devojas_city_layout.pdf',
    reraApproved: true,
    stats: {
      totalPlots: 45,
      soldPlots: 32,
      bookedPlots: 3,
      availablePlots: 10
    },
    landmarks: [
      { name: 'Swarved Mahamandir', distance: '1 KM / 3 Min' },
      { name: 'DPS Varanasi School', distance: '4 KM / 8 Min' },
      { name: 'Varanasi Junction (Cantt)', distance: '18 KM / 25 Min' },
      { name: 'Lal Bahadur Shastri Airport', distance: '34 KM / 45 Min' }
    ],
    features: [
      'Immediate Registry & Mutation',
      'Gated main entrance with security cabin',
      'Internal road lights & electricity setup',
      'Green tree plantations on all roads',
      '20 & 30 feet wide internal roads',
      '100% legal title clearance'
    ],
    plots: [
      { id: 'DE-101', plotNo: 101, block: 'Phase 1', size: '1200 SF', dimensions: '30 x 40 Ft', facing: 'East', roadWidth: '30 Ft', price: '₹15.60 Lacs', status: 'Available', isCorner: true },
      { id: 'DE-102', plotNo: 102, block: 'Phase 1', size: '1200 SF', dimensions: '30 x 40 Ft', facing: 'East', roadWidth: '25 Ft', price: '₹14.50 Lacs', status: 'Sold', isCorner: false },
      { id: 'DE-103', plotNo: 103, block: 'Phase 1', size: '1200 SF', dimensions: '30 x 40 Ft', facing: 'East', roadWidth: '25 Ft', price: '₹14.50 Lacs', status: 'Sold', isCorner: false },
      { id: 'DE-104', plotNo: 104, block: 'Phase 1', size: '1200 SF', dimensions: '30 x 40 Ft', facing: 'North', roadWidth: '25 Ft', price: '₹14.80 Lacs', status: 'Available', isCorner: false },
      { id: 'DE-105', plotNo: 105, block: 'Phase 1', size: '1500 SF', dimensions: '30 x 50 Ft', facing: 'North (Corner)', roadWidth: '30 Ft', price: '₹19.50 Lacs', status: 'Booked', isCorner: true },
      { id: 'DE-106', plotNo: 106, block: 'Phase 1', size: '1500 SF', dimensions: '30 x 50 Ft', facing: 'North', roadWidth: '30 Ft', price: '₹18.75 Lacs', status: 'Sold', isCorner: false },
      { id: 'DE-107', plotNo: 107, block: 'Phase 1', size: '1500 SF', dimensions: '30 x 50 Ft', facing: 'West', roadWidth: '20 Ft', price: '₹17.90 Lacs', status: 'Available', isCorner: false },
      { id: 'DE-108', plotNo: 108, block: 'Phase 1', size: '1200 SF', dimensions: '30 x 40 Ft', facing: 'West', roadWidth: '20 Ft', price: '₹14.50 Lacs', status: 'Sold', isCorner: false }
    ]
  }
];
