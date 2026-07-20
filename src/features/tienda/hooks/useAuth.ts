"use client";

import { useState, useEffect } from "react";
import { api, type UserMe } from "../lib/api-client";
import { getShopToken, clearShopToken, notifyAuthChanged } from "../lib/shop-auth";

export function useAuth() {
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function load() {
      const token = getShopToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      api
        .getMe()
        .then(setUser)
        .catch(() => {
          clearShopToken();
          setUser(null);
        })
        .finally(() => setLoading(false));
    }

    load();
    const onAuthChanged = () => load();
    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
  }, []);

  async function logout() {
    try {
      await api.logout();
    } finally {
      clearShopToken();
      setUser(null);
      notifyAuthChanged();
    }
  }

  return { user, loading, logout };
}
