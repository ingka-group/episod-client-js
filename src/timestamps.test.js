/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getOffsetTimestamp, getServerTimestamp, clear, set} from "./timestamps.js";

describe('getServerTimestamp', () => {
    it('should return the correct server timestamp', () => {
        set('1', new Date('2023-01-01T01:00:00Z'), new Date('2023-01-01T00:00:00Z'));

        const eventTimestamp = new Date('2023-01-01T01:00:05Z');
        const pageviewId = '1';

        const result = getServerTimestamp(eventTimestamp, pageviewId);

        const expected = '2023-01-01T00:00:05.000Z';

        expect(result).toEqual(expected);
    });

    it('should return null if no timestamps exists', () => {
        const eventTimestamp = new Date('2023-01-01T01:00:05Z');
        const pageviewId = '1';

        const result = getServerTimestamp(eventTimestamp, pageviewId);

        expect(result).toBeNull();
    });

    afterEach(() => {
        clear();
    });
});

describe('getOffsetTimestamp', () => {
    it('should add 1ms to the date when offset is 0', () => {
        const date = new Date('2023-01-01T00:00:00Z');
        const result = getOffsetTimestamp(date, 0);
        const expected = '2023-01-01T00:00:00.001Z';
        expect(result).toEqual(expected);
    });

    it('should add 1ms to the date when offset is less than 0', () => {
        const date = new Date('2023-01-01T00:00:00Z');
        const result = getOffsetTimestamp(date, -10);
        const expected = '2023-01-01T00:00:00.001Z';
        expect(result).toEqual(expected);
    });

    it('should add the offset to the date when offset is not 0', () => {
        const date = new Date('2023-01-01T00:00:00Z');
        const result = getOffsetTimestamp(date, 1000);
        const expected = '2023-01-01T00:00:01.000Z';
        expect(result).toEqual(expected);
    });
});
