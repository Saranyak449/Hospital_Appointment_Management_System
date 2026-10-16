import React, { useState, useEffect } from 'react';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientName: '', phone: '', doctorName: '', date: '', time: ''
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (currentTab === 'appointments' && isAdminLoggedIn) {
      fetch('http://localhost:5000/api/appointments')
        .then(res => res.json())
        .then(data => setAppointments(data))
        .catch(err => console.error("Error connecting to backend:", err));
    }
  }, [currentTab, isAdminLoggedIn]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e) => {
    setAdminCredentials({ ...adminCredentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        alert("🎉 " + data.message);
        setFormData({ patientName: '', phone: '', doctorName: '', date: '', time: '' });
        
        // If already admin, redirect straight to panel; else ask them to look at landing
        if (isAdminLoggedIn) {
          setCurrentTab('appointments');
        } else {
          setCurrentTab('home');
        }
      }
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Setting dummy presentation credentials: admin / admin123
    if (adminCredentials.username === 'admin' && adminCredentials.password === 'admin123') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      setCurrentTab('appointments'); // Direct entry to backend table database visualizer
    } else {
      setLoginError('❌ Invalid Credentials! Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminCredentials({ username: '', password: '' });
    setCurrentTab('home');
  };


  const navItemStyle = (tab) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    color: currentTab === tab ? '#2ea1a1' : '#555',
    borderBottom: currentTab === tab ? '3px solid #007BFF' : '3px solid transparent',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  });

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', margin: 0 }}>
      
      {/* 🏥 HEADER & NAVBAR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 50px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setCurrentTab('home')}>
          <span style={{ fontSize: '28px' }}>🏥</span>
          <h2 style={{ margin: 0, color: '#007BFF' }}>MedCare Hospital</h2>
        </div>
        <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={navItemStyle('home')} onClick={() => setCurrentTab('home')}>Home</div>
          <div style={navItemStyle('doctors')} onClick={() => setCurrentTab('doctors')}>Our Doctors</div>
          <div style={navItemStyle('book')} onClick={() => setCurrentTab('book')}>Book Appointment</div>
          
          {isAdminLoggedIn ? (
            <>
              <div style={navItemStyle('appointments')} onClick={() => setCurrentTab('appointments')}>Admin Dashboard</div>
              <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <div style={navItemStyle('admin-login')} onClick={() => setCurrentTab('admin-login')}>Admin Login 🔑</div>
          )}
        </nav>
      </header>

      {/* 🏠 VIEW 1: HOME PAGE */}
      {currentTab === 'home' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)', color: 'white', padding: '80px 50px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '42px', marginBottom: '20px' }}>Your Health Is Our Top Priority</h1>
            <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px' }}>Access world-class healthcare with top-tier modern specialists. Book an appointment online in under 2 minutes.</p>
            <button onClick={() => setCurrentTab('book')} style={{ padding: '15px 30px', backgroundColor: '#fff', color: '#007BFF', border: 'none', borderRadius: '3px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>Book an Appointment Now</button>
          </div>

          <div style={{ padding: '60px 50px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>Our Medical Services</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
              {['Emergency Care 🚨', 'Cardiology ❤️', 'Pediatrics 👶', 'Neurology 🧠'].map((service, i) => (
                <div key={i} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #eee' }}>
                  <h3>{service}</h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>Providing comprehensive, state-of-the-art diagnostic and surgical care options tailored to you.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 👨‍⚕️ VIEW 2: DOCTORS PAGE */}
      {currentTab === 'doctors' && (
        <div style={{ padding: '50px', maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Meet Our Expert Doctors</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>Highly qualified specialists available all through the week.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {[
              { name: 'Dr. Arul Kumar', spec: 'Cardiologist (Heart Specialist)', exp: '14 Yrs Experience' },
              { name: 'Dr. Priya Sharma', spec: 'Pediatrician (Child Care)', exp: '10 Yrs Experience' },
              { name: 'Dr. Rajesh Patel', spec: 'Neurologist (Brain Expert)', exp: '18 Yrs Experience' }
            ].map((doc, idx) => (
              <div key={idx} style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                <div style={{ background: '#e9ecef', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '60px' }}>👨‍⚕️</div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{doc.name}</h3>
                  <p style={{ color: '#007BFF', margin: '0 0 5px 0', fontWeight: '600' }}>{doc.spec}</p>
                  <p style={{ color: '#777', fontSize: '14px' }}>{doc.exp}</p>
                  <button onClick={() => { setFormData({...formData, doctorName: doc.name}); setCurrentTab('book'); }} style={{ width: '100%', marginTop: '15px', padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Select & Book</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📅 VIEW 3: APPOINTMENT BOOKING FORM */}
      {currentTab === 'book' && (
        <div style={{ padding: '50px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: '#fff', padding: '35px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h2 style={{ marginTop: 0, color: '#333', textAlign: 'center' }}>Book Your Consultation</h2>
            <p style={{ textAlign: 'center', color: '#777', marginBottom: '30px' }}>Fill out the details below to lock your slot directly into our hospital database.</p>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Patient Full Name</label>
                <input type="text" name="patientName" placeholder="Enter patient name" value={formData.patientName} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Phone Number</label>
                <input type="tel" name="phone" placeholder="Enter mobile number" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Assigned Doctor</label>
                <select name="doctorName" value={formData.doctorName} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}>
                  <option value="">-- Choose a Specialist --</option>
                  <option value="Dr. Arul Kumar">Dr. Arul Kumar (Cardiology)</option>
                  <option value="Dr. Priya Sharma">Dr. Priya Sharma (Pediatrics)</option>
                  <option value="Dr. Rajesh Patel">Dr. Rajesh Patel (Neurology)</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Preferred Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
              </div>
              <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(40,167,69,0.2)' }}>Confirm Secure Appointment</button>
            </form>
          </div>
        </div>
      )}

      {/* 🔑 VIEW 4: NEW ADMIN LOGIN SCREEN */}
      {currentTab === 'admin-login' && (
        <div style={{ padding: '80px 20px', maxWidth: '450px', margin: '0 auto' }}>
          <div style={{ background: '#fff', padding: '35px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h2 style={{ marginTop: 0, color: '#333', textAlign: 'center' }}>Admin Portal Gateway</h2>
            <p style={{ textAlign: 'center', color: '#777', marginBottom: '25px' }}>Restricted Area. Authorized medical personnel credentials required.</p>
            
            {loginError && <div style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', textAlign: 'center', marginBottom: '20px', fontWeight: '500' }}>{loginError}</div>}
            
            <form onSubmit={handleAdminLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Admin Username</label>
                <input type="text" name="username" placeholder="Enter username" value={adminCredentials.username} onChange={handleAdminChange} required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Security Password</label>
                <input type="password" name="password" placeholder="Enter password" value={adminCredentials.password} onChange={handleAdminChange} required style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Verify & Unlock Dashboard</button>
            </form>
          </div>
        </div>
      )}

      {/* 📊 VIEW 5: SECURED LIVE APPOINTMENTS LIST */}
      {currentTab === 'appointments' && isAdminLoggedIn && (
        <div style={{ padding: '50px', maxWidth: '950px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '10px' }}>Hospital Live Dashboard</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Real-time upcoming schedules fetched directly from your local MongoDB instance.</p>
          
          {appointments.length === 0 ? (
            <div style={{ padding: '40px', background: '#fff', textAlign: 'center', borderRadius: '8px', border: '1px solid #eee', color: '#777' }}>No appointments booked yet.</div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #eee' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#007BFF', color: 'white' }}>
                    <th style={{ padding: '15px' }}>Patient Name</th>
                    <th style={{ padding: '15px' }}>Contact Phone</th>
                    <th style={{ padding: '15px' }}>Assigned Doctor</th>
                    <th style={{ padding: '15px' }}>Date</th>
                    <th style={{ padding: '15px' }}>Time</th>
                    <th style={{ padding: '15px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px', fontWeight: '500' }}>{appt.patientName}</td>
                      <td style={{ padding: '15px', color: '#555' }}>{appt.phone}</td>
                      <td style={{ padding: '15px', color: '#007BFF', fontWeight: '500' }}>{appt.doctorName}</td>
                      <td style={{ padding: '15px' }}>{appt.date}</td>
                      <td style={{ padding: '15px' }}>{appt.time}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ backgroundColor: '#e2f6ea', color: '#28a745', padding: '5px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{appt.status || 'Active'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;