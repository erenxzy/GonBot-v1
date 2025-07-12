import fs from 'fs';

let handler = async (m, { conn, command }) => {
  const user = global.db.data.users[m.sender];
  const now = new Date() * 1;

  // Recompensas base
  const rand = (max) => Math.floor(Math.random() * max);

  // Tiempos y recompensas por tipo
  const tipos = {
    mina: {
      tiempo: 1800000, // 30 min
      recompensa: () => ({
        piedra: rand(10),
        hierro: rand(5),
        oro: rand(3),
        diamante: rand(2),
      }),
      nombre: '⛏️ Mina normal',
    },
    minaprofunda: {
      tiempo: 3600000, // 1 hora
      recompensa: () => ({
        piedra: rand(20),
        hierro: rand(10),
        oro: rand(6),
        diamante: rand(4),
      }),
      nombre: '⛏️ Mina profunda',
    },
    minarandom: {
      tiempo: 2700000, // 45 min
      recompensa: () => {
        const tipo = ['piedra', 'hierro', 'oro', 'diamante'][rand(4)];
        let cantidad = rand(10) + 1;
        return { [tipo]: cantidad };
      },
      nombre: '❓ Mina aleatoria',
    },
  };

  const tipo = tipos[command];
  if (!tipo) return;

  const lastMine = user[`last_${command}`] || 0;
  if (now - lastMine < tipo.tiempo) {
    let espera = msToTime(tipo.tiempo - (now - lastMine));
    throw `⏳ Aún no puedes usar *${command}*\n🕒 Espera *${espera}*`;
  }

  const premio = tipo.recompensa();
  user[`last_${command}`] = now;

  // Guardar recompensas
  for (let recurso in premio) {
    user[recurso] = (user[recurso] || 0) + premio[recurso];
  }

  let resultado = `${tipo.nombre}\n\n🎁 Recompensas:\n`;
  for (let recurso in premio) {
    const emoji = recurso === 'piedra' ? '🪨' : recurso === 'hierro' ? '⛓️' : recurso === 'oro' ? '🪙' : '💎';
    resultado += `${emoji} ${recurso.charAt(0).toUpperCase() + recurso.slice(1)}: +${premio[recurso]}\n`;
  }

  conn.reply(m.chat, resultado.trim(), m);
};

handler.help = ['mina', 'minaprofunda', 'minarandom'];
handler.tags = ['rpg'];
handler.command = /^mina|minaprofunda|minarandom$/i;

export default handler;

function msToTime(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor((ms % 3600000) / 60000);
  let s = Math.floor((ms % 60000) / 1000);
  return `${h ? h + "h " : ""}${m ? m + "m " : ""}${s + "s"}`;
}
