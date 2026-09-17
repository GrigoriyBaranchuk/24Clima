import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoAdminClient from "./SeoAdminClient";

// Server shell: keeps the async Server Component <Footer> outside the client
// boundary to avoid React error #482. See SeoAdminClient.tsx.
export default function SeoAdminPage() {
  return (
    <>
      <Header />
      <SeoAdminClient />
      <Footer />
    </>
  );
}
