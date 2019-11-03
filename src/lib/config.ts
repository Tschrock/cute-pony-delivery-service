/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import convict from 'convict';

const config = convict({
    env: {
        doc: "The application environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    prefix: {
        doc: "The bot's command prefix.",
        format: "*",
        default: ">>",
        env: "PREFIX",
        arg: "prefix"
    },
    apikey: {
        doc: "Your Derpibooru API key.",
        format: "*",
        default: "",
        env: "APIKEY",
        arg: "apikey",
        sensitive: true
    },
    clientid: {
        doc: "Your Discord API client id.",
        format: "*",
        default: "",
        env: "CLIENTID",
        arg: "clientid"
    },
    bottoken: {
        doc: "Your Discord bot token.",
        format: "*",
        default: "",
        env: "TOKEN",
        arg: "token",
        sensitive: true
    },
    cooldown: {
        doc: "The amount of time (in seconds) to wait before posting the next image.",
        format: Number,
        default: 600,
        env: "COOLDOWN",
        arg: "cooldown"
    },
    queueGalleryId: {
        doc: "The gallery to look at for new images.",
        format: Number,
        default: 0,
        env: "QUEUE_GALLERY_ID",
        arg: "queueGalleryId"
    },
    historyGalleryId: {
        doc: "The gallery to use to track past posts.",
        format: Number,
        default: 0,
        env: "HISTORY_GALLERY_ID",
        arg: "historyGalleryId"
    },
    db: {
        dialect: {
            doc: "The type of database.",
            format: ["mysql", "mariadb", "sqlite", "postgres", "mssql"],
            default: "sqlite" as "mysql" | "mariadb" | "sqlite" | "postgres" | "mssql",
            env: "DB_DIALECT",
            arg: "dbdialect"
        },
        host: {
            doc: "The database hostname.",
            format: "*",
            default: "localhost",
            env: "DB_HOST",
            arg: "dbhost"
        },
        port: {
            doc: "The database port.",
            format: "port",
            default: 3306,
            env: "DBPORT",
            arg: "dbport"
        },
        database: {
            doc: "The database name.",
            format: "*",
            default: "cpds",
            env: "DB_NAME",
            arg: "dbname"
        },
        username: {
            doc: "The database username.",
            format: "*",
            default: "cpds",
            env: "DB_USERNAME",
            arg: "dbusername"
        },
        password: {
            doc: "The database password.",
            format: "*",
            default: "cpds",
            env: "DB_PASSWORD",
            arg: "dbpassword",
            sensitive: true
        },
        storage: {
            doc: "The file location for sqlite databases.",
            format: "*",
            default: "cpds.sqlite",
            env: "DB_STORAGE",
            arg: "dbstorage"
        }
    }
});

try {
    config.loadFile('./config.json');
}
catch(e) {
    // ignore
}

config.validate({ allowed: 'strict' });

export const botconfig = config;
