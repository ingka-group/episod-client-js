/**
 * Copyright (c) 2024 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface EpisodEvent {
  /** A unique identifier for page/view's lifespan */
  readonly pageview_id?: string;
  /** ISO 3166 country code */
  readonly market_code?: string;
  readonly client_id?: string;
  readonly client_new?: boolean;
  readonly session_id?: string;
  readonly session_number?: number;
  readonly session_start?: boolean;
  readonly logged_in?: boolean;
  readonly event_referring_location?: string;
  readonly event_location?: string;
  readonly episod_test?: boolean;
  readonly event_name?: string;
  readonly event_origin?: string;
  readonly schema_version?: string;
  readonly event_details?: {
    readonly category?: string;
    readonly custom?: {
      readonly [key: string]: any;
    }
    readonly label?: string;
    /** ISO 639 language code */
    readonly location_language?: string;
    readonly location_title?: string;
    readonly postal_code?: string;
    readonly store_id?: string;
  }
  readonly client_details?: {
    readonly client_language?: string;
    readonly customer_type?: string;
    readonly episod_test_id?: string;
    readonly local_time_zone?: number;
    readonly party_uid?: string;
    readonly user_agent?: string;
    readonly viewport_height?: number;
    readonly viewport_width?: number;
    readonly cs_key?: string;
    readonly consent?: {
      readonly marketing?: string;
      readonly analytics?: string;
      readonly personalization?: string;
    }
  }
  readonly cookie_setting?: {
    readonly marketing?: boolean;
    readonly website_customisation?: boolean;
  }
}

export interface InitConfig {
  readonly cookieDomain: string;
  readonly url: string;
  readonly xClientId: string;
  readonly commons?: EpisodEvent;
  readonly batch?: boolean;
}

export function init(config: InitConfig): void;
export function set(attributes: EpisodEvent): void;
export function sendEvent(event: EpisodEvent, options?: {
  batch?: boolean
}): void;
