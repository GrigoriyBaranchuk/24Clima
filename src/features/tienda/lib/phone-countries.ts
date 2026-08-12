export type PhoneCountry = {
  iso: string;
  name: string;
  dial: string;
  placeholder: string;
  digits: [number, number];
};

/**
 * Названия стран намеренно статические по-испански для всех локалей:
 * основной язык магазина — испанский, названия читаемы на всех трёх.
 */
export const PHONE_COUNTRIES: PhoneCountry[] = [
  {
    iso: "PA",
    name: "Panamá",
    dial: "+507",
    placeholder: "6000-0000",
    digits: [8, 8],
  },
  {
    iso: "CO",
    name: "Colombia",
    dial: "+57",
    placeholder: "300 0000000",
    digits: [10, 10],
  },
  {
    iso: "VE",
    name: "Venezuela",
    dial: "+58",
    placeholder: "412 0000000",
    digits: [10, 10],
  },
  {
    iso: "CR",
    name: "Costa Rica",
    dial: "+506",
    placeholder: "8000-0000",
    digits: [8, 8],
  },
  {
    iso: "US",
    name: "EE. UU. y Canadá",
    dial: "+1",
    placeholder: "(305) 000-0000",
    digits: [10, 10],
  },
  {
    iso: "MX",
    name: "México",
    dial: "+52",
    placeholder: "55 0000 0000",
    digits: [10, 10],
  },
  {
    iso: "ES",
    name: "España",
    dial: "+34",
    placeholder: "600 000 000",
    digits: [9, 9],
  },
  {
    iso: "BR",
    name: "Brasil",
    dial: "+55",
    placeholder: "11 00000-0000",
    digits: [10, 11],
  },
  {
    iso: "AR",
    name: "Argentina",
    dial: "+54",
    placeholder: "11 0000-0000",
    digits: [10, 11],
  },
  {
    iso: "PE",
    name: "Perú",
    dial: "+51",
    placeholder: "900 000 000",
    digits: [9, 9],
  },
  {
    iso: "EC",
    name: "Ecuador",
    dial: "+593",
    placeholder: "99 000 0000",
    digits: [9, 9],
  },
  {
    iso: "CL",
    name: "Chile",
    dial: "+56",
    placeholder: "9 0000 0000",
    digits: [9, 9],
  },
  {
    iso: "RU",
    name: "Rusia",
    dial: "+7",
    placeholder: "900 000-00-00",
    digits: [10, 10],
  },
  {
    iso: "CN",
    name: "China",
    dial: "+86",
    placeholder: "130 0000 0000",
    digits: [11, 11],
  },
];

export const DEFAULT_PHONE_COUNTRY = "PA";
