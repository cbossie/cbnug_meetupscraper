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

async function scrapeEvents2(url){
    return await scrapeItems(url, '.eventCard', e => {
        let event =  {
            id : e.attr('id').split('-')[1],
            serialdate : e.find('time').attr('datetime'),
            title : e.find('span').first().text()
        }
        event.eventDate = new Date(Number(event.serialdate));
        event.month = df(event.eventDate, 'm');
        event.day = df(event.eventDate, 'd');
        event.year = df(event.eventDate, 'yyyy')
        return event;
    })
}

async function scrapeEvents(url){
    if(!url){
        return null;
    }

    let result = await rp.get(url);
    let dom = new jsdom.JSDOM(result);   
    var $ = jquery(dom.window);

    let scheduleElements = $('.eventCard');
    let events = lo.map(scheduleElements, function(el){
        let e = $(el);
        let event =  {
            id : e.attr('id').split('-')[1],
            serialdate : e.find('time').attr('datetime'),
            title : e.find('span').first().text()
        }
        event.eventDate = new Date(Number(event.serialdate));
        event.month = df(event.eventDate, 'm');
        event.day = df(event.eventDate, 'd');
        event.year = df(event.eventDate, 'yyyy')
        return event;

    });
    return events;
}

async function scrapeSponsors(url){

    if(!url){
        return null;
    }

     let result = await rp.get(url);
     let dom = new jsdom.JSDOM(result);   
     var $ = jquery(dom.window);
     let sponsorElements = $('div.figureset');

    let sponsors = lo.map(sponsorElements, function(el){
        let e = $(el);
        return {
        img : e.find('img').attr('src'),
        url : e.find('h3.big > a').attr('href'),
        name : e.find('h3.big > a').text()
        }
    })

    return sponsors;
}


exports.scraper = { scrapeSponsors, scrapeEvents, scrapeEvents2 };