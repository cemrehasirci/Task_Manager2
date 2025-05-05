// src/components/UserInfoBox.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import './UserInfoBox.css'; // 👈 özel stil

function UserInfoBox() {
    const { token } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!token) return;
        const { sub } = jwtDecode(token); // sub = username
        api.get(`/users`)
            .then(res => {
                const current = res.data.find(u => u.username === sub);
                setUser(current);
            })
            .catch(err => console.error("Kullanıcı bilgisi alınamadı", err));
    }, [token]);

    if (!user) return null;

    return (
        <div className="user-sidebar">
            <h5>👤 Profil</h5>
            <p><strong>Kullanıcı:</strong><br /> {user.username}</p>
            <p><strong>Rol:</strong><br /> {user.role}</p>
            <p><strong>Görev Sayısı:</strong><br /> {user.taskIds.length}</p>
        </div>
    );
}

export default UserInfoBox;
