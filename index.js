console.log('Starting up at ' + new Date())
const Discord = require('discord.js')
const fs = require('fs')
const Hashmap = require('hashmap')

const _application = require('./application')
const _data = require('./data')
const _prompts = require('./prompts')

const client = new Discord.Client({shardCount: 1})
const endpoints = {
  prefix: ';',
  Discord: process.env.Discord
}
const prompts = {
  names: new Hashmap(),
  languages: new Hashmap(),
  translations: new Hashmap()
}
let cache = { first: undefined, second: undefined }
let notAllowed
let nt
let prompt
let permissions

console.log('Initializing available prompts about supported languages')
// Administrations levels: it doesn't contains any translations or alias, options. Just leave options as 'undefined' not 'null'.
prompts.names.set('exec', _prompts.exec)
// Don't initialize 'say' and 'sayd' prompt twice
prompts.names.set('avatar', _prompts.avatar)
prompts.names.set('cat', _prompts.cat)
prompts.names.set('delete', _prompts.delete)
prompts.names.set('help', _prompts.help)
prompts.names.set('library', _prompts.library)
prompts.names.set('neko', _prompts.neko)
prompts.names.set('ping', _prompts.ping)
prompts.names.set('probability', _prompts.probability)
prompts.names.set('say', _prompts.say)
prompts.names.set('sayd', _prompts.sayd)
prompts.names.set('아바타', _prompts.avatar)
prompts.names.set('고양이', _prompts.cat)
prompts.names.set('삭제', _prompts.delete)
prompts.names.set('도움말', _prompts.help)
prompts.names.set('라이브러리', _prompts.library)
prompts.names.set('네코', _prompts.neko)
prompts.names.set('질의', _prompts.ping)
prompts.names.set('확률', _prompts.probability)
// Initialize with ISO country code
cache = ['avatar', 'cat', 'delete', 'exec', 'help', 'library', 'neko', 'ping', 'probability', 'say', 'sayd']
cache.forEach(cached => { prompts.languages.set(cached, 'en') })
cache = ['아바타', '고양이', '삭제', '도움말', '라이브러리', '네코', '질의', '확률']
cache.forEach(cached => { prompts.languages.set(cached, 'ko') })
// Register the translations
cache = {
  avatar: null,
  cat: {
    parse_failed: 'Can not read returned data\n\nFollowing is detail: '
  },
  delete: {
    invaild_parameter: 'Invaild parameter: only data type of int can be vaild and it must smaller then 45'
  },
  exec: undefined,
  help: {
    title: 'Seriumium#2403',
    description: 'by <@324541397988409355> code with heart\n\n[Support server](https://discord.gg/YzBZNQq)\n[Invite Seriumium#2403](https://discordapp.com/api/oauth2/authorize?client_id=429913480708096000&permissions=8&scope=bot)\n[GitHub](https://github.com/seriumium/seriumiumDiscord)\n[Webpage](https://seriumium.github.io)',
    names: {
      seriumium: 'Seriumium',
      moderations: 'Moderations',
      images: 'Images',
      gladsome: 'Gladsome'
    },
    values: {
      seriumium: '`exec` `help` `library` `ping` `say`',
      moderations: '`delete` `sayd`',
      images: '`avatar` `cat` `neko`',
      gladsome: '`probability`'
    }
  },
  library: {
    invaild_string: 'There is no string to search',
    not_found: 'That document was not found on Wikipedia (English)\n\nFollowing is detail: '
  },
  neko: {
    parse_failed: 'Can not read returned data\n\nFollowing is detail: '
  },
  ping: null,
  probability: {
    result: {
      first: 'The probability that ',
      second: ' is ',
      third: '%'
    }
  },
  say: null,
  sayd: null
}
prompts.translations.set('en', cache)
cache = {
  avatar: null,
  cat: {
    parse_failed: '반환된 데이터를 읽을 수 없습니다\n\n자세한 정보는 다음과 같음: '
  },
  delete: {
    invaild_parameter: '잘못된 매개변수: 올바른 데이터형은 int이며 45보다 작아야 합니다'
  },
  exec: undefined,
  help: {
    title: 'Seriumium#2403',
    description: '<@324541397988409355>이 마음과 함께 개발했습니다\n\n[지원 서버](https://discord.gg/YzBZNQq)\n[Seriumium#2403 초대하기](https://discordapp.com/api/oauth2/authorize?client_id=429913480708096000&permissions=8&scope=bot)\n[GitHub](https://github.com/seriumium/seriumiumDiscord)\n[웹페이지](https://seriumium.github.io)',
    names: {
      seriumium: 'Seriumium',
      moderations: '관리',
      images: '이미지',
      gladsome: '재미'
    },
    values: {
      seriumium: '`exec` `도움말` `라이브러리` `질의` `say`',
      moderations: '`삭제` `sayd`',
      images: '`아바타` `고양이` `네코`',
      gladsome: '`확률`'
    }
  },
  library: {
    invaild_string: '찾을 문자열을 인수에서 찾을 수 없습니다',
    not_found: '위키백과(영문)에서 해당 문서를 찾을 수 없습니다\n\n자세한 정보는 다음과 같음: '
  },
  neko: {
    parse_failed: '반환된 데이터를 읽을 수 없습니다\n\n자세한 정보는 다음과 같음: '
  },
  ping: null,
  probability: {
    result: {
      first: '',
      second: ' 확률은 ',
      third: '%이다'
    }
  },
  say: null,
  sayd: null
}
prompts.translations.set('ko', cache)

_application.log(_data.log.initialized)
process.on('unhandledRejection', error => {
  console.error('Uncaught Promise Error: \n' + error.stack)
})

client.login(endpoints.Discord)
client.destroy().then(() => {
  client.login(endpoints.Discord)
})
client.on('ready', () => {
  _application.log(_data.log.signed_in)
  _application.log(_data.log.started_up)
  console.log()
  console.log(client.user.tag)
  client.user.setActivity(';help | seriumium.github.io')
  client.user.setStatus('idle')
})
client.on('message', message => {
  if (message.channel.type === 'dm') return
  if (message.channel.permissionsFor(message.author).has('MANAGE_GUILD')) { permissions = 2 } else { permissions = 0 }
  if (message.author.id === '324541397988409355') permissions = 4
  prompt = prompts.names.get(message.content.split(' ')[0].slice(endpoints.prefix.length))
  notAllowed =
    (message.author.bot)
    || (message.channel.type === 'dm')
    || (!message.content.startsWith(endpoints.prefix))
    || (!prompt)
    || (permissions < prompt.permissions)
  if (notAllowed) { return }
  cache.first = message.content.split(' ')[0].slice(endpoints.prefix.length)
  cache.second = prompts.languages.get(cache.first)
  nt = {
    arguments: message.content.split(' ').slice(1),
    translations: prompts.translations.get(cache.second)
  }
  prompt.execute(client, message, nt)
})
