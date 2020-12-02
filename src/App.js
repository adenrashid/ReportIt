import React from 'react';
import { 
  GoogleMap, 
  useLoadScript,
  Marker,
  InfoWindow, 
} from '@react-google-maps/api';
import mapStyles from './mapStyles';
import { formatRelative } from "date-fns";
import usePlacesAutocomplete, {
  getGeocode, 
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import Geocode from "react-geocode";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "@reach/combobox/styles.css";
import './App.css';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: -37.8136,
  lng: 144.9631, 
}; 
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function App() {

  const [markers, setMarkers] = React.useState([]);

  return (
    <Router>
      <div>
        <nav>
          <ul className="routes-ul">
            <li className="routes">
              <Link to="/">Home</Link>
            </li>
            <li className="routes">
              <Link to="/view-map">View Map</Link>
            </li>
            <li className="routes">
              <Link to="/view-incidents">View Incidents</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/view-map">
            <ViewMap markers={markers} setMarkers={setMarkers}/>
          </Route>
          <Route path="/view-incidents">
            <ViewIncidents markers={markers}/>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );

};

function Home() {
  return (
    <div>
      <h1 className="title">ReportIt</h1>
      <h2 className="subtitle">Pin an incident near you</h2>
      <p className="info">ReportIt is made for users to report incidents near their location in real time. 
      <br/><br/>
      It helps others using the app to avoid certain areas where accidents may have occurred.
      <br/><br/>
      You can pin an incident by searching for your location in the search bar, or using your current location (you need to enable this in your browser). 
      <br/><br/>
      Then, click on the map where you would like to drop a pin, and add a description of the incident.
      <br/><br/>
      If you need to update the description, please click on the pin again, and update the description. 
      <br/><br/>
      Thanks for using ReportIt!
      </p>
      <br/>
      <footer className="footer">Created by Aden for Project 4 of the Software Engineering Immersive - General Assembly &copy; 2020</footer>
    </div>
  );
}

function ViewMap({ markers, setMarkers }) {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [selected, setSelected] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [input, setInput] = React.useState('');

  const onMapClick = React.useCallback((e) => {
    Geocode.fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
      response => {
        const address = response.results[0].formatted_address;
        setMarkers((current) => [
          ...current,
          {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            time: new Date(),
            description: "",
            location: address
          }
        ]);
      },
      error => {
        console.error(error);
      }
    ) 
  }, []);

  const onMapDrag = React.useCallback((e, index) => {
    Geocode.fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
      response => {
        const address = response.results[0].formatted_address;
        setMarkers((current) => {
          const markers = [...current];
          markers[index] = { 
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          time: new Date(),
          description: markers[index].description, 
          location: address
          }
          return markers;
        });
      },
      error => {
        console.error(error);
      }
    ) 
  }, []);

  const updateDescription = React.useCallback((e) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  })

  const onSubmit = React.useCallback((e) => {
    e.preventDefault();
    markers[markers.indexOf(selected)].description = `${input}`;
    setLoading(false);
    setInput('');
  })

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({lat, lng}) => {
    mapRef.current.panTo({lat, lng});
    mapRef.current.setZoom(14);
  }, []);
    
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <h1 className="title">ReportIt</h1>
      <h2 className="subtitle">Pin an incident near you</h2>

      <Search panTo={panTo}/>
      <Locate panTo={panTo}/>

      <GoogleMap 
        mapContainerStyle={mapContainerStyle} 
        zoom={12} 
        center={center} 
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map((marker, index) => (
          <Marker 
            key={index}
            time={marker.time.toISOString()}
            position={{lat: marker.lat, lng: marker.lng}}
            draggable={true}
            icon={{
              url: '/car.png',
              scaledSize: new window.google.maps.Size(30,30),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(15,15),
            }}
            onClick={() => {
              setSelected(marker);
            }}
            onDragEnd={
              (e) => onMapDrag(e, index)
            }
          />
        ))}
 
        {selected ? (
          <InfoWindow
          position={{lat: selected.lat, lng: selected.lng}} 
          onCloseClick={() => {setSelected(null)}}
          >
            <div>
              <h2>Incident Reported!</h2>
              <form 
                action=""
                onSubmit={onSubmit}>
                  <label htmlFor="">Add an update:</label>
                  <input
                    className="update-input"
                    value={input} 
                    onChange={
                      (e) => updateDescription(e)
                    }
                  />
                <button>Update</button>
                {loading ? <span className="loading">🔷</span> : ''}
              </form>
              <p>Latest Update: {selected.description}</p>  
              <p>Location: {selected.location} </p>
              <p>Reported: { formatRelative(selected.time, new Date()) }</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  )
}

