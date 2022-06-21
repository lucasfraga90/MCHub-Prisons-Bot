const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restart the bot. [Trusted Command]')
		.setDMPermission(false),
		
	async execute(interaction, updatedConfigValue, discordBot, ingameBot){

		const discordBotAdmin = updatedConfigValue.roles_id.admin;

		const discordBotTrusted = updatedConfigValue.roles_id.trusted;

		if(interaction.member.roles.cache.some(discordRole => discordRole.id === discordBotAdmin) === true || interaction.member.roles.cache.some(discordRole => discordRole.id === discordBotTrusted) === true){
			await interaction.editReply({content: '```Restarting...```', ephemeral: true }).then(() => {
				console.log('[MCHPB] Restarting the bot...');
				console.log('[MCHPB] Disconnecting from the Discord bot...');
				try{
					discordBot.destroy();
					console.log('[MCHPB] Disconnected from the Discord bot.');
				} catch {
					console.log('[MCHPB] Error occured while disconnecting from the Discord bot! Shutting down the bot.');
					process.exit(0);
				}
				console.log('[MCHPB] Disconnecting from MCHUB.COM...');
				try{
					ingameBot.quit();
					console.log('[MCHPB] Disconnected from the MCHub.COM.');
					return true;
				} catch {
					console.log('[MCHPB] Error occured while disconnecting from MCHub.COM! Shutting down the bot.');
					process.exit(0);
				}
				process.exit(0);});
		} else {
			await interaction.editReply({ content: '```You are not allowed to run this command!```', ephemeral: true });
			return false;
		}
	},
};