export const LOG_LEVEL_ERROR = 0,
    LOG_LEVEL_WARNING = 1,
    LOG_LEVEL_INFO = 2,
    LOG_LEVEL_DEBUG = 3;

export class Logger {
    private logLevel: number = LOG_LEVEL_DEBUG;
    private NOOP = function () { }
    
    public debug: any;
    public info: any;
    public warn: any;
    public error: any;

    constructor() {
        this.setLogLevel(LOG_LEVEL_DEBUG);  // TODO: take default log level from config file
    }

    // wrap console.log to get log level filtering
    // the .bind stuff is to preserve console.log functionality that gives line numbers in the console
    public setLogLevel (level: number) {
        this.logLevel = level;
        this.debug = (this.logLevel >= LOG_LEVEL_DEBUG) ? console.debug.bind(window.console) : this.NOOP;
        this.info = (this.logLevel >= LOG_LEVEL_INFO) ? console.info.bind(window.console) : this.NOOP;
        this.warn = (this.logLevel >= LOG_LEVEL_WARNING) ? console.warn.bind(window.console) : this.NOOP;
        this.error = (this.logLevel >= LOG_LEVEL_ERROR) ? console.error.bind(window.console) : this.NOOP;
    }
    
}