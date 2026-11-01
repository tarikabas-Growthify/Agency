// Typographie française : remplace l'espace avant ? ! : ; » (et après «) par une espace insécable,
// pour que ces signes ne se retrouvent jamais seuls en début de ligne.
// Appliqué aux pages HTML générées, uniquement dans le texte (jamais dans les scripts ou les styles).
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const NBSP = ' '; // espace fine insécable, l'usage typographique français

function fixText(text) {
  return text
    .replace(/ ([?!:;»])/g, `${NBSP}$1`)
    .replace(/(«) /g, `$1${NBSP}`)
    .replace(/(\d) (%|€)/g, `$1${NBSP}$2`);
}

function transform(html) {
  // Découpe en blocs : on ignore <script>, <style>, et le contenu des balises elles-mêmes.
  return html.replace(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)|([^<]+)/g, (m, tag, text) =>
    tag ? tag : fixText(text),
  );
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export default function frenchTypography() {
  return {
    name: 'french-typography',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const files = await walk(fileURLToPath(dir));
        await Promise.all(
          files.map(async (f) => {
            const html = await readFile(f, 'utf8');
            await writeFile(f, transform(html));
          }),
        );
      },
    },
  };
}
