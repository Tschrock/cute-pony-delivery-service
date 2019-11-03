/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message } from "discord.js";

import { Command } from "./Command";
import { SERVICE_NAME } from '../constants';
import { CommandPermission } from '../CommandPermission';
import { QuoteEmbed } from "../embeds/QuoteEmbed";

export class FeedbackCommand extends Command {

    public readonly name = "Feedback";
    public readonly description = `Sends feedback about the ${SERVICE_NAME}.`;

    public readonly command = "feedback";
    public readonly aliases = [];

    public readonly permission = CommandPermission.USER;

    public async run(command: string, args: string[], message: Message): Promise<void> {

        if (args.length < 1) {
            await message.reply(`Usage: \`${this.getUsage(this.manager.commandPrefix, command)}\``);
            return;
        }

        message.content = args.join(" ");

        try {

            const botApplication = await this.manager.getApplication();
            await botApplication.owner.send(`New feedback from \`${message.author.tag}\`:",`, new QuoteEmbed(message));
            await message.reply(`Feedback sent.`);

        }
        catch (error) {
            console.error(error);
            await message.reply(`There was an error sending your feedback. :(`);
        }

    }

    public getUsage(commandPrefix: string, command: string): string {
        return `${commandPrefix}${command} <message>`;
    }

}
