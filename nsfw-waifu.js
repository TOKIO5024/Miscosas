// Créditos: 🐉𝙉𝙚𝙤𝙏𝙤𝙠𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲
import axios from 'axios';

let handler = async (m, { conn, command }) => {
  if (!db.data.chats[m.chat].nsfw && m.isGroup) {
    return conn.reply(m.chat, '🚫 El contenido *NSFW* está desactivado en este grupo.\nUn administrador puede activarlo con *#nsfw on*.', m);
  }

  try {
    const res = await axios.get('https://api.waifu.pics/nsfw/waifu');
    const imageUrl = res.data.url;

    const caption = `🔞 *Aquí tienes tu imagen de nsfwwaifu* 🔥\n\n🌐 *Fuente:* waifu.pics\n💬 Usa este comando con responsabilidad.`;

    await conn.sendFile(m.chat, imageUrl, 'neko.jpg', caption, m);
  } catch (err) {
    console.error('[❌ ERROR API]', err);
    let reason = err.response?.status
      ? `Código HTTP: ${err.response.status} (${err.response.statusText})`
      : err.message;

    return conn.reply(m.chat, `❌ Ocurrió un error al obtener la imagen.\n🔧 *Razón:* ${reason}`, m);
  }
};

handler.command = ['nsfwwaifu', 'w'];
handler.tags = ['nsfw'];
handler.help = ['nsfwwaifu'];
handler.register = true;
handler.nsfw = true;
export default handler;