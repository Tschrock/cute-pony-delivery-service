/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message, TextChannel, DMChannel, GroupDMChannel } from "discord.js";

import { Command } from "./Command";

const MESSAGE_URL_PREFIX = "https://discordapp.com/channels/";

export class ReplyCommand extends Command {

    public readonly name = "Reply";
    public readonly description = `Replies to a feedback/submission message.`;

    public readonly command = "reply";
    public readonly aliases = [];

    public readonly showInHelp = false;

    public async run(command: string, args: string[], message: Message): Promise<void> {

        const botApplication = await this.manager.getApplication();
        if (message.author.id === botApplication.owner.id) {

            if (args.length < 2) {
                await message.reply(`Usage: \`${this.getUsage(this.manager.commandPrefix, command)}\``);
                return;
            }

            const replyMessageMessageId = args.shift() as string;
            const replyMessageContent = args.join(" ");

            try {

                const replyMessageMessage = await message.channel.fetchMessage(replyMessageMessageId);

                const urls = replyMessageMessage.embeds.map(e => e.url).filter(url => url && url.startsWith(MESSAGE_URL_PREFIX));

                if (urls.length < 1) {
                    await message.reply(`Reply Error: Could not find a message quote in that message.`);
                    return;
                }

                const replyMessageUrl = (urls[0] as string).substring(MESSAGE_URL_PREFIX.length);
                const [serverId, channelId, messageId] = replyMessageUrl.split("/");

                if (!serverId || !channelId || !messageId) {
                    await message.reply(`Reply Error: Could not extract the message details from that quote.`);
                    return;
                }

                const channel = message.client.channels.get(channelId);

                if (!channel) {
                    await message.reply(`Reply Error: The channel that message is from is no longer available.`);
                    return;
                }

                const sendableChannel = channel as TextChannel | DMChannel | GroupDMChannel;

                const replyMessage = await sendableChannel.fetchMessage(messageId);

                if (!channel) {
                    await message.reply(`Reply Error: The message you are trying to reply to no longer exists.`);
                    return;
                }

                await replyMessage.reply(replyMessageContent);
                await message.reply(`Reply sent.`);


            }
            catch (error) {
                console.error(error);
                await message.reply(`There was an error sending your reply. :(`);
            }

        }

    }

    public getUsage(commandPrefix: string, command: string): string {
        return `${commandPrefix}${command} <link(s)>`;
    }

}
