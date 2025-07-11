import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender)
  const pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://files.catbox.moe/04ujgk.jpg')
  const user = global.db.data.users[m.sender]
  const name2 = await conn.getName(m.sender)
  const fecha = moment().tz('America/Tegucigalpa').toDate()
  const moneda = global.moneda || '💰'
  const reinoEspiritual = global.canalreg || null

  // Asignar valores por defecto si no existen
  if (user.coin === undefined) user.coin = 0
  if (user.exp === undefined) user.exp = 0
  if (user.joincount === undefined) user.joincount = 0

  if (user.registered) {
    return m.reply(
      `🔒 𝙔𝘼 𝙀𝙎𝙏𝘼𝙎 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝘼𝘿𝙊 𝙀𝙉 𝙈𝙄 𝘽𝘼𝙎𝙀 𝘿𝙀 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊 📄

¿Deseas reiniciar tu registro?
➪ Usa: ${usedPrefix}unreg para eliminar tu registro actual`
    )
  }

  if (!Reg.test(text)) {
    return m.reply(
      `❗ Formato incorrecto

➪ Usa: ${usedPrefix + command} nombre.edad
➪ Ejemplo: ${usedPrefix + command} ${name2}.16`
    )
  }

  let [_, name, __, age] = text.match(Reg)

  if (!name) return m.reply('⚠︎ El nombre no puede estar vacío')
  if (!age) return m.reply('⚠︎ La edad es obligatoria')
  if (name.length >= 100) return m.reply('⚠︎ El nombre es demasiado largo')

  age = parseInt(age)
  if (age > 1000) return m.reply('⚠︎ Edad no válida')
  if (age < 13) return m.reply('⚠︎ Debes tener al menos 13 años para registrarte')

  user.name = name.trim()
  user.age = age
  user.regTime = +new Date()
  user.registered = true
  user.coin += 46
  user.exp += 310
  user.joincount += 25

  const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  const certificadoPacto = `
❐ 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊 𝘾𝙊𝙉 𝙀𝙓𝙄𝙏𝙊  ❐

➪ 𝙉𝙊𝙈𝘽𝙍𝙀 : *${name}*
➪ 𝙀𝘿𝘼𝘿: *${age}*
➪ 𝙏𝙐 𝙄𝘿 𝙐𝙉𝙄𝘾𝙊: *${sn}*
➪ 𝙁𝙀𝘾𝙃𝘼: *${fecha.toLocaleDateString()}*
`.trim()

  await m.react('✅')

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: certificadoPacto
  }, { quoted: m })

  if (reinoEspiritual) {
    const mensajeNotificacion = `
☄︎✦❀ 〘 *Nuevo Registro* 〙❀✦☄︎

☄︎ Nombre: *${name}*
☁︎ Edad: *${age}*
✦ ID: *${sn}*
✦ Fecha: *${moment().format('YYYY-MM-DD HH:mm:ss')}*

❀ Recompensas ❀
${moneda}: *+46*`.trim()

    try {
      if (global.conn?.sendMessage) {
        await global.conn.sendMessage(reinoEspiritual, {
          image: { url: pp },
          caption: mensajeNotificacion
        })
      }
    } catch (e) {
      console.error('❌ Error enviando notificación de registro:', e)
    }
  }
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler