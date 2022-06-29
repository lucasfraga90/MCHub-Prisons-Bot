const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'next_boss'
    },
    async execute(regexMatches, discordBot, constantConfigValue, isDiscordBotReady, isIngameBotReady){
        try {

            const guildID = constantConfigValue.discord_bot.guild_id;
    
            const nextBossAlertChannelID = constantConfigValue.discord_channels.pve_boss;

            const nextBossPingRoleID = constantConfigValue.roles_id.pve_boss_ping;

            const nextBossDetails = regexMatches[0];

            const nextBossKillsLeft = Number(nextBossDetails[0]);

            const nextBossEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('NEXT PVE BOSS EVENT')
                .setDescription(`Mob Kills Left: ${nextBossKillsLeft}`)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(nextBossAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(nextBossAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(nextBossAlertChannelID).has('SEND_MESSAGES') === true){
                        if(nextBossKillsLeft <= 100){
                            discordBot.guilds.cache.get(guildID).channels.cache.get(nextBossAlertChannelID).send({ content: `|| <@&${nextBossPingRoleID}> ||`, embeds: [nextBossEmbed] });
                        } else {
                            discordBot.guilds.cache.get(guildID).channels.cache.get(nextBossAlertChannelID).send({ embeds: [nextBossEmbed] });
                        }
                    } else {
                        console.log('[MCHPB] Error occured while sending next pve boss alert in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(nextBossAlertChannelID).name + '!');
                    }
                } else {
                    console.log('[MCHPB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(nextBossAlertChannelID).name + '!');
                }
            } else {
                console.log('[MCHPB] Error occured while finding next pve boss alert channel!');
            }
            return isDiscordBotReady = true, isIngameBotReady = true;
        } catch {
            console.log('[MCHPB] Error occured while executing next boss alert handler! Restarting the bot...');
			try {
				discordBot.destroy();
				ingameBot.end;
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			} catch {
				console.log('[MCHPB] Error occured while restarting the bot properly!');
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			}
        }
    }
}