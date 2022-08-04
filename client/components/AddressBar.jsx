import React, { useState } from 'react';
import axios from 'axios';

const AddressBar = ({ addressSearch }) => {
  const [address, setAddress] = useState('');

  const handler = async (e) => {
    e.preventDefault();

    try {
      const geoLocation = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAPBOX_TOKEN}`
      );

      const [long, lat] = geoLocation.data.features[0].center;
      addressSearch(long, lat);

      setAddress('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='address'>
        <form action=''>
          <label for='adrs'>Address Search: </label>
          <input
            type='text'
            name='adrs'
            id='adrs'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button onClick={handler}>Search</button>
        </form>
      </div>
    </>
  );
};

export default AddressBar;
