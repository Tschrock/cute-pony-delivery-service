/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { RichEmbed } from 'discord.js';

import { SERVICE_NAME } from '../constants';

const DIVIDER = "\n\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_";

export class InfoEmbed extends RichEmbed {
    constructor(guildCount: number, inviteLink: string, commandHelpList: string[]) {
        super({
            title: `Welcome to the ${SERVICE_NAME}!`,
            description: `Sharing cute ponies to ${guildCount} servers.${DIVIDER}`,
            color: 13913602,
            footer: {
                icon_url: "https://cdn.discordapp.com/attachments/393754919020134400/597310556751265802/Profile5_transparent.png",
                text: `Made with ❤️ by CyberPon3`
            },
            thumbnail: {
                url: "https://cdn.discordapp.com/app-icons/597054910806228993/8a36554f4bb51bd607c8b3852b602f09.png"
            },
            fields: [
                {
                    name: "Invite Link",
                    value:  `${inviteLink} ${DIVIDER}`
                },
                {
                    name: "Commands",
                    value: `${commandHelpList.join("\n")} ${DIVIDER}`
                }
            ]
        });
    }
}
