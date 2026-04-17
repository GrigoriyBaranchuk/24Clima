/**
 * Datos para la página de autodiagnóstico de aire acondicionado.
 *
 * Captura tráfico informacional con queries tipo:
 *  - "por qué mi aire acondicionado no enfría"
 *  - "aire acondicionado gotea agua"
 *  - "aire acondicionado hace ruido"
 *  - "aire acondicionado no enciende"
 *
 * Cada síntoma incluye posibles causas, soluciones DIY y cuándo llamar
 * a un técnico profesional — generando CTAs naturales.
 */

type Localized = { es: string; en: string; ru: string };

export interface DiagnosticSymptom {
  id: string;
  icon: string;
  title: Localized;
  description: Localized;
  causes: { text: Localized; severity: "low" | "medium" | "high" }[];
  diyTips: Localized[];
  callPro: Localized;
  relatedService: string; // ServiceSlug
}

export const DIAGNOSTIC_SYMPTOMS: DiagnosticSymptom[] = [
  {
    id: "no-enfria",
    icon: "🌡️",
    title: {
      es: "El aire acondicionado no enfría",
      en: "AC is not cooling",
      ru: "Кондиционер не охлаждает",
    },
    description: {
      es: "El equipo enciende y sopla aire, pero la temperatura no baja. Este es el problema más común y puede tener múltiples causas.",
      en: "The unit turns on and blows air, but the temperature doesn't drop. This is the most common problem and can have multiple causes.",
      ru: "Блок включается и дует воздух, но температура не снижается. Это самая частая проблема с несколькими возможными причинами.",
    },
    causes: [
      {
        text: {
          es: "Filtros sucios — reducen el flujo de aire hasta un 40%, según la EPA. El compresor trabaja más y enfría menos.",
          en: "Dirty filters — reduce airflow by up to 40%, according to the EPA. The compressor works harder and cools less.",
          ru: "Грязные фильтры — снижают поток воздуха до 40% (по данным EPA). Компрессор работает на износ, а охлаждение падает.",
        },
        severity: "low",
      },
      {
        text: {
          es: "Serpentines del evaporador congelados — ocurre cuando el refrigerante es insuficiente o el flujo de aire está bloqueado.",
          en: "Frozen evaporator coils — happens when refrigerant is insufficient or airflow is blocked.",
          ru: "Замёрзший испаритель — происходит при недостатке хладагента или заблокированном потоке воздуха.",
        },
        severity: "medium",
      },
      {
        text: {
          es: "Fuga de gas refrigerante (R-410A o R-22) — el sistema pierde capacidad de enfriamiento gradualmente. Requiere detección y recarga profesional.",
          en: "Refrigerant leak (R-410A or R-22) — the system gradually loses cooling capacity. Requires professional detection and recharge.",
          ru: "Утечка хладагента (R-410A или R-22) — система постепенно теряет холодопроизводительность. Нужна профессиональная диагностика и заправка.",
        },
        severity: "high",
      },
      {
        text: {
          es: "Compresor dañado — el compresor es el corazón del sistema. Si no genera presión, no habrá enfriamiento. El diagnóstico eléctrico es necesario.",
          en: "Damaged compressor — the compressor is the heart of the system. If it doesn't generate pressure, there will be no cooling. Electrical diagnosis is necessary.",
          ru: "Повреждённый компрессор — сердце системы. Без давления охлаждения не будет. Нужна электродиагностика.",
        },
        severity: "high",
      },
    ],
    diyTips: [
      {
        es: "Limpie o reemplace los filtros de aire cada 2-4 semanas en clima tropical.",
        en: "Clean or replace air filters every 2-4 weeks in tropical climates.",
        ru: "Чистите или меняйте фильтры каждые 2-4 недели в тропическом климате.",
      },
      {
        es: "Verifique que la unidad exterior no esté obstruida por vegetación, polvo o basura.",
        en: "Check that the outdoor unit is not blocked by vegetation, dust, or debris.",
        ru: "Убедитесь, что наружный блок не заблокирован растительностью, пылью или мусором.",
      },
      {
        es: "Asegúrese de que el termostato esté en modo COOL y a una temperatura inferior a la del ambiente.",
        en: "Make sure the thermostat is in COOL mode and set below room temperature.",
        ru: "Убедитесь, что термостат установлен в режим COOL и температура ниже комнатной.",
      },
    ],
    callPro: {
      es: "Si después de limpiar filtros el problema persiste más de 24 horas, probablemente hay una fuga de gas o un problema eléctrico. Un técnico HVAC con manómetros puede diagnosticarlo en 30 minutos.",
      en: "If the problem persists more than 24 hours after cleaning filters, there's likely a gas leak or electrical issue. An HVAC technician with gauges can diagnose it in 30 minutes.",
      ru: "Если после чистки фильтров проблема сохраняется более 24 часов, вероятна утечка газа или электрическая неисправность. Техник HVAC с манометрами диагностирует за 30 минут.",
    },
    relatedService: "reparacion",
  },
  {
    id: "gotea-agua",
    icon: "💧",
    title: {
      es: "El aire acondicionado gotea agua",
      en: "AC is leaking water",
      ru: "Кондиционер течёт (капает вода)",
    },
    description: {
      es: "Gotas de agua caen desde la unidad interior, manchando paredes o mojando el piso. En el clima húmedo de Panamá, este es el segundo problema más frecuente.",
      en: "Water drops fall from the indoor unit, staining walls or wetting the floor. In Panama's humid climate, this is the second most frequent problem.",
      ru: "Вода капает из внутреннего блока, оставляя пятна на стенах или лужи на полу. В влажном климате Панамы это вторая по частоте проблема.",
    },
    causes: [
      {
        text: {
          es: "Drenaje obstruido — la tubería de desagüe acumula algas, moho y suciedad. En Panamá, la alta humedad (75-85%) acelera este proceso.",
          en: "Clogged drain — the drain pipe accumulates algae, mold, and dirt. In Panama, high humidity (75-85%) accelerates this process.",
          ru: "Засор дренажа — в трубке скапливаются водоросли, плесень и грязь. Влажность Панамы (75-85%) ускоряет этот процесс.",
        },
        severity: "low",
      },
      {
        text: {
          es: "Bandeja de condensado rota o desalineada — el agua no llega al drenaje y se desborda por los bordes.",
          en: "Broken or misaligned condensate tray — water doesn't reach the drain and overflows.",
          ru: "Сломанный или смещённый поддон конденсата — вода не попадает в дренаж и переливается.",
        },
        severity: "medium",
      },
      {
        text: {
          es: "Evaporador congelado que se descongela — el hielo se derrite y produce más agua de la que el drenaje puede manejar.",
          en: "Frozen evaporator thawing — ice melts producing more water than the drain can handle.",
          ru: "Оттаивание замёрзшего испарителя — лёд тает, и воды больше, чем может отвести дренаж.",
        },
        severity: "medium",
      },
    ],
    diyTips: [
      {
        es: "Localice la salida del tubo de drenaje (exterior) y verifique que no esté tapada.",
        en: "Locate the drain tube outlet (outside) and check it's not blocked.",
        ru: "Найдите выход дренажной трубки (снаружи) и убедитесь, что она не засорена.",
      },
      {
        es: "Vierta una taza de vinagre blanco en la bandeja de condensado una vez al mes para prevenir algas.",
        en: "Pour a cup of white vinegar into the condensate tray once a month to prevent algae.",
        ru: "Заливайте стакан белого уксуса в поддон конденсата раз в месяц для профилактики водорослей.",
      },
    ],
    callPro: {
      es: "Si el goteo no se detiene después de limpiar el drenaje, el problema puede ser un serpentín congelado o una fuga de refrigerante. La limpieza profunda profesional incluye el desmontaje completo y la desinfección del sistema de drenaje.",
      en: "If the leak doesn't stop after clearing the drain, the issue may be a frozen coil or refrigerant leak. Professional deep cleaning includes complete disassembly and drain system disinfection.",
      ru: "Если течь не прекращается после прочистки дренажа, проблема может быть в замёрзшем теплообменнике или утечке хладагента. Профессиональная глубокая чистка включает полную разборку и дезинфекцию дренажной системы.",
    },
    relatedService: "limpieza",
  },
  {
    id: "hace-ruido",
    icon: "🔊",
    title: {
      es: "El aire acondicionado hace ruido extraño",
      en: "AC is making strange noise",
      ru: "Кондиционер шумит (странные звуки)",
    },
    description: {
      es: "Zumbidos, chirridos, golpeteos o vibraciones que no existían antes. El tipo de ruido indica la causa probable.",
      en: "Buzzing, squealing, banging, or vibrations that weren't there before. The type of noise indicates the probable cause.",
      ru: "Гудение, скрип, стук или вибрации, которых раньше не было. Тип шума указывает на вероятную причину.",
    },
    causes: [
      {
        text: {
          es: "Aspas del ventilador desbalanceadas o sucias — acumulación de polvo en el rodete genera vibraciones progresivas.",
          en: "Unbalanced or dirty fan blades — dust buildup on the blower wheel causes progressive vibrations.",
          ru: "Разбалансированные или грязные лопасти вентилятора — накопление пыли на крыльчатке вызывает нарастающую вибрацию.",
        },
        severity: "low",
      },
      {
        text: {
          es: "Tornillos o partes sueltas — la vibración normal del compresor puede aflojar conexiones con el tiempo.",
          en: "Loose screws or parts — normal compressor vibration can loosen connections over time.",
          ru: "Ослабленные винты или детали — нормальная вибрация компрессора со временем расшатывает соединения.",
        },
        severity: "low",
      },
      {
        text: {
          es: "Rodamientos del motor desgastados — producen un chirrido metálico continuo. Si no se atiende, el motor puede quemarse.",
          en: "Worn motor bearings — produce a continuous metallic squeal. If not addressed, the motor can burn out.",
          ru: "Изношенные подшипники двигателя — создают непрерывный металлический скрип. Без ремонта двигатель может сгореть.",
        },
        severity: "high",
      },
      {
        text: {
          es: "Compresor con problemas internos — golpeteos rítmicos fuertes suelen indicar daño en las válvulas internas del compresor.",
          en: "Compressor with internal issues — loud rhythmic banging usually indicates internal valve damage.",
          ru: "Проблемы внутри компрессора — громкие ритмичные удары обычно указывают на повреждение внутренних клапанов.",
        },
        severity: "high",
      },
    ],
    diyTips: [
      {
        es: "Apague el equipo y revise que no haya objetos atrapados en la unidad exterior.",
        en: "Turn off the unit and check for objects trapped in the outdoor unit.",
        ru: "Выключите блок и проверьте, нет ли застрявших предметов в наружном блоке.",
      },
      {
        es: "Verifique que los soportes de montaje estén firmes y no vibren contra la pared.",
        en: "Verify that mounting brackets are firm and not vibrating against the wall.",
        ru: "Проверьте, что монтажные кронштейны закреплены и не вибрируют о стену.",
      },
    ],
    callPro: {
      es: "Un chirrido metálico continuo o golpeteos fuertes requieren atención profesional urgente. Continuar usando el equipo puede dañar el compresor ($300–$800 para reemplazo). Mejor diagnosticarlo a tiempo por $35.",
      en: "Continuous metallic squealing or loud banging requires urgent professional attention. Continuing to use the unit can damage the compressor ($300-$800 replacement). Better to diagnose it early for $35.",
      ru: "Непрерывный металлический скрип или громкие удары требуют срочной профессиональной помощи. Продолжение использования может повредить компрессор ($300–$800 замена). Лучше вовремя провести диагностику за $35.",
    },
    relatedService: "reparacion",
  },
  {
    id: "no-enciende",
    icon: "⚡",
    title: {
      es: "El aire acondicionado no enciende",
      en: "AC won't turn on",
      ru: "Кондиционер не включается",
    },
    description: {
      es: "El equipo no responde al control remoto ni al botón de encendido. Sin luces, sin sonido — o enciende y se apaga inmediatamente.",
      en: "The unit doesn't respond to the remote or power button. No lights, no sound — or it turns on and shuts off immediately.",
      ru: "Блок не реагирует на пульт или кнопку включения. Нет индикаторов, нет звука — или включается и сразу выключается.",
    },
    causes: [
      {
        text: {
          es: "Breaker disparado o fusible quemado — las fluctuaciones de voltaje en Panamá son frecuentes y pueden activar la protección eléctrica.",
          en: "Tripped breaker or blown fuse — voltage fluctuations in Panama are common and can trigger electrical protection.",
          ru: "Выбитый автомат или перегоревший предохранитель — скачки напряжения в Панаме частые и могут сработать электрозащиту.",
        },
        severity: "low",
      },
      {
        text: {
          es: "Pilas del control remoto agotadas — suena obvio, pero es la causa más frecuente de 'no enciende' (25% de los llamados, según nuestra experiencia).",
          en: "Dead remote control batteries — sounds obvious, but it's the most frequent cause of 'won't turn on' (25% of calls, per our experience).",
          ru: "Севшие батарейки пульта — звучит очевидно, но это самая частая причина «не включается» (25% вызовов по нашему опыту).",
        },
        severity: "low",
      },
      {
        text: {
          es: "Capacitor del compresor dañado — el capacitor de arranque provee el impulso eléctrico inicial. Cuando falla, el compresor no arranca y la protección térmica lo apaga.",
          en: "Damaged compressor capacitor — the start capacitor provides the initial electrical impulse. When it fails, the compressor won't start and thermal protection shuts it off.",
          ru: "Повреждённый пусковой конденсатор — он подаёт начальный электрический импульс. При выходе из строя компрессор не запускается и термозащита отключает его.",
        },
        severity: "medium",
      },
      {
        text: {
          es: "Placa electrónica quemada — protecciones ante picos de voltaje insuficientes pueden dañar la placa de control. Común después de tormentas eléctricas.",
          en: "Burned circuit board — insufficient surge protection can damage the control board. Common after electrical storms.",
          ru: "Сгоревшая плата управления — недостаточная защита от скачков напряжения может повредить плату. Часто после гроз.",
        },
        severity: "high",
      },
    ],
    diyTips: [
      {
        es: "Revise el breaker del tablero eléctrico dedicado al AC. Apáguelo, espere 30 segundos y enciéndalo de nuevo.",
        en: "Check the electrical panel breaker dedicated to the AC. Turn it off, wait 30 seconds, and turn it back on.",
        ru: "Проверьте автомат в электрощите, выделенный для кондиционера. Выключите, подождите 30 секунд и включите снова.",
      },
      {
        es: "Cambie las pilas del control remoto por pilas nuevas AAA.",
        en: "Replace the remote control batteries with new AAA batteries.",
        ru: "Замените батарейки в пульте на новые AAA.",
      },
      {
        es: "Espere 3 minutos después de un apagón antes de encender el AC — el compresor necesita tiempo para ecualizar presiones.",
        en: "Wait 3 minutes after a power outage before turning on the AC — the compressor needs time to equalize pressures.",
        ru: "Подождите 3 минуты после отключения электричества перед включением — компрессору нужно время для выравнивания давлений.",
      },
    ],
    callPro: {
      es: "Si el breaker se dispara repetidamente al encender el AC, NO intente forzar el encendido — puede haber un cortocircuito. Un diagnóstico eléctrico profesional cuesta $35 e incluye medición de voltaje, amperaje y capacitancia.",
      en: "If the breaker trips repeatedly when turning on the AC, DO NOT force it — there may be a short circuit. A professional electrical diagnosis costs $35 and includes voltage, amperage, and capacitance measurement.",
      ru: "Если автомат повторно выбивает при включении кондиционера, НЕ пытайтесь включить принудительно — возможно короткое замыкание. Профессиональная электродиагностика стоит $35 и включает измерение напряжения, силы тока и ёмкости.",
    },
    relatedService: "reparacion",
  },
  {
    id: "mal-olor",
    icon: "👃",
    title: {
      es: "El aire acondicionado huele mal",
      en: "AC smells bad",
      ru: "Кондиционер неприятно пахнет",
    },
    description: {
      es: "Olores a humedad, moho, calcetín mojado o ácido al encender el equipo. Además de ser desagradable, indica presencia de bacterias y hongos que afectan la calidad del aire interior.",
      en: "Musty, moldy, wet sock, or acidic odors when turning on the unit. Beyond being unpleasant, this indicates bacteria and fungi presence affecting indoor air quality.",
      ru: "Запах сырости, плесени, мокрых носков или кислоты при включении. Помимо дискомфорта, это указывает на бактерии и грибки, ухудшающие качество воздуха.",
    },
    causes: [
      {
        text: {
          es: "Moho y bacterias en el evaporador — el ambiente húmedo y oscuro dentro de la unidad es ideal para el crecimiento microbiológico. El CDC recomienda limpieza regular para prevenir problemas respiratorios.",
          en: "Mold and bacteria on the evaporator — the humid, dark environment inside the unit is ideal for microbiological growth. The CDC recommends regular cleaning to prevent respiratory issues.",
          ru: "Плесень и бактерии на испарителе — влажная и тёмная среда внутри блока идеальна для роста микроорганизмов. CDC рекомендует регулярную чистку для профилактики респираторных заболеваний.",
        },
        severity: "medium",
      },
      {
        text: {
          es: "Bandeja de condensado estancada — agua acumulada con materia orgánica produce olor a aguas estancadas.",
          en: "Stagnant condensate tray — accumulated water with organic matter produces stale water smell.",
          ru: "Застоявшийся поддон конденсата — вода с органикой создаёт запах стоячей воды.",
        },
        severity: "low",
      },
    ],
    diyTips: [
      {
        es: "Retire y lave los filtros con agua y jabón neutro. Déjelos secar completamente antes de reinstalarlos.",
        en: "Remove and wash filters with water and neutral soap. Let them dry completely before reinstalling.",
        ru: "Снимите и промойте фильтры водой с нейтральным мылом. Полностью высушите перед установкой.",
      },
      {
        es: "Encienda el equipo en modo ventilador (sin frío) durante 30 minutos para secar la humedad interna.",
        en: "Run the unit in fan-only mode (no cooling) for 30 minutes to dry internal moisture.",
        ru: "Включите блок в режиме вентилятора (без охлаждения) на 30 минут, чтобы высушить внутреннюю влагу.",
      },
    ],
    callPro: {
      es: "Una limpieza profunda profesional con desinfectante elimina el 99% de bacterias y hongos del evaporador. Recomendamos limpieza cada 3 meses en el clima tropical de Panamá. Precio desde $29.99 por unidad.",
      en: "A professional deep cleaning with disinfectant eliminates 99% of bacteria and fungi from the evaporator. We recommend cleaning every 3 months in Panama's tropical climate. Price from $29.99 per unit.",
      ru: "Профессиональная глубокая чистка с дезинфицирующим средством устраняет 99% бактерий и грибков с испарителя. Рекомендуем чистку каждые 3 месяца в тропическом климате Панамы. Цена от $29.99 за блок.",
    },
    relatedService: "limpieza",
  },
  {
    id: "consume-mucha-energia",
    icon: "💰",
    title: {
      es: "El aire acondicionado consume demasiada energía",
      en: "AC uses too much energy",
      ru: "Кондиционер потребляет слишком много энергии",
    },
    description: {
      es: "La factura eléctrica sube mes a mes sin cambiar los hábitos de uso. Un AC en mal estado puede consumir 15-25% más energía de lo normal, según el Departamento de Energía de EE.UU. (DOE).",
      en: "The electricity bill keeps rising month after month without changing usage habits. A poorly maintained AC can consume 15-25% more energy than normal, according to the U.S. Department of Energy (DOE).",
      ru: "Счёт за электричество растёт из месяца в месяц без изменения привычек. Плохо обслуживаемый кондиционер потребляет на 15-25% больше энергии, по данным Министерства энергетики США (DOE).",
    },
    causes: [
      {
        text: {
          es: "Filtros y serpentines sucios — el equipo necesita más energía para mover aire a través de obstrucciones. La EPA estima que filtros limpios reducen el consumo en 5-15%.",
          en: "Dirty filters and coils — the unit needs more energy to move air through obstructions. The EPA estimates clean filters reduce consumption by 5-15%.",
          ru: "Грязные фильтры и теплообменники — блоку нужно больше энергии для прогона воздуха через загрязнения. EPA оценивает, что чистые фильтры снижают потребление на 5-15%.",
        },
        severity: "low",
      },
      {
        text: {
          es: "Gas refrigerante bajo — el compresor trabaja continuamente sin alcanzar la temperatura deseada, consumiendo más electricidad.",
          en: "Low refrigerant — the compressor runs continuously without reaching the desired temperature, consuming more electricity.",
          ru: "Низкий уровень хладагента — компрессор работает непрерывно, не достигая нужной температуры, потребляя больше электричества.",
        },
        severity: "medium",
      },
      {
        text: {
          es: "Equipo sobredimensionado o subdimensionado — un AC de capacidad incorrecta para el espacio nunca será eficiente. Regla general: 600 BTU por m² en Panamá.",
          en: "Oversized or undersized unit — an AC with incorrect capacity for the space will never be efficient. Rule of thumb: 600 BTU per m² in Panama.",
          ru: "Неправильно подобранная мощность — кондиционер неподходящей мощности для помещения никогда не будет эффективным. Правило: 600 BTU на м² в Панаме.",
        },
        severity: "medium",
      },
    ],
    diyTips: [
      {
        es: "Mantenga el termostato a 24°C — cada grado menos aumenta el consumo ~6%.",
        en: "Keep the thermostat at 24°C — each degree lower increases consumption by ~6%.",
        ru: "Держите термостат на 24°C — каждый градус ниже увеличивает потребление на ~6%.",
      },
      {
        es: "Use cortinas o persianas durante las horas de mayor sol para reducir la carga térmica.",
        en: "Use curtains or blinds during peak sun hours to reduce heat load.",
        ru: "Используйте шторы или жалюзи в часы максимального солнца для снижения тепловой нагрузки.",
      },
    ],
    callPro: {
      es: "Un mantenimiento preventivo profesional cada 3 meses optimiza el rendimiento y puede reducir su factura eléctrica en un 15-25%. El servicio incluye limpieza de serpentines, verificación de gas y ajuste del sistema. Desde $50.",
      en: "Professional preventive maintenance every 3 months optimizes performance and can reduce your electric bill by 15-25%. Service includes coil cleaning, gas check, and system adjustment. From $50.",
      ru: "Профессиональное профилактическое ТО каждые 3 месяца оптимизирует работу и может снизить счёт за электричество на 15-25%. Включает чистку теплообменников, проверку газа и настройку системы. От $50.",
    },
    relatedService: "mantenimiento",
  },
];

