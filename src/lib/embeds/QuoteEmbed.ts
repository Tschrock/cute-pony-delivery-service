/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { RichEmbed, Message, TextChannel, RichEmbedOptions, GroupDMChannel } from 'discord.js';

export class QuoteEmbed extends RichEmbed {
    constructor(message: Message) {

        const embedData: RichEmbedOptions = {
            description: message.content,
            url: message.url,
            timestamp: message.createdAt,
            author: {
                name: message.author.tag,
                icon_url: message.author.displayAvatarURL
            }
        };

        if(message.channel.type === "text") {
            const textChannel = message.channel as TextChannel;
            embedData.footer = {
                icon_url: message.guild.iconURL,
                text: `From #${textChannel.name} in ${message.guild.name}`
            };
        }
        else if(message.channel.type === "dm") {
            embedData.footer = {
                icon_url: message.author.displayAvatarURL,
                text: `From (DM) ${message.author.tag}`
            };
        }
        else if(message.channel.type === "group") {
            const groupChannel = message.channel as GroupDMChannel;
            embedData.footer = {
                icon_url: (groupChannel as any).iconURL,
                text: `From (Group) ${(message.channel as TextChannel).name}`
            };
        }

        super(embedData);

    }
}
