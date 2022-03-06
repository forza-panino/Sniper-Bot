import language from "../language_pack/selected_language"
import bot_init from "./bot_initialization"
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import {PresaleBot} from "../bots/presale_bot"
import {logger} from "../logger/logger"
import {FairLaunchBot} from "../bots/fairlaunch_bot"

const myLogger : logger = logger.getInstance();

/**
 * @function askTargetAddress()
 * @async
 * @description asks the user for target address
 * @returns {Promise<string>} target address inputed
 */
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
                    //Notify address to logger
                    myLogger.updateAddress(answer);
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

/**
 * @function askTriggerTime()
 * @async
 * @description asks user for time of presale start.
 * @returns {Promise<Date>} date inputed PARSED INTO UTC
 */
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

async function askSwapPair() : Promise<string> {
    const rl = readline.createInterface({ input, output });
    rl.setPrompt(language.lang.CHOOSE_PAIR);
    rl.prompt();
    var answer : string;
    var asking_confirmation : boolean = false;
    for await (let line of rl) {
        if (asking_confirmation) {
            switch (line.toLowerCase()) {
                case 'y':
                    //myLogger.updateAddress(answer);
                    if (!(answer === "1") && !(answer === "2")) {
                        asking_confirmation = false;
                        rl.setPrompt(language.lang.PAIR_NOT_VALID);
                        rl.prompt();
                        continue;
                    }
                    return answer === "1" ? "bnb" : "busd";
                case 'n':
                    asking_confirmation = false;
                    rl.setPrompt(language.lang.CHOOSE_PAIR);
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

bot_init.welcome();
bot_init.init();
bot_init.showCurrentBotSettings();

bot_init.delayConfig().then(() => {

    //User has decided if he wants to change the delay value and by what, we can now notify logger of bot settings.
    myLogger.updateBotConfig(bot_init.mode);

    //Showing user current wallet settings and asking for confirmation.
    bot_init.walletConfig().then(async () => {

        //User has decided if he wants to change wallet configs and to what, we can now notify logger of wallet settings.
        myLogger.updateWalletConfig(bot_init.getWalletConfig());

        //Checking bot mode
        if (bot_init.mode.get('presale')) {

            console.log("\n\x1b[36m" + language.lang.INITIALIZING_PRESALE_BOT + "\x1b[0m");
            var presale_bot : PresaleBot = new PresaleBot(bot_init.mode.get('testnet') as boolean,  
                                                          bot_init.mode.get('delay') as number, 
                                                          bot_init.getWalletConfig(),
                                                          await askTargetAddress());
            console.log("\n\x1b[36m" + language.lang.WILL_ASK_TIME + "\x1b[1m\x1b[4m" + language.lang.LOCAL_TIME + "\x1b[0m.\x1b[0m");

            //Asking target time
            let trigger_time = await askTriggerTime();

            //Target time has been provided, we can now notify it to logger and AFTER to presale_bot too
            myLogger.updateTime(trigger_time.getTime());
            presale_bot.setTime(trigger_time.getTime());            
            console.log("\x1b[33m" + language.lang.START_TIME_SET + "%d:%d \x1b[1m\x1b[4m" + language.lang.LOCAL_TIME + "\x1b[0m.\x1b[0m", trigger_time.getHours(), trigger_time.getMinutes());
            
            presale_bot.startSniping();

        }
        else {

            const rl = readline.createInterface({ input, output });
            rl.setPrompt(language.lang.INSERT_PRESALE_ADDR_FL);
            rl.prompt();
            var presale_address : string;
            for await (let line of rl) {
                presale_address = line;
                break;
            }
            console.log(language.lang.PRESALE_ADDR_CONFIRM_FL + presale_address);

            var fairlaunch_bot : FairLaunchBot = new FairLaunchBot(bot_init.mode.get('testnet') as boolean,  
                                                                   bot_init.mode.get('delay') as number, 
                                                                   bot_init.getWalletConfig(),                                                       
                                                                   await askTargetAddress(),
                                                                   presale_address);
            fairlaunch_bot.startSniping((await askSwapPair()) === "bnb");

        }

    });

});