require('dotenv').config();

const nodeFS = require('fs');

const DiscordJS = require('discord.js');

const mineflayer = require('mineflayer');

const { REST } = require('@discordjs/rest');

const { Routes } = require('discord-api-types/v10');

const importantDIRs = 

{
    handler: './handlers/',
    command: './commands/',
    data: './data/',
    error_log: './error_logs/'
};

const defaultEnvFileLayout =

`DISCORD_BOT_TOKEN=DISCORD_BOT_TOKEN_HERE
INGAME_BOT_EMAIL=INGAME_BOT_EMAIL_HERE
INGAME_BOT_PASSWORD=INGAME_BOT_PASSWORD_HERE`;

const defaultConfigFileLayout = 

{
  discord_bot: {
      guild_id: "1",
      client_id: "1"
  },
  prisons_bot: {
    season: "1"
  },
  discord_channel: {
      global_chat: "1",
      private_message: "1",
      chat_event: "1",
      discord_slash_command_usage: "1",
      giveaway: "1",
      global_booster: "1",
      pve_boss_spawned: "1",
      upcoming_pve_boss: "1",
      dungeon_boss_spawned: "1",
      dungeon_opened: "1",
      upcoming_dungeon: "1",
      beacon_meteor_spawned: "1",
      bloodbath_started: "1",
      upcoming_bloodbath: "1"
  },
  feature: {
      log_global_chat_to_console: "true",
      log_private_message_to_console: "true",
      log_chat_event_to_console: "true",
      log_discord_slash_command_usage_to_console: "true",
      log_global_chat_to_discord: "true",
      log_private_message_to_discord: "true",
      log_chat_event_to_discord: "true",
      log_discord_slash_command_usage_to_discord: "true",
      giveaway: "true",
      global_booster: "true",
      pve_boss_spawned: "true",
      upcoming_pve_boss: "true",
      dungeon_boss_spawned: "true",
      dungeon_opened: "true",
      upcoming_dungeon: "true",
      beacon_meteor_spawned: "true",
      bloodbath_started: "true",
      upcoming_bloodbath: "true",
  },
  role_id: {
      bot_admin: "1",
      bot_trusted: "1",
      bot_verified: "1",
      bot_blacklisted: "1",
      global_booster_ping: "1",
      pve_boss_spawned_ping: "1",
      upcoming_pve_boss_ping: "1",
      dungeon_boss_spawned_ping: "1",
      dungeon_opened_ping: "1",
      beacon_meteor_spawned_ping: "1",
      bloodbath_started_ping: "1"
  }
};

const discordBotIntents = 

[
    DiscordJS.IntentsBitField.Flags.GuildMembers,
    DiscordJS.IntentsBitField.Flags.GuildMessages,
    DiscordJS.IntentsBitField.Flags.Guilds
    
];

const discordBotPartials =

[
    DiscordJS.Partials.Channel,
    DiscordJS.Partials.GuildMember,
    DiscordJS.Partials.Message,
    DiscordJS.Partials.User
];

const chatEvents = 

{
    giveaway: new RegExp(/^([A-Za-z]+) giveaway winners for ([0-9-]+) are ([0-9A-Za-z_*, ]+)/, 'm'),
    global_booster: new RegExp(/^MCHUB \» ([0-9A-Za-z_*]+) has activated a Global ([A-Za-z]+) ([A-Za-z- ]+) \(([0-9a-z ]+)\) booster\!/, 'm'),
    pve_boss_spawned: new RegExp(/^BEACON \» The \[([A-Za-z]+)\] ([A-Za-z ]+) has spawned\! Go to \/warp beacon to defeat it\!/, 'm'),
    upcoming_pve_boss: new RegExp(/^BEACON \» The next boss will spawn in ([0-9]+) beacon mob kills\!/, 'm'),
    dungeon_boss_spawned: new RegExp(/^Dungeons \» The dungeon boss has spawned\! There are ([0-9a-z ]+) left before the dungeon closes\!/, 'm'),
    dungeon_opened: new RegExp(/^Dungeons \» A new dungeon has opened\! You can join the dungeon by typing \/dungeon\!/, 'm'),
    upcoming_dungeon: new RegExp(/^Dungeons \» The next dungeon is scheduled to start in ([0-9a-z ]+)\!/, 'm'),
    beacon_meteor_spawned: new RegExp(/^BEACON \» A meteor has entered the atmosphere and is about to make impact\! Go to \/warp beacon to mine it up\!/, 'm'),
    bloodbath_started: new RegExp(/^BLOODBATH \» Bloodbath has started\! \/warp pvp/, 'm'),
    upcoming_bloodbath: new RegExp(/^BLOODBATH \» The next bloodbath is in ([0-9a-z ]+)\!/, 'm')
};

const discordBot = new DiscordJS.Client({ intents: discordBotIntents, partials: discordBotPartials });

let errorHandler, configValue, prisonsBot, guildID, clientID, handlers = new Map(), bulkChatMessages = new Array();

discordBot.slashCommands = new DiscordJS.Collection();

