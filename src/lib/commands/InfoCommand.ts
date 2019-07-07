/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message } from "discord.js";

import { Command } from "./Command";
import { InfoEmbed } from "../embeds/InfoEmbed";
import { botconfig } from "../config";

export class InfoCommand extends Command {

    public readonly name = "Info";
    public readonly description = `Sends you some information about the bot`;

    public readonly command = "info";
    public readonly aliases = ["?", "invite"];

    public async run(command: string, args: string[], message: Message): Promise<void> {

        // Generate the command list
        const commandList = this.manager.getRegisteredCommands().filter(c => c.showInHelp).map(c => this.generateCommandHelp(c));

        // Send the help
        await message.channel.send(new InfoEmbed(botconfig.get("clientid"), commandList));

    }

    private generateCommandHelp(command: Command) {
        return `**${this.manager.commandPrefix}${command.command}** - ${command.description}`;
    }

}
