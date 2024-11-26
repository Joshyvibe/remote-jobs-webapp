import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/AuthForm.css";

const PasswordResetConfirm = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handlePasswordResetConfirm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await api.post(`/password-reset-confirm/${uidb64}/${token}/`, { password, confirm_password: confirmPassword });
            setSuccess("Your password has been reset successfully.");
            setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
        } catch (error) {
            console.error(error);
            setError("Invalid token or user ID.");
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
                    <form onSubmit={handlePasswordResetConfirm} className="auth-form">
                        <h2>Reset Password</h2>
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                        <div className="form-group">
                            <label htmlFor="password">New Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        <button type="submit" className="form-button">Reset Password</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PasswordResetConfirm;
