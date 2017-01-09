"use strict";
const koa = require("koa");
const route = require("koa-route");
const chalk = require("chalk");
const path = require("path");
const Debug = require("debug");
const Logger = require("koa-logger");
const KoaBody = require("koa-better-body");
const Handlebars = require("koa-handlebars");
const Cache = require("koa-static-cache");
const InternalError_1 = require("./class/InternalError");
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const fedir = path.join(__dirname, 'public');
const serverdir = path.join(__dirname, '..');
const handlebarsObject = {
    root: '/',
    cache: env !== 'development',
    defaultLayout: 'main',
    layoutsDir: path.join(serverdir, 'hbs', 'layouts'),
    partialsDir: path.join(serverdir, 'hbs', 'partials'),
    viewsDir: path.join(serverdir, 'hbs', 'views'),
};
const cacheObject = {
    maxAge: env !== 'development' ? (24 * 60 * 60) : 0,
};
const debug = Debug('tanglewood:main');
const logger = Logger();
const app = koa();
app.use(Handlebars(handlebarsObject));
app.use(Cache(path.join(fedir, 'public'), cacheObject));
app.use(function* globalError(next) {
    try {
        yield next;
    }
    catch (err) {
        const internalErr = new InternalError_1.InternalError(err.message);
        internalErr.debugError(this.request);
        this.status = 500;
        this.body = 'Internal server error: ' + err.message;
    }
});
app.use(logger);
app.use(KoaBody());
app.use(route.get('/', function* terminalnput() {
    yield this.render('shoppinglist');
}));
app.listen(port, () => {
    debug(chalk.blue('tanglewood') + ` started on port ${port} in ${env} mode`);
});
//# sourceMappingURL=main.js.map