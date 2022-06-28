const DiscordJS = require('discord.js');

module.exports = {
    data: {
        name: 'global_booster_started'
    },
    async execute(regexMatches, discordBot, constantConfigValue, isDiscordBotReady, isIngameBotReady){
        console.log(regexMatches);
        try {
            const guildID = constantConfigValue.discord_bot.guild_id;
    
            const globalBoosterStartedAlertChannelID = constantConfigValue.discord_channels.global_booster;

            const globalBoosterStartedPingRoleID = constantConfigValue.roles_id.global_booster_ping;

            const globalBoosterDetail = regexMatches[0];

            const globalBoosterOwner = globalBoosterDetail[0];

            const globalBoosterRarity = globalBoosterDetail[1];

            const globalBoosterType = globalBoosterDetail[2];

            const globalBoosterDurationString = globalBoosterDetail[3];

            let globalBoosterStartedThumbnailURL;

            function isGBoosterImportant(globalBoosterDurationString, globalBoosterType, globalBoosterStartedThumbnailURL){
                
                const globalBoosterMinutes = globalBoosterDurationString.match(new RegExp(/^([0-9]+) minutes/, 'm'));
            
                let functionResult;
            
                if(globalBoosterMinutes != null){
                    if(globalBoosterMinutes[1] >= 10){
                        functionResult = true;
                    } else {
                        functionResult = false;
                    }
                } else {
                    functionResult = false;
                }
                switch(globalBoosterType){
                    default:
                        return functionResult, globalBoosterStartedThumbnailURL = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/exclamation-mark_2757.png';
                        break;
                    case 'E-Token':
                        return functionResult, globalBoosterStartedThumbnailURL = 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/08/Magma_Cream_JE3_BE2.png/revision/latest?cb=20190501035730';
                        break;
                    case 'Proc Rate':
                        return functionResult, globalBoosterStartedThumbnailURL = 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e7/Diamond_Pickaxe_JE3_BE3.png/revision/latest?cb=20200226193952';
                        break;
                    case 'Lucky':
                        functionResult = false
                        return functionResult, globalBoosterStartedThumbnailURL = 'https://static.wikia.nocookie.net/minecraft/images/5/5d/Block_of_Gold.png/revision/latest?cb=20191012230129';
                        break;
                    case 'Quarry':
                        functionResult = false
                        return functionResult, globalBoosterStartedThumbnailURL = 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/d4/Magenta_Shulker_Box_Revision_1.png/revision/latest?cb=20190407101826';
                        break;
                }
            }

            const globalBoosterStartedEmbed = new DiscordJS.MessageEmbed()
                .setColor('#eb8334')
                .setTitle('GLOBAL BOOSTER STARTED')
                .setDescription(`Owner: ${globalBoosterOwner}\n` + `Type: ${globalBoosterType}\n` + `Rarity: ${globalBoosterRarity}\n` + `Duration: ${globalBoosterDurationString}`)
                .setThumbnail(`${globalBoosterStartedThumbnailURL}`)
                .setTimestamp()
                .setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
    
            if(discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterStartedAlertChannelID) != undefined){
                if(discordBot.guilds.cache.get(guildID).me.permissionsIn(globalBoosterStartedAlertChannelID).has('VIEW_CHANNEL') === true){
                    if(discordBot.guilds.cache.get(guildID).me.permissionsIn(globalBoosterStartedAlertChannelID).has('SEND_MESSAGES') === true){
                        if(isGBoosterImportant(globalBoosterDurationString, globalBoosterType) === true){
                            discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterStartedAlertChannelID).send({ content: `|| <@&${globalBoosterStartedPingRoleID}> ||`, embeds: [globalBoosterStartedEmbed] });
                        } else {
                            discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterStartedAlertChannelID).send({ embeds: [globalBoosterStartedEmbed] });
                        }
                    } else {
                        console.log('[MCHPB] Error occured while sending global booster started alert in #' + discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterStartedAlertChannelID).name + '!');
                    }
                } else {
                    console.log('[MCHPB] Error occured while viewing #' + discordBot.guilds.cache.get(guildID).channels.cache.get(globalBoosterStartedAlertChannelID).name + '!');
                }
            } else {
                console.log('[MCHPB] Error occured while global booster started alert channel!');
            }
            return isDiscordBotReady = true, isIngameBotReady = true;
        } catch {
            console.log('[MCHPB] Error occured while executing global booster started alert handler! Restarting the bot...');
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