// 文件路径：src/app/api/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { config } from "dotenv";

config(); // 加载 .env 文件到 process.env

// GET: 获取用户信息
export async function GET() {
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
    return NextResponse.json(result.rows[0] || {});
  } catch (error) {
    console.error("数据库查询失败:", error);
    return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
  } finally {
    await client.end();
  }
}

// POST: 修改密码
export async function POST(request: NextRequest) {
  const { oldPassword, newPassword } = await request.json();

  // TODO: 实际开发中应验证旧密码是否正确
  // 示例逻辑：假设验证通过

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
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("修改密码失败:", error);
    return NextResponse.json({ error: "修改密码失败" }, { status: 500 });
  } finally {
    await client.end();
  }
}

// PUT: 更新用户信息（姓名、用户名、邮箱）
export async function PUT(request: NextRequest) {
  const { name, username, email } = await request.json();

  if (!name || !username || !email) {
    return NextResponse.json(
      { error: "缺少必要字段：name, username, email" },
      { status: 400 }
    );
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

    // 更新用户信息
    const result = await client.query(
      "UPDATE users SET name = $1, username = $2, email = $3 WHERE id = $4 RETURNING *",
      [name, username, email, 1]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const updatedUser = result.rows[0];

    // 返回更新后的数据
    return NextResponse.json({
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      last_login: updatedUser.last_login,
      registration_date: updatedUser.registration_date,
      status: updatedUser.status,
    });
  } catch (error) {
    console.error("数据库更新失败:", error);
    return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 });
  } finally {
    await client.end();
  }
}