const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'bloodbath_started'
    },
    async execute(regexMatches, guildID, clientID, configValue, discordBot){    
        try {
    
            const bloodbathStartedAlertChannelID = configValue.discord_channel.bloodbath_started;

            const bloodbathStartedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).name;

            const bloodbathStartedPingRoleID = configValue.role_id.bloodbath_started_ping;

            const bloodbathStartedEmbed = new DiscordJS.EmbedBuilder()
                .setColor('#4422bf')
                .setTitle('BLOODBATH')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/crossed-swords_2694-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).permissionsFor(clientID).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).permissionsFor(clientID).has('SendMessages') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).send({ content: `|| <@&${bloodbathStartedPingRoleID}> ||`, embeds: [bloodbathStartedEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending bloodbath started alert in #${bloodbathStartedAlertChannelName}!'`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${bloodbathStartedAlertChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding bloodbath started alert channel!');
            }
            return false;
        } catch {
            return 'ERROR';
        }
    }
}