require('dotenv').config();

const nodeFS = require('fs');

const DiscordJS = require('discord.js');

const mineflayer = require('mineflayer');

const { REST } = require('@discordjs/rest');

const { Routes } = require('discord-api-types/v10');

const commandsDIR ='./commands/';

const handlersDIR ='./handlers/';

const defaultEnvFileLayout =

`DISCORD_BOT_TOKEN=DISCORD_BOT_TOKEN_HERE
INGAME_BOT_EMAIL=INGAME_BOT_EMAIL_HERE
INGAME_BOT_PASSWORD=INGAME_BOT_PASSWORD_HERE
INGAME_BOT_AUTH_WAY=mojang`;

const defaultConfigFileLayout = 

{
  discord_bot: {
      guild_id: "1",
      client_id: "1"
  },
  discord_channels: {
      global_booster: "1",
      pve_boss: "1",
      dungeon_boss: "1",
      dungeon: "1",
      beacon_meteor: "1",
      bloodbath: "1",
      ingame_chat: "1",
      logs: "1"
  },
  features: {
      discord_ingame_chat: "true",
      console_ingame_chat: "true"
  },
  roles_id: {
      admin: "1",
      trusted: "1",
      global_booster_ping: "1",
      pve_boss_ping: "1",
      dungeon_boss_ping: "1",
      dungeon_ping: "1",
      beacon_meteor_ping: "1",
      bloodbath_ping: "1"
  }
};

const discordBotIntents = 

[
    DiscordJS.Intents.FLAGS.GUILD_MEMBERS,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
    DiscordJS.Intents.FLAGS.GUILDS
];

const discordBotPartials =

[
    'CHANNEL',
    'GUILD_MEMBER',
    'MESSAGE',
    'USER',
    'REACTION',
    'GUILD_SCHEDULED_EVENT'
];

const regexPatterns = {
    pve_boss_spawned: new RegExp(/^BEACON \» The \[([A-Za-z]+)\] ([A-Za-z ]+) has spawned\! Go to \/warp beacon to defeat it\!/, 'm'),
    next_boss: new RegExp(/^BEACON \» The next boss will spawn in ([0-9]+) beacon mob kills\!$/,'m'),
    dungeon_opened: new RegExp(/^Dungeons \» A new dungeon has opened\! You can join the dungeon by typing \/dungeon\!$/, 'm'),
    dungeon_boss_spawned: new RegExp(/^Dungeons \» The dungeon boss has spawned\! There are ([A-Za-z0-9 ]+) left before the dungeon closes\!$/, 'm'),
    next_dungeon: new RegExp(/^Dungeons \» The next dungeon is scheduled to start in (([0-9]+) minutes||([0-9]+) seconds||([0-9]+) minutes ([0-9]+) seconds)\!$/, 'm'),
    beacon_meteor_spawned: new RegExp(/^BEACON \» A meteor has entered the atmosphere and is about to make impact\! Go to \/warp beacon to mine it up\!$/, 'm'),
    bloodbath_started: new RegExp(/^BLOODBATH \» Bloodbath has started\! \/warp pvp$/, 'm'),
    next_bloodbath: new RegExp(/^BLOODBATH \» The next bloodbath is in ([A-Za-z0-9 ]+)\!$/, 'm'),
    global_booster_started: new RegExp(/^MCHUB \» ([A-Za-z0-9_]+) has activated a Global (Mythical||Mega) (E-Token||Proc Rate||Lucky||Quarry) \(([A-Za-z0-9 ]+)\) booster\!$/, 'm')
};

const scheduledTaskRegexPattern = new RegExp(/^Attempting to send you to atlantic11...$/,'m');

const discordBot = new DiscordJS.Client({ intents: discordBotIntents, partials: discordBotPartials });

discordBot.commands = new DiscordJS.Collection();

const handlers = new Map();

let isDiscordBotReady = false, isIngameBotReady = false;

let ingameBot, consoleChatBox, errorHandler, constantConfigValue;

