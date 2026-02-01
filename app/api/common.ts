import BigNumber from 'bignumber.js'
import Web3 from 'web3';
import { ApiConstants } from './ApiConstants';
export const timeformat = (data) =>
  `${new Date(data).getDate()}-${new Date(data).getMonth() + 1}-${new Date(data).getFullYear()} ${new Date(data).getHours()}:${new Date(data).getMinutes()} `

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'string' && value === '0') ||
  (typeof value === 'number' && value === 0) ||
  (typeof value === 'boolean' && value === false);

export const dateformat = (data) =>
  `${new Date(data).getDate()}-${new Date(data).getMonth()}-${new Date(data).getFullYear()}`

export const times = (data) =>
  `${new Date(data).getHours()}:${new Date(data).getMinutes()} `



export const UseRoundValue = (VALUE, DECIMALS) => {
  return VALUE > 0 ? new BigNumber(VALUE).div(new BigNumber(10).pow(DECIMALS)) : new BigNumber(0);
}

export const dateepoch = (data) => {
  if (data) {
    const d = Math?.floor(data / (24 * 60 * 60))
    h = Math?.floor(data / 3600)?.toString().padStart(2, '0'),
      m = Math?.floor(data % 3600 / 60)?.toString().padStart(2, '0'),
      s = Math?.floor(data % 60)?.toString().padStart(2, '0');
    return (d) > 0 ? `${d} Days` : h > 0 ? `${h} Hours` : m > 0 ? `${m} Minutes` : `${s} Seconds`
  }
  // else return false
}

export const singlesec = () => {
  let diffTime = Math.abs(new Date('2021-11-22T18:30:00').valueOf());
  let days = diffTime / (24 * 60 * 60 * 1000);
  let hours = (days % 1) * 24;
  let minutes = (hours % 1) * 60;
  let secs = (minutes % 1) * 60;
  [days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)]
  //////console.log(days+'d', hours+'h', minutes+'m', secs+'s');
  return Math.floor(secs)

}


function secondsToTime(e) {
  const h = Math?.floor(e / 3600)?.toString().padStart(2, '0'),
    m = Math?.floor(e % 3600 / 60)?.toString().padStart(2, '0'),
    s = Math?.floor(e % 60)?.toString().padStart(2, '0');

  return h + ':' + m + ':' + s;
  //return `${h}:${m}:${s}`;
}

// 02:08:55

/*
secondsToTime(SECONDS) // HH:MM:SS

secondsToTime(8)       // 00:00:08
secondsToTime(68)      // 00:01:08
secondsToTime(1768)    // 00:29:28
secondsToTime(3600)    // 01:00:00
secondsToTime(5296)    // 01:28:16
secondsToTime(7735)    // 02:08:55
secondsToTime(45296)   // 12:34:56
secondsToTime(145296)  // 40:21:36
secondsToTime(1145296) // 318:08:16
*/


export const secondsintwodate = (date1, date2) => {
  var a = new Date(date1 * 1000)
  var b = dateepoch(date2)
  var d = b?.split(b?.includes('Days') ? 'Days' : b?.includes('Hours') ? 'Hours' : b?.includes('Minutes') ? 'Minutes' : 'Seconds')[0]?.trim()
  var c = b?.includes('Days')
    ? new Date(a).setDate(new Date(a).getDate() + Number(d))
    : b?.includes('Hours')
      ? new Date(a).setHours(new Date(a).getHours() + Number(d))
      : b?.includes('Minutes')
        ? new Date(a).setMinutes(new Date(a).getMinutes() + Number(d))
        : new Date(a).setSeconds(new Date(a).getSeconds() + Number(d))

  console.log("Math?.abs(new Date().getTime() - c)/1000", b, c, Math?.abs(new Date().getTime() - c) / 1000)
  return c > new Date().getTime() ? Math?.abs(new Date().getTime() - c) / 1000 : 0
}





