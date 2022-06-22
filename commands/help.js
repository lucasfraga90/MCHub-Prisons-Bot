const { SlashCommandBuilder } = require('@discordjs/builders');

const DiscordJS = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows commands list.')
		.setDMPermission(false),
	async execute(interaction){

		const helpMenuEmbed = new DiscordJS.MessageEmbed()
			.setColor('#4821bf')
			.setTitle('COMMANDS LIST')
			.setURL('https://www.twitch.tv/officialqimiegames')
			.setDescription(`/help = Shows this menu.

				/rejoin = Make the bot rejoin Atlantic Prisons. [Trusted Command]
				
				/restart = Restart the bot. [Trusted Command]`)
			.setThumbnail('https://i.imgur.com/3ovjQst.png')
			.setTimestamp()
			.setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });
		try{
			await interaction.editReply({ embeds: [helpMenuEmbed], ephemeral: true });
			return true;
		} catch {
			return false;
		}
	},
};