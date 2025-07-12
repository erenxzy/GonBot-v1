let limit = 300
let handler = async (m, { conn, text, isPrems, isOwner, usedPrefix, command }) => {
  if (!m.quoted) return conn.reply(m.chat, `[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m).then(_ => m.react('✖️'))
  if (!m.quoted.text.includes("P L A Y  -  Y O U T U B E")) return conn.reply(m.chat, `[ ✰ ] Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m).then(_ => m.react('✖️'))

  let urls = m.quoted.text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
  if (!urls) return conn.reply(m.chat, `Resultado no encontrado.`, m).then(_ => m.react('✖️'))
  if (urls.length < text) return conn.reply(m.chat, `Resultado no encontrado.`, m).then(_ => m.react('✖️'))

  let user = global.db.data.users[m.sender]
  await m.react('🕒')

  try {
    let v = urls[0]
    let res = await fetch(`https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(v)}`)
    let json = await res.json()

    if (!json?.result?.video) throw new Error('No se pudo obtener el video.')

    let { title, quality, video, filename } = json.result
    let sizeMB = Math.floor(Math.random() * 20) + 5 // Simulación de peso aleatorio

    if (sizeMB >= limit) return m.reply(`El archivo pesa más de ${limit} MB, se canceló la descarga.`).then(_ => m.react('✖️'))

    await conn.sendFile(m.chat, video, filename || `${title}.mp4`, `*› Título:* ${title}\n*› Calidad:* ${quality}`, m, false, {
      asDocument: user.useDocument
    })

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('✖️')
    await conn.reply(m.chat, `❌ Error al intentar descargar el video.`, m)
  }
}

handler.customPrefix = /^(Video|video|vídeo|Vídeo)/
handler.command = new RegExp
//handler.limit = 1

export default handler
