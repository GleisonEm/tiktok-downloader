const fetch = require("node-fetch");
const fs = require("fs");
const { exit } = require("process");
const { resolve } = require("path");
const { reject } = require("lodash");
const { Headers } = require('node-fetch');


//adding useragent to avoid ip bans
const headers = new Headers();
headers.append('User-Agent', 'TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet');
const headersWm = new Headers();
headersWm.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36');

const getVideoWM = async (url) => {
    const idVideo = await getIdVideo(url)
    const API_URL = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${idVideo}`;
    const request = await fetch(API_URL, {
        method: "GET",
        headers: headers
    });
    const body = await request.text();
    try {
        var res = JSON.parse(body);
    } catch (err) {
        console.error("Error:", err);
        console.error("Response body:", body);
    }
    const urlMedia = res.aweme_list[0].video.download_addr.url_list[0]
    const data = {
        url: urlMedia,
        id: idVideo
    }
    return data
}

const getVideoNoWM = async (url) => {
    const idVideo = await getIdVideo(url)
    const API_URL = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${idVideo}`;
    const request = await fetch(API_URL, {
        method: "GET",
        headers: headers
    });
    const body = await request.text();
    try {
        var res = JSON.parse(body);
    } catch (err) {
        console.error("Error:", err);
        console.error("Response body:", body);
    }
    const urlMedia = res.aweme_list[0].video.play_addr.url_list[0]
    const data = {
        url: urlMedia,
        id: idVideo
    }
    return data
}

const getIdVideo = (url) => {
    const matching = url.includes("/video/")
    if (!matching) {
        exit();
    }
    const idVideo = url.substring(url.indexOf("/video/") + 7, url.length);
    return (idVideo.length > 19) ? idVideo.substring(0, idVideo.indexOf("?")) : idVideo;
}

const download = async (item) => {
    console.log(item)
    const folder = "downloads/"
    const fileName = `${item.id}.mp4`
    const downloadFile = fetch(item.url)
    const file = fs.createWriteStream(folder + fileName)

    downloadFile.then(res => {
        res.body.pipe(file)
        file.on("finish", () => {
            file.close()
            resolve()
        });
        file.on("error", (err) => reject(err));
    });
}

const downloadBase64 = async (item) => {
    const folder = "downloads/";

    // Certifique-se de que 'list' está definido em algum lugar do seu código
    const fileName = `${item.id}.txt`; // Alterei a extensão para .txt, mas você pode ajustar conforme necessário
    const downloadFile = fetch(item.url);

    downloadFile.then(async (res) => {
        const fileBuffer = await res.buffer();
        const base64Data = fileBuffer.toString('base64');

        fs.writeFileSync(folder + fileName, base64Data, 'base64');
        console.log(`File ${fileName} saved successfully.`);
    }).catch((err) => {
        console.error(`Error downloading file: ${err}`);
    });
}

module.exports = { getVideoNoWM, getVideoWM, download, downloadBase64 }
