import { useEffect } from "react";
import { ProgressBar } from "./ProgressBar.tsx";

const TIMER = 3000;
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  // function prop in dependency array are very dangerous and can cause infinite loops
  useEffect(() => {
    console.log("set timer!");
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);
    return () => {
      console.log("clearing timer");
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
        <ProgressBar timer={TIMER} />
      </div>
    </div>
  );
}
