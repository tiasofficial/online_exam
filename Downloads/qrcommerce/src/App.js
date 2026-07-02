// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import BusinessUserRegistration from './components/BusinessUserRegistration';
import CustomerUserRegistration from './components/CustomerUserRegistration';
import Login from './components/Login';
import { BusinessUserDashboard, CustomerUserDashboard } from './components/UserDashboard'; // Update the import


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/business-registration" element={<BusinessUserRegistration />} />
        <Route path="/customer-registration" element={<CustomerUserRegistration />} />
        <Route path="/login" element={<Login />} />
        {/* Render the BusinessUserDashboard component for business users */}
        <Route path="/user-dashboard/business" element={<BusinessUserDashboard user={{ name: 'q' }} />} />
        {/* Render the CustomerUserDashboard component for customer users */}
        <Route path="/user-dashboard/customer" element={<CustomerUserDashboard user={{ name: 'q' }} />} />
      </Routes>
    </Router>
  );
};

export default App;












