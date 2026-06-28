// Default-locale (es, no prefix) route for the SEO admin dashboard. Mirrors the
// pattern of the sibling admin page: re-export the shared server shell from the
// [locale] tree so /consejos-y-guias/admin/seo resolves in the (es) group too.
export { default } from "@/app/[locale]/consejos-y-guias/admin/seo/page";
