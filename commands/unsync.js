const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unsync')
		.setDescription('Be An Unverified Prisons Bot User.')
		.setDMPermission(false),
	async execute(discordSlashCommandDetails, configValue){
		try {
            
			const prisonsBotVerifiedUserRoleID = configValue.role_id.bot_verified;

			let discordSlashCommandResult;

			if(discordSlashCommandDetails.member.roles.cache.some(discordSlashCommandUserRole => discordSlashCommandUserRole.id === prisonsBotVerifiedUserRoleID) === true){
				await discordSlashCommandDetails.member.roles.remove(prisonsBotVerifiedUserRoleID).then(async () => {
					await discordSlashCommandDetails.editReply({ content: '```Unverification success.```', ephemeral: true }).then(() => {

						discordSlashCommandResult = true;

					});
				}).catch(async () => {
					await discordSlashCommandDetails.editReply({ content: '```Error occured while unverifying!```', ephemeral: true }).then(() => {

						discordSlashCommandResult = 'ERROR';

					});
				});
			} else {
				await discordSlashCommandDetails.editReply({ content: '```You are already an unverified prisons bot user!```', ephemeral: true }).then(() => {

					discordSlashCommandResult = false;					

				});
			}
			return discordSlashCommandResult;
		} catch {
			await discordSlashCommandDetails.editReply({ content: '```Error occured while executing this command!```', ephemeral: true });
			return 'ERROR';
		}
	}
};