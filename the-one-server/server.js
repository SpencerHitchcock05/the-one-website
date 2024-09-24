const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const app = express();
const PORT = 8000;

app.use(cors({
    origin: '*',
    methods: ['GET'],
}),)

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

app.get('/:name/img', (req, res) => {
    axios.get(`https://tolkiengateway.net/wiki/${req.params.name}`)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const imgPath = $(".image > img");
            const img = imgPath[0].attribs.src;
            res.json({img: 'https://tolkiengateway.net' + img});
        }).catch(err => {
            res.json({img: ''})
        })
})




app.listen(PORT, () => {
    console.log(`running on ${PORT}`);
})