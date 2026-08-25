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

  gypsum: {
    intro: {
      es: "En Panamá el cielo raso hace mucho más que tapar: esconde tuberías, cables y ductos, mejora la acústica y deja una superficie limpia y pareja en todo el ambiente. El gypsum (drywall) es la solución más usada en apartamentos y locales de Ciudad de Panamá porque se instala rápido, ensucia mucho menos que el concreto y admite cajones con luz LED, niveles y nichos. En 24clima instalamos cielo raso y paredes de gypsum desde $35/m², listos para pintar: estructura metálica, lámina, cinta, pasta y lijado. Usamos lámina estándar de 1/2″ y, donde hay humedad — baños y cocinas —, lámina MR resistente a la humedad. La misma cuadrilla que monta su aire acondicionado cierra el cielo raso: un solo contrato y una garantía de 365 días.",
      en: "In Panama a ceiling does much more than cover: it hides pipes, wiring and ducts, improves acoustics and leaves one clean, even surface across the room. Gypsum board (drywall) is the most common solution in Panama City apartments and commercial units because it goes up fast, makes far less mess than concrete and takes LED coves, multiple levels and niches. At 24clima we install gypsum ceilings and walls from $35/m², ready to paint: metal framing, board, tape, joint compound and sanding. We use standard 1/2″ board and, where there is moisture — bathrooms and kitchens —, moisture-resistant MR board. The same crew that fits your air conditioning closes the ceiling: one contract and a 365-day warranty.",
      ru: "В Панаме подвесной потолок делает гораздо больше, чем просто закрывает перекрытие: он прячет трубы, кабели и воздуховоды, улучшает акустику и даёт ровную чистую поверхность по всей комнате. Гипсокартон (drywall) — самое востребованное решение в квартирах и коммерческих помещениях Панама-Сити: монтируется быстро, даёт куда меньше грязи, чем бетон, и позволяет делать короба под LED-подсветку, уровни и ниши. В 24clima мы монтируем потолки и стены из гипсокартона от $35/м², сразу под покраску: металлический каркас, лист, лента, шпаклёвка и шлифовка. Работаем со стандартным листом 1/2″, а во влажных зонах — санузлы и кухни — с влагостойким листом MR. Та же бригада, что ставит кондиционер, закрывает потолок: один договор и гарантия 365 дней.",
    },
    whyUsTitle: {
      es: "¿Por qué elegir 24clima para su cielo raso de gypsum?",
      en: "Why choose 24clima for your gypsum ceiling?",
      ru: "Почему стоит выбрать 24clima для потолка из гипсокартона?",
    },
    whyUsPoints: [
      {
        es: "Precio claro por metro cuadrado desde $35, con cinta, pasta y lijado incluidos: usted recibe una superficie lista para pintar, no una estructura a medio terminar.",
        en: "A clear price per square meter from $35, with tape, joint compound and sanding included: you get a surface ready to paint, not a half-finished frame.",
        ru: "Понятная цена за квадратный метр от $35, лента, шпаклёвка и шлифовка включены: вы получаете поверхность под покраску, а не наполовину собранный каркас.",
      },
      {
        es: "Cajones perimetrales con luz LED desde $25 por metro lineal, niveles y nichos: acabados que cambian por completo una sala sin tocar la estructura del edificio.",
        en: "Perimeter LED coves from $25 per linear meter, stepped levels and niches: finishes that transform a living room without touching the building structure.",
        ru: "Периметральные короба под LED-ленту от $25 за погонный метр, уровни и ниши: отделка, которая полностью меняет комнату, не затрагивая конструкцию здания.",
      },
      {
        es: "Lámina MR resistente a la humedad para baños y cocinas, y lámina firecode de 5/8″ cuando el reglamento del edificio la exige.",
        en: "Moisture-resistant MR board for bathrooms and kitchens, and 5/8″ firecode board when the building rules require it.",
        ru: "Влагостойкий лист MR для санузлов и кухонь и огнестойкий firecode 5/8″, если этого требуют правила здания.",
      },
      {
        es: "Una sola cuadrilla para el cielo raso y el aire acondicionado: un contrato, una garantía de 365 días sobre juntas y estructura, y nadie a quien echarle la culpa.",
        en: "One crew for both ceiling and air conditioning: one contract, one 365-day warranty on joints and framing, and nobody to pass the blame to.",
        ru: "Одна бригада на потолок и кондиционер: один договор, одна гарантия 365 дней на швы и каркас — и некому перекладывать ответственность.",
      },
    ],
    howTitle: {
      es: "¿Cómo instalamos el cielo raso de gypsum?",
      en: "How do we install a gypsum ceiling?",
      ru: "Как мы монтируем потолок из гипсокартона?",
    },
    howSteps: [
      {
        title: {
          es: "Visita y medición",
          en: "Visit and measurement",
          ru: "Выезд и замер",
        },
        text: {
          es: "Medimos el área, revisamos la altura libre y qué hay que esconder arriba (tuberías, cables, ductos). Con eso entregamos un precio cerrado por m², sin sorpresas.",
          en: "We measure the area, check the free height and what has to be hidden above (pipes, wiring, ducts). With that we give you a fixed price per m², no surprises.",
          ru: "Замеряем площадь, проверяем свободную высоту и то, что нужно спрятать наверху (трубы, кабели, воздуховоды). На этом основании даём фиксированную цену за м² без сюрпризов.",
        },
      },
      {
        title: {
          es: "Estructura metálica",
          en: "Metal framing",
          ru: "Металлический каркас",
        },
        text: {
          es: "Montamos perfiles y colgantes nivelados con láser. Una estructura bien nivelada es lo que evita que aparezcan ondas y fisuras seis meses después.",
          en: "We set profiles and hangers levelled with a laser. A properly levelled frame is what keeps waves and cracks from showing up six months later.",
          ru: "Ставим профиль и подвесы с лазерной нивелировкой. Именно ровный каркас не даёт волнам и трещинам появиться через полгода.",
        },
      },
      {
        title: {
          es: "Láminas y juntas",
          en: "Boards and joints",
          ru: "Листы и швы",
        },
        text: {
          es: "Atornillamos la lámina (estándar, MR en zonas húmedas o firecode donde se exija) y encintamos todas las juntas y esquinas con cinta y perfil de esquinero.",
          en: "We screw on the board (standard, MR in wet areas, or firecode where required) and tape every joint and corner with tape and corner bead.",
          ru: "Прикручиваем лист (стандартный, MR во влажных зонах или firecode, где требуется) и проклеиваем все швы и углы лентой с угловым профилем.",
        },
      },
      {
        title: {
          es: "Pasta, lijado y entrega",
          en: "Compound, sanding and handover",
          ru: "Шпаклёвка, шлифовка и сдача",
        },
        text: {
          es: "Aplicamos pasta en varias manos, lijamos hasta dejar la superficie lista para pintar y limpiamos el área. Entregamos con garantía de 365 días.",
          en: "We apply several coats of compound, sand until the surface is ready to paint and clean the area. Handover comes with a 365-day warranty.",
          ru: "Наносим шпаклёвку в несколько слоёв, шлифуем до состояния под покраску и убираем за собой. Сдаём с гарантией 365 дней.",
        },
      },
    ],
  },

  "aire-acondicionado-por-ductos": {
    intro: {
      es: "Un split colgado en la pared enfría bien, pero se ve. Cuando el acabado importa — una sala, un penthouse, una recepción — la alternativa es el sistema de ductos: un fan coil escondido sobre el cielo raso y difusores lineales de pocos centímetros por donde sale el aire. Desde el piso no se ve un equipo, se ve una línea. En 24clima instalamos ese sistema llave en mano en Ciudad de Panamá: fan coil, ductos aislados, difusores, drenaje, puertas de acceso para el mantenimiento y el cielo raso de gypsum que lo envuelve, todo con una sola cuadrilla y un solo contrato desde $6 000. La visita y la cotización son gratis, y la instalación lleva garantía de 365 días.",
      en: "A wall-mounted split cools well, but you see it. When the finish matters — a living room, a penthouse, a reception area — the alternative is a ducted system: a fan coil hidden above the ceiling and slim linear diffusers where the air comes out. From the floor you don't see a unit, you see a line. At 24clima we install that system turnkey in Panama City: fan coil, insulated ducts, diffusers, drainage, access doors for servicing and the gypsum ceiling that wraps around it — one crew, one contract, from $6,000. The visit and the quote are free, and the installation carries a 365-day warranty.",
      ru: "Настенный сплит охлаждает хорошо, но его видно. Когда важна отделка — гостиная, пентхаус, зона ресепшена — есть альтернатива: канальная система. Фанкойл прячется над потолком, а воздух выходит через узкие линейные диффузоры. Снизу видно не блок, а линию. В 24clima мы делаем такую систему под ключ в Панама-Сити: фанкойл, изолированные воздуховоды, диффузоры, дренаж, лючки доступа для обслуживания и гипсокартонный потолок вокруг — одна бригада, один договор, от $6 000. Выезд и расчёт бесплатны, на монтаж — гарантия 365 дней.",
    },
    whyUsTitle: {
      es: "¿Por qué contratar el clima oculto con 24clima?",
      en: "Why have 24clima do your concealed AC?",
      ru: "Почему скрытый климат стоит доверить 24clima?",
    },
    whyUsPoints: [
      {
        es: "Un solo contratista para el clima y el cielo raso. Nadie le dirá que el problema «es del otro»: la instalación y el acabado los firma la misma empresa.",
        en: "One contractor for both the cooling system and the ceiling. Nobody will tell you the problem belongs to the other trade: the same company signs off on the install and the finish.",
        ru: "Один подрядчик на климат и потолок. Никто не скажет, что «это к другим»: и монтаж, и отделку подписывает одна компания.",
      },
      {
        es: "Difusores lineales casi invisibles, alineados con el cielo raso. El aire llega parejo a todo el ambiente y el equipo desaparece de la vista.",
        en: "Nearly invisible linear diffusers, flush with the ceiling. Air reaches the whole room evenly and the equipment disappears from view.",
        ru: "Практически незаметные линейные диффузоры вровень с потолком. Воздух распределяется равномерно, а техника исчезает из виду.",
      },
      {
        es: "Puertas de acceso ocultas en el cielo raso, previstas desde el primer día para poder limpiar el fan coil y revisar el drenaje sin romper nada.",
        en: "Concealed access doors in the ceiling, allowed for from day one so the fan coil can be cleaned and the drain checked without breaking anything.",
        ru: "Скрытые лючки доступа в потолке, предусмотренные с самого начала: фанкойл можно чистить, а дренаж проверять, ничего не ломая.",
      },
      {
        es: "Garantía de 365 días sobre la instalación completa y precio cerrado antes de empezar: $6 000 – $20 000 según m², tonelaje y puntos de aire.",
        en: "A 365-day warranty on the complete installation and a fixed price before we start: $6,000 – $20,000 depending on area, tonnage and air outlets.",
        ru: "Гарантия 365 дней на весь монтаж и фиксированная цена до старта: $6 000 – $20 000 в зависимости от площади, мощности и числа точек подачи.",
      },
    ],
    howTitle: {
      es: "¿Cómo se instala un aire acondicionado oculto?",
      en: "How is a concealed air conditioner installed?",
      ru: "Как устанавливают скрытый кондиционер?",
    },
    howSteps: [
      {
        title: {
          es: "Visita y cotización gratis",
          en: "Free visit and quote",
          ru: "Бесплатный выезд и расчёт",
        },
        text: {
          es: "Vamos a su espacio, medimos, confirmamos el tonelaje y decidimos con usted dónde van los difusores y cuánto baja el cielo raso. La cotización es cerrada y sin compromiso.",
          en: "We come to your space, measure, confirm the tonnage and agree with you where the diffusers go and how far the ceiling drops. The quote is fixed and with no obligation.",
          ru: "Приезжаем на объект, замеряем, подтверждаем мощность и вместе решаем, где будут диффузоры и насколько опустится потолок. Расчёт фиксированный и ни к чему не обязывает.",
        },
      },
      {
        title: {
          es: "Fan coil y ductos",
          en: "Fan coil and ducts",
          ru: "Фанкойл и воздуховоды",
        },
        text: {
          es: "Colgamos el fan coil con soportes antivibración, tendemos los ductos aislados y la tubería de cobre hasta la condensadora, y resolvemos el drenaje con pendiente real.",
          en: "We hang the fan coil on anti-vibration mounts, run the insulated ducts and the copper line to the condenser, and set the drain with a real slope.",
          ru: "Подвешиваем фанкойл на виброгасящих креплениях, прокладываем изолированные воздуховоды и медную трассу до наружного блока, делаем дренаж с реальным уклоном.",
        },
      },
      {
        title: {
          es: "Difusores y puertas de acceso",
          en: "Diffusers and access doors",
          ru: "Диффузоры и лючки доступа",
        },
        text: {
          es: "Colocamos los difusores lineales y la rejilla de retorno, y dejamos puertas de acceso discretas justo donde harán falta para el mantenimiento.",
          en: "We fit the linear diffusers and the return grille, and leave discreet access doors exactly where servicing will need them.",
          ru: "Ставим линейные диффузоры и решётку возврата и оставляем незаметные лючки ровно там, где они понадобятся при обслуживании.",
        },
      },
      {
        title: {
          es: "Cielo raso, pasta y entrega",
          en: "Ceiling, compound and handover",
          ru: "Потолок, шпаклёвка и сдача",
        },
        text: {
          es: "Cerramos con cielo raso de gypsum, encintamos, aplicamos pasta y lijamos hasta dejarlo listo para pintar. Probamos el equipo frente a usted y entregamos con garantía de 365 días.",
          en: "We close it up with a gypsum ceiling, tape, apply compound and sand it ready to paint. We test the system with you present and hand over with a 365-day warranty.",
          ru: "Закрываем гипсокартонным потолком, проклеиваем швы, шпаклюем и шлифуем под покраску. Проверяем систему при вас и сдаём с гарантией 365 дней.",
        },
      },
    ],
  },
};
