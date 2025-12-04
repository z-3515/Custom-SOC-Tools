import { findInIframe } from "./docQueryselector.js";
import { SELECTOR } from "./selector.js";

class IframeService {

    constructor(resolveIframeFn) {
        this.resolveIframeFn = resolveIframeFn;
        this.iframe = null;
        this.doc = null;
        this.tableObserver = null;
    }

    /**
     * Khởi tạo lần đầu
     */
    waitForIframe(callback) {
        const timer = setInterval(() => {
            const iframe = this.resolveIframeFn();
            if (!iframe) return;

            const doc = findInIframe(iframe);
            if (!doc) return;

            clearInterval(timer);

            this.iframe = iframe;
            this.doc = doc;

            console.log("[IframeService] Initial iframe ready:", iframe.src);

            // GẮN EVENT LOAD ĐỂ PHÁT HIỆN FILTER CHANGE
            this.attachLoadListener(callback);

            callback(iframe, doc);
        }, 300);
    }

    /**
     * Khi iframe load lại (đổi filter, đổi page)
     */
    attachLoadListener(callback) {
        if (!this.iframe) return;

        this.iframe.addEventListener("load", () => {
            console.log("%c[IframeService] iframe.onload TRIGGERED → iframe RELOADED", "color: #00eaff");

            // iframe load lại → doc mới
            this.doc = findInIframe(this.iframe);

            // Reset table observer
            if (this.tableObserver) {
                this.tableObserver.disconnect();
                this.tableObserver = null;
            }

            callback(this.iframe, this.doc);
        });
    }

    /**
     * Quan sát bảng trong iframe
     */
    observeTable(doc, callback) {

        const check = () => {
            const table = doc.querySelector(SELECTOR.TABLE.TABLE);
            if (!table) return false;

            const tbody = table.querySelector("tbody");
            if (!tbody) return false;

            // Table thực sự có data
            if (tbody.children.length > 0) return true;

            return false;
        };

        const wait = setInterval(() => {
            if (!check()) return;

            clearInterval(wait);

            const table = doc.querySelector(SELECTOR.TABLE.TABLE);

            console.log("[IframeService] TABLE READY & OBSERVED");

            this.tableObserver = new MutationObserver(() => {
                callback(doc);
            });

            this.tableObserver.observe(table, {
                childList: true,
                subtree: true,
            });

            callback(doc);
        }, 300);
    }

    /**
     * API cuối để dùng từ module (copy-field)
     */
    onReady(callback) {
        this.waitForIframe(callback);
    }
}

export { IframeService };
