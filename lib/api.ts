import axios, { AxiosError } from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

// Ambil token dari localStorage
const getToken = () => localStorage.getItem("token");

// Tipe untuk response sukses dari Laravel
interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email?: string; // optional kalau kamu tidak pakai
  };
}

// Tipe untuk response error dari Laravel
interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Fungsi login
export const login = async (name: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${BASE_URL}/login`, {
      name,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: "Terjadi kesalahan saat login." };
  }
};

// Fungsi logout
export const logout = async (): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  try {
    await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem("token");
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: "Terjadi kesalahan saat logout." };
  }
};
