import express from "express";
import { prisma } from "./db";
import { requireAuth, auth } from "./middleware";
export const userRouter = express.Router();

userRouter.delete("/delete", requireAuth, async (req, res) => {
  const { uid } = req.token!;
  const user = await prisma.user.findUnique({
    where: { firebase_uid: uid },
  });
  await prisma.reviews.deleteMany({
    where: {
      user_id: user.id,
    },
  });
  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
  res.status(200).send("success");
});

// get all users
userRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  const responseBody = [];
  for (const user of users) {
    responseBody.push({
      // important!!! we only return non-sensitive data
      name: user.name,
      id: user.id,
    });
  }
  res.json(responseBody);
});

// create a new user
userRouter.post("/", requireAuth, async (req, res) => {
  const { email, uid } = req.token!;
  const firebaseUser = await auth.getUser(uid);
  if (email.trim().length === 0) throw new Error("email is required");
  const oldUser = await prisma.user.findUnique({
    where: { firebase_uid: uid },
  });
  const needsMoreInfo = !oldUser;

  const newUser = await prisma.user.upsert({
    where: { firebase_uid: uid },
    create: {
      email,
      name: firebaseUser.displayName,
      firebase_uid: uid,
    },
    update: {
      email,
      name: firebaseUser.displayName,
    },
  });
  res.json({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    needsMoreInfo,
  });
});
userRouter.put("/", requireAuth, async (req, res) => {
  const { email, uid } = req.token!;
  const firebaseUser = await auth.getUser(uid);
  const userData = req.body;

  const user = await prisma.user.update({
    where: {
      firebase_uid: uid,
    },
    data: userData,
  });
  res.status(200).send("success");
});
userRouter.get("/currentUser", requireAuth, async (req, res) => {
  const { email, uid } = req.token!;
  const firebaseUser = await auth.getUser(uid);
  const userData = req.body;
  const user = await prisma.user.findUnique({
    where: {
      firebase_uid: uid,
    },
  });
  res.status(200).json(user);
});
