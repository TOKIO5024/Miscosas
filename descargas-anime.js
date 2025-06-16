import fetch from "node-fetch";

// Mapa para llevar el control de las sesiones
let imageSessions = new Map();

const imageHandler = async (m, { conn, command, usedPrefix }) => {
    // Obtener sesión de la conversación
    let session = imageSessions.get(m.chat) || { lastApi: "" };

    // Definir las APIs disponibles
    const api1 = "https://img.loliapi.com/i/pp/img208.webp";
    const api2 = "https://cdn.nekos.life/fox_girl/foxgirl_39.png";

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
                buttonId: `${usedPrefix}girls`,
                buttonText: { displayText: "🔄 Ver otra" },
                type: 1
            }
        ];

        await conn.sendMessage(
            m.chat,
            {
                image: imageBuffer,
                caption: "🔞 Aquí tienes tu imagen",
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
imageHandler.command = /^girls$/i;

export default imageHandler;