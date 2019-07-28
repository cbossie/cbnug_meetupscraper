const cb = require('./cbnug/cbnug').cbnug;

async function main(){
    
    var cbnug = new cb({});

   await cbnug.updateSponsors('cbnug-sponsors-dev', 'https://www.meetup.com/CascoBayNUG/sponsors/');
   //await cb.updateEvents('cbnug-events-dev', 'https://www.meetup.com/awspug/events/');



}

main()
.then(
    e => console.log(e), 
    m => console.log(m)

);
console.log('done');