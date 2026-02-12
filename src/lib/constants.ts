// WhatsApp Configuration
export const WHATSAPP_NUMBER = "50768282120";
export const WHATSAPP_DISPLAY = "+507 6828-2120";

export const getWhatsAppLink = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// Default messages
export const WHATSAPP_MESSAGES = {
  general: "Hola, necesito información sobre sus servicios de aire acondicionado en Panamá.",
  appointment: "Hola, necesito agendar un servicio de aire acondicionado.",
  emergency: "Hola, necesito un servicio urgente de aire acondicionado.",
  quote: "Hola, me gustaría solicitar una cotización para servicio de aire acondicionado.",
};

// Social Media Links
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/24clima?igsh=M2k5d21reHNlZzlu&utm_source=qr",
  facebook: "https://www.facebook.com/profile.php?id=61579864881211",
};

// Company Info
export const COMPANY = {
  name: "24clima",
  tagline: "Servicio de Aire Acondicionado en Panamá",
  phone: WHATSAPP_DISPLAY,
  address: "Ciudad de Panamá, Panamá",
};
