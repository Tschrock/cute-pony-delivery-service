/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { STRING } from 'sequelize';
import { Table, Column, Model, AllowNull } from 'sequelize-typescript';

@Table
export class ChannelSubscription extends Model<ChannelSubscription> {

    @AllowNull(false)
    @Column(STRING(255))
    public channel_id!: string;

}
