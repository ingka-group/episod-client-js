/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getBatchPayload, isSameHostname } from "./helpers";
import { get as getBatch, set as setBatch } from "./batch";
import { get as getConfig } from "./config";
import { set as setTimer } from "./timer";

export const dispatch = async (payload, options = {}) => {
  if (typeof window !== 'undefined' && window.location?.href?.includes('localhost')) {
    console.log('Dispatching event', payload);
    return;
  }
  let config;
  try {
    config = getConfig();
  } catch (error) {
    return;
  }

  const { url, xClientId, batchUrl, batchXClientId } = config;

  let actualUrl = url;
  let actualXClientId = xClientId;

  if (options.batch) {
    if (!batchUrl) {
      console.error('Episod requires batchUrl to dispatch in batch');
      return;
    }
    actualUrl = batchUrl;
    actualXClientId = batchXClientId;
  }
  else if (!url) {
    console.error('Episod requires url to dispatch');
    return;
  }

  const { expectResponse = false, keepalive = false } = options;

  if (isSameHostname(url) && !expectResponse) {
    const headers = {
      type: 'application/json',
    };
    const blob = new Blob([JSON.stringify(payload)], headers);

    navigator.sendBeacon(url, blob);
    return;
  }

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': actualXClientId,
    },
    body: JSON.stringify(payload),
    keepalive,
  };

  // If expectResponse is true, return the server timestamp
  if (expectResponse) {
    const response = await fetch(actualUrl, fetchOptions);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const { serverTimestamp } = await response.json();
    return serverTimestamp;
  }

  // Otherwise, just send the event
  fetch(actualUrl, fetchOptions);
}

export const dispatchBatch = (options = {}) => {
  const { pageview_id } = options;
  const batch = getBatch();
  if (batch.length) {
    // Split the batch into the current page and other pages
    const currentPageEvents = [];
    const otherPagesEvents = [];
    batch.forEach((event) => {
      if (pageview_id && pageview_id === event.pageview_id) {
        currentPageEvents.push(event);
      } else {
        otherPagesEvents.push(event);
      }
    });
    if (otherPagesEvents.length) {
      // Send the other pages' events
      dispatch(getBatchPayload(otherPagesEvents), { batch: true, keepalive: true });
    }
    // Update the batch with the current page's events
    setBatch(currentPageEvents);
  }
  setTimer(dispatchBatch, 1000 * 60);
}
