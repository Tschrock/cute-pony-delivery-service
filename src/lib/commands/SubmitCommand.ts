/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message } from "discord.js";

import { Command } from "./Command";
import { SERVICE_NAME } from '../constants';
import { QuoteEmbed } from "../embeds/QuoteEmbed";

export class SubmitCommand extends Command {

    public readonly name = "Submit";
    public readonly description = `Submits a link for posting to the ${SERVICE_NAME}. All submissions are manually reviewed and must be 100% safe and adorable.`;

    public readonly command = "submit";
    public readonly aliases = [];

    public async run(command: string, args: string[], message: Message): Promise<void> {

        if (args.length < 1) {
            await message.reply(`Usage: \`${this.getUsage(this.manager.commandPrefix, command)}\``);
            return;
        }

        message.content = args.join(" ");

        try {

            const botApplication = await this.manager.getApplication();
            await botApplication.owner.send(`New submission from \`${message.author.tag}\`:",`, new QuoteEmbed(message));

        }
        catch (error) {
            console.error(error);
            await message.reply(`There was an error sending your submission. :(`);
        }

    }

    public getUsage(commandPrefix: string, command: string): string {
        return `${commandPrefix}${command} <link(s)>`;
    }

}
