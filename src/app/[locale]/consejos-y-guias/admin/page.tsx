import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminClient from "./AdminClient";

// Server shell: renders the async Server Component <Footer> outside the client
// boundary. Rendering an async Server Component inside a "use client" component
// throws React error #482 ("async Client Component"). See AdminClient.tsx.
export default function TipsAdminPage() {
  return (
    <>
      <Header />
      <AdminClient />
      <Footer />
    </>
  );
}
