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


    async performUpdate(table, url, dataFunction, idName, newItemGetsUuid = false) {
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
            
            if(newItemGetsUuid && !item.itemIdentifier){
                item.itemIdentifier = uuid();
             }
            await dy.putItem(item);
        });
    }



    async updateEvents(table, url){
        await this.performUpdate(table, url, fun.scraper.scrapeEvents, 'id');
    }

    async updateSponsors(table, url){
        await this.performUpdate(table, url, fun.scraper.scrapeSponsors, 'name', true);

    }

}

exports.cbnug = cbnug;