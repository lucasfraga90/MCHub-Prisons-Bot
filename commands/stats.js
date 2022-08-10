const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription("Shows A Player's Prestige & Mine Rank/Blocks Broken Amount.")
        .setDMPermission(false)
        .addSubcommand(rank => 
            rank.setName('rank')
            .setDescription("Shows A Player's Prestige & Mine Rank.")
            .addStringOption(playerIGN => 
                playerIGN.setName('player-ign')
                .setDescription('Minecraft Username.')
                .setRequired(true)
                .setMinLength(3)
                .setMaxLength(15)))
        .addSubcommand(blocks_broken =>
            blocks_broken.setName('blocks-broken')
            .setDescription("Shows A Player's Blocks Broken Amount.")
            .addStringOption(playerIGN => 
                playerIGN.setName('player-ign')
                .setDescription('Minecraft Username.')
                .setRequired(true)
                .setMinLength(3)
                .setMaxLength(15))),
    async execute(discordSlashCommandDetails, prisonsBot){
        try {

            const playerIGN = discordSlashCommandDetails.options.getString('player-ign');

            let playerIGNRegex;
			
			if(String(playerIGN).startsWith('*') === true){

				playerIGNRegex = new RegExp(/^\*([0-9A-Za-z_]+)$/, 'm');

			} else {

				playerIGNRegex = new RegExp(/^([0-9A-Za-z_]+)$/, 'm');

			}

			if(playerIGNRegex.test(playerIGN) === false){
				await discordSlashCommandDetails.editReply({ content: '```' + `${playerIGN} is not a valid Minecraft Username!` + '```', ephemeral: true });
				return false;
			}

            const discordSlashSubCommand = discordSlashCommandDetails.options.getSubcommand();

            let discordSlashCommandResult;

            switch(discordSlashSubCommand){
                case 'rank':

                    const playerPrestigeAndMineRankMessageStringRegex = `^MCHUB \»  ${playerIGN} is Prestige ([0-9,]+) Rank ([0-9,]+)\!`;

                    const playerPrestigeAndMineRankMessageRegex = new RegExp(playerPrestigeAndMineRankMessageStringRegex, 'm');

                    const getPlayerPrestigeAndMineRankMessage = prisonsBot.findMessage(3000, playerPrestigeAndMineRankMessageRegex).then(async getPlayerPrestigeAndMineRankMessageResult => {

                        if(getPlayerPrestigeAndMineRankMessageResult === false){
                            await discordSlashCommandDetails.editReply({ content: '```' + `Error occured while obtaining ${playerIGN}'s prestige & mine rank!` + '```', ephemeral: true }).then(() => {

                                discordSlashCommandResult = false;

                            });
                        } else {

                            const playerPrestigeAndMineRankDetails = String(getPlayerPrestigeAndMineRankMessageResult).match(playerPrestigeAndMineRankMessageRegex);

                            const playerPrestige = playerPrestigeAndMineRankDetails[1];

                            const playerMineRank = playerPrestigeAndMineRankDetails[2];

                            const playerPrestigeAndMineRankInfo = `IGN: ${playerIGN} | Prestige: ${playerPrestige} | Mine Rank: ${playerMineRank}`;

                            await discordSlashCommandDetails.editReply({ content: '```' + playerPrestigeAndMineRankInfo + '```', ephemeral: true }).then(() => {

                                discordSlashCommandResult = true;

                            });
                        }
                    });
            
                    prisonsBot.chat(`/rank ${playerIGN}`);
                    await getPlayerPrestigeAndMineRankMessage;
                    break;
                case 'blocks-broken':

                    const playerBlocksBrokenMessageStringRegex = `^MCHUB \» ${playerIGN} has ([0-9,]+) blocks broken\!`;

                    const playerBlocksBrokenMessageRegex = new RegExp(playerBlocksBrokenMessageStringRegex, 'm');
        
                    const getPlayerBlocksBrokenMessage = prisonsBot.findMessage(3000, playerBlocksBrokenMessageRegex).then(async getPlayerBlocksBrokenMessageResult => {

                        if(getPlayerBlocksBrokenMessageResult === false){
                            await discordSlashCommandDetails.editReply({ content: '```' + `Error occured while obtaining ${playerIGN}'s blocks broken amount!` + '```', ephemeral: true }).then(() => {

                                discordSlashCommandResult = false;

                            });
                        } else {
                            
                            const playerBlocksBrokenDetails = String(getPlayerBlocksBrokenMessageResult).match(playerBlocksBrokenMessageRegex);
        
                            const playerBlocksBroken = playerBlocksBrokenDetails[1];
        
                            const playerBlocksBrokenInfo = `IGN: ${playerIGN} | Blocks Broken: ${playerBlocksBroken}`;
        
                            await discordSlashCommandDetails.editReply({ content: '```' + playerBlocksBrokenInfo + '```', ephemeral: true }).then(() => {

                                discordSlashCommandResult = true;

                            });
                        }
                    });
        
                    prisonsBot.chat(`/blockbrokenbal ${playerIGN}`);
                    await getPlayerBlocksBrokenMessage;
                    break;
            }
            return discordSlashCommandResult;
        } catch {
            await discordSlashCommandDetails.editReply({ content: '```Error occured while executing this command!```', ephemeral:true });
			return 'ERROR';
        }
    }
};