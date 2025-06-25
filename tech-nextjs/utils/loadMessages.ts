// lib/loadMessages.ts
import fs from 'fs/promises';
import path from 'path';

export async function loadMessages(locale: string): Promise<Record<string, any>> {
  const dir = path.resolve(process.cwd(), 'locales', locale);
  const files = await fs.readdir(dir);

  const messages: Record<string, any> = {};

  for (const file of files) {
    if (file.endsWith('.json')) {
      const key = file.replace('.json', '');
      const content = await import(`@/locales/${locale}/${file}`);
      messages[key] = content.default;
    }
  }

  return messages;
}
