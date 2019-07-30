const cbnug = require("./cbnug/cbnug").cbnug;
const url = process.env.URL;
const table = process.env.TABLE;
const bucket = process.env.BUCKET;
const async = require("async");
const lo = require('lodash').get;

const processImage = async(event, context) => {
    console.log('Event:');
    console.log(JSON.stringify(event, null, 2));
    let cb = new cbnug({});

    if(event.Records){
        await async.forEach(event.Records, async rec => {
            let id = lo(rec, ['dynamodb', 'NewImage', 'itemIdentifier', 'S']);
            let img = lo(rec, ['dynamodb', 'NewImage', 'img','S']);
            let name = lo(rec, ['dynamodb', 'NewImage', 'name','S']);
            if(img && id){
                console.log(`Uploading image ${img} with id=${id} to bucket ${bucket}`);
                await cb.uploadImage(bucket, img, id, name, this.table);
            }
        });
    }
};

const updateSponsors = async (event, context) => {
    let cb = new cbnug({});
    await cb.updateSponsors(table,url);
    return 0;
};

const updateEvents = async (event, context) => {
    let cb = new cbnug({});
    await cb.updateEvents(table, url);
    return 0;
};

exports.updateSponsors = updateSponsors;
exports.updateEvents = updateEvents;
exports.processImage = processImage;