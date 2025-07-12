// Editado y arreglado por github.com/Ado-rgb
import axios from 'axios'
import { generateWAMessageContent, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      '📌 Por favor, indique el término que desea buscar. Ejemplo:\n*.wallpaper naturaleza*',
      m
    )
  }

  await m.react('🕒')
  await conn.reply(m.chat, '> Buscando imágenes, por favor espere...', m)

  const apiUrl = `https://delirius-apiofc.vercel.app/search/wallpapers?q=${encodeURIComponent(text)}`
  try {
    const { data } = await axios.get(apiUrl)
    const results = data?.data || []

    if (!results.length) {
      return conn.reply(
        m.chat,
        `⚠️ No se encontraron resultados para el término: *${text}*`,
        m
      )
    }

    const cards = []
    const namebot = global.namebot || 'Asistente'

    for (const [i, item] of results.entries()) {
      if (i >= 5) break

      const imageUrl = item.image
      const link = item.thumbnail?.startsWith('http') ? item.thumbnail : imageUrl

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `Resultado ${i + 1}: ${item.title}`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: namebot
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: item.title,
          hasMediaAttachment: true,
          imageMessage: await createImageMsg(imageUrl, conn)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [{
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
              display_text: '🔥 Ver imagen completa',
              url: link
            })
          }]
        })
      })
    }

    const carousel = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: `🖼️ Resultados encontrados para: *${text}*`
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
              text: 'Actuales Resultados'
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards
            })
          })
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, carousel.message, { messageId: carousel.key.id })

  } catch (err) {
    console.error('[Wallpaper Error]:', err)
    conn.reply(
      m.chat,
      '❌ Ha ocurrido un error al procesar la solicitud. Intente nuevamente más tarde.',
      m
    )
  }
}

async function createImageMsg(url, conn) {
  const { imageMessage } = await generateWAMessageContent({
    image: { url }
  }, { upload: conn.waUploadToServer })
  return imageMessage
}

handler.command = ['wallpaper']
handler.help = ['wallpaper <término>']
handler.tags = ['search']
handler.register = true

export default handler