function Locate({panTo}) {
  return ( 
    <button className="locate" onClick={() => {
      navigator.geolocation.getCurrentPosition((position) => {
        panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      }, () => null)
    }}>
      <img src="compass.png" alt="compass - pin to locate me" />
      <p className="description">Find my current location</p>
    </button>
  );
}

function Search({panTo}) {
  const {
    ready, 
    value, 
    suggestions: {status, data}, 
    setValue, 
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      location: {lat: () => -37.700560, lng: () => 144.736810 },
      radius: 20 * 1000,
    }
  })

  return (
    <Combobox onSelect={async (address) => {

      setValue(address, false);
      clearSuggestions();

      try {
        const results = await getGeocode({address});
        const { lat, lng } = await getLatLng(results[0]);
        panTo({ lat, lng });
      } catch(error) {
      console.log("error!")
      }
    }}>
  
    <ComboboxInput 
      value={value} 
      onChange={(e) => {
        setValue(e.target.value)
      }} 
      disabled={!ready}
      placeholder="Enter a location"
      className="search"
    />
  
    <ComboboxPopover>
      <ComboboxList>
      {status === "OK" && 
      data.map(({id, description}) => 
        <ComboboxOption key={id} value={description} />)}
        </ComboboxList>
        </ComboboxPopover>
    </Combobox>
  );

}

function ViewIncidents( {markers} ) {

  const [timeDescending, setTimeDescending] = React.useState(false);
  const [timeAscending, setTimeAscending] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState(false);

  const sortTimeDescending =
    setTimeAscending(false);
    markers.map((marker, index) => {
      return ( 
        <div className="incident-reports-wrap">
          <li className="incident-reports" key={marker[index]}>
            <p>Address: {marker.location}</p>
            <p>Pinned Location: {marker.lat}, {marker.lng}</p>
            <p>Time Reported: {marker.time.toString()}</p>
            <p>Latest Update: {marker.description}</p>
          </li>
        </div>
      )
    })

  const sortTimeAscending = 
    setTimeDescending(false);
    markers.reverse().map((marker, index) => {
      return ( 
        <div className="incident-reports-wrap">
          <li className="incident-reports" key={marker[index]}>
            <p>Address: {marker.location}</p>
            <p>Pinned Location: {marker.lat}, {marker.lng}</p>
            <p>Time Reported: {marker.time.toString()}</p>
            <p>Latest Update: {marker.description}</p>
          </li>
        </div>
      )
    })

  return (
    <div>
      <h1 className="title">ReportIt</h1>
        <h2 className="subtitle">Pin an incident near you</h2>
        <h2 className="view-incidents">Reported Incidents</h2>
        <h2 className="filter">Filter By:</h2>
        <div className="filters-wrap">
          <button className="filters" onClick={() => setTimeDescending(true)}>Time Reported (Descending)</button>
          {/* <button className="filters" onClick={() => setTimeAscending(true)}>Time Reported (Ascending)</button> */}
          <button className="filters">Location (Closest to me)</button>
        </div>
        <ul className="incident-ul">
          {timeDescending ? sortTimeDescending : ''}
          {/* {timeAscending ? sortTimeAscending : ''} */}
        </ul>
    </div>
  )
}