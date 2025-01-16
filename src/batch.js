/**
 * Copyright (c) 2024 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let batch = [];

export const get = () => {
  return batch;
};

export const set = (newBatch) => {
  batch = newBatch;
};

export const push = (value) => {
  batch.push(value);
};

