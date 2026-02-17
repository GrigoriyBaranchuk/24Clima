import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h2>404 — Page not found</h2>
      <Link href="/" style={{ display: "inline-block", marginTop: "1rem" }}>
        Go home
      </Link>
    </div>
  );
}
