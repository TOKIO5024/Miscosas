const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `✳️ Usa el comando así:\n${usedPrefix + command} 502xxxxxxx`;
  try {
    const url = await conn.profilePictureUrl(text + '@s.whatsapp.net', 'image');
    await conn.sendFile(m.chat, url, 'perfil.jpg', `📸 Foto de perfil de: ${text}`, m);
  } catch (e) {
    throw `❌ No se pudo obtener la foto de perfil. El usuario puede no tener foto o haber restringido el acceso.`;
  }
};

handler.command = /^rpf$/i;
export default handler;