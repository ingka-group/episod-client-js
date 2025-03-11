/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface EventDetails {
  readonly category?: string;
  readonly label?: string;
  readonly location_title?: string;
  readonly location_language?: string;
  readonly postal_code?: string;
  readonly store_id?: string;
  readonly delivery_time?: string;
  readonly engagement_time_msec?: number;
  readonly delivery_arrangement_id?: string;
  readonly checkout_id?: string;
  readonly appointment_time?: string;
  readonly navigation_type?: string;
  readonly navigation_link?: string;
  readonly navigation_timing?: number;
  readonly error_type?: string;
  readonly error_category?: string;
  readonly error_public_message?: string;
  readonly error_backend_message?: string;
  readonly error_api?: string;
  readonly error_preceding_api?: string;
  readonly shopping_cart_id?: string;
  readonly shopping_cart_quantity?: number;
  readonly shopping_cart_value?: number;
  readonly shopping_cart_value_services?: number;
  readonly shopping_list_id?: string;
  readonly shopping_list_quantity?: number;
  readonly shopping_list_value?: number;
  readonly search_term?: string;
  readonly search_type?: string;
  readonly search_products_results?: number;
  readonly search_content_results?: number;
  readonly planner_name?: string;
  readonly planner_product_combination_id?: string;
  readonly component_version?: string;
  readonly component_page_id?: string;
  readonly component_id?: string;
  readonly component_type?: string;
  readonly component_propensity?: number;
  readonly kiosk_id?: string;
  readonly kiosk_location?: string;
  readonly list_type?: string;
  readonly list_name?: string;
  readonly list_algorithm?: string;
  readonly list_filters?: string;
  readonly image_id?: string;
  readonly image_position?: number;
  readonly feedback_question?: string;
  readonly feedback_comment?: string;
  readonly feedback_score?: number;
  readonly checkout_type?: string;
  readonly checkout_consumer_name?: string;
  readonly checkout_quantity_items?: number;
  readonly checkout_quantity_unique_items?: number;
  readonly checkout_delivery_time?: string;
  readonly checkout_delivery_arrangement_id?: string;
  readonly checkout_delivery_method?: string;
  readonly checkout_payment_method?: string;
  readonly checkout_delivery_cost?: number;
  readonly checkout_delivery_express?: boolean;
  readonly checkout_pick_up_point_location?: string;
  readonly checkout_order_type?: string;
  readonly checkout_order_type_detailed?: string;
  readonly checkout_services_available?: boolean;
  readonly checkout_removal_services_available?: boolean;
  readonly checkout_user_type?: string;
  readonly checkout_coupon?: string;
  readonly error_id?: string;
  readonly error_code?: string;
  readonly error_status_code?: string;
  readonly error_cause?: string;
  readonly additional_search_info?: string;
  readonly item_index?: string;
  readonly product_list_variant?: string;
  readonly content_type?: string;
  readonly checkout_local_store?: string;
  readonly items?: Item[];
  /** Not needed anymore, key/value pairs works directly in the event_details object */
  readonly custom?: {
    readonly [key: string]: any;
  }
  readonly [key: string]: any;
}

export interface Item {
  readonly item_no?: string;
  readonly quantity?: number;
  readonly price?: number;
  readonly type?: string;
  readonly availability_online?: string;
  readonly availability_store?: string;
  readonly availability_collect?: string;
  readonly availability_assembly?: string;
  readonly store_available_quantity?: number;
  readonly buyable_online?: boolean;
  readonly order_type?: string;
  readonly commercial_label?: string;
  readonly sales_steering_tag?: string;
  readonly product_image_id?: string;
  readonly list_position?: number;
  readonly ratings_value?: number;
  readonly number_of_ratings?: number;
  readonly referring_items?: ReferringItem[];
  /** Not needed anymore, key/value pairs works directly in the event_details object */
  readonly custom?: {
    readonly [key: string]: any;
  }
  readonly [key: string]: any;
}

export interface ReferringItem {
  readonly item_no?: string;
  readonly type?: string;
  readonly price?: number;
}

export interface Transaction {
  readonly order_id?: string;
  readonly quantity_items?: number;
  readonly quantity_unique_items?: number;
  readonly quantity_unique_services?: number;
  readonly total_value?: number;
  readonly total_vat?: number;
  readonly shipping_value_ex_vat?: number;
  readonly product_value_ex_vat?: number;
  readonly services_value_ex_vat?: number;
  readonly shipping_vat?: number;
  readonly product_vat?: number;
  readonly services_vat?: number;
  readonly coupon_code?: string;
  readonly coupon_discount_value?: number;
  readonly payment_method?: string;
  readonly order_type?: string;
  readonly delivery_method?: string;
  readonly delivery_express?: boolean;
  readonly fulfilled_by?: string;
  readonly delivery_time?: string;
  readonly leave_at_door_consent?: boolean;
  readonly pick_up_point_location?: string;
  readonly service_area_id?: string;
  readonly delivery_arrangement_id?: string;
  /** Not needed anymore, key/value pairs works directly in the event_details object */
  readonly custom?: {
    readonly [key: string]: any;
  }
  readonly [key: string]: any;
}

export interface ClientDetails {
  readonly user_agent?: string;
  readonly local_time_zone?: number;
  readonly cs_key?: string;
  readonly geo_location_country?: string;
  readonly geo_location_region?: string;
  readonly geo_location_city?: string;
  readonly party_uid?: string;
  readonly sfmc_id?: string;
  readonly customer_type?: string;
  readonly consent?: Consent;
}

export interface Consent {
  readonly analytics?: boolean;
  readonly personalisation?: boolean;
  readonly marketing?: boolean;
}

export interface EpisodEvent {
  /** A unique identifier for page/view's lifespan */
  readonly pageview_id?: string;
  /** ISO 3166 country code */
  readonly market_code?: string;
  readonly currency_code?: string;
  readonly episod_test?: boolean;
  readonly logged_in?: boolean;
  readonly event_referring_location?: string;
  readonly event_location?: string;
  readonly event_origin?: string;
  readonly event_origin_team?: string;
  readonly event_trigger?: string;
  readonly event_object?: string;
  readonly event_name?: string;
  readonly event_details?: EventDetails;
  readonly transaction?: Transaction;
  readonly client_details?: ClientDetails;
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
  batch?: boolean;
  keepalive?: boolean;
}): void;
