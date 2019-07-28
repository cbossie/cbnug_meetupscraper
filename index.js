const cbnug = require('./handler');

async function main(){
    

   await cbnug.updateSponsors('cbnug-sponsors-dev', 'https://www.meetup.com/CascoBayNUG/sponsors/');




}

main()
.then(
    e => console.log(e), 
    m => console.log(m)

);
console.log('done');