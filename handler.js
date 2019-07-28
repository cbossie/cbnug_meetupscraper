const cbnug = require("./cbnug/cbnug").cbnug;
const url = process.env.URL;
const table = process.env.TABLE;

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
