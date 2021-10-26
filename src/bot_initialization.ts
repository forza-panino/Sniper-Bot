import cfgh from "./configs_handler"
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
    console.log(fs.readFileSync(path.join(__dirname, "..", "assets", "logo.ans")).toString());
    console.log(fs.readFileSync(path.join(__dirname, "..", "assets", "credits.ans")).toString());

    console.log("a"); //Cannot understand why it is needed, otherwise first log lacks two letters. Might be some ansi issue.
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
                    throw new Error("Cannot activate both presale and fairlaunch mode!");
                mode.set('fairlaunch', false);
                mode.set('presale', true);
                break;
            case '-fairlaunch':
                if (mode.has('presale') && mode.get('presale'))
                    throw new Error("Cannot activate both presale and fairlaunch mode!");
                mode.set('fairlaunch', true);
                mode.set('presale', false);
                break;
            case '-delay':
                let inp : string = value.split("=")[1];
                if (isNaN(parseInt(inp)) || inp.includes('.') || inp.includes(","))
                    throw new Error("You must pass an int (number of blocks) as delay value!");
                mode.set('delay', parseInt(inp));
                break;
            default:
                console.log(value);
                throw new Error("An error occurred while reading options. Please check documentation.");
    
        }
        
    });

    //FAIRLAUNCH NOT AVAILABLE
    if (mode.get('fairlaunch')) {
        console.log("\x1b[31mSorry, fairlaunch mode is still under development.\x1b[0m");
        process.exit();
}
}

/**
 * @function showCurrentBotSettings()
 * Shows current bot settings.
 */
function showCurrentBotSettings() {
    console.log("You have launched the bot with the following settings: ");
    console.log("\x1b[33mMode: \x1b[32m%s", mode.get('fairlaunch') ? 'fairlaunch' : 'presale');
    console.log("\x1b[33mDelay: \x1b[3%dm%s", mode.get('delay') ? 2 : 1 ,mode.get('delay') ? 'on (' + mode.get('delay') + ' blocks)' : 'off');
    console.log("\x1b[33mNet: \x1b[3%sm%s",  mode.get('testnet') ? 1 : 2, (mode.get('testnet') ? 'testnet' : 'mainnet') + '\x1b[0m' );
}

/**
 * @function delayConfig()
 * Asks user if delay settings are okay; if not, configuration procedure for delay value will start. 
 */
async function delayConfig() {
    const rl = readline.createInterface({ input, output });
    rl.setPrompt("Do you want to change number of delay blocks? (y/n): ");
    rl.prompt();
    var asking_confirmation : boolean = true;
    var changing : boolean = false;
    var answer : number = 0;
    for await (let line of rl) {

        if (changing && !asking_confirmation) {
            if (isNaN(parseInt(line)) || line.includes('.') || line.includes(",")){
                rl.setPrompt("Only integers accepted. Insert number of delay blocks: ");
                rl.prompt();
                continue;
            }
            answer = parseInt(line);
            rl.setPrompt("You digited " + answer + ". Confirm? (y/n): ");
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
                        rl.setPrompt("Insert number of delay blocks: ");
                        rl.prompt();
                        continue;
                    }
                    mode.set('delay', answer);
                    console.log("\x1b[33mDelay blocks number has been changed to %d\x1b[0m", answer);
                    return;
                case 'n':
                    if (!changing) {
                        console.log("\x1b[33mDelay blocks number has not been changed\x1b[0m");
                        return;
                    }
                    rl.setPrompt("Insert number of delay blocks: ");
                    rl.prompt();
                    asking_confirmation = false;
                    break;
                default:
                    rl.setPrompt("digit only y or n: ");
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
 * Asks user if wallet settings are okay; if not, configuration procedure for wallet will start.
 */
async function walletConfig() {

    async function startWalletConfiguration() {
        await cfgh.createConfigsFile()
        if (cfgh.configsFileExist()) {
            console.log("\nHere's the new wallet configuration:");
            showWalletConfig();
        }
        else {
            throw new Error("It seems tha something went wrong during the wallet configuration.");
        }    
    }
    
    console.log('\n\x1b[36mChecking wallet configuration...\x1b[0m');
    if (cfgh.configsFileExist()) {
        console.log("Found the following wallet configuration: ");
        showWalletConfig();
        const rl = readline.createInterface({ input, output });
        rl.setPrompt("Do you want to change wallet configuration? (y/n): ");
        rl.prompt();
        for await (let line of rl) {
            switch(line.toLowerCase()) {
                case 'y':
                    rl.close();
                    console.log("Starting configuration procedure now.\n");
                    await startWalletConfiguration();
                    return;
                case 'n':
                    return;
                default:
                    rl.setPrompt("digit only y or n: ");
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
