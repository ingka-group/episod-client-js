/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let timerId = null;

export const set = (callback, delay) => {
    clear();
    timerId = setTimeout(callback, delay);
}

export const clear = () => {
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
}
