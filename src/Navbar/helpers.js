

export const sideBarItems = [
    {"primary": "Scores", "props": {"href": "/games/"}},
    {"primary": "Stats", "props": {"href": "/stats/"}},
    {"primary": "Standings", "props": {"href": "/seasons/standings/2019/"}},
    {"primary": "Draft", "props": {"href": "/draft/"}},
    {"primary": "Player Comparison", "props": {"href": "/players/comparison/"}},
];

export const sideBarResources = {
    "type": "sections", "component": "a", "title": "Resources",
    "items": {
        "Rumors": [
            {"label": "HoopsHype", "props": {"target": "_blank", "href": "http://hoopshype.com"}},
            {"label": "HoopRumors",
             "props": {"target": "_blank", "href": "https://www.hoopsrumors.com"}},
        ],
        "Draft": [
            {"label": "Espn Draft News",
             "props": {"target": "_blank", "href": "http://www.espn.com/nba/draft/news"}},
            {"label": "Draft Express",
             "props": {"target": "_blank", "href": "http://www.draftexpress.com"}},
            {"label": "NBADraft.net",
             "props": {"target": "_blank", "href": "http://www.nbadraft.net"}},
        ],
        "Salary": [
            {"label": "ESPN Trade Machine",
             "props": {"target": "_blank", "href": "http://www.espn.com/nba/tradeMachine"}},
            {"label": "Spotrac", "props": {"target": "_blank", "href": "http://www.spotrac.com/nba/"}},
        ]
    }
};