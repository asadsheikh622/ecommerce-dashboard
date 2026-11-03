import { API_URL } from "../config";
const ORDERS_API = `${API_URL}/api/orders`;

const getHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getAdminOrders = async () => {
  const response = await fetch(ORDERS_API, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load orders");
  }

  return data.orders;
};


export const updateOrderStatusApi = async (
  id: string,
  status: string
) => {
  const response = await fetch(`${ORDERS_API}/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({
      status: status.toLowerCase(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update order status");
  }

  return data.order;
};

export const updatePaymentStatusApi = async (
  id: string,
  paymentStatus: string
) => {
  const response = await fetch(`${ORDERS_API}/${id}/payment-status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({
      paymentStatus: paymentStatus.toLowerCase(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update payment status");
  }

  return data.order;
};
