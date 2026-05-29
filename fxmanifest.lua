fx_version 'cerulean'
game 'gta5'
lua54 'yes'
name "krs_phone"
description "krs_phone"
author "Krs Store - karos7804"
version "1.0.0"

shared_scripts {
  "@ox_lib/init.lua",
  "shared/**/*.lua",
  'bridge/framework.lua'
}

client_scripts {
  "client/**/*.lua"
}

server_scripts {
  '@oxmysql/lib/MySQL.lua',
  "server/**/*.lua",
}

ui_page "web/build/index.html"

files {
"web/build/index.html",
  "web/build/**/*",
  'web/images/*.png',
  'web/images/wallpaper/default.png',
  'web/images/start/logo.png',
  'web/images/avatar.png',
  'web/sound/notify/notify.mp3',

  'web/sound/notify/*.mp3',
  'web/sound/ringtones/*.mp3',
  'web/sound/call/*.mp3',
}