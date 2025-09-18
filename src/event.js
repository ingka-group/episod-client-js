/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { dispatch, dispatchBatch } from './dispatcher';
import { push } from './batch';
import { set as setTimestamps } from './timestamps';
import { get as getCommons } from './commons';
import { get as getConfig } from './config';
import { deepMerge, getClientData, getSessionData, getValues, removeNullsOrEmpty } from './helpers';

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

    // Log event based on logging level
    if (logging === 'verbose') {
      // Log full payload
      console.log('Event: ' + payload.event_name);
      console.log(payload);
    } else if (logging === 'event') {
      // Log only event details sent by user
      console.log('Event: ' + event.event_name);
      console.log(event);
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
