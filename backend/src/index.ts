import express from "express";
import cors from "cors";
import { z } from "zod";
import fs from "fs/promises";

const app = express();

app.use(cors());
app.use(express.json());

type Registration = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

const loadDB = async (filename: string) => {
  try {
    const rawData = await fs.readFile(
      `${__dirname}/../database/${filename}.json`,
      "utf-8"
    );
    const data = JSON.parse(rawData);
    return data as Registration[];
  } catch (error) {
    return null;
  }
};

const saveDB = async (filename: string, data: any) => {
  try {
    const fileContent = JSON.stringify(data);
    await fs.writeFile(
      `${__dirname}/../database/${filename}.json`,
      fileContent
    );
    return true;
  } catch (error) {
    return false;
  }
};

const PostRequest = z.object({
  email: z.string(),
  password: z.string(),
  passwordConfirmation: z.string(),
});

app.post("/api/userData", async (req, res) => {
  const result = PostRequest.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.issues);
  const newUserData = result.data;
  console.log(newUserData);
  const allUserData = await loadDB("data");
  console.log(allUserData);
  if (!allUserData) return res.sendStatus(500);
  const emailExists = allUserData.some(
    (user) => user.email === newUserData.email
  );
  if (emailExists) {
    return res.status(400).json({ error: "Email address already exists" });
  }
  if (newUserData.password !== newUserData.passwordConfirmation) {
    return res.status(400).json({ error: "Passwords are not the same" });
  }
  if (newUserData.password.length < 5) {
    return res
      .status(400)
      .json({ error: "Passwords need to be at least 5 character long" });
  }
  const isSuccessful = await saveDB("data", [
    ...allUserData,
    { ...newUserData },
  ]);

  if (!isSuccessful) return res.sendStatus(500);

  res.json({ ...newUserData });
});

app.listen(4500);
