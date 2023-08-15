const chalk = require("chalk")
const fs = require("fs")

global.ownerNumber = ["62857979027754@s.whatsapp.net"]
global.nomerOwner = "62857979027754"
global.nomorOwner = ['62857979027754']
global.OwnerName = "SENN OFFC"
global.BotName = "SENN OFFC"

// IMAGE
global.thumb = fs.readFileSync('./thumb.jpg')

// GLOBAL MESS
global.mess = {
   owner: "Lu Siapa Blok*",
   proses: "Wet Otw Su",
   sukses: "*⌜ DONE ⌟*\nSucces Mas",
   group: "Khusus Di Group",
   priv: "Khusus Di Private Chat",
   inf: "*[ SCRIPT BY SENNOFFC ]*\n\n> MAU BELI SC NYA?\n>SC NYA GAK DI JUAL 😁\nTAPI KALO DI TAKE GANJA GAS\n\n- KEUNTUNGAN :\n> BISA PUSH KONTAK\n> BISA JPM + GAMBAR\n> JPM TANPA CAPE CUMA LEWAT BOT\n> BISA SAVE KONTAK LEWAT ID\n> BISA CREATE PANEL OTOMATIS\n\n*MINAT? CHAT WA DI BAWAH*\n_wa.me/62857979027754_"
}
let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})