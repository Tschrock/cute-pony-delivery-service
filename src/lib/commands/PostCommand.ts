/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message, TextChannel } from "discord.js";
import { Fetch } from "node-derpi";

import { Command } from "./Command";
import { ChannelSubscription } from "../models/ChannelSubscription";
import { ErrorEmbed } from '../embeds/ErrorEmbed';
import { SERVICE_NAME } from '../constants';
import { ImageEmbed } from '../embeds/ImageEmbed';
import { sleep } from '../util';

export class PostCommand extends Command {

    public readonly name = "Post";
    public readonly description = `Posts an image to the ${SERVICE_NAME}`;

    public readonly command = "post";
    public readonly aliases = [];

    public readonly showInHelp = false;

    public async run(command: string, args: string[], message: Message): Promise<void> {

        if (message.author.id === "163300806769115136") {

            if(args.length !== 1 || !/^\d+$/.test(args[0])) {
                await message.reply(`Usage: \`${this.getUsage(this.manager.commandPrefix, command)}\``);
                return;
            }

            try {

                const imageId = Number.parseInt(args[0], 10);

                const image = await Fetch.fetchImage(imageId);

                if(!image) {
                    await message.reply(`Could not find an image for id ${imageId}.`);
                    return;
                }

                const imageEmbed = new ImageEmbed(image);

                const subscriptions = await ChannelSubscription.findAll();

                for (const subscription of subscriptions) {
                    const channelId = subscription.channel_id;
                    const channel = message.client.channels.get(channelId);

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
                        await sleep(100);
                    }
                    catch (sendError) {
                        console.error(sendError);
                    }

                }

            }
            catch (e) {
                await message.channel.send("", new ErrorEmbed(`There was an error posting to the ${SERVICE_NAME}.`, e as Error));
            }

        }

    }

    public getUsage(commandPrefix: string, command: string): string {
        return `${commandPrefix}${command} <derpibooruImageId>`;
    }

}
