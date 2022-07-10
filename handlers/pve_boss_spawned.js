const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'pve_boss_spawned'
    },
    async execute(regexMatches, discordBot, configValue){
        try {

            const pveBossSpawnedAlertChannelID = configValue.discord_channels.pve_boss;

            const guildID = configValue.discord_bot.guild_id;

            const pveBossSpawnedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).name;

            const pveBossSpawnedPingRoleID = configValue.roles_id.pve_boss_ping;

            const pveBossDetails = regexMatches[0];

            let pveBossType = pveBossDetails[0], pveBossSpawnedThumbnailURL;

            switch(pveBossType){
                default:
                    pveBossType = 'BOSS';
                    break;
                case 'Boss':
                    pveBossType = 'NORMAL';
                    break;
                case 'ENRAGED':
                    pveBossType = 'ENRAGED';
                    break;
            }

            const pveBossName = pveBossDetails[1];

            switch(pveBossName){
                default:

                    pveBossSpawnedThumbnailURL = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png';
                    
                    break;
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

            const pveBossSpawnedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('PVE BOSS SPAWNED')
                .setDescription(`Boss Type: ${pveBossType}\n` + `Boss Name: ${pveBossName}`)
                .setThumbnail(`${pveBossSpawnedThumbnailURL}`)
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(pveBossSpawnedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(pveBossSpawnedAlertChannelID).has('SEND_MESSAGES') === true){
                        discordBot.guilds.cache.get(guildID).channels.cache.get(pveBossSpawnedAlertChannelID).send({ content: `|| <@&${pveBossSpawnedPingRoleID}> ||`, embeds: [pveBossSpawnedEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending pve boss spawned alert in #${pveBossSpawnedAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${pveBossSpawnedAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHPB] Error occured while finding pve boss spawned alert channel!');
                return false;
            }
        } catch {
			return 'ERROR';
        }
    }
}