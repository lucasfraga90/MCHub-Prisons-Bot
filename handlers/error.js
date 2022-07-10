module.exports = {
    data: {
        name: 'error'
    },
    execute(errorInfo, discordBot, ingameBot, isDiscordBotReady, isIngameBotReady){
        console.log(`Error: ${errorInfo}`);
        discordBot.destroy();
        ingameBot.end;
        return isDiscordBotReady = false, isIngameBotReady = false, process.exit(0);
    }
}