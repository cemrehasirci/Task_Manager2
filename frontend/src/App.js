import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import UsersPage from './pages/UsersPage';
import EditTaskPage from './pages/EditTaskPage';
import Navbar from './components/Navbar';
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';

import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ element }) {
    const { token } = useAuth();
    return token ? element : <Navigate to="/login" />;
}

function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/tasks" element={<PrivateRoute element={<TasksPage />} />} />
                <Route path="/tasks/create" element={<PrivateRoute element={<CreateTaskPage />} />} />
                <Route path="/tasks/edit/:id" element={<PrivateRoute element={<EditTaskPage />} />} />
                <Route path="/users" element={<PrivateRoute element={<UsersPage />} />} />
                <Route path="/users/create" element={<PrivateRoute element={<CreateUserPage />} />} />
                <Route path="/users/edit/:id" element={<PrivateRoute element={<EditUserPage />} />} />

                {/* yönlendirmeler */}
                <Route path="*" element={<Navigate to="/tasks" />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
