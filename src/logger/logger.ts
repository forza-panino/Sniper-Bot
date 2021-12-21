const fs = require('fs');

class logger {

    /**
     * @property
     * @private
     * @readonly
     * @description folder path
     */
    private readonly path = "./logs/";

    private readonly filetimestamp : Logger.FileTimestamp;

    /**
     * @property
     * @private
     * @readonly
     * @description path of log file for current bot process.
     */
    private readonly full_path : string;

    /**
     * @property
     * @private
     * @static
     * @description the only instance of logger class
     */
    private static instance : logger;

    private bot_settings : {settings: Map<string, boolean | number>, notification_time: Logger.LoggingTimestamp};
    private wallet_config : {configuration: Map<string, string>, notification_time: Logger.LoggingTimestamp};
    private target_address : {target_address: string, notification_time: Logger.LoggingTimestamp};
    private target_time : {target_time: number, notification_time: Logger.LoggingTimestamp};

    /**
     * @method
     * @private
     * @readonly
     * @name update()
     * @param {{error: Error, caught: boolean, timestamp: Logger.LoggingTimestamp}} error error to log - if any
     * @param {boolean} exiting true if program is exiting, false otherwise.
     * @description updates and handles log file.
     */
    private readonly update = (function () {

        var isBotSettingsDisplayed : boolean = false;
        var isWalletConfigDisplayed : boolean = false;
        var isTargetAddressDisplayed : boolean = false;
        var isTargetTimeDisplayed : boolean = false;

        /**
         * @description flagged to true in case of uncaught rejections/exceptions, sigint and process.exit([not 0])
         */
        var fatalError : boolean = false;
        
        return function (error? : {error: Error, caught: boolean, timestamp: Logger.LoggingTimestamp}, exiting? : boolean) {

            fs.appendFileSync(this.full_path, "\n");

            if (exiting) {                
                if (fatalError) {                    
                    fs.appendFileSync(this.full_path, "\n\nEnd of Log (Terminated with fatal error).");
                    this.clearSensibleData();
                }
                else {                    
                    if (process.env.npm_package_debug) {
                        fs.appendFileSync(this.full_path, "\n\nEnd of Log (Terminated with NO fatal error - log generated because of debug mode on).");
                        this.clearSensibleData();
                    }
                    else {
                        try {
                            fs.unlinkSync(this.full_path);
                        } catch (error : any) {
                            console.error(error);
                        };
                        
                    }
                }
                return;
            }

            if (error) {
                if (error.caught) {
                    fs.appendFileSync(this.full_path, error.timestamp + "\t" + "===CAUGHT error===");
                    fs.appendFileSync(this.full_path, "\n");
                    fs.appendFileSync(this.full_path, error.error.name);
                    fs.appendFileSync(this.full_path, "\n");
                    fs.appendFileSync(this.full_path, error.error.message);
                    fs.appendFileSync(this.full_path, "\n");
                    fs.appendFileSync(this.full_path, error.error.stack ? error.error.stack : "stack not available.");
                    fs.appendFileSync(this.full_path, "\n");
                    fs.appendFileSync(this.full_path, "===================END OF ERROR===");
                }
                else {
                    fs.appendFileSync(this.full_path, error.timestamp + "\t" + "===UNCAUGHT error===");
                    fs.appendFileSync(this.full_path, "\n");
                    fs.appendFileSync(this.full_path, error.error.name);
                    fs.appendFileSync(this.full_path, "\n");
                    fs.appendFileSync(this.full_path, error.error.message);
                    fs.appendFileSync(this.full_path, "\n");
                    fs.appendFileSync(this.full_path, error.error.stack ? error.error.stack : "stack not available.");
                    fs.appendFileSync(this.full_path, "\n");
                    fs.appendFileSync(this.full_path, "===================END OF ERROR=====");
                    fatalError = true;                    
                    logger.getInstance().update(null, true);
                }
                return;
            }

            if (!isBotSettingsDisplayed) {
                if (this.bot_settings) {
                    fs.appendFileSync(this.full_path, this.bot_settings.notification_time + "\t" + "Bot started with following setting: \n");
                    fs.appendFileSync(this.full_path, "Mode: " + (this.bot_settings.settings.get('fairlaunch') ? 'fairlaunch' : 'presale') + "\n");
                    fs.appendFileSync(this.full_path, "Delay: " + (this.bot_settings.settings.get('delay') ? 'on (' + this.bot_settings.settings.get('delay') + ' '+ 'blocks' + ')' : 'off') + "\n");
                    fs.appendFileSync(this.full_path, "Mode: " + (this.bot_settings.settings.get('testnet') ? 'testnet' : 'mainnet') + "\n");
                    isBotSettingsDisplayed = true;
                }
                else
                    throw new Error("No bot settings data (and further) available.");
            }
            else if (!isWalletConfigDisplayed) {
                if (this.wallet_config) {
                    fs.appendFileSync(this.full_path, this.wallet_config.notification_time + "\t" + "Wallet configuration is the following: \n");
                    fs.appendFileSync(this.full_path, "Private key: " + "[CENSORED]\n");
                    fs.appendFileSync(this.full_path, "Gas amount: " + this.wallet_config.configuration.get('gas_amount') + "\n");
                    fs.appendFileSync(this.full_path, "Gas price: " + this.wallet_config.configuration.get('gas_price') + "\n");
                    fs.appendFileSync(this.full_path, "Amount: " + this.wallet_config.configuration.get('amount') + "\n");
                    isWalletConfigDisplayed = true;
                }
                else
                    throw new Error("No wallet settings data (and further) available.");
            }
            else if (!isTargetAddressDisplayed) {
                if (this.target_address) {
                    fs.appendFileSync(this.full_path, this.target_address.notification_time + "\t" + "Target address: " + this.target_address.target_address);
                    isTargetAddressDisplayed = true;
                }
                else 
                    throw new Error("No target address (and further) available.");
            }
            else if (!isTargetTimeDisplayed){
                if (this.target_time) {
                    fs.appendFileSync(this.full_path, this.target_time.notification_time + "\t" + "Target time: " + this.target_time.target_time);
                    isTargetTimeDisplayed = true
                }
                else 
                    throw new Error("No target address (and further) available.");
            }
        }

    })();

