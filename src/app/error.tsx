"use client";

import { reloadOnceForSkew } from "@/lib/skew-error";
import { useEffect, useState } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Inline styles on purpose: when a chunk fails to load, the layout CSS may
// be part of what failed, so this screen must not depend on Tailwind.
const styles = {
  wrap: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1.25rem",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    textAlign: "center" as const,
    color: "#111",
  },
  h1: { fontSize: "1.5rem", fontWeight: 600, margin: "0 0 0.5rem" },
  p: { fontSize: "1rem", color: "#555", margin: "0 0 1.5rem", maxWidth: 420 },
  primary: {
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondary: {
    background: "transparent",
    color: "#555",
    border: "none",
    marginTop: "0.75rem",
    fontSize: "0.9rem",
    cursor: "pointer",
    textDecoration: "underline",
  },
  digest: { marginTop: "1.5rem", fontSize: "0.75rem", color: "#999" },
};

export function ErrorScreen({ error, reset }: ErrorProps) {
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    console.error(error);
    if (reloadOnceForSkew(error)) setReloading(true);
  }, [error]);

  if (reloading) return null;

  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>Algo salió mal</h1>
      <p style={styles.p}>
        Ocurrió un error al cargar la página. Por favor, recárgala para
        continuar.
      </p>
      <button
        type="button"
        style={styles.primary}
        onClick={() => window.location.reload()}
      >
        Recargar la página
      </button>
      <button type="button" style={styles.secondary} onClick={reset}>
        Intentar de nuevo
      </button>
      {error.digest && <div style={styles.digest}>Ref: {error.digest}</div>}
    </div>
  );
}

export default function ErrorPage(props: ErrorProps) {
  return <ErrorScreen {...props} />;
}
