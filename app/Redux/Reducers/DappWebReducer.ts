import isEmpty from "../../utils/isEmpty";
import { DAPP_WEB } from "../Actions/types";

const initialState = {
  dappWeb: [],
  webTabs: [],
  webRef: [],
  current_ind:0
};

const DappWebReducer = (state = initialState, action) => {
  switch (action.type) {
    case DAPP_WEB:
      return {
        ...state,
        dappWeb: action.data,
      };
    case "web_tabs":
      return {
        ...state,
        webTabs: action.data
      };

    case 'web_Ref':
      return {
        ...state,
        webRef: !isEmpty(state.webRef[action?.data?.current_ind]) ? 
        state.webRef.map((it,ind)=>{if(ind == action?.data?.current_ind && it.url != action?.data?.webRef?.url) return it = action.data.webRef 
          else return it}):
        [...state.webRef,action.data.webRef],
        current_ind:action?.data?.current_ind
      }
    default:
      return state;
  }
};

export default DappWebReducer;
