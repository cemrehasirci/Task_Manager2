import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useAuth();

    let role = '';
    if (token) {
        try {
            role = jwtDecode(token).role;
        } catch (_) {}
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                setUsers(res.data);
            } catch {
                setError('Kullanıcılar alınamadı.');
            }
        };
        fetchUsers();
    }, []);

    const handleEdit = (id) => {
        navigate(`/users/edit/${id}`);
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm(`${id} ID'li kullanıcı silinsin mi?`);
        if (!confirm) return;

        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch {
            setError('Silme işlemi başarısız.');
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Kullanıcılar</h3>
                {role === 'ADMIN' && (
                    <Button variant="primary" onClick={() => navigate('/users/create')}>
                        + Kullanıcı Ekle
                    </Button>
                )}
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Kullanıcı Adı</th>
                    <th>Rol</th>
                    {role === 'ADMIN' && <th>İşlemler</th>}
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        {role === 'ADMIN' && (
                            <td>
                                <Button
                                    variant="secondary"
                                    className="me-2"
                                    onClick={() => handleEdit(user.id)}
                                >
                                    Düzenle
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Sil
                                </Button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default UsersPage;
