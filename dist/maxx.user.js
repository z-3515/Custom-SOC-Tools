// ==UserScript==
// @name         Maxx Custom Script
// @namespace    maxx
// @version      1.5
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
  var SELETOR = {
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

  // src/modules/siem/copy-field.js
  function copyField() {
    const iframe = findElm(SELETOR.PAGES.EVENT_VIEWER);
    const doc = findInIframe(iframe);
    if (!doc) {
      console.warn("Iframe EventViewer ch\u01B0a load!");
      return;
    }
    const cells = doc.querySelectorAll(SELETOR.TABLE.CELL);
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        let spanWithValue = cell.querySelector("span[value]");
        let value = null;
        if (spanWithValue) {
          value = spanWithValue.getAttribute("value");
        }
        if (!value) {
          value = cell.textContent.trim();
        }
        navigator.clipboard.writeText(value).then(() => {
          console.log("\u0110\xE3 copy:", value);
        }).catch((err) => {
          console.error("Copy l\u1ED7i:", err);
        });
      });
    });
    console.log("CopyField activated: click cell \u0111\u1EC3 copy value!");
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

