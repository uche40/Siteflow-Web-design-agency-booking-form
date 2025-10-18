export type WebsiteTypeId = 'business' | 'ecommerce' | 'portfolio' | 'blog' | 'landing' | 'custom' | 'nonprofit' | 'elearning' | 'booking' | 'realestate' | 'membership' | 'event' | 'podcast' | 'saas';
export type Feature = 'contactForm' | 'blogIntegration' | 'seoOptimization' | 'analyticsSetup' | 'socialMediaIntegration' | 'newsletterSignup';
export type DesignStyle = 'modern' | 'classic' | 'minimal' | 'bold';
export type Timeline = 'rush' | 'standard' | 'flexible';
export type CmsOption = 'wordpress' | 'webflow' | 'headless';
export type ColorPalette = 'vibrant' | 'corporate' | 'earthy';


export interface WebsiteType {
  id: WebsiteTypeId;
  name: string;
  description: string;
  basePrice: number;
}

export interface FormData {
  websiteType: WebsiteTypeId;
  pages: number;
  features: Feature[];
  designStyle: DesignStyle;
  timeline: Timeline;
  budget: number;
  additionalInfo: string;
  businessName?: string;
  cms: CmsOption;
  colorPalette: ColorPalette;
  maintenancePlan: boolean;
  monthlyHosting: boolean;
}

export const WEBSITE_TYPES: WebsiteType[] = [
  { id: 'business', name: 'Business Website', description: 'Perfect for small businesses, consultants, and professional services', basePrice: 500 },
  { id: 'ecommerce', name: 'E-commerce Store', description: 'Full-featured online store with product catalog and shopping cart', basePrice: 1200 },
  { id: 'portfolio', name: 'Portfolio', description: 'Showcase your work with a stunning portfolio website', basePrice: 400 },
  { id: 'blog', name: 'Blog/Magazine', description: 'Content-focused website for bloggers and publishers', basePrice: 600 },
  { id: 'landing', name: 'Landing Page', description: 'Single-page website optimized for conversions', basePrice: 300 },
  { id: 'custom', name: 'Custom Project', description: 'Unique requirements? We\'ll build exactly what you need', basePrice: 800 },
  { id: 'nonprofit', name: 'Non-Profit Site', description: 'Website for charities and non-profit organizations to raise awareness and funds.', basePrice: 550 },
  { id: 'elearning', name: 'E-Learning Platform', description: 'Create and sell online courses with a fully-featured learning management system.', basePrice: 1500 },
  { id: 'booking', name: 'Booking System', description: 'Allow customers to book appointments, reservations, or rentals directly on your site.', basePrice: 1300 },
  { id: 'realestate', name: 'Real Estate Portal', description: 'Showcase property listings with maps, galleries, and agent information.', basePrice: 1400 },
  { id: 'membership', name: 'Membership Site', description: 'Create a community and offer exclusive content to members.', basePrice: 1600 },
  { id: 'event', name: 'Event Website', description: 'Promote your conference, festival, or wedding with schedules and ticketing.', basePrice: 700 },
  { id: 'podcast', name: 'Podcast Website', description: 'A dedicated home for your podcast with episode players and show notes.', basePrice: 450 },
  { id: 'saas', name: 'SaaS Application', description: 'Marketing site for your Software as a Service product.', basePrice: 900 },
];

export const FEATURE_PRICES: { [key in Feature]: number } = {
  contactForm: 50,
  blogIntegration: 150,
  seoOptimization: 200,
  analyticsSetup: 100,
  socialMediaIntegration: 75,
  newsletterSignup: 100,
};

export const TIMELINE_ADJUSTMENTS: { [key in Timeline]: number } = {
  rush: 300,
  standard: 0,
  flexible: -100,
};

export const CMS_PRICES: { [key in CmsOption]: number } = {
  wordpress: 0,
  webflow: 250,
  headless: 500,
};

export const MAINTENANCE_PLAN_PRICE = 250;
export const MONTHLY_HOSTING_PRICE = 49;