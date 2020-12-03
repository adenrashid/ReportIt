import React, { useCallback, useState, useRef } from 'react';
import { 
  GoogleMap, 
  useLoadScript,
  Marker,
  InfoWindow, 
} from '@react-google-maps/api';
import { formatRelative } from "date-fns";
import usePlacesAutocomplete, {
  getGeocode, 
  getLatLng,
} from "use-places-autocomplete";
import Geocode from "react-geocode";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import mapStyles from './mapStyles';

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

function Map({ markers, setMarkers }) {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const onMapClick = useCallback((e) => {
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
  }, [setMarkers]);
  
  const onMapDrag = useCallback((e, index) => {
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
  }, [setMarkers]);

  const updateDescription = useCallback((e) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, []);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    markers[markers.indexOf(selected)].description = `${input}`;
    setLoading(false);
    setInput('');
  }, [input, markers, selected]);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({lat, lng}) => {
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
};

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
};

export default Map