// changePassword.ts
"use server";

import { Client } from "pg";
import { config } from "dotenv";

config();

export async function changePassword(formData: FormData) {
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
  });

  try {
    await client.connect();
    await client.query("UPDATE users SET password = $1 WHERE id = $2", [
      newPassword,
      1,
    ]);
    return { success: true };
  } catch (error) {
    console.error("修改密码失败:", error);
    throw new Error("修改密码失败");
  } finally {
    await client.end();
  }
}