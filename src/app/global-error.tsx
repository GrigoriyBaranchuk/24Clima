"use client";

import { ErrorScreen } from "./error";

// Catches errors thrown by the root layout itself (error.tsx cannot).
// Must render its own <html>/<body> because it replaces the root layout.
export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>
        <ErrorScreen {...props} />
      </body>
    </html>
  );
}
