import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import { changePassword } from '../services/authService';

const ResetPasswordPage = () => {
    const { user } = useContext(AuthContext) || {};

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword || !currentPassword) return toast.error('Please fill both fields');
        if (newPassword !== confirmPassword) return toast.error('New password and confirmation do not match');
        try {
            setLoading(true);
            await changePassword({ currentPassword, newPassword });
            toast.success('Password changed successfully');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.error || 'Failed to change password';
            toast.error(msg);
        } finally { setLoading(false); }
    };

    return (
        <div className="container-max py-4">
            <h3 className="fw-bold mb-4">Reset Password</h3>

            <div className="app-card p-3">
                <h5 className="mb-3">Reset Password</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-control" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Updating…' : 'Change Password'}</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
