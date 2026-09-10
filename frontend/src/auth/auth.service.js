import { API_URL } from "../config";

// same three keys the Angular app used
export function saveAuthData(token, expirationDate, userId) {
  localStorage.setItem("token", token);
  localStorage.setItem("expiration", expirationDate.toISOString());
  localStorage.setItem("userId", userId);
}

export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("userId");
}

export function getAuthData() {
  const token = localStorage.getItem("token");
  const expiration = localStorage.getItem("expiration");
  const userId = localStorage.getItem("userId");

  if (!token || !expiration) {
    return null;
  }

  return {
    token: token,
    expirationDate: new Date(expiration),
    userId: userId
  };
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function createUser(email, password) {
  const res = await fetch(API_URL + "/user/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function login(email, password) {
  const res = await fetch(API_URL + "/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  // the backend sends back { token, expiresIn, userId }
  const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);
  saveAuthData(data.token, expirationDate, data.userId);

  return data;
}
