const fun = require('../scraper/scraper.js');
const db = require('../aws/dynamodb').DynamoDB;
const lo = require('lodash');
const uuid = require('uuid/v1');
const async = require('async');

class cbnug {

    constructor(config){
        this.config = Object.assign({
            region: 'us-east-1'
        }, config)
    }


    async performUpdate(table, url, dataFunction, idName) {
        let dy = new db(this.config.region, table);
        let itemData = await dataFunction(url);
        let allData = await dy.getAll();       

        await async.forEach(allData.Items,async item => {
            if(!lo.some(itemData, i => i[idName] == item[idName])){
            await dy.delete(item[idName]);
                console.log(`Deleted item ${item.name}`);
            }
        });

        await async.forEach(itemData, async item => {
            let existingItem = lo.find(allData.Items, i => i[idName] == item[idName]);
            if(existingItem)
            {
                console.log(`Found item ${existingItem[idName]}... updating.`);
                item = Object.assign(item, existingItem);
            }
            await dy.putItem(item);
        });
    }



    async updateEvents(table, url){
       let dy = new db(this.config.region, table);
        let eventData = await fun.scraper.scrapeEvents(url);

        let allData = await dy.getAll();
        // Delete items not in the table

        await async.forEach(allData.Items,async item => {
            if(!lo.some(eventData, i => i.id == item.id)){
            await dy.delete(item.id);

                console.log(`Deleted item ${item.name}`);
            }
        });

        await async.forEach(eventData, async item => {
            let existingItem = lo.find(allData.Items, i => i.id == item.id);
            if(existingItem)
            {
                console.log(`Found item ${existingItem.id}... updating.`);
                item = Object.assign(item, existingItem);
            }
            await dy.putItem(item);
        });

        
    }

    async updateSponsors(table, url){
        let dy = new db(this.config.region, table)
        let sponsorData = await fun.scraper.scrapeSponsors(url);

        let allData = await dy.getAll();

        // Delete items not in the table

        await async.forEach(allData.Items,async item => {
            if(!lo.some(sponsorData, i => i.name === item.name)){
            await dy.delete(item.name);

                console.log(`Deleted item ${item.name}`);
            }
        });
        


        await async.forEach(sponsorData, async item => {
            let existingItem = lo.find(allData.Items, i => i.name === item.name);
            if(existingItem)
            {
                console.log(`Found item ${existingItem.name}... updating.`);
                item = Object.assign(item, existingItem);
            }
            else
            {
                item.identifier = uuid();
                console.log(`Inserting item ${item.name} with ID ${item.identifier}`);
            }

            await dy.putItem(item);
        });

    }

}

exports.cbnug = cbnug;