function doesImportantDIRsExists(){
    console.log('[MCHPB] Loading important directories...');
    try {
        Object.keys(importantDIRs).forEach(importantDIRName => {
            nodeFS.accessSync(importantDIRs[importantDIRName], nodeFS.constants.F_OK);
        });
        return true;
    } catch {
        return false;
    }
}

function doesImportantFilesExists(){
    console.log('[MCHPB] Loading important files...');
    try {

        const defaultHandlerFiles = ['beacon_meteor_spawned.js', 'bloodbath_started.js', 'dungeon_boss_spawned.js', 'dungeon_opened.js', 'error.js', 'giveaway.js', 'global_booster.js', 'leaderboard.js', 'pve_boss_spawned.js', 'schedule_tasks.js', 'upcoming_bloodbath.js', 'upcoming_dungeon.js', 'upcoming_pve_boss.js'];

        const defaultDiscordSlashCommandFiles = ['balance.js', 'help.js', 'leaderboard.js', 'reconnect.js', 'restart.js', 'stats.js', 'sync.js', 'unsync.js'];

        const currentHandlerFiles = nodeFS.readdirSync(importantDIRs.handler, 'utf-8').filter(currentHandlerFilesName => currentHandlerFilesName.endsWith('.js'));

        const currentDiscordSlashCommandFiles = nodeFS.readdirSync(importantDIRs.command, 'utf-8').filter(currentDiscordSlashCommandFilesName => currentDiscordSlashCommandFilesName.endsWith('.js'));
        
        let doesImportantFilesExistsResult = true;

        currentHandlerFiles.forEach(currentHandlerFileName => {
            if(defaultHandlerFiles.includes(currentHandlerFileName) === false){

                doesImportantFilesExistsResult = false;

            }
        });
        defaultHandlerFiles.forEach(defaultHandlerFileName => {
            if(currentHandlerFiles.includes(defaultHandlerFileName) === false){
                
                doesImportantFilesExistsResult = false;

            }
        });
        currentDiscordSlashCommandFiles.forEach(currentDiscordSlashCommandFileName => {
            if(defaultDiscordSlashCommandFiles.includes(currentDiscordSlashCommandFileName) === false){
                
                doesImportantFilesExistsResult = false;

            }
        });
        defaultDiscordSlashCommandFiles.forEach(defaultDiscordSlashCommandFileName => {
            if(currentDiscordSlashCommandFiles.includes(defaultDiscordSlashCommandFileName) === false){
                
                doesImportantFilesExistsResult = false;

            }
        });
        nodeFS.accessSync('package.json', nodeFS.constants.F_OK);
        nodeFS.accessSync('package-lock.json', nodeFS.constants.F_OK);
        nodeFS.accessSync('LICENSE', nodeFS.constants.F_OK);
        return doesImportantFilesExistsResult;
    } catch {
        return false;
    }
}

