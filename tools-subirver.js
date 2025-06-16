const handler = async (m, { conn }) => {
  if (!m.quoted) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return m.reply('✏️ Responde a una imagen, video o audio para enviarlo como *ver una vez*.');
  }

  const type = m.quoted.mtype || '';
  const media = await m.quoted.download();

  if (!media) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return m.reply('❌ No se pudo descargar el archivo. Asegúrate de que sea una imagen, video o audio válido.');
  }

  // Reacción correcta antes de subir
  await conn.sendMessage(m.chat, { react: { text: '💥', key: m.key } });

  let options = { quoted: m };

  try {
    if (type === 'imageMessage') {
      await conn.sendMessage(m.chat, { image: media, viewOnce: true }, options);
    } else if (type === 'videoMessage') {
      await conn.sendMessage(m.chat, { video: media, viewOnce: true }, options);
    } else if (type === 'audioMessage') {
      await conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mp4', ptt: true, viewOnce: true }, options);
    } else {
      return m.reply('⚠️ Tipo de archivo no soportado para "ver una vez".');
    }

    // Reacción al finalizar
    await conn.sendMessage(m.chat, { react: { text: '☃️', key: m.key } });
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Error al reenviar como *ver una vez*.');
  }
};

handler.command = /^subirver$/i;
handler.help = ['subirver'];
handler.tags = ['tools'];
export default handler;