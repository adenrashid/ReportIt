import React from 'react';

export const GetUserCoordinates = ({ setLatitude, setLongitude }) => {

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoordinates, handleLocationError);
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }
  
  const getCoordinates = (position) => {
    setLatitude(position.coords.latitude)
    setLongitude(position.coords.longitude)
  }
  
  const handleLocationError = (error) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.")
        break;
      default:
        alert("An unknown error occurred.")
    }
  }
  
    return (
      <div>
        <h1>geolocation</h1>
        <h2>{getLocation()}</h2>
      </div>
    )
  }