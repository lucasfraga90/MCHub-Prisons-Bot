module.exports = {
    data: {
        name: 'scheduled_task'
    },
    async execute(ingameBot, isDiscordBotReady, isIngameBotReady){
        try {
            setInterval(async () => ingameBot.chat('/nextboss'), 300000);
            setInterval(async () => ingameBot.chat('/nextdungeon'), 300000);
            setInterval(async () => ingameBot.chat('/nextbloodbath'), 300000);
            return isDiscordBotReady = true, isIngameBotReady = true;
        } catch {
            console.log('[MCHPB] Error occured while executing scheduled task handler! Restarting the bot...');
			try {
				discordBot.destroy();
				ingameBot.end;
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			} catch {
				console.log('[MCHPB] Error occured while restarting the bot properly!');
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			}
        }
    }
}