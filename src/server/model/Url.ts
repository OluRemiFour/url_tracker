import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  logs: [
    {
      timestamp: { type: Date, default: Date.now },
      ip: String,
      userAgent: String,
      location: String,
      // session: String,
      // pages: String,
    },
  ],
});

export default mongoose.model("Url", urlSchema);
