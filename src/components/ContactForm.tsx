"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contactForm");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error sending message");
      }

      setFormState("success");
      setName("");
      setContact("");
      setMessage("");

      // Reset to idle after 5s
      setTimeout(() => setFormState("idle"), 5000);
    } catch (err) {
      setFormState("error");
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (formState === "success") {
    return (
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">{t("successTitle")}</h3>
          <p className="text-gray-600">{t("successMessage")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">{t("title")}</h3>
        <p className="text-gray-500 mb-6 text-sm">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
              {t("nameLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7BC043] focus:ring-2 focus:ring-[#7BC043]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              disabled={formState === "submitting"}
            />
          </div>

          {/* Contact (phone or email) */}
          <div>
            <label htmlFor="contact-info" className="block text-sm font-medium text-gray-700 mb-1">
              {t("contactLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-info"
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={t("contactPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7BC043] focus:ring-2 focus:ring-[#7BC043]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              disabled={formState === "submitting"}
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
              {t("messageLabel")} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7BC043] focus:ring-2 focus:ring-[#7BC043]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
              disabled={formState === "submitting"}
            />
          </div>

          {/* Error message */}
          {formState === "error" && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage || t("errorMessage")}</span>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={formState === "submitting"}
            className="w-full bg-[#1e3a5f] hover:bg-[#152d4a] text-white font-semibold py-6 text-base active:scale-[0.98] transition-all"
          >
            {formState === "submitting" ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t("sending")}
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {t("submit")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
