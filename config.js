import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'


global.owner = [
  ['18493907272', '𝙀𝙍𝙀𝙉𝙓𝙎𝙕𝙔', true],
  ['573001533523', 'DᴇᴠBʀᴀʏᴀɴ', true],
  ['50489513153', '𝖢𝗁𝗈𝗅𝗂𝗍𝗈 𝗑𝗒𝗓', true], 
  ['50248019799', 'Neo', true],
  ['50493732693', 'Ado', true],
  ['31375424024748', 'Cholito', true],
]


global.mods = []
global.prems = []

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = 'GonBotQr'
global.namebot = 'ɢᴏɴ-ʙᴏᴛᴠ1'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

global.packname = 'ɢᴏɴ-ᴠ1'
global.namebot = 'ɢᴏɴʙᴏᴛ-ᴠ1'
global.author = '© ᴍᴀᴅᴇ ʙʏ ᴘʀᴏʏᴇᴄᴛ ɢᴏɴ-ᴠ1'
global.moneda = 'Dolar'
global.canalreg = '120363417252896376@newsletter'

global.namecanal = 'Gᴏɴ-ʙᴏᴛᴠ1 ᴘʀᴏʏᴇᴄᴛ '
global.canal = 'https://whatsapp.com/channel/0029Vb5pM031CYoMvQi2I02D'
global.idcanal = '120363417252896376@newsletter'

global.ch = {
ch1: '120363417252896376@newsletter',
}

global.multiplier = 69 
global.maxwarn = '2'


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
