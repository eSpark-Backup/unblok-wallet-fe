import React from "react";
import { Image } from "react-native-elements";
import { Images } from "./Images";
// import { SvgUri } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';

export const showImage = (type, route) => {
  var type = type?.toString()?.toLowerCase()?.split('20')[0]
  // console.log("tyyyyyyyyyyyyyy", type);

  if (['erc', 'eth']?.includes(type)) { return <Images.EthLogo width={route == "walletHistory" ? 50 : route == "walletlist" ? 31 : 40} height={route == "walletHistory" ? 50 : route == "walletlist" ? 31 : 40} /> }
  else if (type?.includes('bnb')) { return <Images.biance width={route == "walletHistory" ? 50 : route == "walletlist" ? 31 : 40} height={route == "walletHistory" ? 50 : route == "walletlist" ? 31 : 40} />}
  else if (type?.includes('bep')) { return <Images.biance width={route == "walletHistory" ? 50 : route == "walletlist" ? 31 : 40} height={route == "walletHistory" ? 50 : route == "walletlist" ? 31 : 40} />}
  else if (type?.includes('btc')) { return <Images.BtcLogo width={route == "walletHistory" ? 50 : route == "walletlist" ? 31 : 40} height={route == "walletHistory" ? 50 : route == "walletlist" ? 31 : 40} /> }
  else if (['trc', 'trx']?.includes(type)) { return <Images.TrxLogo width={route == "walletHistory" ? 50 : 40} height={route == "walletHistory" ? 50 : 40} /> }
  else if ("mat")
    return <Images.matcoin width={route == "walletHistory" ? 50 : route == "walletlist" ? 31 : 40} height={route == "walletHistory" ? 50 : route == "walletlist" ? 31 : 40} />
  // else if(["busd"]?.includes(type)) { return <Images.BUSD width={route == "walletHistory" ? 50 :40} height={route == "walletHistory" ? 50 :40} /> }
  else if (['xrc', 'mat', 'wan', "busd", "cake", "matic", "aave", "atom", "avax", "dai", "grt", "link", "mana", "sand", "snx", "tusd", "uni", "usdt", "wbtc"]?.includes(type))
    if (route == "wallethome")
      return <Image source={Images[type]} style={{ resizeMode: "contain", width: 40, height: 40, }} />
    else
      // return <Image source={Images[type]} style={{ width: route == "walletHistory" ? 50 : 40, height: route == "walletHistory" ? 50 : 40 }} />
      return <SvgUri
        width={route == "walletHistory" ? 50 : 40}
        height={route == "walletHistory" ? 50 : 40}
        // uri={`http:/192.53.121.26:8096/images/${item.currencyimage}`}
        source={Images[type]}
      />
  else return (
    <Image source={{ uri: Images.noimg }} style={{ width: 40, height: 40 }} />
  );
};