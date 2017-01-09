"use strict";
const debug = require('debug')('colwyn:classes:error');
class InternalError extends Error {
    constructor(message) {
        super(message);
    }
    debugError(req) {
        const stack = this.stack
            .replace(/^.*node_modules\/koa-route\/index.js.*$/mg, '')
            .replace(/^.*at next \(native\).*$/mg, '');
        const filteredStack = stack
            .split('\n')
            .filter(a => a !== '')
            .join('\n');
        debug(`${this.name} at ${new Date()} (koa-route stack information redacted):`);
        debug(this.message);
        debug(filteredStack);
        if (req) {
            debug(req);
            if (['PUT', 'POST'].indexOf(req.method) > -1)
                debug(req.fields);
        }
    }
}
exports.InternalError = InternalError;
//# sourceMappingURL=InternalError.js.map