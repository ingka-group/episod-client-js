/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    getValues,
    removeNullsOrEmpty,
    deepMerge,
    getUniquePairsDeep,
    deepIntersectObjects,
    getBatchPayload,
} from './helpers';

import { set as setTimestamps } from "./timestamps";

describe('getValues', () => {
    it('should return the correct values', async () => {
        const obj = {
            a: () => 'Hello, World!',
            b: [1, { b2: 2 }, () => 3],
            c: 'I am a string',
            d: { d2: 'I am also a string'}
        };

        const result = await getValues(obj);

        expect(result).toEqual({
            a: 'Hello, World!',
            b: [1, { b2: 2 }, 3],
            c: 'I am a string',
            d: { d2: 'I am also a string'}
        });
    });
});

describe('removeNullsOrEmpty', () => {
    it('should remove null and empty values', () => {
        const obj = {
            a: null,
            b: '',
            c: 'I am a string',
            d: { d2: 'I am also a string', d3: null },
            e: [1, null, '', { e2: 'I am a string too', e3: null }],
        };

        const result = removeNullsOrEmpty(obj);

        expect(result).toEqual({
            c: 'I am a string',
            d: { d2: 'I am also a string' },
            e: [1, { e2: 'I am a string too' }]
        });
    });
});

describe('deepMerge', () => {
    it('should merge two objects', () => {
        const obj1 = {
            a: 1,
            b: 2,
            c: { c1: 3, c2: 4 },
            d: [5, 6],
            e: 7,
        };

        const obj2 = {
            a: 7,
            c: { c1: 8 },
            d: [9],
            e: [10],
        };

        const result = deepMerge(obj1, obj2);

        expect(result).toEqual({
            a: 7,
            b: 2,
            c: { c1: 8, c2: 4 },
            d: [5, 6, 9],
            e: [10],
        });
    });
});

describe('getUniquePairsDeep', () => {
    it('should return unique pairs', () => {
        const obj1 = {
            b: 2,
            c: { c1: 8 },
            e: 7,
        };

        const obj2 = {
            a: 7,
            b: 2,
            c: { c1: 8, c2: 4 },
            d: [9],
            e: 7,
        };

        const result = getUniquePairsDeep(obj1, obj2);

        expect(result).toEqual({
            a: 7,
            c: { c2: 4 },
            d: [9],
        });
    });
});

describe('deepIntersectObjects', () => {
    it('should return the intersected objects', () => {
        const obj1 = {
            a: 1,
            b: 2,
            c: { c1: 8, c2: 4 },
            d: [5, 6],
            e: 7,
            f: [{g:1, h:2}]
        };

        const obj2 = {
            a: 7,
            b: 2,
            c: { c1: 8 },
            d: [9],
            e: [10],
            f: [{g:1, h:2}]
        };

        const obj3 = {
            a: 7,
            b: 2,
            c: { c1: 8, c2: 4 },
            d: [9],
            e: 7,
            f: [{g:1, h:2}]
        };

        const result = deepIntersectObjects([obj1, obj2, obj3]);

        expect(result).toEqual({
            b: 2,
            c: { c1: 8 },
        });
    });
});

describe('getBatchPayload', () => {
    beforeEach(() => {
        setTimestamps('1', new Date('2023-01-01T00:10:00Z'), new Date('2023-01-01T00:00:00Z'));
    });

    it('should return the batch payload', () => {
        const events = [
            { pageview_id: '1', eventTimestamp: new Date('2023-01-01T00:10:05Z'), a: 1, b: 1, c: [{d:1},{d:2}] },
            { pageview_id: '1', eventTimestamp: new Date('2023-01-01T00:10:06Z'), a: 2, b: 1, c: [{d:1},{d:3}] },
            { pageview_id: '1', eventTimestamp: new Date('2023-01-01T00:10:07Z'), a: 3, b: 1, c: [{d:1},{d:2}] },
        ];

        const result = getBatchPayload(events);

        expect(result).toEqual({
            commons: {
                pageview_id: '1',
                b: 1
            },
            events: [
                { server_timestamp: '2023-01-01T00:00:05.000Z', a: 1, c: [{d:1},{d:2}] },
                { server_timestamp: '2023-01-01T00:00:06.000Z', a: 2, c: [{d:1},{d:3}] },
                { server_timestamp: '2023-01-01T00:00:07.000Z', a: 3, c: [{d:1},{d:2}] },
            ],
        });
    });

    it('should return correct if only one event in the batch', () => {
        const events = [
            { pageview_id: '1', eventTimestamp: new Date('2023-01-01T00:10:05Z'), a: 1, b: 1 },
        ];

        const result = getBatchPayload(events);

        expect(result).toEqual({
            commons: {},
            events: [
                { pageview_id: '1', server_timestamp: '2023-01-01T00:00:05.000Z', a:1, b: 1 }
            ],
        });
    });
});
