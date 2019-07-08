/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Client, Message, OAuth2Application } from "discord.js";
import { Command } from "./Command";
import { escapeMessage } from "../util";
import { HelpCommand } from "./HelpCommand";
import { ErrorEmbed } from "../embeds/ErrorEmbed";

interface CommandConstructor<T> {
    new(manager: CommandManager, ...args: T[]): Command;
}

/**
 * Manages and executes chat commands.
 */
export class CommandManager {

    private readonly registeredCommands: Command[] = [];
    private readonly registeredCommandMap = new Map<string, Command>();

    private _Application: OAuth2Application | null = null;
    public async getApplication() {
        return this._Application || (this._Application = await this.client.fetchApplication());
    }

    /**
     * Creates a new CommandManager for managing chat commands.
     * @param client The Discord Client.
     * @param commandPrefix The command prefix.
     * @param ignoreInvalidCommands If invalid commands should be ignored.
     * @param ignoreBotMessages If other bot's messages should be ignored.
     */
    public constructor(
        private readonly client: Client,
        public readonly commandPrefix: string,
        public readonly ignoreInvalidCommands: boolean = true,
        public readonly ignoreBotMessages: boolean = true
    ) {
        this.registerCommand(HelpCommand);
    }

    /**
     * Registers a command.
     * @param CommandType A constructor for a Command.
     * @param args The extra arguments to use when creating the command.
     */
    public registerCommand<T>(CommandType: CommandConstructor<T>, ...args: T[]) {

        // Create the command object
        const command = new CommandType(this, ...args);

        // Register the command
        this.registeredCommands.push(command);

        // Add the command to the command map
        this.registeredCommandMap.set(command.command, command);

        // Add the command's aliases to the command map
        for (const alias of command.aliases) this.registeredCommandMap.set(alias, command);

    }

    /**
     * Gets a list of registered commands.
     */
    public getRegisteredCommands() {

        // Return a copy of the registered commands list
        return Array.from(this.registeredCommands);

    }

    /**
     * Handles an incomming message.
     * @param message The message.
     */
    public async handleMessage(message: Message) {

        // Filter out ourselves
        if (message.author.id === this.client.user.id) return;

        // Filter out other bots
        if (this.ignoreBotMessages && message.author.bot) return;

        // Check for a command
        if (message.content.startsWith(this.commandPrefix)) {

            // Split apart the message
            const messageParts = message.content.split(" ");
            const firstPart = messageParts.shift() as string;

            // Extract the command
            const commandString = firstPart.substring(this.commandPrefix.length).toLowerCase();

            // See if it's registered
            const command = this.registeredCommandMap.get(commandString);
            if (command) {

                // Run the command
                try {
                    command.run(commandString, messageParts, message);
                }
                catch (commandError) {
                    try {
                        await message.channel.send("", new ErrorEmbed(`There was an error running the "${escapeMessage(commandString)}" command.`, commandError as Error));
                    }
                    catch (errorError) {
                        console.error(errorError);
                    }
                }

            }
            else if (!this.ignoreInvalidCommands) {

                // Opps
                try {
                    await message.reply(`"${escapeMessage(commandString)}" isn't a valid command. Type \`${this.commandPrefix}help\` for a list of commands.`);
                }
                catch (errorError) {
                    console.error(errorError);
                }

            }

        }

    }

}
