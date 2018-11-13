# playlistr-ml-v1

## TODO HIGH PRIORITY
- [x] Get toy set with full track objects  
- [x] Get audio features for all track objects  
- [x] Get artist objects for all tracks  
- [x] Get audio analysis for all tracks  
- [x] Track playlist association  
- [ ] CSV exporter v1  
- [x] Migration + seeder for artists in db  
- [x] Artist track association  
- [x] Get related artists for all artists  
- [x] Get artist genres  
- [ ] Album seeder  
- [ ] Get album genres  

## Features
### Audio Analysis
- tempo
- tempo_confidence
- time_signature
- time_signature_confidence
- key
- key_confidence
- mode
- mode_confidence

### Audio Features
- acousticness	float	A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.  

- danceability	float	Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.  

- energy	float	Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.  

- instrumentalness	float	Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.
key	int	The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on.

- liveness	float	Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.  

- speechiness	float	Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.  

- valence	float	A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).  

## TODO LOW PRIORITY
- [ ] Scrape musicbrainz "Release" objects for all tracks (and get MBID for tracks by ISRC)  
- [ ] Scrape acousticbrainz high-level data for all tracks ` GET https://acousticbrainz.org/api/v1/96685213-a25c-4678-9a13-abd9ec81cf35/high-level`  
- [ ] Create playlist-track model (query by who added what track and when it was added)  


## Sequelize Model Generate Command
Example:
`$ node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string`