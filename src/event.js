/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { dispatch, dispatchBatch } from './dispatcher.js';
import { push } from './batch.js';
import { set as setTimestamps } from './timestamps.js';
import { get as getCommons } from './commons.js';
import { get as getConfig } from './config.js';
import { deepMerge, getClientData, getSessionData, getValues, removeNullsOrEmpty, logObjectRecursivelyAsTable } from './helpers.js';

export const sendEvent = async (event, options = {}) => {
  let config;
  try {
    config = getConfig();
  } catch (error) {
    return;
  }

  const { batch: batchOverride, keepalive = false } = options;
  const payload = await constructPayload(event);

  // If episod-devtools exists in localStorage, log event based on settings
  let devtools = null;
  if (typeof localStorage !== 'undefined') {
    devtools = JSON.parse(localStorage.getItem('episod-devtools'));
  }

  if (devtools) {
    const { logging } = devtools;
    const logStyle = `background-color: blue; color: white; text-shadow: 1px 1px 1px black; font-weight: bold; font-size: 1em; border-radius: 1em;`;

    // Log event based on logging level
    if (logging === 'verbose') {
      // Log full payload
      const logTitle = `⏱️ %c  Episod event: ${payload.event_name}  `;
      logObjectRecursivelyAsTable(payload, logTitle, logStyle);
    } else if (logging === 'event') {
      // Log only event details sent by user
      const logTitle = `⏱️ %c  Episod event: ${event.event_name}  `;
      logObjectRecursivelyAsTable(event, logTitle, logStyle);
    }
  }

  if (config.batch && !(batchOverride === false)) {
    // If pageview, dispatch batch and then send pageview
    if (payload.event_name === 'pageview') {
      dispatchBatch({ pageview_id : payload.pageview_id });
      const serverTimestamp = await dispatch(payload, { expectResponse: true });
      setTimestamps(payload.pageview_id, new Date(), new Date(serverTimestamp));
    } else {
      // Push to batch
      push(deepMerge(payload, { eventTimestamp: new Date() }));
    }
  } else {
    dispatch(payload, { keepalive });
  }
}

const constructPayload = async (event) => {
  let config;
  try {
    config = getConfig();
  } catch (error) {
    return;
  }

  let initialPayload = {};

  const { cookieDomain, disableCookies } = config;

  if (!disableCookies) {
    const {clientId, endDate, testUser, firstVisit} = getClientData(cookieDomain);
    const {sessionId, sessionStart, sessionNumber} = getSessionData(cookieDomain, endDate);

    initialPayload = {
      client_id: clientId,
      client_new: firstVisit,
      session_id: sessionId,
      session_start: sessionStart,
      session_number: sessionNumber,
      episod_test: !!testUser,
      client_details: {
        episod_test_id: testUser,
      },
      event_details: {
        client_event_id: crypto.randomUUID(),
      }
    }
  }

  const commons = getCommons();

  return removeNullsOrEmpty(await getValues(deepMerge(deepMerge(commons, initialPayload), event)));
}
