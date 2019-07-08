/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message, TextChannel } from "discord.js";

import { Command } from "./Command";
import { ChannelSubscription } from "../models/ChannelSubscription";
import { ErrorEmbed } from '../embeds/ErrorEmbed';
import { SERVICE_NAME } from '../constants';
import { sleep, searchMessage } from '../util';

export class RecallCommand extends Command {

    public readonly name = "Recall";
    public readonly description = `Recalls an image from the ${SERVICE_NAME}`;

    public readonly command = "recall";
    public readonly aliases = [];

    public readonly showInHelp = false;

    public async run(command: string, args: string[], message: Message): Promise<void> {

        const botApplication = await this.manager.getApplication();
        if (message.author.id === botApplication.owner.id) {

            if (args.length < 1) {
                await message.reply(`Usage: \`${this.getUsage(this.manager.commandPrefix, command)}\``);
                return;
            }

            const searchString = args.join(" ");

            try {

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

                    const textChannel = channel as TextChannel;

                    try {
                        const channelMessages = await textChannel.fetchMessages({ limit: 100 });

                        const messagesToDelete = channelMessages
                            .filter(cm => cm.deletable) // Messages we can delete
                            .filter(cm => cm.author.id === message.client.user.id) // From us
                            .filter(cm => searchMessage(cm, searchString)) // With the image id embedded
                            .array();

                        for (const messageToDelete of messagesToDelete) {

                            try {
                                await sleep(100);
                                await messageToDelete.delete();
                            }
                            catch (sendError) {
                                console.error(sendError);
                            }

                        }

                    }
                    catch (sendError) {
                        console.error(sendError);
                    }

                }

            }
            catch (e) {
                await message.channel.send("", new ErrorEmbed(`There was an error recalling "${searchString}" from the ${SERVICE_NAME}.`, e as Error));
            }

        }

    }

    public getUsage(commandPrefix: string, command: string): string {
        return `${commandPrefix}${command} <searchString>`;
    }

}
