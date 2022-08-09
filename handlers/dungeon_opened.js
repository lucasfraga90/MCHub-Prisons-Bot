const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'dungeon_opened'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const dungeonOpenedAlertChannelID = configValue.discord_channel.dungeon_opened;

            const dungeonOpenedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).name;

            const dungeonOpenedPingRoleID = configValue.role_id.dungeon_opened_ping;

            const dungeonOpenedEmbed = new DiscordJS.EmbedBuilder()
                .setColor('#4422bf')
                .setTitle('DUNGEON')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
                
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).permissionsFor(discordBot.user.id).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).permissionsFor(discordBot.user.id).has('SendMessages') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonOpenedAlertChannelID).send({ content: `|| <@&${dungeonOpenedPingRoleID}> ||`, embeds: [dungeonOpenedEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending dungeon opened alert in #${dungeonOpenedAlertChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${dungeonOpenedAlertChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding dungeon opened alert channel!');
            }
            return false;
        } catch {
            return 'ERROR';
        }
    }
}