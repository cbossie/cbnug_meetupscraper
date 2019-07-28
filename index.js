const cbnug = require('./cbnug/cbnug');

async function main(){
    
   let cb = new cbnug.cbnug({});
   await cb.updateSponsors('cbnug-sponsors-dev', 'https://www.meetup.com/CascoBayNUG/sponsors/');
await cb.updateEvents('cbnug-events-dev', 'https://www.meetup.com/awspug/events/');



}

main()
.then(
    e => console.log(e), 
    m => console.log(m)

);
console.log('done');