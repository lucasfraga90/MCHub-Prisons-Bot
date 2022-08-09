const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reconnect')
		.setDescription('Reconnect Prisons Bot To Atlantic Prisons. [Trusted Command]')
		.setDMPermission(false),
	async execute(discordSlashCommandDetails, configValue, prisonsBot){
		try{

			const prisonsBotAdminRoleID = configValue.role_id.bot_admin;

			const prisonsBotTrustedRoleID = configValue.role_id.bot_trusted;

			const atlanticSeason = configValue.prisons_bot.season;

			let discordSlashCommandResult;

			if(discordSlashCommandDetails.member.roles.cache.some(discordSlashCommandUserRole => discordSlashCommandUserRole.id === prisonsBotAdminRoleID || discordSlashCommandUserRole.id === prisonsBotTrustedRoleID) === true){

				const reconnectSuccessMessage = `Attempting to send you to atlantic${atlanticSeason}...`;
			
				const reconnectToAtlanticPrisons = prisonsBot.findMessage(5000, reconnectSuccessMessage).then(reconnectToAtlanticPrisonsResult => {
					if(reconnectToAtlanticPrisonsResult === false){
						discordSlashCommandDetails.editReply({ content: '```Error occured while reconnecting to Atlantic Prisons!```', ephemeral: true });

						discordSlashCommandResult = false;

					} else {
						discordSlashCommandDetails.edit({ content: '```' + reconnectToAtlanticPrisonsResult + '```', ephemeral: true });

						discordSlashCommandResult = true;

					}
				});
				await prisonsBot.chat(`/server atlantic${atlanticSeason}`);
				await reconnectToAtlanticPrisons;
			} else {
				await discordSlashCommandDetails.editReply({ content: '```You are not allowed to run this command!```', ephemeral: true });
				
				discordSlashCommandResult = false;

			}
			return discordSlashCommandResult;
		} catch {
			await discordSlashCommandDetails.editReply({ content: '```Error occured while executing this command!```', ephemeral: true });
			return 'ERROR';
		}
	}
};