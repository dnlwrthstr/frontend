/**
 * Polyfill for deprecated util._extend API
 * 
 * This file provides a replacement for the deprecated Node.js util._extend API
 * using the standard Object.assign() method.
 */

// Check if the 'util' module exists in the global scope
if (typeof window !== 'undefined') {
  window.util = window.util || {};
  if (!window.util._extend) {
    window.util._extend = function(target: object, source: object) {
      return Object.assign(target, source);
    };
  }
}

const assign = Object.assign || function(target: any, ...sources: any[]): any {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  for (const source of sources) {
    if (source != null) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
  }

  return target;
};

export function extend(target: object, source: object): object {
  return assign(target, source);
}

// Add TypeScript declaration for the global util object
declare global {
  interface Window {
    util: {
      _extend: (target: object, source: object) => object;
      [key: string]: any;
    };
  }
}
