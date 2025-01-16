/**
 * Copyright (c) 2024 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let config;

export const set = (newConfig) => {
    config = newConfig;
};

export const get = () => {
    if (!config) {
        console.error('Episod config not set. Please run init() first.');
        throw new Error('Episod config not set. Please run init() first.');
    }

    return config;
}
