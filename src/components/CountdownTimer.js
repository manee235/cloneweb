import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set end date to 7 days from now
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }) => (
    <div className="time-unit">
      <div className="time-value">{String(value).padStart(2, '0')}</div>
      <div className="time-label">{label}</div>
    </div>
  );

  return (
    <div className="countdown-timer">
      <div className="timer-label">Offer Ends In:</div>
      <div className="timer-container">
        <TimeUnit value={timeRemaining.days} label="Days" />
        <div className="timer-separator">:</div>
        <TimeUnit value={timeRemaining.hours} label="Hours" />
        <div className="timer-separator">:</div>
        <TimeUnit value={timeRemaining.minutes} label="Minutes" />
        <div className="timer-separator">:</div>
        <TimeUnit value={timeRemaining.seconds} label="Seconds" />
      </div>
    </div>
  );
};

export default CountdownTimer;
