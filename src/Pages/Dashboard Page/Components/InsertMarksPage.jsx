import { React, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProgramID, setSubjectID } from '../../../redux/ID/IDSlice';
import '../../../Css/Dashboard Page/InsertMarksPage.css'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InsertMarksPage() {

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
  const [semCount, setSemCount] = useState(0);
  const [divCount, setDivCount] = useState(0);
  let semarray = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  let divarray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSidebarExtended = useSelector((state) => state.ID.isSidebarExtended);

  useEffect(() => {
    fetchProgramList();
    if (window.innerWidth <= 800) {
      document.querySelector('.sidebarmaincontainer').style.transform = "translateX(110vw)";
    }
    console.log(isSidebarExtended);
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
    let data = {
      coursename: e.target.value
    }

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
      checkexistingpaper();
    } else {
      toast.error('Please Select all the fields!');
    }
  }

  const checkexistingpaper = async () => {
    let res = await fetch(`https://ksir3-0backend.onrender.com/checkexistingpaper/${programID}/${subjectID}/${division}`, {
      method: "GET",
    });

    res = await res.json();

    if (res.msg === "doesnotexists") {
      document.querySelector('.insertmarkssection').style.display = "none";
      toast.error('Record not found. Please insert the paper details first!');
    } else {
      toast.info('Record found. Please details fetched!')
      document.querySelector('.insertmarkssection').style.display = "flex";
      let elements = document.getElementsByClassName('insertmarksquestionnumber');
      elements[0].innerHTML = res.data[0].q1;
      elements[1].innerHTML = res.data[0].q2;
      elements[2].innerHTML = res.data[0].q3;
      elements[3].innerHTML = res.data[0].q4;
      elements[4].innerHTML = res.data[0].q5;
      elements[5].innerHTML = res.data[0].q6;
      fetchstudentsbyprogramanddiv();
      let ddelements = document.getElementsByClassName('ddinput');
      for (let i = 0; i < ddelements.length; i++) {
        ddelements[i].disabled = true;
      }
      let submitbtn = document.getElementById('selectpapersubmitbtn');
      // console.log(submitbtn);
      submitbtn.removeAttribute("onClick");
      submitbtn.style.backgroundColor = "#afafaf"
      submitbtn.style.cursor = "auto"
    }
  }

  const fetchstudentsbyprogramanddiv = async () => {

    let res = await fetch(`https://ksir3-0backend.onrender.com/fetchstudentsbyprogramanddivandsem/${programID}/${division}`, {
      method: "GET",
    });

    res = await res.json();
    setStudents(res);
    // console.log(currentStudentIndex);
    fetchStudentMarks(res[0].student_rollno);
  }

  const movetoNextStudent = (e) => {
    let errorcounter = 0;
    let elements = document.getElementsByClassName('marksinput');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.value === "") {
        errorcounter++;
        element.style.border = "2px solid red"
      } else {
        element.style.border = "2px solid rgb(184, 184, 184)"
      }
    }

    if (errorcounter === 0) {
      insertStudentMarks();
    } else {
      toast.error('Please Enter marks in all the fields');
    }
  }

  const insertStudentMarks = async () => {
    let elements = document.getElementsByClassName('marksinput');
    let m1 = parseInt(elements[0].value);
    let m2 = parseInt(elements[1].value);
    let m3 = parseInt(elements[2].value);
    let m4 = parseInt(elements[3].value);
    let m5 = parseInt(elements[4].value);
    let m6 = parseInt(elements[5].value);

    let score = m1 + m2 + m3 + m4 + m5 + m6;
    let attaintment = (score / (6 * 4)).toFixed(2);
    // console.log(typeof (score));
    // console.log(score);
    let data = {
      rollno: students[currentStudentIndex].student_rollno,
      subject: subjectID,
      division,
      m1,
      m2,
      m3,
      m4,
      m5,
      m6,
      score,
      attaintment
    }

    let res = await fetch(`https://ksir3-0backend.onrender.com/insertstudentmarks`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });

    res = await res.json();
    // console.log(res);

    if (res.msg === "success" && currentStudentIndex < students.length - 1) {

      let element = currentStudentIndex
      element++;
      setCurrentStudentIndex(element);
      // console.log("cccc");
      fetchStudentMarks();
    } else {
      let msg = document.getElementById('endofrecordmessage');
      msg.style.visibility = "visible";
    }
  }

  const fetchStudentMarks = async (rollno) => {
    let data = {
      studentId: rollno || students[currentStudentIndex].student_rollno + 1,
      subjectID,
      division
    }

    let res = await fetch(`https://ksir3-0backend.onrender.com/fetchstudentmarks/${data.studentId}/${subjectID}/${division}`, {
      method: "GET",
    });

    res = await res.json();
    // console.log(res);

    let elements = document.getElementsByClassName('marksinput');
    if (res.msg === "empty") {
      elements[0].value = "";
      elements[1].value = "";
      elements[2].value = "";
      elements[3].value = "";
      elements[4].value = "";
      elements[5].value = "";
    } else {
      elements[0].value = res[0].Q1;
      elements[1].value = res[0].Q2;
      elements[2].value = res[0].Q3;
      elements[3].value = res[0].Q4;
      elements[4].value = res[0].Q5;
      elements[5].value = res[0].Q6;
    }
  }

  const movetoPrevStudent = (e) => {
    let errorcounter = 0;
    let elements = document.getElementsByClassName('marksinput');
    // console.log(elements);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      console.log(element.value);
      if (element.value === "") {
        errorcounter++;
        element.style.border = "2px solid red"
      } else {
        element.style.border = "2px solid rgb(184, 184, 184)"
      }
    }

    if (errorcounter === 0) {
      insertStudentMarksPrev();
    } else {
      toast.error('Please Enter marks in all the fields');
    }
    // console.log(isNext);
  }

  const insertStudentMarksPrev = async () => {
    let elements = document.getElementsByClassName('marksinput');
    let m1 = parseInt(elements[0].value);
    let m2 = parseInt(elements[1].value);
    let m3 = parseInt(elements[2].value);
    let m4 = parseInt(elements[3].value);
    let m5 = parseInt(elements[4].value);
    let m6 = parseInt(elements[5].value);

    let score = (m1 + m2 + m3 + m4 + m5 + m6) / 6;
    let attaintment = (score / (6 * 4)).toFixed(2);

    let data = {
      rollno: students[currentStudentIndex].student_rollno,
      subject: subjectID,
      division,
      m1,
      m2,
      m3,
      m4,
      m5,
      m6,
      score,
      attaintment
    }

    let res = await fetch(`https://ksir3-0backend.onrender.com/insertstudentmarks`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });

    res = await res.json();

    if (res.msg === "success") {
      // let msg = document.getElementById('endofrecordmessage');
      // msg.style.visibility = "hidden";
      let element = currentStudentIndex
      element--;
      setCurrentStudentIndex(element);
      fetchStudentMarksPrev();
    }
  }

  const fetchStudentMarksPrev = async (rollno) => {
    let data = {
      studentId: rollno || students[currentStudentIndex].student_rollno - 1,
      subjectID,
      division
    }

    let res = await fetch(`https://ksir3-0backend.onrender.com/fetchstudentmarks/${data.studentId}/${subjectID}/${division}`, {
      method: "GET",
    });

    res = await res.json();
    // console.log(res);

    let elements = document.getElementsByClassName('marksinput');
    if (res.msg === "empty") {
      elements[0].value = "";
      elements[1].value = "";
      elements[2].value = "";
      elements[3].value = "";
      elements[4].value = "";
      elements[5].value = "";
    } else {
      elements[0].value = res[0].Q1;
      elements[1].value = res[0].Q2;
      elements[2].value = res[0].Q3;
      elements[3].value = res[0].Q4;
      elements[4].value = res[0].Q5;
      elements[5].value = res[0].Q6;
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
                    {/* <select className='ddinput' > */}
                    <option>Select...</option>
                    {programs?.map((item, index) => (
                      <>
                        <option value={item.program_name}>{item.program_name}</option>
                      </>
                    ))}
                  </select>
                </div>
                <div className="selectcoursebodyitem">
                  <p>Select Semester</p>
                  <select className='ddinput' disabled id='semesterdd' onChange={(e) => { mapsubject(e) }}>
                    {/* <select className='ddinput' disabled id='semesterdd'> */}
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
                    {/* <select id='divisiondd' className='ddinput' disabled={true} > */}
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
                    {/* <select id='subjectdd' className='ddinput' disabled > */}
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
          <div className="insertmarkssection">
            <div className="selectcourseheader">
              <p>Insert Student Marks</p>
              <div className="studentinfocontainer">
                <div className="studentid">
                  Student Roll No : {students[currentStudentIndex]?.student_rollno}
                </div>
                <div className="studentdivision">
                  Division : {division}
                </div>
              </div>
            </div>
            <div className="insertmarksbody">

              <div className="insertmarkscontainer">
                <div className="insertmarksinputfields">
                  <div className="insertmarksinputfieldsrow">
                    <div className="insertmarksinputfield">
                      <label htmlFor="" className='insertmarksquestionnumber'>COPO1</label>
                      <input type="number" name="" id="" className='marksinput' onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }} />
                    </div>
                    <div className="insertmarksinputfield">
                      <label htmlFor="" className='insertmarksquestionnumber'>COPO1</label>
                      <input type="number" name="" id="" className='marksinput' onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }} />
                    </div>
                  </div>
                  <div className="insertmarksinputfieldsrow">
                    <div className="insertmarksinputfield">
                      <label htmlFor="" className='insertmarksquestionnumber'>COPO1</label>
                      <input type="number" name="" id="" className='marksinput' onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }} />
                    </div>
                    <div className="insertmarksinputfield">
                      <label htmlFor="" className='insertmarksquestionnumber'>COPO1</label>
                      <input type="number" name="" id="" className='marksinput' onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }} />
                    </div>
                  </div>
                  <div className="insertmarksinputfieldsrow">
                    <div className="insertmarksinputfield">
                      <label htmlFor="" className='insertmarksquestionnumber'>COPO1</label>
                      <input type="number" name="" id="" className='marksinput' onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }} />
                    </div>
                    <div className="insertmarksinputfield">
                      <label htmlFor="" className='insertmarksquestionnumber'>COPO1</label>
                      <input type="number" name="" id="" className='marksinput' onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }} />
                    </div>
                  </div>
                  <div className="insertmarksbtnscontainer">
                    {currentStudentIndex === 0 ?
                      null :
                      <div className="prevbtn" onClick={(e) => { setIsNext(false); movetoPrevStudent(e) }}>
                        Prev
                      </div>
                    }
                    <div className="submitbtn" onClick={(e) => { setIsNext(true); movetoNextStudent(e) }}>
                      Next
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}