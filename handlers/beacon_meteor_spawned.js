const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'beacon_meteor_spawned'
    },
    async execute(regexMatches, discordBot, constantConfigValue, isDiscordBotReady, isIngameBotReady){
        try {

            const guildID = constantConfigValue.discord_bot.guild_id;
    
            const beaconMeteorSpawnedAlertChannelID = constantConfigValue.discord_channels.beacon_meteor;

            const beaconMeteorSpawnedPingRoleID = constantConfigValue.roles_id.beacon_meteor_ping;

            const beaconMeteorSpawnedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('BEACON METEOR SPAWNED')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/comet_2604-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(beaconMeteorSpawnedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(beaconMeteorSpawnedAlertChannelID).has('SEND_MESSAGES') === true){
                        discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).send({ content: `|| <@&${beaconMeteorSpawnedPingRoleID}> ||`, embeds: [beaconMeteorSpawnedEmbed] });
                    } else {
                        console.log('[MCHPB] Error occured while sending beacon meteor spawned alert in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).name + '!');
                    }
                } else {
                    console.log('[MCHPB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).name + '!');
                }
            } else {
                console.log('[MCHPB] Error occured while finding beacon meteor spawned alert channel!');
            }
            return isDiscordBotReady = true, isIngameBotReady = true;
        } catch {
            console.log('[MCHPB] Error occured while executing beacon meteor spawned alert handler! Restarting the bot...');
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