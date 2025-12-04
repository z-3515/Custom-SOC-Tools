import { initCopyField } from "./modules/siem/copy-field.js";

export function main() {
    if (window.top !== window.self) return; // tránh iframe con (dù đã @noframes, cho chắc)

    const url = window.location.href;

    // Trang QRadar chính
    if (url.indexOf("/console/qradar/jsp/QRadar.jsp") !== -1) {
        console.log("[Main] Detected QRadar console, init SIEM modules...");
        initCopyField();
    }

    // sau này: thêm router cho Jira, Ticket...
    // else if (url.indexOf("cntt.vnpt.vn/browse/") !== -1) { ... }
}
