require('dotenv').config();

const nodeFS = require('fs');

const mineflayer = require('mineflayer');

const DiscordJS = require('discord.js');

const { REST } = require('@discordjs/rest');

const { Routes } = require('discord-api-types/v9');

const commandsDIR ='./commands/';

const defaultEnvLayout =

`DISCORD_BOT_TOKEN=DISCORD_BOT_TOKEN_HERE
INGAME_BOT_EMAIL=INGAME_BOT_EMAIL_HERE
INGAME_BOT_PASSWORD=INGAME_BOT_PASSWORD_HERE
INGAME_BOT_AUTH_WAY=mojang`;

const defaultConfigLayout = 

{
  discord_bot: {
      guild_id: "1",
      client_id: "1"
  },
  discord_channels: {
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
      pve_boss_ping: "1",
      dungeon_boss_ping: "1",
      dungeon_ping: "1",
      beacon_meteor_ping: "1",
      bloodbath_ping: "1",
  }
};

function doesCommandsDIRExists(){
    console.log("[MCHPB] Loading commands' directory...");
    try{
        nodeFS.accessSync(commandsDIR);
        return true;
    } catch {
        return false;
    }
}

function removeInvalidCommandFile(commandFile){
    console.log('[MCHPB] Removing extra files...');

    const invalidCommandFilePath = `${commandsDIR}${commandFile}`;

    try{
        nodeFS.rmSync(invalidCommandFilePath);
        return true;
    } catch {
        return false;
    }
}

function isCommandFilesOkay(){
    console.log("[MCHPB] Loading command's files...");

    const commandDIRFiles = nodeFS.readdirSync(commandsDIR);

    const defaultCommandFiles = ['help.js', 'restart.js', 'rejoin.js'];

    let commandFiles = [];
    
    for (const commandFile of commandDIRFiles){
        if(defaultCommandFiles.includes(commandFile) === false){
            if(removeInvalidCommandFile(commandFile) === true){
                console.log(`[MCHPB] Successfully removed ${commandFile}.`);
            } else {
                console.log(`[MCHPB] Error occured while removing ${commandFile}! Please reinstall the bot.`);
            }
        } else {
            commandFiles.push(commandFile);
        }
    }
    commandFiles.forEach(commandFileName => {
        if(defaultCommandFiles.includes(commandFileName) === false){
            return false;
        }
    });
    return true;
}

