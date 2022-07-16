module.exports = {
    data: {
        name: 'chat'
    },
    async execute(chatMessages, configValue, discordBot, guildID, isDiscordBotReady, isIngameBotReady){

        let bulkChatMessages = chatMessages.join('\n\n');

        async function logIngameChatToDiscord(){

            if(configValue.features.log_ingame_chat_to_discord === 'false') return;
        
            const ingameChatChannelID = configValue.discord_channels.ingame_chat;

            const ingameChatChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).name;

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(ingameChatChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(ingameChatChannelID).has('SEND_MESSAGES') === true){
                        discordBot.guilds.cache.get(guildID).channels.cache.get(ingameChatChannelID).send('```' + bulkChatMessages + '```');
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
        logIngameChatToDiscord().then(() => {
            return chatMessages = chatMessages.splice(0, chatMessages.length), isDiscordBotReady = true, isIngameBotReady = true;
        });
    }
}