function findElm(selector) {
    return document.querySelector(selector);
}

function findAllElm(selector) {
    return document.querySelectorAll(selector);
}

function findInIframe(iframe) {
    if (!iframe) return null;
    try {
        return iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document) || null;
    } catch (e) {
        console.warn("[docQueryselector] Không truy cập được iframe:", e);
        return null;
    }
}

export { findElm, findAllElm, findInIframe };
