/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { RichEmbed } from 'discord.js';

export class ErrorEmbed extends RichEmbed {
    constructor(message: string, error?: Error) {

        console.log(error);

        super({
            title: "Uh Oh",
            description: message,
            url: "https://derpibooru.org/1273209",
            color: 16711680,
            image: {
                url: "https://derpicdn.net/img/view/2016/10/15/1273209.png"
            }
        });
    }
}
