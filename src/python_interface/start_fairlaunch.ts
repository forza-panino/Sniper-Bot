import {FairLaunchBot} from "../bots/fairlaunch_bot"
import bot_init from "../main/bot_initialization";

//constructor(testnet : boolean, delay : number, wallet_config : Map<string, string>, token_address : string)

let fairlaunch_bot : FairLaunchBot;
let testnet : boolean = false;
let delay : number = 0;
let target_address : string;
let pair : string;

process.argv.slice(2).forEach((value : string, key : number) => {
    
    switch (value.split("=")[0]){
        case '-address':
            target_address = value.split("=")[1];
            break;
        case '-testnet':
            testnet = true;
            break;
        case '-pair':
            pair = value.split("=")[1];;
            break;
        case '-delay':
            var inp : string = value.split("=")[1];
            if (isNaN(parseInt(inp)) || inp.includes('.') || inp.includes(","))
                throw new Error("invalid number passed as delay." + inp);
            delay = parseInt(inp);
            break;
        default:
            console.log(value);
            throw new Error("Invalid option inserted.");
    
    }
        
});

fairlaunch_bot = new FairLaunchBot(
    testnet,
    delay,
    bot_init.getWalletConfig(),
    target_address
)

fairlaunch_bot.startSniping(pair === "bnb")
