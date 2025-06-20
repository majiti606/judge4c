// updateUserInfo.ts
"use server";

import { Client } from "pg";
import { config } from "dotenv";

config();

export async function updateUserInfo(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  if (!name || !username || !email) {
    throw new Error("缺少必要字段：name, username, email");
  }

  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
  });

  try {
    await client.connect();

    const result = await client.query(
      "UPDATE users SET name = $1, username = $2, email = $3 WHERE id = $4 RETURNING *",
      [name, username, email, 1]
    );

    if (result.rowCount === 0) {
      throw new Error("用户不存在");
    }

    return result.rows[0];
  } catch (error) {
    console.error("数据库更新失败:", error);
    throw new Error("更新用户信息失败");
  } finally {
    await client.end();
  }
}