export function toExpo(x) {

  if (x) {
    // if (Math?.abs(x) < 1.0) {
    //   var e = parseInt(x?.toString().split('e-')[1]);
    //   if (e) {
    //     // //////console.log("x1",x)
    //       x *= Math?.pow(10,e-1);
    //       x = '0.' + (new Array(e)).join('0') + x?.toString()
    //       .substring(10);
    //       // //////console.log("x2",x)

    //     }
    //     else x
    // } else {
    //  var e = parseInt(x?.toString().split('+')[1]);
    //   if (e > 20) {
    //       e -= 20;
    //       x /= Math?.pow(10,e);
    //       x += (new Array(e+1)).join('0');
    //   }
    //   else x
    // }
    x = convert(x)
    //console.log("x",x)
    // return Number(x).toLocaleString()
    if (x?.toString()?.includes("0.00000000")) { return x }
    // if(x?.toString()?.includes("0.0000000")){return 0}
    if (x?.toString()?.includes("0.") && x?.toString()?.split(".")[1]?.length > 3) { return parseFloat(x).toFixed(5) }
    else {
      const lookup = [
        { v: 1E3, s: "K" },
        { v: 1E6, s: "M" },
        { v: 1E9, s: "B" },
        { v: 1E12, s: "T" },
        { v: 1E15, s: "P" },
        { v: 1E18, s: "E" },
        { v: 1E21, s: "Z" },
        { v: 1E24, s: "Y" }
      ],
        digits = 3
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup.slice().reverse().find(function (item) {
        return x >= item.v;
      });
      ////console.log("xuiuuiouihj",x)
      return !isEmpty(x) ? item
        ? Number(String(((x / item.v).toFixed(digits)).replace(rx, "$1"))).toLocaleString() + item.s
        : x?.toString()?.split('0.')[0] == ""
          ? x
          : parseFloat(x).toLocaleString()
        : 0
    }

    ////console.log("x",x)
  }
  else return 0

  // else x
  // //////console.log(x)
  // return String(x).toLocaleString()

  // var num = x
  // if(num){
  // const unit = Math?.floor(Math?.round(num / 1.0e+1) || 0 ?.toLocaleString() || 0?.replaceAll(',', '')?.length||0),
  // wunit = ["K","M","B","T","q","Q","s","S","o","n","d","U","D","T","Qt","Qd","Sd","St","O","N","v","c"][Math?.floor(unit / 3) - 1],
  // funit = Math?.abs(Number(num))/Number('1.0e+'+(unit-unit%3));
  // return wunit ? funit?.toLocaleString()?.toLocaleString() + ' ' + wunit : num?.toLocaleString()?.toString();
  // }
  ////////console.log("Number(num / si[index].v else before",x);

  // var  num = x
  // if(num){

  // num = (num)?.toString()?.replace(/[^0-9.]/g, '');
  // if (num < 1000) {
  //     return String(Number(num)?.toFixed(2)).toLocaleString();
  // }

  // let si = [
  //   {v: 1E3, s: "K"},
  //   {v: 1E6, s: "M"},
  //   {v: 1E9, s: "B"},
  //   {v: 1E12, s: "T"},
  //   {v: 1E15, s: "P"},
  //   {v: 1E18, s: "E"},
  //   {v: 1E21, s: "Z"},
  //   {v: 1E24, s: "Y"}
  //   ];
  // let index;
  // for (index = si.length - 1; index > 0; index--) {
  //     if (num >= si[index].v) {
  //         break;
  //     }
  // }



  // var d= Math.ceil(Number(num / si[index].v))>0
  // ?(String((Number(num / si[index]?.v))||''?.includes('.')) && !String((Number(num / si[index].v))||''?.includes('.00')))?
  // ((Number(num / si[index].v)?.toFixed(2)))
  // : String((Number(num / si[index]?.v)))
  // :0
  // const formattedNumber = (d)?.toLocaleString("en-US");
  //  var value = formattedNumber+ si[index]?.s
  //  return (value)
  // }
  // else {
  // ////////console.log("Number(num / si[index].v else",x);

  // return x}
}

export function RemoveE(x) {

  if (x) {
    if (Math?.abs(x) < 1.0) {
      var e = parseInt(x?.toString().split('e-')[1]);
      //////console.log("x1",x,e)
      if (e) {
        x *= Math?.pow(10, e - 1);
        //////console.log("x1",x,e,(new Array(e)).join('0'),(new Array(e)).join('0')+x?.toString()
        // .substring((new Array(e)).length))

        x = '0.' + (new Array(e)).join('0') + x?.toString()
          .substring(10);
        //////console.log("x2",x)

      }
      else x
    } else {
      var e = parseInt(x?.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x /= Math?.pow(10, e);
        x += (new Array(e + 1)).join('0');
      }
      else x
    }
  }
  return x

}
export function convert(n) {
  try {
    if (n) {
      // var sign = +n < 0 ? "-" : "",
      var toStr = n.toString();
      if (!/e/i.test(toStr)) {
        return n;
      }
      var [lead, decimal, pow] = n
        .toString()
        .replace(/^-/, "")
        .replace(/^([0-9]+)(e.*)/, "$1.$2")
        .split(/e|\./);
      //////console.log("pow",+pow<0 ,"0." +"0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0))+lead+decimal)
      return +pow == 0
        ? 0 :
        +pow < 0 ? "0." + "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal
          :
          // sign +
          lead +
          (+pow >= decimal.length
            ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))
            : decimal.slice(0, +pow) + "." + decimal.slice(+pow));
    }
    else n
  } catch (err) {
    console.error("condsandknasd", err)
    return 0;
  }

}


