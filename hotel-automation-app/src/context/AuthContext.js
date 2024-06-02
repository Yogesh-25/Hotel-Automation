import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [useremail, setUseremail] = useState(localStorage.getItem('useremail') || '');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

    const signIn = (username, useremail, userId) => {
        setUsername(username);
        setUseremail(useremail);
        setUserId(userId);
        localStorage.setItem('username', username);
        localStorage.setItem('useremail', useremail);
        localStorage.setItem('userId', userId);
    };

    const signOut = () => {
        setUsername('');
        setUseremail('');
        setUserId('');
        localStorage.removeItem('username');
        localStorage.removeItem('useremail');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ username, useremail, userId, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
