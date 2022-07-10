const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'next_dungeon'
    },
    async execute(regexMatches, discordBot, configValue){
        try {
    
            const nextDungeonAlertChannelID = configValue.discord_channels.next_dungeon;

            const guildID = configValue.discord_bot.guild_id;

            const nextDungeonAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(nextDungeonAlertChannelID).name;

            const nextDungeonDetails = regexMatches[0];

            const nextDungeonTime = nextDungeonDetails[0];

            const nextDungeonEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('NEXT DUNGEON EVENT')
                .setDescription(`Time: ${nextDungeonTime}`)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(nextDungeonAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(nextDungeonAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(nextDungeonAlertChannelID).has('SEND_MESSAGES') === true){
                        discordBot.guilds.cache.get(guildID).channels.cache.get(nextDungeonAlertChannelID).send({ embeds: [nextDungeonEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending next dungeon event alert in #${nextDungeonAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${nextDungeonAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHPB] Error occured while finding next dungeon event alert channel!');
                return false;
            }
        } catch{
            return 'ERROR';
        }
    }
}