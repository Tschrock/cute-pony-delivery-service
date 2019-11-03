/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

interface Unit {
    name: string;
    pluralName?: string;
    size: number;
}

class Format {
    constructor(
        public readonly unit: Unit,
        public readonly count: number,
        public readonly remainder: number
    ) {}
    toString() {
        const name = this.count > 1 ? this.unit.pluralName || this.unit.name + "s" : this.unit.name;
        return `${this.count} ${name}`;
    }
}

export const EmptyFormat = new Format({ name: "undefined", size: 0 }, 0, 0);

export class UnitFormatter {

    private units: Unit[];

    constructor(units: Map<string, number>) {
        this.units = Array
            .from(units.entries())
            .map(e => ({ name: e[0], size: e[1] }))
            .sort((a, b) => b.size - a.size);
    }

    getNextFormat(value: number): Format {
        for (const unit of this.units) {
            if(value > unit.size) {
                const count = Math.floor(value / unit.size);
                const remainder = value - (count * unit.size);
                return new Format(unit, count, remainder);
            }
        }
        return EmptyFormat;
    }

    getFormats(value: number, maxDepth: number = 2) {
        const formats: Format[] = [];
        let currentValue = value;
        while(currentValue > 0 && maxDepth --> 0) {
            const format = this.getNextFormat(currentValue);
            if(format === EmptyFormat) break;
            formats.push(format);
            currentValue = format.remainder;
        }
        return formats;
    }

}
