import { Platform } from "react-native";

export const getJsCode = (address, networkId, rpcUrl,privateKey,ethersJsContent,web3JsContent) => {
    const dappName = "";
    return `
    ${ethersJsContent}
    ${web3JsContent}
      (function() {
        var web33 = "";

        let resolver = {};
        let rejecter = {};



        ${Platform.OS === "ios" ? "window" : "document"
      }.addEventListener("message", function(data) {

          try {
            const passData = data.data ? JSON.parse(data.data) : data.data;
            //console.log("passDatapassDatapassData",passData)
            // alert("eth transaction"+data.data)
            const { id, result } = passData;

            if (result && result.error && rejecter[id]) {
              rejecter[id](new Error(result.message));

            } else if (resolver[id]) {

              resolver[id](result);

            }

            if(passData?.switchChain){
              try{
             // alert("Switched : ")
              const { config } = passData;
            //  initWeb3(address,config.chainId,config.rpcUrl);
              window.web3.eth.getChainId().then((data)=>{
               // alert("CHain ID : "+data)
              })

            // window.web3.eth.currentProvider.disconnect();
             localStorage.setItem("configData",JSON.stringify(config));
             window.location.reload();
              }catch(e){
                alert("passData Eror : "+e);
              }
            }
          } catch(err) {
            //console.log('listener message err: ', err);
          }
        })

        communicateWithRN = (payload) => {
          return new Promise((resolve, reject) => {
            try{
              // alert("postMessage"+JSON.stringify(payload))
              //console.log('JSON.stringify(payload): ', JSON.stringify(payload));
              window.ReactNativeWebView.postMessage(JSON.stringify(payload));
              const { id } = payload;
              resolver[id] = resolve;
              rejecter[id] = reject;
            }catch(e){
              // alert("communicate",e)
            }

          })
        }

        async function transactionInit(data,fromAddr,toAddr,value,gas,gasPrice)
        {

            const nonce = await web33.eth.getTransactionCount(fromAddr, 'pending');

           return new Promise(async(resolve, reject) => {

            const rawTransaction = {
                 "from": fromAddr,
                 "to": toAddr,
                 "value": value,
                 "gasPrice": gasPrice,
                 "gasLimit": gas,
                 "nonce": nonce,
                 "data":data
                };

                //console.log('rawTransactionrawTransaction',rawTransaction);
                const signedTx = await web33.eth.accounts.signTransaction(rawTransaction,'${privateKey}');
                //console.log('signedTxsignedTx12333333-----1',signedTx.rawTransaction);
                //  alert("signedTx : > "+signedTx)
                try{
                     var hashResp = "";

                     hashResp =await web33.eth.sendSignedTransaction(signedTx.rawTransaction);

                     //console.log(hashResp,'hashResp');
                    //  alert("hashResp : "+hashResp)

                     let result = (hashResp && hashResp.transactionHash)?hashResp.transactionHash:"";

                     //console.log('result is:',result);

                     resolve(result);
                 }catch(err)
                 {
                   alert("hashRes err: "+err)
                     //console.log(err,'errerrerr');
                     reject(err);
                 }
            })
        }

        function initNotification() {

          setInterval(() => {
            if (!window.Notification) {
              // Disable the web site notification
              const Notification = class {
                constructor(title, options) {
                  this.title = title;
                  this.options = options;
                }

                // Override close function
                close() {
                }

                // Override bind function
                bind(notification) {
                }
              }

              window.Notification = Notification;
            }
          }, 1000)
        }

        function initWeb3(address,networkId,rpcUrl) {
          // alert("initWeb3"+address+networkId+rpcUrl)
          // Inject the web3 instance to web site
         try{
          const rskEndpoint = rpcUrl;

          const provider = new Web3.providers.HttpProvider(rskEndpoint);
        // alert("RPC :"+provider)
         //  const web3Provider = new ethers.providers.Web3Provider(provider)

          const web3 = new Web3(provider);
          web33 = new Web3(provider);
          // When Dapp is "Money on Chain", webview uses Web3's Provider, others uses Ethers' Provider
          window.ethereum =provider;

          window.ethereum.selectedAddress = address;

         // alert("Window.etherum : "+window.ethereum.selectedAddress)
          window.address = address;
          window.ethereum.networkVersion = networkId;
          window.ethereum.isTrust = true;
          window.ethereum.web3 = web3;
          window.web3 = web3;
          window.web3.eth.defaultAccount = address
          // alert("Window.etherum1 : "+window.ethereum.selectedAddress)

          // Adapt web3 old version (new web3 version move toDecimal and toBigNumber to utils class).
          window.web3.toDecimal = window.web3.utils.toDecimal;
          window.web3.toBigNumber = window.web3.utils.toBN;

          const config = {
            isEnabled: true,
            isUnlocked: true,
            networkVersion: networkId,
            onboardingcomplete: true,
            selectedAddress: address,
          }
          // alert("Window.etherum2 : "+config)

          // Some web site using the config to check the window.ethereum is exist or not
          window.ethereum.publicConfigStore = {
            _state: {
              ...config,
            },
            getState: () => {
              return {
                ...config,
              }
            }
          }
          // alert("Window.etherum3 : ")

          window.web3.setProvider(window.ethereum);
          // alert("Window.etherum4 : ")

          // Override enable function can return the current address to web site
          window.ethereum.enable = () => {
          // alert("Window.etherum5 : ")
            return new Promise((resolve, reject) => {
              resolve([address]);
            })
          }
          // window.ethereum.enable()
          // alert("Window.etherum6 : ")
          // Adapt web3 old version (new web3 version remove this function)
          window.web3.version = {
            api: '1.2.7',
            getNetwork: (cb) => { cb(null, networkId) },
          }

          window.ethereum.on = (method, callback) => { if (method) {
            //alert("Method : "+method)
          } }
          // alert("Window.etherum7 : ")
          // Adapt web3 old version (need to override the abi's method).
          // web3 < 1.0 using const contract = web3.eth.contract(abi).at(address)
          // web3 >= 1.0 using const contract = new web3.eth.Contract()
          window.web3.eth.contract = (abi) => {
          // alert("Window.etherum8 : ")
            const contract = new web3.eth.Contract(abi);
            contract.at = (address) => {
              contract.options.address = address;
              return contract;
            }
            // alert("Window.etherum9 : ")
            const { _jsonInterface } = contract;
          // alert("Window.etherum10 : ")
            _jsonInterface.forEach((item) => {
          // alert("Window.etherum11 : ")
              if (item.name && item.stateMutability) {
                const method = item.name;
                if (item.stateMutability === 'pure' || item.stateMutability === 'view') {
                  contract[method] = (params, cb) => {
                    //console.log('contract method: ', method);
                    contract.methods[method](params).call({ from: address }, cb);
                  };
                } else {
                  contract[method] = (params, cb) => {
                    alert('contract method: '+ method)
                    //console.log('contract method: ', method);
                    contract.methods[method](params).send({ from: address }, cb);
                  };
                }
              }
            });

            return contract;
          }
          // alert("Window.etherum12 : ")


          const sleep = ms => new Promise(r => setTimeout(r, ms));
          // Override the sendAsync function so we can listen the web site's call and do our things
          const sendAsync = async (payload, callback) => {
            let err, res = '', result = '';

            let unixTime = Math.floor(Date.now() / 1000);

            payload.id = unixTime;
            payload.jsonrpc = "2.0"

            const {method, params,id,jsonrpc} = payload;
           //  alert("payLoad : "+method);
           //await sleep(1000);
            //console.log('payload: from sendAsync +++++', payload);

            try {
          // alert("Window.etherum13 : ")
              if (method === 'net_version') {
                result = networkId;
              } else if (method === 'eth_chainId') {
                result = web3.utils.toHex(networkId);
              } else if (method === 'eth_requestAccounts' || method === 'eth_accounts' || payload === 'eth_accounts') {
                result = [address];
              }

              else if (method === 'eth_blockNumber')
              {
                  let blockNumberIs = await web33.eth.getBlock("latest");

                  //console.log('blockNumberIs121212121:',blockNumberIs);
                  //console.log('blockNumberIs:',blockNumberIs.number);
                  result = blockNumberIs.number;
              }
              // else if (method === 'eth_estimateGas')
              // {
              //   try{
              //   const gasPrice = await web33.eth.getGasPrice();
              //     var fromAddr    = (params && params[0] && params[0].from)?params[0].from:"";
              //     var toAddr      = (params && params[0] && params[0].to)?params[0].to:"";
              //     var value       = (params && params[0] && params[0].value)?params[0].value:"";
              //     var data        = (params && params[0] && params[0].data)?params[0].data:"";
              // //  alert("value checking"+fromAddr"+ "+toAddr+" "+value+" "+data)
              //     let estGas =  await web33.eth.estimateGas({
              //       from:fromAddr,
              //       to: toAddr,
              //       value:value,
              //       data: data,
              //       gasPrice: gasPrice
              //   })
              //       alert("eth_estimateGas : "+estGas)
              //   // const estGas1 = estGas * gasPrice;
              //     result = estGas;
              //   }
              //   catch(e){
              //     alert("eth_estimateGas catch error"+e)
              //   }

              // }
              else {
              //  alert("communicateWithRN : "+JSON.stringify(payload));
                result = await communicateWithRN(payload);
              }
              //console.log("resultresultresultresult",result)
              res = {id, jsonrpc, method, result};
            } catch(err) {
              err = err;
              //console.log('sendAsync err: ', err);
               alert('sendAsync err: '+ err)
            }

            //console.log('res: ', res);
            if (callback) {
              callback(err, res);
            } else {
              return res || err;
            }
          }

          // ensure window.ethereum.send and window.ethereum.sendAsync are not undefined
          setTimeout(() => {
            if (!window.ethereum.send) {
              window.ethereum.send = sendAsync;
            }
            if (!window.ethereum.sendAsync) {
              window.ethereum.sendAsync = sendAsync;
            }
            if (!window.ethereum.request) {
              window.ethereum.request = (payload) =>
                new Promise((resolve, reject) =>
                  sendAsync(payload).then((response) =>
                    response.result
                      ? resolve(response.result)
                      : reject(new Error(response.message || 'provider error'))));
            }
          }, 1000)

        }catch(e){
        // alert("Error : "+e)
        }
        }
        initNotification();

        if(localStorage.getItem("configData")){
          var config = JSON.parse(localStorage.getItem("configData"));
        initWeb3('${address}',config.chainId,config.rpcUrl);
        }else{
        initWeb3('${address}','${networkId}','${rpcUrl}');

        }


      }) ();

  `;
  };