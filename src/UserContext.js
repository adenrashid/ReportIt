import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios';
const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const UserContext = createContext()

export function UserProvider({ children }) {
    const [ latitude, setLatitude ] = useState()
    const [ longitude, setLongitude ] = useState()

    useEffect(() => {
        axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=6000&key=${api_key}`)
            .then(res => {
                console.log(res.data)
            })
    }, [])

    return ( 
        <UserContext.Provider value={{ latitude, longitude }}>
            {children}
        </UserContext.Provider>
    )

}
