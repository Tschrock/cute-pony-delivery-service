/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message } from "discord.js";

import { Command } from "./Command";
import { SERVICE_NAME } from '../constants';
import { CommandPermission } from "../CommandPermission";

export class HelpCommand extends Command {

    public readonly name = "Help";
    public readonly description = `Sends you help for the bot's commands`;

    public readonly command = "help";
    public readonly aliases = ["halp"];

    public readonly permission = CommandPermission.USER;

    public async run(command: string, args: string[], message: Message): Promise<void> {

        // Get the bot application
        const botApplication = await this.manager.getApplication();

        // Get the user's permission level
        const userPermissionlevel = message.author.id === botApplication.owner.id ? CommandPermission.OWNER : CommandPermission.USER;

        // Generate the command list
        const commands = this.manager.getRegisteredCommands().filter(c => c.permission <= userPermissionlevel);

        // Generate help for each command
        const commandHelpList = commands.map(c => this.generateCommandHelp(c)).join("\n\n");

        // Send the help
        await message.channel.send(`Welcome to the ${SERVICE_NAME}!\n\n Commands:\n\n${commandHelpList}`);

    }

    private generateCommandHelp(command: Command) {
        return `**${command.name}** - ${command.description}\nUsage: \`${command.getUsage(this.manager.commandPrefix, command.command)}\``;
    }

}
