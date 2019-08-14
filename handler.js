const cbnug = require("./src/cbnug").cbnug;
const url = process.env.URL;
const table = process.env.TABLE;
const bucket = process.env.BUCKET;
const group = process.env.GROUP_NAME;
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
                try {
                    console.log(`Uploading image ${img} with id=${id} to bucket ${bucket}`);
                    await cb.uploadImage(bucket, img, id, name, table);
                
                } catch(err)
                {
                    console.log(`Error uploading image ${img} with id=${id} to bucket ${bucket}`);
                    console.log(err);
                }

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

const updateGroup = async(event, context) => {
    let cb = new cbnug({});
    await cb.updateGroup(table, url, group);
    return 0;

};

module.exports.updateSponsors = updateSponsors;
module.exports.updateEvents = updateEvents;
module.exports.processImage = processImage;
module.exports.updateGroup = updateGroup;