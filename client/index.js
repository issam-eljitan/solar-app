import React from 'react';
import { render } from 'react-dom';
import App from './App';

import './stylesheets/styles.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

render(<App />, document.querySelector('#root'));
