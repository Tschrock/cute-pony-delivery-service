/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Message } from 'discord.js';

import { CommandManager } from './CommandManager';
import { CommandPermission } from '../CommandPermission';

export abstract class Command {

    public abstract readonly name: string;
    public abstract readonly description: string;
    public abstract readonly command: string;
    public abstract readonly aliases: string[];
    public abstract readonly permission: CommandPermission;

    constructor(
        protected readonly manager: CommandManager
    ) {}

    public abstract run(command: string, args: string[], message: Message): void;

    public getUsage(commandPrefix: string, command: string): string {
        return `${commandPrefix}${command}`;
    }

}
