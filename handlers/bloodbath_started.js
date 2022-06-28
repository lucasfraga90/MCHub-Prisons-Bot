const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'bloodbath_started'
    },
    async execute(regexMatches, discordBot, constantConfigValue, isDiscordBotReady, isIngameBotReady){    
        try {

            const guildID = constantConfigValue.discord_bot.guild_id;
    
            const bloodbathStartedAlertChannelID = constantConfigValue.discord_channels.bloodbath;

            const bloodbathStartedPingRoleID = constantConfigValue.roles_id.bloodbath_ping;

            const bloodbathStartedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('BLOODBATH STARTED')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/crossed-swords_2694-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(bloodbathStartedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(bloodbathStartedAlertChannelID).has('SEND_MESSAGES') === true){
                        discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).send({ content: `|| <@&${bloodbathStartedPingRoleID}> ||`, embeds: [bloodbathStartedEmbed] });
                    } else {
                        console.log('[MCHPB] Error occured while sending bloodbath started alert in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).name + '!');
                    }
                } else {
                    console.log('[MCHPB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(bloodbathStartedAlertChannelID).name + '!');
                }
            } else {
                console.log('[MCHPB] Error occured while finding bloodbath started alert channel!');
            }
            return isDiscordBotReady = true, isIngameBotReady = true;
        } catch {
            console.log('[MCHPB] Error occured while executing bloodbath started alert handler! Restarting the bot...');
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