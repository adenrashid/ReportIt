# ReportIt

![report it](/app-img.png)

### CLICK HERE to view the deployed app: https://report-it-app.surge.sh/

## Development / Functionality 

- ReportIt is made for users to report incidents near their location in real time.
- It helps others using the app to avoid certain areas where accidents may have occurred.
- Users can pin an incident by searching for your location in the search bar, or using your current location (you need to enable this in your browser). The app will default to Melbourne, AUS as the center if no location is specified. 
- Then, click on the map where you would like to drop a pin, and add a description of the incident.
- If you need to update the description, please click on the pin again, and update the description.
- If you'd like to view listed incidents, navigate to the incidents tab. 
- Thanks for using ReportIt!

### Technologies Used 

- Javascript
- React 
- Google Maps Javascript API 
- Places API 
- react-google-maps/api
- mapStyles: Snazzy Maps
- date-fns
- use-places-autocomplete
- reach/combobox
- react-geocode
- react-router-dom
- HTML, CSS 

### Planning 

- In my planning stages, I wanted to focus on building a front end React application to strengthen my skills in React and Javascript. 
- I also wanted to learn and implement a new API and decided on google maps as it is free and with many resources on how to use it. 
- Initial wireframing was based on a different app idea, then modified to suit ReportIt.
- Coming up with a clear idea on how to use google maps api proved difficult. initially i wanted to make a whats open near me app listing everything that is open around user location. but realised this idea was quite broad. so decided to make a more practical and functional app of reporting accidents in user area. 
- Wanted to use axios, express, node.js however did not have time to implement a backend. 

![whats open](/whats_open.png)

### Problems 

#### Fixed Problems 

- Previous idea was to implement axios and express to get data from google maps api and implement it in the app. Tried using axios but was getting CORS issue where maps api didnt allow client side access, so would need to implement a back end for this to work and then build my own API. decided to use maps as is with markers instead. 
- Using new component library react-google-maps/api, as the old one was no longer maintained. very little docs on how to use this as it was only published a few months ago. ultimately with a lot of research figured out the functionality. 
- Due to new component library, learnt to use react hooks to use state within functions rather than using classes.
- Updating and working with state when state is an array of objects i.e. an array of markers/pinned locations.
- React routing, passing state through routes so that multiple routes would have the state i.e. in map and incident routes. 
- Refactoring code into different routes.
- Deploying to heroku, realised this was unnecessary due to no back end so deployed to surge instead. google maps needs secure servers so https must be specified in URL if you want find location features of google to work. 
- Fixed filters functionality, so you can sort by time reported ascending or descending, and location (closest to me).
- Location closest to me was calculated by taking current user coords, then using pythagorus theorum to sort markers array. 

#### Persisting Problems 

- "Uncaught Type Error: Cannot read property 'apply' of null" pop up appearing when a selected marker is clicked. 
- Every time location services wants to be accessed, google chrome blocks it, so every time user wants to sort filter by closest to their location, they need to allow location services again. couldnt find a solution to have this always be allowed in the browser. 

### Lessons 

- It takes time to learn new features and time to implement them, some features take more time than you would think so give yourself a bit more time to read, watch videos, and generally research, if its a new tech that you're using. because things will go wrong so need that time to be able to troubleshoot it.
- also need time to go through API/tech docs if new to use.

### Stretch goals 

- Creating a backend so accidents are saved to a database, and are stored when the session is closed, using node.js, express.
- Implement a sign up/log in functionality, so that it is recorded which user reported the accident.
- Store in database all of the updates made to an incident. 
- Implement a delete function so that the marker can be cleared by the user once the incident has been resolved. 
- Have different types of incidents i.e. car crash, traffic, roadworks be specified by different markers. 
- Formatting for mobile use.