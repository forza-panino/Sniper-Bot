import bot_init from "./bot_initialization"
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import {PresaleBot} from "./presale_bot"

async function askTargetAddress() : Promise<string> {
    const rl = readline.createInterface({ input, output });
    rl.setPrompt("Insert target address: ");
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
                    rl.setPrompt("Insert target address: ");
                    rl.prompt();
                    continue;
                default:
                    rl.setPrompt("digit only y or n: ");
                    rl.prompt();
                    continue;
            }
        }
        answer = line;
        asking_confirmation = true;
        rl.setPrompt("You digited: " + answer + "\nDo You confirm? (y/n): ");
        rl.prompt();
    }
}

async function askTriggerTime() : Promise<Date> {
    var trigger_time : Date = new Date();
    trigger_time.setSeconds(0);
    trigger_time.setMilliseconds(0);

    var rl = readline.createInterface({ input, output });
    rl.setPrompt("Insert start hour: ");
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
                    rl.setPrompt("Insert start hour: ");
                    rl.prompt();
                    continue;
                default:
                    rl.setPrompt("digit only y or n: ");
                    rl.prompt();
                    continue;
            }
            break;
        }
        answer = parseInt(line);
        if (isNaN(answer)) {
            rl.setPrompt("Not a number. Insert start hour: ");
            rl.prompt();
            continue;
        }
        if (answer > 23 || answer < 0) {
            rl.setPrompt("Must be a number between 0 and 23. Insert start hour: ");
            rl.prompt();
            continue;
        }
        asking_confirmation = true;
        rl.setPrompt("You digited: " + answer + "\nDo You confirm? (y/n): ");
        rl.prompt();
    }

    rl = readline.createInterface({ input, output });
    rl.setPrompt("Insert start minute: ");
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
                    rl.setPrompt("Insert start minute: ");
                    rl.prompt();
                    continue;
                default:
                    rl.setPrompt("digit only y or n: ");
                    rl.prompt();
                    continue;
            }
            break;
        }
        answer = parseInt(line);
        if (isNaN(answer)) {
            rl.setPrompt("Not a number. Insert start minute: ");
            rl.prompt();
            continue;
        }
        if (answer > 59 || answer < 0) {
            rl.setPrompt("Must be a number between 0 and 59. Insert start minute: ");
            rl.prompt();
            continue;
        }
        asking_confirmation = true;
        rl.setPrompt("You digited: " + answer + "\nDo You confirm? (y/n): ");
        rl.prompt();
    }

    return new Date(trigger_time.toUTCString());
}

bot_init.welcome();
bot_init.init();
bot_init.showCurrentBotSettings();
bot_init.delayConfig().then(() => {
    bot_init.walletConfig().then(async () => {
        if (bot_init.mode.get('presale')) {
            console.log("\n\x1b[36mStarting presale bot with the chosen settings...\x1b[0m");
            var presale_bot : PresaleBot = new PresaleBot(bot_init.mode.get('testnet') as boolean,  
                                                          bot_init.mode.get('delay') as number, 
                                                          bot_init.getWalletConfig(),
                                                          await askTargetAddress());
            console.log("\n\x1b[36mYou will now be asked for time of presale start. Please, use your \x1b[1m\x1b[4mLOCAL TIME\x1b[0m.\x1b[0m");
            let trigger_time = await askTriggerTime();
            presale_bot.setTime(trigger_time.getTime());            
            console.log("\x1b[33mTime of presale start has been set to %d:%d \x1b[1m\x1b[4mLOCAL TIME\x1b[0m.\x1b[0m", trigger_time.getHours(), trigger_time.getMinutes());
            presale_bot.startSniping();
        }
        else {
            //TODO: IMPLEMENTE FAIRLAUNCH BOT
        }
    })
})