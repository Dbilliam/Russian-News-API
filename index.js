const PORT = process.env.PORT || 8000

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')


const app = express()


const newscategory = [
    {
        name: 'home',
        address: 'https://www.themoscowtimes.com/',
        base:''
    },

    {
        name: 'business',
        address: 'https://www.themoscowtimes.com/business',
        base:''
    },
    {
        name: 'news',
        address: 'https://www.themoscowtimes.com/news',
        base:''
    },
    {
        name: 'meanwhile',
        address: 'https://www.themoscowtimes.com/meanwhile',
        base:''
    },
    {
        name: 'climate',
        address: 'https://www.themoscowtimes.com/climate',
        base:''
    },
    {
        name: 'arts',
        address: 'https://www.themoscowtimes.com/arts-and-life',
        base:''
    },
    {
        name: 'opinion',
        address: 'https://www.themoscowtimes.com/opinion',
        base:''
    },
    {
        name: 'indepth',
        address: 'https://www.themoscowtimes.com/in-depth',
        base:''
    },
    {
        name: 'russia',
        address: 'https://www.themoscowtimes.com/ru',
        base:''
    }

]


const articles = []

newscategory.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a', html).each(function () {
                const title = $(this).find('.article-excerpt-default__headline').text().trim() || $(this).text() || null
                const image = $(this).find('img').attr('src') || null
                const description = $(this).find('.article-excerpt-default__teaser').text() || null
                const url = $(this).attr('href') || null
                
                articles.push({
                    title,
                    description,
                    image,
                    url,
                    source: newspaper.name
                })
            })
    })
})
app.get('/', (req, res) => {
    res.json('Welcome to Russian NEWS API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})




app.get('/news/:newspaperId',(req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress =  newscategory.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase =  newscategory.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a', html).each(function () {
                const title =  $(this).find('.article-excerpt-default__headline').text().trim() || $(this).text() ||  null
                const image = $(this).find('img').attr('src') || null
                const description = $(this).find('.article-excerpt-default__teaser').text()  || $(this).text()  || null
                const url = $(this).attr('href') || $(this).text() || null
                    specificArticles.push({
                    title,
                    description,
                    image,
                    url: newspaperBase + url,
                    source:newspaperId
                })
            })
     
            res.json( specificArticles)
    }).catch((err) => console.log(err))

}) 


app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`))