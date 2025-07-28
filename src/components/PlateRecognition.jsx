import { useState } from "react";
import Tesseract from "tesseract.js";
import "../App.css";
import ImageCropper from "./ImageCropper";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../UserContext";

function PlateRecognition() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyText, setCopyText] = useState(false);
  const [crop, setCrop] = useState(false);
  const [saving, setSaving] = useState(false);

  const { currentUser } = useAuth();

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImagePath(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleClick = () => {
    if (imagePath) {
      setLoading(true);
      Tesseract.recognize(imagePath, "eng", {
        logger: (m) => console.log(m),
      })
        .catch((err) => {
          console.error(err);
        })
        .then((result) => {
          let confidence = result.data.confidence;
          let text = result.data.text;
          setText(text);
          setLoading(false);
        });
    } else {
      console.error("No image selected");
    }
  };

  const onCropDone = (imgCroppedArea) => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    let imageObj1 = new Image();
    imageObj1.src = imagePath;
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataURL = canvasEle.toDataURL("image/jpeg");

      setImagePath(dataURL);
      setCrop(false);
    };
  };

  const onCropCancel = () => {
    setCrop(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyText(true);
      setTimeout(() => setCopyText(false), 2000);
      toast.success("Copied!", { duration: 2000 });
    });
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error("User not authenticated.");
      return;
    }

    if (text.trim().length > 9) {
      toast.error("Invalid Nigerian car plate number");
      return;
    }

    setSaving(true);

    try {
      // Check for duplicate plate number
      const q = query(
        collection(db, "phoneNumbers"),
        where("phoneNumber", "==", text.toLocaleLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("Plate number already exists.");
        setSaving(false);
        return;
      }

      const entry = {
        userId: currentUser.uid,
        phoneNumber: text.toLocaleLowerCase(),
        createdAt: Timestamp.now(),
      };

      // Add to phoneNumbers (PlateNumbers actually) collection
      const phoneNumberDocRef = await addDoc(
        collection(db, "phoneNumbers"),
        entry
      );
      const phoneNumberDocId = phoneNumberDocRef.id;

      // Add to history collection using the same ID
      await setDoc(doc(db, "history", phoneNumberDocId), entry);

      toast.success("Saved to database!", { duration: 2000 });
      setText("");
    } catch (error) {
      console.error("Error saving to database: ", error);
      toast.error("Error saving to database.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`md:max-w-3xl text-sm ${
        !crop && "border-t p-2"
      } w-full mx-auto relative`}
    >
      {/* <Toaster /> */}
      {crop && (
        <ImageCropper
          image={imagePath}
          onCropCancel={onCropCancel}
          onCropDone={onCropDone}
        />
      )}
      <main className="flex flex-col items-center">
        <h3 className="mb-4">
          {imagePath ? "Plate Number Image" : "Image Container"}
        </h3>
        <div className="h-[20vh] border border-dashed w-full mb-4">
          {imagePath && (
            <img
              src={imagePath}
              className="mb-4 h-full w-fit mx-auto"
              alt="uploaded"
            />
          )}
        </div>
        <div className="flex flex-col border w-full py-2 rounded">
          <h3 className="mb-2 text-center">Extracted Car Plate Number</h3>
          <div className="relative mb-4 p-4 border border-gray-300 rounded w-[95%] mx-auto md:w-96">
            <p>{text}</p>
            {text && (
              <button
                onClick={handleCopy}
                className="absolute top-0 right-0 text-xs mt-2 mr-2 bg-green-500 text-white p-1 rounded shadow-lg active:scale-95 active:shadow-none"
              >
                {copyText ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          <div className="border border-gray-300 w-[95%] mx-auto mb-2 rounded">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="p-2 md:p-3 w-full active:outline active:outline-offset-1 rounded"
              placeholder="Type in plate number"
            />
          </div>

          <p className="w-full mx-auto text-center bg-slate-300">or</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="file-input"
          />
          {!loading && (
            <div className="flex items-center w-fit mx-auto gap-2 mt-2">
              <label
                htmlFor="file-input"
                className="mb-4 px-4 py-2 border border-gray-300 w-fit mx-auto rounded-lg cursor-pointer shadow text-nowrap text-sm md:text-base"
              >
                {imagePath ? "Choose/Snap Another Image" : "Choose/Snap Image"}
              </label>
              {imagePath && (
                <p
                  className="mb-4 px-4 py-2 border-2 border-gray-300 w-fit mx-auto rounded-lg cursor-pointer bg-[#292929] text-white text-nowrap text-sm md:text-base"
                  onClick={() => {
                    setCrop(true);
                  }}
                >
                  Crop
                </p>
              )}
            </div>
          )}

          <div className="h-[1px] mb-2 w-full bg-gray-300"></div>

          <div className="flex items-center w-full justify-between px-2">
            {imagePath ? (
              <button
                onClick={handleClick}
                className={`bg-[#0000f1] text-white outline-double md:p-3 p-2 font-semibold ${
                  loading && "opacity-60 cursor-wait"
                } rounded disabled:opacity-50`}
                disabled={loading}
              >
                {loading ? "Extracting..." : "Extract text"}
              </button>
            ) : (
              <button
                className={`bg-slate-200 p-2 md:p-3 ${
                  !text && "bg-slate-200 w-[95%] md:w-[60%] mx-auto"
                } font-semibold rounded disabled:opacity-50`}
                disabled
              >
                No Image Selected
              </button>
            )}

            {text && (
              <button
                onClick={handleSave}
                className={`bg-green-500 text-white outline-double md:p-3 p-2 font-semibold ${
                  saving && "opacity-60 cursor-wait"
                } rounded disabled:opacity-50`}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save to database"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PlateRecognition;
