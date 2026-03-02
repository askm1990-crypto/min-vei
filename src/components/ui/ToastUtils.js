/**
 * Global toast state logic
 */
let toastIdCounter = 0;
let addToastGlobal = null;

export function showToast(message, type = 'success', duration = 3000) {
    if (addToastGlobal) {
        addToastGlobal({ id: ++toastIdCounter, message, type, duration });
    }
}

export function registerToastHandler(handler) {
    addToastGlobal = handler;
    return () => { addToastGlobal = null; };
}
