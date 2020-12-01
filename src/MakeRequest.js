import axios from 'axios';
import React, { useState, createContext, useEffect } from 'react';

const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const MakeRequest = ({ children }) => {

    const [ latitude, setLatitude ] = useState()
    const [ longitude, setLongitude ] = useState()

    useEffect(() => {

        axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=6000&key=${api_key}`)
          .then(res => {
            console.log(res.data.data)
          })
    
      }, [])
    
    return (
        null
    )
}