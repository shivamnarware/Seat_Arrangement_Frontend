import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./SeatReservation.css"
import {Link} from 'react-router-dom'

export default function UserBooking() {
    const [seats, setSeats] = useState(Array(80).fill(1));
    const [username, setUsername] = useState("");

    const ReserveSeats = async () => {
        useEffect(() => {
            axios.get("https://seat-arrangement.onrender.com/api/seats").then(function (response) {
                const data = response.data;
                data.sort();
                const updatedSeats = [...seats];
                for (let i = 0; i < data.length; i++) {
                    updatedSeats[data[i] - 1] = 0;
                }
                if (data.length > 0) {
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
                            className={`seat ${seats[seatNumber - 1] === 2 ? "booked":(seats[seatNumber - 1] === 1 ? "available" : "reserved") 
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
                            className={`seat ${seats[seatNumber - 1] === 2 ? "booked":(seats[seatNumber - 1] === 1 ? "available" : "reserved") 
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
        axios.get(`https://seat-arrangement.onrender.com/api/reservations/${username}`).then(function (response) {
            const data = response.data;
            console.log(data);
            const updatedSeats = [...seats];
            for (let i = 0; i < 80; i++) {
                if(updatedSeats[i]===2) updatedSeats[i] = 0;
            }
            for (let i = 0; i < data.length; i++) {
                updatedSeats[data[i] - 1] = 2;
            }
            if (data.length > 0) {
                setSeats(updatedSeats);
            }else{
                alert("User Doesn't exist")
            }
        })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <div>
            <h2>Seat Reservation</h2>
            <form onSubmit={HandleSubmit}>
                <input type="text" className="user-input" placeholder="User Name" onChange={(event) => setUsername(event.target.value)} />
                <button type="submit" className="submit-button">Submit</button>
            </form>
            <div className="coach">{renderSeats()}</div>
            <Link className="link-button" to="/">Home</Link>
        </div>
    );
}
