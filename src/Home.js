function Home() {
    
    return (
      <div>
        <h1 className="title">ReportIt</h1>
        <h2 className="subtitle">Pin an incident near you</h2>
        <p className="info">ReportIt is made for users to report incidents near their location in real time. 
        <br/><br/>
        It helps others using the app to avoid certain areas where accidents may have occurred.
        <br/><br/>
        You can pin an incident by searching for your location in the search bar, or using your current location (you need to enable this in your browser). 
        <br/><br/>
        Then, click on the map where you would like to drop a pin, and add a description of the incident.
        <br/><br/>
        If you need to update the description, please click on the pin again, and update the description. 
        <br/><br/>
        Thanks for using ReportIt!
        </p>
        <br/>
        <footer className="footer">Created by Aden for Project 4 of the Software Engineering Immersive - General Assembly &copy; 2020</footer>
      </div>
    );
};

export default Home