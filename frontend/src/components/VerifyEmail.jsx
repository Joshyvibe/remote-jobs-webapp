import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/VerifyEmail.css";

function VerifyEmail() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleChange = (e, index) => {
        const newCode = [...code];
        newCode[index] = e.target.value;

        // Move to next input
        if (e.target.nextSibling && e.target.value) {
            e.target.nextSibling.focus();
        }

        setCode(newCode);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const verificationCode = code.join(""); // Join the array to form the code string
            await api.post("/verify-email/", { email, verification_code: verificationCode });
            setSuccess("Verification successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Verification error:", error.response?.data);
            setError("Invalid verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleVerify} className="form">
                <h2>Verify Your Email</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <div className="form-group">
                    <label htmlFor="code">Verification Code:</label>
                    <div className="code-inputs">
                        {code.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                value={value}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                maxLength="1"
                                className="code-input"
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                </div>
                <button type="submit" className="form-button">
                    {loading ? "Verifying..." : "Verify"}
                </button>
            </form>
        </div>
    );
}

export default VerifyEmail;
