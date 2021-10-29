<p align="center">
  <img style="width: 40%; height: 40%: align: center" src="assets/logo.png" alt="Spartan-Crypto logo">
</p>
<h1 align="center">Sniper-Bot</h1>

Un bot gratuito da usare che consente lo sniping delle presale che avvengono su DxSale, Pinksale, o qualsiasi altra piattaforma sulla BSC dove bisogna mandare BNB ad un qualche `presale address`.


## Indice
* __[Caratteristiche](#features)__
* __[Installazione](#installation)__
  * [requisiti](#requirements)
  * [guida all'installazione](#installation_guide)
* __[Guida del bot](#bot_guide)__
  * _[Comandi disponibili](#commands_overview)_
    - [comandi per il normale utilizzo](#normal_commands)
    - [comandi per scopi di developing o testing](#dev_commands)




<a name="features"></a>
## Caratteristiche
- [x] Multi-piattaforma (DxSale, Pinksale o qualsiasi altra piattaforma sulla BSC dove bisogna mandare BNB ad un qualche `presale address`)
- [x] Elusione dei sistemi antibot
- [x] Impostazioni delle transazioni personalizzabili
- [ ] Multiwallet (*da sviluppare*)
- [ ] Fairlaunch sniping (*da sviluppare*)
- [ ] Supporto multichain (*da sviluppare*)





<a name="installation"></a>

<a name="requirements"></a>
## Requisiti
* npm
* NodeJS

### Guida all'installazione dei requisiti
Puoi installare NodeJS tramite l'[installer ufficiale](https://nodejs.org/en/download/) (assicurati di selezionare *LTS* e **non** *current*); se stai usando Linux o qualche altro OS invece di Windows o macOS allora, [come da documentazione](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), è raccomandata l'installazione tramite [NodeSource installer](https://github.com/nodesource/distributions).
 </br>NPM verrà installato automaticamente insieme a NodeJS.

<a name="installation_guide"></a>
## Guida all'installazione
<ol>
  <li>
    Ottenere una copia di questa repository sul tuo computer. Ci sono due modi per farlo:
    <ul>
      <li>Clonare la repository tramite Git</li>
      <li>Scaricare la repository come ZIP ed effettuare l'unzip</li>
    </ul>
  </li>
  <li>Aprire un terminale dentro la cartella del progetto</li>
  <li>Digitare ed eseguire il comando <code>npm install</code> ed aspettare che npm installi tutti i package necessari</li>
</ol>




<a name="bot_guide"></a>
## Guida del bot


<a name="commands_overview"></a>
### Comandi disponibili
Una volta che hai installato tutto correttamente puoi avviare il bot usando un terminale aperto dentro la cartella del progetto e digitando uno dei seguenti commandi:

<a name="normal_commands"></a>
#### comandi per il normale utilizzo
Questi sono i comandi di cui avrai probabilmente bisogno:

* `npm run mainnet-presale`: 
  - avvia il bot sulla **mainnet**
  - seleziona la modalità *presale* (sniping delle presale)
  - imposta il numero dei blocchi di ritardo a **zero** (elusione antibot **OFF**)
* `npm run mainnet-presale-with-delay`: 
  - avvia il bot sulla **mainnet**
  - seleziona la modalità *presale* (sniping delle presale)
  - imposta il numero dei blocchi di ritardo a **5** (elusione antibot **ON**)
* `npm run mainnet-fairlaunch` _(nota: funzionalità ancora in sviluppo)_ : 
  - avvia il bot sulla **mainnet**
  - seleziona la modalità *fairlaunch* (sniping dei fairlaunch)
  - imposta il numero dei blocchi di ritardo a **zero** (elusione antibot **OFF**)
* `npm run mainnet-fairlaunch-with-delay` _(nota: funzionalità ancora in sviluppo)_ : 
  - avvia il bot sulla **mainnet**
  - seleziona la modalità *fairlaunch* (sniping dei fairlaunch)
  - imposta il numero dei blocchi di ritardo a **5** (elusione antibot **ON**)


<a name="dev_commands"></a>
#### comandi per scopi di developing o testing
Questi comandi sono utili se vuoi provare il bot sulla testnet:

* `npm run testnet-presale`: 
  - avvia il bot sulla **testnet**
  - seleziona la modalità *presale* (sniping delle presale)
  - imposta il numero dei blocchi di ritardo a **zero** (elusione antibot **OFF**)
* `npm run testnet-presale-with-delay`: 
  - avvia il bot sulla **testnet**
  - seleziona la modalità *presale* (sniping delle presale)
  - imposta il numero dei blocchi di ritardo a **5** (elusione antibot **ON**)
* `npm run testnet-fairlaunch` _(nota: funzionalità ancora in sviluppo)_ : 
  - avvia il bot sulla **testnet**
  - seleziona la modalità *fairlaunch* (sniping dei fairlaunch)
  - imposta il numero dei blocchi di ritardo a **zero** (elusione antibot **OFF**)
* `npm run testnet-fairlaunch-with-delay` _(nota: funzionalità ancora in sviluppo)_ : 
  - avvia il bot sulla **testnet**
  - seleziona la modalità *fairlaunch* (sniping dei fairlaunch)
  - imposta il numero dei blocchi di ritardo a **5** (elusione antibot **ON**)


_Nota: Sia che tu abbia avviato il bot con l'elusione dei sistemi antibot attiva o disattiva, avrai sempre la possibilità di cambiare il numero dei blocchi di ritardo (zero risulterà nella disattivazione della funzionalità per l'operazione in corso)_.
