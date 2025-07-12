import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

const tags = {
  serbot: '🛜 𝙎𝙐𝘽-𝘽𝙊𝙏𝙎',
  eco: '💰 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼', 
  downloader: '⬇️ 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼',
  tools: '🧰 𝙃𝙀𝙍𝘼𝙈𝙄𝙀𝙉𝙏𝘼𝙎',
  owner: '👑 𝘾𝙍𝙀𝘼𝘿𝙊𝙍',
  info: '📚 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊𝙉',
  gacha: '🎲 𝙂𝘼𝘾𝙃𝘼 𝘼𝙉𝙄𝙈𝙀', 
  group: '👥 𝙂𝙍𝙐𝙋𝙊',
  search: '🔎 𝘽𝙐𝙎𝙌𝙀𝘿𝘼',
  sticker: '🎨 𝙎𝙏𝙄𝘾𝙆𝙀𝙍',
  ia: '🤖 𝙄𝘼',
  channel: '📢 𝘾𝘼𝙉𝘼𝙇𝙀𝙎' 
}

const defaultMenu = {
  before: `
┏━━━━━━━━━━━━━━━━━━┓
┃  🤖 *%botname* [ %tipo ]
┃  👤 𝙃𝙤𝙡𝙖, *%name*
┃  ⏱️ 𝘼𝙘𝙩𝙞𝙫𝙤 𝙃𝙖𝙘𝙚: *%uptime*
┃  📅 𝙁𝙚𝙘𝙝𝙖: *%date*
┗━━━━━━━━━━━━━━━━━━┛

🔰 Personaliza tu subbot:
  • .setname
  • .setbanner

> Más info Sobre GonBotv1:
  https://erenxsit.vercel.app

── ⬤𝙈𝙀𝙉𝙐 𝘿𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊⬤ ──
%readmore`.trimStart(),

  header: '\n╭─「 %category 」',
  body: '│ ✎ %cmd %islimit %isPremium',
  footer: '╰───────────────',
  after: '\n 📌 ᴅᴇsᴀʀᴏʟʟᴀᴅᴏ ᴘᴏʀ ᴘʀᴏʏᴇᴄᴛ ɢᴏɴʙᴏᴛᴠ1',
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const { exp, limit, level } = global.db.data.users[m.sender]
    const { min, xp, max } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const d = new Date(Date.now() + 3600000)
    const locale = 'es'
    const date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
      }))

    let nombreBot = global.namebot || 'Bot'
    let bannerFinal = 'https://cdn.russellxz.click/0e418398.png'

    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const tipo = botActual === '+573147172161'.replace(/\D/g, '') ? 'Bot Principal 🟢' : 'Sub Bot 🟡'
    const menuConfig = conn.menu || defaultMenu

    const _text = [
      menuConfig.before,
      ...Object.keys(tags).map(tag => {
        return [
          menuConfig.header.replace(/%category/g, tags[tag]),
          help.filter(menu => menu.tags?.includes(tag)).map(menu =>
            menu.help.map(helpText =>
              menuConfig.body
                .replace(/%cmd/g, menu.prefix ? helpText : `${_p}${helpText}`)
                .replace(/%islimit/g, menu.limit ? '🔒' : '')
                .replace(/%isPremium/g, menu.premium ? '💎' : '')
            ).join('\n')
          ).join('\n'),
          menuConfig.footer
        ].join('\n')
      }),
      menuConfig.after
    ].join('\n')

    const replace = {
      '%': '%',
      p: _p,
      botname: nombreBot,
      taguser: '@' + m.sender.split('@')[0],
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      level,
      limit,
      name,
      date,
      uptime: clockString(process.uptime() * 1000),
      tipo,
      readmore: readMore,
      greeting,
    }

    const text = _text.replace(
      new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'),
      (_, name) => String(replace[name])
    )

    const imageContent = { image: { url: bannerFinal } }

    await conn.sendMessage(m.chat, {
      ...imageContent,
      caption: text.trim(),
      mentionedJid: conn.parseMention(text)
    }, { quoted: m })

  } catch (e) {
    console.error('❌ Error en el menú:', e)
    conn.reply(m.chat, '❎ Error al mostrar el menú.', m)
  }
}

handler.command = ['menu', 'help', 'menú']
handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

const ase = new Date()
let hour = ase.getHours()

const greetingMap = {
  0: 'una noche tranquila 🌙', 1: 'una noche tranquila 🌌', 2: 'una noche relajada 🌠',
  3: 'una madrugada fresca 🌙', 4: 'una madrugada estrellada ✨', 5: 'una mañana radiante 🌅',
  6: 'una mañana brillante 🌄', 7: 'una mañana activa ☕', 8: 'una mañana positiva 💫',
  9: 'un día genial 🌞', 10: 'un día productivo 💼', 11: 'un día lleno de energía ⚡',
  12: 'una tarde soleada ☀️', 13: 'una tarde creativa 🎨', 14: 'una tarde inspiradora 📖',
  15: 'una tarde relajada 🧘', 16: 'una tarde activa 🏃', 17: 'una tarde luminosa 🌇',
  18: 'una noche calmada 🌃', 19: 'una noche bonita 🌙', 20: 'una noche encantadora 🌌',
  21: 'una noche serena 🌙', 22: 'una noche mágica 🌠', 23: 'una noche pacífica 🌃'
}
var greeting = 'espero que tengas ' + (greetingMap[hour] || 'un excelente día')