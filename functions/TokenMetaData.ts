import {GetUriProtocol, UriResolver} from "./UriResolve";

const request  = require('request-promise');

export class TokenMetaData {
    tokenName: string = ''
    tokenDescription: string = ''
    nftType: string = 'image'
    tokenImage: string = ''
    tokenVideo: string = ''
}


export async function getInfo(url) {
    try {
        if (url.startsWith('data:application/json;base64,')) {
            let data = url.split('data:application/json;base64,')[1]
            return JSON.parse(decodeURIComponent(escape(atob(data))))
        }
        return await request.get(url).json()
    } catch (e) {
        console.log(e)
    }
}

export async function parseTokenMetaData(uri): Promise<TokenMetaData> {
    const data = new TokenMetaData()
    try {
        const resolverUrl = UriResolver(uri)
        const tokenExtraInfo = await getInfo(resolverUrl)
        if (!tokenExtraInfo) {
            return data
        }
        if(!tokenExtraInfo.name) {
            data.tokenName = tokenExtraInfo.name
        }
        // Video Support, using `video` key
        if (tokenExtraInfo.video !== undefined) {
            const _videoUri = UriResolver(tokenExtraInfo.video.substring(tokenExtraInfo.video.lastIndexOf('/') + 1))
            data.nftType = 'video'
            data.tokenVideo = _videoUri
        }

        // TBD: support for `media`:[], mime:video|audio|image/type
        // TBD: tag
        // TBD: attributes

        if (tokenExtraInfo.description !== undefined) {
            data.tokenName = tokenExtraInfo.name
        }

        if (tokenExtraInfo.image !== undefined) {
            const protocol = GetUriProtocol(tokenExtraInfo.image)
            if (protocol === 'http' || protocol === 'https' || protocol === 'base64') {
                data.tokenImage = tokenExtraInfo.image
            } else {
                const imageUri = UriResolver(tokenExtraInfo.image.substring(tokenExtraInfo.image.lastIndexOf('/') + 1))
                data.tokenImage = imageUri
            }
        }

        if (tokenExtraInfo.description !== undefined) {
            data.tokenDescription = tokenExtraInfo.description
        }
        return data
    } catch (e) {
        console.error(e)
        return data
    }
}