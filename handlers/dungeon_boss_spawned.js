const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'dungeon_boss_spawned'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const dungeonBossSpawnedAlertChannelID = configValue.discord_channel.dungeon_boss_spawned;

            const dungeonBossSpawnedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonBossSpawnedAlertChannelID).name;

            const dungeonBossSpawnedPingRoleID = configValue.role_id.dungeon_boss_spawned_ping;

            const dungeonDetails = regexMatches[0];

            const dungeonTimeLeft = dungeonDetails[0];

            const dungeonBossSpawnedEmbed = new DiscordJS.EmbedBuilder()
                .setColor('#4422bf')
                .setTitle('DUNGEON BOSS')
                .setDescription(`Dungeon Ends In: ${dungeonTimeLeft}`)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonBossSpawnedAlertChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonBossSpawnedAlertChannelID).permissionsFor(discordBot.user.id).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonBossSpawnedAlertChannelID).permissionsFor(discordBot.user.id).has('SendMessages') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(dungeonBossSpawnedAlertChannelID).send({ content: `|| <@&${dungeonBossSpawnedPingRoleID}> ||`, embeds: [dungeonBossSpawnedEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending dungeon boss spawned alert in #${dungeonBossSpawnedAlertChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${dungeonBossSpawnedAlertChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding dungeon boss spawned alert channel!');
            }
            return false;
        } catch {
            return 'ERROR';
        }
    }
}