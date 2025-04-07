import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/Login Page/LoginPage';
import Sidebar from './Pages/Dashboard Page/Components/Sidebar';
import SelectQuestionsPage from './Pages/Dashboard Page/Components/SelectQuestionsPage';
import InsertMarksPage from './Pages/Dashboard Page/Components/InsertMarksPage';
import GenerateReportPage from './Pages/Dashboard Page/Components/GenerateReportPage';
import ErrorPage from './Pages/Error Page/ErrorPage';
import ManageUser from './Pages/Dashboard Page/Components/ManageUser';
import ManageStudents from './Pages/Dashboard Page/Components/ManageStudents';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<Sidebar />} >
            <Route path='/dashboard/selectquestions' element={< SelectQuestionsPage />} />
            <Route path='/dashboard/insertmarks' element={< InsertMarksPage />} />
            <Route path='/dashboard/generatereport' element={< GenerateReportPage />} />
            <Route path='/dashboard/manageuser' element={< ManageUser />} />
            <Route path='/dashboard/managestudent' element={< ManageStudents />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
