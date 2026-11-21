import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VitalCareLogo from '../VitalCare.png';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('Patients');
  const [hoveredTab, setHoveredTab] = useState('');
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const adminName = localStorage.getItem('username') || 'Admin';

  // Styles
  const buttonBlue = {
    backgroundColor: '#0a3d91',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 4,
    cursor: 'pointer'
  };

  const tabStyle = (tab) => {
    const isActive = activeTab === tab;
    const isHovered = hoveredTab === tab;
    let backgroundColor = '#fff';
    if (isActive) backgroundColor = '#0a3d91';
    else if (isHovered) backgroundColor = '#e6f0ff';
    return {
      flex: 1,
      textAlign: 'center',
      padding: '12px 0',
      cursor: 'pointer',
      backgroundColor,
      color: isActive ? '#fff' : '#0a3d91',
      borderBottom: isActive ? '4px solid #003d5c' : '4px solid transparent',
      transition: 'background-color 0.2s'
    };
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: 16,
    marginBottom: 12
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))',
    gap: 16
  };

  useEffect(() => {
    async function fetchAll() {
      try {
        let res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
        const allUsers = res.ok ? await res.json() : [];
        setUsers(allUsers.filter(u => u.role === 'Patient'));

        res = await fetch('/api/therapists', { headers: { Authorization: `Bearer ${token}` } });
        const allTher = res.ok ? await res.json() : [];
        setTherapists(allTher);

        res = await fetch('/api/appointmentsall', { headers: { Authorization: `Bearer ${token}` } });
        const allSess = res.ok ? await res.json() : [];
        setSessions(allSess);
      } catch (e) {
        console.error(e);
        setError('Failed to load data');
      }
    }
    fetchAll();
  }, [token]);

  const handleCancelClick = (session) => {
    setSessionToCancel(session);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
      await fetch(`/api/appointmentcancel/${sessionToCancel.appointment_id}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSessions(prev => prev.filter(s => s.appointment_id !== sessionToCancel.appointment_id));
      setShowCancelModal(false);
      setSessionToCancel(null);
    } catch (e) {
      console.error(e);
      setError('Failed to cancel session');
      setShowCancelModal(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ position: 'relative', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={VitalCareLogo} alt="Logo" style={{ height: 50 }} />
        </div>
        <button
          style={{ ...buttonBlue, position: 'absolute', top: 16, right: 24, width: 'auto' }}
          onClick={() => navigate('/')}
        >
          Log Out
        </button>
      </header>

      {/* Greeting */}
      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <h2 style={{ color: '#0a3d91' }}>{`Welcome, ${adminName}!`}</h2>
      </div>

      {/* Tabs */}
      <nav style={{ display: 'flex', maxWidth: 800, margin: '0 auto 24px', borderBottom: '1px solid #ccc' }}>
        {['Patients', 'Therapists', 'Sessions'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            onMouseEnter={() => setHoveredTab(tab)}
            onMouseLeave={() => setHoveredTab('')}
            style={tabStyle(tab)}
          >
            {tab}
          </div>
        ))}
      </nav>

      {error && <p style={{ color: '#e53e3e', textAlign: 'center' }}>{error}</p>}

      <main style={{ padding: '0 24px 24px', maxWidth: 800, margin: '0 auto' }}>
        {activeTab === 'Patients' && (
          <div style={gridStyle}>
            {users.map(u => (
              <div key={u.user_id} style={cardStyle}>
                <p><strong>Name:</strong> {u.name}</p>
                <p><strong>Email:</strong> {u.email}</p>
                <p><strong>Phone:</strong> {u.phone_number}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Therapists' && (
          <div style={gridStyle}>
            {therapists.map(t => (
              <div key={t.therapist_id} style={cardStyle}>
                <p><strong>Name:</strong> {t.name}</p>
                <p><strong>Email:</strong> {t.email}</p>
                <p><strong>Phone:</strong> {t.phone_number}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Sessions' && (
          <div style={gridStyle}>
            {sessions.map(s => (
              <div key={s.appointment_id} style={cardStyle}>
                <p><strong>Patient:</strong> {s.patient_name}</p>
                <p><strong>Therapist:</strong> {s.therapist_name}</p>
                <p><strong>Type:</strong> {s.session_type}</p>
                <p><strong>Status:</strong> {s.status}</p>
                <p><strong>Date:</strong> {new Date(s.date).toLocaleString()}</p>
                {s.status === 'Scheduled' && (
                  <button
                    style={{ ...buttonBlue, marginTop: 8 }}
                    onClick={() => handleCancelClick(s)}
                  >
                    Cancel Session
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, width: 400 }}>
            <h3>Confirm Cancellation</h3>
            <p>Are you sure you want to cancel this session?</p>
            <div style={{ textAlign: 'right' }}>
              <button
                style={{ ...buttonBlue, backgroundColor: '#6c757d', marginRight: 8 }}
                onClick={() => setShowCancelModal(false)}
              >
                No, keep session
              </button>
              <button style={buttonBlue} onClick={confirmCancel}>
                Yes, cancel session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
