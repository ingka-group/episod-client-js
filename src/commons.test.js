/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { get, set } from './commons.js';

import packageJson from '../package.json' with { type: 'json' };

test('package version is set correctly', () => {
    const commons = get();
    expect(commons.episod_client_version).toBe(packageJson.version);
});

test('set updates commons with new attributes', () => {
    set({ custom_key: 'custom_value' });
    const commons = get();
    expect(commons.custom_key).toBe('custom_value');
});
