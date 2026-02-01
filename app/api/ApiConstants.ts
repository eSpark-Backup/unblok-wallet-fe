
export var envname = "production"


var eth_url = "";
var bnb_url = "";
var tron_url = "";
var bitcoin_url = "";
var bitcoinDetails = "";
var mat_url = "";
var FRONT_URL = "rorowallet://";
var buyApi = ""
var sellApi = ""
var getRewardDetailsUrl = ""
var setRewardAmountAfterClaim = ""
if (envname == "production") {

  // var URL = "http://192.53.121.26:9090/";
  var URL = "http://192.53.121.26:8096/";
  // eth_url = "https://ropsten.etherscan.io/tx/";
  eth_url = "https://goerli.etherscan.io/tx/";
  bnb_url = "https://testnet.bscscan.com/tx/";
  tron_url = "https://shasta.tronscan.org/#/transaction/";
  bitcoin_url = "https://www.blockchain.com/btc/tx/";
  bitcoinDetails = "https://api.blockcypher.com/v1/btc/main/addrs/";
  mat_url = "https://mumbai.polygonscan.com/tx/"
  buyApi = "https://onramp.money/app/?appId=2"
  sellApi = "https://onramp.money/main/sell/?appId=2"
  getRewardDetailsUrl = "https://nftdemo3.maticz.com/api/v1/user/getRewardDetails";
  setRewardAmountAfterClaim = "https://nftdemo3.maticz.com/api/v1/user/setRewardAmountAfterClaim";

}
else {
  // var URL = "http://192.168.112.33:2021/";


  var URL = `http://200.140.70.147:2021/`;
  // var URL = `http://200.140.70.142:2021/`;
  eth_url = "https://goerli.etherscan.io/tx/";
  // eth_url = "https://etherscan.io/tx/";
  bnb_url = "https://testnet.bscscan.com/tx/";
  tron_url = "https://tronscan.org/#/transaction/";
  bitcoin_url = "https://www.blockchain.com/btc/tx/";
  bitcoinDetails = "https://api.blockcypher.com/v1/btc/main/addrs/";
  mat_url = "https://mumbai.polygonscan.com/tx/";
  buyApi = "https://onramp.money/app/?appId=2"
  sellApi = "https://onramp.money/main/sell/?appId=2";
  getRewardDetailsUrl = "https://nftdemo3.maticz.com/api/v1/user/getRewardDetails";
  setRewardAmountAfterClaim = "https://nftdemo3.maticz.com/api/v1/user/setRewardAmountAfterClaim";

}
const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
};
const EIP155_SIGNING_METHODS_Name = {
  'personal_sign': 'Approve Sign',
  'eth_sign': 'Approve ETH SIgn',
  'eth_signTransaction': 'eth_signTransaction',
  'eth_signTypedData': 'eth_signTypedData',
  'eth_signTypedData_v3': 'eth_signTypedData_v3',
  'eth_signTypedData_v4': 'eth_signTypedData_v4',
  'eth_sendRawTransaction': 'eth_sendRawTransaction',
  'eth_sendTransaction': 'eth_sendRawTransaction',
};
export { EIP155_SIGNING_METHODS_Name, EIP155_SIGNING_METHODS, eth_url, bnb_url, tron_url,setRewardAmountAfterClaim, getRewardDetailsUrl, bitcoin_url, bitcoinDetails, mat_url, buyApi, sellApi }

