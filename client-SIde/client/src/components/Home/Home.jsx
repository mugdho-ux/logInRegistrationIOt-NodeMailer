import React from 'react';
import Room from '../Layout/DashBoard/Room';
import Room2 from '../Layout/DashBoard/Room2';
import Room3 from '../Layout/DashBoard/Room3';

const Home = () => {
    return (
        <div>
           
            <div> 
                
              <h1>Home </h1></div>
              <div><Room></Room></div>
                <div><Room2></Room2></div>
                <div><Room3></Room3></div>
        </div>
    );
};

export default Home;