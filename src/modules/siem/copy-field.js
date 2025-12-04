import { findElm, findInIframe } from "../../helper/docQueryselector";
import { SELETOR } from "../../helper/selector";

function copyField() {
    const iframe = findElm(SELETOR.PAGES.EVENT_VIEWER);
    const doc = findInIframe(iframe);

    if (!doc) {
        console.warn("Iframe EventViewer chưa load!");
        return;
    }

    // Lấy tất cả cell
    const cells = doc.querySelectorAll(SELETOR.TABLE.CELL);

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            
            // 1) Ưu tiên lấy từ span[value]
            let spanWithValue = cell.querySelector("span[value]");
            let value = null;

            if (spanWithValue) {
                value = spanWithValue.getAttribute("value");
            }

            // 2) Nếu không có span[value], lấy text content
            if (!value) {
                value = cell.textContent.trim();
            }

            // 3) Copy vào clipboard
            navigator.clipboard.writeText(value)
                .then(() => {
                    console.log("Đã copy:", value);
                })
                .catch(err => {
                    console.error("Copy lỗi:", err);
                });
        });
    });

    console.log("CopyField activated: click cell để copy value!");
}

export { copyField };