export const ApiConstants = {
  URL: URL,
  BASE_URL: URL + "v1/user/",
  TOKEN_URL: URL + "v1/token/",
  newuser: "newuser",
  currency: "currency",
  seedgenerate: "seedgenerate",
  seedvalidation: "seedvalidation",
  seedimport: "seedimport",
  seedimportprivatekey: "seedimport_privatekey",
  deposit: "deposit",
  addressgenerate: "addressgenerate",
  withdraw: "withdraw",
  getGraphValue: "getGraphValue",
  assets_update: "assets_update",
  tokenList: "tokenList",
  enable_coin: "enable_coin",
  enable_coin_privatekey: "enable_coin_privatekey",
  customtokenfetch: "customtokenfetch",
  customtokenadd: "customtokenadd",
  networklist: "networklist",
  transaction_list: "transaction_list",
  addressValidate: "ethaddress_validation",
  passcodelogin: "passcodelogin",
  dappcategory: "dappcategory",
  dapps: "dapps",
  add_fav_dapp: "add_fav_dapp",
  remove_fav_dapp: "remove_fav_dapp",
  dapps_fav: "dapps_fav",
  aboutus: "aboutus",
  coinmarketcap_bysymbol: "coinmarketcap_bysymbol",
  fiatcurrency: "fiatcurrency",
  coinmarketcapAll: "coinmarketcap_All",
  gaslimit: "gaslimit",
  tokenAssetUpdateFunc: "tokenAssetUpdateFunc",
  getHistoryBymail: "getHistoryBymail",
  setDapphistory: "setDapphistory",
  clearDappHistory: "clearDappHistory",
  getUserBymail: "getUserBymail",


  //for swap process
  tokensForSwap: "tokensForSwap",
  getAmountsIN_token: "getAmountsIN_token",
  getAmountsOUT: "getAmountsOUT",
  token_balance: "token_balance",
  approve_check: "approve_check",
  approved: "approve",
  swap: "swap",
  getAmountIn: "getAmountsIN",
  getAmountOut: "getAmountsOUT",
  tokenListApi: "tokenlist",
  tokenlistType: "tokenlistbyttype",
  fetchCms: "fetchCms",

  // initial
  userRegister: "userRegister",
  userLoginFun: "userLoginFun",
  getProfile: "getProfile",
  changeFunction: "changeFunction",
  sendMailinNode: "sendMailinNode",
  encryptpass: "encryptpass",
  updateProfileApi: "updateProfileApi",
  getFaqContent: "getFaqContent",
  searchCategory: "searchCategory",
  saveDappimage: "saveDappimage",
  coinmarketcap_All_Req: "coinmarketcap_All_Req",
  claimReward: "claimReward",
  getAllTranscations: "getAllTranscations",
  removeFolderFunction: "removeFolderFunction",

  //chainids
  bnb_chainId: envname == "production" ? 56 : 97,
  // eth_chainId: envname == "production" ? 1 : 11155111,
  eth_chainId: envname == "production" ? 1 : 5,
  xdc_chainId: envname == "production" ? 50 : 51,
  polygon_chainId: envname == "production" ? 137 : 80001,
  wan_chainId: envname == "production" ? 888 : 999,
  //network name
  bnb_network: envname == "production" ? 'Binance Smart Chain' : "Binance Testnet",
  eth_network: envname == "production" ? "Ethereum Mainnet" : "Sepolia Testnet",
  // eth_network :envname == "production" ? "Ethereum Mainnet" : "Goerli Testnet",
  xdc_network: envname == "production" ? "XDC Mainnet" : "Apoethem Testnet",
  polygon_network: envname == "production" ? "Polygon Mainnet" : "Polygon Testnet",
  wan_network: envname == "production" ? "Wanchain Mainnet" : "Wanchain Testnet",

  bnb_chainId_l: envname == "production" ? 56 : 97,
  eth_chainId_l: envname == "production" ? 1 : 5,
  // eth_chainId_l: envname == "production" ? 1 : 11155111,
  xdc_chainId_l: envname == "production" ? 50 : 51,
  polygon_chainId_l: 80001,
  // polygon_chainId_l: envname == "production" ? 137 : 80001,
  wan_chainId_l: envname == "production" ? 888 : 999,
  //network name
  bnb_network_l: envname == "production" ? 'Binance Smart Chain' : "Binance Testnet",
  // eth_network_l :envname != "production" ? "Ethereum Mainnet" : "Goerli Testnet",
  eth_network_l: envname == "production" ? "Ethereum Mainnet" : "Sepolia Testnet",
  xdc_network_l: envname == "production" ? "XDC Mainnet" : "Apoethem Testnet",
  polygon_network_l: envname != "production" ? "Polygon Mainnet" : "Polygon Testnet",
  wan_network_l: envname == "production" ? "Wanchain Mainnet" : "Wanchain Testnet",

  Chains: envname == "production" ? {
    1: "https://mainnet.infura.io/v3/be5bdb23c61c4b92b174cb569e57f7b2",
    56: "https://bsc-dataseed1.binance.org/",
    137: "https://polygon-rpc.com/",
    888: "https://gwan-ssl.wandevs.org:56891",
    50: "https://xdcpayrpc.blocksscan.io",
    97: "https://data-seed-prebsc-2-s1.binance.org:8545/",
    97: "https://data-seed-prebsc-2-s1.binance.org:8545/",
    56: "https://bsc-dataseed1.binance.org/",
    137: "https://polygon-rpc.com/",
    1101: "https://matic-mumbai.chainstacklabs.com/",
    999: "https://gwan-ssl.wandevs.org:46891/",
    51: "https://apothemxdcpayrpc.blocksscan.io/",
    80001: "https://polygon-mumbai-bor.publicnode.com"
  }
    :
    {
      5: "https://goerli.infura.io/v3/5481c483c56f4995a4f293f775f9d917",
      1: "https://mainnet.infura.io/v3/be5bdb23c61c4b92b174cb569e57f7b2",
      // 11155111: "https://sepolia.infura.io/v3/50c7d1be83794ae0a3e74eab40b74373",
      97: "https://data-seed-prebsc-2-s1.binance.org:8545/",
      56: "https://bsc-dataseed1.binance.org/",
      137: "https://polygon-rpc.com/",
      1101: "https://matic-mumbai.chainstacklabs.com/",
      999: "https://gwan-ssl.wandevs.org:46891/",
      51: "https://apothemxdcpayrpc.blocksscan.io/",
      80001: "https://polygon-mumbai-bor.publicnode.com"
    },

  secretOrKey: "test",

  clientMeta: {
    description: "YUSE wallet",
    url: "https://yustoken.io",
    icons: [
      "https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/4ca6cbac-48a2-4dc9-0712-0c75cd12c300/lg",
    ],
    name: "Yuse Wallet",
    redirect: {
      native: FRONT_URL,
      universal: FRONT_URL
    }
  }
};
