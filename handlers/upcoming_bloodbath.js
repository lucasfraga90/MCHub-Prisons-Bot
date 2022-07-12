const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_bloodbath'
    },
    async execute(regexMatches, discordBot, configValue, guildID){    
        try {
    
            const upcomingBloodbathAlertChannelID = configValue.discord_channels.upcoming_bloodbath;

            const upcomingBloodbathAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBloodbathAlertChannelID).name;

            const upcomingBloodbathDetails = regexMatches[0];

            const upcomingBloodbathTime = upcomingBloodbathDetails[0];

            const upcomingBloodbathEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('UPCOMING BLOODBATH EVENT')
                .setDescription(`Time: ${upcomingBloodbathTime}`)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/crossed-swords_2694-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBloodbathAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(upcomingBloodbathAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(upcomingBloodbathAlertChannelID).has('SEND_MESSAGES') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBloodbathAlertChannelID).send({ embeds: [upcomingBloodbathEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending upcoming bloodbath event alert in #${upcomingBloodbathAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${upcomingBloodbathAlertChannelName}`);
                    return false;
                }
            } else {
                console.log('[MCHPB] Error occured while finding upcoming bloodbath event alert channel!');
                return false;
            }
        } catch {
			return 'ERROR';
        }
    }
}