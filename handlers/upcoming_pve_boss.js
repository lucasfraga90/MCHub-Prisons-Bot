const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_pve_boss'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const upcomingBossAlertChannelID = configValue.discord_channels.upcoming_pve_boss;

            const upcomingBossAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBossAlertChannelID).name;

            const upcomingBossPingRoleID = configValue.roles_id.upcoming_pve_boss_ping;

            const upcomingBossDetails = regexMatches[0];

            const upcomingBossKillsLeft = Number(upcomingBossDetails[0]);

            const upcomingBossEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('NEXT PVE BOSS EVENT')
                .setDescription(`Mob Kills Left: ${upcomingBossKillsLeft}`)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBossAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(upcomingBossAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(upcomingBossAlertChannelID).has('SEND_MESSAGES') === true){
                        if(upcomingBossKillsLeft <= 100){
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBossAlertChannelID).send({ content: `|| <@&${upcomingBossPingRoleID}> ||`, embeds: [upcomingBossEmbed] });
                            return true;
                        } else {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingBossAlertChannelID).send({ embeds: [upcomingBossEmbed] });
                            return true;
                        }
                    } else {
                        console.log(`[MCHPB] Error occured while sending upcoming pve boss alert in #${upcomingBossAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${upcomingBossAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHPB] Error occured while finding upcoming pve boss alert channel!');
                return false;
            }
        } catch {
			return 'ERROR';
        }
    }
}