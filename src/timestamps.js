/**
 * Copyright (c) 2024 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let timestamps = {};

export const set = (pageviewId, client, server) => {
  timestamps[pageviewId] = { client, server };
};

export const clear = () => {
  timestamps = {};
};

export const getServerTimestamp = (eventTimestamp, pageviewId) => {
  const { client, server } = timestamps[pageviewId] || {};
  if (!client || !server || !eventTimestamp) {
    return null;
  }
  return getOffsetTimestamp(server, eventTimestamp.getTime() - client.getTime());
}

export const getOffsetTimestamp = (date, offset) => {
  if (!date) {
    return null;
  }

  // If offset is 0, add 1ms to the date to avoid sending the same timestamp for chronological purposes
  if (!offset || offset < 0) {
    return new Date(date.getTime() + 1).toISOString();
  }

  return new Date(date.getTime() + offset).toISOString();
}
