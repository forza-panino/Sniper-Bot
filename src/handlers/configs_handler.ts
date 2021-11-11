import language from "../language_pack/selected_language"
const fs = require('fs');
const path = require('path');
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

const configs_path : string = path.join(__dirname, "..", "..", "configs", "walllets_config.json");

/**
 * @function configsFileExist() checks if configuration file exists.
 * @returns {boolean} true if exists, false otherwise.
 */
function configsFileExist() : boolean {
    return fs.existsSync(configs_path)
}

/**
 * @function createConfigsFile() checks if configuration file exists.
 * @returns {boolean} true if successfull, false otherwise.
 */
//TODO: Spartano ma funzionante, poi farlo più elegante.
//TODO: logging errori
async function createConfigsFile() : Promise<boolean> {
    
    const rl = readline.createInterface({ input, output });
    

    var configuration : Map<string, string> = new Map<string, string>();
    var configuration_fields : string[] = [
        'private_key',
        'gas_amount',
        'gas_price',
        'amount'
    ];

    var i : number = 0;
    var asking_confirmation : boolean = false;
    var answer : string = "";
    rl.setPrompt(language.lang.INSERT + configuration_fields[i] + ": ");
    rl.prompt();
    for await (let line of rl) {

        if (asking_confirmation) {

            switch(line.toLowerCase()) {
                case 'y':
                    configuration.set(configuration_fields[i], answer);
                    i++;
                    asking_confirmation = false;
                    answer = "";
                    if ( i < configuration_fields.length) {
                        rl.setPrompt("\n" + language.lang.INSERT + configuration_fields[i] + ": ");
                        rl.prompt();
                    }
                    else
                        rl.close();
                    break;
                case 'n':
                    asking_confirmation = false;
                    rl.setPrompt(language.lang.INSERT + configuration_fields[i] + ": ");
                    rl.prompt();
                    break;
                default:
                    rl.setPrompt(language.lang.ONLY_Y_OR_N);
                    rl.prompt();
                    break;
            }
            continue;
        }
        
        rl.pause();
        answer = line;
        asking_confirmation = true;
        rl.setPrompt(language.lang.YOU_DIGITED + answer +"\n" + language.lang.CONFIRM);
        rl.prompt();
    }
    
    
    try {
        fs.writeFileSync(configs_path, JSON.stringify(Array.from(configuration.entries())), {encoding:'utf8',flag:'w'});
        return true;
    }
    catch {
        return false;
    }

}

function getConfigs() : Map<string, string> {
    if (configsFileExist()){
        return new Map(JSON.parse(fs.readFileSync(configs_path)));
    }
    return null;
} 


export default {configsFileExist, createConfigsFile, getConfigs}