    /**
     * @method clearSensibleData() removes sensible data that may have been logged.
     * @private
     */
    private clearSensibleData() {
        if (this.wallet_config && this.wallet_config.configuration.has('private_key')) {            
            let private_key_regex : RegExp = new RegExp(`${this.bot_settings.settings.get('private_key')}`, 'g');
            let log : string = fs.readFileSync(this.full_path, 'utf8');            
            fs.writeFileSync(this.full_path, log.replace(private_key_regex, "[PRIVATE KEY CENSORED]"));
        }
    }


    /**
     * Returns Logger instance and subscribes to exit/stop events to finalize logging before app closes
     * @constructor
     * @private
     */
    private constructor() {

        this.filetimestamp = Logger.FileTimestamp.getTimestamp();
        this.full_path = this.path + this.filetimestamp.toString() + ".txt";
        fs.appendFileSync(this.full_path, `===LOG FILE CREATED AT TIMESTAMP ${this.filetimestamp}===\n\n`);

        /**
         * @function exitHandler()
         * @param {number} exitCode exit code.
         * @description handles calls of process.exit().
         */
        function exitHandler(exitCode: number) {

            //code -10: used internally to flag process.exit() called by others event handlers.
            if (exitCode == -10)      
                process.exit(); 
                
            //code 10: flags process.exit() called by bot itself during execution.
            else if (exitCode == 10) {
                this.update({
                    error: new Error("exit(10) has been called. Program forcibly closed by itself."),
                    caught: false,
                    timestamp: Logger.LoggingTimestamp.getTimestamp()
                }, false);
            }

            //no errors
            else if (exitCode == 0){
                this.update(null, true);
            }

            //other codes (external entities called process.exit())
            else {
                this.update({
                    error: new Error(`exit(${exitCode}) has been called. Program forcibly closed by external entity.`),
                    caught: false,
                    timestamp: Logger.LoggingTimestamp.getTimestamp()
                }, false);
            }
            process.exit();
        }

        /**
         * @function sigHandler()
         * @param {any} sig type of SIG that has been invoked (e.g. SIGINT).
         * @description handles SIG events.
         */
        function sigHandler(sig : any) {
            this.update({
                error: new Error(`Sig (${sig.toString()}) has been called. Program forcibly closed by external entity.`),
                caught: false,
                timestamp: Logger.LoggingTimestamp.getTimestamp()
            }, false);
            process.exit(-10);
        }
        
        /**
         * @function uncaughtHandler()
         * @param {Error} error unhandled error
         * @description handles events "uncaughtException" and "unCaightRejection"
         */
        function uncaughtHandler(error : Error) {            
            this.update({
                error: error,
                caught: false,
                timestamp: Logger.LoggingTimestamp.getTimestamp()
            }, false);
            console.error(error);
            process.exit(-10);
        }
        
        process.on('exit', exitHandler.bind(this))
               .on('beforeExit', exitHandler.bind(this))
               .on('SIGINT', sigHandler.bind(this))
               .on('SIGUSR1', sigHandler.bind(this))
               .on('SIGUSR2', sigHandler.bind(this))
               .on('uncaughtException', uncaughtHandler.bind(this))
               .on('unhandledRejection', uncaughtHandler.bind(this));
    }

    /**
     * @method getInstance() returns the only instance of Logger (singleton) 
     * @returns {Logger} returns Logger.instance
     */
    public static getInstance() : logger {
        if (logger.instance)
            return logger.instance;
        
        logger.instance = new logger();
        return logger.instance;
    }

    /**
     * @method updateBotConfig()
     * @public
     */
    public updateBotConfig(bot_settings : Map<string, boolean | number>) {
        this.bot_settings = {
            settings: bot_settings,
            notification_time: Logger.LoggingTimestamp.getTimestamp()
        };
        this.update(null, false);
    }

