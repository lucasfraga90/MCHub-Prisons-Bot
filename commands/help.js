const { SlashCommandBuilder } = require('@discordjs/builders');

const nodeFS = require('fs');

const DiscordJS = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows Commands List.')
		.setDMPermission(false),
	async execute(discordSlashCommandDetails){
		try{

			const commandsDIR = './commands/';

			const discordSlashCommandFiles = nodeFS.readdirSync(commandsDIR).filter(discordSlashCommandFilesName => discordSlashCommandFilesName.endsWith('.js') && discordSlashCommandFilesName !== 'help.js');
			
			let helpMenuEmbedDescription = '';

			discordSlashCommandFiles.forEach(discordSlashCommandFileName => {

				const discordSlashCommandFile = require(`./${discordSlashCommandFileName}`);

				helpMenuEmbedDescription = `${helpMenuEmbedDescription} /${discordSlashCommandFile.data.name} -> ${discordSlashCommandFile.data.description}\n\n`;

			});

			const helpMenuEmbed = new DiscordJS.EmbedBuilder()
				.setColor('#4422bf')
				.setTitle('COMMANDS LIST')
				.setDescription(helpMenuEmbedDescription)
				.setThumbnail('https://i.imgur.com/3ovjQst.png')
				.setTimestamp()
				.setFooter({ text: 'Custom Coded By QimieGames', iconURL: 'https://images-ext-1.discordapp.net/external/HQFug-TJRekRG6wkhZL_wlEowWtUxuuR940ammbrz7k/https/cdn.discordapp.com/avatars/402039216487399447/347fd513aa2af9e8b4ac7ca80150b953.webp?width=115&height=115' });

			await discordSlashCommandDetails.editReply({ embeds: [helpMenuEmbed], ephemeral: true });
			return true;
		} catch {
			await discordSlashCommandDetails.editReply({ content: '```Error occured while executing this command!```', ephemeral: true });
			return 'ERROR';
		}
	}
};