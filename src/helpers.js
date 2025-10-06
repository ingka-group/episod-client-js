/**
 * Copyright (c) 2025 Ingka Holding B.V. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getServerTimestamp } from './timestamps.js';

export const getQueryParam = (param) => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export const getRandomString = (length) => {
  const buf = new Uint8Array(length / 2);
  crypto.getRandomValues(buf);
  let ret = "";
  for (let i = 0; i < buf.length; ++i) {
    ret += ("0" + buf[i].toString(16)).slice(-2);
  }
  return ret;
}

export const getCookieValue = (cookieName) => {
  if (typeof document === 'undefined') return null;
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${cookieName}=`))
    ?.split('=')[1];
  return cookieValue;
}

const getSessionCount = (currentSessionCount, sameSession) => {
  if (sameSession) {
    return parseInt(currentSessionCount);
  }

  return currentSessionCount ? parseInt(currentSessionCount) + 1 : 1;
}
const renewSessionId = (partOne, partTwo, sameSession) => {
  if (sameSession) {
    return `${partOne}.${partTwo}`;
  }

  return `${new Date().getTime()}.${getRandomString(8)}`;
}
export const getSessionData = (domain, endDate) => {
  const cookieValue = getCookieValue('episod_session_id');

  const expires = new Date(parseInt(endDate)).toUTCString();

  const halfAnHour = 30 * 60 * 1000;

  let partOne, partTwo, sessionCount, lastInteraction;
  let sameSession = false;
  if (cookieValue) {
    [partOne, partTwo, sessionCount, lastInteraction] = cookieValue.split('.');

    sameSession = !!lastInteraction && new Date().getTime() - lastInteraction < halfAnHour;
  }

  const sessionId = renewSessionId(partOne, partTwo, sameSession);

  const newSessionCount = getSessionCount(sessionCount, sameSession);

  const latestInteraction = new Date().getTime();
  const value = `${sessionId}.${newSessionCount}.${latestInteraction}`;

  document.cookie = `episod_session_id=${value}; expires=${expires}; Secure; path=/; domain=${domain}`;

  return { sessionId, sessionStart: !sameSession , sessionNumber: newSessionCount};
}

export const getClientData = (domain) => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return {};
  const cookieValue = getCookieValue('episod_id');

  const urlUser = getQueryParam('episod_test');
  const thirteenMonths = 13 * 30 * 24 * 60 * 60 * 1000;
  const today = new Date().getTime();

  let partOne, partTwo, partThree, partFour, endDate, testUser, invalidCookie = false
  if (cookieValue) {
    [partOne, partTwo, partThree, partFour] = cookieValue.split('.');

    if (partThree) {
      const parseThree = parseInt(partThree);
      if (Number.isInteger(parseThree)) {
        // Old cookie format with timestamp in third part, mark as invalid
        invalidCookie = true;
      } else {
        testUser = partThree;
      }
    }

    if (partFour) {
      const parseFour = parseInt(partFour);
      if (!Number.isInteger(parseFour)) {
        testUser = partFour;
      }
    }

    if (!invalidCookie && (!urlUser || testUser === urlUser)) {
      endDate = parseInt(partOne) + thirteenMonths;
      return { clientId: `${partOne}.${partTwo}`, endDate, testUser };
    }
  }

  let clientId, firstVisit;

  const createNewClientId = () => {
    endDate = today + thirteenMonths;
    clientId = `${today}.${getRandomString(8)}`;
    firstVisit = true;
  }

  if (partOne && partTwo) {
    endDate = parseInt(partOne) + thirteenMonths;
    if (endDate < today) {
      createNewClientId();
    } else {
      clientId = `${partOne}.${partTwo}`;
    }
  } else {
    createNewClientId();
  }

  let cookie;
  let user;

  if (urlUser) {
    if (urlUser === 'delete') {
      cookie = clientId;
    } else {
      user = urlUser;
      cookie = `${clientId}.${user}`;
    }
  } else if (testUser) {
    user = testUser;
    cookie = `${clientId}.${user}`;
  } else {
    cookie = clientId;
  }

  const expires = new Date(endDate).toUTCString();

  document.cookie = `episod_id=${cookie}; expires=${expires}; Secure; path=/; domain=${domain}`;

  return { clientId: clientId, endDate: endDate, testUser: user, firstVisit };
}

export const deepMerge = (obj1, obj2) => {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (Array.isArray(obj2[key])) {
        if (Array.isArray(obj1[key])) {
          result[key] = [...obj1[key], ...obj2[key]];
        } else {
          result[key] = [...obj2[key]];
        }
      } else if (typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]) {
        result[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }
  }

  return result;
}

export const getClientLanguage = () => {
  if (typeof navigator === 'undefined') return null;
  const language = navigator.language;
  return language ? language.toLowerCase() : null;
}

export const getUserLocalTimezone = () => {
  const now = new Date();
  return now.getTimezoneOffset();
}

export const getEventLocation = () => {
  if (typeof window === 'undefined') return null;
  return decodeURIComponent(window.location.href).trim();
}

export const getEventReferringLocation = () => {
  if (typeof document === 'undefined') return null;
  return document.referrer ? decodeURIComponent(document.referrer).trim() : null;
}

export const getEventLocationTitle = () => {
  if (typeof document === 'undefined') return null;
  return document.title;
}


export const getValues = async (obj, visited = new WeakSet()) => {
  if (obj && typeof obj === 'object') {
    if (visited.has(obj)) {
      return; // Prevent infinite loop
    }
    visited.add(obj);
  }
  let result = {};
  for (let key in obj) {
    if (typeof obj[key] === 'function') {
      try {
        result[key] = await obj[key]();
      } catch (e) {
        result[key] = null;
      }
    } else if (Array.isArray(obj[key])) {
      result[key] = [];
      for (let i = 0; i < obj[key].length; i++) {
        if (typeof obj[key][i] === 'function') {
          try {
            result[key].push(await obj[key][i]());
          } catch (e) {
            result[key].push(null);
          }
        } else if (typeof obj[key][i] === 'object' && obj[key][i] !== null) {
          result[key].push(await getValues(obj[key][i], visited));
        } else {
          result[key].push(obj[key][i]);
        }
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = await getValues(obj[key], visited);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

export const removeNullsOrEmpty = (obj) => {
  if (Array.isArray(obj)) {
    return obj.filter(item => item !== null && item !== '').map(item => {
      if (typeof item === 'object') {
        return removeNullsOrEmpty(item);
      } else {
        return item;
      }
    });
  } else {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
        obj[key] = removeNullsOrEmpty(obj[key]);
      } else if (obj[key] === null || obj[key] === '') {
        delete obj[key];
      }
    });
    return obj;
  }
}

export const getInnerHeight = () => {
  if (typeof window === 'undefined') return null;
  return window.innerHeight;
}

export const getInnerWidth = () => {
  if (typeof window === 'undefined') return null;
  return window.innerWidth;
}

export const getUniquePairsDeep = (obj1, obj2) => {
  const result = {};

  for (const key in obj1) {
    if (!obj2.hasOwnProperty(key)) {
      result[key] = obj1[key];
    } else if (typeof obj1[key] === 'object' && obj1[key] !== null && typeof obj2[key] === 'object' && obj2[key] !== null) {
      const nestedResult = getUniquePairsDeep(obj1[key], obj2[key]);
      if (Object.keys(nestedResult).length > 0) {
        result[key] = nestedResult;
      }
    } else if (obj1[key] !== obj2[key]) {
      result[key] = obj1[key];
    }
  }

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
      result[key] = obj2[key];
    }
  }

  return result;
}

export const deepIntersectObjects = (objects) => {
  const result = {};
  const [firstObject, ...restObjects] = objects;

  for (const key in firstObject) {
    if (firstObject.hasOwnProperty(key)) {
      const value = firstObject[key];
      // If the value is an object and not an array, and all the rest of the objects have the same object
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedObjects = restObjects.map(obj => obj[key]).filter(obj => typeof obj === 'object' && obj !== null);
        if (nestedObjects.length === restObjects.length) {
          const nestedResult = deepIntersectObjects([value, ...nestedObjects]);
          if (Object.keys(nestedResult).length > 0) {
            result[key] = nestedResult;
          }
        }
      } else if (restObjects.every(obj => obj[key] === value)) {
        result[key] = value;
      }
    }
  }

  return result;
}

export const getBatchPayload = (batch) => {
  const timestampedBatch = batch.map((event) => {
    const { eventTimestamp,  ...rest } = event;
    const server_timestamp = getServerTimestamp(eventTimestamp, event.pageview_id);
    return deepMerge(rest, { server_timestamp });
  });

  if (timestampedBatch.length === 1) {
    return { commons: {}, events: timestampedBatch };
  }
  const intersection = deepIntersectObjects(timestampedBatch);

  const events = timestampedBatch.map((obj) => {
    return getUniquePairsDeep(intersection, obj);
  })

  return { commons: intersection, events };
}

export const isSameHostname = (url) => {
  if (typeof window === 'undefined' || !window.location || !window.location.hostname) {
    return false;
  }

  try {
    const inputHostname = new URL(url).hostname;
    return inputHostname === window.location.hostname;
  } catch {
    return false; // Invalid URL
  }
}
