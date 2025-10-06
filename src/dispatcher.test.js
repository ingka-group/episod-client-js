/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { dispatch } from './dispatcher.js';

global.window = Object.create(null);

jest.mock('./config', () => ({
    get: jest.fn(() => ({
        url: 'https://api.example.com/dispatch',
        xClientId: 'test-client-id',
        batchUrl: 'https://api.example.com/batch',
        batchXClientId: 'test-batch-client-id',
    })),
}));

describe('dispatch', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ serverTimestamp: 12345 }),
            })
        );
        // Mock window.location.href to not include 'localhost'
        Object.defineProperty(window, 'location', {
            value: { href: 'https://example.com' },
            writable: true,
        });
    });

    it('should call fetch with correct arguments', async () => {
        const payload = { test: 'data' };
        const options = { expectResponse: true };
        await dispatch(payload, options);

        expect(global.fetch).toHaveBeenCalled();
        const [url, fetchOptions] = global.fetch.mock.calls[0];
        expect(fetchOptions.method).toBe('POST');
        expect(fetchOptions.headers['Content-Type']).toBe('application/json');
        expect(JSON.parse(fetchOptions.body)).toEqual(payload);
    });
    it('should return server timestamp when expectResponse is true', async () => {
        const payload = { test: 'data' };
        const options = { expectResponse: true };
        const serverTimestamp = await dispatch(payload, options);

        expect(serverTimestamp).toBe(12345);
    });
    it('should throw when payload contains a circular reference', async () => {
        const payload = {};
        payload.self = payload; // Circular reference

        await expect(dispatch(payload)).rejects.toThrow(TypeError);
    });
});
