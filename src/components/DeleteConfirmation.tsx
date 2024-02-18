import { useEffect, useState } from "react";

const TIMER = 3000;
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const [remainingTime, setRemainingTime] = useState(TIMER);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("setInterval");
      setRemainingTime((prevTime) => prevTime - 100);
    }, 100);

    return () => {
      console.log("clearing interval");
      clearInterval(interval);
    };
  }, []);

  // function prop in dependency array are very dangerous and can cause infinite loops
  useEffect(() => {
    console.log("This will run after 3 seconds!");
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);
    return () => {
      console.log("clearing timeout");
      clearTimeout(timer);
    };
  }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
        <progress value={remainingTime} max={TIMER} />
      </div>
    </div>
  );
}
