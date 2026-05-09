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
  badge?: 'Hot Sell' | 'Trending' | 'Latest';
  checkoutUrl: string;
  features: { name: string; description: string }[];
  demoUrl?: string;
  stockCount?: number;
  whatYouReceive?: string[];
  whyChooseThisPack?: { title: string; description: string; icon: string }[];
  whereCanYouUseIt?: { title: string; description: string; icon: string }[];
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
  {
    "name": "Home",
    "href": "/home"
  },
  {
    "name": "Store",
    "href": "/premium-templates"
  },
  {
    "name": "FAQs",
    "href": "/faq"
  },
  {
    "name": "Portfolio",
    "href": "https://arhamadib.in"
  },
  {
    "name": "About",
    "href": "/about"
  },
  {
    "name": "Contact",
    "href": "/contact"
  }
];

export const FAQ_DATA = [
  {
    "question": "Do you offer custom web design?",
    "answer": "Yes! Every project I work on is built from scratch or tailored specifically to your brand's unique needs and vision."
  },
  {
    "question": "How long does a typical project take?",
    "answer": "Timelines vary depending on complexity. Small websites or video edits usually take 3-7 days, while larger enterprise projects can take 2-4 weeks."
  },
  {
    "question": "What is your revision policy?",
    "answer": "Most plans include 3 rounds of free revisions. I want to make sure you are 100% satisfied with the final result."
  },
  {
    "question": "Do you provide hosting and maintenance?",
    "answer": "Yes, I can handle everything from server setup and domain integration to monthly maintenance and updates."
  },
  {
    "question": "What payment methods do you accept?",
    "answer": "I accept all major credit cards, UPI (for India), and bank transfers. Secure payment links are provided for every transaction."
  }
];

export const PRIVACY_POLICY = {
  "lastUpdated": "May 07, 2026",
  "content": "\n    Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website.\n\n    1. Information We Collect: We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.\n\n    2. Log Data: When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, and the time spent on each page.\n\n    3. Cookies: We use “cookies” to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site.\n\n    4. Disclosure of Personal Information to Third Parties: We may disclose personal information to third party service providers for the purpose of enabling them to provide their services, including (without limitation) IT service providers, data storage, hosting and server providers, ad networks, analytics, error loggers, debt collectors, maintenance or problem-solving providers.\n\n    5. Security of Personal Information: We protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification.\n  "
};

export const TERMS_CONDITIONS = {
  "lastUpdated": "May 07, 2026",
  "content": "\n    By accessing this website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.\n\n    1. License: Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only.\n\n    2. Disclaimer: The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.\n\n    3. Limitations: In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.\n\n    4. Accuracy of Materials: The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete or current.\n\n    5. Links: We have not reviewed all of the sites linked to its website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at its own risk.\n  "
};

export const HERO_DATA = {
  "name": "Arham Adib",
  "roles": [
    "a Web Designer",
    "a Video Editor.",
    "a Freelancer."
  ],
  "description": "I deliver end-to-end digital solutions, from high-end video production to full-stack web applications. My goal is to elevate your brand presence."
};

