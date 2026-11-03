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
  footerPhone: { type: String, default: "+995 555 00 00 00" },
  footerEmail: { type: String, default: "help@retrobit.ge" },
  footerHours: { type: String, default: "ორშ–კვი 10:00–22:00" },
  footerAddress: { type: String, default: "თბილისი, საქართველო" },
});

export default model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
