import React, { useState } from "react";
import Cropper from "react-easy-crop";

function ImageCropper({ image, onCropDone, onCropCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onAspectRatioChange = (event) => {
    setAspectRatio(Number(event.target.value));
  };

  return (
    <div className="h-screen w-full bg-black/30 fixed top-0 left-0 flex items-center justify-center z-[999] p-2">
      <div className="relative w-full max-w-3xl bg-white shadow-lg rounded overflow-hidden">
        <div className="relative w-full h-[55vh]">
          <Cropper
            image={image}
            aspect={aspectRatio}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: {
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
              },
            }}
          />
        </div>

        <div className="bg-gray-100 w-full flex flex-col items-center space-y-4 py-4">
          <p className="text-sm px-2">
            Choose Image ratio below or adjust manually above.
          </p>
          <div className="flex flex-wrap justify-center space-x-4 px-4 py-1 bg-slate-300">
            {[
              { value: 1 / 1, label: "1:1" },
              { value: 5 / 4, label: "5:4" },
              { value: 4 / 3, label: "4:3" },
              { value: 3 / 2, label: "3:2" },
              { value: 5 / 3, label: "5:3" },
              { value: 16 / 9, label: "16:9" },
              { value: 3 / 1, label: "3:1" },
            ].map((ratio) => (
              <label key={ratio.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={ratio.value}
                  name="ratio"
                  className="h-4 w-4 text-blue-600 ml-2"
                  onChange={onAspectRatioChange}
                />
                <span>{ratio.label}</span>
              </label>
            ))}
          </div>

          <div className="flex space-x-4 px-4">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={onCropCancel}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={() => {
                onCropDone(croppedArea);
              }}
            >
              Crop And Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
