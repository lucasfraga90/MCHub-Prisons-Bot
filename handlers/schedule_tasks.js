module.exports = {
    data: {
        name: 'schedule_tasks'
    },
    async execute(configValue, prisonsBot){
        console.log('[MCHPB] Scheduling tasks...');
        try {

            const atlanticSeason = configValue.prisons_bot.season;

            async function scheduleAutoJoinRealm(){
                setTimeout(async () => {
                    prisonsBot.chat(`/server atlantic${atlanticSeason}`);
                }, 3000);
            }
            async function scheduleAutoReconnectToRealm(){
                setInterval(async () => {
                    prisonsBot.chat(`/server atlantic${atlanticSeason}`);
                }, 180000);
            }
            async function scheduleUpcomingPvEBoss(){
                setInterval(async () => {
                    prisonsBot.chat('/nextboss');
                }, 300000);
            }
            async function scheduleUpcomingDungeon(){
                setInterval(async () => {
                    prisonsBot.chat('/nextdungeon');
                }, 1800000);
            }
            async function scheduleUpcomingBloodbath(){
                setInterval(async () => {
                    prisonsBot.chat('/nextbloodbath');
                }, 3600000);
            }
            await scheduleAutoJoinRealm().then(async () => {
                await scheduleAutoReconnectToRealm().then(async () => {
                    await scheduleUpcomingPvEBoss().then(async () => {
                        await scheduleUpcomingDungeon().then(async () => {
                            await scheduleUpcomingBloodbath();
                        });
                    });
                });
            });
            return true;
        } catch(scheduleTaskError) {
            return scheduleTaskError;   
        }
    }
}