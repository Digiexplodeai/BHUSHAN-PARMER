export interface Appointment {
  id?: string;
  patientName: string;
  phone: string;
  email: string;
  country: string;
  preferredDate: string;
  consultationType: string;
  message: string;
  status: 'New' | 'Contacted' | 'Appointment Booked' | 'Completed' | 'Closed';
  notes?: string;
  submittedAt: string;
}

export interface Treatment {
  id?: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  order: number;
  isVisible: boolean;
}

export interface CancerType {
  id?: string;
  title: string;
  slug: string;
  introduction: string;
  symptoms: string;
  riskFactors: string;
  diagnosis: string;
  treatmentOptions: string;
  imageUrl: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  text: string;
  rating: number;
  source: string;
  date: string;
  isVisible: boolean;
  order: number;
}

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Setting {
  id?: string;
  key: string;
  value: any;
  updatedAt: string;
}

export interface Milestone {
  id?: string;
  year: string;
  title: string;
  description: string;
  order: number;
}

export interface Highlight {
  id?: string;
  title: string;
  description: string;
  iconName?: string;
  imageUrl?: string;
  order: number;
  isVisible: boolean;
}
