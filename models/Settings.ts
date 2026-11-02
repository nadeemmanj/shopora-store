import mongoose, { Schema, model, models, type Document } from "mongoose";

export interface ISettings extends Document {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
}

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: { type: String, default: "Shopora" },
    tagline: { type: String, default: "Shop Smart, Live Beautiful" },
    supportEmail: { type: String, default: "" },
    supportPhone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

const Settings = models.Settings || model<ISettings>("Settings", SettingsSchema);
export default Settings;
