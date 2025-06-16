const handler = async (m, { conn }) => {
  if (!m.quoted) return conn.reply(m.chat, '👁️‍🗨️ Responde a una imagen, video o audio enviado como "ver una vez".', m);

  const tipo = m.quoted.mtype || '';

  try {
    const media = await m.quoted.download();

    if (tipo === 'imageMessage') {
      await conn.sendMessage(m.chat, {
        image: media,
        caption: '🖼️ Imagen revelada... el ojo de Kira todo lo ve.',
      }, { quoted: m });
    } else if (tipo === 'videoMessage') {
      await conn.sendMessage(m.chat, {
        video: media,
        caption: '🎥 Video desbloqueado... ahora es parte del juicio de Kira.',
      }, { quoted: m });
    } else if (tipo === 'audioMessage') {
      await conn.sendMessage(m.chat, {
        audio: media,
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: m });
    } else {
      conn.reply(m.chat, '❌ Ese mensaje no es una imagen, video o audio válido.', m);
    }
  } catch (e) {
    conn.reply(m.chat, '⚠️ No se pudo recuperar el archivo. Asegúrate de que fue enviado como "ver una vez".', m);
  }
};

handler.command = /^ver$/i;
export default handler;