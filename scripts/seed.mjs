import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log('Admin user verified/created:', admin.username);

  // 2. Seed Projects
  console.log('Clearing old project listings...');
  await prisma.project.deleteMany({});
  console.log('Seeding 6 default projects...');
  const defaultProjects = [
    {
      title: "Green Garden Premium Villas",
      description: `<h1>Green Garden Premium Villas</h1><p>Experience ultra-luxury living in our flagship villa project. Surrounded by natural lakes and private gardens, these villas offer the perfect sanctuary for your family.</p><h3>Key Features</h3><ul><li>Private Infinity Pools &amp; Sun Decks</li><li>Smart Home Automation &amp; Centralized AC</li><li>Renewable Solar Power Grid Connection</li><li>24/7 Gated Security &amp; CCTV Surveillance</li></ul><p>Located in the heart of Greenleaf Holdings Ltd., each villa layout is customizable to fit your architectural preferences.</p>`,
      category: "Land - Phase 1",
      status: "Ongoing",
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200"
      ]
    },
    {
      title: "Lakeside Commercial Square",
      description: `<h1>Lakeside Commercial Square</h1><p>A state-of-the-art business center designed for modern enterprises, corporate offices, and premium retail outlets. Located on the main 60ft boulevard with direct lake access and ample visitor parking.</p><h3>Key Features</h3><ul><li>Central Air Conditioning &amp; HVAC Systems</li><li>High-Speed Panoramic Elevators</li><li>Rooftop Restaurant &amp; Business Lounge</li><li>Fibre-Optic Internet &amp; 100% Power Backup</li></ul><p>Invest in retail spaces or full office floors with highly attractive rental yield projections.</p>`,
      category: "Land - Phase 2",
      status: "Upcoming",
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
      ]
    },
    {
      title: "Central Eco Park Residences",
      description: `<h1>Central Eco Park Residences</h1><p>High-rise residential apartments with 360-degree views of our central park. Integrated with sustainable design principles to maximize natural light, cross-ventilation, and eco-friendly waste management.</p><h3>Key Features</h3><ul><li>Rooftop Jogging Track &amp; Sky Garden</li><li>Rainwater Harvesting &amp; Greywater Recycling</li><li>Fully Equipped Gymnasium &amp; Swimming Pool</li><li>Children's Safe Play Zone &amp; Daycare Center</li></ul><p>Perfect for modern urban families seeking convenience, community, and clean fresh air.</p>`,
      category: "Apartment",
      status: "Delivered",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200",
        "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=1200",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200"
      ]
    }
  ];

  for (const proj of defaultProjects) {
    await prisma.project.create({ data: proj });
  }

  // 3. Seed Team Members
  console.log('Clearing old team members...');
  await prisma.teamMember.deleteMany({});
  console.log('Seeding 4 team members...');
  const defaultTeam = [
    {
      name: 'Elena Rostova',
      role: 'Chief Architect',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-5j-OoHph2EcgnV4gBZzHeQl8Kv_IQAvmVRqumMPTfc1QXhYb2GGg3-eZMmnSor18iENaTixNDz3rZgvna3z6HnsBRWpZkzHwBKKEK7WrpII6ur31TO5p_qDPyITzfZRdToGzzpSTm7JySO_2C9oHA6T8sYmGcHW1c2K17QZzu5j3vTSjSTQu7R27E6wH-f6UaNwPJ8bm4Lh6dDXbm1xfAt3UrH538xz0mmGlwHZzYrNfNBjVpJqf',
    },
    {
      name: 'Marcus Vance',
      role: 'Head of Urban Planning',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEnHDM4kLQ-LRWxSrbt-NlRXi9aWCZs1dUKxlQRLY2grhZIgr8Ax_reSMzqGcddOM8Vlok7bkOQyluweQGUbqtw7HchkFTXz7Z9JSp0PfReAm_a3UTGRiyp4VAc6edU_6dT9BNcqgKauMU8aon9sbYiLPrl_V7MtMBuV5id8adGA-2BmuQKxvtH21RgU87eC0JttW9NMEwC42jl3aj5S0-RVn8p_Dwvcq-YqTm6wkBqRpKmz2wEFlD',
    },
    {
      name: 'Sarah Lin',
      role: 'Sustainability Director',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWyAl_HzHqQgzFOeqvgHwKe5VeGKgjmOk-B4SJwdehkhN7QWwT5rouJhio3w8yubj0BpOSahcGEQGLBMGJpW5spMeeFrd8Pvr6Yr2PqhjpjTivnPCxexPA7KOJHc_vM4rnGhSWtZIUPdztU9tLnAWuQ_0fPXYBptx7JyRcCNnzL9-Vn_a6LY1lhqSpHK8uqDjBYmrsuiM8tPesMfMa2p00Imj17C1dWAPBarpIsIjse3_6Gl-4kIoP',
    },
    {
      name: 'David Chen',
      role: 'Community Liaison',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE456CpiUbqNuFkVu5X-l5FJKC-Aj93Q6h9UtxMH2Da92Mo3ikhJfiPyCIxQm-KA1hkJWcgj7VKYz3ecXdkNWXadsOtpodF8N0lnVL_cjE4_M8qQAm78tHGxQM6NKPbDLxUpNq-b7c2xp37ZkcQow1CnS98GiJGYClHA07ZmmWf6WeApirs-9-pgneiAJBjTYu8ELtUNXqDMfL_ICZCiUlvkbw04Hr2l1AsD6Wv-eIuY9iEWmlDsxF',
    },
  ];

  for (const member of defaultTeam) {
    await prisma.teamMember.create({ data: member });
  }

  // 4. Seed Blog Posts
  console.log('Clearing old blog posts...');
  await prisma.blogPost.deleteMany({});
  console.log('Seeding 5 blog posts...');
  const defaultBlogs = [
    {
      title: 'The Masterplan: Integrating Nature with Modern Infrastructure',
      category: 'Sustainability',
      date: 'Oct 24, 2026',
      summary: 'Discover how our lead architects designed a city that breathes, ensuring every resident is within a five-minute walk to a major green space without sacrificing connectivity.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyF9Hc1H2KaU1M1VXX1EugKqL0plR80tEgSS2aQ6w17JfhuG5aw-URQ9A1RUtJsf8de0t9l66zbLsxIMd9REvTNkGddXEoIGstdHPMaxMw6c63OaGc34_0Vxyxc52U_f_hNz12mGKHNV6LSxm9fP_YOuf-KZEidYhFzFgApSg3TBIrGkBYoN5NYXOsqxO4Yl_ENhn_511sPiSiTmHR5bg_B9oFjdgIiqKsXvuttLkrKQdoNDSpJSsL',
      featured: true,
      specialCard: false,
    },
    {
      title: 'Upcoming Farmers Market in Central Park',
      category: 'Community',
      date: 'Oct 18, 2026',
      summary: 'Join us this weekend as local vendors bring the freshest organic produce directly to the heart of Greenleaf Holdings Ltd.. Connect with neighbors and support green initiatives.',
      imageUrl: '',
      featured: false,
      specialCard: true,
    },
    {
      title: 'Creating Your Own Balcony Oasis',
      category: 'Architecture',
      date: 'Oct 12, 2026',
      summary: 'Tips and tricks for selecting the right plants and furniture to maximize your outdoor living space, incorporating vertical gardening techniques.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKZtKlV0xFGvSxTY7D14MimzEml9WzYbanu1LfKj6krvbEgduYCCiGMeRb6eJk5div6lPdZTrQ5cG9y0h9jnHDGgQW4Cq-nzcR3nn7XDzH5Fy_-mt1JQfP8bVChNBtWFMREtztN_kWvhQjo8WrcAYzAq_rwGgTqRSeqsrHgAQrL31T-RYgQfdHmbZKB41yNdoqrtEBZ57pjQq2ZFBATKdOv62-Yuisnd3DOv76bzAT50Y-VbupAYOM',
      featured: false,
      specialCard: false,
    },
    {
      title: 'A Tour of the New Sapphire Clubhouse',
      category: 'Community',
      date: 'Oct 05, 2026',
      summary: 'Take a look inside our newest community center, featuring a state-of-the-art gym, dynamic co-working spaces, and a heated swimming pool.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9dOiouGwrSSAoXSMxkatyeBsvhppoIqGGBs8z8uBJrZK9_kk31r62lRMNYXtjxrc0cKtSd2G-rA5529x5Dl6Lqke_UQaYHpeWkwAlSBBmLsuK_BXK-hFn9YBPx-wplYwjcV1-SiFT-ob_Ovn0QpPaNKg0MW0U5e_XYDap2GjCFCiJ_963YpKG1pcwUMrD2SBLVjnG7rLrn-DGcZtfr-XgsYEbMZzVpuyNLvLD3SI4OLOHqp-u-Zrd',
      featured: false,
      specialCard: false,
    },
    {
      title: 'Understanding Our Solar Grid Initiatives',
      category: 'Sustainability',
      date: 'Sep 28, 2026',
      summary: 'How Greenleaf Holdings Ltd. is working towards a net-zero carbon footprint through integrated community solar power arrays and clean energy sharing.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5R2q8tNZJM_oHg6bDf81jrzlva67-eplCPk-UGyulKjjOn5KM9vheIgEm92v-XBS7JytLSfQj9-3fvhb3h5BQIgooRpSm-lMFTM5Jv3GdFKy4_pFAwpmGq_37dR0UgowDhV7xPIWf_xZysLtA6bENHJ_gqrMG_jyBxl_rTOjlCddU6P6IUFczHehRWgQ-RqppSB35Ai0i1BHBDDBb82MXsjSGINZwkC7mUs6k5mFLLUBa-ZtV05Rc',
      featured: false,
      specialCard: false,
    },
  ];

  for (const blog of defaultBlogs) {
    await prisma.blogPost.create({ data: blog });
  }

  // 5. Seed Brochures
  console.log('Clearing old brochures...');
  await prisma.brochure.deleteMany({});
  console.log('Seeding 3 brochures...');
  const defaultBrochures = [
    {
      title: 'Master Plan Overview',
      description: 'A comprehensive look at the zoning, infrastructure, and green spaces defining our eco-city.',
      size: '12.0 MB',
      languages: 'English, Bengali',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqrRYdVBgYEUbgK4wSAW0dRmlu9aCftiTNf3Y4rdVgdwBrTXY1C1tDBRdX4Go-6UbA_Y5_Crhul8r8mMkHdPy6ae1eCWR-xqk1dJ3auIrA6jY82Dqeu7JA81jTTYSQ9EU_HlHN5AI9f-iET9oBh58-XY4aeso50_g9z-1TviMuuPFNd9AUystS-Nxa59N0YgbfkKDIulW_zdIv9sxWvA_99JN7V4sOtOxqJHBtgr7X-iR-dYz1u5UQzEYdv47YJ2xC0Q',
      pdfUrl: '/brochures/master-plan.pdf',
    },
    {
      title: 'Premium Amenities',
      description: 'Discover the parks, natural lakes, community centers, and sustainable facilities available to residents.',
      size: '8.5 MB',
      languages: 'English',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4AS8gSc57YKuX0ZaDGb5eHiohRqPpq3ZGo9rMeDRi8L-5J15uMxc8RY3spl14IBJc8rnwMrWs4LDB9GL_hdZ29ZAxILIs4iPA8OnTn1gxhTqtNPIAJWzSJvY5EBzIXH9bUimaWSqWs3VwjhBYRaiPEBDSJHc4zntBlZhZO6jTLbNF6f3DHj8HldyDtfAT6UI7a3fy3pJPRgizVqjr7zgT3yQL_3eKZdkLbOR9fJGF3tXxeNhNJ0vgcrlodL7OZ3lpTA',
      pdfUrl: '/brochures/amenities.pdf',
    },
    {
      title: 'Plot Specifications',
      description: 'Detailed dimensions, soil reports, zoning regulations, and layouts for residential plots.',
      size: '5.2 MB',
      languages: 'English, Bengali',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHIz9tZiHtNLGhoVsD8FMTiBEZ4_QTYJobTPhbbzypvpBnWdEY-sJg6uk0VFimjzHdPhErLUR7iDr0iyyVPco_c7O88h8YiqDli8TOCSHpIE3AcGCaZySsqHsv4moOqvHjESP78PwJNbvaDqCULEqV1idS8B_S5ZTvRzHhIeOiBqRl0W8TqTfWwFIlCgiPt5CHT6rynQDWLgvthy3pKqhgAeq8cT02-Da1J9L47Xkvpt6aOuIqSHDo',
      pdfUrl: '/brochures/specifications.pdf',
    },
  ];

  for (const brochure of defaultBrochures) {
    await prisma.brochure.create({ data: brochure });
  }

  console.log('Successfully completed MongoDB seeding!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
