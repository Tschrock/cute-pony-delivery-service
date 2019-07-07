/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { RichEmbed } from 'discord.js';
import { Image } from 'node-derpi';

import { formatDate } from '../util';

const DERPI_IMAGE_PAGE = "https://derpibooru.org/";

export class ImageEmbed extends RichEmbed {
    public readonly imageSource: Image;
    constructor(image: Image) {

        const pageUrl = `${DERPI_IMAGE_PAGE}${image.id}`;

        super({
            title: pageUrl,
            //description: trimTags(image.tagNames, 5).join("\n"),
            url: pageUrl,
            color: 8231268,
            footer: {
                text: `Uploaded ${formatDate(image.created)} - ${image.width}x${image.height} - ${image.originalFormat.toLocaleUpperCase()}`
            },
            image: {
                url: image.representations.full
            }
        });
        this.imageSource = image;
    }
}
