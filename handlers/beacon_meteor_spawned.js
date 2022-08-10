const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'beacon_meteor_spawned'
    },
    async execute(regexMatches, guildID, configValue, discordBot){
        try {
    
            const beaconMeteorSpawnedAlertChannelID = configValue.discord_channel.beacon_meteor_spawned;

            const beaconMeteorSpawnedAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).name;

            const beaconMeteorSpawnedPingRoleID = configValue.role_id.beacon_meteor_spawned_ping;

            const beaconMeteorSpawnedEmbed = new DiscordJS.EmbedBuilder()
                .setColor('#4422bf')
                .setTitle('BEACON METEOR')
                .setThumbnail('https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e1/Beacon_JE5.png/revision/latest?cb=20200429134551')
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

            if(discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).permissionsFor(discordBot.user.id).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).permissionsFor(discordBot.user.id).has('SendMessages') === true){
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(beaconMeteorSpawnedAlertChannelID).send({ content: `|| <@&${beaconMeteorSpawnedPingRoleID}> ||`, embeds: [beaconMeteorSpawnedEmbed] });
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending beacon meteor spawned alert in #${beaconMeteorSpawnedAlertChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${beaconMeteorSpawnedAlertChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while finding beacon meteor spawned alert channel!');
            }
            return false;
        } catch {
            return 'ERROR';
        }
    }
}