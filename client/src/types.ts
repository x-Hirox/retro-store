export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount?: number; // 🟢 ფასდაკლების პროცენტი
  imageUrl?: string;
  category: string;
  stock: number;
  isHeroBanner?: boolean; // 🟢 მთავარი ბანერი
  platform?: string;
  genre?: string;
  isBestSeller?: boolean;
}

export interface IReview {
  _id: string;
  name: string;
  text: string;
  stars: number;
  avatarUrl?: string;
  productImageUrl?: string;
  verified: boolean;
  order: number;
  collectionSlug?: string;
}

export interface IFaq {
  _id: string;
  question: string;
  answer: string;
  order: number;
  collectionSlug?: string;
}

export interface IChatQuickReply {
  _id: string;
  title: string;
  description: string;
  icon: string;
  reply: string;
  order: number;
}

export interface IPlatformCard {
  _id: string;
  brand: string;
  name: string;
  slug: string;
  imageUrl: string;
  year?: string;
  order: number;
}

export interface ICollectionPage {
  _id: string;
  brand: string;
  title: string;
  subtitle?: string;
  description: string;
  bannerColor: string;
}

export interface ISiteSettings {
  _id?: string;
  chatGreeting: string;
  chatSubtitle: string;
  newsletterTitle: string;
  newsletterButton: string;
  footerPhone: string;
  footerEmail: string;
  footerHours: string;
  footerAddress: string;
}

export interface IChatMessage {
  _id: string;
  visitorName?: string;
  email?: string;
  message: string;
  reply?: string;
  createdAt: string;
}

export interface INewsletterSubscriber {
  _id: string;
  email: string;
  createdAt: string;
}
