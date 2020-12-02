import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Home from './Home';
import Map from './Map';
import Incidents from './Incidents';

function RenderRoutes() {

  const [markers, setMarkers] = React.useState([]);

  return (
    <Router>
      <div>
        <nav>
          <ul className="routes-ul">
            <li className="routes">
              <Link to="/">Home</Link>
            </li>
            <li className="routes">
              <Link to="/map">Map</Link>
            </li>
            <li className="routes">
              <Link to="/incidents">Incidents</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/map">
            <Map markers={markers} setMarkers={setMarkers}/>
          </Route>
          <Route path="/incidents">
            <Incidents markers={markers}/>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );

}

export default RenderRoutes