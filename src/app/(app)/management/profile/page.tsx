"use client"
import { useEffect, useState } from "react"

// 定义用户数据接口
interface User {
  name: string
  role: string
  last_login: string
  username: string
  email: string
  registration_date: string
  status: string
}

export default function ProfilePage() {
  // 明确指定 user 的类型为 User | null
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetch("/api/user")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP 错误！状态码：${res.status}`)
        }
        return res.json()
      })
      .then((data) => setUser(data))
      .catch((error) => {
        console.error("获取用户数据失败:", error)
        // 可以设置默认值或提示用户检查网络
      })
  }, [])

  const handleSave = () => {
    const updatedData = {
      name: (document.getElementById("name") as HTMLInputElement).value,
      username: (document.getElementById("username") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
    }

    fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (res.ok) {
          setUser({ ...user!, ...updatedData }) // 更新本地状态
          setIsEditing(false)
        } else {
          alert("更新失败，请重试。")
        }
      })
      .catch((err) => {
        console.error("保存出错:", err)
        alert("保存时发生错误。")
      })
  }

  if (!user) return <p>加载中...</p>

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
                defaultValue={user.name}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <h2 className="text-xl font-semibold">{user.name}</h2>
            )}
            <p className="text-gray-500">角色：{user.role}</p>
            <p className="text-gray-500">最后登录时间：{user.last_login}</p>
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
                defaultValue={user.username}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="mt-1 text-lg font-medium text-gray-900">{user.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">邮箱地址</label>
            {isEditing ? (
              <input
                id="email"
                type="email"
                defaultValue={user.email}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="mt-1 text-lg font-medium text-gray-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">注册时间</label>
            <p className="mt-1 text-lg font-medium text-gray-900">{user.registration_date}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">状态</label>
            <p
              className={`mt-1 text-lg font-medium ${
                user.status === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {user.status === "active" ? "已激活" : "未激活"}
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
  )
}