import { API_URL } from "../config";
const SETTINGS_API = `${API_URL}/api/settings`;

const getHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get monthly goal
export const getMonthlyGoal = async () => {
  const response = await fetch(`${SETTINGS_API}/monthly-goal`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch monthly goal");
  }

  return data.monthlyGoal;
};

// Save monthly goal
export const updateMonthlyGoal = async (monthlyGoal: number) => {
  const response = await fetch(`${SETTINGS_API}/monthly-goal`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ monthlyGoal }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update monthly goal");
  }

  return data.monthlyGoal;
};