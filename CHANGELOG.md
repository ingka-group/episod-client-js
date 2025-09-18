# Change Log

## 2.4.2

### Fixed

- The intention of the change in 2.4.1 was to log to console for debugging sendBeacon calls that can't be seen in the network tab. console.dir however does not persist the log since it's a reference to an object that gets GC'd. Changed to console.log to persist the log. 

## 2.4.1

### Added

- Added logging to console by checking setting in localStorage 'episod-devtools' to help with debugging during development.

## 2.4.0

### Added

- Added guards for browser-specific global objects (window, document, navigator, crypto, Uint8Array) in src/helpers.js to ensure compatibility with Node.js environments.
- Added logic to use navigator.sendBeacon instead of fetch when the endpoint URL has the same hostname as the current page, enhancing performance for same-origin requests.

### Fixed

- Circular dependency issue in src/helpers.js by restructuring the code to eliminate circular references.
