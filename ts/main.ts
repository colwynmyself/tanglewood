// Module imports
import * as koa from 'koa';
import * as route from 'koa-route';
import * as chalk from 'chalk';
import * as path from 'path';

// Module constructor imports
import * as Debug from 'debug';
import * as Logger from 'koa-logger';
import * as KoaBody from 'koa-better-body';
import * as Handlebars from 'koa-handlebars';
import * as Cache from 'koa-static-cache';

// Classes
import { InternalError } from './class/InternalError';

// Server vars
const port: number = process.env.PORT || 3000;
const env: string = process.env.NODE_ENV || 'development';
const fedir: string = path.join(__dirname, 'public');
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

// Object inits
const debug = Debug('tanglewood:main');
const logger = Logger();

// App initialization
const app = koa();

// App middleware
app.use(Handlebars(handlebarsObject));
app.use(Cache(path.join(fedir, 'public'), cacheObject));

// Global error handling
app.use(function* globalError(next: any) {
    try {
        yield next;
    } catch (err) {
        const internalErr: InternalError = new InternalError(err.message);
        internalErr.debugError(this.request);
        this.status = 500;
        this.body = 'Internal server error: ' + err.message;
    }
});

// App middleware
app.use(logger);
app.use(KoaBody());

// Routes
app.use(route.get('/', function* terminalnput() {
    yield this.render('shoppinglist');
}));

// Server listen
app.listen(port, () => {
    debug(chalk.blue('tanglewood') + ` started on port ${port} in ${env} mode`);
});
