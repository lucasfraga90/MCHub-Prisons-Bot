const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_pve_boss'
    },
    async execute(regexMatches, guildID, clientID, configValue, discordBot){
        try {
    
            const upcomingPvEBossAlertChannelID = configValue.discord_channel.upcoming_pve_boss;

            const upcomingPvEBossAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingPvEBossAlertChannelID).name;

            const upcomingPvEBossPingRoleID = configValue.role_id.upcoming_pve_boss_ping;

            const upcomingPvEBossDetails = regexMatches[0];

            const upcomingPvEBossKillsLeft = Number(upcomingPvEBossDetails[0]);

            const upcomingPvEBossEmbedDescription = `PvE Mob Kills Left: ${upcomingPvEBossKillsLeft}`;

            const upcomingPvEBossEmbed = new DiscordJS.EmbedBuilder()
                .setColor('#4422bf')
                .setTitle('UPCOMING PVE BOSS')
                .setDescription(upcomingPvEBossEmbedDescription)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingPvEBossAlertChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingPvEBossAlertChannelID).permissionsFor(clientID).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingPvEBossAlertChannelID).permissionsFor(clientID).has('SendMessages') === true){
                        if(upcomingPvEBossKillsLeft <= 150){
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingPvEBossAlertChannelID).send({ content: `|| <@&${upcomingPvEBossPingRoleID}> ||`, embeds: [upcomingPvEBossEmbed] });
                        } else {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingPvEBossAlertChannelID).send({ embeds: [upcomingPvEBossEmbed] });
                        }
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending upcoming pve boss alert in #${upcomingPvEBossAlertChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${upcomingPvEBossAlertChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding upcoming pve boss alert channel!');
            }
            return false;
        } catch {
			return 'ERROR';
        }
    }
}