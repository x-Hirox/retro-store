import API from "./api";
import type {
  IChatMessage,
  IChatQuickReply,
  ICollectionPage,
  IFaq,
  INewsletterSubscriber,
  IPlatformCard,
  IReview,
  ISiteSettings,
} from "../types";

export const getReviews = async (): Promise<IReview[]> =>
  (await API.get("/content/reviews")).data;

export const getFaqs = async (): Promise<IFaq[]> =>
  (await API.get("/content/faqs")).data;

export const getChatReplies = async (): Promise<IChatQuickReply[]> =>
  (await API.get("/content/chat-replies")).data;

export const getPlatformCards = async (brand?: string): Promise<IPlatformCard[]> => {
  const url = brand
    ? `/content/platform-cards/brand/${encodeURIComponent(brand)}`
    : "/content/platform-cards";
  return (await API.get(url)).data;
};

export const getCollectionPage = async (
  brand: string,
): Promise<ICollectionPage | null> =>
  (await API.get(`/content/collections/brand/${encodeURIComponent(brand)}`)).data;

export const getSiteSettings = async (): Promise<ISiteSettings> =>
  (await API.get("/content/settings")).data;

export const subscribeNewsletter = async (email: string) =>
  (await API.post("/content/newsletter", { email })).data;

export const askChat = async (message: string, visitorName?: string) =>
  (await API.post("/content/chat/ask", { message, visitorName })).data as {
    reply: string;
  };

export const createContent = async (path: string, data: unknown) =>
  (await API.post(`/content/${path}`, data)).data;

export const updateContent = async (path: string, id: string, data: unknown) =>
  (await API.put(`/content/${path}/${id}`, data)).data;

export const deleteContent = async (path: string, id: string) =>
  (await API.delete(`/content/${path}/${id}`)).data;

export const updateSettings = async (data: Partial<ISiteSettings>) =>
  (await API.put("/content/settings", data)).data;

export const getChatMessages = async (): Promise<IChatMessage[]> =>
  (await API.get("/content/chat-messages")).data;

export const getSubscribers = async (): Promise<INewsletterSubscriber[]> =>
  (await API.get("/content/newsletter")).data;

export const getCollections = async (): Promise<ICollectionPage[]> =>
  (await API.get("/content/collections")).data;
