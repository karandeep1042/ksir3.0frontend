import { React, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProgramID, setSubjectID } from '../../../redux/ID/IDSlice';
import '../../../Css/Dashboard Page/GenerateReportPage.css'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function GenerateReportPage() {

  const programID = useSelector((state) => state.ID.programID);
  const subjectID = useSelector((state) => state.ID.subjectID);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [isNext, setIsNext] = useState();
  const [students, setStudents] = useState([]);
  const [prompttext, setPromptText] = useState();
  const [semester, setSemester] = useState();
  const [program, setProgram] = useState();
  const [division, setDivision] = useState();
  const [subject, setSubject] = useState();
  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentMarks, setStudentMarks] = useState([]);
  const [semCount, setSemCount] = useState(0);
  const [divCount, setDivCount] = useState(0);
  let semarray = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  let divarray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const isSidebarExtended = useSelector((state) => state.ID.isSidebarExtended);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgramList();
    if (window.innerWidth <= 800) {
      document.querySelector('.sidebarmaincontainer').style.transform = "translateX(110vw)";
    }
    if (isSidebarExtended == 1) {
      document.querySelector('.selectquestionspagemaincontainer').classList.add('megaselectquestionspagemaincontainer');
    } else {
      document.querySelector('.selectquestionspagemaincontainer').classList.remove('megaselectquestionspagemaincontainer');
    }
  }, []);

  const fetchProgramList = async () => {
    let res = await fetch(`https://ksir3-0backend.onrender.com/getprogramlist`, {
      credentials: 'include'
    });
    res = await res.json();
    if (res.valid) {
      setPrograms(res.data);
    } else {
      navigate('/');
    }
  }

  const mapsemestersanddivisions = async (e) => {
    document.getElementsByClassName('ddinput')[3].disabled = true;
    document.getElementsByClassName('ddinput')[1].value = "Select...";
    document.getElementsByClassName('ddinput')[2].value = "Select...";
    document.getElementsByClassName('ddinput')[3].value = "Select...";
    setProgram(e.target.value);

    let res = await fetch(`https://ksir3-0backend.onrender.com/getsemanddiv/${e.target.value}`, {
      method: "GET",
      credentials: 'include'
    });
    res = await res.json();
    if (res.valid) {
      dispatch(setProgramID(res.data[0].program_id));
      setSemCount(res.data[0].program_semesters);
      setDivCount(res.data[0].program_divisions);
      document.getElementById('divisiondd').disabled = false;
      document.getElementById('semesterdd').disabled = false;
    }
  }

  const mapsubject = async (e) => {

    document.getElementsByClassName('ddinput')[3].value = "Select..."
    setSemester(e.target.value);
    let res = await fetch(`https://ksir3-0backend.onrender.com/getsubjects/${e.target.value}/${programID}`, {
      method: "GET",
    });
    res = await res.json();
    setSubjects(res);

    let subjectdd = document.getElementById('subjectdd');
    subjectdd.disabled = false;
  }

  const enableQuestionsdd = async (e) => {
    setSubject(e.target.value);
    let data = {
      subject: e.target.value
    }

    let res = await fetch(`https://ksir3-0backend.onrender.com/getsubjectID/${e.target.value}`, {
      method: "GET",
    });

    res = await res.json();
    dispatch(setSubjectID(res[0].subject_id));

  }

  const validateInputs = () => {
    let errcounter = 0;
    let elements = document.getElementsByClassName('ddinput');

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.value === "Select..." && element.disabled === false) {
        errcounter++;
        element.style.border = "2px solid red"
      } else {
        element.style.border = "2px solid #767676"
      }
    }

    if (errcounter === 0) {
      // checkexistingpaper();
      fetchStudentMarks();
    } else {
      toast.error('Please select all the fields!');
    }
  }

  // const checkexistingpaper = async () => {
  //   let res = await fetch(`https://ksir3-0backend.onrender.com/checkexistingpaper/${programID}/${subjectID}/${division}`, {
  //     method: "GET",
  //   });

  //   res = await res.json();

  //   if (res.msg === "doesnotexists") {
  //     document.querySelector('.reporttablemaincontainer').style.display = "none";
  //     toast.error('Record not found! Please insert marks first!');
  //   } else {
  //     document.querySelector('.reporttablemaincontainer').style.display = "block";
  //     fetchStudentMarks();
  //     toast.info('Record found!');
  //   }
  // }
  
  const fetchStudentMarks = async (rollno) => {
    let res = await fetch(`https://ksir3-0backend.onrender.com/fetchreport/${subjectID}/${division}`, {
      method: "GET",
    });
    
    res = await res.json();
    if (res.msg !== "empty") {
      toast.info('Record found!');
      document.querySelector('.reporttablemaincontainer').style.display = "block";
      setStudentMarks(res);
    } else {
      toast.error('Record not found! Please insert marks first!');
      document.querySelector('.reporttablemaincontainer').style.display = "none";
    }
  }

  const downloadpdf = async () => {
    try {

      let res = await fetch(`https://ksir3-0backend.onrender.com/downloadpdf/${subjectID}/${division}/${semester}`, {
        method: "GET",
        responseType: 'application/pdf'
      });


      res = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(res);
      link.download = `${new Date().getTime()}.pdf`
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      // console.log(err);
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="selectquestionspagemaincontainer">
        <div className="selectquestionpagechildcontainer">
          <div className="selectcoursesection">
            <div className="selectcourseheader">
              <p>Select Paper Details</p>
            </div>
            <div className="selectcoursebody">
              <div className="selectcourseobdyrow">
                <div className="selectcoursebodyitem">
                  <p>Select Program</p>
                  <select className='ddinput' onChange={(e) => { mapsemestersanddivisions(e) }}>
                    <option>Select...</option>
                    {programs.map((item, index) => (
                      <>
                        <option value={item.program_name}>{item.program_name}</option>
                      </>
                    ))}
                  </select>
                </div>
                <div className="selectcoursebodyitem">
                  <p>Select Semester</p>
                  <select className='ddinput' disabled id='semesterdd' onChange={(e) => { mapsubject(e) }}>
                    <option>Select...</option>
                    {semarray.map((item, index) => (
                      <>
                        {index < semCount ? <option value={index + 1}>{item}</option> : null}
                      </>
                    ))}
                  </select>
                </div>
              </div>
              <div className="selectcourseobdyrow">
                <div className="selectcoursebodyitem">
                  <p>Select Division</p>
                  <select id='divisiondd' className='ddinput' disabled={true} onChange={(e) => { setDivision(e.target.value) }}>
                    <option>Select...</option>
                    {divarray.map((item, index) => (
                      <>
                        {index < divCount ? <option value={item}>{item}</option> : null}
                      </>
                    ))}
                  </select>
                </div>
                <div className="selectcoursebodyitem">
                  <p>Select Subject</p>
                  <select id='subjectdd' className='ddinput' disabled onChange={enableQuestionsdd}>
                    <option>Select...</option>
                    {subjects.map((item, index) => (
                      <>
                        <option value={item.subject_name}>{item.subject_name}</option>
                      </>
                    ))}
                  </select>
                </div>
              </div>
              <div className="selectpapersubmitbtncontainer">
                <div id='selectpapersubmitbtn' className="submitbtn" onClick={validateInputs}>
                  Submit
                </div>
              </div>
            </div>
          </div>
          <div className="reporttablemaincontainer">
            <div className="selectcourseheader genratereporttableheader">
              <p>Report</p>
              <div className="selectpapersubmitbtncontainer">
                <div id='selectpapersubmitbtn' className="submitbtn" onClick={downloadpdf}>
                  Download
                </div>
              </div>
            </div>
            <div className="reporttablebody">
              <table cellSpacing={0} >
                <thead>
                  <tr className='tableheaderrow'>
                    <th width="700">Roll no</th>
                    <th width="700">Q1</th>
                    <th width="700">Q2</th>
                    <th width="700">Q3</th>
                    <th width="700">Q4</th>
                    <th width="700">Q5</th>
                    <th width="700">Q6</th>
                    <th width="700">Score</th>
                    <th width="700">Attaintment</th>
                  </tr>
                </thead>
                {studentMarks.map((item, index) => (
                  <>
                    <tr align="center" bgcolor={index % 2 == 0 ? "white" : "#F2F3F2"} color={index % 2 == 0 ? "blue" : "red"}>
                      <td border={0} >{item.student_rollno}</td>
                      <td>{item.Q1}</td>
                      <td>{item.Q2}</td>
                      <td>{item.Q3}</td>
                      <td>{item.Q4}</td>
                      <td>{item.Q5}</td>
                      <td>{item.Q6}</td>
                      <td>{item.score}</td>
                      <td>{item.attaintment}</td>
                    </tr>
                  </>
                ))}
                {/* <tr>Roll no</tr> */}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
