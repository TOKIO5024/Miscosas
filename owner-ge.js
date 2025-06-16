import fs from 'fs';
import path from 'path';

const handler = async (m, { args, usedPrefix, command }) => {
  const fileName = args[0];
  if (!fileName) throw `✳️ Usa el comando así:\n${usedPrefix + command} <nombre-del-comando-sin-.js>\n\nEjemplo:\n${usedPrefix + command} descargas-apk`;

  const filePath = path.join('./plugins', `${fileName}.js`);
  if (!fs.existsSync(filePath)) throw `❌ No se encontró el archivo *${fileName}.js* en la carpeta plugins.`;

  const code = fs.readFileSync(filePath, 'utf-8');
  if (code.length > 4000) {
    return m.reply(`⚠️ El archivo *${fileName}.js* es muy largo para enviarlo completo aquí.`);
  }

  await m.reply(`📂 Aquí tienes el código de *${fileName}.js*:\n\n` + '```js\n' + code + '\n```');
};

handler.command = /^ge$/i;
handler.owner = true;
export default handler;