import React from 'react';
import Geocode from "react-geocode";
import "@reach/combobox/styles.css";
import './App.css';
import RenderRoutes from './RenderRoutes';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

export default function App() {

  return (
    <div>
      <RenderRoutes />
    </div>
  )

};