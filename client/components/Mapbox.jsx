import React, { useEffect } from 'react';

import mapboxgl from 'mapbox-gl';
import turf from 'turf/turf';

import Result from './Result.jsx';
import AddressBar from './AddressBar.jsx';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

const Mapbox = () => {
  const container = React.useRef(null);
  const [map, setMap] = React.useState(null);
  const [selectedBuilding, setSelectedBuilding] = React.useState(null);

  useEffect(() => {
    // create new instance of mapbox map
    const map = new mapboxgl.Map({
      container: container.current,
      style: process.env.INTERACTIVE_STYLE,
      center: [0, 0],
    });

    setMap(map);

    // click event to isolate/ select a building
    map.on('click', function (e) {
      const features = map.queryRenderedFeatures(e.point, {
        filter: ['==', 'extrude', 'true'],
        validate: true,
      });

      if (!features.length) return;

      // Reduce all features to the one with the greatest area
      const selectedFeature = features.reduce((max, f) =>
        turf.area(f) > turf.area(max) ? f : max
      );

      if (!selectedFeature.id) return;

      const allFeaturesWithSameId = map.querySourceFeatures('composite', {
        sourceLayer: 'building',
        filter: ['==', '$id', selectedFeature.id],
      });

      // Merge all the features with the same id into one feature (i.e. a roof)
      const mergedFeature = allFeaturesWithSameId.reduce((a, b) =>
        turf.union(a, b)
      );

      // Create custom GeoJSON feature object with all mergedFeature geometry and properties
      const selectedBuildingFeature = {
        type: 'Feature',
        id: selectedFeature.id,
        properties: {
          class_id: 1,
          ...allFeaturesWithSameId.reduce((a, b) => ({
            ...a.properties,
            ...b.properties,
          })),
        },
        geometry: {
          type: 'Polygon',
          coordinates: mergedFeature.geometry.coordinates,
        },
      };

      setSelectedBuilding(selectedBuildingFeature);
    });
    return () => map.remove();
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
      {selectedBuilding && (
        <Result selectedBuilding={selectedBuilding} map={map} />
      )}
    </>
  );
};

export default Mapbox;
