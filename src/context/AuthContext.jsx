import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, findUserByEmail, updateUser } from '../services/userDb';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('pokedoc_user');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('pokedoc_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('pokedoc_user');
        }
    }, [user]);

    /**
     * Log in by email. Looks up the user in the local DB.
     * Returns { success: true } or { success: false, error: '...' }.
     */
    const login = (email) => {
        const found = findUserByEmail(email);
        if (!found) {
            return { success: false, error: 'No account found with that email. Please sign up first.' };
        }
        setUser({
            email: found.email, name: found.name, phone: found.phone,
            dob: found.dob, gender: found.gender, height: found.height,
            weight: found.weight, bloodType: found.bloodType,
            allergies: found.allergies, conditions: found.conditions,
            createdAt: found.createdAt,
        });
        return { success: true };
    };

    /**
     * Register a new user and log them in.
     * Returns { success: true } or { success: false, error: '...' }.
     */
    const signup = ({ name, email, phone, dob, gender, height, weight, bloodType, allergies, conditions }) => {
        const fields = { name, email, phone, dob, gender, height, weight, bloodType, allergies, conditions };
        const created = registerUser(fields);
        if (!created) {
            return { success: false, error: 'An account with that email already exists. Please log in instead.' };
        }
        setUser({
            email: created.email, name: created.name, phone: created.phone,
            dob: created.dob, gender: created.gender, height: created.height,
            weight: created.weight, bloodType: created.bloodType,
            allergies: created.allergies, conditions: created.conditions,
            createdAt: created.createdAt,
        });
        return { success: true };
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
