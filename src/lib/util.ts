/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { UnitFormatter } from "./UnitFormatter";
import { Message, MessageEmbed, MessageEmbedField } from "discord.js";

export function trimTags(tags: string[], limit: number) {
    if (tags.length > limit) {

        tags = tags.slice(0, limit - 1);

        if (limit > 2) {
            tags = tags.slice(0, tags.length - 1);
            tags.push("...");
        }
    }
    return tags;
}

export function formatArray(items: string[]) {

    if (items.length === 0) return "";
    else if (items.length === 1) return items[0];
    else if (items.length === 2) return items[0] + " and " + items[1];
    else {
        const beginning = items.slice(0, items.length - 1).join(", ");
        const end = items[items.length - 1];
        return beginning + ", and " + end;
    }

}

export enum TimeSpan {
    SECOND = 1000,
    MINUTE = 1000 * 60,
    HOUR = 1000 * 60 * 60,
    DAY = 1000 * 60 * 60 * 24,
    WEEK = 1000 * 60 * 60 * 24 * 7,
    MONTH = 1000 * 60 * 60 * 24 * 30,
    YEAR = 1000 * 60 * 60 * 24 * 365
}

export const DateFormatter = new UnitFormatter(new Map([
    ["second", TimeSpan.SECOND],
    ["minute", TimeSpan.MINUTE],
    ["hour", TimeSpan.HOUR],
    ["day", TimeSpan.DAY],
    ["week", TimeSpan.WEEK],
    ["month", TimeSpan.MONTH],
    ["year", TimeSpan.YEAR]
]));

export function formatDate(date: Date) {
    const diff = Date.now() - date.valueOf();
    const formats = DateFormatter.getFormats(diff, 1);
    return formatArray(formats.map(f => f.toString())) + " ago";
}

export function formatDuration(milliseconds: number) {
    const formats = DateFormatter.getFormats(milliseconds, 3);
    return formatArray(formats.map(f => f.toString()));
}

// https://stackoverflow.com/a/3561711
const regexCharsRegex = /[-\/\\^$*+?.()|[\]{}]/g;
export function escapeRegex(string: string) {
    return string.replace(regexCharsRegex, "\\$&");
}

const messageChars = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "{", "}", "\\", "|", ";", "'", ":", "\"", ",", ".", "<", ">", "/", "?"];
const messageCharsRegex = new RegExp("[" + escapeRegex(messageChars.join("")) + "]");
export function escapeMessage(content: string) {
    return content.replace(messageCharsRegex, "\\$&");
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function searchMessage(message: Message, searchString: string) {
    searchString = searchString.toLowerCase();
    return (message.content && message.content.toLowerCase().includes(searchString))
        || (message.embeds && message.embeds.some(e => searchEmbed(e, searchString)));
}

export function searchEmbed(embed: MessageEmbed, searchString: string) {
    searchString = searchString.toLowerCase();
    return (embed.description && embed.description.toLowerCase().includes(searchString))
        || (embed.fields && embed.fields.some(f => searchEmbedField(f, searchString)))
        || (embed.footer && embed.footer.text && embed.footer.text.toLowerCase().includes(searchString))
        || (embed.title && embed.title.toLowerCase().includes(searchString));
}

export function searchEmbedField(field: MessageEmbedField, searchString: string) {
    searchString = searchString.toLowerCase();
    return (field.name && field.name.toLowerCase().includes(searchString))
        || (field.value && field.value.toLowerCase().includes(searchString));
}
