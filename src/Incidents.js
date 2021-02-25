import React, { useState } from 'react';

function Incidents( {markers} ) {

  const [timeDescending, setTimeDescending] = useState(false);
  const [timeAscending, setTimeAscending] = useState(false);
  const [userLocation, setUserLocation] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState('');

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
  
  const markersReversed = [...markers].reverse();

  const sortTimeAscending = () => {
    return markersReversed.map((marker, index) => {
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
  }

  const sortTimeDescending = (markers) => {
    return markers.map((marker, index) => {
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
  }
  
  const sortUserLocation = (markers) => {
    return markers.map((marker, index) => {
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
  }

  const sortMarkerCoords = (userCoordinates, markers) => {

    const calcDistance = (lat, lng) => {
      if (userCoordinates.lat === lat && userCoordinates.lng === lng) {
        return 0
      } else {
        return Math.sqrt(Math.pow(lat-userCoordinates.lat,2) + Math.pow(lng-userCoordinates.lng, 2))
      }
    }
    
    for (let i = 0; i < markers.length; i++) {
      let distanceFromUser = calcDistance(markers[i].lat, markers[i].lng)
      markers[i].distanceFromUser = distanceFromUser
    }
    
    let sorted = [...markers].sort((a, b) => a.distanceFromUser - b.distanceFromUser)

    return sortUserLocation(sorted)

  }
  
  const getUserLocation = () => {
    let currentUserLocation = '';
    navigator.geolocation.getCurrentPosition((position) => {
      currentUserLocation = userCoords({
      lat: position.coords.latitude, 
      lng: position.coords.longitude
      })
      setUserCoordinates(currentUserLocation)
      setUserLocation(true)
      setTimeAscending(false)
      setTimeDescending(false)  
    }, () => null)
  }

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
            onClick={getUserLocation}>Location (Closest to me)
          </button>
        </div>
        <ul className="incident-ul">
          {timeDescending ? sortTimeDescending(markers) : ''}
          {timeAscending ? sortTimeAscending(markers) : ''}
          {userLocation ? sortMarkerCoords(userCoordinates, markers) : ''}
        </ul>
    </div>
  )

};

const userCoords = ({lat, lng}) => {
  let userCoords = {lat, lng}
  return userCoords;
};

export default Incidents