/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message } from "discord.js";

import { Command } from "./Command";
import { ChannelSubscription } from "../models/ChannelSubscription";
import { ErrorEmbed } from '../embeds/ErrorEmbed';
import { SERVICE_NAME } from '../constants';

export class UnsubscribeCommand extends Command {

    public readonly name = "Unsubscribe";
    public readonly description = `Unsubscribes the current channel from the ${SERVICE_NAME}`;

    public readonly command = "unsubscribe";
    public readonly aliases = [];

    public async run(command: string, args: string[], message: Message): Promise<void> {

        if (message.channel.type === "dm" || message.member.hasPermission("MANAGE_CHANNELS", false, true, true)) {

            try {

                const effectedRows = await ChannelSubscription.destroy({
                    where: {
                        channel_id: message.channel.id
                    }
                });

                if (effectedRows > 0) {
                    await message.reply(`You've successfully unsubscribed from the ${SERVICE_NAME}.`);
                }
                else {
                    await message.reply(`You're not subscribed to the ${SERVICE_NAME}.`);
                }
            }
            catch (e) {
                await message.channel.send("", new ErrorEmbed(`There was an error unsubscribing from the ${SERVICE_NAME}.`, e as Error));
            }

        }
        else {
            await message.reply(`You don't have permission to modify this channel's subscriptions.`);
        }

    }

}
