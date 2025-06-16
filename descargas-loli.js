import fetch from "node-fetch";

// Mapa para llevar el control de las sesiones
let imageSessions = new Map();

const imageHandler = async (m, { conn, command, usedPrefix }) => {
    // Obtener sesión de la conversación
    let session = imageSessions.get(m.chat) || { lastApi: "" };

    // Definir las APIs disponibles
    const api1 = "https://delirius-apiofc.vercel.app/anime/loli";
    const api2 = "https://delirius-apiofc.vercel.app/anime/lolipc";

    // Alternar entre las dos APIs
    const apiUrl = session.lastApi === api1 ? api2 : api1;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("No se pudo obtener la imagen");

        const imageBuffer = await response.buffer();

        // Cambiar la API para la siguiente vez
        session.lastApi = apiUrl;
        imageSessions.set(m.chat, session);

        // Crear botón para obtener otra imagen
        const buttons = [
            {
                buttonId: `${usedPrefix}loli`,
                buttonText: { displayText: "🔄 Ver otra" },
                type: 1
            }
        ];

        await conn.sendMessage(
            m.chat,
            {
                image: imageBuffer,
                caption: " Aquí tienes tu imagen",
                buttons: buttons,
                viewOnce: true
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, "❌ Error al obtener la imagen", m);
    }
};

// Asignar comando "girls"
imageHandler.command = /^loli$/i;

export default imageHandler;




import fetch from "node-fetch"
import axios from "axios"

const formatAudio = ['mp3', 'm4a', 'webm', 'aac', 'flac', 'opus', 'ogg', 'wav']

const ddownr = {
  download: async (url, format) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }

    try {
      const response = await axios.request(config)
      if (response.data && response.data.success) {
        const { id } = response.data
        const downloadUrl = await ddownr.cekProgress(id)
        return downloadUrl
      } else {
        throw new Error('⚠️ Fallo al obtener detalles del video.')
      }
    } catch (error) {
      throw error
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }

    try {
      for (let i = 0; i < 15; i++) { // Máximo 15 intentos (≈ 22s)
        const response = await axios.request(config)
        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url
        }
        await new Promise(resolve => setTimeout(resolve, 1500)) // Espera reducida
      }
      throw new Error("⏳ Tiempo de espera agotado.")
    } catch (error) {
      throw error
    }
  }
}

const handler = async (m, { conn, text, command }) => {
  try {
    const args = text.trim().split(' ')
    const url = args[0]
    const format = args[1] || 'mp3'

    if (!url) return conn.reply(m.chat, `🚩 Ingresa la URL de un video de YouTube.\n\n*Ejemplo:* .${command} https://youtu.be/ID`, m)

    const isValidUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url)
    if (!isValidUrl) return m.reply('❌ URL inválida. Asegúrate de que sea un enlace de YouTube.')

    if (!formatAudio.includes(format.toLowerCase())) {
      return m.reply(`🚫 Formato no soportado. Formatos válidos: ${formatAudio.join(', ')}`)
    }

    await m.react('⏳')

    const downloadUrl = await ddownr.download(url, format)

    if (downloadUrl) {
      await conn.sendMessage(m.chat, {
        document: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `YouTube Audio - ${format.toUpperCase()}.mp3`,
        caption: `✅ *Descarga completada:*\nFormato: *${format.toUpperCase()}*`
      }, { quoted: m })
      await m.react('✅')
    } else {
      await m.react('❌')
      return m.reply(`⚠️ No se pudo obtener el enlace de descarga.`)
    }
  } catch (error) {
    await m.react('❌')
    return m.reply(`💥 Ocurrió un error: ${error.message}`)
  }
}

handler.command = handler.help = ['ytmp3doc', 'doc']
handler.tags = ['downloader']
export default handler