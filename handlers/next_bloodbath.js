const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'next_bloodbath'
    },
    async execute(regexMatches, discordBot, configValue, guildID){    
        try {
    
            const nextBloodbathAlertChannelID = configValue.discord_channels.next_bloodbath;

            const nextBloodbathAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(nextBloodbathAlertChannelID).name;

            const nextBloodbathDetails = regexMatches[0];

            const nextBloodbathTime = nextBloodbathDetails[0];

            const nextBloodbathEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('NEXT BLOODBATH EVENT')
                .setDescription(`Time: ${nextBloodbathTime}`)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/crossed-swords_2694-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(nextBloodbathAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(nextBloodbathAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(nextBloodbathAlertChannelID).has('SEND_MESSAGES') === true){
                        discordBot.guilds.cache.get(guildID).channels.cache.get(nextBloodbathAlertChannelID).send({ embeds: [nextBloodbathEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending next bloodbath event alert in #${nextBloodbathAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${nextBloodbathAlertChannelName}`);
                    return false;
                }
            } else {
                console.log('[MCHPB] Error occured while finding next bloodbath event alert channel!');
                return false;
            }
        } catch {
			return 'ERROR';
        }
    }
}