import language from "./language_pack/selected_language"
import bot_init from "./bot_initialization"
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import {PresaleBot} from "./presale_bot"

async function askTargetAddress() : Promise<string> {
    const rl = readline.createInterface({ input, output });
    rl.setPrompt(language.lang.ASK_TARGET_ADDR);
    rl.prompt();
    var answer : string;
    var asking_confirmation : boolean = false;
    for await (let line of rl) {
        if (asking_confirmation) {
            switch (line.toLowerCase()) {
                case 'y':
                    return answer;
                case 'n':
                    asking_confirmation = false;
                    rl.setPrompt(language.lang.ASK_TARGET_ADDR);
                    rl.prompt();
                    continue;
                default:
                    rl.setPrompt(language.lang.ONLY_Y_OR_N);
                    rl.prompt();
                    continue;
            }
        }
        answer = line;
        asking_confirmation = true;
        rl.setPrompt(language.lang.YOU_DIGITED + answer + "\n" + language.lang.CONFIRM);
        rl.prompt();
    }
}

async function askTriggerTime() : Promise<Date> {
    var trigger_time : Date = new Date();
    trigger_time.setSeconds(0);
    trigger_time.setMilliseconds(0);

    var rl = readline.createInterface({ input, output });
    rl.setPrompt(language.lang.INSERT_START_HOUR);
    rl.prompt();
    var answer : number;
    var asking_confirmation : boolean = false;
    for await (let line of rl) {
        if (asking_confirmation) {
            switch (line.toLowerCase()) {
                case 'y':
                    trigger_time.setHours(answer);
                    break;
                case 'n':
                    asking_confirmation = false;
                    rl.setPrompt(language.lang.INSERT_START_HOUR);
                    rl.prompt();
                    continue;
                default:
                    rl.setPrompt(language.lang.ONLY_Y_OR_N);
                    rl.prompt();
                    continue;
            }
            break;
        }
        answer = parseInt(line);
        if (isNaN(answer)) {
            rl.setPrompt(language.lang.NAN + language.lang.INSERT_START_HOUR);
            rl.prompt();
            continue;
        }
        if (answer > 23 || answer < 0) {
            rl.setPrompt(language.lang.HOUR_RANGE + language.lang.INSERT_START_HOUR);
            rl.prompt();
            continue;
        }
        asking_confirmation = true;
        rl.setPrompt(language.lang.YOU_DIGITED + answer + "\n" + language.lang.CONFIRM);
        rl.prompt();
    }

    rl = readline.createInterface({ input, output });
    rl.setPrompt(language.lang.INSERT_START_MINUTE);
    rl.prompt();
    answer = undefined;
    asking_confirmation = false;
    for await (let line of rl) {
        if (asking_confirmation) {
            switch (line.toLowerCase()) {
                case 'y':
                    trigger_time.setMinutes(answer);
                    break;
                case 'n':
                    asking_confirmation = false;
                    rl.setPrompt(language.lang.INSERT_START_MINUTE);
                    rl.prompt();
                    continue;
                default:
                    rl.setPrompt(language.lang.ONLY_Y_OR_N);
                    rl.prompt();
                    continue;
            }
            break;
        }
        answer = parseInt(line);
        if (isNaN(answer)) {
            rl.setPrompt(language.lang.NAN + language.lang.INSERT_START_MINUTE);
            rl.prompt();
            continue;
        }
        if (answer > 59 || answer < 0) {
            rl.setPrompt(language.lang.MINUTE_RANGE + language.lang.INSERT_START_MINUTE);
            rl.prompt();
            continue;
        }
        asking_confirmation = true;
        rl.setPrompt(language.lang.YOU_DIGITED + answer + "\n" + language.lang.CONFIRM);
        rl.prompt();
    }

    rl = readline.createInterface({ input, output });
    rl.setPrompt(language.lang.TODAY_OR_TOMORROW);
    rl.prompt();
    for await (let line of rl) {
        switch (line.toLowerCase()) {
            case 'y':
                trigger_time.setDate(trigger_time.getDate() + 1);
                break;
            case 'n':
                break;
            default:
                rl.setPrompt(language.lang.ONLY_Y_OR_N);
                rl.prompt();
                continue;
        }
        break;
    }

    return new Date(trigger_time.toUTCString());
}

bot_init.welcome();
bot_init.init();
bot_init.showCurrentBotSettings();
bot_init.delayConfig().then(() => {
    bot_init.walletConfig().then(async () => {
        if (bot_init.mode.get('presale')) {
            console.log("\n\x1b[36m" + language.lang.INITIALIZING_PRESALE_BOT + "\x1b[0m");
            var presale_bot : PresaleBot = new PresaleBot(bot_init.mode.get('testnet') as boolean,  
                                                          bot_init.mode.get('delay') as number, 
                                                          bot_init.getWalletConfig(),
                                                          await askTargetAddress());
            console.log("\n\x1b[36m" + language.lang.WILL_ASK_TIME + "\x1b[1m\x1b[4m" + language.lang.LOCAL_TIME + "\x1b[0m.\x1b[0m");
            let trigger_time = await askTriggerTime();
            presale_bot.setTime(trigger_time.getTime());            
            console.log("\x1b[33m" + language.lang.START_TIME_SET + "%d:%d \x1b[1m\x1b[4m" + language.lang.LOCAL_TIME + "\x1b[0m.\x1b[0m", trigger_time.getHours(), trigger_time.getMinutes());
            presale_bot.startSniping();
        }
        else {
            //TODO: IMPLEMENTE FAIRLAUNCH BOT
        }
    })
})