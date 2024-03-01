
import { Image } from 'react-native-elements';
import Web3 from 'web3';
import React from 'react';
import { Images } from '../../utils/Images';
import { ApiConstants } from '../../api/ApiConstants';
import SvgUri from 'react-native-svg-uri';
export const useWeb3WithRPC = (httpProvider) => {
    var web3 = new Web3(httpProvider);
    return web3
}

export const CHAINS = ApiConstants.Chains

export const CHAIN_INFO = [
    // {
    //     img: <Images.EthLogo width={40} height={40} />,
    //     name: ApiConstants.eth_network,
    //     hex: parseInt(ApiConstants.eth_chainId).toString(16),
    //     chainId: ApiConstants.eth_chainId,
    //     rpc : "https://mainnet.infura.io/v3/be5bdb23c61c4b92b174cb569e57f7b2",
    //     currency:'ETH'
    //  },
    //   {
    //      img: <Images.BNB width={40} height={40} />,
    //      name: ApiConstants.bnb_network,
    //      hex: parseInt(ApiConstants.bnb_chainId).toString(16),
    //      chainId: ApiConstants.bnb_chainId,
    //     rpc : "https://bsc-dataseed1.binance.org/",
    //     currency:'BNB'


    //   },

    //   {
    //     img: <Image source={Images['wrc']} style={{ width: 40, height: 40 }} />,
    //     name: ApiConstants.wan_network,
    //     hex: parseInt(ApiConstants.wan_chainId).toString(16),
    //     chainId: ApiConstants.wan_chainId,
    //     rpc : "https://gwan-ssl.wandevs.org:56891",
    //     currency:'WAN'


    //  },
    //  {
    //     img: <Image source={Images['xrc']} style={{ width: 40, height: 40 }} />,
    //     name: ApiConstants.xdc_network,
    //     hex: parseInt(ApiConstants.xdc_chainId).toString(16),
    //     chainId: ApiConstants.xdc_chainId,
    //     rpc : "https://xdcpayrpc.blocksscan.io",
    //     currency:'XDC'


    //  },
    {
        img: <Images.EthLogo width={23} height={23} />,
        name: "Ethereum",
        hex: parseInt(ApiConstants.eth_chainId_l).toString(16),
        chainId: ApiConstants.eth_chainId_l,
        rpc: "https://mainnet.infura.io/v3/be5bdb23c61c4b92b174cb569e57f7b2",
        // rpc: "https://sepolia.infura.io/v3/50c7d1be83794ae0a3e74eab40b74373",
        currency: 'ETH'


    },
    {
        img: <Image source={{ uri: Images.BNB }} style={{ width: 23, height: 23 }} />,
        name: "Binance",
        hex: parseInt(56).toString(16),
        chainId: 56,
        // rpc: "https://data-seed-prebsc-2-s1.binance.org:8545/",
        rpc: "https://bsc-dataseed1.binance.org/",
        currency: 'BNB'


    },
    {
        img: <Images.mat width={22} height={22} />,
        name: "Matic",
        hex: parseInt(137).toString(16),
        chainId: 137,
        rpc: "https://polygon-rpc.com/",
        currency: 'MAT'


    },
    {
        img: <Images.mat width={22} height={22} />,
        name: ApiConstants.polygon_network,
        hex: parseInt(ApiConstants.polygon_chainId).toString(16),
        chainId: ApiConstants.polygon_chainId,
       rpc : "https://polygon-mumbai-bor.publicnode.com",
       currency:'MAT'
     },
    //  {
    //    img: <Image source={Images['wrc']} style={{ width: 40, height: 40 }} />,
    //    name: ApiConstants.wan_network_l,
    //    hex: parseInt(ApiConstants.wan_chainId_l).toString(16),
    //    chainId: ApiConstants.wan_chainId_l,
    //    rpc : "https://gwan-ssl.wandevs.org:46891/",
    //    currency:'WAN'

    // },
    // {
    //    img: <Image source={Images['xrc']} style={{ width: 40, height: 40 }} />,
    //    name: ApiConstants.xdc_network_l,
    //    hex: parseInt(ApiConstants.xdc_chainId_l).toString(16),
    //    chainId: ApiConstants.xdc_chainId_l,
    //    rpc : "https://apothemxdcpayrpc.blocksscan.io/",
    //    currency:'XDC'


    // },
]
