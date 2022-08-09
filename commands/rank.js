const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription("Shows A Player's Prestige & Mine Rank.")
		.setDMPermission(false)
        .addStringOption(playerIGN => 
            playerIGN.setName('player-ign')
            .setDescription('Minecraft Username.')
            .setRequired(true)
            .setMinLength(3)
            .setMaxLength(15)),
	async execute(discordSlashCommandDetails, prisonsBot){
		try{

            const playerIGN = discordSlashCommandDetails.options.getString('player-ign');

            const playerIGNRegex = new RegExp(/^([0-9A-Za-z_*]+)$/, 'm');

            if(playerIGNRegex.test(playerIGN) === false){
                await discordSlashCommandDetails.editReply({ content: '```' + `${playerIGN} is not a valid Minecraft Username!` + '```', ephemeral: true });
                return false;
            }

            const playerPrestigeAndMineRankMessageStringRegex = `^MCHUB \»  ${playerIGN} is Prestige ([0-9,]+) Rank ([0-9,]+)\!`;

            const playerPrestigeAndMineRankMessageRegex = new RegExp(playerPrestigeAndMineRankMessageStringRegex, 'm');

            let discordSlashCommandResult;

            const getPlayerPrestigeAndMineRankMessage = prisonsBot.findMessage(5000, playerPrestigeAndMineRankMessageRegex).then(getPlayerPrestigeAndMineRankMessageResult => {
                if(getPlayerPrestigeAndMineRankMessageResult === false){
                    discordSlashCommandDetails.editReply({ content: '```' + `Error occured while obtaining ${playerIGN}'s prestige & mine rank!` + '```', ephemeral: true });

                    discordSlashCommandResult = false;

                } else {

                    const playerPrestigeAndMineRankDetails = String(getPlayerPrestigeAndMineRankMessageResult).match(playerPrestigeAndMineRankMessageRegex);

                    const playerPrestige = playerPrestigeAndMineRankDetails[1];

                    const playerMineRank = playerPrestigeAndMineRankDetails[2];

                    const playerPrestigeAndMineRankInfo = `IGN: ${playerIGN} | Prestige: ${playerPrestige} | Mine Rank: ${playerMineRank}`;

                    discordSlashCommandDetails.editReply({ content: '```' + playerPrestigeAndMineRankInfo + '```', ephemeral: true });

                    discordSlashCommandResult = true;

                }
            });
            
            await prisonsBot.chat(`/rank ${playerIGN}`);
            await getPlayerPrestigeAndMineRankMessage;
            return discordSlashCommandResult;
		} catch {
			await discordSlashCommandDetails.editReply({ content: '```Error occured while executing this command!```', ephemeral: true });
			return 'ERROR';
		}
	}
};