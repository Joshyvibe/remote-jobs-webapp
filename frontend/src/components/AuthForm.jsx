import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import "../styles/AuthForm.css";
import { Link } from "react-router-dom";

const AuthForm = ({ route, method }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await api.post(route, { email, password });

            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
                window.location.reload();
            } else {
                setSuccess("Registration successful. Please check your email for the verification code.");
                setTimeout(() => {
                    navigate("/verify-email", { state: { email } });
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                if (error.response.status === 401) {
                    setError("Invalid credentials");
                } else if (error.response.status === 400) {
                    setError("Email already exists");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } else if (error.request) {
                setError("Network error. Please check your internet connection.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        const lengthCriteria = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && lengthCriteria) {
            return "Strong";
        } else if (hasUpperCase && hasLowerCase && lengthCriteria) {
            return "Moderate";
        } else if (lengthCriteria) {
            return "Weak";
        } else {
            return "";
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(getPasswordStrength(newPassword));
    };

    return (
        <div className="auth-form-container">
            {loading && (
                <div className="loading-indicator">
                    {error ? <span className="error-message">{error}</span> : <div className="spinner"></div>}
                </div>
            )}
            {!loading && (
                <div className="auth-form-wrapper">
                    <form onSubmit={handleSubmit} className="auth-form">
                        {method === 'register' && (
                            <p className="info-text">⚠️ Please use your business email to ensure smoother approval of your jobs.</p>
                        )}
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                        <div className="form-group">
                            <label htmlFor="email">Email address:</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tunji@company.com" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input 
                                type="password" 
                                id="password" 
                                value={password}  
                                onChange={handlePasswordChange} 
                                required 
                            />
                            {method === 'register' && (
                                <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
                                    {passwordStrength && <p>{passwordStrength}</p>}
                                </div>
                            )}
                        </div>
                        {method === 'register' && (
                            <> 
                                <input 
                                    type="checkbox" 
                                    id="terms" 
                                    required 
                                />
                                
                                <Link to='/terms-and-conditions' className="terms-link">
                                    <p>I agree to the <a>Terms and Conditions</a></p>
                                </Link>
                            </>
                        )}
                        <button type="submit" className="form-button">
                            {method === 'register' ? 'Register' : 'Login'}
                        </button>
                        {method === 'login' && (
                            <p className="toggle-text">Don't have an account? 
                            <span className="toggle-link" onClick={() => navigate("/register")}> Register</span></p>
                        )}
                        {method === 'register' && (
                            <p className="toggle-text">Already have an account? 
                            <span className="toggle-link" onClick={() => navigate("/login")}> Login</span></p>
                        )}
                        {method === 'login' && (
                            <p className="toggle-text">
                                Forgot your password? 
                                <span className="toggle-link" onClick={() => navigate("/password-reset")}> Reset Password</span>
                            </p>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
};

export default AuthForm;
