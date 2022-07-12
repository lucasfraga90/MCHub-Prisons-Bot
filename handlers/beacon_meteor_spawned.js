const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'beacon_meteor_spawned'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const beaconMeteorSpawnedAlertChannelID = configValue.discord_channels.beacon_meteor_spawned;

            const beaconMeteorSpawnedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).name;

            const beaconMeteorSpawnedPingRoleID = configValue.roles_id.beacon_meteor_spawned_ping;

            const beaconMeteorSpawnedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('BEACON METEOR SPAWNED')
                .setThumbnail('https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e1/Beacon_JE5.png/revision/latest?cb=20200429134551')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(beaconMeteorSpawnedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(beaconMeteorSpawnedAlertChannelID).has('SEND_MESSAGES') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).send({ content: `|| <@&${beaconMeteorSpawnedPingRoleID}> ||`, embeds: [beaconMeteorSpawnedEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending beacon meteor spawned alert in #${beaconMeteorSpawnedAlertChannelName}!`);
                        return false;
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${beaconMeteorSpawnedAlertChannelName}!`);
                    return false;
                }
            } else {
                console.log('[MCHPB] Error occured while finding beacon meteor spawned alert channel!');
                return false;
            }
        } catch {
            return 'ERROR';
        }
    }
}