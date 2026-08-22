// prisma/seed.ts
import { PrismaClient, PropertyType, PropertyPurpose, PropertyStatus, FurnishingStatus, PossessionStatus, LeadScore, LeadStatus, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@3srealestate.com' },
    update: {},
    create: {
      email: 'admin@3srealestate.com',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      phone: '+918872520002',
    },
  })

  // Create agent
  const agent = await prisma.user.upsert({
    where: { email: 'agent@3srealestate.com' },
    update: {},
    create: {
      email: 'agent@3srealestate.com',
      name: 'Rahul Sharma',
      password: hashedPassword,
      role: Role.AGENT,
      phone: '+918872520003',
    },
  })

  console.log('✅ Users created')

  // Blog categories
  const categories = await Promise.all([
    prisma.blogCategory.upsert({
      where: { slug: 'market-trends' },
      update: {},
      create: { name: 'Market Trends', slug: 'market-trends' },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'investment-guide' },
      update: {},
      create: { name: 'Investment Guide', slug: 'investment-guide' },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'nri-corner' },
      update: {},
      create: { name: 'NRI Corner', slug: 'nri-corner' },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'lifestyle' },
      update: {},
      create: { name: 'Lifestyle', slug: 'lifestyle' },
    }),
  ])

  console.log('✅ Blog categories created')

  // Properties
  const properties = [
    {
      title: 'Luxury 4BHK Villa in New Chandigarh',
      slug: 'luxury-4bhk-villa-new-chandigarh',
      description: 'Experience unparalleled luxury in this stunning 4BHK villa situated in the heart of New Chandigarh. Featuring Italian marble flooring, modular kitchen, and a private swimming pool, this property redefines premium living.',
      type: PropertyType.VILLA,
      purpose: PropertyPurpose.SALE,
      status: PropertyStatus.AVAILABLE,
      price: 32500000,
      priceLabel: '3.25 Cr',
      area: 3200,
      bedrooms: 4,
      bathrooms: 5,
      parking: 3,
      furnishing: FurnishingStatus.FULLY_FURNISHED,
      possession: PossessionStatus.READY_TO_MOVE,
      isFeatured: true,
      isLuxury: true,
      investmentReturn: 12.5,
      city: 'New Chandigarh',
      locality: 'Mullanpur',
      address: 'Sector 2, Mullanpur, New Chandigarh, Punjab 140901',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      builderName: 'DLF Premium Homes',
      metaTitle: 'Luxury 4BHK Villa in New Chandigarh | 3S Real Estate',
      metaDescription: 'Buy premium 4BHK luxury villa in New Chandigarh at ₹3.25 Cr. Italian marble, private pool, fully furnished. Contact 3S Real Estate.',
    },
    {
      title: 'Premium 3BHK Flat in Mohali Sector 70',
      slug: 'premium-3bhk-flat-mohali-sector-70',
      description: 'A beautifully designed 3BHK apartment in the thriving Sector 70 of Mohali. Close to IT hub, schools, and hospitals. Perfect for IT professionals and families.',
      type: PropertyType.FLAT,
      purpose: PropertyPurpose.SALE,
      status: PropertyStatus.AVAILABLE,
      price: 8500000,
      priceLabel: '85 Lac',
      area: 1650,
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
      furnishing: FurnishingStatus.SEMI_FURNISHED,
      possession: PossessionStatus.READY_TO_MOVE,
      isFeatured: true,
      isLuxury: false,
      investmentReturn: 9.0,
      city: 'Mohali',
      locality: 'Sector 70',
      address: 'Sector 70, SAS Nagar, Mohali, Punjab 160070',
      coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      builderName: 'Emaar MGF',
      metaTitle: '3BHK Flat in Mohali Sector 70 | 3S Real Estate',
      metaDescription: 'Buy 3BHK flat in Mohali Sector 70 at ₹85 Lac. Semi-furnished, ready to move. Near IT park. Contact 3S Real Estate.',
    },
    {
      title: 'Commercial Shop in Zirakpur',
      slug: 'commercial-shop-zirakpur-airport-road',
      description: 'Prime commercial space on the bustling Airport Road, Zirakpur. High footfall area, perfect for retail, showroom, or office setup. Excellent ROI potential.',
      type: PropertyType.COMMERCIAL,
      purpose: PropertyPurpose.SALE,
      status: PropertyStatus.AVAILABLE,
      price: 4500000,
      priceLabel: '45 Lac',
      area: 600,
      bathrooms: 1,
      parking: 2,
      possession: PossessionStatus.READY_TO_MOVE,
      isFeatured: true,
      isLuxury: false,
      investmentReturn: 15.0,
      city: 'Zirakpur',
      locality: 'Airport Road',
      address: 'Airport Road, Zirakpur, Punjab 140603',
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      builderName: 'Independent',
      metaTitle: 'Commercial Shop in Zirakpur Airport Road | 3S Real Estate',
      metaDescription: 'Buy commercial shop in Zirakpur Airport Road at ₹45 Lac. High footfall area, ready possession. Contact 3S Real Estate.',
    },
    {
      title: 'Residential Plot in Kharar',
      slug: 'residential-plot-kharar-landran-road',
      description: 'RERA-approved residential plot in the fast-developing Kharar-Landran Road. Excellent connectivity to Chandigarh and Mohali. Clear title, bank loan available.',
      type: PropertyType.PLOT,
      purpose: PropertyPurpose.SALE,
      status: PropertyStatus.AVAILABLE,
      price: 3200000,
      priceLabel: '32 Lac',
      area: 500,
      areaUnit: 'sqyd',
      parking: 2,
      possession: PossessionStatus.READY_TO_MOVE,
      isFeatured: false,
      isLuxury: false,
      investmentReturn: 20.0,
      city: 'Kharar',
      locality: 'Landran Road',
      address: 'Landran Road, Kharar, Punjab 140301',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      builderName: 'Punjab Plots Authority',
      metaTitle: 'Residential Plot in Kharar | 3S Real Estate',
      metaDescription: 'Buy RERA-approved residential plot in Kharar at ₹32 Lac. 500 sqyd, clear title. Contact 3S Real Estate.',
    },
    {
      title: '2BHK Rental Flat in Chandigarh Sector 34',
      slug: '2bhk-rental-flat-chandigarh-sector-34',
      description: 'Fully furnished 2BHK flat available for rent in the prime Sector 34, Chandigarh. Walking distance to markets, hospitals, and restaurants. Ideal for professionals.',
      type: PropertyType.RENTAL,
      purpose: PropertyPurpose.RENT,
      status: PropertyStatus.AVAILABLE,
      price: 25000,
      priceLabel: '25K/month',
      area: 1200,
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      furnishing: FurnishingStatus.FULLY_FURNISHED,
      possession: PossessionStatus.READY_TO_MOVE,
      isFeatured: true,
      isLuxury: false,
      city: 'Chandigarh',
      locality: 'Sector 34',
      address: 'Sector 34-A, Chandigarh, 160034',
      coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      metaTitle: '2BHK Rental Flat in Chandigarh Sector 34 | 3S Real Estate',
      metaDescription: 'Rent 2BHK fully furnished flat in Chandigarh Sector 34 at ₹25,000/month. Ready to move. Contact 3S Real Estate.',
    },
  ]

  for (const prop of properties) {
    await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {},
      create: {
        ...prop,
        amenities: {
          create: [
            { name: 'Swimming Pool', icon: 'waves' },
            { name: 'Gym', icon: 'dumbbell' },
            { name: '24/7 Security', icon: 'shield' },
            { name: 'Club House', icon: 'building' },
            { name: 'Power Backup', icon: 'zap' },
            { name: 'Parking', icon: 'car' },
          ],
        },
        nearbyFacility: {
          create: [
            { name: 'Fortis Hospital', type: 'hospital', distance: '2.5 km' },
            { name: 'DPS School', type: 'school', distance: '1.2 km' },
            { name: 'Elante Mall', type: 'mall', distance: '5 km' },
            { name: 'Chandigarh Airport', type: 'airport', distance: '8 km' },
          ],
        },
      },
    })
  }

  console.log('✅ Properties created')

  // Leads
  const leadsData = [
    {
      fullName: 'Arjun Kapoor',
      phone: '+918872520002',
      email: 'arjun@email.com',
      budget: '1-2 Cr',
      preferredLocation: 'Mohali',
      propertyType: 'VILLA',
      purpose: 'Investment',
      timeline: 'Immediate',
      status: LeadStatus.INTERESTED,
      score: LeadScore.HOT,
      source: 'website_popup',
    },
    {
      fullName: 'Priya Singh',
      phone: '+91-98001-22222',
      email: 'priya@email.com',
      budget: '50-80 Lac',
      preferredLocation: 'Zirakpur',
      propertyType: 'FLAT',
      purpose: 'Self Use',
      timeline: '3 Months',
      status: LeadStatus.CONTACTED,
      score: LeadScore.WARM,
      source: 'website_popup',
    },
    {
      fullName: 'Rajesh Verma',
      phone: '+91-98001-33333',
      budget: '30-50 Lac',
      preferredLocation: 'Kharar',
      propertyType: 'PLOT',
      purpose: 'Investment',
      timeline: '6 Months',
      status: LeadStatus.NEW,
      score: LeadScore.COLD,
      source: 'contact_form',
    },
  ]

  for (const lead of leadsData) {
    await prisma.lead.create({ data: { ...lead, assignedToId: agent.id } })
  }

  console.log('✅ Leads created')

  // Testimonials
  const testimonials = [
    {
      name: 'Harpreet Singh',
      role: 'IT Professional',
      company: 'Infosys, Mohali',
      content: '3S Real Estate made my dream of owning a home in Mohali a reality. Their team was transparent, professional, and guided me throughout. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Sunita Gupta',
      role: 'Business Owner',
      company: 'Self-Employed, Chandigarh',
      content: 'I was looking for a commercial space in Zirakpur and 3S helped me find the perfect shop at the best price. Their market knowledge is exceptional.',
      rating: 5,
    },
    {
      name: 'NRI Client - Canada',
      role: 'NRI Investor',
      company: 'Toronto, Canada',
      content: 'As an NRI, I was worried about investing in India, but 3S Real Estate handled everything seamlessly. From documentation to possession, they were with me at every step.',
      rating: 5,
    },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t })
  }

  console.log('✅ Testimonials created')

  // Blogs
  await prisma.blog.createMany({
    data: [
      {
        title: 'Why Mohali is the Best City to Invest in Real Estate in 2025',
        slug: 'why-mohali-best-city-invest-real-estate-2025',
        excerpt: 'Mohali has emerged as one of the fastest-growing cities in North India. Here\'s why investing in Mohali real estate is a smart decision in 2025.',
        content: '# Why Mohali is the Best City to Invest in Real Estate\n\nMohali, officially known as SAS Nagar, has transformed dramatically over the past decade...\n\n## IT Hub Growth\n\nWith Infosys, Wipro, and over 500 IT companies setting up offices...\n\n## Infrastructure Development\n\nThe upcoming Metro connectivity and expressway projects...',
        isPublished: true,
        isFeatured: true,
        tags: ['mohali', 'investment', 'real-estate-2025'],
        publishedAt: new Date(),
        metaTitle: 'Why Invest in Mohali Real Estate 2025 | 3S Real Estate',
        metaDescription: 'Discover why Mohali is the top real estate investment destination in 2025. IT hub, infrastructure, and growth potential explained.',
        categoryId: categories[0].id,
      },
      {
        title: 'NRI Guide: How to Buy Property in Chandigarh Tricity',
        slug: 'nri-guide-buy-property-chandigarh-tricity',
        excerpt: 'Complete guide for NRIs looking to invest in Chandigarh Tricity real estate including legal requirements, FEMA guidelines, and trusted steps.',
        content: '# NRI Guide to Buying Property in Chandigarh\n\nAs an NRI, investing in Indian real estate can be...',
        isPublished: true,
        isFeatured: false,
        tags: ['nri', 'chandigarh', 'investment-guide'],
        publishedAt: new Date(),
        metaTitle: 'NRI Property Guide Chandigarh | 3S Real Estate',
        metaDescription: 'Complete NRI guide to buying property in Chandigarh Tricity. Legal requirements, FEMA guidelines, and expert advice.',
        categoryId: categories[2].id,
      },
    ],
  })

  console.log('✅ Blogs created')

  // Site settings
  await prisma.siteSettings.createMany({
    skipDuplicates: true,
    data: [
      { key: 'whatsapp_number', value: '+919876543210', description: 'WhatsApp contact number' },
      { key: 'phone_primary', value: '+91-98765-43210', description: 'Primary phone' },
      { key: 'phone_secondary', value: '+91-98765-43211', description: 'Secondary phone' },
      { key: 'email_primary', value: 'info@3srealestate.com', description: 'Primary email' },
      { key: 'address', value: 'SCO 123, Sector 17, Chandigarh 160017', description: 'Office address' },
      { key: 'instagram_url', value: 'https://instagram.com/3srealestate', description: 'Instagram' },
      { key: 'youtube_url', value: 'https://youtube.com/@3srealestate', description: 'YouTube' },
      { key: 'facebook_url', value: 'https://facebook.com/3srealestate', description: 'Facebook' },
    ],
  })

  console.log('✅ Site settings created')
  console.log('🎉 Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
