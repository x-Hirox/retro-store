export type SellBrand = {
  id: string;
  name: string;
  color: string;
  items: string[];
};

export const SELL_BRANDS: SellBrand[] = [
  {
    id: "nintendo",
    name: "Nintendo",
    color: "#c41e3a",
    items: [
      "NES",
      "SNES",
      "Nintendo 64",
      "GameCube",
      "Wii",
      "Wii U",
      "Switch / Switch Lite / OLED",
      "Game Boy / Color / Advance / SP",
      "DS / DSi / 3DS / 3DS XL",
      "თამაშები და აქსესუარები",
    ],
  },
  {
    id: "playstation",
    name: "PlayStation",
    color: "#003791",
    items: [
      "PlayStation 1",
      "PlayStation 2",
      "PlayStation 3",
      "PlayStation 4",
      "PlayStation 5",
      "PSP",
      "PS Vita",
      "თამაშები და აქსესუარები",
    ],
  },
  {
    id: "xbox",
    name: "Xbox",
    color: "#107c10",
    items: [
      "Original Xbox",
      "Xbox 360",
      "Xbox One",
      "Xbox Series S / X",
      "თამაშები და აქსესუარები",
    ],
  },
  {
    id: "sega",
    name: "SEGA",
    color: "#1b365d",
    items: [
      "Master System",
      "Mega Drive / Genesis",
      "Saturn",
      "Dreamcast",
      "Game Gear",
      "თამაშები და აქსესუარები",
    ],
  },
  {
    id: "atari",
    name: "Atari",
    color: "#111111",
    items: [
      "Atari 2600",
      "Atari 5200 / 7800",
      "Atari Jaguar",
      "ColecoVision",
      "TurboGrafx-16",
      "თამაშები და აქსესუარები",
    ],
  },
];

export const SELL_FAQS = [
  {
    q: "თუ სიაში ვერ ვპოულობ ჩემს ნივთს?",
    a: "დაამატე ხელით ქვემოთ ველში — სახელი და პლატფორმა. შეთავაზებას მაინც გამოგიგზავნით.",
  },
  {
    q: "რამდენ ხანში მივიღებ პასუხს?",
    a: "ჩვეულებრივ 1 სამუშაო დღეში. შემოწმების შემდეგ ანაზღაურება 3–5 სამუშაო დღეში.",
  },
  {
    q: "თუ მდგომარეობა განსხვავებულია?",
    a: "შემოწმებისას თუ განსხვავდება, ახალ შეთავაზებას გამოგიგზავნით. იძულებით არ ვყიდულობთ.",
  },
  {
    q: "ვის დავუკავშირდე?",
    a: "retrobit.support@gmail.com ან +995 595 95 00 39.",
  },
  {
    q: "დაზიანებულსაც ყიდულობთ?",
    a: "დიახ, გაუმართავ კონსოლსაც განვიხილავთ — ფასი მდგომარეობაზეა დამოკიდებული.",
  },
  {
    q: "შემიძლია უკან დაბრუნება გაგზავნის შემდეგ?",
    a: "თუ შეთავაზებაზე უარს იტყვი, ნივთს დაგიბრუნებთ. ტრანსპორტირება მხარეებს შორის შეთანხმებით.",
  },
];
