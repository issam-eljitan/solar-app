from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import base64
import uvicorn
import cv2
import requests
import numpy as np
from PIL import Image
from io import BytesIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/image")
def predict(body: dict):
    
    imageUrl = body["image"]
    
    # Decode/ download the image
    url = requests.get(imageUrl)
    image = Image.open(BytesIO(url.content))

    image = np.array(image)

    building = body["coordinates"]
    building = np.array(building, dtype=np.int32)

    # Black out the image outside the building polygon
    mask = np.zeros(image.shape, dtype=np.uint8)
    cv2.fillPoly(mask, [building], (255,255,255))
    image = cv2.bitwise_and(image, mask)

    # Run contour detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(gray, 127, 255, 0)
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    # Draw the contour on the image
    cv2.drawContours(image, contours, -1, (0,255,0), 3)

    # Draw the building polygon on the image
    cv2.polylines(image, [building], True, (0,0,255), 3)

    # Encode the image
    _, buffer = cv2.imencode('.jpg', image)
    return {
        # base64 encode the image
        "image": base64.b64encode(buffer).decode('utf-8')

    }

# Reload the server when code changes
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
    