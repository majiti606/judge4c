// src/app/(app)/management/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo } from "@/app/(app)/management/actions";

interface User {
  name: string;
  role: string;
  last_login: string;
  username: string;
  email: string;
  registration_date: string;
  status: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserInfo();
        setUser(data);
      } catch (error) {
        console.error("获取用户信息失败:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", (document.getElementById("name") as HTMLInputElement).value);
    formData.append("username", (document.getElementById("username") as HTMLInputElement).value);
    formData.append("email", (document.getElementById("email") as HTMLInputElement).value);

    try {
      const updatedUser = await updateUserInfo(formData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <p>加载中...</p>;

  return (
    <div className="h-full w-full p-6">
      <div className="h-full w-full bg-white shadow-lg rounded-xl p-8 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">登录信息</h1>

        <div className="flex items-center space-x-6 mb-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              👤
            </div>
          </div>
          <div>
            {isEditing ? (
              <input
                id="name"
                type="text"
                defaultValue={user?.name}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <h2 className="text-xl font-semibold">{user?.name}</h2>
            )}
            <p className="text-gray-500">角色：{user?.role}</p>
            <p className="text-gray-500">最后登录时间：{user?.last_login}</p>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700">用户名</label>
            {isEditing ? (
              <input
                id="username"
                type="text"
                defaultValue={user?.username}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="mt-1 text-lg font-medium text-gray-900">{user?.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">邮箱地址</label>
            {isEditing ? (
              <input
                id="email"
                type="email"
                defaultValue={user?.email}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="mt-1 text-lg font-medium text-gray-900">{user?.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">注册时间</label>
            <p className="mt-1 text-lg font-medium text-gray-900">{user?.registration_date}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">状态</label>
            <p
              className={`mt-1 text-lg font-medium ${
                user?.status === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {user?.status === "active" ? "已激活" : "未激活"}
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                type="button"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                保存
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              type="button"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              编辑信息
            </button>
          )}
        </div>
      </div>
    </div>
  );
}