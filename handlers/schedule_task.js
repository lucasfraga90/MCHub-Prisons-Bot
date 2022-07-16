module.exports = {
    data: {
        name: 'schedule_task'
    },
    async execute(discordBot, ingameBot, configValue, isDiscordBotReady, isIngameBotReady){
        try {
            setInterval(async () => ingameBot.chat('/server atlantic12'), 180000); 
            if(configValue.features.upcoming_pve_boss === 'true'){
                setInterval(async () => ingameBot.chat('/nextboss'), 299500);  
            }
            if(configValue.features.upcoming_dungeon === 'true'){
                setInterval(async () => ingameBot.chat('/nextdungeon'), 1800000);
            }
            if(configValue.features.upcoming_bloodbath === 'true'){
                setInterval(async () => ingameBot.chat('/nextbloodbath'), 3600500);
            } 
            return isIngameBotReady = true;
        } catch {
            console.log('[MCHPB] Error occured while executing schedule task handler! Restarting the bot...');
			try {
				discordBot.destroy();
				ingameBot.end;
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			} catch {
				console.log('[MCHPB] Error occured while restarting the bot properly! Force restarting the bot...');
				return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
			}
        }
    }
}