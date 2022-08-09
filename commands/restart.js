const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restart Prisons Bot. [Admin Command]')
		.setDMPermission(false),
	execute(discordSlashCommandDetails, configValue, discordBot, prisonsBot, logDiscordSlashCommandUsage){
		try{

			const prisonsBotAdminRoleID = configValue.role_id.bot_admin;

			if(discordSlashCommandDetails.member.roles.cache.some(discordSlashCommandUserRole => discordSlashCommandUserRole.id === prisonsBotAdminRoleID) === true){
				discordSlashCommandDetails.editReply({content: '```Restarting prisons bot...```', ephemeral: true }).then(() => {
					console.log('[MCHPB] Restarting prisons bot...');
					discordSlashCommandDetails.editReply({content: '```Disconnecting from MCHub.COM...```', ephemeral: true });
					console.log('[MCHPB] Disconnecting from MCHub.COM...')
					prisonsBot.end();
					discordSlashCommandDetails.editReply({content: '```Disconnected from MCHub.COM.```', ephemeral: true }).then(() => {
						console.log('[MCHPB] Disconnected from MCHub.COM.');
						logDiscordSlashCommandUsage(discordSlashCommandDetails, true);
						discordSlashCommandDetails.editReply({content: '```Restarting prisons bot...```', ephemeral: true }).then(() => {
							console.log('[MCHPB] Disconnecting from the Discord Bot...');
							discordBot.destroy();
							console.log('[MCHPB] Disconnected from the Discord Bot.');
							return process.exit(0);
						});
					});
				});
			} else {
				discordSlashCommandDetails.editReply({ content: '```You are not allowed to run this command!```', ephemeral: true });
				logDiscordSlashCommandUsage(discordSlashCommandDetails, false);
				return;
			}
		} catch {
			console.log('[MCHPB] Error occured while restarting prisons bot! Force restarting prisons bot...');
			discordSlashCommandDetails.editReply({ content: '```Error occured while executing this command! Force restarting prisons bot...```', ephemeral: true });
			logDiscordSlashCommandUsage(discordSlashCommandDetails, 'ERROR');
			return process.exit(0);
		}
	}
};