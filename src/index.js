import { copyField } from "./modules/siem/copy-field";

export function main() {
    if (window.top !== window.self) return;

    const url = location.href;

    if (url.includes("/console/qradar/jsp/QRadar.jsp")) {
        // SIEM functions
        copyField();
    }
}