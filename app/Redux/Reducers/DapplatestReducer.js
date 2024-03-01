
var initialState = {
    networkmodal: false,
    selectednetwork: 0,
    multitabs: [],
    weburl: "",
    tripledotmodal: false,
    selectedTab: 0,
    searchUrl: "",
    currenttabId: 0,
    Maddress: "",
    ActiveTabId: "",
    navigateAction: "",
    privateMode: false,
    button: ""
};
const DapplatestReducer = (state = initialState, action) => {
    switch (action.type) {
        case "Dappmodalupdate":
            return {
                ...state,
                networkmodal: action.data,
            };
        case "selecteTab":
            return {
                ...state,
                selectedTab: action.data,
            };
        case "Updatenetwork":
            return {
                ...state,
                selectednetwork: action.data,
            };
        case "Getmultitabs":
            var data = [...action.data]
            var length = data.length
            // console.log("LENGTH", length, data[length - 1].TAB);
            return {
                ...state,
                multitabs: action.data
            };
        case "Updateweburl":
            console.log("URLLLLLLLLL", action.data);
            return {
                ...state,
                weburl: action.data
            };
        case "SearchUrl":
            console.log("URLLLLLLLLL", action.data);
            return {
                ...state,
                searchUrl: action.data
            };
        case "Addtab":
            var data = [...state.multitabs]
            var setObj = { TabId: action.data, ImageUrl: "", TAB: [{ URL: "https://www.google.com/", hostName: "www.google.com", id: "0" }] }
            data.push(setObj)
            return {
                ...state,
                multitabs: data,
                weburl: "https://www.google.com/",
                searchUrl: "https://www.google.com/",
            };

        case "UpdateTab":
            console.log('kdjkjhdkghd', state.selectedTab, state.multitabs[state.selectedTab]);
            var data = [...state.multitabs.slice(0, state.selectedTab),
            {
                ...{
                    "ImageUrl": state.multitabs[state.selectedTab]?.ImageUrl,
                    "TabId": state.multitabs[state.selectedTab]?.TabId,
                    "TAB": [...state.multitabs[state.selectedTab].TAB, action.data]
                }
            },
            ...state.multitabs.slice(state.selectedTab + 1, state.multitabs.length)];
            return {
                ...state,
                multitabs: data,
                searchUrl: action.data.URL
            };
        case "Updatetripledotmodal":
            return {
                ...state,
                tripledotmodal: action.data,
            };
        case "CurrenTabId":
            return {
                ...state,
                currenttabId: action.data,
            };
        case "setMAddress":
            return {
                ...state,
                Maddress: action.data,
            };
        case "setActiveTabId":
            return {
                ...state,
                ActiveTabId: action.data,
            };

        case "setNavigateAction":
            return {
                ...state,
                navigateAction: action.data,
            };
        case "setImageUrl":
            // console.log("seerrtttttt",[...state.multitabs,...state.multitabs[state.selectedTab].ImageUrl : action.data]);
            var data = [...state.multitabs.slice(0, state.selectedTab),
            {
                ...{
                    "ImageUrl": action.data,
                    "TabId": state.multitabs[state.selectedTab]?.TabId,
                    "TAB": state.multitabs[state.selectedTab].TAB
                }
            },
            ...state.multitabs.slice(state.selectedTab + 1, state.multitabs.length)];
            return {
                ...state,
                multitabs: data,
            };
        case "setInitialDapp":
            return {
                ...state,
                networkmodal: false,
                selectednetwork: 0,
                multitabs: [],
                weburl: "",
                tripledotmodal: false,
                selectedTab: 0,
                searchUrl: "",
                currenttabId: 0,
                Maddress: "",
                ActiveTabId: ""
            };
        case "setPrivateMode":
            return {
                ...state,
                privateMode: action.data,
            };
        case "setButton":
            return {
                ...state,
                button: action.data,
            };
        default:
            return state;
    }
};

export default DapplatestReducer;
