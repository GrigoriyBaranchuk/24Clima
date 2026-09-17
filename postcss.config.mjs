/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Инлайнит @import прямо в globals.css ещё до Tailwind, поэтому токены
    // дизайн-системы попадают в тот же CSS-файл, а не уезжают отдельным
    // блокирующим запросом. Без этого плагина @import разрешает css-loader,
    // но Next (CssChunkingPlugin, лимит 100 КБ на чанк) всё равно оставляет
    // токены отдельным файлом, т.к. globals.css сам по себе ~105 КБ.
    "postcss-import": {},
    tailwindcss: {},
  },
};

export default config;
