import Review from "../models/Review.js";
import Faq from "../models/Faq.js";
import ChatQuickReply from "../models/ChatQuickReply.js";
import PlatformCard from "../models/PlatformCard.js";
import CollectionPage from "../models/CollectionPage.js";
import SiteSettings from "../models/SiteSettings.js";
import PageMedia from "../models/PageMedia.js";
import Brand from "../models/Brand.js";
import { PLATFORM_SEED, isGenericBrandLogo } from "./platformSeed.js";
import { HOME_PAGE_MEDIA_KEYS, PAGE_MEDIA_SEED } from "./pageMediaSeed.js";
import { BRAND_SEED } from "./brandSeed.js";

export async function seedContentIfEmpty() {
  if ((await SiteSettings.countDocuments()) === 0) {
    await SiteSettings.create({});
  }
  const settings = await SiteSettings.findOne();
  if (settings) {
    const phone = String(settings.footerPhone || "").replace(/\s|-/g, "");
    const email = String(settings.footerEmail || "");
    const $set: Record<string, string> = {};
    if (!phone || /555000000/.test(phone) || phone === "+995555000000") {
      $set.footerPhone = "+995 595 95 00 39";
    }
    if (!email || /help@retrobit\.ge/i.test(email)) {
      $set.footerEmail = "retrobit.support@gmail.com";
    }
    if (Object.keys($set).length) {
      await SiteSettings.updateOne({ _id: settings._id }, { $set });
    }
  }

  const geoReviews = [
    {
      name: "გიორგი მ.",
      text: "3DS შევუკვეთე. მეორე დღეს მოვიდა, დამტენით. ჩავრთე და პრობლემა არ ყოფილა.",
      stars: 5,
      verified: true,
      order: 1,
    },
    {
      name: "ნინო კ.",
      text: "PS2 ავიღე მეორადი. გარეგნულად და ხმით კარგია. იგივე მაღაზიიდან PS3-საც ვუყურებ.",
      stars: 5,
      verified: true,
      order: 2,
    },
    {
      name: "დათო წ.",
      text: "N64 და ერთი თამაში ერთად მოვიდა. სწრაფად ჩავრთე. სურათი პიქსელურია — ეს ამ კონსოლის სტილია.",
      stars: 4,
      verified: true,
      order: 3,
    },
    {
      name: "ანა ს.",
      text: "3DS XL-ით კმაყოფილი ვარ. მიწოდება სწრაფი იყო, კონსოლი სუფთაა.",
      stars: 5,
      verified: true,
      order: 4,
    },
  ];
  for (const review of geoReviews) {
    await Review.findOneAndUpdate({ name: review.name }, review, {
      upsert: true,
    });
  }

  if ((await Faq.countDocuments()) === 0) {
    await Faq.insertMany([
      {
        question: "რატომ უნდა ვიყიდო RetroBit-ში?",
        answer:
          "ყველა კონსოლი და თამაში გადის ტექნიკურ შემოწმებას. გეძლევა 1 წლიანი გარანტია და უფასო მიწოდება შესაბამის შეკვეთებზე.",
        order: 1,
      },
      {
        question: "ამ კოლექციაში პროდუქტები ორიგინალია თუ მესამე მხარის?",
        answer:
          "ძირითადი ასორტიმენტი ორიგინალია. თუ პროდუქტი თავსებადი/მესამე მხარისაა, ეს აღწერაში ცალკე იწერება.",
        order: 2,
      },
      {
        question: "როგორ ავირჩიო სწორი პროდუქტი ჩემი სეთაპისთვის?",
        answer:
          "გამოიყენე ფილტრი პლატფორმისა და ჟანრის მიხედვით ან მოგვწერე ჩატში — გუნდი დაგეხმარება.",
        order: 3,
      },
      {
        question: "შემიძლია უფასო მიწოდებისთვის საკმარისი თანხის შეგროვება?",
        answer:
          "დიახ. ზედა ზოლში ჩანს მიმდინარე აქცია. დეტალები ადმინ პანელიდან იცვლება.",
        order: 4,
      },
      {
        question: "რა გადახდის მეთოდები მაქვს?",
        answer:
          "ბარათით გადახდა, ნაწილ-ნაწილ გადახდა და სხვა მეთოდები ხელმისაწვდომია შეკვეთის გვერდზე.",
        order: 5,
      },
      {
        question: "აქვს პროდუქტს გარანტია და შემიძლია დამატებითი დაცვა?",
        answer:
          "ყველა კონსოლზე მოქმედებს 1-წლიანი გარანტია. დამატებითი დაცვა შეგიძლია ადმინის მიერ დამატებულ პროდუქტად აირჩიო.",
        order: 6,
      },
      {
        question: "რა მოხდება, თუ შეძენით არ დავკმაყოფილდები?",
        answer:
          "გვაქვს დაბრუნების პოლიტიკა. დაგვიკავშირდი ჩატით ან ელფოსტით და დაგეხმარებით.",
        order: 7,
      },
    ]);
  }

  if ((await ChatQuickReply.countDocuments()) === 0) {
    await ChatQuickReply.insertMany([
      {
        title: "ჩემი შეკვეთის თვალყური",
        description: "სად არის ჩემი ამანათი?",
        icon: "📦",
        reply:
          "შეკვეთის სტატუსის სანახავად გახსენი წარმატებული შეკვეთის გვერდი ან მოგვწერე შეკვეთის ID.",
        order: 1,
      },
      {
        title: "მომძებნე თამაში ან კონსოლი",
        description: "მითხარი რას ეძებ",
        icon: "🎮",
        reply:
          "დაწერე კონსოლის ან თამაშის სახელი. შეგიძლია Nintendo, PlayStation, Xbox ან Sega კატეგორიებშიც ნახო.",
        order: 2,
      },
      {
        title: "დაბრუნება და გარანტია",
        description: "რაღაც ისე არ არის...",
        icon: "↩️",
        reply:
          "1 წლიანი გარანტია მოქმედებს. დაბრუნებისთვის მოგვწერე შეკვეთის ID და პრობლემის მოკლე აღწერა.",
        order: 3,
      },
      {
        title: "ტრეიდ-ინი და ლოიალობა",
        description: "თამაშები თაროზე გროვდება?",
        icon: "🎁",
        reply:
          "ძველი კონსოლის ან თამაშების გაყიდვა შეგიძლია „გაყიდე შენი თამაშები“ სექციიდან. დეტალებს ადმინი განაახლებს.",
        order: 4,
      },
    ]);
  }

  await ensurePlatformCatalog();
  await ensurePageMedia();
  await ensureBrandLogos();

  if ((await CollectionPage.countDocuments()) === 0) {
    await CollectionPage.insertMany([
      {
        brand: "nintendo",
        title: "Nintendo",
        subtitle: "კონსოლები და თამაშები",
        bannerColor: "#c41e3a",
        description:
          "Nintendo-ს ლეგენდარული კონსოლები NES-იდან Switch-მდე. აღდგენილი ტექნიკა, ორიგინალი თამაშები და 1 წლიანი გარანტია.",
      },
      {
        brand: "playstation",
        title: "PlayStation",
        subtitle: "Sony-ს კულტური კონსოლები",
        bannerColor: "#003791",
        description:
          "PS1-იდან PS5-მდე, PSP და Vita. განახლებული კონსოლები და პორტატული სისტემები მზადაა ახალი თავგადასავლებისთვის.",
      },
      {
        brand: "xbox",
        title: "Xbox",
        subtitle: "Microsoft-ის კონსოლები",
        bannerColor: "#107c10",
        description:
          "Original Xbox, Xbox 360 და Xbox One — შემოწმებული კონსოლები და თამაშები.",
      },
      {
        brand: "sega",
        title: "Sega",
        subtitle: "Genesis და სხვა კლასიკა",
        bannerColor: "#1b365d",
        description:
          "Sega-ს კლასიკური კონსოლები და თამაშები ნოსტალგიის მოყვარულებისთვის.",
      },
    ]);
  }
}

