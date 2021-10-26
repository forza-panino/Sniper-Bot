import { CommsHandler } from "./comms_handler";

class PresaleBot {

    private readonly comms_handler : CommsHandler;
    readonly delay : number;
    
    private trigger_time : number;

    /**
     * Initiates presale bot.
     * @constructor
     * @param {number} delay number of blocks to wait before buying.
     * @param {boolean} testnet true if working on testnet - false otherwise.
     * @param {string} presale_address where to send transaction.
     * @param {Map<string, string>} wallet_config map with following specifications:
     * private_key => private key of the wallet you're willing to use
     * gas_amount => max amount of gas you're willing to use
     * gas_price => how much you want to pay the gas
     * amount => how much you're willing to buy
     */
    constructor(testnet : boolean, delay : number, wallet_config : Map<string, string>, presale_address : string) {

        this.delay = delay;

        this.comms_handler = new CommsHandler(testnet, 
            wallet_config.get('gas_price'), 
            wallet_config.get('gas_amount'), 
            wallet_config.get('amount')
            );

        this.comms_handler.addPrivateKeys([wallet_config.get('private_key')]);
        this.comms_handler.setTargetContract (presale_address);
    }


    /**
     * Sets time at which presale starts.
     * @function setTime()
     * @param {number} trigger_time time of presale start in milliseconds.
     */
    public setTime(trigger_time : number) {
        this.trigger_time = trigger_time / 1000;
    }

    private sendTxCallback(error : Error, result : string) {
        if (error) {
            console.log("The following error occurred: ");
            console.log(error);
        }
        else 
            console.log("\x1b[32mTransaction sent successfully. \n\x1b[33mTransacion hash: \x1b[0m%s", result);
        
    }

    /**
     * @function startSniping()
     * Subscribes to new block event and waits until timestap of new block >= trigger_date. Delay will be applied if required.
     */
    public startSniping() {
        this.comms_handler.prepareTXs();
        var target_block : number;
        var time_triggered : boolean = false;
        console.log("Waiting for time to come...");
        var checker = this.comms_handler.subscribeNewBlocks(
            function (current_block : any) {                
                if (!time_triggered) {
                    if (current_block['timestamp'] >= this.trigger_time) {
                        time_triggered = true;
                        if (this.delay == 0) {
                            this.comms_handler.sendTXs(this.sendTxCallback);
                            clearInterval(checker);
                            return;
                        }
                        target_block = current_block['number'] + this.delay;
                        console.log("Bot armed.");                        
                    }             
                }
                else {
                    if (current_block['number'] >= target_block) {
                        this.comms_handler.sendTXs(this.sendTxCallback);
                        clearInterval(checker);
                    }
                }
            }.bind(this));
    }

}

export {PresaleBot}