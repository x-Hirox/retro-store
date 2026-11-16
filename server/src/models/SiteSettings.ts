import { Schema, model, Document } from "mongoose";

export interface ISiteSettings extends Document {
  chatGreeting: string;
  chatSubtitle: string;
  newsletterTitle: string;
  newsletterButton: string;
  footerPhone: string;
  footerEmail: string;
  footerHours: string;
  footerAddress: string;
  catImageHome?: string;
  catImageHand?: string;
  catImageGames?: string;
  catImageAcc?: string;
  catImageBundles?: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  chatGreeting: { type: String, default: "გამარჯობა, კარგია რომ შემოხვედი! 👋" },
  chatSubtitle: {
    type: String,
    default: "დახმარება გჭირდება თუ უბრალოდ გეიმინგის განწყობა გაქვს?",
  },
  newsletterTitle: {
    type: String,
    default: "დარეგისტრირდი და მიიღე 10% ფასდაკლება პირველ შეკვეთაზე",
  },
  newsletterButton: { type: String, default: "10% ფასდაკლება" },
  footerPhone: { type: String, default: "+995 595 95 00 39" },
  footerEmail: { type: String, default: "retrobit.support@gmail.com" },
  footerHours: { type: String, default: "ორშ–კვი 10:00–22:00" },
  footerAddress: { type: String, default: "თბილისი, საქართველო" },
  catImageHome: { type: String, default: "" },
  catImageHand: { type: String, default: "" },
  catImageGames: { type: String, default: "" },
  catImageAcc: { type: String, default: "" },
  catImageBundles: { type: String, default: "" },
});

export default model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
