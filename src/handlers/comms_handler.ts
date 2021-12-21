import language from "../language_pack/selected_language"
import { logger } from "../logger/logger";
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

    public readonly WBNB_ADDRESS : string;
    public readonly BUSD_ADDRESS : string;
    private readonly PCS_ROUTER_CA : string;
    private readonly PCS_FACTORY_CA : string;
    private readonly PCS_ROUTER_ABI : string = '[{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"}, {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    private readonly PCS_FACTORY_ABI : string = '[{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]';
    private readonly NOPAIR : string = '0x0000000000000000000000000000000000000000'
    private readonly BALANCE_ABI : string = '[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]'

    public readonly pcs_factory : any;
    public readonly pcs_router : any;
    private target_contract_callable : any;

    /**
     * Creates a new handler and initializes web3 connection.
     * @constructor
     * @param {boolean} useTestnet if false (default) txs will be executed on mainnet - testnet otherwise.
     * @param {number} gas_price price in gwei per unit of gas.
     * @param {number} gas_amount amount of gas in gwei.
     * @param {string} amount amount to buy.
     * */
    constructor(useTestnet : boolean = false, gas_price : string = '10', gas_amount : string = '500000', amount : string) {

        this.HTTP_PROVIDER = (useTestnet ? "https://data-seed-prebsc-1-s1.binance.org:8545" : "https://bsc-dataseed1.binance.org:443");
        this.CHAIN_ID = (useTestnet ? 97 : 56);
        this.web3 = new Web3(new Web3.providers.HttpProvider(this.HTTP_PROVIDER));
        this.gas_price = gas_price;
        this.gas_amount = gas_amount;
        this.amount = amount;
        this.signed_tx.pop();

        if (useTestnet) {
            this.WBNB_ADDRESS = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
            this.BUSD_ADDRESS = "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7";
            this.PCS_ROUTER_CA = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
            this.PCS_FACTORY_CA = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";
        }
        else {
            this.WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
            this.BUSD_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
            this.PCS_ROUTER_CA = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
            this.PCS_FACTORY_CA = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
        }

        this.pcs_factory = new this.web3.eth.Contract(JSON.parse(this.PCS_FACTORY_ABI), this.PCS_FACTORY_CA);
        this.pcs_router = new this.web3.eth.Contract(JSON.parse(this.PCS_ROUTER_ABI), this.PCS_ROUTER_CA);

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
        this.target_contract_callable = new this.web3.eth.Contract(JSON.parse(this.BALANCE_ABI), this.target_contract);
    }

    public getTargetContract() : string {
        return this.target_contract;
    }

    public getTargetContractCallable() {
        return this.target_contract_callable;
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
     * @function preparePresaleTXs() prepare txs to sign
     * @returns {void}
     * @throws Will throw error if gas settings are wrong.
     */
    //TODO: implementare logs degli errori col callback
    public preparePresaleTXs() : void {
        
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
     * @function prepareFairlaunchTXs() prepare txs to sign
     * @returns {void}
     * @throws Will throw error if gas settings are wrong.
     */
    //TODO: implementare logs degli errori col callback
    public async prepareFairlaunchTXs(bnb_pair : boolean) {
        
        //lines needed if there is the necessity to re-prepare the txs (in case of deadline reached)
        this.signed_tx = [new Promise<Object>(function(){})];
        this.signed_tx.pop();
        
        for (var key of this.private_keys) {
 
            if (bnb_pair) {
                this.signed_tx.push(
                    this.web3.eth.accounts.signTransaction(
                        {
                            'from': await this.web3.eth.accounts.privateKeyToAccount(key).address,
                            'to': this.PCS_ROUTER_CA,
                            'value': this.web3.utils.toHex(this.web3.utils.toWei(this.amount, 'ether')),
                            'chainId': this.CHAIN_ID,
                            'gas': this.web3.utils.toHex(this.gas_amount),
                            'gasPrice': this.web3.utils.toHex(this.web3.utils.toWei(this.gas_price, 'gwei')),
                            'data': this.pcs_router.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
            
                                this.web3.utils.toHex(this.web3.utils.toWei('0', 'ether')), //SLIPPAGE 100%
                                [this.WBNB_ADDRESS, this.target_contract],
                                await this.web3.eth.accounts.privateKeyToAccount(key).address,
                                this.web3.utils.toHex((new Date()).getTime() + 1000 * 60 * 20)
                                
                            ).encodeABI()
                        },
                        key,
                        null
                    )
                );                
            }
            

            else {
                this.signed_tx.push(
                    this.web3.eth.accounts.signTransaction(

                        {
                            'from': await this.web3.eth.accounts.privateKeyToAccount(key).address,
                            'to': this.PCS_ROUTER_CA,
                            'chainId': this.CHAIN_ID,
                            'gas': this.web3.utils.toHex(this.gas_amount),
                            'gasPrice': this.web3.utils.toHex(this.web3.utils.toWei(this.gas_price, 'gwei')),
                            'data': this.pcs_router.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                
                                this.web3.utils.toHex(this.web3.utils.toWei(this.amount, 'ether')),
                                this.web3.utils.toHex(this.web3.utils.toWei('0', 'ether')), //SLIPPAGE 100%
                                [this.BUSD_ADDRESS, this.target_contract],
                                await this.web3.eth.accounts.privateKeyToAccount(key).address,
                                (new Date()).getTime() + 1000 * 60 * 20
        
                            ).encodeABI()
                        },
                        key,
                        null
                    )
                );
            }
            
        } 
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
            })
            .on('receipt', () => {
                console.log("Transaction confirmed.");
            })
            .on('error', (error : any) => {
                console.log("Error during transaction execution. Details will follow.");
                console.log(error);
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
                try {
                    let current_block : number = await this.web3.eth.getBlockNumber();
                    if (current_block > previous_block || previous_block == undefined) {
                        previous_block = current_block;
                        callback(await this.web3.eth.getBlock('latest'));
                    }
                } catch (err : any) {
                    logger.getInstance().notifyHandledException(err);
                    console.warn("====================" + language.lang.BLOCK_QUERY_ERR + "====================");
                    console.warn(err);
                    console.warn("====================" + language.lang.EOR + "====================");
                    console.warn(language.lang.SHOULD_NOT_INTERFER);
                }
                
            }.bind(this)
            , 100
        ) ;

    }
}

export {CommsHandler}