let handler = async (m, { conn }) => {
  let name = 'ᴅᴀɴɪ'
  let number = '18493907272' // sin @ ni nada

  // Crear vCard de contacto
  let vcard = `
BEGIN:VCARD
VERSION:3.0
N:${name}
FN:${name}
TEL;type=CELL;type=VOICE;waid=${number}:${number}
END:VCARD
`.trim()

  // Enviar contacto como tarjeta
  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [
        {
          vcard,
        },
      ],
    },
  }, { quoted: m })

  // Enviar mensaje adicional elegante
  await conn.sendMessage(m.chat, {
    text: `
━━ 𝙄𝙉𝙁𝙊 𝘿𝙀 𝙈𝙄 𝘾𝙍𝙀𝘼𝘿𝙊𝙍 👨🏻‍💻 ━━

📝 *Nombre:* ${name}
📲 *Número:* wa.me/${number}
🔰 *Proyecto:* Modificador De Bots De WhatsApp Y Creador De Webs Y más 

📬 Puedes escribirle si necesitas ayuda o soporte técnico.
`.trim()
  }, { quoted: m })
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['creador', 'owner', 'creator']

export default handler