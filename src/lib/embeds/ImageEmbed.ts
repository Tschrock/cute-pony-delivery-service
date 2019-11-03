/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { RichEmbed } from 'discord.js';
import { Image } from 'node-derpi';

import { formatDate, formatArray } from '../util';

const DERPI_IMAGE_PAGE = "https://derpibooru.org/";

export class ImageEmbed extends RichEmbed {
    public readonly imageSource: Image;
    constructor(image: Image) {

        const pageUrl = `${DERPI_IMAGE_PAGE}${image.id}`;

        const artists = image.tagNames.filter(t => t.startsWith("artist:")).map(t => t.replace("artist:", ""));

        let artistsText: string | undefined;

        if(artists.length === 0) {
            artistsText = undefined;
        }
        if(artists.length === 1) {
            artistsText = `Artist: ${artists[0]}`;
        }
        else if (artists.length <= 5) {
            artistsText = `Artists: ${formatArray(artists)}`;
        }
        else {
            artistsText = `Multiple Artists`;
        }

        super({
            title: pageUrl,
            description: artistsText,
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
