const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sync')
		.setDescription('Be A Verified Prisons Bot User.')
		.setDMPermission(false)
		.addStringOption(playerIGN =>
			playerIGN.setName('player-ign')
			.setDescription('Minecraft Username')
			.setRequired(true)
			.setMinLength(3)
			.setMaxLength(15)),
	async execute(discordSlashCommandDetails, prisonsBot, configValue){
		try {

			const prisonsBotVerifiedUserRoleID = configValue.role_id.bot_verified;

			if(discordSlashCommandDetails.member.roles.cache.some(discordSlashCommandUserRole => discordSlashCommandUserRole.id === prisonsBotVerifiedUserRoleID) === true){
				await discordSlashCommandDetails.editReply({ content: '```You are already a verified prisons bot user!```', ephemeral:true });
				return false;
			}

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

			const userVerificationCodePossibilities = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

			let userVerificationCode = '';

			for(let userVerificationCodeCharCount = 0; userVerificationCodeCharCount <= 4; userVerificationCodeCharCount++){

				userVerificationCode = `${userVerificationCode}${userVerificationCodePossibilities.charAt(Math.random() * userVerificationCodePossibilities.length)}`;

			}

			const atlanticSeason = configValue.prisons_bot.season;

			const userVerificationMessage = `\[Atlantic${atlanticSeason}\] \[${playerIGN} \-\> me\] ${userVerificationCode}`;

			const prisonsBotIGN = prisonsBot.username;

			let discordSlashCommandResult;

			await discordSlashCommandDetails.editReply({ content: '```' + `Verification Code: ${userVerificationCode} | Ingame Command: /msg ${prisonsBotIGN} ${userVerificationCode} | You Have 30 Seconds To Verify.` + '```', ephemeral: true }).then(async () => {

				const getUserVerificationMessage = prisonsBot.findMessage(30000, userVerificationMessage).then(async userVerificationMessageResult => {

					if(userVerificationMessageResult === false){
						await discordSlashCommandDetails.editReply({ content: '```Verication failed!```', ephemeral: true }).then(() => {

							discordSlashCommandResult = false;

						});
					} else {
						await discordSlashCommandDetails.member.roles.add(prisonsBotVerifiedUserRoleID).then(async () => {
							await discordSlashCommandDetails.editReply({ content: '```Verication success.```', ephemeral: true }).then(() => {
								prisonsBot.chat(`/msg ${playerIGN} Verification success.`);

								discordSlashCommandResult = true;

							});
						}).catch(async () => {
							await discordSlashCommandDetails.editReply({ content: '```Error occured while verifying!```', ephemeral:true }).then(() => {
								
								discordSlashCommandResult = 'ERROR';

							});
						});
					}
				});
	
				await getUserVerificationMessage;
			});
            return discordSlashCommandResult;
		} catch {
			await discordSlashCommandDetails.editReply({ content: '```Error occured while executing this command!```', ephemeral: true });
			return 'ERROR';
		}
	}
};