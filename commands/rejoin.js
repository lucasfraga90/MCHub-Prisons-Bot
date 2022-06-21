const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('rejoin')
		.setDescription('Make the bot rejoin Atlantic Prisons. [Trusted Command]')
		.setDMPermission(false),
		
	async execute(interaction, updatedConfigValue, ingameBot){

		const discordBotAdmin = updatedConfigValue.roles_id.admin;

		const discordBotTrusted = updatedConfigValue.roles_id.trusted;

		if(interaction.member.roles.cache.some(discordRole => discordRole.id === discordBotAdmin) === true || interaction.member.roles.cache.some(discordRole => discordRole.id === discordBotTrusted) === true){
			await interaction.editReply({ content: '```Attempting to send the bot to Atlantic Prisons...```', ephemeral: true });
            try{
                ingameBot.chat('/server atlantic11');
				return true;
            } catch {
                await interaction.editReply({ content: '```Error occured while attempting to send the bot to Atlantic Prisons! Shutting down the bot.```', ephemeral: true });
                process.exit(0);
            }
		} else {
			await interaction.editReply({ content: '```You are not allowed to run this command!```', ephemeral: true });
			return false;
		}
	},
};