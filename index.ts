import {ERC721} from "./contract/ERC721";

let mock = require("mock-require");
mock("@ethersproject/signing-key", "./signing-key");
import ethers = require("ethers");
import {parseTokenMetaData} from "./functions/TokenMetaData";
import {closeDB, initDB, insertTokenInfo, queryLastTokenInfo, queryTokenIdByNumber} from "./db/TokenDao";
import {BigNumber} from "ethers";
import * as fs from "fs";
import assert from "assert";

// const rpc_url: string = "https://rpc2.newchain.cloud.diynova.com";
const rpc_url: string = "https://cn.rpc.mainnet.diynova.com/";
const outPutFile = "./tokenInfo.md"


const provider = new ethers.providers.JsonRpcProvider(rpc_url);

const contractAddress = "0x990B69BA2e8ad7f3bFAadC2B92BDcED9D9eaC86F"
const erc721Contract = new ethers.Contract(contractAddress, ERC721, provider);

async function getTokenMetaData(tokenId) {
    const tokenUri = await erc721Contract.tokenURI(tokenId)
    const tokenMetaData = await parseTokenMetaData(tokenUri)
    return tokenMetaData
}

async function getTokenInfo(index) {
    const totalSupply = await erc721Contract.totalSupply() as BigNumber
    const totalNumber = parseInt(totalSupply._hex)
    for(let i = index; i < totalNumber; i++) {
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

async function queryTokenId() {
    let allInfo = ""
    for(let num = 1; num < 4; num++) {
        allInfo += `#${num} `
        const {data, length} = await queryInfo(num)
        allInfo +=` ${length} 个\r\n`;
        allInfo += data + "\r\n";
    }
    await writeDataToFile(allInfo, outPutFile)
}


async function queryInfo(number){
    let data = "["
    let info = await queryTokenIdByNumber(number)
    let length = 0
    if(info instanceof Array) {
        length = info.length
        if(info.length > 0) {
            for(let i = 0; i < info.length; i++) {
                let tokenId = info[i]['tokenId']
                data += tokenId + ","
            }
            data = data.substring(0, data.length - 1) + "]" + "\r\n";
        } else {
            console.error("not found" + number)
        }
    }
    return {data, length}
}


async function writeDataToFile(content, fileName) {
    fs.promises.writeFile(fileName, content)
        .then(
            res => {
                console.log(`${fileName} write success`)
            }
        )
}


async function do_work() {
    console.log("gogogo")
    // await initDB()
    // const res = await queryLastTokenInfo(function (res) {
    //         if(res.length > 0) {
    //             let index = res[0]['tokenId']
    //             getTokenInfo(parseInt(index) + 1)
    //         } else {
    //             getTokenInfo(0)
    //         }
    //     }
    // )
    //closeDB()
    await queryTokenId()
}

do_work().catch(err => {
    console.log(err)
});



