import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Faculty from './components/Faculty';
import Courses from './components/Courses';
import Instructions from './components/Instructions';
import Schedules from './components/Schedules';
import Events from './components/Events';
import ApiTester from './components/ApiTester';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/test-api" element={<ApiTester />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/events" element={<Events />} />
        <Route path="/analytics" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
