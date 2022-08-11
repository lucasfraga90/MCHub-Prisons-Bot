const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'pve_boss_spawned'
    },
    async execute(regexMatches, guildID, clientID, configValue, discordBot){
        try {

            const pveBossSpawnedAlertChannelID = configValue.discord_channel.pve_boss_spawned;

            const pveBossSpawnedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).name;

            const pveBossSpawnedPingRoleID = configValue.role_id.pve_boss_spawned_ping;

            const pveBossDetails = regexMatches[0];

            const pveBossName = String(pveBossDetails[1]);

            let pveBossType = pveBossDetails[0], pveBossSpawnedThumbnailURL = 'https://i.imgur.com/3ovjQst.png';

            switch(pveBossType){
                default:

                    pveBossType = 'UNKNOWN';

                    break;
                case 'Boss':

                    pveBossType = 'NORMAL';
                    
                    break;
                case 'ENRAGED':
                    
                    pveBossType = 'ENRAGED';
                    
                    break;
            }
            switch(pveBossName){
                case 'Estranged Witch':

                    pveBossSpawnedThumbnailURL = 'https://lh3.googleusercontent.com/7MyHfZSgZ6gCrfjSkaoLLw6pUBV2gwelUOVIngWjeRiE4CZ30aRAwMeOj8-9nlRuv29hjDlNmaU0R5Pm7wCgvzF6oMGvZP2dtAurEcg=w600';
                    
                    break;
                case 'Iron Enforcer':

                    pveBossSpawnedThumbnailURL = 'https://media.forgecdn.net/avatars/307/646/637389077753961978.png';
                    
                    break;
                case 'Oxar The Wizard':

                    pveBossSpawnedThumbnailURL = 'https://i.pinimg.com/originals/e8/72/97/e87297ef4835a597de2f0282bbc735bd.png';
                    
                    break;
                case 'Explodey Creeper':

                    pveBossSpawnedThumbnailURL = 'https://i.pinimg.com/originals/84/3b/6b/843b6b77f46c1c3a69091d13fa9593d7.jpg';
                    
                    break;
            }

            const pveBossSpawnedEmbedDescription =

            `Boss Type: ${pveBossType}
            Boss Name: ${pveBossName}`;

            const pveBossSpawnedEmbed = new DiscordJS.EmbedBuilder()
                .setColor('#4422bf')
                .setTitle('PVE BOSS')
                .setDescription(pveBossSpawnedEmbedDescription)
                .setThumbnail(pveBossSpawnedThumbnailURL)
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).permissionsFor(clientID).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).permissionsFor(clientID).has('SendMessages') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).send({ content: `|| <@&${pveBossSpawnedPingRoleID}> ||`, embeds: [pveBossSpawnedEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending pve boss spawned alert in #${pveBossSpawnedAlertChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${pveBossSpawnedAlertChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding pve boss spawned alert channel!');
            }
            return false;
        } catch {
			return 'ERROR';
        }
    }
}