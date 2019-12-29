interface LoggerTarget {
    error: typeof console.error
}

export class Logger {
    private isMuted = false
    constructor(private target: LoggerTarget = console) {}

    muteLogs() {
        this.isMuted = true
    }

    unmuteLogs() {
        this.isMuted = false
    }

    error(...args: any[]) {
        if (this.isMuted) {
            return
        }
        this.target.error(...args)
    }
}

export const logger = new Logger()