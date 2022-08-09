import React, { useState } from 'react';
import axios from 'axios';

import turf from 'turf/turf';
import mapboxgl from 'mapbox-gl';
import mbxClient from '@mapbox/mapbox-sdk';
import staticClient from '@mapbox/mapbox-sdk/services/static';
import { WebMercatorViewport } from '@deck.gl/core';

const baseClient = mbxClient({ accessToken: process.env.ACCESS_TOKEN });
const mapboxClient = staticClient(baseClient);

const Result = ({ selectedBuilding, map }) => {
  const [image, setImage] = useState(null);

  const postData = async () => {
    const building = selectedBuilding;
    //  calculate the bounding box of the building
    const bbox = turf.bbox(building.geometry);

    const bounds = new mapboxgl.LngLatBounds(
      new mapboxgl.LngLat(bbox[2], bbox[3]),
      new mapboxgl.LngLat(bbox[0], bbox[1])
    );

    const buildingCamera = map.cameraForBounds(bounds);

    const image_height = 600;
    const image_width = 600;

    const viewport = new WebMercatorViewport({
      width: image_width,
      height: image_height,
      longitude: buildingCamera.center.lng,
      latitude: buildingCamera.center.lat,
      zoom: buildingCamera.zoom,
      pitch: buildingCamera.pitch,
      bearing: buildingCamera.bearing,
    });

    const reformatedViewport = viewport.fitBounds([
      [bounds._ne.lng, bounds._ne.lat],
      [bounds._sw.lng, bounds._sw.lat],
    ]);

    // Extract the selected building with mapbox static image API
    const staticImage = mapboxClient.getStaticImage({
      ownerId: process.env.OWNER_ID,
      styleId: process.env.STYLE_ID,
      width: image_width,
      height: image_height,
      logo: false,
      position: {
        coordinates: [buildingCamera.center.lng, buildingCamera.center.lat],
        zoom: reformatedViewport.zoom > 20 ? 20 : reformatedViewport.zoom,
        bearing: buildingCamera.bearing,
      },
    });

    const coordinates = [];
    building.geometry.coordinates[0].forEach((coordinate) => {
      coordinates.push(viewport.project(coordinate));
    });
    coordinates.push(coordinates[0]);

    // Send image to API for processing
    const response = await axios.post(
      '/image',
      {
        image: staticImage.url(),
        building: building,
        coordinates: coordinates,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      }
    );

    const blob = await response;
    const imageBytes = blob.data.image;

    setImage('data:image/jpeg;base64,' + imageBytes);
  };

  const downloadImage = () => {
    const byteString = atob(image.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpeg' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'roof.jpg';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className='selected-building'>
      {selectedBuilding && (
        <div>
          <div className='roof-area'>
            <h3>Selected Roofing Area:</h3>
            <p>
              {`${turf.area(selectedBuilding.geometry).toFixed(2)} m`}
              <sup>2</sup>
            </p>
          </div>
          <div className='panel-prediction'>
            <button className='process' onClick={postData}>
              Process Selected Building
            </button>
            {image && (
              <>
                <img src={image} alt='Selected Building' />
                <button onClick={downloadImage}>Download Image</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
