/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message } from "discord.js";

import { Command } from "./Command";
import { InfoEmbed } from "../embeds/InfoEmbed";
import { CommandPermission } from "../CommandPermission";

export class InfoCommand extends Command {

    public readonly name = "Info";
    public readonly description = `Sends you some information about the bot`;

    public readonly command = "info";
    public readonly aliases = ["?", "invite"];

    public readonly permission = CommandPermission.USER;

    public async run(command: string, args: string[], message: Message): Promise<void> {

        // Get the bot application
        const botApplication = await this.manager.getApplication();

        // Get the user's permission level
        const userPermissionlevel = message.author.id === botApplication.owner.id ? CommandPermission.OWNER : CommandPermission.USER;

        // Generate the command list
        const commandList = this.manager.getRegisteredCommands().filter(c => c.permission <= userPermissionlevel).map(c => this.generateCommandHelp(c));

        // Generate the invite link
        const inviteLink = botApplication.id === "640272840180105236" ? "https://l.cp3.es/cuteponybot" : await message.client.generateInvite(["SEND_MESSAGES", "READ_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"]);

        // Get some stats
        const guildCount = message.client.guilds.size;

        // Send the info message
        await message.channel.send(new InfoEmbed(guildCount, inviteLink, commandList));

    }

    private generateCommandHelp(command: Command) {
        return `**${this.manager.commandPrefix}${command.command}** - ${command.description}`;
    }

}
