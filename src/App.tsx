import { useEffect, useRef, useState } from "react";

import Places from "./components/Places.tsx";
import { AVAILABLE_PLACES } from "./data.ts";
import Modal from "./components/Modal.tsx";
import DeleteConfirmation from "./components/DeleteConfirmation.tsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.ts";

const storedId = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedId.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id),
);
function App() {
  const selectedPlace = useRef();
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  /**
   * Sort places by distance from the user's current location.
   * This effect runs once when the component mounts.
   * It uses the Geolocation API to get the user's current location.
   * The sorted places are then set in the state.
   * If the user denies access to their location, the places are not sorted.
   */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude,
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setModelIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModelIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    /**
     * Store the selected place's id in localStorage.
     * This way, the selected places persist even after the page is reloaded.
     * The selected places are stored as an array of ids.
     * If the selected places are not in localStorage, an empty array is used.
     */
    const storedId = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (!storedId.includes(id)) {
      localStorage.setItem("selectedPlaces", JSON.stringify([...storedId, id]));
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current),
    );
    setModelIsOpen(false);
    const storedId = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedId.filter((id) => id !== selectedPlace.current)),
    );
  }

  return (
    <>
      <Modal open={modelIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
          fallbackText={"Sorting places by distance..."}
        />
      </main>
    </>
  );
}

export default App;
