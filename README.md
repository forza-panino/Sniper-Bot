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
You can install NodeJS through the [official installer](https://nodejs.org/en/download/) (be sure to select *LTS* and **not** *current*); if you're using Linux or another OS instead of Windows or macOS than, [as per documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), it is reccomended to use [NodeSource installer](https://github.com/nodesource/distributions).
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
Once you have insalled everything correctly you can start the bot using a terminal opened inside the project folder and digiting one of the following commands:

<a name="normal_commands"></a>
#### Normal use commands
These are the commands that you are most likely to need:

* `npm run mainnet-presale`: 
  - starts bot on the **mainnet**
  - selects the mode *presale* (snipes presales)
  - sets number of delay blocks to **zero** (antibot avoidance **OFF**).
* `npm run mainnet-presale-with-delay`: 
  - starts bot on the **mainnet**
  - selects the mode *presale* (snipes fairlaunches)
  - sets number of delay blocks to **5** (antibot avoidance **ON**).
* `npm run mainnet-fairlaunch` _(note: fairlaunch feature still under development)_ : 
  - starts bot on the **mainnet**
  - selects the mode *fairlaunch* (snipes presales)
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
  - selects the mode *presale* (snipes fairlaunches)
  - sets number of delay blocks to **5** (antibot avoidance **ON**).
* `npm run testnet-fairlaunch` _(note: fairlaunch feature still under development)_ : 
  - starts bot on the **testnet**
  - selects the mode *fairlaunch* (snipes presales)
  - sets number of delay blocks to **zero** (antibot avoidance **OFF**).
* `npm run testnet-fairlaunch-with-delay` _(note: fairlaunch feature still under development)_ : 
  - starts bot on the **testnet**
  - selects the mode *fairlaunch* (snipes fairlaunches)
  - sets number of delay blocks to **5** (antibot avoidance **ON**).

_Notice: whether you have launched the bot with antibot avoidance on or off, you will always have the possibility to change the number of delay blocks (zero will result in the deactivation of the delay system for the current operation)_.
