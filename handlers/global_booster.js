const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'global_booster'
    },
    async execute(regexMatches, discordBot, configValue, guildID){
        try {
    
            const globalBoosterAlertChannelID = configValue.discord_channel.global_booster;

            const globalBoosterAlertChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterAlertChannelID).name;

            const globalBoosterPingRoleID = configValue.role_id.global_booster_ping;

            const globalBoosterDetails = regexMatches[0];

            const globalBoosterType = globalBoosterDetails[2];

            const globalBoosterRarity = globalBoosterDetails[1];

            const globalBoosterDuration = String(globalBoosterDetails[3]);

            const underscoreRegex = new RegExp(/([_])/, 'g');

            let globalBoosterOwner = globalBoosterDetails[0];

            let globalBoosterThumbnailURL;

            function isGBoosterImportant(){

                const globalBoosterMinutes = globalBoosterDuration.match(new RegExp(/^([0-9]+) minutes/, 'm'));

                const globalBoosterHour = globalBoosterDuration.match(/^([0-9]+) (hours||hour)/, 'm');

                if(globalBoosterHour !== null){
                    switch(globalBoosterType){
                        default:
                            return false;
                            break;
                        case 'Proc Rate':
                            return true;
                            break;
                        case 'E-Token':
                            return true;
                            break;
                        case 'Lucky':
                            return false;
                            break;
                        case 'Quarry':
                            return false;
                            break;
                    }
                } else {
                    if(globalBoosterMinutes !== null){
                        if(globalBoosterMinutes[1] >= 10){
                            switch(globalBoosterType){
                                default:
                                    return false;
                                    break;
                                case 'Proc Rate':
                                    return true;
                                    break;
                                case 'E-Token':
                                    return true;
                                    break;
                                case 'Lucky':
                                    return false;
                                    break;
                                case 'Quarry':
                                    return false;
                                    break;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            }
            switch(globalBoosterType){
                default:

                    globalBoosterThumbnailURL = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/exclamation-mark_2757.png';
                    
                    break;
                case 'E-Token':

                    globalBoosterThumbnailURL = 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/08/Magma_Cream_JE3_BE2.png/revision/latest?cb=20190501035730';
                    
                    break;
                case 'Proc Rate':

                    globalBoosterThumbnailURL = 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e7/Diamond_Pickaxe_JE3_BE3.png/revision/latest?cb=20200226193952';
                    
                    break;
                case 'Lucky':

                    globalBoosterThumbnailURL = 'https://static.wikia.nocookie.net/minecraft/images/5/5d/Block_of_Gold.png/revision/latest?cb=20191012230129';
                    
                    break;
                case 'Quarry':

                    globalBoosterThumbnailURL = 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/d4/Magenta_Shulker_Box_Revision_1.png/revision/latest?cb=20190407101826';
                    
                    break;
            }
            if(underscoreRegex.test(globalBoosterOwner) !== false){
                globalBoosterOwner = globalBoosterOwner.replace(underscoreRegex, `\\_`);
            }

            const globalBoosterEmbedDescription =

            `Owner: ${globalBoosterOwner}
            Type: ${globalBoosterType}
            Rarity: ${globalBoosterRarity}
            Duration: ${globalBoosterDuration}`;

            const globalBoosterEmbed = new DiscordJS.EmbedBuilder()
                .setColor('#4422bf')
                .setTitle('GLOBAL BOOSTER')
                .setDescription(globalBoosterEmbedDescription)
                .setThumbnail(globalBoosterThumbnailURL)
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterAlertChannelID) !== undefined){
                if(discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterAlertChannelID).permissionsFor(discordBot.user.id).has('ViewChannel') === true){
                    if(discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterAlertChannelID).permissionsFor(discordBot.user.id).has('SendMessages') === true){
                        if(isGBoosterImportant() === true){
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterAlertChannelID).send({ content: `|| <@&${globalBoosterPingRoleID}> ||`, embeds: [globalBoosterEmbed] });
                        } else {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterAlertChannelID).send({ embeds: [globalBoosterEmbed] });
                        }
                        return true;
                    } else {
                        console.log(`[MCHPB] Error occured while sending global booster alert in #${globalBoosterAlertChannelName}!`);
                    }
                } else {
                    console.log(`[MCHPB] Error occured while viewing #${globalBoosterAlertChannelName}!`);
                }
            } else {
                console.log('[MCHPB] Error occured while global booster alert channel!');
            }
            return false;
        } catch {
            return 'ERROR';
        }
    }
}