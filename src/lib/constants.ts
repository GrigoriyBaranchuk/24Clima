// WhatsApp Configuration
export const WHATSAPP_NUMBER = "50768282120";
export const WHATSAPP_DISPLAY = "+507 6828-2120";

export const getWhatsAppLink = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// Social Media Links
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/24clima?igsh=M2k5d21reHNlZzlu&utm_source=qr",
  facebook: "https://www.facebook.com/profile.php?id=61579864881211",
};

