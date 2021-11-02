import {ERC721} from "./contract/ERC721";

let mock = require("mock-require");
mock("@ethersproject/signing-key", "./signing-key");
import ethers = require("ethers");
import {parseTokenMetaData} from "./functions/TokenMetaData";
import {closeDB, initDB, insertTokenInfo, queryLastTokenInfo} from "./db/TokenDao";
import {BigNumber} from "ethers";

// const rpc_url: string = "https://rpc2.newchain.cloud.diynova.com";
const rpc_url: string = "https://cn.rpc.mainnet.diynova.com/";


const provider = new ethers.providers.JsonRpcProvider(rpc_url);

var contractAddress = "0x990B69BA2e8ad7f3bFAadC2B92BDcED9D9eaC86F"
const erc721Contract = new ethers.Contract(contractAddress, ERC721, provider);

async function getTokenMetaData(tokenId) {
    const tokenUri = await erc721Contract.tokenURI(tokenId)
    const tokenMetaData = await parseTokenMetaData(tokenUri)
    return tokenMetaData
}

async function getTokenMetaList(tokenIds: number[]) {
    for(let i = 0; i < tokenIds.length; i++) {
        let tokenId = tokenIds[i]
        let tokenMetaData = await getTokenMetaData(tokenId)
        console.log(tokenMetaData.tokenName)
    }
}

async function getTokenInfo(contractAddress, index) {
    const totalSupply = await erc721Contract.totalSupply() as BigNumber
    const totalNumber = parseInt(totalSupply._hex)
    for(let i = index; i < totalNumber; i++) {
        let tokenData = await getTokenMetaData(i)
        if(tokenData.tokenName != undefined && tokenData.tokenName.trim().length > 0) {
            let tokenNumber = tokenData.tokenName.split("#")[1]
            if(tokenNumber) {
                await insertToken(contractAddress, i.toString(), tokenData.tokenName, tokenNumber)
            }
        }
    }
}

async function insertToken(contractAddress, tokenId, tokenName, tokenNumber) {
    insertTokenInfo(contractAddress, tokenId, tokenName, tokenNumber)
}

async function start1() {
    await initDB()
    const res = await queryLastTokenInfo(function (res) {
            if(res.length > 0) {
                let index = res[0]['tokenId']
                getTokenInfo(contractAddress,parseInt(index) + 1)
            } else {
                getTokenInfo(contractAddress, 0)
            }
        }
    )
}

async function start2() {
    let res = await getTokenMetaList([1, 2])
}

async function do_work() {
    await start2()
}

do_work().catch(err => {
    console.log(err)
});




