// ==UserScript==
// @name         Maxx Custom Script
// @namespace    maxx
// @version      1.13
// @description  Maxx Script
// @author       Maxx
// @run-at       document-end
// @match        *://*/*
// @noframes
// @grant        none
// @updateURL    https://raw.githubusercontent.com/z-3515/Custom-SOC-Tools/main/dist/maxx.user.js
// @downloadURL  https://raw.githubusercontent.com/z-3515/Custom-SOC-Tools/main/dist/maxx.user.js
// ==/UserScript==


(() => {
  // src/helper/docQueryselector.js
  function findInIframe(iframe) {
    if (!iframe) return null;
    try {
      return iframe.contentDocument || iframe.contentWindow && iframe.contentWindow.document || null;
    } catch (e) {
      console.warn("[docQueryselector] Kh\xF4ng truy c\u1EADp \u0111\u01B0\u1EE3c iframe:", e);
      return null;
    }
  }

  // src/helper/selector.js
  var SELECTOR = {
    IFRAMES: {
      // Hint dùng cho resolver trong iframeService (match URL)
      EVENT_VIEWER_HINT: "EventViewer",
      FLOW_VIEWER_HINT: "FlowViewer"
    },
    TABLE: {
      TABLE: 'div[id="tableSection"] table[id="defaultTable"]',
      BODY: 'div[id="tableSection"] table[id="defaultTable"] > tbody',
      CELL: 'div[id="tableSection"] table[id="defaultTable"] > tbody > tr > td',
      DATA_CELL: 'div[id="tableSection"] table[id="defaultTable"] > tbody > tr > td > span'
    }
  };

  // src/helper/iframeService.js
  var IframeService = class {
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
        console.log("%c[IframeService] iframe.onload TRIGGERED \u2192 iframe RELOADED", "color: #00eaff");
        this.doc = findInIframe(this.iframe);
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
          subtree: true
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
  };

  // src/modules/siem/copy-field.js
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
  var tooltip = createTooltip();
  function showTooltip(x, y) {
    tooltip.textContent = "Shift + Click \u0111\u1EC3 copy";
    tooltip.style.left = x + 12 + "px";
    tooltip.style.top = y + 12 + "px";
    tooltip.style.opacity = "1";
  }
  function hideTooltip() {
    tooltip.style.opacity = "0";
  }
  function bindCopy(doc) {
    const cells = doc.querySelectorAll(SELECTOR.TABLE.CELL);
    console.log("[copy-field] Found cells:", cells.length);
    cells.forEach((cell) => {
      if (cell.dataset.copyBound) return;
      cell.dataset.copyBound = "1";
      cell.addEventListener("mousemove", (e) => {
        showTooltip(e.clientX, e.clientY);
      });
      cell.addEventListener("mouseleave", () => {
        hideTooltip();
      });
      cell.addEventListener("click", (e) => {
        if (!e.shiftKey) return;
        const span = cell.querySelector("span[value]");
        const value = span?.getAttribute("value") || cell.textContent.trim();
        navigator.clipboard.writeText(value).then(() => {
          console.log("[copy-field] Copied:", value);
          tooltip.textContent = "\u0110\xE3 copy!";
          setTimeout(() => {
            tooltip.textContent = "Shift + Click \u0111\u1EC3 copy";
          }, 800);
        });
      });
    });
    console.log("[copy-field] Binded", cells.length, "cells");
  }
  function initCopyField() {
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

  // src/index.js
  function main() {
    if (window.top !== window.self) return;
    const url = window.location.href;
    if (url.indexOf("/console/qradar/jsp/QRadar.jsp") !== -1) {
      console.log("[Main] Detected QRadar console, init SIEM modules...");
      initCopyField();
    }
  }

  // src/main.js
  main();
})();

