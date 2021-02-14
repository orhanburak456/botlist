const Discord = require('discord.js');
const client = new Discord.Client()
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const { Client, Util } = require('discord.js');
const fs = require('fs');
const express = require('express');

const db = require('wio.db');


var prefix = ayarlar.prefix;

let boteklemekanalı = "BOT EKLEME KANALI ID"
let logkanalı = "LOG KANALI ID"
let onaylıbotrol = "ONAYLI BOT ROLÜ"
let onaylıgeliştirici = "ONAYLI GELİŞTİRİCİ ROLÜ"

client.on('ready', () => {
client.user.setActivity(`${prefix}botekle`)
})

client.on('message', message => {
  if(!message.content.startsWith(`${prefix}botekle`)) return;
  let msg = message

  message.delete()
const args = message.content.slice(prefix.length + 7).trim().split(' ');
  const hataembed = new Discord.MessageEmbed()
  .setDescription(`${msg.author} **Bu komutun kullanımı, bu kanalda engellenmiştir. \nKullanılması gereken kanal <#${boteklemekanalı}>!**`)
  .setColor("RED")

  if (msg.channel.id !== `${boteklemekanalı}`) return msg.channel.send(hataembed).then(async msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 5000);
   })

    let varmı = db.fetch(`bot-${message.author.id}`)
    if (varmı) return message.reply("Zaten Sisteme 1 Adet Bot Eklemişsiniz.").then(async msg => {
      setTimeout(() => {
          msg.delete();
      }, 5000);
})
    let botid = args[0]
    let btoprefix = args[1]
    let dbl = args[2]
    if(!botid) return message.reply("Bir Bot ID'si girin!").then(async msg => {
      setTimeout(() => {
          msg.delete();
      }, 5000);
})
    if(!btoprefix) return message.reply("Bir prefix girin!").then(async msg => {
      setTimeout(() => {
          msg.delete();
      }, 5000);
})
    if(!dbl) return message.reply("DBL onay durumunuzu girin!").then(async msg => {
      setTimeout(() => {
          msg.delete();
      }, 5000);
})
    const Embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setDescription(`
    **Bot Başvurusu Alındı!**
    Bot Sahibi: ${message.author}
    Sahip ID: ${message.author.id}
    Bot: <@${botid}>
    Bot ID: ${botid}
    Prefix: ${btoprefix}
    DBL Onay Durumu: ${dbl}
    [0 perm link](https://discord.com/oauth2/authorize?client_id=${botid}&scope=bot&permissions=0) | [8 perm link](https://discord.com/oauth2/authorize?client_id=${botid}&scope=bot&permissions=8)
    `);
    db.set(`bot-${message.author.id}`, botid)
    db.set(`bot-${botid}`, message.author.id)
    
    message.reply("Bot Başvurunuz Alındı!").then(async msg => {
      setTimeout(() => {
          msg.delete();
      }, 5000);
})
    let log = client.channels.cache.get(logkanalı)
    log.send(`<@${message.author.id}>`)
    .then(nmsg => nmsg.edit(Embed))  
})

client.on('message', message => {
  if(!message.content.startsWith(`${prefix}onayla`)) return;
  if(message.author.id !== ayarlar.sahip) return;
  let prefix = ayarlar.prefix
const args = message.content.slice(prefix.length + 6).trim().split(' ');
  let botid = args[0]
  if(!botid) return message.reply("Bir Bot ID'si girin!");
  let bot = db.fetch(`bot-${botid}`)
  if(!bot) message.reply("Böyle bir bot bulunamadı.")
  let kllancı = client.users.cache.get(bot)
  const Embed = new Discord.MessageEmbed()
  .setColor("GREEN")
  .setDescription(`
  **Bot Onaylandı!**
  Bot Sahibi: ${kllancı}

  Bot: <@${botid}>

  `);

  let botcuk = message.guild.members.cache.get(botid);
  botcuk.roles.add(onaylıbotrol)
  kllancı.roles.add(onaylıgeliştirici)
  kllancı.send("Botunuz Onaylandı!")
  let log = client.channels.cache.get(logkanalı)
  log.send(`<@${kllancı.id}>`)
  .then(nmsg => nmsg.edit(Embed))
})

client.on('message', message => {
  if(!message.content.startsWith(`${prefix}reddet`)) return;
  if(message.author.id !== ayarlar.sahip) return;
  let prefix = ayarlar.prefix
const args = message.content.slice(prefix.length + 6).trim().split(' ');
  let botid = args[0]
  let reason = args.slice(1).join(" ")
  if(!reason) reason = "Belirtilmemiş"
  if(!botid) return message.reply("Bir Bot ID'si girin!");
  let bot = db.fetch(`bot-${botid}`)
  if(!bot) message.reply("Böyle bir bot bulunamadı.")
  let kllancı = client.users.cache.get(bot)
  const Embed = new Discord.MessageEmbed()
  .setColor("RED")
  .setDescription(`
  **Bot Reddedildi!**
  Bot Sahibi: ${kllancı}
  Bot: <@${botid}>
  Sebep: ${reason}
  `);
 
  kllancı.send(`Botunuz Reddedildi, Sebep: ${reason}`)
  let log = client.channels.cache.get(logkanalı)
  log.send(`<@${kllancı.id}>`)
  .then(nmsg => nmsg.edit(Embed))
})

client.on('message', message => {
  let msg = message
  if(!message.content.startsWith(`${prefix}reboot`)) return;
  if(message.author.id !== ayarlar.sahip) return;
msg.channel.send(`${client.user.username} yeniden başlatılıyor...`).then(msg => {
console.log(`BOT: Bot yeniden başlatılıyor...`);
process.exit(0);
})
})


var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);