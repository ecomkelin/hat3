const axios = require("axios");


module.exports = ({ provider = "weixin", providerToken }) => new Promise(async (resolve, reject) => {
    try {
        if (!providerToken) return reject(`使用 [${provider}] 登录 请传入 客户 对应的 平台的 token`);
        provider = provider.toLowerCase();

        // 根据 登录类型 和 第三方token 获取第三方社交账号的登录结果
        let providerData = null;
        if (provider === "weixin") {
            // console.log(providerToken);
            providerData = await weixinAuth_Prom(providerToken);
        } else if (provider === "google") {
            // console.log("google");
            providerData = await googleAuth_Prom(providerToken);
        } else if (provider === "facebook") {
            // console.log("facebook");
            providerData = await facebookAuth_Prom(providerToken);
        } else if (provider === "apple") {

        }
        if (providerData) return resolve(providerData);
        return reject("平台登录失败")
    } catch (e) {
        return reject(e);
    }
})



let OAuth2Client = null;
const googleAuth_Prom = async (providerToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const audience = process.env.GOOGLE_APPID;
            const idToken = providerToken;

            // const { OAuth2Client } = require('google-auth-library');
            if (!OAuth2Client) OAuth2Client = require('google-auth-library').OAuth2Client;
            const client = new OAuth2Client(audience);
            const ticket = await client.verifyIdToken({
                idToken,
                audience,
            });
            const providerPayload = ticket.getPayload();
            return resolve({ providerPayload, providerId: providerPayload['sub'] })
        } catch (error) {
            console.log("[googleAuth_Prom]", error);
            return reject("google sign fail");
        }
    })
}


const facebookAuth_Prom = async (providerToken) => {
    console.log("/facebookAuth");
    return new Promise(async (resolve, reject) => {
        try {
            const appId = process.env.FB_APPID;
            const appSecret = process.env.FB_APPSECRET
            const input_token = providerToken;

            const url = `https://graph.facebook.com/debug_token?access_token=${appId}%7C${appSecret}&input_token=${input_token}`;
            const response = await axios.get(url);
            const providerPayload = response.data.data;

            return resolve({ providerPayload, providerId: providerPayload.user_id });
        } catch (error) {
            console.log("[facebookAuth_Prom]", error);
            return reject("facebook sign fail");
        }
    })
}

const weixinAuth_Prom = async (providerToken) => {
    // console.log("/weixinAuth");
    return new Promise(async (resolve, reject) => {
        try {
            const appId = process.env.WX_APPID;
            const secret = process.env.WX_APPSECRET;
            const js_code = providerToken;

            const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`;
            const response = await axios.get(url);
            // console.log("weixin", response.data);
            // {
            //     session_key: 'V02NJrJ2NS+pPQd8nhR5ow==',
            //     openid: 'onVOp5DAYwqfGD99PC3gIl98gass'
            // }
            const providerPayload = response.data;
            return resolve({ providerPayload, providerId: providerPayload.openid });
        } catch (error) {
            console.log("[weixinAuth_Prom]", error);
            return reject("weixin sign fail");
        }
    })
}