import language from "../language_pack/selected_language";
import { CommsHandler } from "../handlers/comms_handler";
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';


class FairLaunchBot {

    private readonly comms_handler : CommsHandler;
    private readonly target_presale_address : string;
    readonly delay : number;
    
    /**
     * Initiates fairlaunch bot.
     * @constructor
     * @param {number} delay number of blocks to wait before buying.
     * @param {boolean} testnet true if working on testnet - false otherwise.
     * @param {string} token_address token address
     * @param {Map<string, string>} wallet_config map with following specifications:
     * private_key => private key of the wallet you're willing to use
     * gas_amount => max amount of gas you're willing to use
     * gas_price => how much you want to pay the gas
     * amount => how much you're willing to buy
     */
     constructor(testnet : boolean, delay : number, wallet_config : Map<string, string>, token_address : string, target_presale_address : string) {

        this.delay = delay;
        this.target_presale_address = target_presale_address;

        this.comms_handler = new CommsHandler(testnet, 
            wallet_config.get('gas_price'), 
            wallet_config.get('gas_amount'), 
            wallet_config.get('amount')
            );

        this.comms_handler.addPrivateKeys([wallet_config.get('private_key')]);
        this.comms_handler.setTargetContract(token_address);

    }

    /**
     * @method sendTxCallback()
     * Callback to be used after tx has been issued to the blockchain via web3.eth.sendSignedTransaction();
     * @param {Error} error error - if any - issuing the transaction.
     * @param {result} result transaction hash - if successfull.
     */
     private sendTxCallback(error : Error, result : string) {
                  
        if (error) {
            console.log(language.lang.ERROR_OCCURRED);
            console.log(error);
        }
        else 
            console.log("\x1b[32m" + language.lang.TRANSACTION_SUCCESSFUL + "\n\x1b[33m" + language.lang.TX_HASH + "\x1b[0m%s", result);
        
    }

    /**
     * @method startSniping()
     */
     public async startSniping(bnb_pair : boolean) {

        await this.comms_handler.prepareFairlaunchTXs(bnb_pair);

        console.log('\x1b[36m' + language.lang.WAITING_PAIR + '\x1b[0m');

        
        var subscription = this.comms_handler.subscribePendingTXs(
            async function (tx : any) {
                                 
                if (!tx || !tx.to)
                    return;
                if ((new Date()).getTime() >= (this.comms_handler.swap_deadline - 1000 * 60)) {                    
                    await this.comms_handler.prepareFairlaunchTXs(bnb_pair);
                    console.log("rebuilding txs...");
                }
                if (bnb_pair) {
                    if (tx.to.toLowerCase() === this.comms_handler.PCS_ROUTER_CA.toLowerCase()) {
                        if (tx.input.slice(0,10).toLowerCase() === "0xf305d719") { //add liq ETH
                            if (tx.input.slice(35, 74).toLowerCase() === this.comms_handler.getTargetContract().toLowerCase()) {
                                this.comms_handler.sendTXs(this.sendTxCallback);
                                await subscription.unsubscribe();
                            }
                        }
                    }
                    else if (tx.to.toLowerCase() === this.target_presale_address.toLowerCase()) {
                        if (tx.input.slice(0,10).toLowerCase() === "0x4bb278f3") { //pinksale finalize
                            this.comms_handler.sendTXs(this.sendTxCallback);
                            await subscription.unsubscribe();
                        }
                    }
                }
                else {
                    if (tx.to.toLowerCase() === this.comms_handler.PCS_ROUTER_CA.toLowerCase()) {
                        if (tx.input.slice(0,10).toLowerCase() === "0xe8e33700") {
                            if (tx.input.slice(35, 74).toLowerCase() === this.comms_handler.getTargetContract().toLowerCase()) {
                                this.comms_handler.sendTXs(this.sendTxCallback);
                                await subscription.unsubscribe();
                            }
                        }
                    }
                    else if (tx.to.toLowerCase() === this.target_presale_address.toLowerCase()) {
                        if (tx.input.slice(0,10).toLowerCase() === "0x4bb278f3") { //pinksale finalize
                            this.comms_handler.sendTXs(this.sendTxCallback);
                            await subscription.unsubscribe();
                        }
                    }
                }
            }.bind(this));
    }

}

export {FairLaunchBot};