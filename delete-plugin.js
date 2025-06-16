import fs from 'fs';
import path from 'path';

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return m.reply(`💜 *Ejemplo:* ${usedPrefix + command} descargas-play`);

  const fileName = text.trim().replace(/\.js$/i, '') + '.js'; // Asegura que tenga .js
  const filePath = path.join(process.cwd(), 'plugins', fileName);

  try {
    if (!fs.existsSync(filePath)) return m.reply(`⚠️ El archivo *${fileName}* no existe en la carpeta *plugins*.`);
    
    fs.unlinkSync(filePath);
    await m.react('✅');
    return m.reply(`✅ El archivo *${fileName}* fue eliminado con éxito.`);
  } catch (err) {
    console.error(err);
    await m.react('❌');
    return m.reply(`❌ Error al eliminar el archivo *${fileName}*.`);
  }
};

handler.help = ['deleteplugin <nombre>'];
handler.tags = ['owner'];
handler.command = ['deleteplugin'];
handler.rowner = true; // Solo el dueño puede usarlo

export default handler;