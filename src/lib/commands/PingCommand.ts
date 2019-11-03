/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message } from "discord.js";

import { Command } from "./Command";
import { CommandPermission } from "../CommandPermission";
import { formatDuration } from "../util";

export class PingCommand extends Command {

    public readonly name = "Ping";
    public readonly description = `Pings the bot`;

    public readonly command = "ping";
    public readonly aliases = [];

    public readonly permission = CommandPermission.USER;

    public async run(command: string, args: string[], message: Message): Promise<void> {

        await message.reply(`Pong!\n\nBot Uptime: ${formatDuration(message.client.uptime)}\nBot Ping: ${message.client.ping}ms`);

    }

}
