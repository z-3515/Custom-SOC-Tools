export const SELECTOR = {
    PAGES: {
        EVENT_VIEWER: 'div[id="pages"] iframe[id="PAGE_EVENTVIEWER"]',
        FLOW_VIEWER:  'div[id="pages"] iframe[id="PAGE_FLOWVIEWER"]',
    },

    SIDEBAR: {
        MENU: '#sidebar-menu',
        BUTTONS: '.menu > button',
    },

    TABLE: {
        TABLE: 'div[id=tableSection] table[id="defaultTable"]',
        HEAD: 'div[id=tableSection] table[id="defaultTable"] > thead',
        BODY: 'div[id=tableSection] table[id="defaultTable"] > tbody',
        CELL: 'div[id=tableSection] table[id="defaultTable"] > tbody > tr > td',
        DATACELL: 'div[id=tableSection] table[id="defaultTable"] > tbody > tr > td > span',
    }
}