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

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: -37.700560,
  lng: 144.736810, 
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

  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      }
    ]);
  }, []);

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
          {markers.map(marker => (
            <Marker 
              key={marker.time.toISOString()} 
              position={{lat: marker.lat, lng: marker.lng}}
              icon={{
                url: '/car.png',
                scaledSize: new window.google.maps.Size(30,30),
                origin: new window.google.maps.Point(0,0),
                anchor: new window.google.maps.Point(15,15),
              }}
              onClick={() => {
                setSelected(marker);
              }}
            />
          ))}

          {selected ? (
            <InfoWindow 
            position={{lat: selected.lat, lng: selected.lng}} 
            onCloseClick={() => {setSelected(null)}}
            >
              <div>
                <h2>Accident Reported!</h2>
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
  
// export const App = () => {

//   const [ latitude, setLatitude ] = useState(null)
//   const [ longitude, setLongitude ] = useState(null)

//   return (
//     <React.Fragment>
//       <GetUserCoordinates 
//         setLatitude={setLatitude}
//         setLongitude={setLongitude}
//       />
//       <MakeRequest 
//         latitude={latitude}
//         longitude={longitude}
//       />
//       {/* <GetData
//       /> */}
//     </React.Fragment>
//   )
// }