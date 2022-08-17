const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_prospector'
    },
    async execute(regexMatches, guildID, clientID, configValue, discordBot){
        try {
    
            const upcomingProspectorAlertChannelID = configValue.discord_channel.upcoming_prospector;

            const upcomingProspectorAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingProspectorAlertChannelID).name;

            const upcomingProspectorPingRoleID = configValue.role_id.upcoming_prospector;

            const upcomingProspectorDetails = regexMatches[0];

            const upcomingProspectorTime = String(upcomingProspectorDetails[0]);

            const upcomingProspectorEmbedDescription = `Last Proc: ${upcomingProspectorTime} Ago`;

            function tagOnAlert(){
                
                const upcomingProspectorMinutesRegexMatches = upcomingProspectorTime.match(new RegExp(/^([0-9]+)m/, 'm'));

                if(upcomingProspectorMinutesRegexMatches !== null){
                    if(upcomingProspectorMinutesRegexMatches[1] >= 50){
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }

            const upcomingProspectorEmbed = new DiscordJS.EmbedBuilder()
                .setColor('#4422bf')
                .setTitle('UPCOMING PROSPECTOR')
                .setDescription(upcomingProspectorEmbedDescription)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull-and-crossbones_2620-fe0f.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/26/Emerald_JE3_BE3.png/revision/latest/scale-to-width-down/160?cb=20191229174220' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingProspectorAlertChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingProspectorAlertChannelID).permissionsFor(clientID).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingProspectorAlertChannelID).permissionsFor(clientID).has('SendMessages') === true){
                        if(tagOnAlert() === true){
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingProspectorAlertChannelID).send({ content: `|| <@&${upcomingProspectorPingRoleID}> ||`, embeds: [upcomingProspectorEmbed] });
                        } else {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(upcomingProspectorAlertChannelID).send({ embeds: [upcomingProspectorEmbed] });
                        }
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending upcoming prospector alert in #${upcomingProspectorAlertChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${upcomingProspectorAlertChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding upcoming prospector alert channel!');
            }
            return false;
        } catch {
			return 'ERROR';
        }
    }
}