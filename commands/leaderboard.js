const { SlashCommandBuilder } = require('@discordjs/builders');

const nodeFS = require('fs');

const DiscordJS = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows Various Leaderboard For MCHub - Atlantic Prisons. (Top 10)')
		.setDMPermission(false)
        .addSubcommand(rank =>
            rank.setName('rank')
            .setDescription('Shows Prestige & Mine Rank Leaderboard For MCHub - Atlantic Prisons. (Top 10 Players)'))
        .addSubcommand(blocks_broken =>
            blocks_broken.setName('blocks-broken')
            .setDescription('Shows Blocks Broken Amount Leaderboard For MCHub - Atlantic Prisons. (Top 10 Players)'))
        .addSubcommand(gang =>
            gang.setName('gang')
            .setDescription('Shows Gang Leaderboard For MCHub - Atlantic Prisons. (Top 10 Gangs)'))
        .addSubcommand(e_token =>
            e_token.setName('e-token')
            .setDescription('Shows E-Token Balance Leaderboard For MCHub - Atlantic Prisons. (Top 10 Players)'))
        .addSubcommand(beacon =>
            beacon.setName('beacon')
            .setDescription('Shows Beacon Balance Leaderboard For MCHub - Atlantic Prisons. (Top 10 Players)'))
        .addSubcommand(boss_credit =>
            boss_credit.setName('boss-credit')
            .setDescription('Shows Boss Credit Balance Leaderboard For MCHub - Atlantic Prisons. (Top 10 Players)'))
        .addSubcommand(pearl =>
            pearl.setName('pearl')
            .setDescription('Shows Pearl Balance Leaderboard For MCHub - Atlantic Prisons. (Top 10 Players)'))
        .addSubcommand(omnitool_rename =>
            omnitool_rename.setName('omnitool-rename')
            .setDescription('Shows Omnitool Rename Balance Leaderboard For MCHub - Atlantic Prisons. (Top 10 Players)')),
	async execute(discordSlashCommandDetails){
		try {
			await discordSlashCommandDetails.editReply({ content: '```This command is not ready yet! Coming soon...```', ephemeral: true });
			return true;
		} catch {
			await discordSlashCommandDetails.editReply({ content: '```Error occured while executing this command!```', ephemeral:true });
			return 'ERROR';
		}
	}
};