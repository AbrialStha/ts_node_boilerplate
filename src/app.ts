import express, { Request, Response, NextFunction } from 'express'

import path from "path";
import favicon from "serve-favicon";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";

import routes from './routes'
import winston from './config/winston'

export default class App {
    public app: express.Application

    constructor() {
        this.app = express();
        this.connectDb();
        this.initMiddleware();
        this.initRoutes();
        this.initErrorHandle();
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
    private initMiddleware() {
        let app = this.app;
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
        import('./config/passport').then(passportConfig => passportConfig.default(passport))
    }

    /**
     * Initialize the Routes
     */
    private initRoutes() {
        let app = this.app;
        let keys: Array<string> = Object.keys(routes);
        let ver: String = '/api/v1/'
        keys.forEach(k => {
            if (k !== "base")
                app.use(`${ver}${k}`, routes[k])
            else
                app.use(`${ver}`, routes[k])

        })
    }

    /**
    * Initialize the ErrorHandle
    */
    private initErrorHandle() {
        // using arrow syntax
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            let err: any = new Error("Not Found");
            err.status = 404;
            next(err);
        });

        if (this.app.get("env") === "development") {
            this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
                winston.error(err)
                winston.warn(`\n Stack Trace ----> \n ${err.stack}`)
                err.parse()
                res.status(err.status || 500);
                res.json(err);
            });
        }

        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            winston.error(err)
            err.parse()
            res.status(err.status || 500);
            res.json(err);
        });
    }

}