let platformCatalogReady = false;

export async function ensurePlatformCatalog() {
  if (platformCatalogReady) return;

  const wiiuCards = await PlatformCard.find({ slug: "wiiu" });
  for (const doc of wiiuCards) {
    const existing = await PlatformCard.findOne({
      brand: doc.brand,
      slug: "wii-u",
    });
    if (existing) {
      await PlatformCard.deleteOne({ _id: doc._id });
    } else {
      doc.slug = "wii-u";
      await doc.save();
    }
  }

  const all = await PlatformCard.find().sort({ _id: 1 });
  const seen = new Set<string>();
  for (const doc of all) {
    const key = `${String(doc.brand).toLowerCase()}::${String(doc.slug).toLowerCase()}`;
    if (seen.has(key)) {
      await PlatformCard.deleteOne({ _id: doc._id });
    } else {
      seen.add(key);
    }
  }

  for (const card of PLATFORM_SEED) {
    const existing = await PlatformCard.findOne({
      brand: card.brand,
      slug: card.slug,
    });
    if (!existing) {
      await PlatformCard.create(card);
      continue;
    }
    const $set: Record<string, unknown> = {};
    if (isGenericBrandLogo(existing.imageUrl) && card.imageUrl) {
      $set.imageUrl = card.imageUrl;
    }
    if (Object.keys($set).length) {
      await PlatformCard.updateOne({ _id: existing._id }, { $set });
    }
  }

  platformCatalogReady = true;
}

let pageMediaReady = false;

export async function ensurePageMedia() {
  if (pageMediaReady) return;

  await PageMedia.deleteMany({ key: { $in: HOME_PAGE_MEDIA_KEYS } });

  for (const item of PAGE_MEDIA_SEED) {
    const existing = await PageMedia.findOne({ key: item.key });
    if (!existing) {
      await PageMedia.create({
        key: item.key,
        title: item.title,
        imageUrl: item.imageUrl,
        order: item.order,
      });
      continue;
    }
    const $set: Record<string, unknown> = { title: item.title, order: item.order };
    if (!String(existing.imageUrl || "").trim()) {
      $set.imageUrl = item.imageUrl;
    }
    await PageMedia.updateOne({ _id: existing._id }, { $set });
  }

  pageMediaReady = true;
}

let brandLogosReady = false;

export async function ensureBrandLogos() {
  if (brandLogosReady) return;

  for (const item of BRAND_SEED) {
    const existing = await Brand.findOne({ slug: item.slug });
    if (!existing) {
      await Brand.create(item);
      continue;
    }
    const $set: Record<string, unknown> = { name: item.name, order: item.order };
    const current = String(existing.imageUrl || "").trim();
    if (!current) $set.imageUrl = item.imageUrl;
    await Brand.updateOne({ _id: existing._id }, { $set });
  }

  brandLogosReady = true;
}
