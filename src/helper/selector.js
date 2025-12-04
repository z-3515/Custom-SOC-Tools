export const SELECTOR = {
    IFRAMES: {
        // Hint dùng cho resolver trong iframeService (match URL)
        EVENT_VIEWER_HINT: "EventViewer",
        FLOW_VIEWER_HINT: "FlowViewer",
    },
    TABLE: {
        TABLE: 'div[id="tableSection"] table[id="defaultTable"]',
        BODY:  'div[id="tableSection"] table[id="defaultTable"] > tbody',
        CELL:  'div[id="tableSection"] table[id="defaultTable"] > tbody > tr > td',
        DATA_CELL: 'div[id="tableSection"] table[id="defaultTable"] > tbody > tr > td > span',
    }
};
