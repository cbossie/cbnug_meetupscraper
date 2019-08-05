const fun = require('../scraper/scraper.js');
const db = require('../aws/dynamodb').DynamoDB;
const S3 = require('../aws/s3').S3;
const lo = require('lodash');
const uuid = require('uuid/v1');
const async = require('async');
const axios = require('axios');

class cbnug {

    constructor(config){
        this.config = Object.assign({
            region: 'us-east-1'
        }, config)
    }

    async uploadImage(bucket, url, identifier, name, table) {
        let s3 = new S3(bucket);
        let dy = new db(new db(this.config.region, table));
        let extension = lo.last(lo.split(url, '.'));
        let fileName = `${identifier}.${extension}`;
        if(await s3.objectExists(fileName)){
            console.log(`Item ${fileName} already exists in s3.`);
            return;
        }
        
        let img = await axios({
            method:'get',
            url:url,
            responseType:'arraybuffer'
        });
        let contentType = (extension === 'jpeg' ? 'image/jpeg' : 'application/octet-stream');

        let binary = Buffer.from(img.data);
        try
        {
            console.log(`Attempting to put object ${fileName} into bucket ${bucket}`);
            await s3.putObject(fileName, binary, contentType);
        }
        catch(err) {
            console.log(`Error uploading image ${fileName} to ${bucket}`);
        }
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
                item = Object.assign(existingItem, item);
            }
            
            if(newItemGetsUuid && !item.itemIdentifier){
                item.itemIdentifier = uuid();
             }
            await dy.putItem(item);
        });
    }


    async updateGroup(table, url, groupName){
        await this.performUpdate(table, url, async u => 
            {
                let item = await fun.scraper.scrapeGroup(u, groupName);
                return item;
            } ,'name')
    }

    async updateEvents(table, url){
        await this.performUpdate(table, url, fun.scraper.scrapeEvents, 'id');
    }

    async updateSponsors(table, url){
        await this.performUpdate(table, url, fun.scraper.scrapeSponsors, 'name', true);

    }

}

exports.cbnug = cbnug;