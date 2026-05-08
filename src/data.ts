export interface NavLink {
  name: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  currentPrice: number;
  originalPrice: number;
  thumbnailUrl: string;
  videoUrl?: string;
  category: string;
  subCategory?: string;
  badge?: 'Hot Sell' | 'Trending' | 'Latest';
  checkoutUrl: string;
  features: { name: string; description: string }[];
  demoUrl?: string;
  stockCount?: number;
  whatYouReceive?: string[];
  whyChoose?: { label: string; description: string }[];
  whereToUse?: { label: string; description: string }[];
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  image: string;
  readTime: string;
  date: string;
  content: string;
}

export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

export interface ResumeItem {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export interface Skill {
  name: string;
  level: number;
}

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/home' },
  { name: 'Store', href: '/premium-templates' },
  { name: 'FAQs', href: '/faq' },
  { name: 'Portfolio', href: 'https://arhamadib.in' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const FAQ_DATA = [
  {
    question: "Do you offer custom web design?",
    answer: "Yes! Every project I work on is built from scratch or tailored specifically to your brand's unique needs and vision."
  },
  {
    question: "How long does a typical project take?",
    answer: "Timelines vary depending on complexity. Small websites or video edits usually take 3-7 days, while larger enterprise projects can take 2-4 weeks."
  },
  {
    question: "What is your revision policy?",
    answer: "Most plans include 3 rounds of free revisions. I want to make sure you are 100% satisfied with the final result."
  },
  {
    question: "Do you provide hosting and maintenance?",
    answer: "Yes, I can handle everything from server setup and domain integration to monthly maintenance and updates."
  },
  {
    question: "What payment methods do you accept?",
    answer: "I accept all major credit cards, UPI (for India), and bank transfers. Secure payment links are provided for every transaction."
  }
];

export const PRIVACY_POLICY = {
  lastUpdated: 'May 07, 2026',
  content: `
    Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website.

    1. Information We Collect: We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.

    2. Log Data: When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, and the time spent on each page.

    3. Cookies: We use “cookies” to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site.

    4. Disclosure of Personal Information to Third Parties: We may disclose personal information to third party service providers for the purpose of enabling them to provide their services, including (without limitation) IT service providers, data storage, hosting and server providers, ad networks, analytics, error loggers, debt collectors, maintenance or problem-solving providers.

    5. Security of Personal Information: We protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification.
  `
};

export const TERMS_CONDITIONS = {
  lastUpdated: 'May 07, 2026',
  content: `
    By accessing this website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.

    1. License: Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only.

    2. Disclaimer: The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

    3. Limitations: In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.

    4. Accuracy of Materials: The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete or current.

    5. Links: We have not reviewed all of the sites linked to its website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at its own risk.
  `
};

export const HERO_DATA = {
  name: 'Arham Adib',
  roles: ['a Web Designer', 'a Video Editor.', 'a Freelancer.'],
  description: 'I deliver end-to-end digital solutions, from high-end video production to full-stack web applications. My goal is to elevate your brand presence.',
};

import PRODUCTS_JSON from './products.json';

export const PRODUCTS: Product[] = PRODUCTS_JSON as Product[];


export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Nevine Acotanza',
    designation: 'Chief Operating Officer',
    company: 'Upwork',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    content: 'Arham is an exceptional talent. He delivered our dashboard ahead of schedule and the quality surpassed our highest expectations.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Jennifer',
    designation: 'Creative Director',
    company: 'Pixel Perfect',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    content: 'Working with Arham was a breeze. His attention to detail and creative vision brought our project to life in ways we didn\'t think possible.',
    rating: 5,
  },
];
