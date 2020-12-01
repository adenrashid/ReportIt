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
import "@reach/combobox/styles.css";
import './App.css';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyClQs4ujpPT3AMY4WSwEiIjxu2I885vQ3I");

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

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyClQs4ujpPT3AMY4WSwEiIjxu2I885vQ3I",
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
        description: '',
        location: location(e.latLng.lat(), e.latLng.lng())
      }
    ]);
  }, []);

  const onMapDrag = React.useCallback((e, index) => {
    setMarkers((current) => {
      const markers = [...current];
      markers[index] = { 
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
        description: ""
        }
        return markers;
    });
  }, []);

  const updateDescription = React.useCallback((e) => {
    console.log(e.target.value)
    // setMarkers((current) => {
    //   const markers = [...current];
    //   markers[index] = { 
    //     lat: e.latLng.lat(),
    //     lng: e.latLng.lng(),
    //     time: new Date(),
    //     description: `${e.target.value}`
    //     }
    //     return markers;
    // });
  }, []);

  const location = (lat, lng) => {
    Geocode.fromLatLng(lat, lng).then(
      response => {
        const address = response.results[0].formatted_address;
        console.log(address);
      },
      error => {
        console.error(error);
      }
    ) 
  }

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
      <h1 className="title">Pin It</h1>
      <h2 className="subtitle">Report an incident near you</h2>

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
              <h2>Accident Reported!</h2>
              <p>Description: 
                <textarea 
                  className="descriptionTextArea" 
                  onChange={
                    (e) => updateDescription(e)
                  }
                />
              </p>
              <p>Location: </p>
              <p>Reported { formatRelative(selected.time, new Date()) }</p>
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
};