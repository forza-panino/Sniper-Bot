<p align="center">
  <img style="width: 40%; height: 40%: align: center" src="assets/logo.png" alt="Spartan-Crypto logo">
</p>
<h1 align="center">Sniper-Bot</h1>

This free-to-use bot allows you to snipe every token presale on DxSale, Pinksale or any other BSC platform where you have to send BNB to some `presale address`.



## Table of Contents
* __[Features](#features)__
* __[Installation](#installation)__
  * [requirements](#requirements)
  * [installation guide](#installation_guide)
* __[Bot guide](#bot_guide)__
  * _[Commands overview](#commands_overview)_
    - [normal use commands](#normal_commands)
    - [developing/testing-purpose commands](#dev_commands)
  * _[Bot's user interface](#bot_interface)_
    - [Initialization](#initialization)
    - [Wallet configuration](#wallet_configuration)
    - [Setting up target address](#target_address)
    - [Input validation](#input_validation)
    - [Time of presale start](#time_settings)
    - [Sniping starts](#sniping)
  * _[Specifications](#specifics)_
* __[License](#license_link)__
* __[Credits](#credits_link)__

<a name="features"></a>
## Features
- [x] Multi-platform (DxSale, Pinksale or any other BSC platform where you have to send BNB to some `presale address`)
- [x] Antibot avoidance
- [x] Transaction settings customizable
- [ ] Multiwallet (*to be developed*)
- [ ] Fairlaunch sniping (*to be developed*)
- [ ] Multichain support (*to be developed*)





<a name="installation"></a>

<a name="requirements"></a>
## Requirements
* npm
* NodeJS

### Requirements installation guide
You can install NodeJS through the [official installer](https://nodejs.org/en/download/) (be sure to select *LTS* and **not** *current*); if you're using Linux or another OS instead of Windows or macOS then, [as per documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), it is reccomended to use [NodeSource installer](https://github.com/nodesource/distributions).
 </br>NPM will be automatically installed along with NodeJS.

<a name="installation_guide"></a>
## Installation Guide
<ol>
  <li>
    Get a copy of this repository on your computer. You have to ways to do it:
    <ul>
      <li>Cloning the repository using Git</li>
      <li>Download the repository as ZIP and unzip it</li>
    </ul>
  </li>
  <li>Open a terminal inside the project folder</li>
  <li>Digit and run the command <code>npm install</code> and wait for npm to install all the packages needed</li>
</ol>




<a name="bot_guide"></a>
## Bot guide


<a name="commands_overview"></a>
### Commands overview
Once you have installed everything correctly you can start the bot using a terminal opened inside the project folder and digiting one of the following commands:

<a name="normal_commands"></a>
#### Normal use commands
These are the commands that you are most likely to need:

* `npm run mainnet-presale`: 
  - starts bot on the **mainnet**
  - selects the mode *presale* (snipes presales)
  - sets number of delay blocks to **zero** (antibot avoidance **OFF**).
* `npm run mainnet-presale-with-delay`: 
  - starts bot on the **mainnet**
  - selects the mode *presale* (snipes presales)
  - sets number of delay blocks to **5** (antibot avoidance **ON**).
* `npm run mainnet-fairlaunch` _(note: fairlaunch feature still under development)_ : 
  - starts bot on the **mainnet**
  - selects the mode *fairlaunch* (snipes fairlaunches)
  - sets number of delay blocks to **zero** (antibot avoidance **OFF**).
* `npm run mainnet-fairlaunch-with-delay` _(note: fairlaunch feature still under development)_ : 
  - starts bot on the **mainnet**
  - selects the mode *fairlaunch* (snipes fairlaunches)
  - sets number of delay blocks to **5** (antibot avoidance **ON**).


<a name="dev_commands"></a>
#### Commands for testing/developing purposes
These commands are useful if you want to try the bot on the testnet:
* `npm run testnet-presale`: 
  - starts bot on the **testnet**
  - selects the mode *presale* (snipes presales)
  - sets number of delay blocks to **zero** (antibot avoidance **OFF**).
* `npm run testnet-presale-with-delay`: 
  - starts bot on the **testnet**
  - selects the mode *presale* (snipes presales)
  - sets number of delay blocks to **5** (antibot avoidance **ON**).
* `npm run testnet-fairlaunch` _(note: fairlaunch feature still under development)_ : 
  - starts bot on the **testnet**
  - selects the mode *fairlaunch* (snipes fairlaunches)
  - sets number of delay blocks to **zero** (antibot avoidance **OFF**).
* `npm run testnet-fairlaunch-with-delay` _(note: fairlaunch feature still under development)_ : 
  - starts bot on the **testnet**
  - selects the mode *fairlaunch* (snipes fairlaunches)
  - sets number of delay blocks to **5** (antibot avoidance **ON**).

_Notice: whether you have launched the bot with antibot avoidance on or off, you will always have the possibility to change the number of delay blocks (zero will result in the deactivation of the delay system for the current operation)_.
</br></br></br>

<a name="bot_interface"></a>
### Bot's user interface
Setting up sniping details with this bot may be a little slow, redundant and slightly boring, but it is error-proof for the user.

<a name="initialization"></a>
#### 1. Initialization
The bot loads the launch settings and shows them to the user. </br>
The user will then be asked if he wants to change the number of delay blocks - in case of a positive answer the bot will require a new value to be prompted.

<a name="wallet_configuration"></a>
#### 2. Wallet configuration
The bot searches for previous wallet configuration file:
* if it doesn't exist, wallet configuration procedure will start and a new configuration file will be created - the new wallet settings will then be shown
* if it does exist, the bot will show the current wallet settings and then asks for confirmation. </br> _Note: if you decide to change the current settings, the configuration file will be overwritten thus changes are permanent_

<a name="target_address"></a>
#### 3. Setting up target address
The bot asks for the target address (`presale address` in case of presale sniping or `token address` in case of fairlaunch sniping).

<a name="input_validation"></a>
#### 4. Input validation
The bot checks if `private_key` and `target_address` are valid - if not, an error will be thrown and the bot will stop executing.

<a name="time_settings"></a>
#### 5. Time of presale start (only for _presale_ mode)
The bot asks for time of presale start. </br>
**Attention**: use your local time!

<a name="sniping"></a>
#### 6. Sniping starts
The bot starts the sniping process and prompts the following message: </br>
_Waiting for time to come..._

Then, no message will be prompted until the triggering event happens; this means:
* In _presale_ mode it waits for the first block whose `timestamp` is greater or equal to `trigger_time` (the time of presale start)
* In _fairlaunch_ mode it waits for liquidity to be added

When the triggering event happens the following message will be prompted: </br>
_Bot armed._

Then, if required, it will wait for the requested number of blocks before issuing the transaction to the blockchain resulting in one of the following final situation:
* Transaction issued succesfully: the transaction hash is prompted
* An error occurs: the error message is prompted
</br>

<a name="specifics"></a>
### Specifications
* `gas_amount`: maximum units of gas you want to use
* `gas_price`: how much you want to pay the gas in **GWEI** per unit of gas (same unit of measurement as MetaMask)
* `gas_price`: the amount of BNB you want to send (thus **ETHER** as unit of measurement)
</br>

<a name="license_link"></a>
## License
Check [LICENSE file](./LICENSE).

<a name="credits_link"></a>
## Credits
Developed by @forza-panino for the telegram group [Spartan-Crypto](https://t.me/Spartancryptoita), main sponsor.
