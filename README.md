# playlistr-ml-v1

## TODO
- [ ] Create playlist-track model (query by who added what track and when it was added)  
- [x] Get toy set with full track objects  
- [x] Get audio features for all track objects  
- [x] Get artist objects for all tracks  
- [x] Get audio analysis for all tracks  


## Sequelize Model Generate Command
Example:
`$ node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string`

## Amel note: don't yet understand the second argument of hasOne/hasMany