import {ERC721} from "./contract/ERC721";

let mock = require("mock-require");
mock("@ethersproject/signing-key", "./signing-key");
import ethers = require("ethers");
import {parseTokenMetaData} from "./functions/TokenMetaData";
import {closeDB, initDB, insertTokenInfo} from "./db/TokenDao";
import {BigNumber} from "ethers";

// const rpc_url: string = "https://rpc2.newchain.cloud.diynova.com";
const rpc_url: string = "https://cn.rpc.mainnet.diynova.com/";


const provider = new ethers.providers.JsonRpcProvider(rpc_url);

const contractAddress = "0x990B69BA2e8ad7f3bFAadC2B92BDcED9D9eaC86F"
const erc721Contract = new ethers.Contract(contractAddress, ERC721, provider);

async function getTokenMetaData(tokenId) {
    const tokenUri = await erc721Contract.tokenURI(tokenId)
    const tokenMetaData = await parseTokenMetaData(tokenUri)
    return tokenMetaData
}

async function getTokenInfo() {
    const totalSupply = await erc721Contract.totalSupply() as BigNumber
    const totalNumber = parseInt(totalSupply._hex)
    for(let i = 0; i < totalNumber; i++) {
        let tokenData = await getTokenMetaData(i)
        if(tokenData.tokenName != undefined && tokenData.tokenName.trim().length > 0) {
            let tokenNumber = tokenData.tokenName.split("#")[1]
            if(tokenNumber) {
                console.log(contractAddress, i.toString().trim(), tokenData.tokenName, tokenNumber)
                await insertToken(contractAddress, i.toString(), tokenData.tokenName, tokenNumber)
            }
        }
    }
}

async function insertToken(contractAddress, tokenId, tokenName, tokenNumber) {
    insertTokenInfo(contractAddress, tokenId, tokenName, tokenNumber)
}


async function do_work() {
    initDB()
    await getTokenInfo()
    closeDB()

}

do_work().catch(err => {
    console.log(err)
});



