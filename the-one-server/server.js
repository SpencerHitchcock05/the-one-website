import express from 'express';
import axios from 'axios';
import cors from 'cors';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const app = express();
const PORT = 8000;

app.use(cors({
    origin: '*',
    methods: ['GET'],
}),)

puppeteer.use(StealthPlugin());

async function fetchPage(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, {
    waitUntil: "networkidle2"
    });

    const html = await page.content();
    await browser.close();

    return html
}

app.get('/:name', (req, res) => {
    axios.get(`https://lotr.fandom.com/wiki/${req.params.name}`) //document.querySelector("#mw-content-text > div > p:nth-child(6)")
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            let texts = [];
            for (let i = 0; texts.length <= 3 && i < 20; i++) {
                let txt = $(`#mw-content-text > div > p:nth-child(${i})`).text();
                if (txt && txt != '\n') {
                    texts.push(txt);
                }
            }
            
            res.json({text: texts});
        })
        .catch(() => {
            res.json({err: true});
        })
    
})

app.get('/:name/img', async (req, res) => {
    const html = await fetchPage(`https://tolkiengateway.net/wiki/${req.params.name}`);
    const $ = cheerio.load(html);
    const imgPath = $(".mw-file-description img");
    const img = imgPath[0].attribs.src;
    res.json({img: 'https://tolkiengateway.net' + img});
})


app.listen(PORT, () => {
    console.log(`running on ${PORT}`);
})