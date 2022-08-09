const nodeFS = require('fs');

module.exports = {
    data: {
        name: 'error'
    },
    execute(errorInfo, discordBot, prisonsBot){
        try {

            const errorOccuredDate = new Date();

            const errorLogDIR = '././error_logs/';

            const errorLogFileName = `ERROR_LOG-${errorOccuredDate.getDate()}_${errorOccuredDate.getMonth() + 1}_${errorOccuredDate.getFullYear()}-${errorOccuredDate.getHours()}_${errorOccuredDate.getMinutes()}_${errorOccuredDate.getSeconds()}`;

            console.log(`[MCHPB] Generating error log...`);
            nodeFS.appendFileSync(`${String(errorLogDIR)}${String(errorLogFileName)}.txt`, String(errorInfo), 'utf-8');
            console.log(`[MCHPB] Generated error log. File Name: ${errorLogFileName}.txt`);
            discordBot.destroy();
            prisonsBot.end();
            return;
        } catch {
            console.log('[MCHPB] Error occured while generating error log!');
            return;
        }
    }
}