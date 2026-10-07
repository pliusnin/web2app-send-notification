import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Вшивает в собранный HTML Content-Security-Policy: выполняются только встроенные скрипт и стили
// (по хешу), а запросы разрешены только к двум эндпоинтам Google. Даже если в бандл попадёт
// чужой код, отправить ключ куда-то ещё он не сможет.
function contentSecurityPolicy(): Plugin {
  const hashes = (html: string, tag: string) =>
    [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g'))]
      .map(([, content]) => `'sha256-${createHash('sha256').update(content).digest('base64')}'`)
      .join(' ') || "'none'"

  return {
    name: 'content-security-policy',
    apply: 'build',
    enforce: 'post', // после viteSingleFile, когда скрипт и стили уже встроены
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || typeof file.source !== 'string' || !file.fileName.endsWith('.html')) continue
        const html = file.source
        const csp = [
          "default-src 'none'",
          `script-src ${hashes(html, 'script')}`,
          `style-src ${hashes(html, 'style')}`,
          'connect-src https://oauth2.googleapis.com https://fcm.googleapis.com',
          "base-uri 'none'",
          "form-action 'none'",
        ].join('; ')
        file.source = html.replace(
          /<meta charset[^>]*>/,
          (charset) => `${charset}\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
        )
      }
    },
  }
}

// Готовая страница — единственный результат сборки — кладётся в корень проекта под понятным именем.
// Сам Vite на диск ничего не пишет (build.write: false), поэтому других файлов сборка не создаёт
function exportHtml(target: URL): Plugin {
  return {
    name: 'export-html',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (html?.type !== 'asset') throw new Error('index.html не найден в сборке')
      const path = fileURLToPath(target)
      writeFileSync(path, html.source)
      this.info(`Готово: ${path}`)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    contentSecurityPolicy(),
    exportHtml(new URL('../fcm-sender.html', import.meta.url)),
  ],
  server: { open: true },
  build: {
    write: false,
    modulePreload: { polyfill: false },
  },
})
