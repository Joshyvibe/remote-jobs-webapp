import { useState, useEffect } from "react";    
import {jwtDecode} from 'jwt-decode';
import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN} from "./token";

export const useAuthentication = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            console.log('ACCESS_TOKEN', token);

            if (token) {
                const decoded = jwtDecode(token);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;

                if (tokenExpiration < now) {
                    await refreshToken();

                } else {
                    setIsAuthorized(true);
                }
            } else {
                setIsAuthorized(false);
            }
        };
        auth().catch(() => setIsAuthorized(false)); //
    }, []); 



    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else{
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error('Error refreshing token', error);
            setIsAuthorized(false);
        }
    };


    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        setIsAuthorized(false);
        window.location.reload();
    }

    return { isAuthorized, logout };
}