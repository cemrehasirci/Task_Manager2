import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/api/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(res.data);
            } catch (err) {
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
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            setError('Silme işlemi başarısız.');
        }
    };

    return (
        <Container className="mt-5">
            <h3>Kullanıcılar</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Kullanıcı Adı</th>
                    <th>Rol</th>
                    <th>İşlemler</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>
                            <Button
                                variant="warning"
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
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default UsersPage;
