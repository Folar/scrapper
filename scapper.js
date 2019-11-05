const glenngrp = "https://www.meetup.com/Intellectual-Conversation-Group/";
const axios = require("axios");
const cheerio = require("cheerio");
const Nexmo = require('nexmo');
var moment = require('moment');
var fs =require("fs");  // file system

let kws =["Judy"];
let links = [];
function fileread(filename){

    var contents= fs.readFileSync(filename);
    return contents;
}

const fetchData = async (siteUrl,keyWrds) => {
    const result = await axios.get(siteUrl);
    return [cheerio.load(result.data),keyWrds];
};

let linkstr = fs.readFileSync("./linkids.txt",'utf8').split('\n')[0];
links = linkstr.split(",");


const nexmo = new Nexmo({
    apiKey: 'xxx',
    apiSecret: 'xxxxPaop',
});

const from = '19093081147';
const to = '16502244155';
const text = 'Hello from Nexmo';
let  msg = null;
function parsePage(data){
    let $ = data[0]
    let keys = data[1];
    const nodes = $('.eventCard--link > .visibility--a11yHide');

    for (let i =0; i < nodes.length;i++) {
        let node = nodes[i];
        const href = node.parent.attribs.href;
        let linkid = href.split("/")[3];
        const txt = node.children[0].data;
        for (let j in keys) {
            if (txt.includes(keys[j]) ||( keys.length == 1 && keys[j] == '*')) {
                if(!links.includes(linkid)) {
                    linkstr = linkstr + "," + linkid;
                    fs.writeFileSync("./linkids.txt",linkstr);
                    if (msg == null) {
                        msg = moment(new Date()).format( 'YYYY-MM-DD HH:mm');
                    }
                    nexmo.message.sendSms(from, to,msg +  ":" + txt);
                }
            }
        }
    }

}


fetchData(glenngrp,kws).then((data) => {
    parsePage(data)
}).catch(function (err) {
    console.log(err)
    return;
});
fetchData("https://www.meetup.com/Dine-with-us-Dinner-and-Brunch-for-singles/",['*']).then((data) => {
    parsePage(data)
}).catch(function (err) {
    console.log(err)
    return;
});
