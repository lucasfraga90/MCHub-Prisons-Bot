const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'bloodbath_started'
    },
    async execute(regexMatches, discordBot, configValue){    
        try {
    
            const bloodbathStartedAlertChannelID = configValue.discord_channels.bloodbath;

            const guildID = configValue.discord_bot.guild_id;

            const bloodbathStartedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).name;

            const bloodbathStartedPingRoleID = configValue.roles_id.bloodbath_ping;

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
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending bloodbath started alert in #${bloodbathStartedAlertChannelName}!'`);
                        return false;
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${bloodbathStartedAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHPB] Error occured while finding bloodbath started alert channel!');
                return false;
            }
        } catch {
            return 'ERROR';
        }
    }
}