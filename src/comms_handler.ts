import language from "./language_pack/selected_language"
const Web3 = require('web3');

class CommsHandler {
    
    public readonly HTTP_PROVIDER : string; 
    public readonly CHAIN_ID : number;
    public readonly web3;

    private signed_tx : [Promise<Object>] = [new Promise<Object>(function(){})];
    private private_keys : string[] = [];
    private gas_price : string;
    private gas_amount : string;
    private target_contract : string;
    private amount : string;

    /**
     * Creates a new handler and initializes web3 connection.
     * @constructor
     * @param {boolean} useTestnet if false (default) txs will be executed on mainnet - testnet otherwise.
     * @param {number} gas_price price in gwei per unit of gas.
     * @param {number} gas_amount amount of gas in gwei.
     * @param {string} amount amount to buy.
     * */
    constructor(useTestnet : boolean = false, gas_price : string = '5', gas_amount : string = '500000', amount : string) {
       this.HTTP_PROVIDER = (useTestnet ? "https://data-seed-prebsc-1-s1.binance.org:8545" : "https://bsc-dataseed1.binance.org:443");
       this.CHAIN_ID = (useTestnet ? 97 : 56);
       this.web3 = new Web3(new Web3.providers.HttpProvider(this.HTTP_PROVIDER));
       this.gas_price = gas_price;
       this.gas_amount = gas_amount;
       this.amount = amount;
       this.signed_tx.pop();
    }

    /**
     * @function setTargetContract() sets contract to snipe.
     * @param {string} target_contract contract to snipe.
     * @returns {void}
     * @throws Will throw error if address not valid.
     */
    public setTargetContract(target_contract : string) : void {

        if (!this.web3.utils.isAddress(target_contract))
            throw new Error(language.lang.ADDR_NOT_VALID);
            
        this.target_contract = target_contract;
    }

    /**
     * @private
     * @function verifyPrivateKey() check if private key is valid.
     * @param {string} private_key private key to verify. NOTE: remove '0x' prefix.
     * @returns {boolean} true if valid, false otherwise.
     * */
    private verifyPrivateKey(private_key : string) : boolean {
        
        try {
            this.web3.eth.accounts.privateKeyToAccount(private_key);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * @function addPrivateKeys() set private keys to sign transaction with (ALL private keys will be used).
     * @param {string[]} private_keys array of private keys to sign transaction with (ALL private keys will be used). NOTE: remove "0x" prefix.
     * @returns {void}
     * @throws Will throw error if private keys are not correct.
     * */
    public addPrivateKeys(private_keys : string[]) : void {

        private_keys.forEach( (key : string) => {
            if (!this.verifyPrivateKey(key))
                throw new Error(language.lang.PVT_KEY_NOT_VALID);
        })

        this.private_keys = this.private_keys.concat(private_keys);
    }

    /**
     * @function prepareTXs() prepare txs to sign
     * @returns {void}
     * @throws Will throw error if gas settings are wrong.
     */
    //TODO: implementare logs degli errori col callback
    public prepareTXs() : void {
        
        this.private_keys.forEach((key : string) => {

            this.signed_tx.push(this.web3.eth.accounts.signTransaction(

                    {
                        value: this.web3.utils.toHex(this.web3.utils.toWei(this.amount, 'ether')),
                        gas: this.web3.utils.toHex(this.gas_amount),
                        gasPrice: this.web3.utils.toHex(this.web3.utils.toWei(this.gas_price, 'gwei')),
                        chainId: this.CHAIN_ID,
                        to: this.target_contract,
                    },
                    key,
                    null

                )
            );
        })        
    }

    /**
     * @function defaultCallback()
     * default callback to be used after tx has been issued to the blockchain via web3.eth.sendSignedTransaction();
     * @param {Error} error error - if any - issuing the transaction.
     * @param {result} result transaction hash - if successfull.
     */
    private defaultCallback(error : Error, result : any) {
        if (error) 
            console.log(error);
        else 
            console.log(result);         
    }

    /**
     * @function sendTXs() 
     * @returns {void}
     * @throws Will throw an error for wrong gas settings or insufficient balance.
     */
    //TODO: implementare logs degli errori col callback
    public sendTXs(callback : Function) : void {
                
        this.signed_tx.forEach(async (sig_tx: any) => {
            this.web3.eth.sendSignedTransaction((await sig_tx).rawTransaction, (error : Error, result : any) => {
                if (!callback)
                    this.defaultCallback(error, result);
                else
                    callback(error, result);
            });
        })
    }

    /**
     * @function subscribeNewBlocks()
     * Triggers callback on new blocks.
     * @param {Function} callback callback function to be called on new blocks.
     */
    public subscribeNewBlocks(callback : Function) : NodeJS.Timeout {

        var previous_block : number;        
        return setInterval(
            async function (){
                let current_block : number = await this.web3.eth.getBlockNumber();
                if (current_block > previous_block || previous_block == undefined) {
                    previous_block = current_block;
                    callback(await this.web3.eth.getBlock('latest'));
                }
            }.bind(this)
            , 10
        ) ;

    }
}

export {CommsHandler}