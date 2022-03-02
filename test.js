const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const configs_path = path.join(__dirname, "configs", "websocket_config.json");
const ws = new Map(JSON.parse(fs.readFileSync(configs_path)));
var web3 = new Web3(new Web3.providers.WebsocketProvider( ws.get("main")));
web3.eth.subscribe('pendingTransactions', async function (err, result) {
    if(!err) {
        /*let current_block : number = result.number;
            if (current_block > previous_block || previous_block == undefined) {
                previous_block = current_block;
                callback(result);
            }*/                
        var tx = await web3.eth.getTransaction(result);
        if (tx === null)
            return;
        if (tx.from === this.PCS_ROUTER_CA) {
            if (tx.input.slice(10) === "0xf305d719") {
                console.log(tx);                
            }
            
        }
    }
});