import { randomInt } from "crypto";

const MAX_X = 256
const MAX_Y = 256
const MIN_X = -256
const MIN_Y = -256
const START_X = 103
const START_Y = 103

function isMintArea (x, y) {
    return x >= 103 && y >= 103 && x <= 256 && y <= 256;
}


function isMapBottom(x, y) {
    return y == -256
}

export function generateLandAndEstate() {
    let data = {}
    let estate = {}
    for(let x = START_X; x <= MAX_X; x ++) {
        for(let y = START_Y; y <= MAX_Y; y++) {
            let id = getEstatedId(100)
            let {key, info} = addInfo(x,y)
            data[key] = info
            if(id > 50) {
                let estateId = id.toString()
                if(!estate[estateId]) {
                    estate[estateId] = {}
                    estate[estateId]['name'] = "Estate";
                    estate[estateId]['description'] = "Estate description"
                    estate[estateId]['tokenURI'] = ""
                    estate[estateId]['lands'] = {}
                }
                estate[estateId]['lands'][key] = info;
                continue;
            }
        }
    }
    return {data, estate};
}

export function generateInfo() {
    let data = {}
    for(let x = START_X; x <= MAX_X; x ++) {
        for(let y = START_Y; y <= MAX_Y; y++) {
            let {key, info} = addInfo(x,y)
            data[key] = info
        }
    }
    data = extendRight(data)
    data = extendTop(data)
    data = extendBottom(data)
    data = extendLeft(data)
    return data
}

function addInfo(x, y) {
    let key = `${x},${y}`
    let info = {}
    let top = 0
    let left = 0
    let topLeft = 0
    if(!isMintArea(x, y)) {
        // top
        if(y == MAX_Y || (y == 102 && x >= 103)) {
            top = 0
        } else {
            top = 1
        }
        // left
        if(x == MIN_X) {
            left = 0
        } else {
            left = 1
        }
        // top left
        if(x == MIN_X || y == MAX_Y || (y == 102 && x >= 103)) {
            topLeft = 0
        } else {
            topLeft = 1
        }
    }
    //  -1 不可购买 0 没有 mint（可购买） 1已经mint
    info["x"] = x;
    info["y"] = y;
    info["owner"] = gerRandomOwner();
    info['type'] = isMintArea(x, y) ? 2 : 1
    info['top'] = top
    info['left'] = left
    info['topLeft'] = topLeft
    return {key, info}
}


function getEstatedId(number) {
    return randomInt(number)
}

function extendRight2(data) {

}

function extendRight(data) {
    const min = 50;
    const max = min + 15;
    const startY = -256;
    const endY = 256;
    const startX = 256;
    for(let i = startY; i <= endY; i++) {
        let j  = min + randomInt(max - min)
        for(let temp = 0; temp < j; temp++) {
            let x = startX + temp;
            let {key, info} = addInfo(x, i)
            data[key] = info;
        }
    }
    return data;
}

function extendLeft(data) {
    const min = 50;
    const max = min + 15;
    const startY = -256;
    const endY = 256;
    const startX = -256;
    for(let i = startY; i <= endY; i++) {
        let j  = min + randomInt(max - min)
        for(let temp = 0; temp < j; temp++) {
            let x = startX - temp;
            let {key, info} = addInfo(x, i)
            data[key] = info;
        }
    }
    return data;
}

function extendTop(data) {
    const min = 50;
    const max = min + 15;
    const startX = -256;
    const endX = 256;
    const startY = 256;
    for(let i = startX; i <= endX; i++) {
        let j  = min + randomInt(max - min)
        for(let temp = 0; temp < j; temp++) {
            let y = startY + temp;
            let {key, info} = addInfo(i, y)
            data[key] = info;
        }
    }
    return data;
}

function extendBottom(data) {
    const min = 50;
    const max = min + 15;
    const startX = -256;
    const endX = 256;
    const startY = -256;
    for(let i = startX; i <= endX; i++) {
        let j  = min + randomInt(max - min)
        for(let temp = 0; temp < j; temp++) {
            let y = startY - temp;
            let {key, info} = addInfo(i, y)
            data[key] = info;
        }
    }
    return data;
}





function gerRandomOwner() {
    let i = randomInt(10)
    let address = [
        "0x13e96a46a08ae692a4633472e6ab3cd68a91feb6",
        "0xc6d79ad9649b93f775c00ec554b67be04596935e",
        "0xac2e7f5ce5e2337724422f7d3e1d32005b3cc1ca",
        "0xe97e181be8463a96df4320ad620cf30be1f54f1c",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ]
    return address[i];
}