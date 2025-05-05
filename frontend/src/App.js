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

function App() {
  const token = localStorage.getItem('token');

  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {token ? (
              <>
                <Route path="/tasks" element={<TaskPage />} />
                <Route path="/tasks/create" element={<CreateTaskPage />} />
                <Route path="/tasks/edit/:id" element={<EditTaskPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/create" element={<CreateUserPage />} />
                <Route path="/users/edit/:id" element={<EditUserPage />} />
                <Route path="*" element={<Navigate to="/tasks" />} />
              </>
          ) : (
              <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
  );
}

export default App;
