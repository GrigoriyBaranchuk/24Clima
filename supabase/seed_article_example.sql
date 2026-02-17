-- Example: INSERT article with [[IMAGE_1]] [[IMAGE_2]] placeholders
-- Run in Supabase SQL Editor. Ensure bucket "article-images" exists and is PUBLIC.
-- Upload images to paths: panama/cleaning/1.jpg, panama/cleaning/2.jpg

INSERT INTO public.articles (
  slug,
  title_ru,
  title_es,
  title_en,
  content_ru,
  content_es,
  content_en,
  image_urls
) VALUES (
  'chistka-kondicionera-v-paname-kazhdye-3-mesyaca',
  'Чистка кондиционера в Панаме каждые 3 месяца',
  'Limpieza de aire acondicionado en Panamá cada 3 meses',
  'Air conditioning cleaning in Panama every 3 months',
  '## Зачем чистить кондиционер регулярно

Регулярная чистка продлевает срок службы оборудования и улучшает качество воздуха.

[[IMAGE_1]]

### Что мы делаем

- Чистка фильтров
- Промывка испарителя
- Дезинфекция

[[IMAGE_2]]

Обращайтесь по WhatsApp для записи.',
  '## Por qué limpiar el aire acondicionado regularmente

La limpieza regular prolonga la vida útil del equipo y mejora la calidad del aire.

[[IMAGE_1]]

### Qué hacemos

- Limpieza de filtros
- Lavado del evaporador
- Desinfección

[[IMAGE_2]]

Contáctenos por WhatsApp para reservar.',
  '## Why clean your air conditioning regularly

Regular cleaning extends equipment life and improves air quality.

[[IMAGE_1]]

### What we do

- Filter cleaning
- Evaporator washing
- Disinfection

[[IMAGE_2]]

Contact us via WhatsApp to book.',
  ARRAY['panama/cleaning/1.jpg', 'panama/cleaning/2.jpg']::text[]
)
ON CONFLICT (slug) DO UPDATE SET
  title_ru = EXCLUDED.title_ru,
  title_es = EXCLUDED.title_es,
  title_en = EXCLUDED.title_en,
  content_ru = EXCLUDED.content_ru,
  content_es = EXCLUDED.content_es,
  content_en = EXCLUDED.content_en,
  image_urls = EXCLUDED.image_urls,
  updated_at = now();
