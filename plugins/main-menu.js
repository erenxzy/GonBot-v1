const handler = async (m, { conn }) => {
  try {
    const name = await conn.getName(m.sender)
    const date = new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
    const uptime = clockString(process.uptime() * 1000)
    const nombreBot = global.namebot || 'Bot'
    const tipo = conn.user?.jid?.includes('3147172161') ? 'Bot Principal 🟢' : 'Sub Bot 🟡'
    const bannerURL = 'https://cdn.russellxz.click/0e418398.png' // Cambia esta URL si deseas

    let text = `
── ⬤𝙈𝙀𝙉𝙐 𝘿𝙀 𝘾𝙊𝙈𝘼𝙉𝘋𝙊⬤ ──

╭─「 🔰 𝙎𝙐𝘽-𝘽𝙊𝙏𝙎 」
│ ✎ .bots  
│ ✎ .qr  
│ ✎ .code  
│ ✎ .setbanner  
│ ✎ .setname  
│ ✎ .sublist  
╰───────────────

╭─「 💰 𝙀𝘾𝙊𝙉𝙊𝙈𝙄𝘼 」
│ ✎ .bal  
│ ✎ .eboard  
│ ✎ .crimen  
│ ✎ .depositar  
│ ✎ .slut  
│ ✎ .unreg  
│ ✎ .work  
╰───────────────

╭─「 📥 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼 」
│ ✎ .play  
│ ✎ .tiktokvid  
│ ✎ .tiktok <enlace>  
│ ✎ .play2  
│ ✎ .ytv  
│ ✎ .ytmp4  
│ ✎ .playaudio  
│ ✎ .mp4  
│ ✎ .ytmp4doc  
│ ✎ .ig <url>  
╰───────────────

╭─「 🧰 𝙃𝙀𝙍𝘼𝙈𝙄𝙀𝙉𝙏𝘼𝙎 」
│ ✎ .lid 
│ ✎ .gemini 
│ ✎ .hd  
│ ✎ .deepseek  
│ ✎ .ss <página web>  
│ ✎ .tourl  
╰───────────────

╭─「 👑 𝘾𝙍𝙀𝘼𝘿𝙊𝙍 」
│ ✎ .dsowner  
│ ✎ .sendmeme  
│ ✎ .update  
╰───────────────

╭─「 📚 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊𝙉 」
│ ✎ .creador  
│ ✎ .servers  
│ ✎ .sugerir < cosas pal botsito >  
╰───────────────

╭─「 🎲 𝙂𝘼𝘾𝙃𝘼 𝘼𝙉𝙄𝙈𝙀 」
│ ✎ .c  
│ ✎ .harem < @usuario >  
│ ✎ .rw  
╰───────────────

╭─「 👥 𝙂𝙍𝙐𝙋𝙊 」
│ ✎ .on welcome  
│ ✎ .off welcome  
│ ✎ .on antilink  
│ ✎ .off antilink  
│ ✎ .kick  
│ ✎ .personalidad  
│ ✎ .top *<texto>*  
│ ✎ .invocar *<mensaje opcional>*  
╰───────────────

╭─「 🔎 𝘽𝙐𝙎𝙌𝙐𝙀𝘿𝘼 」
│ ✎ .imagen *<búsqueda>*  
│ ✎ .pinterest  
│ ✎ .tiktoksearch  
│ ✎ .yts
│ ✎ .animeinfo  
╰───────────────

╭─「 🖼️ 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 」
│ ✎ .sticker  
│ ✎ .stickersearch *<texto>*  
│ ✎ .toimg (reply)  
╰───────────────

╭─「 🤖 𝙄𝘼 」
│ ✎ .adonix <pregunta>  
│ ✎ .dalle <texto>  
│ ✎ .iavoz <texto>  
│ ✎ .ask  
╰───────────────

╭─「 📢 𝘾𝘼𝙉𝘼𝙇𝙀𝙎 」
│ ✎ .nuevafotochannel  
│ ✎ .nosilenciarcanal  
│ ✎ .silenciarcanal  
│ ✎ .noseguircanal  
│ ✎ .seguircanal  
│ ✎ .avisoschannel  
│ ✎ .resiviravisos  
│ ✎ .inspect  
│ ✎ .inspeccionar  
│ ✎ .eliminarfotochannel  
│ ✎ .reactioneschannel  
│ ✎ .reaccioneschannel  
│ ✎ .nuevonombrecanal  
│ ✎ .nuevadescchannel  
╰───────────────

📌 ᴅᴇsᴀʀʀᴏʟʟᴀᴅᴏ ᴘᴏʀ ᴘʀᴏʏᴇᴄᴛ ɢᴏɴʙᴏᴛᴠ1`.trim()

    await conn.sendMessage(m.chat, {
      image: { url: bannerURL },
      caption: text,
      mentions: [m.sender]
    }, { quoted: m })

  } catch (e) {
    console.error('❌ Error en el menú:', e)
    conn.reply(m.chat, '❎ Error al mostrar el menú.', m)
  }
}

handler.command = ['menu', 'menú', 'help']
export default handler

function clockString(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}