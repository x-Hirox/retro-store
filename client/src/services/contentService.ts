import API from "./api";
import type {
  IChatMessage,
  IChatQuickReply,
  ICollectionPage,
  IFaq,
  INewsletterSubscriber,
  IBrand,
  IPageMedia,
  IPlatformCard,
  IReview,
  ISiteSettings,
} from "../types";

export const getReviews = async (): Promise<IReview[]> =>
  (await API.get("/content/reviews")).data;

let faqCache: IFaq[] | null = null;

export const getFaqs = async (): Promise<IFaq[]> => {
  if (faqCache) return faqCache;
  faqCache = (await API.get("/content/faqs")).data;
  return faqCache!;
};

export const getChatReplies = async (): Promise<IChatQuickReply[]> =>
  (await API.get("/content/chat-replies")).data;

const CARD_STORE = "rb-platform-cards-v1";

function readCardStore(): IPlatformCard[] | null {
  try {
    const raw = sessionStorage.getItem(CARD_STORE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCardStore(list: IPlatformCard[]) {
  try {
    sessionStorage.setItem(CARD_STORE, JSON.stringify(list));
  } catch {
    /* quota */
  }
}

let platformCardCache: IPlatformCard[] | null = readCardStore();
let platformCardInflight: Promise<IPlatformCard[]> | null = null;
const collectionCache = new Map<string, ICollectionPage | null>();

export function peekPlatformCards(): IPlatformCard[] | null {
  return platformCardCache;
}

export function peekCollection(brand: string): ICollectionPage | null | undefined {
  const key = brand.toLowerCase();
  if (!collectionCache.has(key)) return undefined;
  return collectionCache.get(key);
}

export function invalidatePlatformCards() {
  platformCardCache = null;
  platformCardInflight = null;
  try {
    sessionStorage.removeItem(CARD_STORE);
  } catch {
    /* ignore */
  }
}

export const getPlatformCards = async (
  brand?: string,
): Promise<IPlatformCard[]> => {
  const all = await loadPlatformCards();
  if (!brand) return all;
  const key = brand.toLowerCase();
  return all.filter((card) => String(card.brand || "").toLowerCase() === key);
};

function loadPlatformCards(): Promise<IPlatformCard[]> {
  if (platformCardCache) return Promise.resolve(platformCardCache);
  if (platformCardInflight) return platformCardInflight;
  platformCardInflight = API.get("/content/platform-cards")
    .then((response) => {
      platformCardCache = response.data;
      writeCardStore(platformCardCache!);
      return platformCardCache!;
    })
    .finally(() => {
      platformCardInflight = null;
    });
  return platformCardInflight;
}

export const getCollectionPage = async (
  brand: string,
): Promise<ICollectionPage | null> => {
  const key = brand.toLowerCase();
  if (collectionCache.has(key)) return collectionCache.get(key)!;
  const page = (
    await API.get(`/content/collections/brand/${encodeURIComponent(brand)}`)
  ).data as ICollectionPage | null;
  collectionCache.set(key, page);
  return page;
};

export const getSiteSettings = async (): Promise<ISiteSettings> =>
  (await API.get("/content/settings")).data;

export const getPageMedia = async (): Promise<IPageMedia[]> =>
  (await API.get("/content/page-media")).data;

export const getBrands = async (): Promise<IBrand[]> =>
  (await API.get("/content/brands")).data;

export const subscribeNewsletter = async (email: string) =>
  (await API.post("/content/newsletter", { email })).data;

export const askChat = async (
  message: string,
  visitorName?: string,
  email?: string,
  notify?: boolean,
) =>
  (await API.post("/content/chat/ask", {
    message,
    visitorName,
    email,
    notify,
  })).data as {
    reply: string;
  };

function invalidateContent(path: string) {
  if (path.includes("platform-cards")) invalidatePlatformCards();
  if (path.includes("collections")) collectionCache.clear();
}

export const createContent = async (path: string, data: unknown) => {
  const result = (await API.post(`/content/${path}`, data)).data;
  invalidateContent(path);
  return result;
};

export const updateContent = async (path: string, id: string, data: unknown) => {
  const result = (await API.put(`/content/${path}/${id}`, data)).data;
  invalidateContent(path);
  return result;
};

export const deleteContent = async (path: string, id: string) => {
  const result = (await API.delete(`/content/${path}/${id}`)).data;
  invalidateContent(path);
  return result;
};

export const updateSettings = async (data: Partial<ISiteSettings>) =>
  (await API.put("/content/settings", data)).data;

export const getChatMessages = async (): Promise<IChatMessage[]> =>
  (await API.get("/content/chat-messages")).data;

export const getSubscribers = async (): Promise<INewsletterSubscriber[]> =>
  (await API.get("/content/newsletter")).data;

export const getCollections = async (): Promise<ICollectionPage[]> =>
  (await API.get("/content/collections")).data;
