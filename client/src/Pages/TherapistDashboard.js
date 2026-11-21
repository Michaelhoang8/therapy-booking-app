import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VitalCareLogo from '../VitalCare.png';

export default function TherapistDashboard() {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('');
  const [hoveredTab, setHoveredTab] = useState('');
  const [error, setError] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAvailModal, setShowAvailModal] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [availDate, setAvailDate] = useState('');
  const [availStart, setAvailStart] = useState('');
  const [availEnd, setAvailEnd] = useState('');

  const navigate = useNavigate();
  const therapistId = localStorage.getItem('therapistId');
  const therapistName = localStorage.getItem('username') || 'Therapist';
  const token = localStorage.getItem('token');

  const buttonBlue = {
    backgroundColor: '#0a3d91',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const tabStyle = (tabKey) => {
    const active = tabKey === filter;
    const hovered = tabKey === hoveredTab;
    let bg = '#fff', color = '#0a3d91', borderBottom = '4px solid transparent';
    if (active) { bg = '#0a3d91'; color = '#fff'; borderBottom = '4px solid #003d5c'; }
    else if (hovered) { bg = '#e6f0ff'; }
    return {
      flex: 1, padding: '12px 0', textAlign: 'center', cursor: 'pointer',
      backgroundColor: bg, color, border: 'none', borderBottom, fontWeight: active ? 'bold' : 'normal',
      transition: 'background-color 0.2s'
    };
  };

  const load = async (status) => {
    setFilter(status);
    setError('');
    try {
      const url = status
        ? `/api/therapists/${therapistId}/appointments?status=${status}`
        : `/api/therapists/${therapistId}/appointments`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(res.statusText);
      setSessions(await res.json());
    } catch (e) {
      console.error(e);
      setError('Could not load sessions');
    }
  };

  useEffect(() => { load(''); }, []);

  const completeSession = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PATCH', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ status:'Completed' })
      });
      if (!res.ok) throw new Error(await res.text());
      load(filter);
    } catch (e) {
      console.error(e);
      setError(`Failed to complete session: ${e.message}`);
    }
  };

  const openNotes = async (session, viewOnly=false) => {
    setSelectedSession(session);
    setIsViewOnly(viewOnly);
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/session-notes/${session.appointment_id}`, {
        headers: { Authorization:`Bearer ${token}` }
      });
      if (!res.ok) {
        setNotesText(viewOnly ? 'No notes found' : '');
      } else {
        const data = await res.json();
        setNotesText(data.therapist_notes || '');
      }
    } catch (e) {
      console.error(e);
      setNotesText('Error loading notes');
    }
    setShowNotesModal(true);
  };

  const saveNotes = async () => {
    try {
      await fetch(`http://localhost:5000/api/session-notes`, {
        method: 'POST', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ appointmentId:selectedSession.appointment_id, therapistNotes: notesText })
      });
      setShowNotesModal(false);
      load(filter);
    } catch (e) {
      console.error(e);
      setError('Failed to save notes');
    }
  };

  const saveAvailability = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/availability', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ Therapist_ID: Number(therapistId), Date:availDate, Start_Time:availStart, End_Time:availEnd, Status:'Available' })
      });
      if (!res.ok) throw new Error(await res.text());
      setShowAvailModal(false);
      setAvailDate(''); setAvailStart(''); setAvailEnd('');
    } catch (e) {
      console.error(e);
      setError(`Failed to save availability: ${e.message}`);
    }
  };

  return (
    <div style={{ fontFamily:'Arial, sans-serif', background:'#f8f9fc', minHeight:'100vh' }}>
      <header style={{ position:'relative', padding:'16px 24px', textAlign:'center', background:'#f8f9fc' }}>
        <button style={{...buttonBlue, position:'absolute', left:'24px', top:'50%', transform:'translateY(-50%)' }} onClick={()=>setShowAvailModal(true)}>Set Availability</button>
        <img src={VitalCareLogo} alt="Logo" style={{ height:50, display:'inline-block' }}/>
        <button style={{...buttonBlue, position:'absolute', right:'24px', top:'50%', transform:'translateY(-50%)' }} onClick={()=>navigate('/')}>Log Out</button>
      </header>

      <div style={{ textAlign:'center', margin:'24px 0' }}><h2 style={{ color:'#0a3d91' }}>Welcome, {therapistName}!</h2></div>

      <nav style={{ display:'flex', maxWidth:800, margin:'0 auto', borderBottom:'1px solid #ccc' }}>
        {['','Scheduled','Completed','Cancelled'].map(s=>(
          <button key={s||'All'} onClick={()=>load(s)} onMouseEnter={()=>setHoveredTab(s)} onMouseLeave={()=>setHoveredTab('')} style={tabStyle(s)}>{s||'Show All'}</button>
        ))}
      </nav>

      {error && <div style={{ color:'#e53e3e', textAlign:'center', marginTop:16 }}>{error}</div>}

      <div style={{ padding:'24px', maxWidth:800, margin:'0 auto' }}>
        {sessions.map(s=>(
          <div key={s.appointment_id} style={{ background:'#fff', borderRadius:8, boxShadow:'0 1px 3px rgba(0,0,0,0.1)', marginBottom:16, overflow:'hidden' }}>
            <div style={{ background:'#e9ecef', padding:'12px 16px', fontWeight:'bold' }}>{new Date(s.date).toLocaleString()}</div>
            <div style={{ padding:'12px 16px' }}>
              <p><strong>Patient:</strong> {s.patient_name}</p>
              <p><strong>Type:</strong> {s.session_type}</p>
              <p><strong>Status:</strong> {s.status}</p>
            </div>
            <div style={{ padding:'12px 16px', display:'flex', gap:8 }}>
              {s.status==='Scheduled' && <button style={buttonBlue} onClick={()=>completeSession(s.appointment_id)}>Complete</button>}
              {s.status==='Completed' && <>
                <button style={buttonBlue} onClick={()=>openNotes(s,false)}>Add Notes</button>
                <button style={buttonBlue} onClick={()=>openNotes(s,true)}>View Notes</button>
              </>}
            </div>
          </div>
        ))}
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', padding:24, borderRadius:8, width:400 }}>
            <h3>{isViewOnly ? 'View Session Notes' : 'Add Session Notes'}</h3>
            <textarea rows={4} style={{ width:'100%', padding:8, marginBottom:16, border:'1px solid #ccc', borderRadius:4 }} value={notesText} onChange={e=>setNotesText(e.target.value)} disabled={isViewOnly}/>
            <div style={{ textAlign:'right' }}>
              <button style={{ ...buttonBlue, backgroundColor:'#6c757d', marginRight:8 }} onClick={()=>setShowNotesModal(false)}>Close</button>
              {!isViewOnly && <button style={buttonBlue} onClick={saveNotes}>Save</button>}
            </div>
          </div>
        </div>
      )}

      {/* Availability Modal */}
      {showAvailModal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', padding:24, borderRadius:8, width:400 }}>
            <h3>Add Availability</h3>
            <div style={{ marginBottom:12 }}>
              <label>Date:</label><br/>
              <input type="date" value={availDate} onChange={e=>setAvailDate(e.target.value)} style={{ width:'100%', padding:8 }}/>
            </div>
            <div style={{ marginBottom:12, display:'flex', gap:8 }}>
              <div style={{ flex:1 }}>
                <label>Start Time:</label><br/>
                <input type="time" value={availStart} onChange={e=>setAvailStart(e.target.value)} style={{ width:'100%', padding:8 }}/>
              </div>
              <div style={{ flex:1 }}>
                <label>End Time:</label><br/>
                <input type="time" value={availEnd} onChange={e=>setAvailEnd(e.target.value)} style={{ width:'100%', padding:8 }}/>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <button style={{ ...buttonBlue, backgroundColor:'#6c757d', marginRight:8 }} onClick={()=>setShowAvailModal(false)}>Cancel</button>
              <button style={buttonBlue} onClick={saveAvailability}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
