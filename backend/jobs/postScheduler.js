import { Agenda } from "agenda";
import { MongoBackend } from "@agendajs/mongo-backend";
import { MongoClient } from "mongodb";

import Post from "../models/Post.js";

let agenda = null;
let mongoClient = null;

/* ==================================================
   ENVIRONMENT
================================================== */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("[Agenda] MONGODB_URI is not configured.");
}

/* ==================================================
   GET AGENDA INSTANCE
================================================== */

const getAgenda = () => {
  if (!agenda) {
    throw new Error("Agenda has not been initialized yet.");
  }

  return agenda;
};

/* ==================================================
   INITIALIZE AGENDA
================================================== */

export const initializeAgenda = async () => {
  if (agenda) {
    return agenda;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required to initialize Agenda.");
  }

  /*
   * IMPORTANT:
   *
   * Do NOT use:
   *
   * mongoose.connection.db
   *
   * Mongoose uses its own MongoDB/BSON dependency.
   *
   * Agenda's MongoBackend uses MongoDB 7.
   *
   * Therefore Agenda gets its own native MongoClient.
   */

  mongoClient = new MongoClient(MONGODB_URI);

  await mongoClient.connect();

  const db = mongoClient.db();

  console.log("[Agenda] Native MongoDB connection established.");

  agenda = new Agenda({
    backend: new MongoBackend({
      mongo: db,
      collection: "agendaJobs",
    }),

    processEvery: "5 seconds",

    removeOnComplete: true,

    name: `post-scheduler-${process.pid}`,
  });

  /* ==================================================
     AGENDA ERROR HANDLER
  ================================================== */

  agenda.on("error", (error) => {
    console.error("[Agenda] Error:", error);
  });

  /* ==================================================
     PUBLISH POST JOB
  ================================================== */

  agenda.define("publish-post", async (job) => {
    const { postId } = job.attrs.data || {};

    if (!postId) {
      throw new Error("publish-post job is missing postId");
    }

    /*
     * postId is deliberately a STRING.
     *
     * Mongoose handles conversion when calling
     * Post.findById().
     */

    const normalizedPostId = String(postId);

    console.log(`[Agenda] Processing post ${normalizedPostId}`);

    const post = await Post.findById(normalizedPostId);

    /* ------------------------------------------
       POST DELETED
    ------------------------------------------ */

    if (!post) {
      console.log(`[Agenda] Post ${normalizedPostId} no longer exists.`);

      return;
    }

    /* ------------------------------------------
       POST NO LONGER SCHEDULED
    ------------------------------------------ */

    if (post.status !== "Scheduled") {
      console.log(
        `[Agenda] Post ${normalizedPostId} is no longer scheduled. Current status: ${post.status}`,
      );

      return;
    }

    /* ------------------------------------------
       PUBLISH
    ------------------------------------------ */

    post.status = "Published";

    post.publishedAt = new Date();

    post.scheduledAt = null;

    await post.save();

    console.log(`[Agenda] Post ${normalizedPostId} published successfully.`);
  });

  return agenda;
};

/* ==================================================
   START AGENDA
================================================== */

export const startAgenda = async () => {
  const instance = getAgenda();

  await instance.start();

  console.log("[Agenda] Scheduler started.");
};

/* ==================================================
   STOP AGENDA
================================================== */

export const stopAgenda = async () => {
  if (!agenda) {
    return;
  }

  await agenda.stop();

  console.log("[Agenda] Scheduler stopped.");

  /*
   * Close the native MongoDB connection used
   * exclusively by Agenda.
   */

  if (mongoClient) {
    await mongoClient.close();

    mongoClient = null;
  }

  agenda = null;
};

/* ==================================================
   SCHEDULE POST
================================================== */

export const schedulePost = async (postId, scheduledAt) => {
  const instance = getAgenda();

  if (!postId) {
    throw new Error("postId is required");
  }

  if (!scheduledAt) {
    throw new Error("scheduledAt is required");
  }

  /*
   * ALWAYS store the ID as a string.
   *
   * Never pass a Mongoose ObjectId into Agenda.
   */

  const normalizedPostId = String(postId);

  const runAt = new Date(scheduledAt);

  if (Number.isNaN(runAt.getTime())) {
    throw new Error("Invalid scheduledAt date");
  }

  if (runAt.getTime() <= Date.now()) {
    throw new Error("Scheduled time must be in the future");
  }

  /*
   * Remove any existing schedule.
   */

  await cancelScheduledPost(normalizedPostId);

  /*
   * Create the Agenda job.
   */

  const job = await instance.schedule(runAt, "publish-post", {
    postId: normalizedPostId,
  });

  /*
   * Prevent duplicate jobs.
   */

  job.unique({
    name: "publish-post",

    "data.postId": normalizedPostId,
  });

  await job.save();

  console.log(
    `[Agenda] Post ${normalizedPostId} scheduled for ${runAt.toISOString()}`,
  );

  return job;
};

/* ==================================================
   CANCEL SCHEDULED POST
================================================== */

export const cancelScheduledPost = async (postId) => {
  if (!agenda || !postId) {
    return;
  }

  /*
   * IMPORTANT:
   *
   * Agenda receives a plain string.
   */

  const normalizedPostId = String(postId);

  const removed = await agenda.cancel({
    name: "publish-post",

    "data.postId": normalizedPostId,
  });

  if (removed > 0) {
    console.log(
      `[Agenda] Cancelled ${removed} job(s) for post ${normalizedPostId}`,
    );
  }
};

/* ==================================================
   DEFAULT EXPORT
================================================== */

export default getAgenda;
