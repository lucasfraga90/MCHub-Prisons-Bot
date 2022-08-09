const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bb')
		.setDescription("Shows A Player's Blocks Broken Amount.")
		.setDMPermission(false)
		.addStringOption(playerIGN => 
			playerIGN.setName('player-ign')
			.setDescription('Minecraft Username.')
			.setRequired(true)
			.setMinLength(3)
			.setMaxLength(15)),
	async execute(discordSlashCommandDetails, prisonsBot){
		try {

			const playerIGN = discordSlashCommandDetails.options.getString('player-ign');

			const playerIGNRegex = new RegExp(/^([0-9A-Za-z_*]+)$/, 'm');

			if(playerIGNRegex.test(playerIGN) === false){
				await discordSlashCommandDetails.editReply({ content: '```' + `${playerIGN} is not a valid Minecraft Username!` + '```', ephemeral: true });
				return false;
			}

			const playerBlocksBrokenMessageStringRegex = `^MCHUB \» ${playerIGN} has ([0-9,]+) blocks broken\!`;

			const playerBlocksBrokenMessageRegex = new RegExp(playerBlocksBrokenMessageStringRegex, 'm');

			let discordSlashCommandResult;

			const getPlayerBlocksBrokenMessage = prisonsBot.findMessage(5000, playerBlocksBrokenMessageRegex).then(getPlayerBlocksBrokenMessageResult => {
				if(getPlayerBlocksBrokenMessageResult === false){
					discordSlashCommandDetails.editReply({ content: '```' + `Error occured while obtaining ${playerIGN}'s blocks broken!` + '```', ephemeral: true });

					discordSlashCommandResult = false;

				} else {
					
					const playerBlocksBrokenDetails = String(getPlayerBlocksBrokenMessageResult).match(playerBlocksBrokenMessageRegex);

					const playerBlocksBroken = playerBlocksBrokenDetails[1];

					const playerBlocksBrokenInfo = `IGN: ${playerIGN} | Blocks Broken: ${playerBlocksBroken}`;

					discordSlashCommandDetails.editReply({ content: '```' + playerBlocksBrokenInfo + '```', ephemeral: true });

					discordSlashCommandResult = true;

				}
			});

			await prisonsBot.chat(`/blockbrokenbal ${playerIGN}`);
			await getPlayerBlocksBrokenMessage;
			return discordSlashCommandResult;
		} catch {
			await discordSlashCommandDetails.editReply({ content: '```Error occured while executing this command!```', ephemeral:true });
			return 'ERROR';
		}
	}
};