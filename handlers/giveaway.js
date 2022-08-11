const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'giveaway'
    },
    async execute(regexMatches, guildID, clientID, configValue, discordBot){
        try {

            const giveawayAlertChannelID = configValue.discord_channel.giveaway;

            const giveawayAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(giveawayAlertChannelID).name;

            const giveawayDetails = regexMatches[0];
            
            const giveawayType = giveawayDetails[0];

            const giveawayDate = giveawayDetails[1];

            const giveawayWinners = String(giveawayDetails[2]).split(', ');

            const underscoreRegex = new RegExp(/([_])/, 'g');

            let giveawayEmbedDescription = '';

            giveawayWinners.forEach(giveawayWinner => {

                const winnerCount = giveawayWinners.indexOf(giveawayWinner) + 1;

                giveawayWinner = giveawayWinner.replace(underscoreRegex, '\\_')

                giveawayEmbedDescription = `${giveawayEmbedDescription} Winner #${winnerCount}: ${giveawayWinner}\n`

            });

            const giveawayEmbed = new DiscordJS.EmbedBuilder()
                .setColor('#4422bf')
                .setTitle(`${String(giveawayType).toUpperCase()} GIVEAWAY (${giveawayDate})`)
                .setDescription(giveawayEmbedDescription)
                .setThumbnail('https://images.emojiterra.com/twitter/v13.1/512px/1f389.png')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
        
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(giveawayAlertChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(giveawayAlertChannelID).permissionsFor(clientID).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(giveawayAlertChannelID).permissionsFor(clientID).has('SendMessages') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(giveawayAlertChannelID).send({ embeds: [giveawayEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending giveaway alert in #${giveawayAlertChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${giveawayAlertChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding giveaway alert channel!');
            }
            return false;
        } catch {
            return 'ERROR';
        }
    }
}