# ReportIt

![report it](/app-img.png)

- ReportIt is made for users to report incidents near their location in real time.
- It helps others using the app to avoid certain areas where accidents may have occurred.
- Users can pin an incident by searching for your location in the search bar, or using your current location (you need to enable this in your browser). The app will default to Melbourne, AUS as the center if no location is specified. 
- Then, click on the map where you would like to drop a pin, and add a description of the incident.
- If you need to update the description, please click on the pin again, and update the description.
- If you'd like to view listed incidents, navigate to the incidents tab. 
- Thanks for using ReportIt!

### CLICK HERE to view the deployed app: https://report-it-app.surge.sh/

## Development 

### Technologies Used 

- Javascript
- React 
- Node.js 
- Google Maps Javascript API 
- Places API 
- react-google-maps/api
- mapStyles
- date-fns
- use-places-autocomplete
- reach/combobox
- react-geocode
- react-router-dom
- HTML, CSS 

### Planning 

- In my planning stages, I wanted to focus on building a front end REACT application to strengthen my skills in this area. I also wanted to learn and implement an API and decided on google maps as it is free and with many resources on how to use it. 

### Problems 

#### Fixed Problems 

- Coming up with a clear cut idea on how to use google maps api. initially i wanted to make a whats open near me app listing everything that is open around user location. but realised this idea was quite broad and i couldnt hone it in. so decided to make a more practical and functional app of reporting accidents in user area. 
- Using new react-google-maps/api, as the old one was no longer maintained. very little docs on how to use this. ultimately with a lot of research figured out the functionality. 
- General react functionality
- React routing, passing state through routes so that multiple routes would have the state i.e. in map and incident routes. 
- Deploying to heroku, realised this was unnecessary due to no back end so deployed to surge instead. google maps needs secure servers so https must be specified in URL if you want find location features of google to work. 

#### Persisting Problems 

- Need to refactor code into different folders and routes 
- Need to fix filter function 

### Lessons 

### Stretch goals 

- Ideally if I had more time, I would've liked to create a backend so accidents are saved to a database, and are stored when the session is closed. I would've liked to do this in node/express. 
- I would have also liked to have a sign up/log in functionality, so that it is recorded which user reported the accident.
- Would've also liked to store all of the updates made to an incident. 
- Implemented a delete function so that the marker can be cleared by the user once the incident has been resolved. 
- Implement a filter by location button so that user can filter incidents by closest to their current location. 