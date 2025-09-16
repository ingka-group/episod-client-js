# episod-client-js

## About this repo

A JavaScript package that can be used in any JavaScript project to send events to the Episod server. It has built in logic to handle client_id and session_id generation and storage. It also has built in logic to handle the sending of events to the server.

## Installation

```npm install --save @ingka-group/episod-client-js ```

## Usage
### Init(config)
The init method is used to initialize the client with the required parameters. The init method should be called once in the application's lifecycle.

The common data that will be sent with every event can be set in the init method. This data will be merged with the data sent with the event. The value can either be a constant or a function that returns a value. Using a function is useful when the value is dynamic and can change over time.

```javascript
import { init } from '@ingka-group/episod-client-js';

const PROD = <true/false>;

const initEpisod = async () => {
  // Required parameters
  const url = PROD ? {PROD_ENDPOINT_FOR_EPISOD} : {DEV_ENDPOINT_FOR_EPISOD};
  const xClientId = PROD ? {PROD_XCLIENTID} : {DEV_XCLIENTID};
  
  // Cookie domain for the client_id and session_id cookies
  const cookieDomain = PROD ? {PROD_DOMAIN} : {DEV_DOMAIN}; // Requried unless you are passing in disableCookies: true      
  const disableCookies = false; // Optional parameter to disable the client_id and session_id cookies. Default is false
        
  // Optional parameters (except for event_origin that is mandatory) that will be sent with every event
  const commons = {
        event_origin: {EVENT_ORIGIN}, // Required for tracking the origin of the event
        pageview_id: {PAGEVIEW_ID}, // This is a unique identifier for page/view's lifespan
        market_code: {COUNTRY_CODE}, // ie 'se' in se/sv
        event_details: {
          postal_code: {POSTAL_CODE},
          store_id: {STORE_ID},
          location_language: {LOCATION_LANGUAGE}, // ie 'sv' in se/sv
        },
        client_details: {
          cs_key: {CONTENT_SQUARE_KEY},
          consent: {
            marketing: {MARKETING_CONSENT},
            analytics: {ANALYTICS_CONSENT},
            personalization: {PERSONALIZATION_CONSENT},
          },
          party_uid: {PARTY_UID},
          customer_type: {CUSTOMER_TYPE},
        },
      };
      
  init({
    cookieDomain,
    url,
    xClientId,
    commons,
  })
}
```

### set(common)
If you want to set common data that will be sent with every event, you can use the set method.
This works the same way as the commons in the init method.


```javascript
import { set } from '@ingka-group/episod-client-js';

const setEpisodCommons = () => {
  const common = {
    pageview_id: {PAGEVIEW_ID}, // This is a unique identifier for page/view's lifespan
    market_code: {COUNTRY_CODE}, // ie 'se' in se/sv
    event_details: {
      postal_code: {POSTAL_CODE},
      store_id: {STORE_ID},
      location_language: {LOCATION_LANGUAGE}, // ie 'sv' in se/sv
    },
    client_details: {
      cs_key: {CONTENT_SQUARE_KEY},
      consent: {
        marketing: {MARKETING_CONSENT},
        analytics: {ANALYTICS_CONSENT},
        personalization: {PERSONALIZATION_CONSENT},
      },
      party_uid: {PARTY_UID},
      customer_type: {CUSTOMER_TYPE},
    },
  };

  set(common);
}
```

### sendEvent(event)

The sendEvent method is used to send an event to the server. The event object will be merged with the common data set in the init method or the set method.


```javascript
import { sendEvent } from '@ingka-group/episod-client-js';

const sendEpisodEvent = () => {
  const event = {
    event_name: {EVENT_NAME},
    event_origin_team: {EVENT_ORIGIN_TEAM}, // Useful to keep track of the team that sent the event if there are multiple teams sending events
    event_details: {
      category: {EVENT_CATEGORY},
      label: {EVENT_LABEL},
    },
  };

  sendEvent(event);
}
```
## Debugging
To enable logging to console for debugging purposes, set the localStorage item 'episod-devtools' to the level of logging that is needed in your browser's console.

Possible levels are: "verbose" (full payload) or "event" (the data sent in by the user).
```javascript
localStorage.setItem("episod-devtools", '{"logging":"verbose"}');
```
or 
```javascript   
localStorage.setItem("episod-devtools", '{"logging":"event"}');
```

## Contributing
Please read [CONTRIBUTING](./CONTRIBUTING.md) for more details about making a contribution to this open source project and ensure that you follow our [CODE_OF_CONDUCT](./CODE_OF_CONDUCT.md).

## Contact
If you have any other issues or questions regarding this project, feel free to contact one of the [code owners/maintainers](.github/CODEOWNERS) for a more in-depth discussion.

## License
This open source project is licensed under the "MIT License", read the [LICENSE](./LICENSE.md) terms for more details. 
