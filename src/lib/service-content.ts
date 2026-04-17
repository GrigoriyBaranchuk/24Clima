/**
 * Расширенный контент для страниц услуг (800–1200 слов на странице).
 *
 * Каждая услуга содержит:
 *  - intro: вводный параграф (100–150 слов) — зачем услуга нужна в тропическом климате Панамы
 *  - whyUs: секция «¿Por qué elegir 24clima?» (200–300 слов) — buyer benefits с конкретикой
 *  - howItWorks: секция «¿Cómo funciona?» (200–300 слов) — пошаговый процесс
 *
 * Правила:
 *  - Конкретные цифры в каждом параграфе (цены, гарантии, статистика)
 *  - Технические термины с пояснениями
 *  - Без keyword stuffing, без «fluff»
 *  - Уникальные формулировки на каждой странице
 *
 * Клавиши: ServiceSlug (испанские URL-идентификаторы).
 */

import type { ServiceSlug } from "@/lib/services";

export interface ServiceContent {
  intro: { es: string; en: string; ru: string };
  whyUsTitle: { es: string; en: string; ru: string };
  whyUsPoints: { es: string; en: string; ru: string }[];
  howTitle: { es: string; en: string; ru: string };
  howSteps: {
    title: { es: string; en: string; ru: string };
    text: { es: string; en: string; ru: string };
  }[];
}

