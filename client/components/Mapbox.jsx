import React, { useEffect } from 'react';

import mapboxgl from 'mapbox-gl';

import AddressBar from './AddressBar.jsx';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

const Mapbox = () => {
  const container = React.useRef(null);
  const [map, setMap] = React.useState(null);

  useEffect(() => {
    // create new instance of mapbox map
    const map = new mapboxgl.Map({
      container: container.current,
      style: process.env.INTERACTIVE_STYLE,
      center: [0, 0],
    });

    setMap(map);
  }, []);

  const addressSearch = (longitude, latitude) => {
    const newCoordinates = {
      center: [longitude, latitude],
      zoom: 20,
    };
    map.jumpTo(newCoordinates);
  };

  return (
    <>
      <div className='map-container' ref={container} />
      <AddressBar addressSearch={addressSearch} />
    </>
  );
};

export default Mapbox;
