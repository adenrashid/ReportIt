import React from 'react';
import axios from 'axios';

export default class MarkerList extends React.Component {
state = {
    markers: [],
};

componentDidMount(){
    navigator.geolocation.getCurrentPosition(position=>{
    this.setState({geoLat:position.coords.latitude,geoLng:position.coords.longitude});
    axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-37.700640799999995,144.73637349999998&radius=6000&key=AIzaSyClQs4ujpPT3AMY4WSwEiIjxu2I885vQ3I`)
         .then(response => this.setState({restaurantsFetchedFromGoogle:response.data.results}));
    });
    this.state.restaurantsFetchedFromGoogle.map(item=>{
      axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${item.place_id}&key=AIzaSyCZ7rgMN34kWkGvr8Pzkf_8nkT7W6gowBA`)
           .then(response => this.setState({placeId:response.data}))
           .catch(err =>{
           console.log(err);
           console.log(err.response.data.error);
    });
  });
    axios.get('/restaurants.json')
         .then(response =>this.setState({restaurants:response.data}));
  }

    render() {
        return (
            <ul>
                { this.state.markers.map(marker => <li>{marker}</li> )}
            </ul>
        )
    }

}