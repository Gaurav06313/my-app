import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

function AppRoutes() {
    return (

        <Routes>
            {/* Redirect from root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Main routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            {/* 404 Route - Place it at the bottom */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

    );
}

export default AppRoutes;