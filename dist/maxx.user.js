// ==UserScript==
// @name         Maxx Custom Script
// @namespace    maxx
// @version      1.3
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
  // src/modules/siem/copy-field.js
  function test() {
    console.log("test func");
  }

  // src/index.js
  function main() {
    console.log("Maxx index run!");
    test();
  }

  // src/main.js
  main();
})();

