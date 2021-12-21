import language from "../language_pack/selected_language"
import cfgh from "../handlers/configs_handler"
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
const fs = require('fs');
const path = require('path');

var mode : Map<string, boolean | number> = new Map<string, boolean | number>();
mode.set('testnet', false); //mainnet by default
mode.set('delay', 0); //no delay by default

/**
 * @function welcome()
 * Shows logo and credits banner.
 */
function welcome() {
    console.log(fs.readFileSync(path.join(__dirname, "..", "..", "assets", "logo.ans")).toString());
    console.log(fs.readFileSync(path.join(__dirname, "..", "..", "assets", "credits.ans")).toString());
    console.log("\x1b[0m");
}

/**
 * @function init()
 * Configures bot mode (presale/fairlaunch & testnet/mainnet & delay) based on args passed to process command.
 * @throws process.exit() if -fairlaunch flag is passed as argument: fairlaunch mode under development.
 */
function init() {
    process.argv.slice(2).forEach((value : string, key : number) => {
    
        switch (value.split("=")[0]){
            case '-testnet':
                mode.set('testnet', true);
                break;
            case '-presale':
                if (mode.has('fairlaunch') && mode.get('fairlaunch'))
                    throw new Error(language.lang.BOTH_MODE_NOT_PERMITTED);
                mode.set('fairlaunch', false);
                mode.set('presale', true);
                break;
            case '-fairlaunch':
                if (mode.has('presale') && mode.get('presale'))
                    throw new Error(language.lang.BOTH_MODE_NOT_PERMITTED);
                mode.set('fairlaunch', true);
                mode.set('presale', false);
                break;
            case '-delay':
                let inp : string = value.split("=")[1];
                if (isNaN(parseInt(inp)) || inp.includes('.') || inp.includes(","))
                    throw new Error(language.lang.INVALID_DELAY_OPTION);
                mode.set('delay', parseInt(inp));
                break;
            default:
                console.log(value);
                throw new Error(language.lang.OPTIONS_ERROR);
    
        }
        
    });


}

/**
 * @function showCurrentBotSettings()
 * Shows current bot settings.
 */
function showCurrentBotSettings() {
    console.log(language.lang.SHOW_BOT_SETTINGS);
    console.log("\x1b[33m" + language.lang.MODE + ": \x1b[32m%s", mode.get('fairlaunch') ? 'fairlaunch' : 'presale');
    console.log("\x1b[33m" + language.lang.DELAY + ": \x1b[3%dm%s", mode.get('delay') ? 2 : 1 ,mode.get('delay') ? 'on (' + mode.get('delay') + ' '+ language.lang.BLOCKS + ')' : 'off');
    console.log("\x1b[33m" + language.lang.NET + ": \x1b[3%sm%s",  mode.get('testnet') ? 1 : 2, (mode.get('testnet') ? 'testnet' : 'mainnet') + '\x1b[0m' );
}

/**
 * @function delayConfig()
 * @async
 * Asks user if delay settings are okay; if not, configuration procedure for delay value will start.
 */
async function delayConfig() {
    const rl = readline.createInterface({ input, output });
    rl.setPrompt(language.lang.CHANGE_DELAY);
    rl.prompt();
    var asking_confirmation : boolean = true;
    var changing : boolean = false;
    var answer : number = 0;
    for await (let line of rl) {

        if (changing && !asking_confirmation) {
            if (isNaN(parseInt(line)) || line.includes('.') || line.includes(",")){
                rl.setPrompt(language.lang.INVALID_DELAY_INPUT);
                rl.prompt();
                continue;
            }
            answer = parseInt(line);
            rl.setPrompt(language.lang.YOU_DIGITED + answer + ". " + language.lang.CONFIRM);
            rl.prompt();
            asking_confirmation = true;
            continue;
        }

        if (asking_confirmation) {
            switch(line.toLowerCase()) {
                case 'y':
                    if(!changing) {
                        changing = true;
                        asking_confirmation = false;
                        rl.setPrompt(language.lang.INSERT_DELAY);
                        rl.prompt();
                        continue;
                    }
                    mode.set('delay', answer);
                    console.log("\x1b[33m" + language.lang.DELAY_CHANGED + "%d\x1b[0m", answer);
                    return;
                case 'n':
                    if (!changing) {
                        console.log("\x1b[33m" + language.lang.DELAY_NOT_CHANGED + "\x1b[0m");
                        return;
                    }
                    rl.setPrompt(language.lang.INSERT_DELAY);
                    rl.prompt();
                    asking_confirmation = false;
                    break;
                default:
                    rl.setPrompt(language.lang.ONLY_Y_OR_N);
                    rl.prompt();
                    break;
            }
        }
    }
    rl.close();
}

/**
 * @function showWalletConfig()
 * Shows current configuration of wallet. (private key, gas price, gas amount, amount to buy).
 */
function showWalletConfig() {
    let wallet_config : Map<string, string> = cfgh.getConfigs();
    console.log("\x1b[33mPrivate key: \x1b[0m%s", wallet_config.get('private_key'));
    console.log("\x1b[33mGas amount: \x1b[0m%s", wallet_config.get('gas_amount'));
    console.log("\x1b[33mGas price: \x1b[0m%s", wallet_config.get('gas_price'));
    console.log("\x1b[33mAmount: \x1b[0m%s", wallet_config.get('amount'));
}

/**
 * @function walletConfig() 
 * @async
 * Asks user if wallet settings are okay; if not, configuration procedure for wallet will start.
 */
async function walletConfig() {

    /**
     * @function
     * @async
     * @description starts wallet configuration procedure by calling `createConfigsFile()` defined in src/handlers/configs_handler.ts
     */
    async function startWalletConfiguration() {

        await cfgh.createConfigsFile()

        //At this point configuration procedure has finished but we have to check if it finished successfully.
        if (cfgh.configsFileExist()) {
            console.log("\n" + language.lang.SHOW_NEW_WALLET_CONF);
            showWalletConfig();
        }
        else {
            throw new Error(language.lang.WALLET_CONFIG_ERROR);
        }    
    }
    
    console.log('\n\x1b[36m' + language.lang.CHECKING_WALLET_CONF + '\x1b[0m');
    if (cfgh.configsFileExist()) {
        console.log(language.lang.WALLET_CONFIG_FOUND);
        showWalletConfig();
        const rl = readline.createInterface({ input, output });
        rl.setPrompt(language.lang.CHANGE_WALLET_CONF);
        rl.prompt();
        for await (let line of rl) {
            switch(line.toLowerCase()) {
                case 'y':
                    rl.close();
                    console.log(language.lang.STARTING_WALLET_CONF + "\n");
                    await startWalletConfiguration();
                    return;
                case 'n':
                    return;
                default:
                    rl.setPrompt(language.lang.ONLY_Y_OR_N);
                    rl.prompt();
                    break;
            }
        }
    }
    else {
        console.log("No configuration file found. Starting configuration procedure now.\n");
        await startWalletConfiguration(); 
    }

}

/**
 * @function getWalletConfig()
 * @returns {Map<string, string>}  map with following specifications:
 * private_key => private key of the wallet you're willing to use
 * gas_amount => max amount of gas you're willing to use
 * gas_price => how much you want to pay the gas
 * amount => how much you're willing to buy
 */
function getWalletConfig() {
    return cfgh.getConfigs();
}

export default {mode, welcome, init, showCurrentBotSettings, delayConfig, walletConfig, getWalletConfig}
