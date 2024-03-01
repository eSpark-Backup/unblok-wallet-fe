import { createStore, combineReducers } from "redux";
import walletDetailReducer from "../Redux/Reducers/walletDetailReducer";
import scanDataReducer from "../Redux/Reducers/scanDataReducer";
import transactionDataReducer from "../Redux/Reducers/transactionDataReducer";
import walletNameEditReducer from "../Redux/Reducers/walletNameEditReducer";
import seedDataReducer from "../Redux/Reducers/seedDataReducer";
import importWalletReducer from "../Redux/Reducers/importWalletReducer";
import selectedCurrencyListReducer from "../Redux/Reducers/selectedCurrencyListReducer";
import tokenListReducer from "../Redux/Reducers/tokenListReducer";
import totalConvertedBalReducer from "../Redux/Reducers/totalConvertedBalReducer";
import walletSendDataReducer from "./Reducers/walletSendDataReducer";
import DappWebReducer from "./Reducers/DappWebReducer";
import fiatDataReducer from "./Reducers/fiatDataReducer";
import allCurrrencyReducer from './Reducers/AllcurrencyReducer';
import wcreducer from "./Reducers/wcreducer";
import DapplatestReducer from "./Reducers/DapplatestReducer";

const rootReducer = combineReducers({
  walletDetailReducer: walletDetailReducer,
  scanDataReducer: scanDataReducer,
  transactionDataReducer: transactionDataReducer,
  walletNameEditReducer: walletNameEditReducer,
  seedDataReducer: seedDataReducer,
  importWalletReducer: importWalletReducer,
  selectedCurrencyListReducer: selectedCurrencyListReducer,
  tokenListReducer: tokenListReducer,
  totalConvertedBalReducer: totalConvertedBalReducer,
  walletSendDataReducer: walletSendDataReducer,
  DappWebReducer: DappWebReducer,
  fiatDataReducer: fiatDataReducer,
  DapplatestReducer:DapplatestReducer,
  allCurrrencyReducer,allCurrrencyReducer,
  wcreducer
});

const configureStore = () => createStore(rootReducer);

export default configureStore;
