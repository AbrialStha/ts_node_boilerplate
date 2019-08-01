
import express, { Router, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import favicon from 'serve-favicon'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'
import fs, { lstatSync } from 'fs'

import winston from './middleware/winston'
import NotFound from './exceptions/NotFound';

export default class App {
    private static instance: App
    private app: express.Application

    private constructor() {
        this.app = express()
        this.connectDb()
        this.initMiddleware(this.app)
        this.initRoutes(this.app)
        this.initErrorHandle()
    }

    public static getInstance(): express.Application {
        if (!App.instance) App.instance = new App();
        return App.instance.app
    }
    /**
   * DataBase COnnection
   */
    private connectDb() {
        let dbname: any = process.env.DB //get the mongoose db values from config
        mongoose.connect(dbname, { useNewUrlParser: true }); //connect to the database
        mongoose.Promise = global.Promise; //get mongoose to use the global library
        let db: mongoose.Connection = mongoose.connection; //Get the default connection
        db.on("error", console.error.bind(console, "MongoDB connection error:")); //Bind connection to error event (to get notification of connection errors)
    }

    /**
     * Initialize the Middlewares
     */
    private initMiddleware(app: express.Application) {
        // view engine setup
        app.set("views", path.join(__dirname, "/../views"));
        app.set("view engine", "jade");

        //Express Configuration
        app.use(favicon(path.join(__dirname, "/../public", "favicon.ico")));
        app.use(morgan('combined', { "stream": <any>winston.stream }));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, '/../public')));
        app.use(cors());
        //Initialize passport
        app.use(passport.initialize());
        //passport Config
        import('./middleware/passport').then(passportConfig => passportConfig.default(passport))
    }

    /**
     * Initialize the Routes
     */
    private initRoutes(app: express.Application) {
        const routeSource = `${__dirname}/routes`
        const isDirectory = (source: string) => lstatSync(<any>source).isDirectory()
        const versions: Array<string> = fs.readdirSync(<any>routeSource).filter(name => isDirectory(path.join(routeSource, name)) && name)
        versions.forEach(vname => {
            fs.readdirSync(path.join(routeSource, vname)).forEach(file => {
                var fname = file.split('.')[0];
                if (!fname.includes("index")) {
                    app.use(`/api/${vname}/${fname}`, <any>require(`${routeSource}/${vname}/${fname}`).default)
                } else {
                    app.use(`/api/${vname}/`, <any>require(`${routeSource}/${vname}/${fname}`).default)
                }
            })
        })
    }

    /**
    * Initialize the ErrorHandle
    */
    private initErrorHandle() {
        // using arrow syntax
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            let err: any = new NotFound('The Request Cannot be Found');
            next(err);
        });

        if (this.app.get("env") === "development") {
            this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
                if (typeof err.parse !== undefined) winston.error(err.parse())
                winston.warn(`\n Stack Trace ----> \n ${err.stack}`)
                res.status(err.status || 500);
                res.json(err);
            });
        }

        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            if (typeof err.parse !== undefined) winston.error(err.parse())
            res.status(err.status || 500);
            res.json(err);
        });
    }
}