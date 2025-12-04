export function findElm(selector) {
    return document.querySelector(selector);
};

export function findAllElm(selector) {
    return document.querySelectorAll(selector);
};

export function findInIframe(iframe) {
    return iframe.contentDocument || iframe.contentWindow.document;
};