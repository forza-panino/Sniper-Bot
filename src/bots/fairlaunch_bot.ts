import language from "../language_pack/selected_language"
import { CommsHandler } from "../handlers/comms_handler";

class FairLaunchBot {

    private readonly comms_handler : CommsHandler;
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
     constructor(testnet : boolean, delay : number, wallet_config : Map<string, string>, token_address : string) {

        this.delay = delay;

        this.comms_handler = new CommsHandler(testnet, 
            wallet_config.get('gas_price'), 
            wallet_config.get('gas_amount'), 
            wallet_config.get('amount')
            );

        this.comms_handler.addPrivateKeys([wallet_config.get('private_key')]);
        this.comms_handler.setTargetContract(token_address);

    }

    /**
     * @function sendTxCallback()
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
     * @function startSniping()
     */
     public async startSniping(bnb_pair : boolean) {

        await this.comms_handler.prepareFairlaunchTXs(bnb_pair);
        let liquidity_pool_created : boolean = false;
        let pair_address : string;
        console.log(language.lang.WAITING_PAIR);
        var checker = this.comms_handler.subscribeNewBlocks(
            async function (current_block : any) {  
                if ((new Date()).getTime() >= (this.comms_handler.swap_deadline - 1000 * 60)) {                    
                    await this.comms_handler.prepareFairlaunchTXs(bnb_pair);
                }
                if (!liquidity_pool_created) {                    
                    pair_address = await this.comms_handler.pcs_factory.methods.getPair(
                                                            bnb_pair ? this.comms_handler.WBNB_ADDRESS : this.comms_handler.BUSD_ADDRESS,
                                                            this.comms_handler.getTargetContract(),
                                                            ).call();
                    liquidity_pool_created = !(pair_address === this.comms_handler.NOPAIR);
                    if (liquidity_pool_created)
                        console.log(language.lang.WAITING_LIQ);
                }
                else {
                    if (await this.comms_handler.getTargetContractCallable().methods.balanceOf(pair_address).call() > 0) {
                        console.log(language.lang.LIQ_ADDED);
                        this.comms_handler.sendTXs(this.sendTxCallback);
                    }
                    clearInterval(checker);
                }

            }.bind(this));
    }

}

export {FairLaunchBot};