import { findElm, findInIframe } from "./docQueryselector.js";
import { SELECTOR } from "./selector.js";

class IframeService {
    constructor(selector) {
        this.selector = selector;
        this.iframe = null;
        this.doc = null;
        this.observer = null;
    }

    waitForIframe(callback) {
        const timer = setInterval(() => {
            const iframe = findElm(this.selector);
            const doc = iframe ? findInIframe(iframe) : null;

            if (iframe && doc) {
                clearInterval(timer);
                this.iframe = iframe;
                this.doc = doc;
                callback(iframe, doc);
            }
        }, 300);
    }

    /**
     * FIX: Chỉ coi là "table ready" khi tbody có tr hoặc table có innerHTML
     */
    observeTable(callback) {
        const checkTableReady = () => {
            const table = this.doc.querySelector(SELECTOR.TABLE.TABLE);
            if (!table) return false;

            const tbody = table.querySelector("tbody");
            if (!tbody) return false;

            if (tbody.children.length > 0) return true;     // table có row

            if (table.innerHTML.trim().length > 20) return true; // fallback

            return false;
        };

        const tryBind = setInterval(() => {
            if (checkTableReady()) {
                clearInterval(tryBind);

                if (this.observer) this.observer.disconnect();

                const table = this.doc.querySelector(SELECTOR.TABLE.TABLE);

                // Bắt đầu quan sát thay đổi TABLE
                this.observer = new MutationObserver(() => {
                    callback(this.doc);
                });

                this.observer.observe(table, {
                    childList: true,
                    subtree: true
                });

                console.log("IframeService: TABLE READY & OBSERVED");
            }
        }, 300);
    }

    onReady(callback) {
        this.waitForIframe((iframe, doc) => callback(iframe, doc));
    }

    onTableUpdate(callback) {
        this.observeTable(callback);
    }
}

export { IframeService };
