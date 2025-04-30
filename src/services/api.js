import axios from "axios";

const API_URL =
  "https://cloud.servtech.com.tw:35678/webhook/b5ba5797-d0f6-4412-a921-7fc2b25b1438";

export const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL, {
      username,
      password,
    });

    const result = response.data[0];

    if (result.status === "success") {
      // 保存用户信息到 localStorage
      localStorage.setItem("userData", JSON.stringify(result.data));
      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } else {
      return {
        success: false,
        message: result.message || "登录失败",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "服务器连接失败",
    };
  }
};

export const logout = () => {
  localStorage.removeItem("userData");
};

export const getUserData = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};
