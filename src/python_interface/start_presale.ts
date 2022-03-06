import {PresaleBot} from "../bots/presale_bot";
import bot_init from "../main/bot_initialization";

let presale_bot : PresaleBot;

let tomorrow : boolean = false;
let testnet : boolean = false;
let delay : number = 0;
let target_address : string;
let hour: number;
let minute: number;

process.argv.slice(2).forEach((value : string, key : number) => {
    
    switch (value.split("=")[0]){
        case '-address':
            target_address = value.split("=")[1];
            break;
        case '-hour':
            var inp : string = value.split("=")[1];
            
            if (isNaN(parseInt(inp)) || inp.includes('.') || inp.includes(","))
                throw new Error("invalid number passed as hour." + inp);
            hour = parseInt(inp);
            break;
        case '-tomorrow':
            tomorrow = true;
            break;
        case '-testnet':
            testnet = true;
            break;
        case '-minute':
            var inp : string = value.split("=")[1];
            if (isNaN(parseInt(inp)) || inp.includes('.') || inp.includes(","))
                throw new Error("invalid number passed as minute." + inp);
            minute = parseInt(inp);
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

presale_bot = new PresaleBot(
    testnet,
    delay,
    bot_init.getWalletConfig(),
    target_address
);

var trigger_time : Date = new Date();
trigger_time.setSeconds(0);
trigger_time.setMilliseconds(0);
trigger_time.setHours(hour);
trigger_time.setMinutes(minute);
if (tomorrow) {
    trigger_time.setDate(trigger_time.getDate() + 1);
}
trigger_time = new Date(trigger_time.toUTCString());
presale_bot.setTime(trigger_time.getTime());
presale_bot.startSniping();