import React, { useState } from "react";
import api from "../api";
import "../styles/AuthForm.css";

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handlePasswordReset = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.post("/password-reset/", { email });
            setSuccess("If an account with that email exists, a password reset link will be sent.");
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            {loading && (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                </div>
            )}
            {!loading && (
                <div className="auth-form-wrapper">
                    <form onSubmit={handlePasswordReset} className="auth-form">
                        <h2>Password Reset</h2>
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
                        <button type="submit" className="form-button">Send Reset Link</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PasswordReset;
