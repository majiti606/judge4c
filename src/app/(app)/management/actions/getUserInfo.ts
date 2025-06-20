// getUserInfo.ts
"use server";

import { Client } from "pg";
import { config } from "dotenv";

config();

export async function getUserInfo() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
  });

  try {
    await client.connect();
    const result = await client.query("SELECT * FROM users WHERE id = $1", [1]);
    return result.rows[0] || {};
  } catch (error) {
    console.error("数据库查询失败:", error);
    throw new Error("获取用户信息失败");
  } finally {
    await client.end();
  }
}