function doesEnvFileExists(){
    console.log('[MCHPB] Loading .env file...');
    try {
        nodeFS.accessSync('.env', nodeFS.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function generateEnvFile(){
    console.log('[MCHPB] Generating a new .env file...');
    try {
        nodeFS.appendFileSync('.env', defaultEnvFileLayout, 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function isEnvFileValid(){
    console.log('[MCHPB] Validating .env file...');
    try {
        if(process.env.DISCORD_BOT_TOKEN === undefined || process.env.INGAME_BOT_EMAIL === undefined || process.env.INGAME_BOT_PASSWORD === undefined){
            return false;
        } else {
            if(process.env.DISCORD_BOT_TOKEN === 'DISCORD_BOT_TOKEN_HERE' || process.env.INGAME_BOT_EMAIL === 'INGAME_BOT_EMAIL_HERE' || process.env.INGAME_BOT_PASSWORD === 'INGAME_BOT_PASSWORD_HERE'){
                return false;
            } else {
                return true;
            }
        }
    } catch {
        return false;
    }
}

function reformatEnvFile(){
    console.log('[MCHPB] Reformatting .env file...');
    try {
        nodeFS.writeFileSync('.env', defaultEnvFileLayout, 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function doesConfigFileExists(){
    console.log('[MCHPB] Loading config file...');
    try {
        nodeFS.accessSync('config.json', nodeFS.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function generateConfigFile(){
    console.log('[MCHPB] Generating a new config file...');
    try {
        nodeFS.appendFileSync('config.json', JSON.stringify(defaultConfigFileLayout, null, 4), 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function isConfigFileValid(){
    console.log('[MCHPB] Validating config file...');
    try {

        configValue = JSON.parse(nodeFS.readFileSync('config.json', 'utf-8'));

        let isConfigFileValidResult = true, defaultConfigObjects = new Array(), currentConfigObjects = new Array();

        Object.keys(defaultConfigFileLayout).forEach(defaultConfigMainObject => {
            defaultConfigObjects.push(defaultConfigMainObject);
            Object.keys(defaultConfigFileLayout[defaultConfigMainObject]).forEach(defaultConfigSecondaryObject => {
                defaultConfigObjects.push(defaultConfigSecondaryObject);
            });
        });
        Object.keys(configValue).forEach(currentConfigMainObject => {
            currentConfigObjects.push(currentConfigMainObject);
            Object.keys(configValue[currentConfigMainObject]).forEach(currentConfigSecondaryObject => {
                currentConfigObjects.push(currentConfigSecondaryObject);
            });
        });
        currentConfigObjects.forEach(currentConfigObject => {
            if(defaultConfigObjects.includes(currentConfigObject) === false){
                
                isConfigFileValidResult = false;

            }
        });
        defaultConfigObjects.forEach(defaultConfigObject => {
            if(currentConfigObjects.includes(defaultConfigObject) === false){
                
                isConfigFileValidResult = false;

            }
        });
        return isConfigFileValidResult;
    } catch {
        return false;
    }
}

function reformatConfigFile(){
    console.log('[MCHPB] Reformatting config file...');
    try {
        nodeFS.writeFileSync('config.json', JSON.stringify(defaultConfigFileLayout, null, 4), 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function loadEssentials(){
    console.log('[MCHPB] Loading important directories & files...');
    if(doesImportantDIRsExists() === true){
        console.log('[MCHPB] Successfully loaded important directories.');
        if(doesImportantFilesExists() === true){
            console.log('[MCHPB] Successfully loaded important files.');
            if(doesEnvFileExists() === true){
                if(isEnvFileValid() === true){
                    console.log('[MCHPB] Successfully validated .env file.');
                    console.log('[MCHPB] Successfully loaded .env file.');
                    if(doesConfigFileExists() === true){
                        if(isConfigFileValid() === true){
                            console.log('[MCHPB] Successfully validated config file.');
                            console.log('[MCHPB] Successfully loaded config file.');
                            return true;
                        } else {
                            console.log('[MCHPB] Invalid config file!');
                            if(reformatConfigFile() === true){
                                console.log('[MCHPB] Successfully reformatted config file. Please configure it before running prisons bot again.');
                            } else {
                                console.log('[MCHPB] Error occured while reformatting config file! Please reinstall prisons bot.');
                            }
                        }
                    } else {
                        console.log('[MCHPB] Missing config file!');
                        if(generateConfigFile() === true){
                            console.log('[MCHPB] Successfully generated a new config file! Please configure it before running prisons bot again.');
                        } else {
                            console.log('[MCHPB] Error occured while generating a new config file! Please reinstall prisons bot.');
                        }
                    }
                } else {
                    console.log('[MCHPB] Invalid .env file or its configuration!');
                    if(reformatEnvFile() === true){
                        console.log('[MCHPB] Successfully reformatted .env file. Please configure it before running prisons bot again.');
                    } else {
                        console.log('[MCHPB] Error occured while reformatting .env file! Please reinstall prisons bot.');
                    }
                }
            } else {
                console.log('[MCHPB] Missing .env file!');
                if(generateEnvFile() === true){
                    console.log('[MCHPB] Successfully generated a new .env file! Please configure it before running prisons bot again.');
                } else {
                    console.log('[MCHPB] Error occured while generating a new .env file! Please reinstall prisons bot.');
                }
            }
        } else {
            console.log('[MCHPB] Error occured while loading important files! Please reinstall prisons bot.');
        }
    } else {
        console.log('[MCHPB] Error occured while loading important directories! Please reinstall prisons bot.');
    }
    return false;
}

function registerHandlers(){
    console.log('[MCHPB] Registering handlers...');
    try {

        const handlerFiles = nodeFS.readdirSync(importantDIRs.handler, 'utf-8').filter(handlerFilesName => handlerFilesName.endsWith('.js'));

        handlerFiles.forEach(handlerFileName => {

            const handlerFilePath = `${importantDIRs.handler}${handlerFileName}`;

            const handlerFile = require(handlerFilePath);

            handlers.set(handlerFile.data.name, handlerFile);
        });

        errorHandler = handlers.get('error'); 

        return true;
    } catch {
        return false;
    }
}

try {
    if(loadEssentials() === true){
        console.log('[MCHPB] Successfully loaded important directories & files.');    
        if(registerHandlers() === true){
            console.log('[MCHPB] Successfully registered handlers.');
            console.log('[MCHPB] Connecting to the Discord Bot...');
            discordBot.login(process.env.DISCORD_BOT_TOKEN).then(() => {
                console.log('[MCHPB] Connected to the Discord Bot.'); 
            }).catch(discordBotLoginError => {
                console.log('[MCHPB] Error occured while connecting to the Discord Bot! Restarting prisons bot...');
                try {
                    errorHandler.execute(discordBotLoginError, discordBot, prisonsBot);
                    return process.exit(0);
                } catch {
                    console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
                    return process.exit(0);
                }
            });

            prisonsBot = mineflayer.createBot({ host: 'MCHub.COM', version: '1.18.2', username: process.env.INGAME_BOT_EMAIL, password: process.env.INGAME_BOT_PASSWORD, auth: 'microsoft', keepAlive: true, checkTimeoutInterval: 60000 });

        } else {
            console.log('[MCHPB] Error occured while registering handlers! Force restarting prisons bot...');
            return process.exit(0);
        }
    } else {
        console.log('[MCHPB] Error occured while loading important directories & files! Force restarting prisons bot...');
        return process.exit(0);
    }
} catch {
    console.log('[MCHPB] Error occured while starting up prisons bot! Force restarting prisons bot...');
    return process.exit(0);
}

process.on('unhandledRejection', proccessOnUnhandledRejectionError => {
    console.log('[MCHPB] Process Unhandled Rejection! Restarting prisons bot...');
    try {
        errorHandler.execute(proccessOnUnhandledRejectionError, discordBot, prisonsBot);
        return process.exit(0);
    } catch {
        console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
        return process.exit(0);
    }
});

process.on('uncaughtException', proccessOnUncaughtExceptionError => {
    console.log('[MCHPB] Process Uncaught Exception! Restarting prisons bot...');
    try {
        errorHandler.execute(proccessOnUncaughtExceptionError, discordBot, prisonsBot);
        return process.exit(0);
    } catch {
        console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
        return process.exit(0);
    }
});

discordBot.on('error', discordBotOnErrorError => {
    console.log('[MCHPB] Discord Bot Error! Restarting prisons bot...');
    try {
        errorHandler.execute(discordBotOnErrorError, discordBot, prisonsBot);
        return process.exit(0);
    } catch {
        console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
        return process.exit(0);
    }
});

discordBot.on('shardError', discordBotOnShardErrorError => {
    console.log('[MCHPB] Discord Bot Shard Error! Restarting prisons bot...');
    try {
        errorHandler.execute(discordBotOnShardErrorError, discordBot, prisonsBot);
        return process.exit(0);
    } catch {
        console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
        return process.exit(0);
    }
});

prisonsBot.on('error', prisonsBotOnErrorError => {
    console.log('[MCHPB] Prisons Bot Error! Restarting prisons bot...');
    try {
        errorHandler.execute(prisonsBotOnErrorError, discordBot, prisonsBot);
        return process.exit(0);
    } catch {
        console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
        return process.exit(0);
    }
});

prisonsBot.on('kicked', prisonsBotOnKickedError => {
    console.log('[MCHPB] Prisons Bot Kicked! Restarting prisons bot...');
    try {
        errorHandler.execute(prisonsBotOnKickedError, discordBot, prisonsBot);
        return process.exit(0);
    } catch {
        console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
        return process.exit(0);
    }
});

async function isConfigValuesValid(){
    console.log('[MCHPB] Validating config values...');
    try {

        let isConfigValuesValidResult = true, discordBotGuildsID = new Array(), discordBotGuildRolesID = new Array(), discordBotGuildChannelsID = new Array();

        if(typeof Number(configValue.discord_bot.guild_id) !== 'number'){
            return false;
        } else {

            await discordBot.guilds.fetch().then(discordBotGuildsFetchResult => {
                discordBotGuildsFetchResult.forEach(discordBotGuildFetchResult => {
                    discordBotGuildsID.push(discordBotGuildFetchResult.id);
                });
            });
            if(discordBotGuildsID.includes(configValue.discord_bot.guild_id) !== true){
                return false;
            } else {

                guildID = configValue.discord_bot.guild_id;

            }
        }
        if(typeof Number(configValue.discord_bot.client_id) !== 'number'){
            return false;
        } else {
            if(configValue.discord_bot.client_id !== discordBot.user.id){
                return false;
            } else {

                clientID = configValue.discord_bot.client_id;

            }
        }
        await discordBot.guilds.cache.get(configValue.discord_bot.guild_id).channels.fetch().then(discordBotGuildChannelsFetchResult => {
            discordBotGuildChannelsFetchResult.forEach(discordBotGuildChannelFetchResult => {
                discordBotGuildChannelsID.push(discordBotGuildChannelFetchResult.id);
            });
        });
        await discordBot.guilds.cache.get(configValue.discord_bot.guild_id).roles.fetch().then(discordBotGuildRolesFetchResult => {
            discordBotGuildRolesFetchResult.forEach(discordBotGuildRoleFetchResult => {
                discordBotGuildRolesID.push(discordBotGuildRoleFetchResult.id);
            });
        });
        Object.keys(configValue).forEach(configValueMainObject => {
            Object.keys(configValue[configValueMainObject]).forEach(configValueSecondaryObject => {
                switch(configValueMainObject){
                    case 'prisons_bot':
                        if(typeof Number(configValue.prisons_bot.season) !== 'number'){
                            
                            isConfigValuesValidResult = false;

                        }
                        break;
                    case 'discord_channel':
                        if(typeof Number(configValue.discord_channel[configValueSecondaryObject]) !== 'number'){
                            
                            isConfigValuesValidResult = false;
                            
                        } else {
                            if(discordBotGuildChannelsID.includes(configValue.discord_channel[configValueSecondaryObject]) !== true){
                            
                                isConfigValuesValidResult = false;
                                
                            }
                        }
                        break;
                    case 'feature':
                        if(typeof Boolean(configValue.feature[configValueSecondaryObject]) !== 'boolean'){
                            
                            isConfigValuesValidResult = false;
                            
                        }
                        break;
                    case 'role_id':
                        if(typeof Number(configValue.role_id[configValueSecondaryObject]) !== 'number'){
                            
                            isConfigValuesValidResult = false;
                            
                        } else {
                            if(discordBotGuildRolesID.includes(configValue.role_id[configValueSecondaryObject]) !== true){
                            
                                isConfigValuesValidResult = false;
                                
                            }
                        }
                        break;
                }
            });
        });
        return isConfigValuesValidResult;
    } catch(isConfigValuesValidError) {
        console.log('[MCHPB] Error occured while validating config values! Restarting prisons bot...');
        try {
            errorHandler.execute(isConfigValuesValidError, discordBot, prisonsBot);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
}

async function syncDiscordSlashCommands(){
    console.log('[MCHPB] Synchronizing slash commands...');
    try {

        const restAPI = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

        const discordSlashCommandFiles = nodeFS.readdirSync(importantDIRs.command, 'utf-8').filter(discordSlashCommandFilesName => discordSlashCommandFilesName.endsWith('.js'));

        let discordSlashCommands = new Array();

        discordSlashCommandFiles.forEach(discordSlashCommandFileName => {

            const discordSlashCommandFilePath = `${importantDIRs.command}${discordSlashCommandFileName}`;

            const discordSlashCommand = require(discordSlashCommandFilePath);

            discordSlashCommands.push(discordSlashCommand.data.toJSON());
            discordBot.slashCommands.set(discordSlashCommand.data.name, discordSlashCommand);
        });
        await restAPI.put(Routes.applicationGuildCommands(clientID, guildID), { body: discordSlashCommands });
        return true;
    } catch(syncDiscordSlashCommandsError) {
        return syncDiscordSlashCommandsError;
    }
}

discordBot.once('ready', async () => {
    try {
        await isConfigValuesValid().then(async isConfigValuesValidResult => {
            if(isConfigValuesValidResult === true){
                console.log('[MCHPB] Successfully validated config values.');
                await syncDiscordSlashCommands().then(syncDiscordSlashCommandsResult => {
                    if(syncDiscordSlashCommandsResult === true){
                        console.log('[MCHPB] Successfully synchronized slash commands.');
                    } else {
                        console.log('[MCHPB] Error occured while synchronizing slash commands! Restarting prisons bot...');
                        try {
                            errorHandler.execute(syncDiscordSlashCommandsResult, discordBot, prisonsBot);
                            return process.exit(0);
                        } catch {
                            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
                            return process.exit(0);
                        }
                    }
                });
            } else {
                console.log('[MCHPB] Invalid config values! Please make sure you configure the config file correctly.');
                return process.exit(1);
            }
        });
        return;
    } catch(discordBotOnceReadyError) {
        console.log('[MCHPB] Error occured while executing discord bot once ready tasks! Restarting prisons bot...');
        try {
            errorHandler.execute(discordBotOnceReadyError, discordBot, prisonsBot);
            return process.exit(0);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
});

async function logDiscordSlashCommandUsage(discordSlashCommandDetails, discordSlashCommandResult){
    try {

        const discordSlashCommandName = discordSlashCommandDetails.commandName.toUpperCase();

        const discordSlashCommandUserID = discordSlashCommandDetails.member.id;

        switch(discordSlashCommandResult){
            default:

                discordSlashCommandResult = 'ERROR';

                break;
            case true:

                discordSlashCommandResult = 'SUCCESS';

                break;
            case false:

                discordSlashCommandResult = 'FAILED';

                break;
        }
        if(configValue.feature.log_discord_slash_command_usage_to_console === 'true'){
            console.log(`[MCHPB] Discord Slash Command Name: ${discordSlashCommandName} | Discord Slash Command Result: ${discordSlashCommandResult} | Discord Slash Command User's ID: ${discordSlashCommandUserID}`);
        }
        if(configValue.feature.log_discord_slash_command_usage_to_discord === 'true'){

            const discordSlashCommandLogChannelID = configValue.discord_channel.discord_slash_command_usage;

            const discordSlashCommandLogChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(discordSlashCommandLogChannelID).name;

            const discordSlashCommandChannelID = discordSlashCommandDetails.channel.id;

            const discordSlashCommandChannelName = discordSlashCommandDetails.channel.name;

            const discordSlashCommandUserDisplayName = discordSlashCommandDetails.member.displayName;

            const discordSlashCommandUserDisplayAvatarURL = discordSlashCommandDetails.member.displayAvatarURL();

            const discordCommandLogEmbedDescription = 

            `Command Name: ${discordSlashCommandName}
            Command Result: ${discordSlashCommandResult}
            Channel's Name: #${discordSlashCommandChannelName}
            Channel's ID: ${discordSlashCommandChannelID}
            User's Discord Username: ${discordSlashCommandUserDisplayName}
            User's Discord ID: ${discordSlashCommandUserID}`;

            const discordSlashCommandLogEmbed = new DiscordJS.EmbedBuilder()
			.setColor('#4422bf')
			.setTitle('DISCORD SLASH COMMAND USAGE')
			.setDescription(discordCommandLogEmbedDescription)
			.setThumbnail(discordSlashCommandUserDisplayAvatarURL)
			.setTimestamp()
			.setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(discordSlashCommandLogChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(discordSlashCommandLogChannelID).permissionsFor(clientID).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(discordSlashCommandLogChannelID).permissionsFor(clientID).has('SendMessages') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(discordSlashCommandLogChannelID).send({ embeds: [discordSlashCommandLogEmbed] });
                    } else {
                        console.log(`[MCHPB] Error occured while logging discord slash command usage in #${discordSlashCommandLogChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${discordSlashCommandLogChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding discord slash command usage log channel!');
            }
        }
        return;
    } catch(logDiscordSlashCommandUsageError) {
        console.log('[MCHPB] Error occured while logging discord slash command usage! Restarting prisons bot...');
        try {
            errorHandler.execute(logDiscordSlashCommandUsageError, discordBot, prisonsBot);
            return process.exit(0);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
}

discordBot.on('interactionCreate', async discordSlashCommandDetails => {
    try {
	    if(!discordSlashCommandDetails.isChatInputCommand()) return;
        await discordSlashCommandDetails.deferReply({ ephemeral: true });

        const prisonsBotBlacklistedRoleID = configValue.role_id.bot_blacklisted;

        if(discordSlashCommandDetails.member.roles.cache.some(discordSlashCommandUserRole => discordSlashCommandUserRole.id === prisonsBotBlacklistedRoleID) === true){
            await discordSlashCommandDetails.editReply({ content: '```You are blacklisted from using prisons bot!```', ephemeral: true }).then(async () => {
                await logDiscordSlashCommandUsage(discordSlashCommandDetails, false);
            });
        } else {

            const discordSlashCommandHandler = discordBot.slashCommands.get(discordSlashCommandDetails.commandName);

            switch(discordSlashCommandDetails.commandName){
                case 'balance':
                    await discordSlashCommandHandler.execute(discordSlashCommandDetails, prisonsBot).then(async discordSlashCommandResult => {
                        await logDiscordSlashCommandUsage(discordSlashCommandDetails, discordSlashCommandResult);
                    });
                    break;
                case 'help':
                    await discordSlashCommandHandler.execute(discordSlashCommandDetails).then(async discordSlashCommandResult => {
                        await logDiscordSlashCommandUsage(discordSlashCommandDetails, discordSlashCommandResult);
                    });
                    break;
                case 'leaderboard':
                    await discordSlashCommandHandler.execute(discordSlashCommandDetails).then(async discordSlashCommandResult => {
                        await logDiscordSlashCommandUsage(discordSlashCommandDetails, discordSlashCommandResult);
                    });
                    break;
                case 'reconnect':
                    await discordSlashCommandHandler.execute(discordSlashCommandDetails, configValue, prisonsBot).then(async discordSlashCommandResult => {
                        await logDiscordSlashCommandUsage(discordSlashCommandDetails, discordSlashCommandResult);
                    });
                    break;
                case 'restart':
                    await discordSlashCommandHandler.execute(discordSlashCommandDetails, configValue, discordBot, prisonsBot, logDiscordSlashCommandUsage);
                    break;
                case 'stats':
                    await discordSlashCommandHandler.execute().then(async discordSlashCommandResult => {
                        await logDiscordSlashCommandUsage(discordSlashCommandDetails, discordSlashCommandResult);
                    });
                    break;
                case 'sync':
                    await discordSlashCommandHandler.execute(discordSlashCommandDetails, prisonsBot, configValue).then(async discordSlashCommandResult => {
                        await logDiscordSlashCommandUsage(discordSlashCommandDetails, discordSlashCommandResult);
                    });
                    break;
                case 'unsync':
                    await discordSlashCommandHandler.execute(discordSlashCommandDetails, configValue).then(async discordSlashCommandResult => {
                        await logDiscordSlashCommandUsage(discordSlashCommandDetails, discordSlashCommandResult);
                    });
                    break;
            }
        }
        return;
    } catch(discordBotOnInteractionCreateError) {
        console.log('[MCHPB] Error occured while executing discord bot on interaction create tasks! Restarting prisons bot...');
        try {
            await discordSlashCommandDetails.editReply({ content: '```Error occured while executing this discord slash command handler!```', ephemeral: true }).then(async () => {
                await logDiscordSlashCommandUsage(discordSlashCommandDetails, 'ERROR');
            });
            errorHandler.execute(discordBotOnInteractionCreateError, discordBot, prisonsBot);
            return process.exit(0);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
});

async function registerChatPatterns(){
    console.log('[MCHPB] Registering chat patterns...');
    try {
        Object.keys(chatEvents).forEach(chatEventName => {
            if(configValue.feature[chatEventName] === 'true'){
                prisonsBot.addChatPattern(chatEventName, chatEvents[chatEventName], { repeat: true, parse: true });
            }
        });
        return true;
    } catch(registerChatPatternError) {
        return registerChatPatternError;
    }
}

prisonsBot.once('login', async () => {
    console.log('[MCHPB] Connecting to MCHub.COM...');
});

prisonsBot.once('spawn', async () => {
    console.log('[MCHPB] Connected to MCHub.COM.');
    try {
        await registerChatPatterns().then(async registerChatPatternsResult => {
            if(registerChatPatternsResult === true){
            console.log('[MCHPB] Successfully registered chat patterns.');

            const scheduleTasksHandler = handlers.get('schedule_tasks');

            await scheduleTasksHandler.execute(configValue, prisonsBot).then(scheduleTasksHandlerResult => {
                if(scheduleTasksHandlerResult === true){
                    console.log('[MCHPB] Successfully scheduled tasks.');
                    discordBot.user.setActivity('MCHub.COM - Atlantic Prisons' , { type: DiscordJS.ActivityType.Playing, name: 'MCHub.COM - Atlantic Prisons' });
                } else {
                    console.log('[MCHPB] Error occured while scheduling tasks! Restarting prisons bot...');
                    try {
                        errorHandler.execute(scheduleTasksHandlerResult, discordBot, prisonsBot);
                        return process.exit(0);
                    } catch {
                        console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
                        return process.exit(0);
                    }
                }
            });
            } else {
                console.log('[MCHPB] Error occured while registering chat patterns! Restarting prisons bot...');
                try {
                    errorHandler.execute(registerChatPatternsResult, discordBot, prisonsBot);
                    return process.exit(0);
                } catch {
                    console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
                    return process.exit(0);
                }
            }
        });
        return;
    } catch(prisonsBotOnceSpawnError) {
        console.log('[MCHPB] Error occured while executing prisons bot once spawn tasks! Restarting prisons bot...');
        try {
            errorHandler.execute(prisonsBotOnceSpawnError, discordBot, prisonsBot);
            return process.exit(0);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
});

prisonsBot.on('resourcePack', async (resourcePackURL, resourcePackHash) => {
    console.log('[MCHPB] Incoming resource pack from MCHub - Atlantic Prisons.');
    console.log(`[MCHPB] Resource Pack's URL: ${resourcePackURL}`);
    console.log(`[MCHPB] Resource Pack's Hash: ${resourcePackHash}`);
    console.log('[MCHPB] Rejecting incoming resource pack from MCHub - Atlantic Prisons...');
    try {
        prisonsBot.denyResourcePack();
        console.log('[MCHPB] Rejected incoming resource pack from MCHub - Atlantic Prisons.');
        return;
    } catch(prisonsBotOnResourcePackError) {
        console.log('[MCHPB] Error occured while executing prisons bot on resource pack tasks! Restarting prisons bot...');
        try {
            errorHandler.execute(prisonsBotOnResourcePackError, discordBot, prisonsBot);
            return process.exit(0);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
});

function isMessageAPrivateMessage(chatMessage){
    try {

        const privateMessageRegex = new RegExp(/^\[([0-9A-Za-z]+)\] \[([0-9A-Za-z_*]+) \-\> ([0-9A-Za-z_*]+)\] (.+)$/, 'm');

        if(privateMessageRegex.test(chatMessage) === true){
            return true;
        } else {
            return false;
        }
    } catch(isMessageAPrivateMessageError) {
        console.log('[MCHPB] Error occured while determining is a message a private message! Restarting prisons bot...');
        try {
            errorHandler.execute(isMessageAPrivateMessageError, discordBot, prisonsBot);
            return process.exit(0);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
}

async function logPrivateMessage(privateMessage){
    try {
        if(configValue.feature.log_private_message_to_console === 'true'){
            console.log(privateMessage.toAnsi());
        }
        if(configValue.feature.log_private_message_to_discord === 'true'){

            const privateMessageLogChannelID = configValue.discord_channel.private_message;

            const privateMessageLogChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(privateMessageLogChannelID).name;

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(privateMessageLogChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(privateMessageLogChannelID).permissionsFor(clientID).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(privateMessageLogChannelID).permissionsFor(clientID).has('SendMessages') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(privateMessageLogChannelID).send('```' + privateMessage + '```');
                    } else {
                        console.log(`[MCHPB] Error occured while logging private message in #${privateMessageLogChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${privateMessageLogChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding private message log channel!');
            }
        }
        return;
    } catch(logPrivateMessageError) {
        console.log('[MCHPB] Error occured while logging private message! Restarting prisons bot...');
        try {
            errorHandler.execute(logPrivateMessageError, discordBot, prisonsBot);
            return process.exit(0);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
}

async function logGlobalChat(globalChatMessage){
    try {
        if(configValue.feature.log_global_chat_to_console === 'true'){
            console.log(globalChatMessage.toAnsi());
        }
        if(configValue.feature.log_global_chat_to_discord === 'true'){
            if(String(globalChatMessage).length > 5){
                if(bulkChatMessages.length < 10){
                    bulkChatMessages.push(globalChatMessage);
                } else {
    
                    const globalChatLogChannelID = configValue.discord_channel.global_chat;
    
                    const globalChatLogChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(globalChatLogChannelID).name;
    
                    const bulkGlobalChatMessage = bulkChatMessages.join('\n\n');
    
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(globalChatLogChannelID) !== undefined){
                        if(discordBot.guilds.cache.get(guildID).channels.cache.get(globalChatLogChannelID).permissionsFor(clientID).has('ViewChannel') === true){
                            if(discordBot.guilds.cache.get(guildID).channels.cache.get(globalChatLogChannelID).permissionsFor(clientID).has('SendMessages') === true){
                                await discordBot.guilds.cache.get(guildID).channels.cache.get(globalChatLogChannelID).send('```' + bulkGlobalChatMessage + '```').then(() => {
                                    bulkChatMessages.splice(0, bulkChatMessages.length);
                                });
                            } else {
                                console.log(`[MCHPB] Error occured while logging global chat in #${globalChatLogChannelName}!`);
                            }
                        } else {
                            console.log(`[MCHPB] Error occured while viweing #${globalChatLogChannelName}!`);
                        }
                    } else {
                        console.log('[MCHPB] Error occured while finding global chat log channel!');
                    }
                }
            }
        }
        return;
    } catch(logGlobalChatError) {
        console.log('[MCHPB] Error occured while logging global chat! Restarting prisons bot...');
        try {
            errorHandler.execute(logGlobalChatError, discordBot, prisonsBot);
            return process.exit(0);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
}

prisonsBot.on('message', async (chatMessage, chatPosition) => {
    try {
        if(chatPosition !== 'game_info'){
            if(isMessageAPrivateMessage(chatMessage) === true){
                await logPrivateMessage(chatMessage);
            } else {
                await logGlobalChat(chatMessage);
            }
        }
        return;
    } catch(prisonsBotOnMessageError) {
        console.log('[MCHPB] Error occured while executing prisons bot on message tasks! Restarting prisons bot...');
        try {
            errorHandler.execute(prisonsBotOnMessageError, discordBot, prisonsBot);
            return process.exit(0);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
});

async function logChatEvent(chatEventName, chatEventResult){
    try {
        
        const underscoreRegex = new RegExp(/([_])/, 'g');

        chatEventName = String(chatEventName).replace(underscoreRegex, ' ').toUpperCase();

        switch(chatEventResult){
            default:

                chatEventResult = 'UNKNOWN';

                break;
            case 'ERROR':

                chatEventResult = 'ERROR';

                break;
            case true:

                chatEventResult = 'SUCCESS';

                break;
            case false:

                chatEventResult = 'FAILED';

                break;
        }
        if(configValue.feature.log_chat_event_to_console === 'true'){
            console.log(`[MCHPB] Chat Event Name: ${chatEventName} | Chat Event Result: ${chatEventResult}`);
        }
        if(configValue.feature.log_chat_event_to_discord === 'true'){

            const chatEventChannelID = configValue.discord_channel[chatEventName];

            const chatEventChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(chatEventChannelID).name;

            const chatEventLogChannelID = configValue.discord_channel.chat_event;

            const chatEventLogChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(chatEventLogChannelID).name;

            const chatEventLogEmbedDescription = 

            `Chat Event Name: ${chatEventName}
            Chat Event Result: ${chatEventResult}
            Channel's ID: ${chatEventChannelID}
            Channel's Name: #${chatEventChannelName}`;

            const chatEventLogEmbed = new DiscordJS.EmbedBuilder()
			    .setColor('#4422bf')
			    .setTitle('CHAT EVENT LOG')
			    .setDescription(chatEventLogEmbedDescription)
			    .setThumbnail('https://emojipedia-us.s3.amazonaws.com/source/skype/289/exclamation-mark_2757.png')
			    .setTimestamp()
			    .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
        
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(chatEventLogChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(chatEventLogChannelID).permissionsFor(clientID).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(chatEventLogChannelID).permissionsFor(clientID).has('SendMessages') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(chatEventLogChannelID).send({ embeds: [chatEventLogEmbed] });
                    } else {
                        console.log(`[MCHPB] Error occured while logging chat event log in #${chatEventLogChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${chatEventLogChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding chat event log channel!');
            }
        }
        return;
    } catch(logChatEventError) {
        console.log('[MCHPB] Error occured while logging chat event log! Restarting prisons bot...');
        try {
            errorHandler.execute(logChatEventError, discordBot, prisonsBot);
            return process.exit(0);
        } catch {
            console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
            return process.exit(0);
        }
    }
}

Object.keys(chatEvents).forEach(async chatEventName => {
    if(configValue.feature[chatEventName] === 'true'){
        prisonsBot.on(`chat:${chatEventName}`, async regexMatches => {
            try {

                const chatEventHandler = handlers.get(chatEventName);

                await chatEventHandler.execute(regexMatches, guildID, configValue, discordBot).then(async chatEventResult => {
                    await logChatEvent(chatEventName, chatEventResult);
                });
                return;
            } catch(prisonsBotOnChatEventError) {
                console.log('[MCHPB] Error occured while executing prisons bot on chat event tasks! Restarting prisons bot...');
                try {
                    errorHandler.execute(prisonsBotOnChatEventError, discordBot, prisonsBot);
                    return process.exit(0);
                } catch {
                    console.log('[MCHPB] Error occured while executing error handler! Force restarting prisons bot...');
                    return process.exit(0);
                }
            }
        });
    }
});