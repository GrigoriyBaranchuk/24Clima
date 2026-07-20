"use client";

import { useState } from "react";
import Image from "next/image";
import { LocalizedTiendaLink } from "../LocalizedTiendaLink";
import type { ProductDetail } from "../../lib/api-client";
import { WhatsAppCta } from "@24clima/design/components";

type Props = {
  product: ProductDetail;
  addToCartLabel: string;
  askWhatsAppLabel: string;
  descriptionLabel: string;
  specsTitle: string;
  faqTitle: string;
  professionalLabel: string;
  whatsappNumber: string;
  whatsappOrderText: string;
};

export function ProductPageContent(props: Props) {
  const {
    product,
    addToCartLabel,
    askWhatsAppLabel,
    descriptionLabel,
    specsTitle,
    faqTitle,
    professionalLabel,
    whatsappNumber,
    whatsappOrderText,
  } = props;
  const images = product.images?.length ? product.images : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex];
  const faq = product.faq?.filter((f) => f.q && f.a) ?? [];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt ?? product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">—</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((im, idx) => (
                <button
                  key={im.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedIndex === idx ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                  }`}
                >
                  <Image src={im.url} alt={im.alt ?? ""} fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">{product.sku}</p>
            {product.is_b2b_only && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                {professionalLabel}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-foreground">{product.name}</h1>
          {product.price != null && (
            <p className="mt-4 text-2xl font-semibold text-primary">${product.price}</p>
          )}
          {product.short_description && (
            <p className="mt-4 text-muted-foreground">{product.short_description}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <LocalizedTiendaLink
              href={{ pathname: "/cart", query: { add: product.id } }}
              className="inline-flex rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
            >
              {addToCartLabel}
            </LocalizedTiendaLink>
            <WhatsAppCta
              href={"https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(whatsappOrderText)}
              size="lg"
            >
              {askWhatsAppLabel}
            </WhatsAppCta>
          </div>
        </div>
      </div>

      {product.attributes.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground">{specsTitle}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full max-w-2xl border-collapse text-sm">
              <tbody>
                {product.attributes.map((a) => (
                  <tr key={a.attribute_code} className="border-b border-border">
                    <th
                      scope="row"
                      className="py-2 pr-4 text-left font-medium text-muted-foreground align-top"
                    >
                      {a.attribute_name}
                    </th>
                    <td className="py-2 text-foreground">
                      {a.value}
                      {a.unit ? ` ${a.unit}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {product.description && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground">{descriptionLabel}</h2>
          <p className="mt-4 whitespace-pre-wrap text-muted-foreground">{product.description}</p>
        </section>
      )}

      {faq.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground">{faqTitle}</h2>
          <div className="mt-4 space-y-2">
            {faq.map((f, i) => (
              <details
                key={i}
                className="rounded-lg border border-border bg-card px-4 py-3"
              >
                <summary className="cursor-pointer font-medium text-foreground">{f.q}</summary>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
