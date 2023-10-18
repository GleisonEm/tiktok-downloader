const { getVideoWM, downloadBase64, download } = require('../index.js');

console.log(new Date())
const url = 'https://www.tiktok.com/@giolucca/video/7272923944989052165'
const data = getVideoWM(url).then((data) => {

    // console.log(data)
    downloadBase64(data)
    console.log(new Date())
    // download(data)
    return data
})
