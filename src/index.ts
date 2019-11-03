#!/usr/bin/env node
/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// https://discordapp.com/oauth2/authorize?client_id=597054910806228993&scope=bot&permissions=18432

import { join } from 'path';

import { Client, TextChannel } from 'discord.js';
import { Sequelize } from 'sequelize-typescript';
import { Sequelize as SequelizeBase } from 'sequelize';
import { Fetch } from "node-derpi";
import request from "request-promise-native";

import { CommandManager } from './lib/commands/CommandManager';
import { BroadcastCommand } from './lib/commands/BroadcastCommand';
import { FeedbackCommand } from './lib/commands/FeedbackCommand';
import { InfoCommand } from './lib/commands/InfoCommand';
import { PostCommand } from './lib/commands/PostCommand';
import { RecallCommand } from './lib/commands/RecallCommand';
import { ReplyCommand } from './lib/commands/ReplyCommand';
import { SubmitCommand } from './lib/commands/SubmitCommand';
import { SubscribeCommand } from './lib/commands/SubscribeCommand';
import { UnsubscribeCommand } from './lib/commands/UnsubscribeCommand';
import { PingCommand } from './lib/commands/PingCommand';

import { botconfig } from './lib/config';
import { ImageEmbed } from './lib/embeds/ImageEmbed';
import { ChannelSubscription } from './lib/models/ChannelSubscription';
import { sleep } from './lib/util';

let queueCheck: NodeJS.Timeout | undefined;
let client: Client;

async function initBot() {

    const database = new Sequelize({
        logging: false,
        modelPaths: [join(__dirname, "lib", "models")],
        //database: 'cpds',
        //username: 'cpds',
        //dialect: "sqlite",
        //storage: "cpds.sqlite"
        ...botconfig.get("db")
    }) as any as SequelizeBase;

    await database.sync();

    client = new Client();

    const commandManager = new CommandManager(client, botconfig.get("prefix"), true, true);

    // Register user commands
    commandManager.registerCommand(InfoCommand);
    commandManager.registerCommand(SubscribeCommand);
    commandManager.registerCommand(UnsubscribeCommand);
    commandManager.registerCommand(SubmitCommand);
    commandManager.registerCommand(FeedbackCommand);
    commandManager.registerCommand(PingCommand);

    // Register admin commands
    commandManager.registerCommand(PostCommand);
    commandManager.registerCommand(BroadcastCommand);
    commandManager.registerCommand(RecallCommand);
    commandManager.registerCommand(ReplyCommand);

    client.on('ready', () => {
        console.log("Ready!");
    });

    client.on('message', async message => commandManager.handleMessage(message));

    await client.login(botconfig.get("bottoken"));
    console.log("Logged In!");
    await client.user.setActivity(commandManager.commandPrefix + "help");

}

function checkQueue() {
    queueCheck = undefined;
    checkQueueAsync().then(
        () => {
            if(!queueCheck) queueCheck = setTimeout(checkQueue, botconfig.get("cooldown") * 1000);
        },
        error => console.error(error)
    );
}

async function checkQueueAsync() {

    const queueGalleryId = botconfig.get("queueGalleryId");
    const historyGalleryId = botconfig.get("historyGalleryId");

    if(historyGalleryId && queueGalleryId) {

        const results = await Fetch.search({
            query: `safe && gallery_id:${queueGalleryId} && !gallery_id:${historyGalleryId}`
        });

        const imageToPost = results.images.shift();
        if(imageToPost) {

            try {
                await request.post(
                    {
                        method: "POST",
                        uri: `https://derpibooru.org/galleries/${historyGalleryId}/images.json?id=${imageToPost.id}&key=${botconfig.get("apikey")}`
                    }
                    ).promise();
            }
            catch(e) {
                return console.error(e);
            }

            const imageEmbed = new ImageEmbed(imageToPost);

            const subscriptions = await ChannelSubscription.findAll();

            for (const subscription of subscriptions) {
                const channelId = subscription.channel_id;
                const channel = client.channels.get(channelId);

                if (!channel) {
                    console.log(`Skipping channel ${channelId} because it could not be found.`);
                    continue;
                }

                if (!["dm", "group", "text"].includes(channel.type)) {
                    console.log(`Skipping channel ${channelId} because it is not a text-based channel.`);
                    continue;
                }

                try {
                    await (channel as TextChannel).send("", imageEmbed);
                    await sleep(200);
                }
                catch (sendError) {
                    console.error(sendError);
                }

            }

        }
        else {
            console.log("No image to post");
            if(!queueCheck) queueCheck = setTimeout(checkQueue, 5 * 60 * 1000);
        }

    }
}

initBot().then(
    () => {
        console.log("Bot Started!");
        checkQueue();
    },
    error => console.error(error)
);
