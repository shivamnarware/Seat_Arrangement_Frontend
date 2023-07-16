import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./SeatReservation.css"
import {Link} from 'react-router-dom'

const SeatReservation = () => {

  const [seats, setSeats] = useState(Array(80).fill(1));
  const [ts, setTs] = useState(0);
  const [username, setUsername] = useState("");
  let [lastSeat, setLastSeat] = useState(0);

  const ReserveSeats = async () => {
    useEffect(() => {
      axios.get("https://seat-arrangement.onrender.com/api/seats").then(function (response) {
        const data = response.data;
        data.sort(function(a, b){return a-b});
        
        const updatedSeats = [...seats];
        for (let i = 0; i < data.length; i++) {
          updatedSeats[data[i] - 1] = 0;
        }
        
        if (data.length > 0) {
          setLastSeat(data[data.length - 1]);
          setSeats(updatedSeats);
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    }, [])
  };

  const renderSeats = () => {
    const seatRows = [];
    let seatNumber = 1;
    ReserveSeats();
    for (let row = 0; row <= 11; row++) {
      const seatsInRow = [];
      if (row === 11) {
        for (let seat = 0; seat < 3; seat++) {
          seatsInRow.push(
            <div
              key={seatNumber}
              className={`seat ${seats[seatNumber - 1] ? "available" : "reserved"
                }`}
            >
              {seatNumber}
            </div>
          );
          seatNumber++;
        }
      } else {
        for (let seat = 0; seat < 7; seat++) {
          seatsInRow.push(
            <div
              key={seatNumber}
              className={`seat ${seats[seatNumber - 1] ? "available" : "reserved"
                }`}
            >
              {seatNumber}
            </div>
          );
          seatNumber++;
        }
      }
      seatRows.push(
        <div key={row} className="row">
          {seatsInRow}
        </div>
      );
    }

    return seatRows;
  };

  const HandleSubmit = async (event) => {
    event.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }
    let seating = [];
    const limit = parseInt(ts) + parseInt(lastSeat);
    for (let j = lastSeat + 1; j <= limit; j++) {
      seating.push(parseInt(j));
    }
    let lastseatav=seating[seating.length-1];
    if(lastseatav>80) alert("max capacity reached")
    // console.log(username)
    // console.log(lastseatav)
    if (username.length > 0 && lastseatav<81) {
      const response = await axios.post("https://seat-arrangement.onrender.com/api/reserve", { username, seating }, config);
      console.log(response);
    }
    setTs(0);
    setUsername("");
    window.location.reload();
  };

  const ResetHandler = async (e) => {
    // e.preventDefault();
    axios.get("https://seat-arrangement.onrender.com/api/reset").then(function (response) {
      console.log(response);
    })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div>
      <h2>Seat Reservation</h2>
      <form onSubmit={HandleSubmit}>
        <input type="text" className="user-input" placeholder="User Name" onChange={(event) => setUsername(event.target.value)} />
        <input type="number" className="seat-input" min="1" max="7" placeholder="Enter a number (1-7)" onChange={(event) => setTs(event.target.value)} />
        <button type="submit" className="submit-button">Submit</button>
      </form>
      <div className="coach">{renderSeats()}</div>
      <form onSubmit={ResetHandler}>
        <button type="submit" className="reset-button">Reset</button>
      </form>
      <Link className="link-button" to="/UserBooking">User Booking</Link>
    </div>
  );
};

export default SeatReservation;
