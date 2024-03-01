import { FITA_DATA, MY_ADD } from "../Actions/types";

const initialState = {
  fiatData: [],
  swapdata: {
    youpay: '',
    youget: '',
    yougettoken: '',
    youpaytoken: '',
    youpay18: '',
    youget18: '',
    walletaddress: "",
    privKey: "",
    tokenBalanceGet: "",
    tokenBalancePay: "",
    balance: "",
    TokenTypes: []
  },
  footerReducer: "",
  DefaultCurrencys: "",
  defaultCurrency: ""
};

const fiatDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FITA_DATA:
      return {
        ...state,
        fiatData: action.data,
      };

    case 'swap_datas':
      return {
        ...state,
        swapdata: { ...state['swapdata'], ...action.data },
      };

    case 'DefaultCurrencys':
      return {
        ...state,
        DefaultCurrencys: action.data
      }
    case 'defaultCurrency':
      return {
        ...state,
        defaultCurrency: action.data
      }

    case 'footReducer':
      return {
        ...state,
        footerReducer: action.data
      }
    default:
      return state;
  }
};

export default fiatDataReducer;
