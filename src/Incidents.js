import React from 'react';

function Incidents( {markers} ) {

    const [timeDescending, setTimeDescending] = React.useState(false);
    const [timeAscending, setTimeAscending] = React.useState(false);
  
    const sortTimeDescending = 
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
  
    const markersReversed = [...markers].reverse();
  
    const sortTimeAscending = 
      markersReversed.map((marker, index) => {
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
            <button className="filters" onClick={
              () => setTimeDescending(true)
              }>Time Reported (Descending)
            </button>
            <button className="filters" onClick={
              () => setTimeAscending(true)
              }>Time Reported (Ascending)
            </button>
          </div>
          <ul className="incident-ul">
            {timeDescending ? sortTimeDescending : ''}
            {timeAscending ? sortTimeAscending : ''}
          </ul>
      </div>
    )
};

export default Incidents