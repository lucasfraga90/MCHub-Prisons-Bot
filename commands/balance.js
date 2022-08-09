const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription("Shows A Player's E-Token/Beacon/Boss Credit/Omnitool Rename Balance.")
		.setDMPermission(false)
		.addSubcommand(e_token => 
			e_token.setName('e-token')
			.setDescription("Shows A Player's E-Token Balance.")
			.addStringOption(playerIGN =>
				playerIGN.setName('player-ign')
				.setDescription('Minecraft Username.')
				.setRequired(true)
				.setMinLength(3)
				.setMaxLength(15)))
		.addSubcommand(beacon => 
			beacon.setName('beacon')
			.setDescription("Shows A Player's Beacon Balance.")
			.addStringOption(playerIGN =>
				playerIGN.setName('player-ign')
				.setDescription('Minecraft Username.')
				.setRequired(true)
				.setMinLength(3)
				.setMaxLength(15)))
		.addSubcommand(boss_credit => 
			boss_credit.setName('boss-credit')
			.setDescription("Shows A Player's Boss Credit Balance.")
			.addStringOption(playerIGN =>
				playerIGN.setName('player-ign')
				.setDescription('Minecraft Username.')
				.setRequired(true)
				.setMinLength(3)
				.setMaxLength(15)))
		.addSubcommand(pearl =>
			pearl.setName('pearl')
			.setDescription("Shows A Player's Pearl Balance.")
			.addStringOption(playerIGN =>
				playerIGN.setName('player-ign')
				.setDescription('Minecraft Username.')
				.setRequired(true)
				.setMinLength(3)
				.setMaxLength(15)))
		.addSubcommand(omnitool_rename => 
			omnitool_rename.setName('omnitool-rename')
			.setDescription("Shows A Player's Omnitool Rename Balance.")
			.addStringOption(playerIGN =>
				playerIGN.setName('player-ign')
				.setDescription('Minecraft Username.')
				.setRequired(true)
				.setMinLength(3)
				.setMaxLength(15))),
	async execute(discordSlashCommandDetails, prisonsBot){
		try {

			const playerIGN = discordSlashCommandDetails.options.getString('player-ign');

			const playerIGNRegex = new RegExp(/^([0-9A-Za-z_*]+)$/, 'm');

			if(playerIGNRegex.test(playerIGN) === false){
				await discordSlashCommandDetails.editReply({ content: '```' + `${playerIGN} is not a valid Minecraft Username!` + '```', ephemeral: true });
				return false;
			}
			
			const subCommand = discordSlashCommandDetails.options.getSubcommand();

			let discordSlashCommandResult;

			switch(subCommand){
				case 'e-token':
					
					const playerETokenBalanceMessageStringRegex = `^MCHUB \» ${playerIGN} has ([0-9,]+) E-Tokens\!`;

					const playerETokenBalanceMessageRegex = new RegExp(playerETokenBalanceMessageStringRegex, 'm');

					const getPlayerETokenBalanceMessage = prisonsBot.findMessage(5000, playerETokenBalanceMessageRegex).then(getPlayerETokenBalanceMessageResult => {
						if(getPlayerETokenBalanceMessageResult === false){
							discordSlashCommandDetails.editReply({ content: '```' + `Error occured while obtaining ${playerIGN}'s e-token balance!` + '```', ephemeral: true });

							discordSlashCommandResult = false;

						} else {

							const playerETokenBalanceDetails = String(getPlayerETokenBalanceMessageResult).match(playerETokenBalanceMessageRegex);

							const playerETokenBalance = playerETokenBalanceDetails[1];

							const playerETokenBalanceInfo = `IGN: ${playerIGN} | E-Token Balance: ${playerETokenBalance}`;

							discordSlashCommandDetails.editReply({ content: '```' + playerETokenBalanceInfo + '```', ephemeral: true });

							discordSlashCommandResult = true;

						}
					});

					await prisonsBot.chat(`/etokensbal ${playerIGN}`);
					await getPlayerETokenBalanceMessage;
					break;
				case 'beacon':

					const playerBeaconBalanceMessageStringRegex = `^MCHUB \» ${playerIGN} has ([0-9,]+) beacons\!`;

					const playerBeaconBalanceMessageRegex = new RegExp(playerBeaconBalanceMessageStringRegex, 'm');

					const getPlayerBeaconBalanceMessage = prisonsBot.findMessage(5000, playerBeaconBalanceMessageRegex).then(getPlayerBeaconBalanceMessageResult => {
						if(getPlayerBeaconBalanceMessageResult === false){
							discordSlashCommandDetails.editReply({ content: '```' + `Error occured while obtaining ${playerIGN}'s beacon balance!` + '```', ephemeral: true });
						
							discordSlashCommandResult = false;

						} else {
							const playerBeaconBalanceDetails = String(getPlayerBeaconBalanceMessageResult).match(playerBeaconBalanceMessageRegex);

							const playerBeaconBalance = playerBeaconBalanceDetails[1];

							const playerBeaconBalanceInfo = `IGN: ${playerIGN} | Beacon Balance: ${playerBeaconBalance}`;

							discordSlashCommandDetails.editReply({ content: '```' + playerBeaconBalanceInfo + '```', ephemeral: true });
					
							discordSlashCommandResult = true;
							
						}
					});

					await prisonsBot.chat(`/beaconsbal ${playerIGN}`);
					await getPlayerBeaconBalanceMessage;
					break;
				case 'boss-credit':

					const playerBossCreditBalanceMessageStringRegex = `^MCHUB \» ${playerIGN} has ([0-9,]+) Boss Credits\!`;

					const playerBossCreditBalanceMessageRegex = new RegExp(playerBossCreditBalanceMessageStringRegex, 'm');

					const getPlayerBossCreditBalanceMessage = prisonsBot.findMessage(5000, playerBossCreditBalanceMessageRegex).then(getPlayerBossCreditBalanceMessageResult => {
						if(getPlayerBossCreditBalanceMessageResult === false){
							discordSlashCommandDetails.editReply({ content: '```' + `Error occured while obtaining ${playerIGN}'s boss credit balance!` + '```', ephemeral: true });
					
							discordSlashCommandResult = false;

						} else {

							const playerBossCreditBalanceDetails = String(getPlayerBossCreditBalanceMessageResult).match(playerBossCreditBalanceMessageRegex);

							const playerBossCreditBalance = playerBossCreditBalanceDetails[1];

							const playerBossCreditBalanceInfo = `IGN: ${playerIGN} | Boss Credit Balance: ${playerBossCreditBalance}`;

							discordSlashCommandDetails.editReply({ content: '```' + playerBossCreditBalanceInfo + '```', ephemeral: true });

							discordSlashCommandResult = true;

						}
					});

					await prisonsBot.chat(`/bosscreditsbal ${playerIGN}`);
					await getPlayerBossCreditBalanceMessage;
					break;
				case 'pearl':

					const playerPearlBalanceMessageStringRegex = `^MCHUB \» ${playerIGN} has ([0-9]+) Pearls\!`;
	
					const playerPearlBalanceMessageRegex = new RegExp(playerPearlBalanceMessageStringRegex, 'm');
	
					const getPlayerPearlBalanceMessage = prisonsBot.findMessage(5000, playerPearlBalanceMessageRegex).then(getPlayerPearlBalanceMessageResult => {
						if(getPlayerPearlBalanceMessageResult === false){
							discordSlashCommandDetails.editReply({ content: '```' + `Error occured while obtaining ${playerIGN}'s pearl balance!` + '```', ephemeral: true });
					
							discordSlashCommandResult = false;

						} else {

							const playerPearlBalanceDetails = String(getPlayerPearlBalanceMessageResult).match(playerPearlBalanceMessageRegex);
	
							const playerPearlBalance = playerPearlBalanceDetails[1];
	
							const playerPearlBalanceInfo = `IGN: ${playerIGN} | Pearl Balance: ${playerPearlBalance}`;
	
							discordSlashCommandDetails.editReply({ content: '```' + playerPearlBalanceInfo + '```', ephemeral: true });
					
							discordSlashCommandResult = true;

						}
					});
	
					await prisonsBot.chat(`/pearlbal ${playerIGN}`);
					await getPlayerPearlBalanceMessage;
					break;
				case 'omnitool-rename':
					
					const playerOmnitoolRenameBalanceMessageStringRegex = `^Renames \» ${playerIGN} has ([0-9,]+) renames\!`;
	
					const playerOmnitoolRenameBalanceMessageRegex = new RegExp(playerOmnitoolRenameBalanceMessageStringRegex, 'm');
	
					const getPlayerOmnitoolRenameBalanceMessage = prisonsBot.findMessage(5000, playerOmnitoolRenameBalanceMessageRegex).then(getPlayerOmnitoolRenameBalanceMessageResult => {
						if(getPlayerOmnitoolRenameBalanceMessageResult === false){
							discordSlashCommandDetails.editReply({ content: '```' + `Error occured while obtaining ${playerIGN}'s omnitool rename balance!` + '```', ephemeral: true });
					
							discordSlashCommandResult = false;

						} else {

							const playerOmnitoolRenameBalanceDetails = String(getPlayerOmnitoolRenameBalanceMessageResult).match(playerOmnitoolRenameBalanceMessageRegex);
	
							const playerOmnitoolRenameBalance = playerOmnitoolRenameBalanceDetails[1];
	
							const playerOmnitoolRenameBalanceInfo = `IGN: ${playerIGN} | Omnitool Rename Balance: ${playerOmnitoolRenameBalance}`;
	
							discordSlashCommandDetails.editReply({ content: '```' + playerOmnitoolRenameBalanceInfo + '```', ephemeral: true });
					
							discordSlashCommandResult = true;

						}
					});
	
					await prisonsBot.chat(`/renamesbal ${playerIGN}`);
					await getPlayerOmnitoolRenameBalanceMessage;
					break;
			}
			return discordSlashCommandResult;
		} catch {
			await discordSlashCommandDetails.editReply({ content: '```Error occured while executing this command!```', ephemeral:true });
			return 'ERROR';
		}
	}
};