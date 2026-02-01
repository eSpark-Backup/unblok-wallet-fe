import {Core} from '@walletconnect/core';
import {Web3Wallet} from '@walletconnect/web3wallet';
var core  = new Core({
    // projectId: "3b20a050abc2aaffab54ac39207a2174",
    projectId:"f44287d6def01f105a601898cf205699",
       relayUrl: "wss://relay.walletconnect.com"
    });
export async function createWeb3Wallet(params) {
    try{
 var web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: 'React Native Web3Wallet',
      description: 'ReactNative Web3Wallet',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    },
  });
//   await core.pairing.pair({uri: params})
  return web3wallet
  //console.log("web3wallet",core,web3wallet)
}
  catch(e){
    //console.log("e",e)
    // return e
  }
}
// createWeb3Wallet()
export async function _pair(params) {
    try{
      //console.log("pair eror",params)
      
  return await core.pairing.pair({uri: params});}
  catch(e){
    //console.log("e",e,params)
    if(e.toString().toLowerCase().includes('pair already exits')) return {topic:String(params).split('wc:')[1].split('@')[0]}
    else
     return false
  }
}
