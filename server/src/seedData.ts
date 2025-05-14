import { db } from './db';
import { categories, datasets } from '@your-scope/shared';
import { hashPassword, generateApiKey } from './auth';
import { users } from '@your-scope/shared';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    console.log('Checking for existing data...');
    
    // Check if categories already exist
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length === 0) {
      console.log('Seeding categories...');
      await db.insert(categories).values([
        { name: 'Finance', slug: 'finance', description: 'Financial datasets including market data, economic indicators, and corporate financials' },
        { name: 'Healthcare', slug: 'healthcare', description: 'Healthcare data including medical research, patient statistics, and industry trends' },
        { name: 'Technology', slug: 'technology', description: 'Technology sector data including market trends, user statistics, and industry reports' },
        { name: 'Retail', slug: 'retail', description: 'Retail industry data including consumer behavior, sales trends, and market analysis' },
        { name: 'Energy', slug: 'energy', description: 'Energy sector data including consumption patterns, pricing, and sustainability metrics' },
        { name: 'Real Estate', slug: 'real-estate', description: 'Real estate market data including property values, demographic trends, and development stats' },
      ]);
      console.log('Categories seeded successfully!');
    } else {
      console.log(`Found ${existingCategories.length} existing categories, skipping seed...`);
    }
    
    // Get category IDs for reference
    const categoryRecords = await db.select().from(categories);
    const categoryMap = new Map(categoryRecords.map(cat => [cat.slug, cat.id]));
    
    // Check if datasets already exist
    const existingDatasets = await db.select().from(datasets);
    if (existingDatasets.length === 0 && categoryRecords.length > 0) {
      console.log('Seeding datasets...');
      
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      
      const twoMonthsAgo = new Date(now);
      twoMonthsAgo.setMonth(now.getMonth() - 2);
      
      await db.insert(datasets).values([
        {
          title: 'Global Financial Markets - Q2 2025',
          slug: 'global-financial-markets-q2-2025',
          description: 'Comprehensive analysis of global financial markets with performance metrics, indices, and future projections for Q2 2025.',
          price: 299.99,
          recordCount: 540000,
          dataFormat: 'CSV, JSON',
          updateFrequency: 'Quarterly',
          lastUpdated: now,
          previewAvailable: true,
          filePath: '/datasets/finance/global-markets-q2-2025.csv',
          categoryId: categoryMap.get('finance'),
          createdAt: now,
          updatedAt: now
        },
        {
          title: 'Healthcare Patient Statistics 2025',
          slug: 'healthcare-patient-statistics-2025',
          description: 'Anonymized patient data and healthcare statistics from major hospitals and clinics across North America.',
          price: 449.99,
          recordCount: 1250000,
          dataFormat: 'CSV, XLSX',
          updateFrequency: 'Annually',
          lastUpdated: oneMonthAgo,
          previewAvailable: true,
          filePath: '/datasets/healthcare/patient-stats-2025.csv',
          categoryId: categoryMap.get('healthcare'),
          createdAt: oneMonthAgo,
          updatedAt: oneMonthAgo
        },
        {
          title: 'Tech Industry Trends Analysis',
          slug: 'tech-industry-trends-analysis',
          description: 'In-depth analysis of technology industry trends including adoption rates, market share, and future projections.',
          price: 599.99,
          recordCount: 850000,
          dataFormat: 'JSON, CSV',
          updateFrequency: 'Monthly',
          lastUpdated: twoMonthsAgo,
          previewAvailable: true,
          filePath: '/datasets/technology/tech-industry-trends.json',
          categoryId: categoryMap.get('technology'),
          createdAt: twoMonthsAgo,
          updatedAt: twoMonthsAgo
        },
        {
          title: 'Retail Consumer Behavior Insights',
          slug: 'retail-consumer-behavior-insights',
          description: 'Detailed analysis of consumer shopping behavior, preferences, and spending patterns in retail markets.',
          price: 349.99,
          recordCount: 2100000,
          dataFormat: 'CSV',
          updateFrequency: 'Quarterly',
          lastUpdated: now,
          previewAvailable: true,
          filePath: '/datasets/retail/consumer-behavior.csv',
          categoryId: categoryMap.get('retail'),
          createdAt: now,
          updatedAt: now
        },
        {
          title: 'Energy Consumption Patterns',
          slug: 'energy-consumption-patterns',
          description: 'Detailed energy consumption data from residential, commercial, and industrial sectors with regional breakdowns.',
          price: 499.99,
          recordCount: 1800000,
          dataFormat: 'CSV, JSON',
          updateFrequency: 'Monthly',
          lastUpdated: oneMonthAgo,
          previewAvailable: true,
          filePath: '/datasets/energy/consumption-patterns.csv',
          categoryId: categoryMap.get('energy'),
          createdAt: oneMonthAgo,
          updatedAt: oneMonthAgo
        },
        {
          title: 'Commercial Real Estate Market Analysis',
          slug: 'commercial-real-estate-market-analysis',
          description: 'Comprehensive analysis of commercial real estate markets including property values, occupancy rates, and investment metrics.',
          price: 799.99,
          recordCount: 650000,
          dataFormat: 'CSV, XLSX',
          updateFrequency: 'Quarterly',
          lastUpdated: twoMonthsAgo,
          previewAvailable: true,
          filePath: '/datasets/real-estate/commercial-market-analysis.csv',
          categoryId: categoryMap.get('real-estate'),
          createdAt: twoMonthsAgo,
          updatedAt: twoMonthsAgo
        },
        {
          title: 'Financial Investment Performance Metrics',
          slug: 'financial-investment-performance-metrics',
          description: 'Historical investment performance metrics across various asset classes with risk and return analysis.',
          price: 699.99,
          recordCount: 920000,
          dataFormat: 'CSV, JSON',
          updateFrequency: 'Monthly',
          lastUpdated: now,
          previewAvailable: true,
          filePath: '/datasets/finance/investment-performance.csv',
          categoryId: categoryMap.get('finance'),
          createdAt: now,
          updatedAt: now
        },
        {
          title: 'Healthcare Cost Analysis',
          slug: 'healthcare-cost-analysis',
          description: 'Detailed analysis of healthcare costs across different medical procedures, treatments, and facilities.',
          price: 549.99,
          recordCount: 780000,
          dataFormat: 'CSV',
          updateFrequency: 'Quarterly',
          lastUpdated: oneMonthAgo,
          previewAvailable: true,
          filePath: '/datasets/healthcare/cost-analysis.csv',
          categoryId: categoryMap.get('healthcare'),
          createdAt: oneMonthAgo,
          updatedAt: oneMonthAgo
        },
      ]);
      console.log('Datasets seeded successfully!');
    } else {
      console.log(`Found ${existingDatasets.length} existing datasets, skipping seed...`);
    }
    
    // Check if admin user exists
    const adminExists = await db.select().from(users).where(eq(users.email, 'admin@example.com'));
    if (adminExists.length === 0) {
      console.log('Creating admin user...');
      const hashedPassword = await hashPassword('admin123!@#');
      const apiKey = generateApiKey();
      
      await db.insert(users).values({
        email: 'admin@example.com',
        username: 'admin',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        company: 'Data Services Inc.',
        role: 'Administrator',
        isAdmin: true,
        apiKey,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Admin user created successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: admin123!@#');
    } else {
      console.log('Admin user already exists, skipping creation...');
    }
    
    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
