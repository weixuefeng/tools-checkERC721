import {ERC721} from "./contract/ERC721";

let mock = require("mock-require");
mock("@ethersproject/signing-key", "./signing-key");
import ethers = require("ethers");
import {parseTokenMetaData} from "./functions/TokenMetaData";

// const rpc_url: string = "https://rpc2.newchain.cloud.diynova.com";
const rpc_url: string = "https://cn.rpc.mainnet.diynova.com/";


const provider = new ethers.providers.JsonRpcProvider(rpc_url);

const contractAddress = "0x990B69BA2e8ad7f3bFAadC2B92BDcED9D9eaC86F"
const erc721Contract = new ethers.Contract(contractAddress, ERC721, provider);

async function getTokenUri() {
    const tokenUri = await erc721Contract.tokenURI(1)
    const tokenMetaData = await parseTokenMetaData(tokenUri)
    console.log(tokenMetaData)
}

async function do_work() {
    getTokenUri()
}

do_work().catch(err => {
    console.log(err)
});



