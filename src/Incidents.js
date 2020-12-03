import React, { useState } from 'react';

function Incidents( {markers} ) {

  const [timeDescending, setTimeDescending] = useState(false);
  const [timeAscending, setTimeAscending] = useState(false);
  
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

  const descending = () => {
    setTimeDescending(true)
    setTimeAscending(false)
  }

  const ascending = () => {
    setTimeAscending(true)
    setTimeDescending(false)      
  }
  
  return (
    <div>
      <h1 className="title">ReportIt</h1>
        <h2 className="subtitle">Pin an incident near you</h2>
        <h2 className="view-incidents">Reported Incidents</h2>
        <h2 className="filter">Filter By:</h2>
        <div className="filters-wrap">
          <button className="filters" onClick={descending}>Time Reported (Descending)
          </button>
          <button className="filters" onClick={ascending}>Time Reported (Ascending)
          </button>
          {/* <button className="filters" onClick={
            () => setTimeAscending(true)
            }>Location (Closest to me)
          </button> */}
          {/* <UserCurrentLocation markers={markers}/> */}
        </div>
        <ul className="incident-ul">
          {timeDescending ? sortTimeDescending : ''}
          {timeAscending ? sortTimeAscending : ''}
        </ul>
    </div>
  )

};

// function UserCurrentLocation( {markers} ) {

//     const sortUserCoords = ({lat, lng}) => {
//         console.log(
//             Math.sqrt(Math.abs(lat)) + Math.sqrt(Math.abs(lng))
//         )
//     };

//     const sortMarkerCoords = (markers) => {
//         markers.map(marker => {
//             return console.log(
//                 Math.sqrt(Math.abs(marker.lat)) + Math.sqrt(Math.abs(marker.lng))
//             )
//         })
//     }

//     return ( 
      // <button className="locate" onClick={() => {
      //   // navigator.geolocation.getCurrentPosition((position) => {
      //   //         {
      //   //     lat: position.coords.latitude,
      //   //     lng: position.coords.longitude
      //   //   }
      //       sortMarkerCoords(markers)
      //   //   sortUserCoords()
      //   // }, () => null)
      // }}>
//         <img src="compass.png" alt="compass - pin to locate me" />
//         <p className="description">Find my current location</p>
//       </button>
//     );
// };

export default Incidents