module.exports = {
    data: {
        name: 'chat'
    },
    async execute(chatMSGRaw, configValue, discordBot, isIngameBotReady, isDiscordBotReady){
        async function logIngameChatToConsole(){
            console.log(chatMSGRaw.toAnsi());
        }
        async function logIngameChatToDiscord(){
            
            const guildID = configValue.discord_bot.guild_id;
        
            const ingameChatChannelID = configValue.discord_channels.ingame_chat;

            const ingameChatChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).name;
            
            
            if(chatMSGRaw.toString().length >= 5){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID) != undefined){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(ingameChatChannelID).has('VIEW_CHANNEL') === true){
                        if(discordBot.guilds.cache.get(guildID).me.permissionsIn(ingameChatChannelID).has('SEND_MESSAGES') === true){
                            discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).send('```' + chatMSGRaw + '```');
                        } else {
                            console.log(`[MCHPB] Error occured while sending chat messages in #${ingameChatChannelName}!`);
                        }
                    } else {
                        console.log(`[MCHPB] Error occured while sending chat messages in #${ingameChatChannelName}!`);
                    }
                } else {
                    console.log('[MCHPB] Error occured while finding ingame chat channel!');
                }
            }
        }
        if(configValue.features.log_ingame_chat_to_console === 'true'){
            if(configValue.features.log_ingame_chat_to_discord === 'true'){
                logIngameChatToConsole().then(() => {
                    logIngameChatToDiscord();
                });
            } else {
                logIngameChatToConsole();
            }
        } else {
            if(configValue.features.log_ingame_chat_to_discord === 'true'){
                logIngameChatToDiscord();
            }
        }
        return isDiscordBotReady = true, isIngameBotReady = true;
    }
}