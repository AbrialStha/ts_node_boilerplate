import { Router } from "express";
import fs from 'fs'

let routes: { [key: string]: Router } = {}
fs.readdirSync(`${__dirname}/`).forEach(function (file: string) {
    var name = file.split('.')[0];
    if (!name.includes("index"))
        routes[name] = require(`./${name}`).default
});

export default routes;