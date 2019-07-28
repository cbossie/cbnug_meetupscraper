const rp = require('request-promise');
const jsdom = require('jsdom');
const jquery = require('jquery');
const lo = require('lodash');
const df = require('dateformat');

async function scrapeItems(url, selector, map){
    if(!url || !map){
        return [];
    }
    let result = await rp.get(url);
    let dom = new jsdom.JSDOM(result);   
    var $ = jquery(dom.window);
    return lo.map($(selector), el => map($(el)));
}

async function scrapeEvents(url){
    return await scrapeItems(url, '.eventCard', e => {
        let event =  {
            id : e.attr('id').split('-')[1],
            serialdate : e.find('time').attr('datetime'),
            title : e.find('span').first().text()
        }
        let eventDate = new Date(Number(event.serialdate));
        event.date = df(eventDate, "m/d/yyyy");
        event.month = df(eventDate, 'm');
        event.day = df(eventDate, 'd');
        event.year = df(eventDate, 'yyyy')
        return event;
    })
}


async function scrapeSponsors(url){

    if(!url){
        return null;
    }

    return await scrapeItems(url, 'div.figureset', e =>{
        return {
            img : e.find('img').attr('src'),
            url : e.find('h3.big > a').attr('href'),
            name : e.find('h3.big > a').text()
        }
    });
}


exports.scraper = { scrapeSponsors, scrapeEvents };