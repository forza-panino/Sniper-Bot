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
  * _[Interfaccia utente del bot](#bot_interface)_
    - [Inizializzazione](#initialization)
    - [Configurazione del wallet](#wallet_configuration)
    - [Impostazione dell'indirizzo bersaglio](#target_address)
    - [Validazione input](#input_validation)
    - [Orario di inizio della presale](#time_settings)
    - [Avvio dello sniping](#sniping)
  * _[Specifiche tecniche](#specifics)_
* __[Licenza](#license_link)__
* __[Crediti](#credits_link)__




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
</br></br></br>

<a name="bot_interface"></a>
### Interfaccia utente del bot
Impostare i vari dettagli con questo bot può risultare un po' lento, ridondante e leggermente noioso, ma evita il più possibile eventuali errori dell'utente.

<a name="initialization"></a>
#### 1. Inizializzazione
Il bot carica le impostazioni di lancio e le mostra all'utente.</br>
A quest'ultimo verrà poi chiesto se vuole cambiare il numero di blocchi d'attesa - in caso di risposta positiva il bot necessiterà l'inserimento del nuovo valore.


<a name="wallet_configuration"></a>
#### 2. Configurazione del wallet
Il bot cerca un eventuale file di configurazione preesistente:
* Se non esiste, verrà cominiciata la procedura di configurazione del wallet ed un nuovo file verrà creato - verrà infine mostrata la nuova configurazione.
* Se esiste, il bot mostrerà la configurazione corrente e chiederà conferma.</br> _Nota: se decidi di cambiare le impostazioni correnti il file di configurazione verrà sovrascritto: i cambiamenti saranno, cioè, permanenti_


<a name="target_address"></a>
#### 3. Impostazione dell'indirizzo bersaglio
Il bot chiede l'inserimento dell'indirizzo bersaglio, che chiameremo _target address_ (bisogna copiare il `presale address` in caso si stesse effettuando lo sniping di una presale oppure il `token address` nel caso di fairlaunch).

<a name="input_validation"></a>
#### 4. Validazione input
Il bot controlla se la `private_key` ed il `target_address` dati sono validi - in caso non lo siano verrà sollevato un errore ed il bot terminerà la sua esecuzione.

<a name="time_settings"></a>
#### 5. Orario di inizio della presale (solo per la modalità _presale_)
Il bot chiede l'inserimento dell'orario di inizio della presale. </br>
**Attenzione**: usare l'orario locale!

<a name="sniping"></a>
#### 6. Avvio dello sniping
Il bot avvia il processo di sniping e mostra il seguente messaggio: </br>
_Attendendo l'orario di inizio.._


Successivamente, non verrà mostrato alcun messaggio finché non avviene un evento di attivazione; ciò significa:
* In modalità _presale_ aspetta il primo blocco il cui `timestamp` è maggiore od uguale al `trigger_time` (l'orario di inizio della presale)
* In modalità _fairlaunch_ aspetta che la liquidità venga immessa

Quando avviene uno di questi due eventi viene mostrato il seguente messaggio: </br>
_Bot armato._

Successivamente, se richiesto, aspetterà un numero di blocchi pari a quello impostato prima di emettere la transazione sulla blockchain, per poi concludere con una di queste due situazioni finali:
* Transazione emessa con successo: viene mostrata il transaction hash associato ad essa
* Si verifica un errore: viene mostrato il messaggio di errore
</br>

<a name="specifics"></a>
### Specifiche tecniche
* `gas_amount`: il numero massimo di unità di gas che si intende usare
* `gas_price`: quanto si intende pagare il gas in **GWEI** per unità di gas (stessa unità di misura di MetaMask)
* `gas_price`: l'ammontare di BNB che si intende inviare (quindi **ETHER** come unità di misura)
</br>

<a name="license_link"></a>
## Licenza
Controlla il [LICENSE file](./LICENSE).

<a name="credits_link"></a>
## Crediti
Sviluppato da @forza-panino per il gruppo telegram [Spartan-Crypto](https://t.me/Spartancryptoita), sponsor principale.
