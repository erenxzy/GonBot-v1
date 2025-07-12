console.log('Michi Wa Bot ...')

import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

cfonts.say('The - Proyect GonBot', {
  font: 'block',
  align: 'center',
  gradient: ['whiteBright', 'white']
})

cfonts.say('GonBot-V1', {
  font: 'simple',
  align: 'center',
  gradient: ['red', 'white']
})

let isWorking = false

async function launch(scripts) {
  if (isWorking) return
  isWorking = true

  for (const script of scripts) {
    const args = [join(__dirname, script), ...process.argv.slice(2)]

    setupMaster({
      exec: args[0],
      args: args.slice(1),
    })

    let child = fork()

    child.on('exit', (code) => {
      isWorking = false
      launch(scripts)

      if (code === 0) return
      watchFile(args[0], () => {
        unwatchFile(args[0])
        launch(scripts)
      })
    })
  }
}

launch(['main.js'])