export const PRODUCTS: Product[] = [
  {
    "id": "p1",
    "slug": "happy-birthday-sahiba-v2",
    "title": "Happy Birthday Sahiba",
    "description": "A heartfelt birthday website created to express love, emotions, and unspoken feelings through soft visuals, gentle animations, and a warm, personal journey that makes Sahiba feel truly special.",
    "currentPrice": 281,
    "originalPrice": 499,
    "thumbnailUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj350gLvLmELw4b3Nh98tiASycfZ9t4RYh7bTosqRZGPZ5iryfF2x6ajiV-QflWvkowcnMO1i65ErhQ-sq4jv3A7t5Y3PLfV25KsfClrS11JDBI3kgczua0E6A3tPLmpzX5zFcgp1qi4ASfg4FNJqaEROQWMlmhzN-f3zJTDcLzc4jVhh253BgY1IAT8A/s1600/happy-birthday-sahiba.png",
    "videoUrl": "https://ik.imagekit.io/0uswuasvrq/HAPPY%20BIRTHDAY%20SAHIBA.mp4",
    "category": "Birthday",
    "badge": "Trending",
    "checkoutUrl": "https://superprofile.bio/vp/ENQZ4YqE",
    "demoUrl": "https://hbd-sahiba-jii.vercel.app/",
    "stockCount": 5,
    "features": [
      {
        "name": "One-Screen Fit",
        "description": "Every page fits perfectly on screen with no background scrolling."
      },
      {
        "name": "Smooth Animations",
        "description": "Fluid transitions with no lag, glitches, or stutter."
      },
      {
        "name": "Smart Fixed UI",
        "description": "Navigation, footer, and music controls stay perfectly positioned."
      },
      {
        "name": "Instant Media Loading",
        "description": "Images and audio load smoothly without delays."
      },
      {
        "name": "True Responsive Design",
        "description": "Looks and feels perfect on mobile, desktop, and tablets."
      },
      {
        "name": "Performance Optimized",
        "description": "Fast, stable, and smooth across all devices."
      },
      {
        "name": "Fully Deployed Website",
        "description": "The website will be deployed as per your request within 12-24 hours."
      }
    ],
    "whatYouReceive": [
      "Customisation Form",
      "Personalize it using your own images & text",
      "Ready-made Default Link / QR Code",
      "Order cannot be cancelled after placed!"
    ]
  },
  {
    "id": "p2",
    "slug": "happy-birthday-v1",
    "title": "Happy Birthday 1.0",
    "description": "A simple birthday-themed website designed to create a calm and lovely experience, where gentle visuals and smooth transitions come together to make Sahiba feel happy, appreciated, and special.",
    "currentPrice": 28,
    "originalPrice": 199,
    "thumbnailUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEie3W0bhfUZaEb0ycYz4Djdh7oQM5YrKREENBuLGgzHPElVgFvLTSrOln9C1z3qYuVmMePn88y34wWnBHyG0LhtLUTazR2jtfdB0cOcQkmsNdukMB9vDsihKQeIdUS_F_apHrM3V8TOgoLzlXIV9DXJpc7qR61e-buLz_tM25gzJviEynWoAY1vdH1qFg/s1600/BIRTHDAY%20V2.png",
    "videoUrl": "https://ik.imagekit.io/3kka2lnk8/HAPY%20BIRTHDAY%20V1%20PREVIEW.mp4",
    "category": "Birthday",
    "badge": "Latest",
    "checkoutUrl": "https://superprofile.bio/vp/CMxxVg5o",
    "features": [
      {
        "name": "One-Screen Fit",
        "description": "Every page fits perfectly on screen with no background scrolling."
      },
      {
        "name": "Smooth Animations",
        "description": "Fluid transitions with no lag, glitches, or stutter."
      },
      {
        "name": "Smart Fixed UI",
        "description": "Navigation, footer, and music controls stay perfectly positioned."
      },
      {
        "name": "Instant Media Loading",
        "description": "Images and audio load smoothly without delays."
      },
      {
        "name": "True Responsive Design",
        "description": "Looks and feels perfect on mobile, desktop, and tablets."
      },
      {
        "name": "Performance Optimized",
        "description": "Fast, stable, and smooth across all devices."
      },
      {
        "name": "Fully Deployed Website",
        "description": "The website will be deployed as per your request within 12-24 hours."
      }
    ],
    "demoUrl": "https://birthday-v3-navy.vercel.app/",
    "whatYouReceive": [
      "Custom Link",
      "Photo integration",
      "24h Delivery"
    ]
  },
  {
    "id": "p3",
    "slug": "kahani-suno-lyrics",
    "title": "Kahani Suno Lyrics",
    "description": "A music lyrical website, Kahani Suno 2.0 by Kaifi Khalil, is made with love to share heartfelt emotions. It gently turns music into a personal story, created especially for Sahiba.",
    "currentPrice": 0,
    "originalPrice": 49,
    "thumbnailUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgY9Vm5Ixx4h7d8FF17ZTkBvuDgh9QiD7vFJjBsKVnaT1Kc8aoe04vAK8m5MNF6dcAqyavkKed6kdP4B7SFgodI_cKnIuWjsZhxFKfooi5BPyexjoW1tvzhTtHPci7BfN8r4qkQqVEU7WnFbg2-_xNNv4kwh5f6gQI6QeYOalQjrN2skm7b-TqRhuVbsA/s1600/Kahani-Suno-Lyrics.png",
    "videoUrl": "https://ik.imagekit.io/3kka2lnk8/KAHANI%20SUNO%20VIDEO%20PREVIEW.mp4",
    "category": "Freebies",
    "badge": "Trending",
    "checkoutUrl": "mailto:arhamadib31@gmail.com?subject=Free Kahani Suno Lyrical Site Request&body=Hello Arham! I want the Kahani Suno Lyrical site which is free. Please share the next steps.",
    "features": [
      {
        "name": "Lyrical",
        "description": "A lyrical storytelling experience inspired by Kahani Suno 2.0 that feels personal and emotional"
      },
      {
        "name": "Gentle",
        "description": "Soft visuals and smooth animations that create a calm, romantic mood"
      },
      {
        "name": "Flowing",
        "description": "Music-driven flow where emotions unfold naturally with each section"
      },
      {
        "name": "Intimate Design",
        "description": "A simple, intimate design focused on feelings rather than complexity"
      },
      {
        "name": "Heartfelt",
        "description": "Created with love to express unspoken emotions for Sahiba in a meaningful way"
      },
      {
        "name": "Performance Optimized",
        "description": "Fast, stable, and smooth across all devices."
      },
      {
        "name": "Fully Deployed Website",
        "description": "The website will be deployed as per your request within 12-24 hours."
      }
    ],
    "demoUrl": "https://kahanisuno-lyrics-site.vercel.app/",
    "whatYouReceive": [
      "Free Deployment",
      "Heartfelt design"
    ]
  },
  {
    "id": "p4",
    "slug": "new-year-2026",
    "title": "New Year 2026",
    "description": "An interactive New Year website crafted to deliver a personal message and a memorable start to the year.",
    "currentPrice": 149,
    "originalPrice": 349,
    "thumbnailUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjVSxLN_ZbK4lNTA5xWKWxKoR5PvAtxUNVby2nHXvrGa5HH2o8CcpmG2diCcKjHU6YPJnlQsuZVZDMAHwsAuH1elxpn7i0RTkqZAYCZGr9OA9qQsDY_aEsK8aqCgnLkGJBqf849v4zbmtvZFPoWj8q97dvau6_M-eNcDPCF8Kj6yvjS4Ouf8ITHM1uBQA/s1600/Screenshot%202026-01-04%20215146.png",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-in-a-dark-room-with-neon-lights-41005-large.mp4",
    "category": "Special",
    "badge": "Trending",
    "checkoutUrl": "https://superprofile.bio/vp/new-year-site-🎉",
    "features": [
      {
        "name": "Our Journey",
        "description": "Shows our journey from the first year up to 2025."
      },
      {
        "name": "Beautiful Memories",
        "description": "Displays photos with dates and cute captions to relive special moments."
      },
      {
        "name": "4 Cute Games",
        "description": "Includes Catch Love, Match Our Vibes, Love Quiz, and Make a Bouquet."
      },
      {
        "name": "Our Dreams",
        "description": "Showcases what we plan to do together in the coming years."
      },
      {
        "name": "Background Music",
        "description": "Auto background music plays smoothly throughout the website."
      },
      {
        "name": "Fully Mobile-Responsive Design",
        "description": "Optimized for mobile phones, tablets, and all screen sizes."
      },
      {
        "name": "Fully Deployed Website",
        "description": "The website will be deployed as per your request within 12-24 hours."
      }
    ],
    "demoUrl": "https://happy-new-year-madam-jii.vercel.app/",
    "stockCount": 0,
    "whatYouReceive": [
      "Full deployment",
      "Responsive design"
    ]
  },
  {
    "id": "f1",
    "slug": "free-icon-pack",
    "title": "Minimalist Icon Pack",
    "description": "A collection of 100+ high-quality minimalist icons for your digital projects. Perfect for web and mobile design.",
    "currentPrice": 0,
    "originalPrice": 499,
    "thumbnailUrl": "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?auto=format&fit=crop&q=80&w=800",
    "category": "Freebies",
    "badge": "Latest",
    "checkoutUrl": "https://t.me/arhambuilds",
    "features": [
      {
        "name": "100+ Icons",
        "description": "SVG, PNG, and AI formats included"
      },
      {
        "name": "Scaleable",
        "description": "Vector based designs for any size"
      }
    ],
    "whatYouReceive": [
      "Icon Bundle (ZIP)",
      "License File"
    ]
  },
  {
    "id": "a1",
    "slug": "cinematic-sfx-pack",
    "title": "Cinematic SFX Pack",
    "description": "Professional grade sound effects for cinematic video production. Includes whooshes, hits, and ambient textures.",
    "currentPrice": 99,
    "originalPrice": 299,
    "thumbnailUrl": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
    "videoUrl": "https://ik.imagekit.io/3kka2lnk8/KAHANI%20SUNO%20VIDEO%20PREVIEW.mp4",
    "category": "Editing Assets",
    "badge": "Latest",
    "checkoutUrl": "https://superprofile.bio/vp/sfx-pack",
    "features": [
      {
        "name": "50+ High Fidelity SFX",
        "description": "Recorded at 96kHz 24-bit"
      },
      {
        "name": "Royalty Free",
        "description": "Use in any project without attribution"
      }
    ],
    "whatYouReceive": [
      "WAV & MP3 Files",
      "Metadata Guide"
    ],
    "whyChooseThisPack": [
      {
        "title": "Trusted by Top Creators",
        "description": "Used by India’s biggest names in content creation.",
        "icon": "users"
      },
      {
        "title": "Curated by Kavangun",
        "description": "Years of expertise packed into one kit.",
        "icon": "award"
      },
      {
        "title": "All-in-One Toolkit",
        "description": "Everything you need to produce premium content.",
        "icon": "layoutGrid"
      }
    ],
    "whereCanYouUseIt": [
      {
        "title": "Gaming Videos",
        "description": "Amp up the energy and excitement.",
        "icon": "gamepad2"
      },
      {
        "title": "Documentaries & Vlogs",
        "description": "Add depth, polish, and emotion.",
        "icon": "video"
      },
      {
        "title": "Reactions & Edits",
        "description": "Stand out with humor and style.",
        "icon": "smile"
      }
    ]
  },
  {
    "id": "a2",
    "slug": "motion-animation-pack",
    "title": "Motion Animation Pack",
    "description": "Easily drag-and-drop animation presets for Premiere Pro and After Effects. Elevate your video editing with one click.",
    "currentPrice": 199,
    "originalPrice": 599,
    "thumbnailUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    "category": "Editing Assets",
    "badge": "Trending",
    "checkoutUrl": "https://superprofile.bio/vp/animation-pack",
    "features": [
      {
        "name": "20+ Presets",
        "description": "Ready to use templates"
      },
      {
        "name": "Tutorial Included",
        "description": "Step-by-step installation guide"
      }
    ],
    "whatYouReceive": [
      "Project Files",
      "Video Tutorial"
    ],
    "whyChooseThisPack": [
      {
        "title": "Lightning Fast",
        "description": "Render times optimized for quick turnarounds.",
        "icon": "zap"
      },
      {
        "title": "Professional Quality",
        "description": "Used by industry leading motion designers.",
        "icon": "award"
      },
      {
        "title": "Versatile Presets",
        "description": "Works with any frame rate or resolution.",
        "icon": "layoutGrid"
      }
    ],
    "whereCanYouUseIt": [
      {
        "title": "YouTube Intros",
        "description": "Make your channel stand out instantly.",
        "icon": "video"
      },
      {
        "title": "Social Media Ads",
        "description": "High-converting animations for marketing.",
        "icon": "trending-up"
      },
      {
        "title": "Stream Overlays",
        "description": "Perfect for Twitch and live streaming.",
        "icon": "gamepad2"
      }
    ]
  },
  {
    "id": "a3",
    "slug": "color-grading-luts",
    "title": "Cinematic LUTs Pack",
    "description": "Transform your footage with professional color grading presets. Designed for a cinematic look in Premiere Pro and DaVinci Resolve.",
    "currentPrice": 299,
    "originalPrice": 799,
    "thumbnailUrl": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    "category": "Editing Assets",
    "badge": "Latest",
    "checkoutUrl": "https://superprofile.bio/vp/luts-pack",
    "features": [
      {
        "name": "10 Premium LUTs",
        "description": "Universal .cube format"
      },
      {
        "name": "Versatile",
        "description": "Works on LOG and standard footage"
      }
    ],
    "whatYouReceive": [
      "LUT Bundle (ZIP)",
      "Installation PDF"
    ],
    "whyChooseThisPack": [
      {
        "title": "Cinematic Feel",
        "description": "Hollywood-level color grading in seconds.",
        "icon": "sparkles"
      },
      {
        "title": "Natural Skin Tones",
        "description": "Optimized to preserve realistic skin colors.",
        "icon": "smile"
      },
      {
        "title": "One-Click Apply",
        "description": "No complex adjustments needed.",
        "icon": "mouse-pointer-2"
      }
    ],
    "whereCanYouUseIt": [
      {
        "title": "Short Films",
        "description": "Give your story a professional look.",
        "icon": "video"
      },
      {
        "title": "Travel Vlogs",
        "description": "Bring out the vibrant colors of your trips.",
        "icon": "globe"
      },
      {
        "title": "Wedding Videos",
        "description": "Classic, timeless look for special moments.",
        "icon": "heart"
      }
    ]
  },
  {
    "id": "f2",
    "slug": "social-media-kit",
    "title": "Social Media Kit",
    "description": "A comprehensive branding template for Instagram and Twitter. Boost your profile presence with a consistent look.",
    "currentPrice": 0,
    "originalPrice": 150,
    "thumbnailUrl": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800",
    "category": "Freebies",
    "badge": "Hot Sell",
    "checkoutUrl": "https://t.me/arhambuilds",
    "features": [
      {
        "name": "Editable Canva Link",
        "description": "Quick and easy customizations"
      },
      {
        "name": "15+ Templates",
        "description": "Posts, stories, and cover designs"
      }
    ],
    "whatYouReceive": [
      "Access Link",
      "Step Guide"
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    "id": 1,
    "name": "Nevine Acotanza",
    "designation": "Chief Operating Officer",
    "company": "Upwork",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    "content": "Arham is an exceptional talent. He delivered our dashboard ahead of schedule and the quality surpassed our highest expectations.",
    "rating": 5
  },
  {
    "id": 2,
    "name": "Sarah Jennifer",
    "designation": "Creative Director",
    "company": "Pixel Perfect",
    "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    "content": "Working with Arham was a breeze. His attention to detail and creative vision brought our project to life in ways we didn't think possible.",
    "rating": 5
  }
];
