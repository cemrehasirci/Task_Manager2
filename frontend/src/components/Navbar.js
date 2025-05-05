import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

function AppNavbar() {
    const navigate = useNavigate();
    const { token, logout } = useAuth();

    let role = '';
    if (token) {
        try {
            const decoded = jwtDecode(token);
            role = decoded.role;
        } catch (e) {
            role = '';
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Task Manager</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        {token ? (
                            <>
                                <Nav.Link as={Link} to="/tasks">Görevler</Nav.Link>
                                <Nav.Link as={Link} to="/users">Kullanıcılar</Nav.Link>
                                <Button variant="outline-light" size="sm" onClick={handleLogout} className="ms-2">
                                    Çıkış
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Giriş</Nav.Link>
                                <Nav.Link as={Link} to="/register">Kayıt Ol</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
