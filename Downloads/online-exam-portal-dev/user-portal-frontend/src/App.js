import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/pages/loginPage/loginPage';
import StudentHomepage from './components/pages/studentHomepage/studentHomepage';
import TeacherHomepage from './components/pages/teacherHomepage/teacherHomepage';
import StudentRegisterPage from './components/pages/studentRegisterPage/studentRegisterPage';
import TestPage from './components/pages/TakeTest/TestPage';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4338ca', // Modern Indigo
    },
    secondary: {
      main: '#ec4899', // Vibrant Pink
    },
    background: {
      default: '#f4f7f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route exact path='/' element={<LoginPage/>}/>
          <Route exact path='/homeStudent' element={<StudentHomepage/>}/>
          <Route exact path='/homeTeacher' element={<TeacherHomepage/>}/>
          <Route exact path='/studentRegisterPage' element={<StudentRegisterPage/>}/>
          <Route exact path='/takeTestPage' element={<TestPage/>}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
