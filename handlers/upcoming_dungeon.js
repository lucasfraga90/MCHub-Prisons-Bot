const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_dungeon'
    },
    async execute(regexMatches, guildID, configValue, discordBot){
        try {
    
            const upcomingDungeonAlertChannelID = configValue.discord_channel.upcoming_dungeon;

            const upcomingDungeonAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingDungeonAlertChannelID).name;

            const upcomingDungeonDetails = regexMatches[0];

            const upcomingDungeonTime = String(upcomingDungeonDetails[0]);

            const upcomingDungeonEmbedDescription = `Time: ${upcomingDungeonTime}`;

            const upcomingDungeonEmbed = new DiscordJS.EmbedBuilder()
                .setColor('#4422bf')
                .setTitle('UPCOMING DUNGEON')
                .setDescription(upcomingDungeonEmbedDescription)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingDungeonAlertChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingDungeonAlertChannelID).permissionsFor(discordBot.user.id).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingDungeonAlertChannelID).permissionsFor(discordBot.user.id).has('SendMessages') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingDungeonAlertChannelID).send({ embeds: [upcomingDungeonEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending upcoming dungeon alert in #${upcomingDungeonAlertChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${upcomingDungeonAlertChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding upcoming dungeon alert channel!');
            }
            return false;
        } catch{
            return 'ERROR';
        }
    }
}