export const SERVICE_CONTENT: Record<ServiceSlug, ServiceContent> = {
  limpieza: {
    intro: {
      es: "En el clima tropical de Panamá, con temperaturas que superan los 32 °C y humedad relativa del 80–90%, los filtros y serpentines de su aire acondicionado acumulan polvo, moho y bacterias mucho más rápido que en climas templados. Según la EPA (Energy Star), un filtro sucio puede aumentar el consumo eléctrico entre un 5% y un 15%. La limpieza profesional profunda no solo restaura la eficiencia original del equipo, sino que mejora la calidad del aire interior — un factor crítico para la salud, especialmente en hogares con niños o personas alérgicas. En 24clima realizamos limpiezas profundas de splits, cassettes y ductos con técnicas que van más allá de un simple lavado de filtros.",
      en: "In Panama's tropical climate, with temperatures above 32 °C and 80–90% relative humidity, your AC filters and coils accumulate dust, mold, and bacteria much faster than in temperate climates. According to the EPA (Energy Star), a dirty filter can increase electricity consumption by 5–15%. Professional deep cleaning restores your unit's original efficiency and improves indoor air quality — critical for health, especially in homes with children or allergy sufferers. At 24clima we perform deep cleaning of splits, cassettes, and ducts using techniques that go far beyond a simple filter wash.",
      ru: "В тропическом климате Панамы, при температуре выше 32 °C и влажности 80–90%, фильтры и теплообменники кондиционера накапливают пыль, плесень и бактерии значительно быстрее, чем в умеренном климате. По данным EPA (Energy Star), грязный фильтр увеличивает потребление электроэнергии на 5–15%. Профессиональная глубокая чистка восстанавливает исходную эффективность оборудования и улучшает качество воздуха в помещении. В 24clima мы выполняем глубокую чистку сплит-систем, кассетных блоков и воздуховодов.",
    },
    whyUsTitle: {
      es: "¿Por qué elegir 24clima para la limpieza de su AC?",
      en: "Why choose 24clima for your AC cleaning?",
      ru: "Почему стоит выбрать 24clima для чистки кондиционера?",
    },
    whyUsPoints: [
      {
        es: "Maestro HVAC con 9+ años de experiencia (Ryhor Baranchuk), formado en Alemania. No enviamos aprendices — el técnico principal realiza cada servicio personalmente.",
        en: "HVAC Master with 9+ years of experience (Ryhor Baranchuk), trained in Germany. We don't send apprentices — the lead technician performs each service personally.",
        ru: "Мастер HVAC с 9+ годами опыта (Ryhor Baranchuk), обучение в Германии. Мы не присылаем стажёров — главный техник выполняет каждый сервис лично.",
      },
      {
        es: "Precios transparentes desde $29.99 (paquete de 2+ splits). Sin costos ocultos: usted conoce el precio total antes de comenzar.",
        en: "Transparent pricing from $29.99 (2+ splits package). No hidden costs: you know the total price before we start.",
        ru: "Прозрачные цены от $29.99 (пакет 2+ сплита). Без скрытых расходов: вы знаете итоговую сумму до начала работ.",
      },
      {
        es: "Garantía de 60 días sobre cada limpieza. Si algo no funciona correctamente después del servicio, volvemos sin costo adicional.",
        en: "60-day warranty on every cleaning. If anything doesn't work properly after service, we return at no extra cost.",
        ru: "Гарантия 60 дней на каждую чистку. Если что-то работает некорректно после сервиса — приедем повторно бесплатно.",
      },
      {
        es: "★5.0 en Google Maps con 11 reseñas verificadas. Más de 300 clientes satisfechos en Ciudad de Panamá, Costa del Este, Punta Pacífica y zonas aledañas.",
        en: "★5.0 on Google Maps with 11 verified reviews. Over 300 satisfied clients in Panama City, Costa del Este, Punta Pacífica, and surrounding areas.",
        ru: "★5.0 на Google Maps с 11 подтверждёнными отзывами. Более 300 довольных клиентов в Панама-Сити и окрестностях.",
      },
    ],
    howTitle: {
      es: "¿Cómo funciona la limpieza profesional?",
      en: "How does professional cleaning work?",
      ru: "Как проходит профессиональная чистка?",
    },
    howSteps: [
      {
        title: { es: "Diagnóstico inicial", en: "Initial diagnosis", ru: "Первичная диагностика" },
        text: {
          es: "Evaluamos el estado del equipo: nivel de suciedad en filtros y evaporador, estado del drenaje, presión de gas y funcionamiento eléctrico. Sin compromiso.",
          en: "We assess the unit's condition: filter and evaporator dirt level, drain status, gas pressure, and electrical operation. No obligation.",
          ru: "Оцениваем состояние: загрязнённость фильтров и испарителя, дренаж, давление газа, электрику. Без обязательств.",
        },
      },
      {
        title: { es: "Protección del área", en: "Area protection", ru: "Защита рабочей зоны" },
        text: {
          es: "Cubrimos paredes y muebles con plástico protector. Instalamos una bolsa de lavado especializada para contener el agua y la suciedad durante el proceso.",
          en: "We cover walls and furniture with protective plastic. We install a specialized washing bag to contain water and dirt during the process.",
          ru: "Закрываем стены и мебель защитной плёнкой. Устанавливаем специальный мешок для сбора воды и грязи.",
        },
      },
      {
        title: { es: "Limpieza profunda", en: "Deep cleaning", ru: "Глубокая чистка" },
        text: {
          es: "Desmontamos filtros, turbina y carcasa. Limpiamos el evaporador con espuma antibacterial y agua a presión. Limpiamos el drenaje y desinfectamos el sistema completo. Duración: 1–2 horas por unidad.",
          en: "We disassemble filters, turbine, and casing. We clean the evaporator with antibacterial foam and pressure water. We clean the drain and disinfect the entire system. Duration: 1–2 hours per unit.",
          ru: "Разбираем фильтры, турбину и корпус. Чистим испаритель антибактериальной пеной и водой под давлением. Прочищаем дренаж и дезинфицируем систему. Время: 1–2 часа на блок.",
        },
      },
      {
        title: { es: "Verificación y entrega", en: "Verification and delivery", ru: "Проверка и сдача" },
        text: {
          es: "Reensamblamos el equipo, verificamos la temperatura de salida (debe bajar 8–12 °C vs temperatura ambiente) y le mostramos el resultado. Garantía de 60 días.",
          en: "We reassemble the unit, verify the outlet temperature (should drop 8–12 °C vs ambient) and show you the result. 60-day warranty.",
          ru: "Собираем блок, проверяем температуру на выходе (должна быть на 8–12 °C ниже комнатной) и показываем результат. Гарантия 60 дней.",
        },
      },
    ],
  },

  mantenimiento: {
    intro: {
      es: "El mantenimiento preventivo es la forma más eficiente de proteger su inversión en aire acondicionado. En Panamá, donde los equipos trabajan prácticamente sin pausa durante todo el año, ASHRAE recomienda inspecciones al menos cada 3 meses. Sin mantenimiento regular, un AC pierde hasta un 5% de eficiencia cada año (DOE), lo que se traduce en facturas de electricidad más altas y una vida útil hasta un 50% más corta. Un programa de mantenimiento profesional con 24clima le ayuda a prevenir averías costosas, mantener la calidad del aire y ahorrar entre un 20% y un 25% en consumo energético.",
      en: "Preventive maintenance is the most efficient way to protect your AC investment. In Panama, where units run virtually non-stop year-round, ASHRAE recommends inspections at least every 3 months. Without regular maintenance, an AC loses up to 5% efficiency per year (DOE), resulting in higher electricity bills and up to 50% shorter lifespan. A professional maintenance program with 24clima helps you prevent costly breakdowns, maintain air quality, and save 20–25% on energy consumption.",
      ru: "Профилактическое обслуживание — самый эффективный способ защитить инвестицию в кондиционирование. В Панаме, где оборудование работает круглый год, ASHRAE рекомендует осмотры каждые 3 месяца. Без регулярного ТО кондиционер теряет до 5% эффективности ежегодно (DOE), что означает рост счетов за электроэнергию и сокращение срока службы до 50%. Программа обслуживания с 24clima предотвращает дорогостоящие поломки и экономит 20–25% электроэнергии.",
    },
    whyUsTitle: {
      es: "¿Por qué elegir 24clima para el mantenimiento?",
      en: "Why choose 24clima for maintenance?",
      ru: "Почему стоит выбрать 24clima для обслуживания?",
    },
    whyUsPoints: [
      {
        es: "Programa anual de 4 visitas — cada trimestre nuestro Maestro HVAC (Ryhor Baranchuk, 9+ años) inspecciona y optimiza su equipo para mantener la máxima eficiencia.",
        en: "Annual program of 4 visits — every quarter our HVAC Master (Ryhor Baranchuk, 9+ years) inspects and optimizes your equipment for peak efficiency.",
        ru: "Годовая программа из 4 визитов — каждый квартал мастер HVAC (Ryhor Baranchuk, 9+ лет) проводит осмотр и оптимизацию оборудования.",
      },
      {
        es: "Desde $50 por visita con garantía de 60 días. Incluye limpieza de filtros, revisión de gas, inspección eléctrica y lubricación de componentes.",
        en: "From $50 per visit with 60-day warranty. Includes filter cleaning, gas check, electrical inspection, and component lubrication.",
        ru: "От $50 за визит с гарантией 60 дней. Включает чистку фильтров, проверку газа, электрики и смазку компонентов.",
      },
      {
        es: "Reducción comprobada del consumo eléctrico en un 5–15% (DOE) — el mantenimiento se paga solo con el ahorro en la factura de luz.",
        en: "Proven 5–15% electricity consumption reduction (DOE) — maintenance pays for itself through lower electricity bills.",
        ru: "Доказанное снижение электропотребления на 5–15% (DOE) — обслуживание окупается за счёт экономии на электричестве.",
      },
      {
        es: "Disponibilidad 24/7 por WhatsApp. Respuesta en menos de 2 horas en zona metropolitana de Ciudad de Panamá.",
        en: "24/7 availability via WhatsApp. Response in under 2 hours in Panama City metropolitan area.",
        ru: "Доступность 24/7 через WhatsApp. Выезд менее чем за 2 часа в черте Панама-Сити.",
      },
    ],
    howTitle: {
      es: "¿Cómo funciona el mantenimiento preventivo?",
      en: "How does preventive maintenance work?",
      ru: "Как проходит профилактическое обслуживание?",
    },
    howSteps: [
      {
        title: { es: "Inspección completa", en: "Full inspection", ru: "Полный осмотр" },
        text: {
          es: "Revisamos el estado de filtros, serpentines del evaporador y condensador, nivel de refrigerante, drenaje, conexiones eléctricas y estado del compresor.",
          en: "We check filter condition, evaporator and condenser coils, refrigerant level, drainage, electrical connections, and compressor status.",
          ru: "Проверяем фильтры, испаритель, конденсатор, уровень хладагента, дренаж, электрические соединения и компрессор.",
        },
      },
      {
        title: { es: "Limpieza y ajuste", en: "Cleaning and adjustment", ru: "Чистка и регулировка" },
        text: {
          es: "Lavamos filtros, limpiamos serpentines con producto especializado, verificamos y ajustamos la presión de gas si es necesario, y lubricamos partes móviles.",
          en: "We wash filters, clean coils with specialized product, verify and adjust gas pressure if needed, and lubricate moving parts.",
          ru: "Промываем фильтры, чистим теплообменники спецсредством, проверяем и корректируем давление газа, смазываем подвижные части.",
        },
      },
      {
        title: { es: "Prueba de rendimiento", en: "Performance test", ru: "Тест производительности" },
        text: {
          es: "Medimos diferencial de temperatura (entrada vs salida), consumo eléctrico y comparamos con los valores de referencia del fabricante.",
          en: "We measure temperature differential (inlet vs outlet), power consumption, and compare with manufacturer reference values.",
          ru: "Замеряем разницу температур (вход/выход), электропотребление и сравниваем с референсными значениями производителя.",
        },
      },
      {
        title: { es: "Informe y recomendaciones", en: "Report and recommendations", ru: "Отчёт и рекомендации" },
        text: {
          es: "Entregamos un informe con el estado del equipo, trabajos realizados y recomendaciones para la próxima visita. Garantía de 60 días sobre el servicio.",
          en: "We provide a report with equipment status, work performed, and recommendations for the next visit. 60-day warranty on service.",
          ru: "Предоставляем отчёт о состоянии, выполненных работах и рекомендации к следующему визиту. Гарантия 60 дней.",
        },
      },
    ],
  },

  reparacion: {
    intro: {
      es: "Cuando su aire acondicionado deja de enfriar, hace ruidos extraños, gotea o simplemente no enciende, cada hora sin reparación es una hora de incomodidad — y en el calor de Panamá, puede convertirse rápidamente en un problema de salud (CDC). En 24clima entendemos la urgencia: nuestro técnico está disponible 24/7 y llega en menos de 2 horas a cualquier punto de Ciudad de Panamá. Diagnosticamos y reparamos todo tipo de fallas en splits, mini-splits, cassettes y sistemas centrales, utilizando herramientas profesionales y repuestos de calidad.",
      en: "When your air conditioner stops cooling, makes strange noises, leaks, or simply won't turn on, every hour without repair means discomfort — and in Panama's heat, it can quickly become a health concern (CDC). At 24clima we understand the urgency: our technician is available 24/7 and arrives in under 2 hours anywhere in Panama City. We diagnose and repair all types of faults in splits, mini-splits, cassettes, and central systems.",
      ru: "Когда кондиционер перестаёт холодить, издаёт странные звуки, течёт или не включается — каждый час без ремонта означает дискомфорт, а в жаре Панамы это может стать проблемой для здоровья (CDC). В 24clima мы понимаем срочность: техник доступен 24/7 и приезжает менее чем за 2 часа в любую точку Панама-Сити.",
    },
    whyUsTitle: {
      es: "¿Por qué elegir 24clima para la reparación?",
      en: "Why choose 24clima for repair?",
      ru: "Почему стоит выбрать 24clima для ремонта?",
    },
    whyUsPoints: [
      {
        es: "Respuesta en menos de 2 horas, 24/7/365. Cobertura en 10+ zonas: Ciudad de Panamá, Costa del Este, Punta Pacífica, Clayton, Albrook, San Francisco y más.",
        en: "Response in under 2 hours, 24/7/365. Coverage in 10+ zones: Panama City, Costa del Este, Punta Pacífica, Clayton, Albrook, San Francisco, and more.",
        ru: "Выезд менее чем за 2 часа, 24/7/365. Покрытие 10+ зон: Панама-Сити, Коста-дель-Эсте, Пунта-Пасифика и другие.",
      },
      {
        es: "Reparación desde $35 con diagnóstico incluido. Sin sorpresas: le informamos el costo exacto antes de iniciar cualquier trabajo.",
        en: "Repair from $35 with diagnosis included. No surprises: we inform you of the exact cost before starting any work.",
        ru: "Ремонт от $35 с бесплатной диагностикой. Без сюрпризов: сообщаем точную стоимость до начала работ.",
      },
      {
        es: "Garantía de 90 días sobre todas las reparaciones. Si la misma falla reaparece, la reparamos sin costo adicional.",
        en: "90-day warranty on all repairs. If the same fault reappears, we fix it at no extra cost.",
        ru: "Гарантия 90 дней на все ремонты. Если та же неисправность повторится — устраним бесплатно.",
      },
      {
        es: "Técnico con certificación para manejo de refrigerantes (EPA Sección 608). Experiencia en todas las marcas: Samsung, LG, Daikin, Carrier, Midea, Gree.",
        en: "Technician with refrigerant handling certification (EPA Section 608). Experience with all brands: Samsung, LG, Daikin, Carrier, Midea, Gree.",
        ru: "Техник с сертификацией для работы с хладагентами (EPA Section 608). Опыт со всеми брендами: Samsung, LG, Daikin, Carrier, Midea, Gree.",
      },
    ],
    howTitle: {
      es: "¿Cómo funciona la reparación?",
      en: "How does the repair process work?",
      ru: "Как проходит ремонт?",
    },
    howSteps: [
      {
        title: { es: "Contacto por WhatsApp", en: "WhatsApp contact", ru: "Обращение через WhatsApp" },
        text: {
          es: "Escríbanos describiendo el problema. Si es posible, envíe fotos o un video del equipo. Respondemos en minutos.",
          en: "Write to us describing the problem. If possible, send photos or a video of the unit. We respond within minutes.",
          ru: "Напишите нам, опишите проблему. По возможности отправьте фото или видео блока. Ответим за считанные минуты.",
        },
      },
      {
        title: { es: "Diagnóstico en sitio", en: "On-site diagnosis", ru: "Диагностика на месте" },
        text: {
          es: "Nuestro técnico llega en <2 horas, inspecciona el equipo con instrumentación profesional y le presenta un diagnóstico claro con el costo de la reparación.",
          en: "Our technician arrives in <2 hours, inspects the unit with professional instruments, and presents a clear diagnosis with repair cost.",
          ru: "Техник приезжает за <2ч, осматривает оборудование профессиональными приборами и представляет чёткий диагноз с ценой ремонта.",
        },
      },
      {
        title: { es: "Reparación inmediata", en: "Immediate repair", ru: "Ремонт на месте" },
        text: {
          es: "La mayoría de fallas se reparan en la primera visita: fugas de gas, problemas eléctricos, fallas de compresor, placas electrónicas, motores de ventilador y sensores de temperatura.",
          en: "Most faults are repaired on the first visit: gas leaks, electrical issues, compressor failures, electronic boards, fan motors, and temperature sensors.",
          ru: "Большинство неисправностей устраняются в первый визит: утечки газа, электрические проблемы, компрессор, платы, вентиляторы, датчики.",
        },
      },
      {
        title: { es: "Garantía post-servicio", en: "Post-service warranty", ru: "Послесервисная гарантия" },
        text: {
          es: "Recibe garantía de 90 días sobre la reparación realizada. Soporte por WhatsApp incluido para cualquier consulta posterior.",
          en: "You receive a 90-day warranty on the repair performed. WhatsApp support included for any follow-up questions.",
          ru: "Получаете гарантию 90 дней на выполненный ремонт. Поддержка через WhatsApp включена для любых вопросов.",
        },
      },
    ],
  },

  instalacion: {
    intro: {
      es: "La instalación correcta de un aire acondicionado es tan importante como la calidad del equipo mismo. Según ENERGY STAR, un AC mal dimensionado o instalado incorrectamente puede consumir entre un 25% y un 40% más de energía. En 24clima, nuestro Maestro HVAC formado en Alemania se asegura de que cada instalación cumpla con las especificaciones del fabricante, desde el cálculo de BTU hasta la correcta ubicación de las unidades interior y exterior, el tendido de tuberías de cobre y la carga precisa de refrigerante.",
      en: "Proper AC installation is as important as the unit's quality itself. According to ENERGY STAR, a poorly sized or incorrectly installed AC can consume 25–40% more energy. At 24clima, our Germany-trained HVAC Master ensures every installation meets manufacturer specifications, from BTU calculation to proper indoor/outdoor unit placement, copper piping, and precise refrigerant charge.",
      ru: "Правильная установка кондиционера так же важна, как и качество самого оборудования. По данным ENERGY STAR, неправильно подобранный или установленный кондиционер потребляет на 25–40% больше энергии. В 24clima мастер HVAC, обученный в Германии, обеспечивает установку по спецификациям производителя: расчёт BTU, размещение блоков, медные трубопроводы и точная заправка хладагента.",
    },
    whyUsTitle: {
      es: "¿Por qué elegir 24clima para la instalación?",
      en: "Why choose 24clima for installation?",
      ru: "Почему стоит выбрать 24clima для установки?",
    },
    whyUsPoints: [
      {
        es: "Instalación back-to-back desde $200, incluyendo materiales estándar. Cotización personalizada sin compromiso para instalaciones con canalización.",
        en: "Back-to-back installation from $200, including standard materials. Custom no-obligation quote for ducted installations.",
        ru: "Установка back-to-back от $200, включая стандартные материалы. Персональный расчёт без обязательств для канальных установок.",
      },
      {
        es: "Maestro HVAC con formación en Alemania y 9+ años de experiencia. Especialista en splits, multi-splits, cassettes y sistemas centrales.",
        en: "Germany-trained HVAC Master with 9+ years of experience. Specialist in splits, multi-splits, cassettes, and central systems.",
        ru: "Мастер HVAC с обучением в Германии и 9+ годами опыта. Специализация: сплиты, мульти-сплиты, кассеты и центральные системы.",
      },
      {
        es: "Garantía de 90 días sobre la mano de obra e instalación. Verificación de temperatura, presión y consumo eléctrico al finalizar.",
        en: "90-day warranty on labor and installation. Temperature, pressure, and power consumption verification upon completion.",
        ru: "Гарантия 90 дней на работу и монтаж. Проверка температуры, давления и электропотребления по завершении.",
      },
      {
        es: "Asesoramiento gratuito sobre el equipo adecuado para su espacio. Calculamos BTU según área, orientación solar, aislamiento y número de ocupantes.",
        en: "Free consultation on the right unit for your space. We calculate BTU based on area, sun exposure, insulation, and occupancy.",
        ru: "Бесплатная консультация по подбору оборудования. Расчёт BTU по площади, ориентации, утеплению и числу жильцов.",
      },
    ],
    howTitle: {
      es: "¿Cómo funciona la instalación?",
      en: "How does the installation process work?",
      ru: "Как проходит установка?",
    },
    howSteps: [
      {
        title: { es: "Evaluación y cotización", en: "Assessment and quote", ru: "Оценка и расчёт" },
        text: {
          es: "Visitamos su espacio (o analizamos fotos/planos), calculamos la capacidad necesaria y entregamos una cotización detallada sin compromiso.",
          en: "We visit your space (or analyze photos/plans), calculate the needed capacity, and deliver a detailed no-obligation quote.",
          ru: "Осматриваем помещение (или анализируем фото/план), рассчитываем необходимую мощность и предоставляем подробный расчёт.",
        },
      },
      {
        title: { es: "Preparación e instalación", en: "Preparation and installation", ru: "Подготовка и монтаж" },
        text: {
          es: "Montaje de soportes, perforación, tendido de tuberías de cobre, cableado eléctrico, instalación de unidades interior y exterior. Duración típica: 3–6 horas para un split estándar.",
          en: "Bracket mounting, drilling, copper piping, electrical wiring, indoor and outdoor unit installation. Typical duration: 3–6 hours for a standard split.",
          ru: "Крепление кронштейнов, сверление, прокладка медных труб, электропроводка, установка внутреннего и внешнего блоков. Время: 3–6 часов для стандартного сплита.",
        },
      },
      {
        title: { es: "Vacío y carga de gas", en: "Vacuum and gas charge", ru: "Вакуумирование и заправка" },
        text: {
          es: "Realizamos vacío del sistema con bomba profesional para eliminar humedad y aire. Cargamos refrigerante (R-410A o el requerido) por peso según especificaciones del fabricante.",
          en: "We vacuum the system with a professional pump to remove moisture and air. We charge refrigerant (R-410A or as required) by weight per manufacturer specs.",
          ru: "Выполняем вакуумирование системы профессиональным насосом. Заправляем хладагент (R-410A или по спецификации) по весу согласно рекомендациям производителя.",
        },
      },
      {
        title: { es: "Puesta en marcha y verificación", en: "Startup and verification", ru: "Запуск и проверка" },
        text: {
          es: "Encendemos el equipo, verificamos temperatura de salida, consumo eléctrico y ausencia de vibraciones. Le enseñamos el uso del control remoto y entregamos garantía de 90 días.",
          en: "We start the unit, verify outlet temperature, power consumption, and vibration-free operation. We teach you remote control usage and deliver the 90-day warranty.",
          ru: "Запускаем оборудование, проверяем температуру выхода, электропотребление и отсутствие вибраций. Объясняем работу с пультом и выдаём гарантию 90 дней.",
        },
      },
    ],
  },

  "carga-de-gas": {
    intro: {
      es: "La recarga de gas refrigerante es un servicio técnico que requiere conocimiento especializado y certificación (EPA Sección 608). Un nivel incorrecto de refrigerante no solo reduce la capacidad de enfriamiento, sino que puede dañar permanentemente el compresor — la pieza más costosa del sistema (desde $300 solo en repuesto). En 24clima realizamos la recarga por peso con manómetros de precisión, después de verificar y reparar cualquier fuga existente. Utilizamos refrigerante R-410A ecológico y cumplimos con las normativas ambientales internacionales.",
      en: "Refrigerant recharge is a technical service requiring specialized knowledge and certification (EPA Section 608). An incorrect refrigerant level not only reduces cooling capacity but can permanently damage the compressor — the most expensive part (from $300 for the part alone). At 24clima we recharge by weight with precision gauges, after verifying and repairing any existing leaks. We use eco-friendly R-410A refrigerant.",
      ru: "Заправка хладагента — техническая услуга, требующая специальных знаний и сертификации (EPA Section 608). Неправильный уровень хладагента снижает охлаждение и может безвозвратно повредить компрессор — самую дорогую деталь (от $300). В 24clima мы заправляем по весу с манометрами высокой точности, после проверки и устранения утечек. Используем экологичный R-410A.",
    },
    whyUsTitle: {
      es: "¿Por qué elegir 24clima para la recarga de gas?",
      en: "Why choose 24clima for gas recharge?",
      ru: "Почему стоит выбрать 24clima для заправки?",
    },
    whyUsPoints: [
      {
        es: "Técnico con certificación para manejo de refrigerantes. Cumplimos regulaciones ambientales de la EPA (Sección 608) para el manejo seguro de gases.",
        en: "Technician with refrigerant handling certification. We comply with EPA (Section 608) environmental regulations for safe gas handling.",
        ru: "Техник с сертификацией на работу с хладагентами. Соблюдаем требования EPA (Section 608) по безопасному обращению с газами.",
      },
      {
        es: "Recarga completa desde $120 con detección de fuga incluida. No recargamos sin primero encontrar y reparar la causa de la pérdida de gas.",
        en: "Full recharge from $120 with leak detection included. We don't recharge without first finding and repairing the cause of gas loss.",
        ru: "Полная заправка от $120 с поиском утечки. Не заправляем без предварительного обнаружения и устранения причины потери газа.",
      },
      {
        es: "Refrigerante R-410A ecológico, cargado por peso exacto según especificaciones del fabricante del equipo.",
        en: "Eco-friendly R-410A refrigerant, charged by exact weight per equipment manufacturer specifications.",
        ru: "Экологичный хладагент R-410A, заправка по точному весу согласно спецификациям производителя.",
      },
      {
        es: "Garantía de 60 días. Si el nivel de gas baja dentro del período de garantía, volvemos a inspeccionar y reparar sin costo.",
        en: "60-day warranty. If gas level drops within the warranty period, we reinspect and repair at no cost.",
        ru: "Гарантия 60 дней. Если уровень газа снизится в период гарантии — приедем и устраним бесплатно.",
      },
    ],
    howTitle: {
      es: "¿Cómo funciona la recarga de gas?",
      en: "How does gas recharge work?",
      ru: "Как проходит заправка?",
    },
    howSteps: [
      {
        title: { es: "Detección de fugas", en: "Leak detection", ru: "Поиск утечек" },
        text: {
          es: "Inspeccionamos todo el circuito de refrigerante con detector electrónico y/o espuma para localizar el punto exacto de la fuga.",
          en: "We inspect the entire refrigerant circuit with an electronic detector and/or foam to locate the exact leak point.",
          ru: "Проверяем весь контур хладагента электронным детектором и/или пеной для точной локализации утечки.",
        },
      },
      {
        title: { es: "Reparación de fuga", en: "Leak repair", ru: "Устранение утечки" },
        text: {
          es: "Soldamos o reemplazamos la sección dañada de la tubería de cobre. Sin reparar la fuga, recargar es tirar dinero.",
          en: "We solder or replace the damaged copper pipe section. Without fixing the leak, recharging is throwing money away.",
          ru: "Пропаиваем или заменяем повреждённый участок медной трубы. Без ремонта утечки заправка — выброшенные деньги.",
        },
      },
      {
        title: { es: "Vacío y recarga", en: "Vacuum and recharge", ru: "Вакуумирование и заправка" },
        text: {
          es: "Realizamos vacío del sistema, luego cargamos R-410A (u otro refrigerante según equipo) por peso con balanza de precisión.",
          en: "We vacuum the system, then charge R-410A (or other refrigerant per unit) by weight with a precision scale.",
          ru: "Вакуумируем систему, затем заправляем R-410A (или другой по спецификации) с помощью точных весов.",
        },
      },
      {
        title: { es: "Prueba de funcionamiento", en: "Function test", ru: "Проверка работы" },
        text: {
          es: "Verificamos presiones de trabajo, temperatura de salida y rendimiento general. Entregamos garantía de 60 días.",
          en: "We verify working pressures, outlet temperature, and overall performance. We deliver a 60-day warranty.",
          ru: "Проверяем рабочие давления, температуру на выходе и общую производительность. Выдаём гарантию 60 дней.",
        },
      },
    ],
  },

  emergencia: {
    intro: {
      es: "Una falla de aire acondicionado en Panamá no es solo una molestia — puede convertirse en una emergencia de salud. Los CDC de EE.UU. advierten que la exposición prolongada al calor extremo puede provocar enfermedades graves, especialmente en adultos mayores, niños y personas con condiciones médicas preexistentes. Cuando su AC falla inesperadamente, necesita un técnico que llegue rápido, diagnostique con precisión y resuelva el problema en la primera visita. En 24clima ofrecemos servicio de emergencia 24/7/365 con tiempo de llegada menor a 2 horas en toda la zona metropolitana de Ciudad de Panamá.",
      en: "An air conditioning failure in Panama isn't just an inconvenience — it can become a health emergency. The U.S. CDC warns that prolonged exposure to extreme heat can cause serious illness, especially in elderly, children, and people with pre-existing conditions. When your AC fails unexpectedly, you need a technician who arrives fast, diagnoses accurately, and resolves the problem on the first visit. At 24clima we offer 24/7/365 emergency service with under 2-hour arrival time across Panama City.",
      ru: "Поломка кондиционера в Панаме — не просто неудобство, а потенциальная угроза здоровью. CDC предупреждают: длительное воздействие экстремальной жары опасно для пожилых, детей и людей с хроническими заболеваниями. Когда кондиционер отказывает внезапно, нужен техник, который приедет быстро и решит проблему в первый визит. 24clima предлагает аварийный выезд 24/7/365 — менее чем за 2 часа в любую точку Панама-Сити.",
    },
    whyUsTitle: {
      es: "¿Por qué elegir 24clima para emergencias?",
      en: "Why choose 24clima for emergencies?",
      ru: "Почему стоит выбрать 24clima для аварийного ремонта?",
    },
    whyUsPoints: [
      {
        es: "Disponibilidad real 24/7/365 — no solo un número que nadie contesta. Nuestro Maestro HVAC responde por WhatsApp incluso en noches, fines de semana y feriados.",
        en: "Real 24/7/365 availability — not just a number no one answers. Our HVAC Master responds via WhatsApp even on nights, weekends, and holidays.",
        ru: "Реальная доступность 24/7/365 — не просто номер без ответа. Мастер HVAC отвечает в WhatsApp даже ночью, в выходные и праздники.",
      },
      {
        es: "Llegada en menos de 2 horas a 10+ zonas de Ciudad de Panamá: Costa del Este, Punta Pacífica, Clayton, Albrook, San Francisco, El Cangrejo, Obarrio, Bella Vista y más.",
        en: "Arrival in under 2 hours to 10+ Panama City zones: Costa del Este, Punta Pacífica, Clayton, Albrook, San Francisco, El Cangrejo, Obarrio, Bella Vista, and more.",
        ru: "Прибытие менее чем за 2 часа в 10+ зон Панама-Сити: Коста-дель-Эсте, Пунта-Пасифика, Клейтон, Альбрук, Сан-Франциско и другие.",
      },
      {
        es: "Diagnóstico rápido con herramientas profesionales. La mayoría de emergencias se resuelven en la primera visita sin necesidad de segunda cita.",
        en: "Quick diagnosis with professional tools. Most emergencies are resolved on the first visit without needing a second appointment.",
        ru: "Быстрая диагностика профессиональным инструментом. Большинство аварий устраняются в первый визит.",
      },
      {
        es: "Precio de emergencia desde $40 — sin margen abusivo. Transparencia total: le informamos el costo antes de empezar.",
        en: "Emergency pricing from $40 — no abusive markup. Full transparency: we inform you of the cost before starting.",
        ru: "Аварийный выезд от $40 — без завышенных наценок. Полная прозрачность: сообщаем цену до начала работ.",
      },
    ],
    howTitle: {
      es: "¿Cómo funciona el servicio de emergencia?",
      en: "How does the emergency service work?",
      ru: "Как работает аварийный сервис?",
    },
    howSteps: [
      {
        title: { es: "Contacto inmediato", en: "Immediate contact", ru: "Немедленная связь" },
        text: {
          es: "Escríbanos por WhatsApp o llame. Describamos el problema y le confirmamos la hora de llegada en minutos.",
          en: "Write us on WhatsApp or call. Describe the problem and we'll confirm arrival time within minutes.",
          ru: "Напишите в WhatsApp или позвоните. Опишите проблему — подтвердим время приезда за считанные минуты.",
        },
      },
      {
        title: { es: "Llegada y diagnóstico express", en: "Arrival and express diagnosis", ru: "Прибытие и экспресс-диагностика" },
        text: {
          es: "Nuestro técnico llega en <2 horas con herramientas y repuestos comunes. Diagnóstico rápido para identificar la causa raíz de la falla.",
          en: "Our technician arrives in <2 hours with tools and common spare parts. Quick diagnosis to identify the root cause of the failure.",
          ru: "Техник приезжает за <2ч с инструментами и распространёнными запчастями. Экспресс-диагностика для выявления причины.",
        },
      },
      {
        title: { es: "Reparación en sitio", en: "On-site repair", ru: "Ремонт на месте" },
        text: {
          es: "Reparamos la falla en el momento siempre que sea posible. Si se requiere un repuesto especial, lo conseguimos y regresamos a la brevedad.",
          en: "We repair the fault on the spot whenever possible. If a special part is needed, we source it and return promptly.",
          ru: "Устраняем неисправность на месте. Если нужна редкая запчасть — достаём и возвращаемся в кратчайшие сроки.",
        },
      },
      {
        title: { es: "Seguimiento post-emergencia", en: "Post-emergency follow-up", ru: "Поставарийное сопровождение" },
        text: {
          es: "Después de la reparación de emergencia, recomendamos un mantenimiento preventivo para evitar recurrencias. Garantía de 60 días sobre el servicio.",
          en: "After emergency repair, we recommend preventive maintenance to avoid recurrence. 60-day warranty on the service.",
          ru: "После аварийного ремонта рекомендуем профилактику для предотвращения повторений. Гарантия 60 дней.",
        },
      },
    ],
  },
};
