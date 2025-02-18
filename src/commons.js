/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  deepMerge,
  getClientLanguage,
  getEventLocation,
  getEventLocationTitle,
  getEventReferringLocation,
  getInnerHeight,
  getInnerWidth,
  getUserLocalTimezone
} from './helpers';

const defaultCommons = {
  schema_version: '2.4.0',
  episod_client_version: '2.0.0',
  event_referring_location: getEventReferringLocation,
  event_location: getEventLocation,
  event_details: {
    location_title: getEventLocationTitle,
  },
  client_details: {
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    viewport_height: getInnerHeight,
    viewport_width: getInnerWidth,
    client_language: getClientLanguage,
    local_time_zone: getUserLocalTimezone,
  }
}

let commons = defaultCommons;
export const set = (commonAttributes) => {
  commons = deepMerge(commons, commonAttributes);
}

export const get = () => {
  return commons;
}
