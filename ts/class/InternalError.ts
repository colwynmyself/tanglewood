import { Request } from 'koa';
const debug = require('debug')('colwyn:classes:error');

export class InternalError extends Error {
    constructor(message: string) {
        super(message);
    }

    debugError(req: Request): void {
        // Remove all the koa-route data from the stack trace
        const stack: string = this.stack
            .replace(/^.*node_modules\/koa-route\/index.js.*$/mg, '')
            .replace(/^.*at next \(native\).*$/mg, '');
        const filteredStack: string = stack
            .split('\n')
            .filter(a => a !== '')
            .join('\n');
        debug(`${this.name} at ${new Date()} (koa-route stack information redacted):`);
        debug(this.message);
        debug(filteredStack);
        if (req) {
            debug(req);
            if (['PUT', 'POST'].indexOf(req.method) > -1) debug(req.fields);
        }
    }
}
