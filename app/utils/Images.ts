/**
 * contains all the image reference from here
 */
import EthLogo from "../assets/img/Ethereum.svg";
import BtcLogo from "../assets/img/btcLogo.svg";
import TrxLogo from "../assets/img/trxLogo.svg";
import Avax from "../assets/img/AVAX.svg";
import BNB from "../assets/img/newbnb.png";
import BUSD from "../assets/img/busd.png";
import BUSDSVG from "../assets/img/busd.svg";
import USDT from "../assets/img/usdt.svg";
// import fav from "../assets/img/fav";
// import favOutline from "../assets/img/fav-outline";
// import Active from "../assets/img/active-exchange.svg";
// import EUR from '../assets/img/EUR.png';
// import GBR from '../assets/img/gbp.png';
import XdcLogo from '../assets/img/xdc.svg';
// import PolygonLogo from '../assets/img/matic.svg';
import PolygonLogo from '../assets/img/Ethereum.svg';
import Cake from '../assets/img/cake.png';
// import pancake from '../assets/img/pancake.png';
// import reset from '../assets/img/newreset.png';
// import noimg from '../assets/img/noimg.png';
import wonLogo from '../assets/img/wanlogo.png'
import shib from '../assets/img/shib.svg'
import aave from '../assets/img/aave.svg'
import atom from '../assets/img/atom.svg'
import dai from '../assets/img/dai.svg'
import grt from '../assets/img/grt.svg'
import link from '../assets/img/link.svg'
import mana from '../assets/img/mana.png'
import matic from '../assets/img/matic.svg'
// import matic from '../assets/img/Ethereum.svg'
import sand from '../assets/img/sand.svg'
import snx from '../assets/img/snx.svg'
import tusd from '../assets/img/tusd.svg'
import uni from '../assets/img/uni.svg'
import usdt from '../assets/img/usdt.svg'
import wbtc from '../assets/img/wbtc.svg'
// import close from '../assets/img/close.png'
import Newbiance from '../assets/img/newbnb.svg'
import NoCruncy from '../assets/img/noCruncy.png'
import { ApiConstants } from "../api/ApiConstants";
export const Images = {
  matcoin:matic,
  biance:Newbiance,
  // multicoin: require("../assets/img/multicoin.png"),
  // splash_logo: require("../assets/img/splash_logo.png"),
  // splash_logo2: require("../assets/img/logo.png"),
  // chiptoss: require("../assets/img/Chiptoss.png"),
  // walletConnectIcn: require("../assets/img/walletConnectIcn.png"),
  EthLogo: EthLogo,
  BtcLogo: BtcLogo,
  TrxLogo: TrxLogo,
  XdcLogo: XdcLogo,
  PolygonLogo: PolygonLogo,
  Cake: Cake,
  cake: Cake,
  // pancake: pancake,
  // reset: reset,
  noimg: `${ApiConstants.URL}WalletImages/noimg.png`,
  wonLogo: wonLogo,
  wan: wonLogo,
  xrc: XdcLogo,
  mat: PolygonLogo,
  BNB: `${ApiConstants.URL}WalletImages/Binance.png`,
  BUSD: BUSD,
  busd: BUSDSVG,
  USDT: USDT,
  Avax: Avax,
  // fav: fav,
  // EUR: EUR,
  // GBR: GBR,
  close:`${ApiConstants.URL}WalletImages/close.png`,
  // favOutline: favOutline,
  // Active: Active,
  shib: shib,
  createwalletPng: `${ApiConstants.URL}WalletImages/newcreatewallet.webp`,
  // createwalletPng: require("../assets/img/newcreatewallet.webp"),
  // recoveryphrasePng: require("../assets/img/Text.png"),
  // recoveryphrasePng: require("../assets/img/recovery-phrase.png"),
  clearLight : `${ApiConstants.URL}WalletImages/clearl1.png`,
  clearDark : `${ApiConstants.URL}WalletImages/cleard1.png`,
  fingerLight : `${ApiConstants.URL}WalletImages/fingerl1.png`,
  fingerDark : `${ApiConstants.URL}WalletImages/fingerd1.png`,
  successTick: `${ApiConstants.URL}WalletImages/lighttick.png`,
  // lighttick: require("../assets/img/lighttick.png"),
  // darktick: require("../assets/img/lighttick.png"),
  // modalClose: require("../assets/img/modalclose.png"),
  aave:aave,
  atom:atom,
  avax:Avax,
  dai:dai,
  grt:grt,
  link:link,
  mana:mana,
  matic:matic,
  sand:sand,
  snx:snx,
  tusd:tusd,
  uni:uni,
  usdt:usdt,
  wbtc:wbtc,
  noCruncy:NoCruncy,

  //drawer icons
  // drawerHome: require("../assets/img/drawerHome.png"),
  nodata: `${ApiConstants.URL}WalletImages/nodata.png`,
  bizztoken: require("../assets/img/bizztoken.png"),


  // send: require("../assets/img/send.png"),
  // receive: require("../assets/img/receive.png"),
  // transaction: require("../assets/img/transaction.png"),
  // swap: require("../assets/img/swap.png"),
  // buy: require("../assets/img/buy.png"),

  // dsend: require("../assets/img/dsend.png"),
  // dreceive: require("../assets/img/dreceive.png"),
  // dtransaction: require("../assets/img/dtransaction.png"),
  // dswap: require("../assets/img/dswap.png"),
  // dbuy: require("../assets/img/dbuy.png"),  

  // gwallet:require("../assets/img/gwallet.png"),
  // lwallet: require("../assets/img/lwallet.png"),
  // dwallet: require("../assets/img/dwallet.png"),

  // dactiveexchange: require("../assets/img/dactive-exchange.svg"),
  // gactiveexchange: require("../assets/img/gactive-exchange.svg"),
  // splash: require("../assets/img/logo.png"),
  // wallet: require("../assets/img/wallet.png"),
  // BottomWallet:require("../assets/img/bottom-wallet.png"),
  // BottomDapp:require("../assets/img/dapp.png"),
  // BottomSwap:require("../assets/img/bottom-swap.png"),
  // BottomSettings:require("../assets/img/settings.png"),
  copy: `${ApiConstants.URL}WalletImages/copy.png`,
  share: `${ApiConstants.URL}WalletImages/share.png`,
  rightDark : `${ApiConstants.URL}WalletImages/rightd1.png`,
  rightLight : `${ApiConstants.URL}WalletImages/rightl1.png`,
  tickGreen : `${ApiConstants.URL}WalletImages/tick.svg`,
  // closePassword: require("../assets/img/close-password.png"),
  // ellipse_two: require("../assets/img/ellipse-2.png"),
  // swapping: require("../assets/img/swap.png"),
  // USD: require("../assets/img/USD.png"),
  // fingerprint: require("../assets/img/fingerprint.png"),
  // acivestar: require("../assets/img/activestar.png"),
  // inacivestar: require("../assets/img/inactivestar.png"),
  // leftarrow: require("../assets/img/lleft.png"),
  netnotify: require("../assets/img/netnotify.svg"),
  eyeon: require("../assets/img/eyeon.svg"),
  splashlogo: require("../assets/img/appicon.png"),
  background: require("../assets/img/appiconbackground.png"),
  backgroundWhite: require("../assets/img/appiconbackgroundWhite.png"),
  backgroundSend: require("../assets/img/sendBackgroung.png"),
  backgroundgroup: require("../assets/img/backgroundgroup.png"),
  backgroundgrouplight : require("../assets/img/backgroundgrouplight.png"),
  splashlogolight:require("../assets/img/appiconlight.png"),
backgroundVoice:require("../assets/img/menueBackgroung.png"),
backgroundVoiceDark:require("../assets/img/menueBackgroundDark.png"),
  // applogodark: require("../assets/img/applogo2d.png"),
  // applogolight: require("../assets/img/applogo2l.png"),
  // dapplight: require("../assets/img/settingsul1.png"),
  // dappdark: require("../assets/img/settingsud1.png"),
};


