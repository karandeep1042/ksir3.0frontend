import React, { useEffect, useState } from 'react'
import '../../../Css/Dashboard Page/SelectQuestionsPage.css'
import { useSelector, useDispatch } from 'react-redux'
import { setProgramID, setSubjectID } from '../../../redux/ID/IDSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SelectQuestionsPage() {
  const navigate = useNavigate();
  const isSidebarExtended = useSelector((state) => state.ID.isSidebarExtended);
  // const accessToken = useSelector((state) => state.ID.accessToken);
  // console.log(isSidebarExtended);

  const programID = useSelector((state) => state.ID.programID);
  const subjectID = useSelector((state) => state.ID.subjectID);
  const dispatch = useDispatch();
  const [programs, setPrograms] = useState([]);
  const [prompttext, setPromptText] = useState();
  const [division, setDivision] = useState();
  const [subjects, setSubjects] = useState([]);
  const [semCount, setSemCount] = useState(0);
  const [divCount, setDivCount] = useState(0);
  let semarray = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  let divarray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  let questionarray = ['Q1.1', 'Q1.2', 'Q1.3', 'Q1.4', 'Q1.5', 'Q2.1', 'Q2.2', 'Q2.3', 'Q2.4', 'Q2.5', 'Q3.1', 'Q3.2', 'Q3.3', 'Q3.4', 'Q3.5', 'Q4.1', 'Q4.2', 'Q4.3', 'Q4.4', 'Q4.5', 'Q5.1', 'Q5.2', 'Q5.3', 'Q5.4', 'Q5.5'];

  useEffect(() => {
    // fetch('https://api.ipify.org?format=json')
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Your IP address:', data.ip);
    //   })

    //   .catch(error => console.error('Error fetching IP:', error));
    fetchProgramList();
    if (window.innerWidth <= 800) {
      document.querySelector('.sidebarmaincontainer').style.transform = "translateX(110vw)";
    }
    if (isSidebarExtended === 1) {
      document.querySelector('.selectquestionspagemaincontainer').classList.add('megaselectquestionspagemaincontainer');
    } else {
      document.querySelector('.selectquestionspagemaincontainer').classList.remove('megaselectquestionspagemaincontainer');
    }
    //eslint-disable-next-line
  }, []);

  const fetchProgramList = async () => {
    let res = await fetch(`https://ksir3-0backend.onrender.com/getprogramlist`, {
      method: "GET",
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
    document.getElementsByClassName('selectquestionbodyitemdd')[0].disabled = true;
    document.getElementsByClassName('selectquestionbodyitemdd')[1].disabled = true;
    document.getElementsByClassName('selectquestionbodyitemdd')[2].disabled = true;
    document.getElementsByClassName('selectquestionbodyitemdd')[3].disabled = true;
    document.getElementsByClassName('selectquestionbodyitemdd')[4].disabled = true;
    document.getElementsByClassName('selectquestionbodyitemdd')[5].disabled = true;

    let elements = document.getElementsByClassName('ddinput');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.style.borderColor = "rgb(131, 131, 131)"
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
    let ele = document.querySelectorAll('.selectquestionbodyitemdd');
    for (let i = 0; i < ele.length; i++) {
      ele[i].disabled = true;
    }
    document.getElementsByClassName('ddinput')[3].value = "Select...";
    if (e.target.value !== "Select...") {
      // setSemester(e.target.value);
      let res = await fetch(`https://ksir3-0backend.onrender.com/getsubjects/${e.target.value}/${programID}`, {
        method: "GET",
      });
      res = await res.json();
      setSubjects(res);

      let subjectdd = document.getElementById('subjectdd');
      subjectdd.disabled = false;
    }
  }

  const checkAllInput = () => {
    let elements = document.getElementsByClassName('ddinput');
    let flag = 0;
    for (let i = 0; i < 4; i++) {
      const element = elements[i];
      if (element.value === "Select...") {
        flag = 1;
      }
    }
    
    elements = document.getElementsByClassName('selectquestionbodyitemdd');
    if (flag === 1) {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.value = "Select...";
        element.disabled = true;
      }
    } else {
      enableQuestionsdd();;
    }
  }

  const enableQuestionsdd = async () => {
    // setSubject(e.target.value);
    let e = document.getElementsByClassName('ddinput')[3];
    let res = await fetch(`https://ksir3-0backend.onrender.com/getsubjectID/${e.value}`, {
      method: "GET",
    });

    res = await res.json();
    dispatch(setSubjectID(res[0].subject_id));

    let elements = document.getElementsByClassName('selectquestionbodyitemdd');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.value = "Select...";
      element.disabled = false;
    }
  }

  const insertpaperdetails = async () => {
    const elements = document.getElementsByClassName('selectquestionbodyitemdd');
    let data = {
      programID,
      subjectID,
      division,
      q1: elements[0].value,
      q2: elements[1].value,
      q3: elements[2].value,
      q4: elements[3].value,
      q5: elements[4].value,
      q6: elements[5].value,
      newrecord: prompttext,
    }

    let res = await fetch(`https://ksir3-0backend.onrender.com/insertpaperdetails`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });

    res = await res.json();

    document.querySelector('.overlay').classList.remove('overlayactive');
    document.querySelector('.insertpaperpromptbox').classList.remove('promptboxactive');
    // document.querySelector('.statusmessagecontainer').style.visibility = "visible";
    if (res.msg === "success") {
      toast.info('Data Inserted Successfully');
      document.getElementById('statusmessagecontainer').innerHTML = "Data Inserted Successfully";
      document.getElementById('statusmessagelogo').className = "fa-regular fa-circle-check";
    } else {
      toast.info('Data Insertion Failed');
      document.getElementById('statusmessagecontainer').innerHTML = "Data Insertion Failed";
      document.getElementById('statusmessagelogo').className = "fa-regular fa-circle-xmark";
    }
  }

  const checkexistingpaper = async () => {
    let res = await fetch(`https://ksir3-0backend.onrender.com/checkexistingpaper/${programID}/${subjectID}/${division}`, {
      method: "GET"
    });

    res = await res.json();

    let overlay = document.querySelector('.overlay');
    overlay.classList.add('overlayactive');

    let promptbox = document.querySelector('.insertpaperpromptbox');
    promptbox.classList.add('promptboxactive');

    if (res.msg === "doesnotexists") {
      setPromptText(true);
    } else {
      setPromptText(false);
    }
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
        element.style.border = "2px solid rgb(131, 131, 131)"
      }
    }

    if (errcounter === 0) {
      checkexistingpaper();
    } else {
      toast.error('Please select all the fields!');
    }
  }

  console.log("rerendered");
  
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
      <div className="overlay">
      </div>
      <div className="selectquestionspagemaincontainer">
        <div className="selectquestionpagechildcontainer">
          <div className="insertpaperpromptbox">
            <div className="insertpaperpromptboxheader">
              <p>{prompttext ? 'Are you sure you want to insert ?' : 'Record already exists! Do you want to override the existing record ?'}</p>
            </div>
            <div className="insertpaperpromptboxbtns">
              <div className="insertpaperpromptboxyesbtn" onClick={insertpaperdetails}>
                <p>Yes</p>
              </div>
              <div className="insertpaperpromptboxnobtn" onClick={() => {
                document.querySelector('.overlay').classList.remove('overlayactive');
                document.querySelector('.insertpaperpromptbox').classList.remove('promptboxactive');
                document.querySelector('.statusmessagecontainer').style.visibility = "hidden";
              }}>
                <p>No</p>
              </div>
            </div>
          </div>
          <div className="selectcoursesection">
            <div className="selectcourseheader">
              <p>Add Paper Details</p>
            </div>
            <div className="selectcoursebody">
              <div className="selectcourseobdyrow">
                <div className="selectcoursebodyitem">
                  <p>Select Program</p>
                  <select className='ddinput' onChange={(e) => { mapsemestersanddivisions(e) }}>
                    <option>Select...</option>
                    {programs?.map((item, index) => (
                      <>
                        <option key={index} value={item.program_name}>{item.program_name}</option>
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
                        {index < semCount ? <option key={index} value={index + 1}>{item}</option> : null}
                      </>
                    ))}
                  </select>
                </div>
              </div>
              <div className="selectcourseobdyrow">
                <div className="selectcoursebodyitem">
                  <p>Select Division</p>
                  <select id='divisiondd' className='ddinput' disabled={true} onChange={(e) => { checkAllInput(); setDivision(e.target.value) }}>
                    <option>Select...</option>
                    {divarray.map((item, index) => (
                      <>
                        {index < divCount ? <option key={index} value={item}>{item}</option> : null}
                      </>
                    ))}
                  </select>
                </div>
                <div className="selectcoursebodyitem">
                  <p>Select Subject</p>
                  <select id='subjectdd' className='ddinput' disabled onChange={checkAllInput}>
                    <option>Select...</option>
                    {subjects.map((item, index) => (
                      <>
                        <option key={index} value={item.subject_name}>{item.subject_name}</option>
                      </>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="selectquestionsection">
            <div className="selectcourseheader">
              <p>Select Questions</p>
            </div>
            <div className="selectcoursebody">
              <div className="selectcourseobdyrow">
                <div className="selectquestionbodyitem">
                  <p>CO1</p>
                  <select disabled className='selectquestionbodyitemdd ddinput'>
                    <option>Select...</option>
                    {questionarray.map((item, index) => (
                      <>
                        <option key={index} value={item}>{item}</option>
                      </>
                    ))}
                  </select>
                </div>
                <div className="selectquestionbodyitem">
                  <p>CO2</p>
                  <select disabled className='selectquestionbodyitemdd ddinput'>
                    <option>Select...</option>
                    {questionarray.map((item, index) => (
                      <>
                        <option key={index} value={item}>{item}</option>
                      </>
                    ))}
                  </select>
                </div>
              </div>
              <div className="selectcourseobdyrow">
                <div className="selectquestionbodyitem">
                  <p>CO3</p>
                  <select disabled className='selectquestionbodyitemdd ddinput'>
                    <option>Select...</option>
                    {questionarray.map((item, index) => (
                      <>
                        <option key={index} value={item}>{item}</option>
                      </>
                    ))}
                  </select>
                </div>
                <div className="selectquestionbodyitem">
                  <p>CO4</p>
                  <select disabled className='selectquestionbodyitemdd ddinput'>
                    <option>Select...</option>
                    {questionarray.map((item, index) => (
                      <>
                        <option key={index} value={item}>{item}</option>
                      </>
                    ))}
                  </select>
                </div>
              </div>
              <div className="selectcourseobdyrow">
                <div className="selectquestionbodyitem">
                  <p>CO5</p>
                  <select disabled className='selectquestionbodyitemdd ddinput'>
                    <option>Select...</option>
                    {questionarray.map((item, index) => (
                      <>
                        <option key={index} value={item}>{item}</option>
                      </>
                    ))}
                  </select>
                </div>
                <div className="selectquestionbodyitem">
                  <p>CO6</p>
                  <select disabled className='selectquestionbodyitemdd ddinput'>
                    <option>Select...</option>
                    {questionarray.map((item, index) => (
                      <>
                        <option key={index} value={item}>{item}</option>
                      </>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="submitbtncontainer">
              <div className="submitbtn" onClick={() => {
                validateInputs();
              }}>
                <p>Submit</p>
              </div>
            </div>
          </div>
          <div className="statusmessagecontainer">
            <i id='statusmessagelogo' className="fa-regular fa-circle-check"></i><p id='statusmessagecontainer'>asa</p>
          </div>
        </div>
      </div>
    </>
  )
}