function doesEnvFileExists(){
    console.log('[MCHPB] Loading .env file...');
    try{
        nodeFS.accessSync('.env', nodeFS.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function generateEnvFile(){
    console.log('[MCHPB] Generating a new .env file...');
    try{
        nodeFS.appendFileSync('.env', defaultEnvLayout, 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function isEnvFileValid(){
    if(process.env.DISCORD_BOT_TOKEN === undefined || process.env.INGAME_BOT_EMAIL === undefined || process.env.INGAME_BOT_PASSWORD === undefined || process.env.INGAME_BOT_AUTH_WAY === undefined){
        return false;
    } else {
        if(process.env.DISCORD_BOT_TOKEN === 'DISCORD_BOT_TOKEN_HERE' || process.env.INGAME_BOT_EMAIL === 'INGAME_BOT_EMAIL_HERE' || process.env.INGAME_BOT_PASSWORD === 'INGAME_BOT_PASSWORD'){
            return false;
        } else{
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
        nodeFS.writeFileSync('.env', defaultEnvLayout, 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function doesConfigFileExists(){
    console.log('[MCHPB] Loading config file...');
    try{
        nodeFS.accessSync('config.json', nodeFS.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function generateConfigFile(){
    console.log('[MCHPB] Generating a new config file...');
    try{
        nodeFS.appendFileSync('config.json', JSON.stringify(defaultConfigLayout, null, 4), 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function isConfigFileValid(){ //NEEDS A REWRITE
    try{

        const updatedConfigValue = JSON.parse(nodeFS.readFileSync('config.json', 'utf-8'));
    
        if(updatedConfigValue.discord_bot.guild_id === undefined || updatedConfigValue.discord_bot.client_id === undefined || updatedConfigValue.discord_channels.pve_boss === undefined || updatedConfigValue.discord_channels.dungeon_boss === undefined || updatedConfigValue.discord_channels.dungeon === undefined || updatedConfigValue.discord_channels.beacon_meteor === undefined || updatedConfigValue.discord_channels.bloodbath === undefined || updatedConfigValue.discord_channels.ingame_chat === undefined || updatedConfigValue.discord_channels.logs === undefined || updatedConfigValue.roles_id.admin === undefined || updatedConfigValue.roles_id.trusted === undefined || updatedConfigValue.roles_id.pve_boss_ping === undefined || updatedConfigValue.features.discord_ingame_chat === undefined || updatedConfigValue.features.console_ingame_chat === undefined || updatedConfigValue.roles_id.dungeon_boss_ping === undefined || updatedConfigValue.roles_id.dungeon_ping === undefined || updatedConfigValue.roles_id.beacon_meteor_ping === undefined || updatedConfigValue.roles_id.bloodbath_ping === undefined){
            return false;
        } else {
            return true;
        }
    } catch {
        return false;
    }
}

function reformatConfigFile(){
    console.log('[MCHPB] Reformatting config file...');
    try{
        nodeFS.writeFileSync('.env', JSON.stringify(defaultConfigLayout, null, 4), 'utf-8');
        return true;
    } catch {
        return false;
    }
}

function validateEssentials(){
    console.log('[MCHPB] Loading essential directories & files...');
    if(doesCommandsDIRExists() === true){
        console.log("[MCHPB] Successfully loaded commands' directory.");
        if(isCommandFilesOkay() === true){
            console.log("[MCHPB] Successfully loaded command's files.");
            if(doesEnvFileExists() === true){
                if(isEnvFileValid() === true){
                    console.log('[MCHPB] Successfully loaded .env file.');
                    if(doesConfigFileExists() === true){
                        if(isConfigFileValid() === true){
                            console.log('[MCHPB] Successfully loaded config file.');
                            return true;
                        } else {
                            console.log('[MCHPB] Invalid config file or its configuration!');
                            if(reformatConfigFile() === true){
                                console.log('[MCHPB] Successfully reformatted config file. Please configure it before running the bot again.');
                                return false;
                            } else {
                                console.log('[MCHPB] Error occured while writing to config file! Please reinstall the bot.');
                                return false;
                            }
                        }
                    } else {
                        console.log('[MCHPB] Missing config file!');
                        if(generateConfigFile() === true){
                            console.log('[MCHPB] Successfully generated a new config file. Please configure it before running the bot again.');
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
                        console.log('[MCHPB] Error occured while writing to .env file! Please reinstall the bot.');
                        return false;
                    }
                }                     
            } else {
                console.log('[MCHPB] Missing .env file!');
                if(generateEnvFile() === true){
                    console.log('[MCHPB] Successfully generated a new .env file. Please configure it before running the bot again.');
                    return false;
                } else {
                    console.log('[MCHPB] Error occured while generating a new .env file! Please reinstall the bot.');
                    return false;
                }
            }
        } else {
            console.log("[MCHPB] Error occured while loading command's files! Please reinstall the bot.");
            return false;
        }
    } else {
        console.log('[MCHPB] Error occured while loading commands directory! Please reinstall the bot.');
        return false;
    }
}

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
    'USER'
];

const discordBot = new DiscordJS.Client({ intents: discordBotIntents, partials: discordBotPartials });

discordBot.commands = new DiscordJS.Collection();

let isDiscordBotReady = false;

let isIngameBotReady = false;

let constantConfigValue;

let ingameBot;

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

if(validateEssentials() === true){

    constantConfigValue = JSON.parse(nodeFS.readFileSync('config.json', 'utf-8'));

    console.log('[MCHPB] Successfully loaded all essential directories & files.');
    console.log('[MCHPB] Connecting to the Discord bot...');
    discordBot.login(process.env.DISCORD_BOT_TOKEN).then(() => {
        if(registerSlashCommands() === true){
            console.log('[MCHPB] Successfully synchronized slash commands.')
        } else {
            console.log('[MCHPB] Error occured while synchronizing slash commands! Shutting down the bot.');
            process.exit(0);
        }});
    ingameBot = mineflayer.createBot({ host: 'MCHub.COM', username: process.env.INGAME_BOT_EMAIL, password: process.env.INGAME_BOT_PASSWORD, auth: process.env.INGAME_BOT_AUTH_WAY });
} else {
    process.exit(0);
}

discordBot.on('ready', async onReadyDiscordBot => {
    discordBot.user.setActivity('MCHub.COM - Atlantic Prisons', { type: 'STREAMING', url: 'https://www.twitch.tv/officialqimiegames' });
    console.log('[MCHPB] Connected to the Discord bot.');
    isDiscordBotReady = true;
});

async function logCommandUsage(interaction, commandResult){

    const guildID = constantConfigValue.discord_bot.guild_id;

	const commandLogsChannelID = constantConfigValue.discord_channels.logs;

    let commandResultString;

    switch (commandResult) {
        default:
            commandResultString = 'UNKNOWN';
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

discordBot.on('interactionCreate', async interaction => {

    const discordSlashCommand = discordBot.commands.get(interaction.commandName);

	if (!interaction.isCommand() || isDiscordBotReady === false || isIngameBotReady === false) return;

    await interaction.deferReply({ ephemeral: true });
    switch(interaction.commandName){
        case 'help':
            if(await discordSlashCommand.execute(interaction) === true){
                logCommandUsage(interaction, true); 
            } else {
                logCommandUsage(interaction, false); 
            }
            break;
        case 'rejoin':
            if(await discordSlashCommand.execute(interaction, constantConfigValue, ingameBot) === true){
                logCommandUsage(interaction, true);
            } else {
                logCommandUsage(interaction, false); 
            }
            break;
        case 'restart':
            discordSlashCommand.execute(interaction, constantConfigValue, discordBot, ingameBot);
            logCommandUsage(interaction, true);
            break;
    }
});

ingameBot.once('login', async onceLoginIngameBot => {
    console.log('[MCHPB] Connecting to MCHUB.COM...');
});

function registerChatPattern(){ //MAKE SURE THIS WORK

    const regexPatterns = {
        pve_boss_spawned: new RegExp(/^BEACON \» The \[([A-Za-z]+)\] ([A-Za-z ]+) has spawned\! Go to \/warp beacon to defeat it\! $/, 'm'),
        dungeon_opened: new RegExp(/^Dungeons \» A new dungeon has opened\! You can join the dungeon by typing \/dungeon\!$/, 'm'),
        dungeon_boss_spawned: new RegExp(/^Dungeons \» The dungeon boss has spawned\! There are ([A-Za-z0-9 ]+) left before the dungeon closes\!$/, 'm'),
        beacon_meteor_spawned: new RegExp(/^BEACON \» A meteor has entered the atmosphere and is about to make impact\! Go to \/warp beacon to mine it up\!$/, 'm'),
        bloodbath_started: new RegExp(/^BLOODBATH \» Bloodbath has started\! \/warp pvp$/, 'm')
    };

    Object.keys(regexPatterns).forEach(regexPatternName => {
        ingameBot.addChatPattern(regexPatternName, regexPatterns[regexPatternName], { repeat: true, parse: true });
        ingameBot.addChatPatternSet;
    });
}

ingameBot.once('spawn', async onceSpawnIngameBot => {
    console.log('[MCHPB] Connected to MCHub.COM.');
    registerChatPattern();
    ingameBot.chat('/server atlantic11');
});

ingameBot.once('spawn', async onceSpawnIngameBot => {
    isIngameBotReady = true;
});

ingameBot.on('message', async chatMSGRaw => {

    if(isIngameBotReady === false || isDiscordBotReady === false) return;

    const guildID = constantConfigValue.discord_bot.guild_id;

    const ingameChatChannelID = constantConfigValue.discord_channels.ingame_chat;

    if(constantConfigValue.features.discord_ingame_chat === 'true'){
        if(chatMSGRaw.toString().length >= 5){
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(ingameChatChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(ingameChatChannelID).has('SEND_MESSAGES') === true){
                        discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).send('```' + chatMSGRaw + '```');
                    } else {
                        console.log('[MCHPB] Error occured while sending chat messages in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).name + '!');
                    }
                } else {
                    console.log('[MCHPB] Error occured while sending chat messages in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).name + '!');
                }
            } else {
                console.log('[MCHPB] Error occured while finding ingame chat channel!');
            }
        }
    }
    if(constantConfigValue.features.console_ingame_chat === 'true'){
        console.log(chatMSGRaw.toAnsi());
    }
});

ingameBot.on('chat:pve_boss_spawned', async pveBossDetails => { //ADD WITCH BOSS NAME
    if(isIngameBotReady === false || isDiscordBotReady === false) return;

    const guildID = constantConfigValue.discord_bot.guild_id;
    
    const pveBossSpawnedAlertChannelID = constantConfigValue.discord_channels.pve_boss;

    const pveBossSpawnedPingRoleID = constantConfigValue.roles_id.pve_boss_ping;

    const pveBossDetail = pveBossDetails[0];

    const pveBossName = pveBossDetail[1];

    let pveBossType = pveBossDetail[0];

    let pveBossSpawnedThumbnailURL;

    switch (pveBossType) {
        default:
            pveBossType = 'BOSS';
            break;
        case 'Boss':
            pveBossType = 'NORMAL';
            break;
        case 'ENRAGED':
            pveBossType = 'ENRAGED';
            break;
    }

    switch (pveBossName) {
        default:
            pveBossSpawnedThumbnailURL = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png';
            break;
        case 'ADD_WITCH_NAME_HERE':
            pveBossSpawnedThumbnailURL = 'https://lh3.googleusercontent.com/7MyHfZSgZ6gCrfjSkaoLLw6pUBV2gwelUOVIngWjeRiE4CZ30aRAwMeOj8-9nlRuv29hjDlNmaU0R5Pm7wCgvzF6oMGvZP2dtAurEcg=w600';
            break;
        case 'Iron Enforcer':
            pveBossSpawnedThumbnailURL = 'https://media.forgecdn.net/avatars/307/646/637389077753961978.png';
            break;
        case 'Oxar The Wizard':
            pveBossSpawnedThumbnailURL = 'https://i.pinimg.com/originals/e8/72/97/e87297ef4835a597de2f0282bbc735bd.png';
            break;
        case 'Explodey Creeper':
            pveBossSpawnedThumbnailURL = 'https://i.pinimg.com/originals/84/3b/6b/843b6b77f46c1c3a69091d13fa9593d7.jpg';
            break;
    }

    const pveBossSpawnedEmbed = new DiscordJS.MessageEmbed()
        .setColor('#eb8334')
        .setTitle('PVE BOSS SPAWNED')
        .setDescription(`Boss Type: ${pveBossType}
            Boss Name: ${pveBossName}`)
        .setThumbnail(`${pveBossSpawnedThumbnailURL}`)
        .setTimestamp()
        .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
    if(discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID) != undefined){
        if(discordBot.guilds.cache.get(guildID).me.permissionsIn(pveBossSpawnedAlertChannelID).has('VIEW_CHANNEL') === true){
            if(discordBot.guilds.cache.get(guildID).me.permissionsIn(pveBossSpawnedAlertChannelID).has('SEND_MESSAGES') === true){
                discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).send({ content: `|| <@&${pveBossSpawnedPingRoleID}> ||`, embeds: [pveBossSpawnedEmbed] });
            } else {
                console.log('[MCHPB] Error occured while sending chat messages in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).name + '!');
            }
        } else {
            console.log('[MCHPB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).name + '!');
        }
    } else {
        console.log('[MCHPB] Error occured while finding pve boss spawned alert channel!');
    }
});

ingameBot.on('chat:dungeon_opened', async () => {
    if(isIngameBotReady === false || isDiscordBotReady === false) return;

    const guildID = constantConfigValue.discord_bot.guild_id;
    
    const dungeonOpenedAlertChannelID = constantConfigValue.discord_channels.dungeon;

    const dungeonOpenedPingRoleID = constantConfigValue.roles_id.dungeon_ping;

    const dungeonOpenedEmbed = new DiscordJS.MessageEmbed()
        .setColor('#eb8334')
        .setTitle('DUNGEON OPENED')
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
        .setTimestamp()
        .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
    if(discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID) != undefined){
        if(discordBot.guilds.cache.get(guildID).me.permissionsIn(dungeonOpenedAlertChannelID).has('VIEW_CHANNEL') === true){
            if(discordBot.guilds.cache.get(guildID).me.permissionsIn(dungeonOpenedAlertChannelID).has('SEND_MESSAGES') === true){
                discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).send({ content: `|| <@&${dungeonOpenedPingRoleID}> ||`, embeds: [dungeonOpenedEmbed] });
            } else {
                console.log('[MCHPB] Error occured while sending chat messages in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).name + '!');
            }
        } else {
            console.log('[MCHPB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).name + '!');
        }
    } else {
        console.log('[MCHPB] Error occured while finding dungeon opened alert channel!');
    }
});

ingameBot.on('chat:dungeon_boss_spawned', async (dungeonEndTime) => {
    if(isIngameBotReady === false || isDiscordBotReady === false) return;

    const guildID = constantConfigValue.discord_bot.guild_id;
    
    const dungeonBossSpawnedAlertChannelID = constantConfigValue.discord_channels.dungeon_boss;

    const dungeonBossSpawnedPingRoleID = constantConfigValue.roles_id.dungeon_boss_ping;

    const dungeonBossSpawnedEmbed = new DiscordJS.MessageEmbed()
        .setColor('#eb8334')
        .setTitle('DUNGEON BOSS SPAWNED')
        .setDescription(`Time Before Dungeon Ends: ${dungeonEndTime}`)
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
        .setTimestamp()
        .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
    if(discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonBossSpawnedAlertChannelID) != undefined){
        if(discordBot.guilds.cache.get(guildID).me.permissionsIn(dungeonBossSpawnedAlertChannelID).has('VIEW_CHANNEL') === true){
            if(discordBot.guilds.cache.get(guildID).me.permissionsIn(dungeonBossSpawnedAlertChannelID).has('SEND_MESSAGES') === true){
                discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonBossSpawnedAlertChannelID).send({ content: `|| <@&${dungeonBossSpawnedPingRoleID}> ||`, embeds: [dungeonBossSpawnedEmbed] });
            } else {
                console.log('[MCHPB] Error occured while sending chat messages in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonBossSpawnedAlertChannelID).name + '!');
            }
        } else {
            console.log('[MCHPB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonBossSpawnedAlertChannelID).name + '!');
        }
    } else {
        console.log('[MCHPB] Error occured while finding dungeon boss spawned alert channel!');
    }
});

ingameBot.on('chat:beacon_meteor_spawned', async () => {
    if(isIngameBotReady === false || isDiscordBotReady === false) return;

    const guildID = constantConfigValue.discord_bot.guild_id;
    
    const beaconMeteorSpawnedAlertChannelID = constantConfigValue.discord_channels.beacon_meteor;

    const beaconMeteorSpawnedPingRoleID = constantConfigValue.roles_id.beacon_meteor_ping;

    const beaconMeteorSpawnedEmbed = new DiscordJS.MessageEmbed()
        .setColor('#eb8334')
        .setTitle('BEACON METEOR SPAWNED')
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/comet_2604-fe0f.png')
        .setTimestamp()
        .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
    if(discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID) != undefined){
        if(discordBot.guilds.cache.get(guildID).me.permissionsIn(beaconMeteorSpawnedAlertChannelID).has('VIEW_CHANNEL') === true){
            if(discordBot.guilds.cache.get(guildID).me.permissionsIn(beaconMeteorSpawnedAlertChannelID).has('SEND_MESSAGES') === true){
                discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).send({ content: `|| <@&${beaconMeteorSpawnedPingRoleID}> ||`, embeds: [beaconMeteorSpawnedEmbed] });
            } else {
                console.log('[MCHPB] Error occured while sending chat messages in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).name + '!');
            }
        } else {
            console.log('[MCHPB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).name + '!');
        }
    } else {
        console.log('[MCHPB] Error occured while finding beacon meteor spawned alert channel!');
    }
});

ingameBot.on('chat:bloodbath_started', async () => {
    if(isIngameBotReady === false || isDiscordBotReady === false) return;

    const guildID = constantConfigValue.discord_bot.guild_id;
    
    const bloodbathStartedAlertChannelID = constantConfigValue.discord_channels.bloodbath;

    const bloodbathStartedPingRoleID = constantConfigValue.roles_id.bloodbath_ping;

    const bloodbathStartedEmbed = new DiscordJS.MessageEmbed()
        .setColor('#eb8334')
        .setTitle('BLOODBATH STARTED')
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/crossed-swords_2694-fe0f.png')
        .setTimestamp()
        .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
    if(discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID) != undefined){
        if(discordBot.guilds.cache.get(guildID).me.permissionsIn(bloodbathStartedAlertChannelID).has('VIEW_CHANNEL') === true){
            if(discordBot.guilds.cache.get(guildID).me.permissionsIn(bloodbathStartedAlertChannelID).has('SEND_MESSAGES') === true){
                discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).send({ content: `|| <@&${bloodbathStartedPingRoleID}> ||`, embeds: [bloodbathStartedEmbed] });
            } else {
                console.log('[MCHPB] Error occured while sending chat messages in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).name + '!');
            }
        } else {
            console.log('[MCHPB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).name + '!');
        }
    } else {
        console.log('[MCHPB] Error occured while finding bloodbath started alert channel!');
    }
});