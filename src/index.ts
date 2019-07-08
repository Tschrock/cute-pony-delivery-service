#!/usr/bin/env node
/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// https://discordapp.com/oauth2/authorize?client_id=597054910806228993&scope=bot&permissions=18432

import { join } from 'path';

import { Client } from 'discord.js';
import { Sequelize } from 'sequelize-typescript';
import { Sequelize as SequelizeBase } from 'sequelize';

import { CommandManager } from './lib/commands/CommandManager';
import { BroadcastCommand } from './lib/commands/BroadcastCommand';
import { FeedbackCommand } from './lib/commands/FeedbackCommand';
import { InfoCommand } from './lib/commands/InfoCommand';
import { PostCommand } from './lib/commands/PostCommand';
import { RecallCommand } from './lib/commands/RecallCommand';
import { SubmitCommand } from './lib/commands/SubmitCommand';
import { SubscribeCommand } from './lib/commands/SubscribeCommand';
import { UnsubscribeCommand } from './lib/commands/UnsubscribeCommand';

import { botconfig } from './lib/config';
import { COMMAND_PREFIX } from './lib/constants';

async function initBot() {

    const database = new Sequelize({
        logging: false,
        modelPaths: [join(__dirname, "lib", "models")],
        ...botconfig.get("db")
    }) as any as SequelizeBase;

    await database.sync();

    const client = new Client();

    const commandManager = new CommandManager(client, COMMAND_PREFIX, true, true);

    // Register user commands
    commandManager.registerCommand(InfoCommand);
    commandManager.registerCommand(SubscribeCommand);
    commandManager.registerCommand(UnsubscribeCommand);
    commandManager.registerCommand(UnsubscribeCommand);
    commandManager.registerCommand(SubmitCommand);
    commandManager.registerCommand(FeedbackCommand);

    // Register admin commands
    commandManager.registerCommand(PostCommand);
    commandManager.registerCommand(BroadcastCommand);
    commandManager.registerCommand(RecallCommand);

    client.on('ready', () => {
        console.log("Ready!");
    });

    client.on('message', async message => commandManager.handleMessage(message));

    await client.login(botconfig.get("bottoken"));
    console.log("Logged In!");

}

initBot().then(
    () => console.log("Bot Started!"),
    error => console.error(error)
);
