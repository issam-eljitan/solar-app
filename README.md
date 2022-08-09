# Solar

The purpose of this application is to predict suitable areas for solar panel placement. The more green a specific area in the image, the more unlikely that you are able to place a solar panel there.

## Demo

Here's a quick gif demonstrating the app in action:

![App Demo Gif](demo.gif)

## Getting Started

To get started with the project, you'll need to have Node.js and Python3 installed on your machine.

1. Clone this repository
2. Install dependencies by running `npm install` in the root directory of the project
3. Install the Python dependencies by running `pip install -r requirements.txt` in the `server` directory
4. Create a `.env` file and set the following environmental variables:

   - `MAPBOX_TOKEN`
   - `INTERACTIVE_STYLE`
   - `ACCESS_TOKEN`
   - `OWNER_ID`
   - `STYLE_ID`
   - For more information on how to set up a map and retrieve the relevant values for the environmental variables, check out the Mapbox [Documentation](https://docs.mapbox.com/mapbox-gl-js/guides/)

5. Start the frontend and backend by running `npm run dev`

The application should now be accessible at `http://localhost:8080`.

## Usage

1. Enter an address in the search bar or interact with the map and scroll manually with your mouse to find the building you want to predict solar panel placement for.
2. Click on the building to select it. If the building clicked on is a valid roof, the surface area of the roof will appear.
3. Once the building is selected, click the **Process Selected Building** button
4. The processed image will then be displayed with a color map indicating the suitability of different areas for solar panel placement. The more green a specific area in the image, the more unlikely it is that you are able to place a solar panel there.
5. Users can download the generated image by clicking on the "Download" button.

## Built With

- React
- JavaScript
- Mapbox
- Turf
- Python
- FastAPI
- OpenCV

## Authors

- [Issam Eljitan](https://github.com/issam-eljitan)

## Acknowledgments

- [Mapbox](https://www.mapbox.com/)
- [Turf](https://turfjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [OpenCV](https://opencv.org/)
