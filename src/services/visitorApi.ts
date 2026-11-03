import { API_URL } from "../config";
const VISITORS_API = `${API_URL}/api/visitors`;

const getHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getVisitors = async () => {
  const response = await fetch(VISITORS_API, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch visitors");
  }

  return data.visitors;
};