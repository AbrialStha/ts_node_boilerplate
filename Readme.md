# Express with TypeScript Implementation

> A experiment for diving in depth with ts and express

Live Demo at [here](https://deltadevblog.herokuapp.com/api/v1/)

## Running the project

```
npm run dev
npm run prod
```

The dev run is actually prety neat, i am using ts-node-dev.

> It restarts target node process when any of required files changes (as standard node-dev) but shares Typescript compilation process between restarts and transpileOnly:true to disable typescript's symantic checker for faster compilation.

```
ts-node-dev --respawn --transpileOnly ./app/bin/WWW.ts
```

The prod run will create a build file by using tsc and after that it is similar to the express-generator which we run by simply node www, in our case node www.ts

```
tsc && node ./build/bin/WWW.js
```

### Running in Docker
```
docker build -t [name_of_image] .
```
```
docker run -it -p 8080:8088 [name_of_image]
```


## To Host in Heroku

> Heroku is great for free hosting and not always that easy to host but its for free and thats what it matters
> To host in heroku, make some changes in the file is need.

- Remove the build file from .gitignore
- add the typescipt dependencies from dev-dependencies
- add the engine in package.json (node and npm are enough)
- also add the Procfile and add the run script from prod in package.json
- include the start in script
- add the enviroment vairable in heroku from the dashboard from web (or CLI directly)

## Folder structure

The folder strucutre a similar to the express-generator

## config

For config i am using dotenv

```
npm install dotenv --save
```

```
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
```

```
set NODE_ENV=production && tsc && node ./build/bin/WWW.js
```

> You should not use .env files in your production environment and always set the values directly on the respective host.

## Routes

The routes are preety simple, it is similar to the routes in express-generator

```
import { Router } from "express";

const router: Router = Router();

router.get("/", function(req: any, res: any) {
  res.send("Hello Worlddd!");
});

export default router;
```

The only different part is, one doesn't need to go and change the app.ts file for adding sub routes, by using app.use(...), this part is dynamically handle by the code. The dynamic routes code does it for you

```
import { Router } from "express";

let routes: { [key: string]: Router } = {}
require('fs').readdirSync(__dirname + '/').forEach(function (file: string) {
  var name = file.split('.')[0];
  if (!name.includes("index"))
    routes[name] = require(`./${name}`).default
});

export default routes;
```

> i.e the posts route will be under `{BASE_URL}/posts` and users route will be under `{BASE_URL}/users`

```
const routes: { [key: string]: Router } = {
  base,
  posts,
  users
};
```

### Controller

```
import { Request, Response, NextFunction } from "express";

class User {
    /**
     * Register New User
     */
    register = (req: Request, res: Response, nxt: NextFunction) => {
        ...
    };

    /**
     * Login by authenticated User
     */
    login = (req: Request, res: Response, nxt: NextFunction) => {
        ...
    };
}

export default new User();
```

### Exception Handeling

There is a global Exception handeler HttpExceptions, create your own specific exceptions in the Exceptions file by extending it.

```
import HttpException from "./HttpException";

class Conflict extends HttpException {
    constructor(err: any) {
        super({
            status: 409,
            title: "The request could not be completed due to a conflict",
            message: err
        })
    }
}

export default Conflict
```

Use this Exception like this

```
if (!isValid) {
    NextFunction(new Conflict(errors).parse())
}
```
