import express from "express";
import { nanoid } from "nanoid";
import Url from "../model/Url";
import geoip from "geoip-lite";

const router = express.Router();

router.get("/", async (req, res) => {
  return res.status(200).json({
    status: "Success",
    statusCode: "00",
    message: "Welcome to your url page",
  });
});

// create a post
router.post("/shorten", async (req, res) => {
  if (!req.body) {
    return res.status(404).json({
      statusCode: "01",
      message: "Kindly input your url!",
    });
  }

  const { originalUrl } = req.body;
  const shortId = nanoid(6);

  const newUrl = await Url.create({ originalUrl, shortId });

  return res.json({
    status: "Success",
    statusCode: "00",
    message: "Url created successfully",
    shortUrl: `${process.env.BASE_URL}/${shortId}`,
  });
});

// Redirect and track
router.get("/your_url_tracker/:shortId", async (req, res) => {
  if (!req.params) {
    return res.status(400).json({
      status: "Failed",
      statusCode: "01",
      message: "Invalid id",
    });
  }
  try {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId });
    console.log(url);
    if (!url)
      return res.json({
        statusCode: "01",
        status: 400,
        message: "URL not found",
      });

    // get location from location api
    const ip = req.ip || "";
    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.city}, ${geo.country}` : "unknown";

    url.clicks++;
    url.logs.push({
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      location: req.headers["location"] || location || "unknown",
      timestamp: Date.now(),
      // pages: '',
      // session: req.headers
    });
    await url.save();
    console.log(url, 2);
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({
      statusCode: "01",
      status: 500,
      message: "Server Error, Please try again!",
    });
  }
});

// Get Analytics Reports.
router.get("/anlytics/:shortId", async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });
  res.status(200).json({
    statusCode: "00",
    message: "Successful retrieve url",
    data: url,
  });
});

export default router;
