require(`./Sennsettings.js`)
const { default: makeWASocket, DisconnectReason, downloadContentFromMessage, useSingleFileAuthState, jidDecode, areJidsSameUser, makeInMemoryStore } = require('@adiwajshing/baileys')
const { state } = useSingleFileAuthState('./senn.json')
const PhoneNumber = require('awesome-phonenumber')
const fs = require('fs')
const pino = require('pino')
const FileType = require('file-type')
const { Boom } = require('@hapi/boom')
const { smsg } = require('./db/myfunc')
const chalk = require('chalk')
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) }
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

const connectToWhatsApp = () => {
const Sennxyz = makeWASocket({ logger: pino ({ level: 'silent' }), printQRInTerminal: true, auth: state, browser: ["SennNoCounter", "Dekstop", "3.0"]})
console.log(color('[ SC CPANEL X PUSH BY SennOFFC ]\n', 'aqua'),color('\nINFO SCRIPT :\n⇒ CREATOR : SennOFFC\n⇒ NO CREATOR : 08857979027754\n⇒ BUY SCRIPT CHAT NOMOR DI ATAS', 'yellow'))

store.bind(Sennxyz.ev)

Sennxyz.ev.on('messages.upsert', async chatUpdate => {
try {
m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (!Sennxyz.public && !m.key.fromMe && chatUpdate.type === 'notify') return
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
msg = smsg(Sennxyz, m, store)
require('./Senn')(Sennxyz, msg, chatUpdate, store)
} catch (err) {
console.log(err)}})

Sennxyz.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') { lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? connectToWhatsApp() : ''}
else if (connection === 'open') {
Sennxyz.sendMessage(nomorOwner + "@s.whatsapp.net", {text:`𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗\n [ 𝗦𝗖𝗥𝗜𝗣𝗧 𝗕𝗬 𝗦𝗘𝗡𝗡 𝗢𝗙𝗙𝗖 ]\n\n𝗠𝗔𝗦𝗨𝗞 𝗞𝗘 𝗚𝗥𝗨𝗣 𝗣𝗔𝗡𝗡𝗘𝗟 𝗞𝗨\n\n*GC PANEL 1 :*\nhttps://chat.whatsapp.com/H5F0F8bJjStD0dixLvteu\n*GC PANEL 2 :*\nhttps://chat.whatsapp.com/CESJ01VcKPNFjoRGfWvvP\n*GC PANEL 3 :*\nhttps://chat.whatsapp.com/DfWNzGINEGp7ufbyxx4eZ`})}
console.log(update)})

Sennxyz.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

Sennxyz.ev.on('contacts.update', update => {
for (let contact of update) {
let id = Sennxyz.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

Sennxyz.getName = (jid, withoutContact  = false) => {
id = Sennxyz.decodeJid(jid)
withoutContact = Sennxyz.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = Sennxyz.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === Sennxyz.decodeJid(Sennxyz.user.id) ?
Sennxyz.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

Sennxyz.public = true

Sennxyz.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

Sennxyz.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

const { getImg } = require('./db/functions')

Sennxyz.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getImg(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await Sennxyz.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

Sennxyz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getImg(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await Sennxyz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

Sennxyz.sendButMessage = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options
}
Sennxyz.sendMessage(jid, buttonMessage, { quoted, ...options })
}

}

connectToWhatsApp()