    /**
     * @method updateWalletConfig()
     * @public
     */
    public updateWalletConfig(wallet_config : Map<string, string>) {
        wallet_config.set('private_key', "CENSORED");
        this.wallet_config = {
            configuration: wallet_config,
            notification_time: Logger.LoggingTimestamp.getTimestamp()
        };
        this.update(null, false);
    }

    /**
     * @method updateAddress()
     * @public
     */
    public updateAddress(address: string) {
        this.target_address = {
            target_address: address,
            notification_time: Logger.LoggingTimestamp.getTimestamp()
        }
        this.update(null, false);
    }

    /**
     * @method updateTime()
     * @public
     */
    public updateTime(time: number) {
        this.target_time = {
            target_time: time,
            notification_time: Logger.LoggingTimestamp.getTimestamp()
        }
        this.update(null, false);
    }

    /**
     * @method notifyHandledException()
     * @public
     * @description notifies the logger for handled exceptions.
     * @param {Error} error error to notify.
     */
    public notifyHandledException(error : Error) {
        this.update({
                error: error,
                caught: true,
                timestamp: Logger.LoggingTimestamp.getTimestamp()
            }, false);
    }


}

namespace Logger {
    
    /**
     * @exports
     * @class
     * @name LoggingTimestamp
     * @extends Object
     * @description This class is used to define formatting of logs' timestamps.
     */
    export class LoggingTimestamp extends Object {

        /**
         * @private
         * @readonly
         * @property
         * @description will be a string of the format [hh:mm:ss:millis]
         */
        private readonly timestamp : string;


        /**
         * Private constructor of LoggingTimestamp class.
         * @constructor
         * @private
         * @param {string} timestamp the timestamp string returned by LoggingTimestamp.getTimestamp()
         */
        private constructor(timestamp : string) {
            super();
            this.timestamp = timestamp;
        }



        /**
         * @method getTimestamp()
         * @returns {LoggingTimestamp} correct instance of LoggingTimestamp to use for logging.
         */
        public static getTimestamp() : LoggingTimestamp {
            let now : Date = new Date();

            //Leading zeroes have to be manually inserted.
            return new LoggingTimestamp(`[${now.getHours() < 10 ? "0" + now.getHours().toString() : now.getHours()}:`+
                                        `${now.getMinutes() < 10 ? "0" + now.getMinutes().toString() : now.getMinutes()}:`+
                                        `${now.getSeconds() < 10 ? "0" + now.getSeconds().toString() : now.getSeconds()}:`+
                                        `${now.getMilliseconds() < 10 ? "000" + now.getMilliseconds().toString() : 
                                           now.getMilliseconds() < 100 ? "00" + now.getMilliseconds().toString() : "0" + now.getMilliseconds().toString()}]`);
        }

        /**
         * @method toString()
         * @override
         * @returns {string} returns correct string representation of LoggingTimestamp instance (the timestamp property) - if correctly set.
         */
        override toString() : string {
            if (this.timestamp)
                return this.timestamp;
            return "TIMESTAMP NOT SET: you should create the instance only via the static method Logger.LoggingTimestamp.getTimestamp()";
        }

    };

    /**
     * @exports
     * @class
     * @name FileTimestamp
     * @extends Object
     * @description This class is used to define formatting of log file's timestamp.
     */
    export class FileTimestamp extends Object {

        /**
         * @private
         * @readonly
         * @property
         * @description will be a string of the format ddmmyyyy-hhmmss
         */
         private readonly timestamp : string;


        /**
         * Private constructor of FileTimestamp class.
         * @constructor
         * @private
         * @param {string} timestamp the timestamp string returned by FileTimestamp.getTimestamp()
         */
         private constructor(timestamp : string) {
            super();
            this.timestamp = timestamp;
        }


        /**
         * @method getTimestamp()
         * @returns {FileTimestamp} correct instance of FileTimestamp to use for log file's name.
         */
        public static getTimestamp() : FileTimestamp {
            let now : Date = new Date();

            //leading zeroes have to be manually inserted
            return new FileTimestamp(`${now.getDay() < 10 ? "0" + now.getDay().toString() : now.getDay().toString()}`+
                                     `${now.getMonth() < 10 ? "0" + now.getMonth().toString() : now.getMonth().toString()}`+
                                     `${now.getFullYear()}-`+
                                     `${now.getHours() < 10 ? "0" + now.getHours().toString() : now.getHours().toString()}`+
                                     `${now.getMinutes() < 10 ? "0" + now.getMinutes().toString() : now.getMinutes().toString()}`+
                                     `${now.getSeconds() < 10 ? "0" + now.getSeconds().toString() : now.getSeconds().toString()}`);
        }

        /**
         * @method toString()
         * @override
         * @returns {sttring} returns correct string representation of FileTimestamp instance (the timestamp property) - if correctly set.
         */
        override toString() : string {
            if (this.timestamp)
                return this.timestamp;
            return "TIMESTAMP NOT SET: you should create the instance only via the static method Logger.FileTimestamp.getTimestamp()";
        }

    };

}

export {Logger, logger}