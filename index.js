const cb = require('./cbnug/cbnug').cbnug;

async function main(){
    
    var cbnug = new cb({});

   //await cbnug.updateSponsors('cbnug-sponsors-dev', 'https://www.meetup.com/CascoBayNUG/sponsors/');
   //await cb.updateEvents('cbnug-events-dev', 'https://www.meetup.com/awspug/events/');
   await cbnug.uploadImage('cbnug-images-dev','https://secure.meetupstatic.com/photos/sponsor/5/2/a/d/iab120x90_2721165.jpeg', 'bbfc42c0-b2bf-11e9-9208-1bff75f7c233');


}

main()
.then(
    e => console.log(e), 
    m => console.log(m)

);
console.log('done');