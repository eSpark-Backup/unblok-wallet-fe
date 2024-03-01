import web3utils from 'web3-utils'  

export const covert18 = async (data) => {
    try {
        var con = web3utils.fromWei(String(data));
        return con
    } catch (error) {
        console.log("erroor on convert",error );
    }
}