function isImportantDIRsExists(){
    console.log('[MCHPB] Loading important directories...');
    try{
        nodeFS.accessSync(commandsDIR, nodeFS.constants.F_OK);
    } catch {
        return false;
    }
    try{
        nodeFS.accessSync(handlersDIR, nodeFS.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function isImportantFilesExists(){
    console.log('[MCHPB] Loading important files...');

    const defaultHandlerFilesArray = ['beacon_meteor_spawned.js', 'bloodbath_started.js', 'chat.js', 'dungeon_boss_spawned.js', 'dungeon_opened.js', 'error.js', 'global_booster_started.js', 'console_chat_box.js', 'next_bloodbath.js', 'next_boss.js', 'next_dungeon.js', 'pve_boss_spawned.js', 'scheduled_task.js'];
    
    const defaultCommandFilesArray = ['help.js', 'rejoin.js', 'restart.js'];
    
    const currentHandlerFiles = nodeFS.readdirSync(handlersDIR).filter(fileName => fileName.endsWith('.js'));
    
    const currentCommandFiles = nodeFS.readdirSync(commandsDIR).filter(fileName => fileName.endsWith('.js'));

    let currentHandlerFilesArray = [];

    let currentCommandFilesArray = [];

    for(const currentHandlerFile of currentHandlerFiles){
        if(defaultHandlerFilesArray.includes(currentHandlerFile) === true){
            currentHandlerFilesArray.push(currentHandlerFile);
        } else {
            return false;
        }
    }
    for(const currentCommandFile of currentCommandFiles){
        if(defaultCommandFilesArray.includes(currentCommandFile) === true){
            currentCommandFilesArray.push(currentCommandFile);
        } else {
            return false;
        }
    }
    defaultHandlerFilesArray.forEach(defaultHandlerFile => {
        if(currentHandlerFilesArray.includes(defaultHandlerFile) === false){
            return false;
        }
    });
    defaultCommandFilesArray.forEach(defaultCommandFile => {
        if(currentCommandFilesArray.includes(defaultCommandFile) === false){
            return false;
        }
    });
    return true;
}

function isEnvFileExists(){
    console.log('[MCHPB] Loading .env file...');
    try{
        nodeFS.accessSync('.env');
        return true;
    } catch {
        return false;
    }
}

function generateEnvFile(){
    console.log('[MCHPB] Generating a new .env file...');
    try{
        nodeFS.appendFileSync('.env', defaultEnvFileLayout, 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function isEnvFileValid(){
    if(process.env.DISCORD_BOT_TOKEN === undefined || process.env.INGAME_BOT_EMAIL === undefined || process.env.INGAME_BOT_PASSWORD === undefined || process.env.INGAME_BOT_AUTH_WAY === undefined){
        return false;
    } else {
        if(process.env.DISCORD_BOT_TOKEN === 'DISCORD_BOT_TOKEN_HERE' || process.env.INGAME_BOT_EMAIL === 'INGAME_BOT_EMAIL_HERE' || process.env.INGAME_BOT_PASSWORD === 'INGAME_BOT_PASSWORD_HERE'){
            return false;
        } else {
            if(process.env.INGAME_BOT_AUTH_WAY === 'mojang' || process.env.INGAME_BOT_AUTH_WAY === 'microsoft'){
                return true;
            } else {
                return false;
            }
        }
    }
}

function reformatEnvFile(){
    console.log('[MCHPB] Reformatting .env file...');
    try{
        nodeFS.writeFileSync('.env', defaultEnvFileLayout, 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function isConfigFileExists(){
    console.log('[MCHPB] Loading config file...');
    try{
        nodeFS.accessSync('config.json');
        return true;
    } catch {
        return false;
    }
}

function generateConfigFile(){
    console.log('[MCHPB] Generating a new config file...');
    try{
        nodeFS.appendFileSync('config.json', JSON.stringify(defaultConfigFileLayout, null, 4), 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function isConfigFileValid(){
    try{

        const updatedConfigValue = JSON.parse(nodeFS.readFileSync('config.json', 'utf-8'));

        let defaultConfigObjects = [];

        let currentConfigObjects = [];

        let functionResult = true;

        Object.keys(defaultConfigFileLayout).forEach(defaultConfigObject => defaultConfigObjects.push(defaultConfigObject));
        Object.keys(defaultConfigFileLayout.discord_bot).forEach(defaultConfigObject => defaultConfigObjects.push(defaultConfigObject));
        Object.keys(defaultConfigFileLayout.discord_channels).forEach(defaultConfigObject => defaultConfigObjects.push(defaultConfigObject));
        Object.keys(defaultConfigFileLayout.features).forEach(defaultConfigObject => defaultConfigObjects.push(defaultConfigObject));
        Object.keys(defaultConfigFileLayout.roles_id).forEach(defaultConfigObject => defaultConfigObjects.push(defaultConfigObject));
        Object.keys(updatedConfigValue).forEach(currentConfigObject => currentConfigObjects.push(currentConfigObject));
        Object.keys(updatedConfigValue.discord_bot).forEach(currentConfigObject => currentConfigObjects.push(currentConfigObject));
        Object.keys(updatedConfigValue.discord_channels).forEach(currentConfigObject => currentConfigObjects.push(currentConfigObject));
        Object.keys(updatedConfigValue.features).forEach(currentConfigObject => currentConfigObjects.push(currentConfigObject));
        Object.keys(updatedConfigValue.roles_id).forEach(currentConfigObject => currentConfigObjects.push(currentConfigObject));
        defaultConfigObjects.forEach(defaultConfigObject => {
            if(currentConfigObjects.includes(defaultConfigObject) === false){
                console.log(defaultConfigObject);
                functionResult = false;
            }
        });
        currentConfigObjects.forEach(currentConfigObject => {
            if(defaultConfigObjects.includes(currentConfigObject) === false){
                console.log(currentConfigObject);
                functionResult = false;
            }
        });
        return functionResult;
    } catch {
        return false;
    }
}

function reformatConfigFile(){
    try{
        nodeFS.writeFileSync('config.json', JSON.stringify(defaultConfigFileLayout, null, 4), 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function loadEssentials(){
    console.log('[MCHPB] Loading important directories & files...');
    if(isImportantDIRsExists() === true){
        console.log('[MCHPB] Successfully loaded important directories.');
        if(isImportantFilesExists() === true){
            console.log('[MCHPB] Successfully loaded important files.');
            if(isEnvFileExists() === true){
                if(isEnvFileValid() === true){
                    console.log('[MCHPB] Successfully loaded .env file.');
                    if(isConfigFileExists() === true){
                        if(isConfigFileValid() === true){
                            console.log('[MCHPB] Successfully loaded config file.');
                            return true;
                        } else {
                            console.log('[MCHPB] Invalid config file or its configuration!');
                            if(reformatConfigFile() === true){
                                return false;
                            } else {
                                return false;
                            }
                        }
                    } else {
                        console.log('[MCHPB] Missing config file!');
                        if(generateConfigFile() === true){
                            console.log('[MCHPB] Successfully generated a new config file! Please configure it before running the bot again.');
                            return false;
                        } else {
                            console.log('[MCHPB] Error occured while generating a new config file! Please reinstall the bot.');
                            return false;
                        }
                    }
                } else {
                    console.log('[MCHPB] Invalid .env file or its configuration!');
                    if(reformatEnvFile() === true){
                        console.log('[MCHPB] Successfully reformatted .env file. Please configure it before running the bot again.');
                        return false;
                    } else {
                        console.log('[MCHPB] Error occured while reformatting .env file! Please reinstall the bot.');
                        return false;
                    }
                }
            } else {
                console.log('[MCHPB] Missing .env file!');
                if(generateEnvFile() === true){
                    console.log('[MCHPB] Successfully generated a new .env file! Please configure it before running the bot again.');
                    return false;
                } else {
                    console.log('[MCHPB] Error occured while generating a new .env file! Please reinstall the bot.');
                    return false;
                }
            }
        } else {
            console.log('[MCHPB] Error occured while loading important files! Please reinstall the bot.');
            return false;
        }
    } else {
        console.log('[MCHPB] Error occured while loading important directories! Please reinstall the bot.');
        return false;
    }
}

function registerHandlers(){
    console.log('[MCHPB] Registering handlers...');
    try{

        const handlerFiles = nodeFS.readdirSync(handlersDIR).filter(handlerFileName => handlerFileName.endsWith('.js'));

        for(const handlerFile of handlerFiles){
            const handlerFilePath = `${handlersDIR}${handlerFile}`;
            const handler = require(handlerFilePath);
            handlers.set(handler.data.name, handler);
        }
        return true;
    } catch {
        return false;
    }
}

function validateConfigValue(){
    console.log('[MCHPB] Validating config values...');

    const guildID = constantConfigValue.discord_bot.guild_id;

    let currentDiscordRolesID = [];

    let currentDiscordChannelsID = [];

    let functionResult = true;

    discordBot.guilds.cache.get(guildID).roles.fetch().then(roleDetails => {
        roleDetails.forEach(roleDetail => {
            currentDiscordRolesID.push(String(roleDetail.id));
        });
    }).then(() => {
        Object.keys(constantConfigValue.roles_id).forEach(roleName => {
            const roleID = constantConfigValue.roles_id[roleName];
            if(currentDiscordRolesID.includes(roleID) === false){
                functionResult = false;
            }
        });
    });
    discordBot.guilds.cache.get(guildID).channels.fetch().then(channelDetails => {
        channelDetails.forEach(channelDetail => {
            currentDiscordChannelsID.push(String(channelDetail.id));
        });
    }).then(() => {
        Object.keys(constantConfigValue.discord_channels).forEach(channelName => {
            const channelID = constantConfigValue.discord_channels[channelName];
            if(currentDiscordChannelsID.includes(channelID) === false){
                functionResult = false;
            }
        });
    });
    if(constantConfigValue.discord_bot.client_id != String(discordBot.user.id)){
        functionResult = false;
    }
    Object.keys(constantConfigValue.features).forEach(featureName => {
        const featureValue = constantConfigValue.features[featureName];
        if(typeof Boolean(featureValue) != 'boolean'){
            functionResult = false;
        }
    });
    return functionResult;
}

function registerSlashCommands(){
    console.log('[MCHPB] Synchronizing slash commands...');
    try{

        const clientID = constantConfigValue.discord_bot.client_id;

        const guildID = constantConfigValue.discord_bot.guild_id;

        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);

        const discordCommandFiles = nodeFS.readdirSync(commandsDIR).filter(file => file.endsWith('.js'));

        let discordCommands = [];

        for (const discordCommandFile of discordCommandFiles){
            const discordCommandsFilePath = `${commandsDIR}${discordCommandFile}`;
            const command = require(discordCommandsFilePath);
            discordCommands.push(command.data.toJSON());
            discordBot.commands.set(command.data.name, command);
        }
        rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: discordCommands });
        return true;
    } catch {
        return false;
    }
}

async function registerChatPattern(){
    console.log('[MCHPB] Registering chat patterns...');
    try{
        Object.keys(regexPatterns).forEach(regexPatternName => {
            ingameBot.addChatPattern(regexPatternName, regexPatterns[regexPatternName], { repeat: true, parse: true });
            ingameBot.addChatPatternSet;
        });
        ingameBot.addChatPattern('scheduled_task', scheduledTaskRegexPattern, { repeat: false, parse: true });
        ingameBot.addChatPatternSet;
        return true;
    } catch {
        return false;
    }
}

async function logCommandUsage(interaction, commandResult){

    const guildID = constantConfigValue.discord_bot.guild_id;

	const commandLogsChannelID = constantConfigValue.discord_channels.logs;

    let commandResultString;

    switch(commandResult){
        default:
            commandResultString = 'ERROR';
            break;
        case true:
            commandResultString = 'SUCCESS';
            break;
        case false:
            commandResultString = 'FAILED';
            break;
    }

    const commandLogEmbed = new DiscordJS.MessageEmbed()
			.setColor('#b2ebe3')
			.setTitle('COMMAND LOG')
			.setDescription(`Command Result: ${commandResultString}
                Command: ${interaction.commandName.toUpperCase()}
                Channel's Name: #${interaction.channel.name}
                Channel's ID: ${interaction.channel.id}
				User's Discord Username: ${interaction.member.displayName}
				User's Discord ID: ${interaction.member.id}`)
			.setThumbnail(interaction.member.displayAvatarURL())
			.setTimestamp()
			.setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

    if(discordBot.guilds.cache.get(guildID).channels.cache.get(commandLogsChannelID) != undefined){
        if(discordBot.guilds.cache.get(guildID).me.permissionsIn(commandLogsChannelID).has('VIEW_CHANNEL') === true){
            if(discordBot.guilds.cache.get(guildID).me.permissionsIn(commandLogsChannelID).has('SEND_MESSAGES') === true){
                discordBot.guilds.cache.get(guildID).channels.cache.get(commandLogsChannelID).send({ embeds: [commandLogEmbed] });
            } else {
                console.log('[MCHPB] Error occured while sending command log in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(commandLogsChannelID).name + '!');
            }
        } else {
            console.log('[MCHPB] Error occured while sending command log in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(commandLogsChannelID).name + '!');
        }
    } else {
        console.log('[MCHPB] Error occured while finding command logs channel!');
    }
}

try {
    if(loadEssentials() === true){
        console.log('[MCHPB] Successfully loaded important directories & files.');
    
        constantConfigValue = JSON.parse(nodeFS.readFileSync('config.json', 'utf-8'));
    
        if(registerHandlers() === true){
            console.log('[MCHPB] Successfully registered handlers.');
        } else {
            console.log('[MCHPB] Error occured while registering handlers! Please reinstall the bot.');
            discordBot.destroy();
            process.exit(1);
        }
        console.log('[MCHPB] Connecting to the Discord bot...');
        discordBot.login(process.env.DISCORD_BOT_TOKEN).then(() => {
            if(validateConfigValue() === true){
                console.log('[MCHPB] Successfully validated config values.');
            } else {
                console.log('[MCHPB] Error occured while validating config values! Please make sure you configure the config file correctly.');
                discordBot.destroy();
                process.exit(1);
            }
        }).then(() => {
            if(registerSlashCommands() === true){
                console.log('[MCHPB] Successfully synchronized slash commands.');
            } else {
                console.log('[MCHPB] Error occured while synchronizing slash commands! Restarting bot...');
                discordBot.destroy();
                process.exit(0);
            }
        });
        ingameBot = mineflayer.createBot({ host: 'MCHub.COM', username: process.env.INGAME_BOT_EMAIL, password: process.env.INGAME_BOT_PASSWORD, auth: process.env.INGAME_BOT_AUTH_WAY, keepAlive: true, checkTimeoutInterval: 60000 });
        consoleChatBox = require('readline').createInterface({ input: process.stdin });
    } else {
        process.exit(1);
    }
} catch {
    console.log('[MCHPB] Error occured while starting the bot! Shutting down the bot...');
    process.exit(1);
}

ingameBot.on('error', ingameBotError => {
    try {

        const errorHandler = handlers.get('error');

        errorHandler.execute(ingameBotError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing error handler! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

ingameBot.on('kicked', ingameBotError => {
    try {

        const errorHandler = handlers.get('error');

        errorHandler.execute(ingameBotError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing error handler! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

discordBot.on('error', discordBotError => {
    try {

        const errorHandler = handlers.get('error');

        errorHandler.execute(discordBotError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing error handler! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

discordBot.on('shardError', discordBotError => {
    try {

        const errorHandler = handlers.get('error');

        errorHandler.execute(discordBotError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing error handler! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

process.on('unhandledRejection', proccessError => {
    try {

        const errorHandler = handlers.get('error');

        errorHandler.execute(proccessError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing error handler! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

process.on('uncaughtException', proccessError => {
    try {

        const errorHandler = handlers.get('error');

        errorHandler.execute(proccessError, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing error handler! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

consoleChatBox.on('line', async consoleChatBoxInput => {
    try {

        const consoleChatBoxHandler = handlers.get('console_chat_box');

        consoleChatBoxHandler.execute(consoleChatBoxInput, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing console chat box handler! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

discordBot.on('ready', async onReadyDiscordBot => {
    try {
        discordBot.user.setActivity('MCHub.COM - Atlantic Prisons', { type: 'STREAMING', url: 'https://www.twitch.tv/officialqimiegames' });
        console.log('[MCHPB] Connected to the Discord bot.');
        isDiscordBotReady = true;
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing discord bot on ready functions! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

discordBot.on('interactionCreate', async interaction => {
    try {

        const discordSlashCommand = discordBot.commands.get(interaction.commandName);

	    if (!interaction.isCommand()) return;
        await interaction.deferReply({ ephemeral: true });
        switch(interaction.commandName){
            case 'help':
                discordSlashCommand.execute(interaction, logCommandUsage, isDiscordBotReady, isIngameBotReady);
                break;
            case 'rejoin':
                discordSlashCommand.execute(interaction, constantConfigValue, discordBot, ingameBot, logCommandUsage, isDiscordBotReady, isIngameBotReady);
                break;
            case 'restart':
                discordSlashCommand.execute(interaction, constantConfigValue, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady);
                break;
        }
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing command handler! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot!');
            process.exit(1);
        }
    }
});

ingameBot.once('login', async onceLoginIngameBot => {
    console.log('[MCHPB] Connecting to MCHUB.COM...');
});

ingameBot.once('spawn', async onceSpawnIngameBot => {
    try {
        console.log('[MCHPB] Connected to MCHub.COM.');
        if(await registerChatPattern() === true){
            console.log('[MCHPB] Successfully registered chat patterns.');
            await ingameBot.chat('/server atlantic11');
        } else {
            console.log('[MCHPB] Error occured while registering chat patterns! Shutting down the bot...');
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        }
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing ingame bot once spawn functions! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

ingameBot.on('spawn', async onSpawnIngameBot => {
    isIngameBotReady = true;
});

ingameBot.on('message', async (chatMSGRaw, chatType) => {
    try {

        const chatHandler = handlers.get('chat');

        chatHandler.execute(chatMSGRaw, chatType, constantConfigValue, discordBot, isIngameBotReady, isDiscordBotReady);
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing chat handler! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

ingameBot.on('chat:scheduled_task', async regexMatches => {
    try {

        const scheduledTaskHandler = handlers.get('scheduled_task');

        scheduledTaskHandler.execute(ingameBot, isDiscordBotReady, isIngameBotReady);
    } catch {
        try {
            console.log('[MCHPB] Error occured while executing scheduled task handler! Shutting down the bot...');
            isDiscordBotReady = false;
            isIngameBotReady = false;
            discordBot.destroy();
            ingameBot.end;
            process.exit(1);
        } catch {
            console.log('[MCHPB] Error occured while shutting down the bot properly!');
            process.exit(1);
        }
    }
});

Object.keys(regexPatterns).forEach(async regexPatternName => {
    ingameBot.on(`chat:${regexPatternName}`, async regexMatches => {
        try {

            const alertHandler = handlers.get(regexPatternName);

            alertHandler.execute(regexMatches, discordBot, constantConfigValue, isDiscordBotReady, isIngameBotReady);
        } catch {
            try {
                console.log('[MCHPB] Error occured while executing alerts handler! Shutting down the bot...');
                isDiscordBotReady = false;
                isIngameBotReady = false;
                discordBot.destroy();
                ingameBot.end;
                process.exit(1);
            } catch {
                console.log('[MCHPB] Error occured while shutting down the bot properly!');
                process.exit(1);
            }
        }
    });
});