import React from 'react';
import StudentDashboard from '../../components/templates/StudentDashboard/StudentDashboard';

class StudentHomePage extends React.Component {
    render(){
        return(
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                    <StudentDashboard/>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
                    Designed and developed by <a href="https://www.tiastech.in/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#007bff'}}>TIAS</a>
                </div>
            </div>
        )
    }
}
export default StudentHomePage;
