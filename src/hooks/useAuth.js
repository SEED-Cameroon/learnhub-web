import { useSyncExternalStore } from "react";

// TEMPORARY stand-in for real authentication. Replace the internals of this
// file with your actual auth context/provider (JWT flow, Firebase, etc.) once
// it exists — every consumer just needs { isAuthenticated, user, token } back,
// so nothing else in the app has to change when you swap this out.

const AUTH_TOKEN_KEY = "learnhub_auth_token";
const AUTH_USER_KEY = "learnhub_auth_user";
const AUTH_EVENT = "learnhub-auth-change";

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getServerSnapshot() {
  return null;
}

export function useAuth() {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const userJson = typeof window !== "undefined" ? localStorage.getItem(AUTH_USER_KEY) : null;
  const user = userJson ? JSON.parse(userJson) : null;
  return { isAuthenticated: Boolean(token), token, user };
}

// Dev-only helpers so you (or a reviewer) can test authenticated vs guest
// behavior without a real login flow. Safe to delete once real auth exists.
export function devLogin(name = "Test Student") {
  localStorage.setItem(AUTH_TOKEN_KEY, "dev-token");
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ name, avatarUrl: null }));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function devLogout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}