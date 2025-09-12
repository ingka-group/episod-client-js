/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { set as setCommons } from './commons';
import { set as setConfig } from './config';
import { dispatchBatch } from './dispatcher';
import { set as setTimer } from "./timer";

export const init = (config) => {
  const {
    cookieDomain,
    disableCookies = false,
    url,
    xClientId,
    commons,
    batch = false,
    batchUrl,
    batchXClientId,
  } = config;

  if (!url) {
    console.error('Episod requires url to initialize');
    return;
  }

  if (!cookieDomain && !disableCookies) {
    console.error('Episod requires cookieDomain to initialize');
    return;
  }

  if (batch && (!batchUrl || !batchXClientId)) {
    console.error('Episod requires batchUrl to initialize batch');
    return;
  }

  setConfig({
    cookieDomain,
    disableCookies,
    url,
    xClientId,
    batch,
    batchUrl,
    batchXClientId,
  });

  if (commons) {
    setCommons(commons);
  }

  if (batch) {
    window.addEventListener('beforeunload', dispatchBatch);
    window.addEventListener('pagehide', dispatchBatch);
    window.addEventListener('visibilitychange', dispatchBatch);
    setTimer(dispatchBatch, 1000 * 60);
  }
}
