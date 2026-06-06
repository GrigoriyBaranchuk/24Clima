/**
 * Datos de las zonas de cobertura de 24clima en Ciudad de Panamá.
 *
 * Cada zona tiene coordenadas reales para GeoCoordinates Schema,
 * descripción localizada (es/en/ru) y tiempo de respuesta.
 */

export interface ServiceArea {
  slug: string;
  name: string;
  geo: { latitude: number; longitude: number };
  responseTime: string;
  description: {
    es: string;
    en: string;
    ru: string;
  };
}

export const SERVICE_AREAS: ServiceArea[] = [
  {
    slug: "ciudad-de-panama",
    name: "Ciudad de Panamá (Centro)",
    geo: { latitude: 8.9824, longitude: -79.5199 },
    responseTime: "<2h",
    description: {
      es: "El corazón de la ciudad, con una mezcla de edificios residenciales y comerciales. Las torres de oficinas y condominios en Calle 50, Vía España y Avenida Balboa dependen del aire acondicionado todo el año. Ofrecemos servicio de limpieza, mantenimiento, reparación e instalación con llegada en menos de 2 horas.",
      en: "The heart of the city, with a mix of residential and commercial buildings. Office towers and condominiums along Calle 50, Vía España, and Avenida Balboa rely on air conditioning year-round. We offer cleaning, maintenance, repair, and installation with arrival in under 2 hours.",
      ru: "Центр города — смесь жилых и коммерческих зданий. Офисные башни и кондоминиумы на Calle 50, Vía España и Avenida Balboa зависят от кондиционирования круглый год. Обслуживаем с выездом менее чем за 2 часа.",
    },
  },
  {
    slug: "costa-del-este",
    name: "Costa del Este",
    geo: { latitude: 9.0167, longitude: -79.4500 },
    responseTime: "<1.5h",
    description: {
      es: "Zona residencial premium con torres de apartamentos modernos. Predominan sistemas de aire acondicionado tipo split y mini-split de alta gama (Samsung, Daikin, LG). Las limpiezas trimestrales son especialmente importantes aquí por la cercanía al mar y la alta salinidad del ambiente, que acelera la corrosión de los serpentines exteriores.",
      en: "Premium residential area with modern apartment towers. High-end split and mini-split AC systems (Samsung, Daikin, LG) predominate. Quarterly cleanings are especially important here due to proximity to the sea and high ambient salinity, which accelerates outdoor coil corrosion.",
      ru: "Премиальный жилой район с современными жилыми башнями. Преобладают сплит-системы высокого класса (Samsung, Daikin, LG). Квартальная чистка здесь особенно важна из-за близости к морю — солёный воздух ускоряет коррозию внешних блоков.",
    },
  },
  {
    slug: "punta-pacifica",
    name: "Punta Pacífica",
    geo: { latitude: 8.9833, longitude: -79.5167 },
    responseTime: "<1.5h",
    description: {
      es: "Distrito de lujo donde se ubican las torres más altas de Panamá, incluyendo The Point y JW Marriott. Los sistemas HVAC en estos edificios requieren técnicos con experiencia en equipos de alta capacidad y sistemas centralizados. Nuestro Maestro HVAC, formado en Alemania, está capacitado para trabajar con cualquier tipo de instalación.",
      en: "Luxury district home to Panama's tallest towers, including The Point and JW Marriott. HVAC systems in these buildings require technicians experienced with high-capacity equipment and centralized systems. Our Germany-trained HVAC Master is qualified to work with any installation type.",
      ru: "Элитный район с самыми высокими башнями Панамы (The Point, JW Marriott). HVAC-системы в этих зданиях требуют техников с опытом работы с высокомощным оборудованием. Наш мастер HVAC, обученный в Германии, квалифицирован для любых типов установок.",
    },
  },
  {
    slug: "san-francisco",
    name: "San Francisco",
    geo: { latitude: 9.0000, longitude: -79.4833 },
    responseTime: "<2h",
    description: {
      es: "Barrio mixto con residencias, restaurantes y pequeños comercios. Los splits residenciales de 9,000–18,000 BTU son los más comunes. Muchos propietarios nos eligen para paquetes de limpieza de múltiples unidades — ideal para apartamentos con 2–4 equipos, donde el precio por unidad baja significativamente.",
      en: "Mixed neighborhood with residences, restaurants, and small businesses. Residential 9,000–18,000 BTU splits are most common. Many owners choose our multi-unit cleaning packages — ideal for apartments with 2–4 units, where the per-unit price drops significantly.",
      ru: "Смешанный район: жильё, рестораны, малый бизнес. Самые распространённые — сплит-системы на 9 000–18 000 BTU. Многие клиенты выбирают пакеты чистки нескольких блоков — выгодно для квартир с 2–4 кондиционерами.",
    },
  },
  {
    slug: "clayton",
    name: "Clayton",
    geo: { latitude: 9.0333, longitude: -79.5667 },
    responseTime: "<2h",
    description: {
      es: "Antigua zona del Canal reconvertida en área residencial y de embajadas. Casas unifamiliares con jardín y equipos AC de mediana-alta capacidad (24,000–36,000 BTU). La vegetación abundante genera mayor acumulación de hojas y polen en los condensadores exteriores, por lo que recomendamos mantenimiento cada 3 meses.",
      en: "Former Canal Zone converted into a residential and embassy area. Single-family homes with gardens and medium-high capacity AC units (24,000–36,000 BTU). Abundant vegetation causes greater leaf and pollen accumulation in outdoor condensers, so we recommend maintenance every 3 months.",
      ru: "Бывшая зона Канала, преобразованная в жилой и посольский район. Частные дома с садами и кондиционерами средней-высокой мощности (24 000–36 000 BTU). Обильная растительность вызывает скопление листвы в наружных блоках — рекомендуем ТО каждые 3 месяца.",
    },
  },
  {
    slug: "albrook",
    name: "Albrook",
    geo: { latitude: 9.0167, longitude: -79.5500 },
    responseTime: "<2h",
    description: {
      es: "Zona cercana al Albrook Mall y la terminal de transporte. Mezcla de residencias y comercios con equipos split y tipo cassette en locales comerciales. Ofrecemos mantenimiento tanto para hogares como para negocios en esta zona, con planes trimestrales personalizados.",
      en: "Area near Albrook Mall and the bus terminal. Mix of residences and shops with split and cassette-type units in commercial spaces. We offer maintenance for both homes and businesses in this area, with customized quarterly plans.",
      ru: "Район у Albrook Mall и автовокзала. Смесь жилья и коммерции — сплиты в квартирах, кассеты в магазинах. Обслуживаем и дома, и бизнесы с индивидуальными квартальными планами.",
    },
  },
  {
    slug: "panama-pacifico",
    name: "Panamá Pacífico",
    geo: { latitude: 8.9333, longitude: -79.6000 },
    responseTime: "<2.5h",
    description: {
      es: "Comunidad planificada al oeste de la ciudad con casas modernas y apartamentos. Aunque un poco más lejos del centro, cubrimos esta zona con el mismo nivel de servicio. Instalaciones nuevas y mantenimientos preventivos son los servicios más solicitados aquí.",
      en: "Planned community west of the city with modern homes and apartments. Although slightly farther from downtown, we cover this area with the same service level. New installations and preventive maintenance are the most requested services here.",
      ru: "Планируемая общность к западу от города с современными домами и квартирами. Хотя район чуть дальше от центра, мы обслуживаем его на том же уровне. Самые востребованные услуги — установка и профилактика.",
    },
  },
  {
    slug: "el-cangrejo",
    name: "El Cangrejo",
    geo: { latitude: 8.9833, longitude: -79.5333 },
    responseTime: "<1.5h",
    description: {
      es: "Barrio cosmopolita y gastronómico con alta densidad de apartamentos y restaurantes. Los equipos AC en restaurantes y cafés requieren un régimen de mantenimiento intensivo por la grasa y humedad del ambiente. Asesoramos a negocios sobre la frecuencia óptima de limpieza.",
      en: "Cosmopolitan and gastronomic neighborhood with high density of apartments and restaurants. AC units in restaurants and cafés need intensive maintenance due to grease and moisture. We advise businesses on optimal cleaning frequency.",
      ru: "Космополитичный и гастрономический район с высокой плотностью квартир и ресторанов. Кондиционеры в ресторанах требуют усиленного обслуживания из-за жира и влажности. Консультируем бизнес по оптимальной частоте чистки.",
    },
  },
  {
    slug: "obarrio",
    name: "Obarrio",
    geo: { latitude: 8.9833, longitude: -79.5250 },
    responseTime: "<1.5h",
    description: {
      es: "Zona financiera y residencial adyacente a Punta Pacífica. Torres de oficinas y condominios de gama alta con sistemas split y centralizados. La proximidad al mar hace que la limpieza periódica de serpentines sea crucial para prevenir la corrosión prematura.",
      en: "Financial and residential zone adjacent to Punta Pacífica. High-end office towers and condominiums with split and centralized systems. Proximity to the sea makes periodic coil cleaning crucial to prevent premature corrosion.",
      ru: "Финансовый и жилой район, смежный с Пунта-Пасифика. Башни офисов и кондоминиумы со сплитами и централизованными системами. Близость к морю делает чистку теплообменников критически важной.",
    },
  },
  {
    slug: "bella-vista",
    name: "Bella Vista",
    geo: { latitude: 8.9750, longitude: -79.5333 },
    responseTime: "<2h",
    description: {
      es: "Uno de los barrios más poblados de la ciudad, con edificios residenciales de diversas décadas. Aquí encontramos desde equipos nuevos hasta aires acondicionados de más de 10 años que necesitan mantenimiento especializado. Nuestro técnico tiene experiencia con todas las marcas y generaciones de equipos.",
      en: "One of the city's most populated neighborhoods, with residential buildings from various decades. Here we find everything from new units to AC systems over 10 years old requiring specialized maintenance. Our technician has experience with all brands and generations of equipment.",
      ru: "Один из самых густонаселённых районов с жильём разных эпох. Здесь встречаются как новые системы, так и кондиционеры старше 10 лет, требующие специализированного обслуживания. Наш техник работает со всеми марками и поколениями оборудования.",
    },
  },
  // ── Panamá Oeste ──────────────────────────────────────────────
  // Cobertura al oeste de la ciudad con personal asignado a la zona.
  {
    slug: "arraijan",
    name: "Arraiján",
    geo: { latitude: 8.9514, longitude: -79.6589 },
    responseTime: "<2h",
    description: {
      es: "Ciudad cabecera de Panamá Oeste, en pleno crecimiento residencial y comercial. Predominan splits de 12 000–36 000 BTU en casas y nuevos PH. Contamos con personal asignado a la zona oeste, así que damos limpieza, mantenimiento, reparación e instalación con respuesta rápida — la distancia al centro ya no es un problema.",
      en: "The main town of Panamá Oeste, growing fast in both housing and commerce. 12,000–36,000 BTU splits dominate homes and new condos. We now have staff assigned to the western area, so we provide cleaning, maintenance, repair, and installation with fast response — distance from downtown is no longer an issue.",
      ru: "Главный город провинции Panamá Oeste, быстро растущий жилой и коммерческий район. Преобладают сплиты 12 000–36 000 BTU в домах и новых PH. У нас есть сотрудник, закреплённый за западной зоной, поэтому чистку, ТО, ремонт и установку делаем с быстрым выездом — удалённость от центра больше не проблема.",
    },
  },
  {
    slug: "nuevo-arraijan",
    name: "Nuevo Arraiján",
    geo: { latitude: 8.9356, longitude: -79.6447 },
    responseTime: "<2h",
    description: {
      es: "Sector en expansión dentro de Arraiján, con urbanizaciones y vivienda nueva. Los equipos recién instalados necesitan su primera limpieza y revisión a tiempo para conservar la garantía del fabricante. Cubrimos la zona con técnico asignado al oeste y planes de mantenimiento preventivo.",
      en: "An expanding sector within Arraiján, full of new developments and housing. Recently installed units need their first cleaning and check-up on time to keep the manufacturer's warranty. We cover the area with a western-zone technician and preventive maintenance plans.",
      ru: "Растущий сектор внутри Arraiján с новыми жилыми комплексами. Недавно установленным кондиционерам нужна первая чистка и проверка вовремя, чтобы сохранить гарантию производителя. Обслуживаем зону техником западного направления и планами профилактики.",
    },
  },
  {
    slug: "vista-alegre",
    name: "Vista Alegre",
    geo: { latitude: 8.9214, longitude: -79.6869 },
    responseTime: "<2h",
    description: {
      es: "Comunidad populosa de Arraiján sobre la carretera Panamericana, con mezcla de residencias y locales comerciales. Atendemos hogares y negocios con limpieza multi-unidad, mantenimiento trimestral y reparación. Servicio coordinado con nuestro personal del oeste.",
      en: "A populous Arraiján community along the Pan-American Highway, mixing homes and commercial spaces. We serve households and businesses with multi-unit cleaning, quarterly maintenance, and repair, coordinated through our western-area staff.",
      ru: "Многолюдный район Arraiján вдоль Панамериканского шоссе, смесь жилья и коммерции. Обслуживаем дома и бизнесы: чистка нескольких блоков, квартальное ТО, ремонт — через нашего сотрудника на западе.",
    },
  },
  {
    slug: "costa-verde",
    name: "Costa Verde",
    geo: { latitude: 8.9286, longitude: -79.6736 },
    responseTime: "<1.5h",
    description: {
      es: "Una de las urbanizaciones más solicitadas de Arraiján, con residentes que valoran un servicio confiable y puntual. Atención prioritaria: gracias a nuestro personal en la zona oeste llegamos rápido para limpieza, mantenimiento, reparación e instalación de aire acondicionado. Conocemos bien los equipos de esta comunidad.",
      en: "One of Arraiján's most sought-after developments, home to residents who value reliable, on-time service. Priority coverage: thanks to our western-zone staff we arrive quickly for AC cleaning, maintenance, repair, and installation. We know this community's equipment well.",
      ru: "Один из самых востребованных жилых комплексов Arraiján, где жители ценят надёжный и пунктуальный сервис. Приоритетное обслуживание: благодаря нашему сотруднику в западной зоне приезжаем быстро для чистки, ТО, ремонта и установки кондиционеров. Хорошо знаем оборудование этого комплекса.",
    },
  },
  {
    slug: "la-chorrera",
    name: "La Chorrera",
    geo: { latitude: 8.8794, longitude: -79.7831 },
    responseTime: "<2.5h",
    description: {
      es: "El centro urbano más grande de Panamá Oeste, con fuerte demanda de aire acondicionado por el calor constante. Zona residencial y comercial donde ofrecemos instalación, limpieza, reparación y carga de gas. Coordinamos la visita con cita previa para optimizar el tiempo de llegada.",
      en: "The largest urban center in Panamá Oeste, with strong AC demand due to constant heat. A residential and commercial area where we offer installation, cleaning, repair, and gas charging. We schedule visits by appointment to optimize arrival time.",
      ru: "Крупнейший городской центр провинции Panamá Oeste с высоким спросом на кондиционеры из-за постоянной жары. Жилой и коммерческий район, где мы делаем установку, чистку, ремонт и заправку фреоном. Визит согласуем заранее, чтобы оптимизировать время приезда.",
    },
  },
  {
    slug: "el-espino",
    name: "El Espino",
    geo: { latitude: 8.8939, longitude: -79.7458 },
    responseTime: "<2.5h",
    description: {
      es: "Sector residencial de La Chorrera con urbanizaciones y casas unifamiliares. Los splits de mediana capacidad acumulan polvo con rapidez por el clima seco y caluroso, por lo que recomendamos mantenimiento regular. Servicio coordinado con cita previa.",
      en: "A residential sector of La Chorrera with developments and single-family homes. Mid-capacity splits accumulate dust quickly in the hot, dry climate, so we recommend regular maintenance. Service scheduled by appointment.",
      ru: "Жилой сектор La Chorrera с жилыми комплексами и частными домами. Сплиты средней мощности быстро накапливают пыль из-за жаркого сухого климата, поэтому рекомендуем регулярное ТО. Обслуживание по предварительной записи.",
    },
  },
  {
    slug: "la-floresta",
    name: "La Floresta",
    geo: { latitude: 8.9047, longitude: -79.7186 },
    responseTime: "<2.5h",
    description: {
      es: "Área residencial tranquila en Panamá Oeste, con viviendas y pequeños negocios. Ofrecemos limpieza multi-unidad y mantenimiento preventivo a precios competitivos para los hogares de la zona, con visita coordinada por WhatsApp.",
      en: "A quiet residential area in Panamá Oeste, with homes and small businesses. We offer multi-unit cleaning and preventive maintenance at competitive prices for local households, with visits coordinated via WhatsApp.",
      ru: "Спокойный жилой район в Panamá Oeste с домами и небольшими бизнесами. Предлагаем чистку нескольких блоков и профилактику по конкурентным ценам для местных жителей, визит согласуем через WhatsApp.",
    },
  },
  {
    slug: "vacamonte",
    name: "Vacamonte",
    geo: { latitude: 8.8703, longitude: -79.7022 },
    responseTime: "<2.5h",
    description: {
      es: "Zona costera al oeste, cercana al puerto pesquero. La alta salinidad del aire acelera la corrosión de los condensadores exteriores, por lo que la limpieza periódica de serpentines es clave para alargar la vida del equipo. Atendemos residencias y comercios de la zona.",
      en: "A coastal area in the west, near the fishing port. High airborne salinity accelerates outdoor condenser corrosion, so periodic coil cleaning is key to extending equipment life. We serve homes and businesses in the area.",
      ru: "Прибрежная зона на западе, рядом с рыболовным портом. Высокая солёность воздуха ускоряет коррозию наружных блоков, поэтому регулярная чистка теплообменников критична для продления срока службы. Обслуживаем жильё и бизнесы района.",
    },
  },
  {
    slug: "playa-dorada-residences",
    name: "Playa Dorada Residences",
    geo: { latitude: 8.8772, longitude: -79.7106 },
    responseTime: "<1.5h",
    description: {
      es: "Residencial premium en la costa de Panamá Oeste, donde atendemos a una clientela exigente. Atención prioritaria con llegada rápida gracias a nuestro personal en la zona. La cercanía al mar hace imprescindible la limpieza trimestral de serpentines en los equipos split y mini-split de alta gama.",
      en: "A premium residential complex on the Panamá Oeste coast, where we serve a discerning clientele. Priority coverage with fast arrival thanks to our local staff. Proximity to the sea makes quarterly coil cleaning essential for the high-end split and mini-split units here.",
      ru: "Премиальный жилой комплекс на побережье Panamá Oeste, где мы обслуживаем взыскательных клиентов. Приоритетное обслуживание с быстрым выездом благодаря сотруднику в зоне. Близость к морю делает квартальную чистку теплообменников обязательной для сплит- и мини-сплит-систем высокого класса.",
    },
  },
];
