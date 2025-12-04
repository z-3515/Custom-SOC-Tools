import { IframeService } from "../../helper/iframeService.js";
import { SELECTOR } from "../../helper/selector.js";

/* -------------------------------
    Tooltip SYSTEM
--------------------------------*/
function createTooltip() {
    let tip = document.getElementById("maxx-tooltip");
    if (tip) return tip;

    tip = document.createElement("div");
    tip.id = "maxx-tooltip";

    tip.style.position = "fixed";
    tip.style.padding = "4px 8px";
    tip.style.background = "rgba(0,0,0,0.75)";
    tip.style.color = "#fff";
    tip.style.borderRadius = "4px";
    tip.style.fontSize = "12px";
    tip.style.pointerEvents = "none";
    tip.style.opacity = "0";
    tip.style.transition = "opacity 0.15s";
    tip.style.zIndex = "999999";

    document.body.appendChild(tip);
    return tip;
}

const tooltip = createTooltip();

function showTooltip(x, y) {
    tooltip.textContent = "Shift + Click để copy";
    tooltip.style.left = x + 12 + "px";
    tooltip.style.top = y + 12 + "px";
    tooltip.style.opacity = "1";
}

function hideTooltip() {
    tooltip.style.opacity = "0";
}

/* -------------------------------
    COPY LOGIC with Shift + Click
--------------------------------*/
function bindCopy(doc) {
    const cells = doc.querySelectorAll(SELECTOR.TABLE.CELL);
    console.log("[copy-field] Found cells:", cells.length);

    cells.forEach(cell => {
        if (cell.dataset.copyBound) return;
        cell.dataset.copyBound = "1";

        // Hover để hiển thị tooltip
        cell.addEventListener("mousemove", (e) => {
            showTooltip(e.clientX, e.clientY);
        });

        cell.addEventListener("mouseleave", () => {
            hideTooltip();
        });

        // SHIFT + CLICK để copy
        cell.addEventListener("click", (e) => {
            if (!e.shiftKey) return; // Must hold Shift

            const span = cell.querySelector("span[value]");
            const value = span?.getAttribute("value") || cell.textContent.trim();

            navigator.clipboard.writeText(value)
                .then(() => {
                    console.log("[copy-field] Copied:", value);

                    tooltip.textContent = "Đã copy!";
                    setTimeout(() => {
                        tooltip.textContent = "Shift + Click để copy";
                    }, 800);
                });
        });
    });

    console.log("[copy-field] Binded", cells.length, "cells");
}

/* -------------------------------
    MAIN EXPORT
--------------------------------*/
export function initCopyField() {

    const svc = new IframeService(() => {
        const frames = document.querySelectorAll("iframe");
        for (const f of frames) {
            const src = f.src || "";
            if (src.includes("EventViewer") || src.includes("arielSearch")) {
                return f;
            }
        }
        return null;
    });

    svc.onReady((iframe, doc) => {
        console.log("[copy-field] EventViewer iframe ready:", iframe.src);

        svc.observeTable(doc, bindCopy);
    });
}
