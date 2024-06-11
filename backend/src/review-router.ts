import express from "express";
import { prisma } from "./db";
import { requireAuth, auth } from "./middleware";

export const reviewRouter = express.Router();

//Update the user's original review
reviewRouter.put("/update/:courseID", requireAuth, async (req, res) => {
  const { courseID: courseCode } = req.params;
  const loggedInUser = await prisma.user.findUnique({
    where: { firebase_uid: req.token!.uid },
  });
  const reviewData = req.body;

  const reviews = await prisma.reviews.update({
    where: {
      course_code_user_id: {
        user_id: loggedInUser.id,
        course_code: courseCode,
      },
    },
    data: reviewData,
  });
  res.status(200).send("success");
});

// Get all reviews under a course
reviewRouter.get("/:courseID", async (req, res) => {
  const { courseID: courseCode } = req.params;
  try {
    const reviews = await prisma.reviews.findMany({
      where: {
        course_code: courseCode,
      },
    });
    const avgReviews = await prisma.reviews.aggregate({
      where: {
        course_code: courseCode,
      },
      _avg: {
        difficulty: true,
        interesting: true,
      },
    });
    const numLiked = await prisma.reviews.count({
      where: {
        course_code: courseCode,
        liked: true,
      },
    });
    res.json({ reviews, avgReviews, numLiked });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

//Get the user's review
reviewRouter.get("/:courseID/myreview", requireAuth, async (req, res) => {
  const { courseID: courseCode } = req.params;
  const loggedInUser = await prisma.user.findUnique({
    where: { firebase_uid: req.token!.uid },
  });

  try {
    const reviews = await prisma.reviews.findUnique({
      where: {
        course_code_user_id: {
          user_id: loggedInUser.id,
          course_code: courseCode,
        },
      },
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Get the average reviews of a course
reviewRouter.get("/:courseID/avgreviews", async (req, res) => {
  const { courseID: courseCode } = req.params;
  try {
    const avgReviews = await prisma.reviews.aggregate({
      where: {
        course_code: courseCode,
      },
      _avg: {
        difficulty: true,
        interesting: true,
      },
    });
    const numLiked = await prisma.reviews.count({
      where: {
        course_code: courseCode,
        liked: true,
      },
    });
    res.json({ avgReviews, numLiked });
  } catch (error) {
    console.error("Error fetching average reviews:", error);
    res.status(500).json({ error: "Failed to fetch average reviews" });
  }
});

// create a new review or update existing review
reviewRouter.post("/", requireAuth, async (req, res) => {
  const { uid } = req.token!;
  const {
    title,
    content,
    course_code,
    difficulty,
    interesting,
    liked,
    lastUpdated,
  } = req.body!;
  const loggedInUser = await prisma.user.findUnique({
    where: { firebase_uid: req.token!.uid },
  });

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are needed" });
  }

  // Check if the user has already submitted a review for the given course
  const existingReview = await prisma.reviews.findUnique({
    where: {
      course_code_user_id: {
        user_id: loggedInUser.id,
        course_code: course_code,
      },
    },
  });

  if (existingReview) {
    // Update existing review
    const updatedReview = await prisma.reviews.update({
      where: { id: existingReview.id },
      data: {
        title,
        content,
        difficulty,
        interesting,
        liked,
        lastUpdated,
      },
    });
    return res.json(updatedReview);
  } else {
    // Create new review
    const newReview = await prisma.reviews.create({
      data: {
        title,
        content,
        user: { connect: { id: loggedInUser.id } },
        course: { connect: { code: course_code } },
        difficulty,
        interesting,
        liked,
        lastUpdated,
      },
    });
    return res.json(newReview);
  }
});
