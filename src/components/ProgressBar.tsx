import { useEffect, useState } from "react";

export function ProgressBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);

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
  return (
    <>
      <progress value={remainingTime} max={timer} />
    </>
  );
}
