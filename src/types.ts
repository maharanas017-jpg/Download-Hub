export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'downloader' | 'ai';
  icon: string;
  popular?: boolean;
  trending?: boolean;
  latest?: boolean;
  metaTitle: string;
  metaDescription: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  readingTime: string;
  coverImage: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
}

export interface AdUnit {
  id: string;
  type: 'banner' | 'sidebar' | 'native';
  placeholderText: string;
}
