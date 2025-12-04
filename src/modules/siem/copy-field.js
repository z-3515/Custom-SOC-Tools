import { IframeService } from "../../helper/iframeService.js";
import { SELECTOR } from "../../helper/selector.js";

function bindCopy(doc) {
    const cells = doc.querySelectorAll(SELECTOR.TABLE.CELL);

    cells.forEach(cell => {
        if (cell.dataset.copyBound) return;
        cell.dataset.copyBound = "1";

        cell.addEventListener("click", () => {
            let span = cell.querySelector("span[value]");
            let value = span?.getAttribute("value") || cell.textContent.trim();
            navigator.clipboard.writeText(value);

            console.log("Copied:", value);
        });
    });

    console.log("Binded", cells.length, "cells");
}

export function copyField() {
    const svc = new IframeService(SELECTOR.PAGES.EVENT_VIEWER);

    // Lần đầu iframe ready → bind
    svc.onReady((iframe, doc) => {
        bindCopy(doc);
        svc.onTableUpdate(() => bindCopy(doc));  // Chỉ observe TABLE
    });
}
