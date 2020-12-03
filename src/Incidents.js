import React, { useState } from 'react';

function Incidents( {markers} ) {

  const [timeDescending, setTimeDescending] = useState(false);
  const [timeAscending, setTimeAscending] = useState(false);
  const [userLocation, setUserLocation] = useState(false);

  const descending = () => {
    setTimeDescending(true)
    setTimeAscending(false)
    setUserLocation(false)
  }

  const ascending = () => {
    setTimeAscending(true)
    setTimeDescending(false)  
    setUserLocation(false)    
  }

  const location = () => {
    setUserLocation(true) 
    setTimeAscending(false)
    setTimeDescending(false)  
  }

  const sortTimeDescending = 
    markers.map((marker, index) => {
      return ( 
      <div className="incident-reports-wrap" key={index}>
          <li className="incident-reports">
          <p>Address: {marker.location}</p>
          <p>Pinned Location: {marker.lat}, {marker.lng}</p>
          <p>Time Reported: {marker.time.toString()}</p>
          <p>Latest Update: {marker.description}</p>
          </li>
      </div>
      )
    })
  
  const markersReversed = [...markers].reverse();

  const sortTimeAscending = 
    markersReversed.map((marker, index) => {
      return ( 
        <div className="incident-reports-wrap" key={index}>
          <li className="incident-reports">
            <p>Address: {marker.location}</p>
            <p>Pinned Location: {marker.lat}, {marker.lng}</p>
            <p>Time Reported: {marker.time.toString()}</p>
            <p>Latest Update: {marker.description}</p>
          </li>
        </div>
      )
    })
  
  const sortUserLocation = {}
  
  return (
    <div>
      <h1 className="title">ReportIt</h1>
        <h2 className="subtitle">Pin an incident near you</h2>
        <h2 className="view-incidents">Reported Incidents</h2>
        <h2 className="filter">Filter By:</h2>
        <div className="filters-wrap">
          <button 
            className="filters" 
            onClick={descending}>Time Reported (Descending)
          </button>
          <button 
            className="filters" 
            onClick={ascending}>Time Reported (Ascending)
          </button>
          <button 
            className="filters" 
            onClick={
              // location
              navigator.geolocation.getCurrentPosition((position) => {
                userCoords({
                lat: position.coords.latitude, 
                lng: position.coords.longitude
                })
            }, () => null),
            <sortMarkerCoords markers={markers}/>

            }>Location (Closest to me)
          </button>
        </div>
        <ul className="incident-ul">
          {timeDescending ? sortTimeDescending : ''}
          {timeAscending ? sortTimeAscending : ''}
          {userLocation ? sortUserLocation : ''}
        </ul>
    </div>
  )

};

const userCoords = ({lat, lng}) => {
  let userCoords = {lat, lng}
  console.log(userCoords);
};

const sortMarkerCoords = (markers) => {

  const calcDistance = (lat, lng) => {
    if (userCoords.lat === lat && userCoords.lng === lng) {
      return 0
    } else {
      return Math.sqrt(Math.pow(lat-userCoords.lat,2) + Math.pow(lng-userCoords.lng, 2))
    }
  }
  
  for (let i = 0; i < markers.length; i++) {
    let distanceFromUser = calcDistance(markers[i].lat, markers[i].lng)
    markers[i].distanceFromUser = distanceFromUser
  }
  
  console.log(
    markers
      .sort((a, b) => a.distanceFromUser - b.distanceFromUser)
      .forEach(marker => console.log(marker))
  )

}

export default Incidents