import './App.css';
import SeatReservation from './Component/SeatReservation';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserBooking from './Component/UserBooking';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route  path="/" element={<SeatReservation />} />
          <Route exact path="/UserBooking"  element={<UserBooking />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
