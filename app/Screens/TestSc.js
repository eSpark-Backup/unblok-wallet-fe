import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getSdkError } from "@walletconnect/utils";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EIP155_SIGNING_METHODS, EIP155_SIGNING_METHODS_Name } from "../api/ApiConstants";
import isEmpty from "../utils/isEmpty";
import { Toastfn } from "../utils/toast";
import { GetWalletType } from "./walletConnect/WC1";
import { connect_Wallet_WC2, pair, connector, getcurrensession_WC2 } from "./walletConnect/WC2";
import { ToastAndroid } from "react-native";

export default function TestSc() {
  const navigation = useNavigation();

  const {
    url,
    WC_Connector,
    StopAction,
    Connected,
    Session,
    page,
    type,
    payload,
    version,
    Type_Emit,
    Address,
    from,
    chain,
    topic,
    Loader, All_Session
  } = useSelector((state) => state.wcreducer);
  console.log("All_Session", All_Session);
  // const { wallet, index } = useSelector((state) => state.fiatDataReducer);
  const wallet = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );
  console.log("walletInTestsc", JSON.stringify(wallet, null, 2));
  /** Walletconnect *
  /** Connecting Wallet From any Screen */
  var comecheck = true;
  console.log("url", url);
  useFocusEffect(

    useCallback(() => {
      (async () => {

        try {
          // if(connector){

          if (url) {
            if (url?.includes('relay')) {
              try {
                return await pair(connector, url);
              } catch (e) {
                Toastfn("Re-Open WalletConnect");
                console.error("ewqewqewq", e.toString());
              }
            }
            else if (url?.includes('request')) {
              console.log("resqwq", url)
              // transaction_methods(connector)
            }
          }
          // else{

          console.log("hie")
          var data = connector ? connector : await connect_Wallet_WC2()
          var get_curre_session = getcurrensession_WC2()
          console.log("get_curre_session", url, get_curre_session)
          dispatch({
            type: "Session",
            data: { All_Session: get_curre_session, WC_Connector: data },
          });
          // }
        } catch (e) {
          console.error("e in usefeedf", e.toString());
        }
      })();
    }, [connector, url, Loader])

  );
  useEffect(() => {
    if (
      !isEmpty(wallet) &&
      !isEmpty(Session?.lp) &&
      wallet.filter((iy) => iy.walletaddress != Session?.lp?.walletaddress)
    ) {
      Logout();
    }
  }, []);

  const AddressChainChanged = async (Address, chain, topic, Type_Emit) => {
    try {
      console.log("_>chainIddd", Address, chain, topic, Type_Emit);
      var updata = await connector.emitSessionEvent({
        topic,
        event: {
          name: Type_Emit,
          data: [Address],
        },
        chainId: `eip155:${Session?.chainId}`,
      });
      dispatch({
        type: 'Session',
        data: { Type_Emit: null, Address: null, chain: null }
      })
    } catch (e) {
      console.error("sssssss", e)
      Logout(connector); // important
    }
    // _UpdateSession_WC2(WC_Connector)
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (Type_Emit) {
      if (Type_Emit == "accountsChanged") {
        AddressChainChanged(Address, chain, topic, Type_Emit);
      } else if (Type_Emit == "chainChanged") {
        AddressChainChanged(Address, chain, topic, Type_Emit);
      }
    }
  }, [Type_Emit, topic]);

  const Update_walet = (data) => {
    dispatch({
      type: "Session",
      data: data,
    });
  };

  const transaction_methods = async (payload) => {
    try {
      console.log("payload", payload, All_Session, All_Session.filter(it => it.topic == payload.topic)[0])
      const method = payload?.params?.request?.method;
      console.log("aaaaaaaaaaaaaaaaaaaaaa", method);
      if (method) {
        switch (method) {
          case EIP155_SIGNING_METHODS.ETH_SIGN:
          case EIP155_SIGNING_METHODS.PERSONAL_SIGN: {
            dispatch({
              type: "page",
              data: {
                page: EIP155_SIGNING_METHODS.PERSONAL_SIGN,
                type: EIP155_SIGNING_METHODS_Name[
                  EIP155_SIGNING_METHODS.PERSONAL_SIGN
                ],
                payload: payload,
                current_session: All_Session.filter(it => it.topic == payload.topic)[0],
                Site_Detail: All_Session.filter(it => it.topic == payload.topic)[0]?.peer?.metadata,
                lp: wallet[0]
              },
            });
            navigation.navigate("SignPage");
            return;
          }
          case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
            dispatch({
              type: "page",
              data: {
                page: EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION,
                type: EIP155_SIGNING_METHODS_Name[
                  EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION
                ],
                payload: payload,
                current_session: All_Session.filter(it => it.topic == payload.topic)[0],
                Site_Detail: All_Session.filter(it => it.topic == payload.topic)[0]?.peer?.metadata,
                Session: { ...Session, ...{ lp: wallet[0] } }

              },
            });
            navigation.navigate("SignPage");
            return;

          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
            {
              dispatch({
                type: "page",
                data: {
                  page: EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION,
                  type: EIP155_SIGNING_METHODS_Name[
                    EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION
                  ],
                  payload: payload,
                },
              });
              // setRequestSession(requestSessionData);
              // setRequestEventData(requestEvent);
              // setSignTypedDataModal(true);
            }
            return;
        }
      }
    } catch (e) {
      console.error("Seitch", e);
    }
  };

  //   console.log("connector",connector)
  // useFocusEffect(
  useEffect(() => {
    try {
      // if (!isEmpty(connector)) {
      console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<Yes WC COnnected1>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

      connector.on("session_request", (payload) => {
        console.log("<<<<<<Lpd>>>>>", payload);
        return transaction_methods(payload);
      });
      connector.on("session_delete", () => {
        Logout();
        //console.log("sadasdas logout");
      });
      // WC_Connector.on("session_update", () => {
      //   //console.log("update=======================");
      // });
      connector.on('session_proposal', (proposal) => {
        console.log("propasad", proposal)
        return _ApproveSession_WC2(proposal)
      })


      // } else {
      //   console.log("No WC COnnected");
      // }
    } catch (e) {
      console.error("WC_CONNECTOR", e);
    }
  }, [
    Loader
  ]);
  //   // );

  const _ApproveSession_WC2 = async (payload, type) => {
    try {
      const { id, params } = payload;
      console.log("params", params);
      var namespaces = {};
      const { requiredNamespaces } = params;
      console.log("requiredNamespaces", requiredNamespaces);
      if (!isEmpty(wallet)) {
        const chainId =
          requiredNamespaces?.eip155?.chains[0].split("eip155:")[1];
        console.log("chainId11111111111111", chainId);
        if (chainId)
          var isChaindHere = (chainId == "50" || chainId == "51") ? wallet.filter(
            (it) => it.currency == "XDC"
          )
            :
            [wallet[0]]
        {
          console.log("payload?.params?.proposer", isChaindHere)
          if (chainId && isChaindHere.length > 0) {
            namespaces["eip155"] = {
              accounts: [
                `${requiredNamespaces?.eip155?.chains[0]}:${isChaindHere[0]?.walletaddress}`,
              ],
              methods: requiredNamespaces["eip155"].methods,
              events: requiredNamespaces["eip155"].events,
            };
            var outt = {
              Site_Detail: payload?.params?.proposer?.metadata,
              All_Session: [payload],
              Session: {
                lp: isChaindHere[0],
                autoSign: false,
                connector: WC_Connector,
                walletaddress: isChaindHere[0]?.walletaddress,
                Wallet: WC_Connector,
                payload: payload,
                chainId: chainId,
                version: "V2",
                namespaces: namespaces,
              },
            };
            // console.log("<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>", outt);
            Update_walet(outt);
            return navigation.navigate("ApprovePage");
          } else {
            Toastfn("Network is not Available in wallet")
            return _rejectsession(payload.id, GetWalletType(chainId), "V2");
          }
        }
      } else {
        //console.log("Wallet not found");
      }
    } catch (e) {
      console.error("Error in Apprve", e);
      return false
    }
  };
  const _UpdateSession_WC2 = async (get_curre_session, type) => {
    try {

      var payload = get_curre_session;
      console.log("payload", payload)
      try {
        var data = await connector.updateSession(get_curre_session);
      } catch (e) {
        console.error(e, "<<<asadsa>>>");
      }
      const { id, requiredNamespaces } = payload;
      var namespaces = {};
      const chainId =
        requiredNamespaces?.eip155?.chains[0].split("eip155:")[1];
      if (chainId && !isEmpty(wallet)) {
        if (chainId)
          var isChaindHere = wallet.filter(
            (it) => it.currency == GetWalletType(chainId)
          );
        {
          if (isChaindHere.length > 0) {
            namespaces["eip155"] = {
              accounts: [
                `${requiredNamespaces?.eip155?.chains[0]}:${isChaindHere[0]?.walletaddress}`,
              ],
              methods: requiredNamespaces["eip155"].methods,
              events: requiredNamespaces["eip155"].events,
            };
            var outt = {
              Connected: true,
              Loader: false,
              time: new Date(),
              topic: payload?.topic,
              WC_Connector: connector,
              StopAction: false,
              Site_Detail: payload?.peer?.peerMeta,
              Session: {
                lp: isChaindHere[0],
                autoSign: false,
                connector: WC_Connector,
                walletaddress: isChaindHere[0]?.walletaddress,
                Wallet: WC_Connector,
                payload: payload,
                chainId: chainId,
                version: "V2",
                namespaces: payload.expiry,
              },
            };
            Update_walet(outt);
          } else {
            _rejectsession(payload.id, GetWalletType(chainId), "V2");
          }
        }
      }

    } catch (e) {
      console.error("Error in update", e);
    }
  };
  const _rejectsession = async (id, Network, version) => {
    dispatch({
      type: "Session",
      Loader: false,
    });
    await WC_Connector.rejectSession({
      id,
      reason: getSdkError("UNSUPPORTED_CHAINS"),
    });
    // ToastAndroid.showWithGravityAndOffset(
    Toastfn(`Switch ${Network} Wallet to Connect The DAPP`);
    //   ToastAndroid.LONG,
    //   ToastAndroid.BOTTOM,
    //   25,
    //   50
    // );
  };

  const Logout = async (connector, bool) => {
    try {

      if (!isEmpty(connector)) {
        dispatch({
          type: "initial",
        });
        if (!isEmpty(connector)) {
          Object.values((connector).getActiveSessions()).map((it) => {
            (connector).disconnectSession({
              topic: it.topic,
              reason: getSdkError("USER_DISCONNECTED"),
            });
          });
        }
        // Toastfn(`Session Disconnected`);
      }
      //   ToastAndroid.showWithGravityAndOffset(
      //     ToastAndroid.LONG,
      //     ToastAndroid.BOTTOM,
      //     25,
      //     50
      //   );


      // navigation.navigate("WalletConnect");
    } catch (e) {
      console.error("edsahdaskdas", e);
    }
  };

  /** Walletconnect */

  return <></>;
}
