# playlistr-ml-v1

## TODO
- [ ] Create playlist-track model (query by who added what track and when it was added)  
- [x] Get toy set with full track objects  
- [x] Get audio features for all track objects  
- [x] Get artist objects for all tracks  
- [x] Get audio analysis for all tracks  
- [ ] Get related artists for all artists  
- [ ] Migration + seeder for artists in db  
- [ ] Scrape musicbrainz "Release" objects for all tracks (and get MBID for tracks by ISRC)  
- [ ] Scrape acousticbrainz high-level data for all tracks ` GET https://acousticbrainz.org/api/v1/96685213-a25c-4678-9a13-abd9ec81cf35/high-level`  


## Sequelize Model Generate Command
Example:
`$ node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string`

## Amel note: don't yet understand the second argument of hasOne/hasMany