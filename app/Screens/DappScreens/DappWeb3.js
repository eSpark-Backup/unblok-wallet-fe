import axios from "axios"
export const Web3File = async() => {
   // return alert("test")
   const web3Content = await axios.get("https://cdnjs.cloudflare.com/ajax/libs/web3/1.2.7/web3.js");
   return web3Content;
}

export const EtherFile = async() => {
    // return alert("test")
    const web3Content = await axios.get("https://cdnjs.cloudflare.com/ajax/libs/ethers/6.3.0/ethers.js");
    return web3Content;
 }