/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { strict as assert } from 'assert';

import { Message } from "discord.js";

import { Command } from "./Command";
import { ChannelSubscription } from "../models/ChannelSubscription";
import { ErrorEmbed } from '../embeds/ErrorEmbed';
import { SERVICE_NAME } from '../constants';
import { CommandPermission } from "../CommandPermission";

export class SubscribeCommand extends Command {

    public readonly name = "Subscribe";
    public readonly description = `Subscribes the current channel to the ${SERVICE_NAME}`;

    public readonly command = "subscribe";
    public readonly aliases = [];

    public readonly permission = CommandPermission.USER;

    public async run(command: string, args: string[], message: Message): Promise<void> {

        if (message.channel.type === "dm") {
            await message.channel.send(`Sorry, but subscriptions are not supported in DMs. Please add me to your server instead.`);
            return;
        }

        if (message.member && message.member.hasPermission("MANAGE_CHANNELS", false, true, true)) {

            try {

                const [subscription, wasCreated] = await ChannelSubscription.findOrCreate({
                    where: {
                        channel_id: message.channel.id
                    }
                });

                assert.strictEqual(subscription.channel_id, message.channel.id);

                if (wasCreated) {
                    await message.reply(`You've successfully subscribed to the ${SERVICE_NAME}.`);
                }
                else {
                    await message.reply(`You're already subscribed to the ${SERVICE_NAME}.`);
                }

            }
            catch (e) {
                await message.channel.send("", new ErrorEmbed(`There was an error subscribing to the ${SERVICE_NAME}.`, e as Error));
            }

        }
        else {
            await message.reply(`You don't have permission to modify this channel's subscriptions.`);
        }

    }

}