export const DIAGNOSTICO_PAGE_CONTENT = {
  title: {
    es: "Diagnóstico de Problemas de Aire Acondicionado",
    en: "Air Conditioning Problem Diagnosis",
    ru: "Диагностика проблем кондиционера",
  },
  subtitle: {
    es: "Identifique qué le pasa a su aire acondicionado con nuestra guía de autodiagnóstico. Soluciones paso a paso y cuándo llamar a un profesional.",
    en: "Identify what's wrong with your AC using our self-diagnosis guide. Step-by-step solutions and when to call a professional.",
    ru: "Определите, что случилось с кондиционером, с помощью нашего руководства. Пошаговые решения и когда вызывать мастера.",
  },
  causesTitle: {
    es: "Posibles causas:",
    en: "Possible causes:",
    ru: "Возможные причины:",
  },
  diyTitle: {
    es: "Lo que puede hacer usted mismo:",
    en: "What you can do yourself:",
    ru: "Что можно сделать самостоятельно:",
  },
  callProTitle: {
    es: "¿Cuándo llamar a un profesional?",
    en: "When to call a professional?",
    ru: "Когда вызывать мастера?",
  },
  ctaButton: {
    es: "Solicitar diagnóstico profesional",
    en: "Request professional diagnosis",
    ru: "Заказать профессиональную диагностику",
  },
  ctaTitle: {
    es: "¿No encontró su problema?",
    en: "Didn't find your problem?",
    ru: "Не нашли свою проблему?",
  },
  ctaText: {
    es: "Envíenos una foto o video por WhatsApp y nuestro Maestro HVAC le dará un diagnóstico preliminar gratuito en minutos.",
    en: "Send us a photo or video via WhatsApp and our HVAC Master will give you a free preliminary diagnosis in minutes.",
    ru: "Отправьте фото или видео в WhatsApp, и наш мастер HVAC даст бесплатную предварительную диагностику за минуты.",
  },
};
