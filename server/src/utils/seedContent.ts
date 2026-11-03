import Review from "../models/Review.js";
import Faq from "../models/Faq.js";
import ChatQuickReply from "../models/ChatQuickReply.js";
import PlatformCard from "../models/PlatformCard.js";
import CollectionPage from "../models/CollectionPage.js";
import SiteSettings from "../models/SiteSettings.js";

export async function seedContentIfEmpty() {
  if ((await SiteSettings.countDocuments()) === 0) {
    await SiteSettings.create({});
  }

  if ((await Review.countDocuments()) === 0) {
    await Review.insertMany([
      {
        name: "გიორგი მ.",
        text: "3DS კონსოლი შევუკვეთე RetroBit-ში და სასიამოვნოდ გამიკვირდა, რა სწრაფად მოვიდა. კონსოლი და დამტენი შიგ იყო, პრობლემა თამაშის დროს არ ყოფილა.",
        stars: 5,
        verified: true,
        order: 1,
      },
      {
        name: "ნინო კ.",
        text: "ორი თვის წინ ვიყიდე PS2. მითხრეს რომ იყო გამოყენებული, მაგრამ იდეალურ მდგომარეობაშია. თუ PS3-ს ეძებ, გირჩევ.",
        stars: 5,
        verified: true,
        order: 2,
      },
      {
        name: "დათო წ.",
        text: "N64 კონსოლის კომპლექტი და NBA Live შევუკვეთე. სწრაფად მოვიდა და ადვილად ჩავრთე. სურათი ცოტა პიქსელურია, მაგრამ ეს ძველ კონსოლს ახასიათებს.",
        stars: 4,
        verified: true,
        order: 3,
      },
      {
        name: "ანა ს.",
        text: "3DS XL ავიღე და ვერ ვიქნებოდი უფრო კმაყოფილი. მიწოდება სწრაფი იყო, ხარისხი კი ძალიან კარგი.",
        stars: 5,
        verified: true,
        order: 4,
      },
    ]);
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

  if ((await PlatformCard.countDocuments()) === 0) {
    await PlatformCard.insertMany([
      {
        brand: "nintendo",
        name: "Nintendo NES",
        slug: "nes",
        year: "1985",
        imageUrl: "/nintendo.svg",
        order: 1,
      },
      {
        brand: "nintendo",
        name: "Super Nintendo (SNES)",
        slug: "snes",
        year: "1991",
        imageUrl: "/nintendo.svg",
        order: 2,
      },
      {
        brand: "nintendo",
        name: "Nintendo 64",
        slug: "n64",
        year: "1996",
        imageUrl: "/nintendo.svg",
        order: 3,
      },
      {
        brand: "nintendo",
        name: "Nintendo GameCube",
        slug: "gamecube",
        year: "2001",
        imageUrl: "/nintendo.svg",
        order: 4,
      },
      {
        brand: "nintendo",
        name: "Nintendo Wii",
        slug: "wii",
        year: "2006",
        imageUrl: "/nintendo.svg",
        order: 5,
      },
      {
        brand: "nintendo",
        name: "Nintendo Wii U",
        slug: "wiiu",
        year: "2012",
        imageUrl: "/nintendo.svg",
        order: 6,
      },
      {
        brand: "nintendo",
        name: "Nintendo Switch",
        slug: "switch",
        year: "2017",
        imageUrl: "/nintendo.svg",
        order: 7,
      },
      {
        brand: "playstation",
        name: "PlayStation 1",
        slug: "ps1",
        year: "1995",
        imageUrl: "/playstation.svg",
        order: 1,
      },
      {
        brand: "playstation",
        name: "PlayStation 2",
        slug: "ps2",
        year: "2000",
        imageUrl: "/playstation.svg",
        order: 2,
      },
      {
        brand: "playstation",
        name: "PlayStation 3",
        slug: "ps3",
        year: "2006",
        imageUrl: "/playstation.svg",
        order: 3,
      },
      {
        brand: "playstation",
        name: "PlayStation 4",
        slug: "ps4",
        year: "2013",
        imageUrl: "/playstation.svg",
        order: 4,
      },
      {
        brand: "playstation",
        name: "PlayStation 5",
        slug: "ps5",
        year: "2020",
        imageUrl: "/playstation.svg",
        order: 5,
      },
      {
        brand: "playstation",
        name: "PlayStation Portable",
        slug: "psp",
        year: "2005",
        imageUrl: "/playstation.svg",
        order: 6,
      },
      {
        brand: "playstation",
        name: "PlayStation Vita",
        slug: "psvita",
        year: "2012",
        imageUrl: "/playstation.svg",
        order: 7,
      },
      {
        brand: "xbox",
        name: "Original Xbox",
        slug: "xbox",
        year: "2001",
        imageUrl: "/xbox.svg",
        order: 1,
      },
      {
        brand: "xbox",
        name: "Xbox 360",
        slug: "xbox360",
        year: "2005",
        imageUrl: "/xbox.svg",
        order: 2,
      },
      {
        brand: "xbox",
        name: "Xbox One",
        slug: "xboxone",
        year: "2013",
        imageUrl: "/xbox.svg",
        order: 3,
      },
      {
        brand: "sega",
        name: "Sega Genesis",
        slug: "sega-genesis",
        year: "1988",
        imageUrl: "/sega.svg",
        order: 1,
      },
    ]);
  }

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
