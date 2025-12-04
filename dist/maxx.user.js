// ==UserScript==
// @name         Maxx Custom Script
// @namespace    maxx
// @version      1.9
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
  function findElm(selector) {
    return document.querySelector(selector);
  }
  function findInIframe(iframe) {
    return iframe.contentDocument || iframe.contentWindow.document;
  }

  // src/helper/selector.js
  var SELECTOR = {
    PAGES: {
      EVENT_VIEWER: 'div[id="pages"] iframe[id="PAGE_EVENTVIEWER"]',
      FLOW_VIEWER: 'div[id="pages"] iframe[id="PAGE_FLOWVIEWER"]'
    },
    SIDEBAR: {
      MENU: "#sidebar-menu",
      BUTTONS: ".menu > button"
    },
    TABLE: {
      TABLE: 'div[id=tableSection] table[id="defaultTable"]',
      HEAD: 'div[id=tableSection] table[id="defaultTable"] > thead',
      BODY: 'div[id=tableSection] table[id="defaultTable"] > tbody',
      CELL: 'div[id=tableSection] table[id="defaultTable"] > tbody > tr > td',
      DATACELL: 'div[id=tableSection] table[id="defaultTable"] > tbody > tr > td > span'
    }
  };

  // src/helper/iframeService.js
  var IframeService = class {
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
        if (tbody.children.length > 0) return true;
        if (table.innerHTML.trim().length > 20) return true;
        return false;
      };
      const tryBind = setInterval(() => {
        if (checkTableReady()) {
          clearInterval(tryBind);
          if (this.observer) this.observer.disconnect();
          const table = this.doc.querySelector(SELETOR.TABLE.TABLE);
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
  };

  // src/modules/siem/copy-field.js
  function bindCopy(doc) {
    const cells = doc.querySelectorAll(SELECTOR.TABLE.CELL);
    cells.forEach((cell) => {
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
  function copyField() {
    const svc = new IframeService(SELECTOR.PAGES.EVENT_VIEWER);
    svc.onReady((iframe, doc) => {
      bindCopy(doc);
      svc.onTableUpdate(() => bindCopy(doc));
    });
  }

  // src/index.js
  function main() {
    if (window.top !== window.self) return;
    const url = location.href;
    if (url.includes("/console/qradar/jsp/QRadar.jsp")) {
      copyField();
    }
  }

  // src/main.js
  main();
})();