export const GetNetwork = (tokenTYpe) => {
  return (tokenTYpe).includes('BEP20')
    ? ApiConstants.bnb_network
    : (tokenTYpe).includes('ERC20')
      ? ApiConstants.eth_network
      : (tokenTYpe).includes('MAT20')
        ? ApiConstants.polygon_network
        : (tokenTYpe).includes('XDC20')
          ? ApiConstants.xdc_network
          : ApiConstants.wan_network

}

export function timeAgo(time) {

  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = 'ago',
    list_choice = 1;

  if (seconds == 0) {
    return 'Just now'
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0,
    format;
  while (format = time_formats[i++])
    if (seconds < format[0]) {
      if (typeof format[2] == 'string')
        return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
}

const web3 = new Web3();

export function getSignParamsMessage(params) {
  // const isValid =
  // return isValid
  // ////console.log("khdskajdsa",params,web3.utils.isAddress(params[1]))
  const message = params?.filter((p) => !web3.utils.isAddress(p))[0];

  return convertHexToUtf8(message);
}
export function convertHexToUtf8(value) {
  if (web3.utils.isHex(value)) {
    return web3.utils.hexToUtf8(value);
  }

  return value;
}
export function convertHexToNumber(value) {
  try {
    if (web3.utils.isHex(value)) {
      return web3.utils.hexToNumber(value);
    }

    return value;
  }
  catch (e) {
    console.error("Dsadasd", e)
    return web3.utils.hexToNumberString(value);

  }
}


export const sectodate = (date1, date2, data) => {
  var a = new Date(date1 * 1000)
  var b = dateepoch(date2)
  var d = b?.split(b?.includes('Days') ? 'Days' : b?.includes('Hours') ? 'Hours' : b?.includes('Minutes') ? 'Minutes' : 'Seconds')[0]?.trim()
  var c = b?.includes('Days')
    ? new Date().setDate(new Date(a).getDate() + Number(d))
    : b?.includes('Hours')
      ? new Date().setHours(new Date(a).getHours() + Number(d))
      : b?.includes('Minutes')
        ? new Date().setMinutes(new Date(a).getMinutes() + Number(d))
        : new Date().setSeconds(new Date(a).getSeconds() + Number(d))

  //console.log("Math?.abs(new Date().getTime() - c)/1000",b,c,Math?.abs(new Date().getTime() - c)/1000)
  return c > new Date().getTime() ? Math?.abs(new Date().getTime() - c) / 1000 : 0

}


export const GetChainid = (chainid) =>
  chainid.toLowerCase().includes("bnb")
    ? ApiConstants.bnb_chainId
    : chainid.toLowerCase().includes("eth")
      ? ApiConstants.eth_chainId
      : chainid.toLowerCase().includes("xdc")
        ? ApiConstants.xdc_chainId
        : chainid.toLowerCase().includes("mat")
          ? ApiConstants.polygon_chainId
          : ApiConstants.wan_chainId;



// web3.utils.hexToNumber(getGasPrice) *  web3.utils.toHex(gaslimit)


export const linking = {
  prefixes: ['unblok://'],
  config: {
    screens: {
      GetStarted: "GetStarted",
      AboutUs: "AboutUs",
      Rewards: "Rewards",
      SettingsKeyboard: "SettingsKeyboard",
      SwapBottomTab: "SwapBottomTab",
      SettingsHome: "SettingsHome",
      WalletHome: "WalletHome",
      BottomTab: {
        screens: {
          WalletHomeBottomTab: "WalletHomeBottomTab",
          DappBottomTab: "DappBottomTab"
        }
      }
    }
  }
};