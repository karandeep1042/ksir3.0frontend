import React, { useEffect, useState } from 'react'
import '../../../Css/Dashboard Page/ManageUser.css'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageUser() {
  const navigate = useNavigate();
  const [userTableData, setUserTableData] = useState([]);
  const [courseTableData, setCourseTableData] = useState([]);
  const [subjectTableData, setSubjectTableData] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semester, setSemester] = useState(null);
  const [semesters, setSemesters] = useState();
  const [courseID, setCourseID] = useState();
  const [programID, setProgramID] = useState();
  const [subjectName, setsubjectName] = useState(null)
  const isSidebarExtended = useSelector((state) => state.ID.isSidebarExtended);

  let semarray = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const resetFormInputs = () => {
    let elements = document.getElementsByClassName('adduserformtextinput');
    let elements2 = document.getElementsByClassName('adduserformselectinput');
    for (let i = 0; i < elements2.length; i++) {
      const element = elements2[i];
      element.value = "Select...";
    }
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.value = "";
    }
  }

  const toggleAddUserForm = () => {
    resetFormInputs();
    let ele = document.querySelector('.adduserformcontainer');
    if (ele.classList.contains('adduserformcontaineractive')) {
      ele.classList.remove('adduserformcontaineractive');
    } else {
      ele.classList.add('adduserformcontaineractive');
    }
  }

  const toggleAddCourseForm = () => {
    resetFormInputs();
    let ele = document.querySelector('.addcourseformcontainer');
    if (ele.classList.contains('addcourseformcontaineractive')) {
      ele.classList.remove('addcourseformcontaineractive');
    } else {
      ele.classList.add('addcourseformcontaineractive');
    }
  }

  const toggleAddSubjectForm = () => {
    setSemesters(0);
    document.getElementsByClassName('addsubjectinputelement')[2].disabled = true;
    resetFormInputs();
    let ele = document.querySelector('.addsubjectformcontainer');
    if (ele.classList.contains('addsubjectformcontaineractive')) {
      ele.classList.remove('addsubjectformcontaineractive');
    } else {
      ele.classList.add('addsubjectformcontaineractive');
    }
  }

  const fetchUserTableData = async () => {
    let res = await fetch('https://ksir3-0backend.onrender.com/fetchusertabledata', {
      method: 'GET'
    })
    res = await res.json();
    console.log(res);

    if (res.error === "Unauthorized") {
      navigate('/');
    } else {
      setUserTableData(res.data);
    }
  }

  const fetchCoursesTableData = async () => {
    let res = await fetch('https://ksir3-0backend.onrender.com/fetchcoursestabledata', {
      method: 'GET'
    })
    res = await res.json();
    console.log(res);

    if (res.error === "Unauthorized") {
      navigate('/');
    } else {
      setCourseTableData(res.data);
    }
  }

  const fetchSubjectsTableData = async () => {
    let res = await fetch('https://ksir3-0backend.onrender.com/fetchsubjectstabledata', {
      method: 'GET'
    })
    res = await res.json();
    console.log(res);

    if (res.error === "Unauthorized") {
      navigate('/');
    } else {
      setSubjectTableData(res.data);
    }
  }

  const validateAddUserInputs = () => {
    let elements = document.getElementsByClassName('adduserinputelement');
    let errorcounter = 0;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.value === "") {
        errorcounter++;
        element.style.borderColor = "red"
      } else {
        element.style.borderColor = "rgb(184,184,184)"
      }
    }

    if (errorcounter != 0) {
      toast.error('Please fill all the fields!');
      return;
    }

    if (!elements[1].value.includes("@")) {
      errorcounter++;
      elements[1].style.borderColor = "red"
      toast.error('Email should have @');
      return;
    } else if (!elements[1].value.includes(".com")) {
      errorcounter++;
      elements[1].style.borderColor = "red"
      toast.error('Email should end with .com');
      return;
    } else {
      elements[1].style.borderColor = "rgb(184,184,184)"
    }

    if (elements[2].value.length < 8) {
      errorcounter++;
      elements[2].style.borderColor = "red"
      toast.error('Password should atleast contain 8 characters');
      return;
    } else {
      elements[1].style.borderColor = "rgb(184,184,184)"
    }

    if (errorcounter == 0) {
      insertUser();
    }
  }

  const insertUser = async () => {
    let elements = document.getElementsByClassName('adduserinputelement');
    let data = {
      name: elements[0].value,
      email: elements[1].value,
      pass: elements[2].value
    }

    let res = await fetch(`https://ksir3-0backend.onrender.com/insertuser`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });

    res = await res.json();
    if (!res.inserted) {
      toast.error("User Already Registered");
    } else {
      toast.info("User Successfully Registered");
      fetchUserTableData();
    }
  }

  const validateAddCourseInputs = () => {
    let elements = document.getElementsByClassName('addcourseinputelement');
    let errorcounter = 0;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.value === "" || element.value === "Select...") {
        errorcounter++;
        element.style.borderColor = "red"
      } else {
        element.style.borderColor = "rgb(184,184,184)"
      }
    }

    if (errorcounter != 0) {
      toast.error('Please fill all the fields!');
      return;
    } else {
      insertCourse();
    }
  }

  const insertCourse = async () => {
    let elements = document.getElementsByClassName('addcourseinputelement');
    let data = {
      name: elements[0].value,
      semesters: parseInt(elements[1].value),
      divisions: parseInt(elements[2].value)
    }

    let res = await fetch(`https://ksir3-0backend.onrender.com/insertcourse`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });

    res = await res.json();
    if (!res.inserted) {
      toast.error("Course Already Exist");
    } else {
      fetchCoursesTableData();
      toast.info("Course Successfully Added");
    }
  }

  const fetchProgramList = async () => {
    let res = await fetch(`https://ksir3-0backend.onrender.com/getprogramlist`, {
      credentials: 'include'
    });
    res = await res.json();
    console.log(res);

    if (res.valid) {
      setPrograms(res.data);
    } else {
      navigate('/');
    }
  }

  const fetchCourseSemAndId = async (e) => {
    let elements = document.getElementsByClassName('addsubjectinputelement');
    elements[2].value = "Select...";
    elements[2].disabled = false;
    if (e.target.value === "Select...") {
      elements[2].disabled = true;
      return;
    }
    let res = await fetch(`https://ksir3-0backend.onrender.com/getsemanddiv/${e.target.value}`, {
      method: "GET",
      credentials: 'include'
    });
    res = await res.json();
    console.log(res);

    if (res.valid) {
      setProgramID(res.data[0].program_id);
      setSemesters(res.data[0].program_semesters);
    }
  }

  const validateAddSubjectInputs = () => {
    let elements = document.getElementsByClassName('addsubjectinputelement');
    let errorcounter = 0;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.value === "" || element.value === "Select...") {
        errorcounter++;
        element.style.borderColor = "red"
      } else {
        element.style.borderColor = "rgb(184,184,184)"
      }
    }

    if (errorcounter != 0) {
      toast.error('Please fill all the fields!');
      return;
    } else {
      insertSubject();
    }
  }

  const insertSubject = async () => {
    let elements = document.getElementsByClassName('addsubjectinputelement');
    let data = {
      name: elements[0].value,
      programid: parseInt(programID),
      semester: parseInt(elements[2].value)
    }

    let res = await fetch(`https://ksir3-0backend.onrender.com/insertsubject`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });

    res = await res.json();
    if (!res.inserted) {
      toast.error("Subject already exists!");
    } else {
      fetchCoursesTableData();
      toast.info("Subject Successfully Added");
    }
  }

  const deleteUser = async (index) => {
    console.log(userTableData[index]);

    let res = await fetch(`https://ksir3-0backend.onrender.com/deleteuser/${userRecords[index].user_id}`, {
      method: "GET"
    })

    res = await res.json();
    if (res.deleted) {
      toast.info("User Deleted Successfully");
      fetchUserTableData();
    } else {
      toast.error("User not Deleted");
    }
  }

  const deleteCourse = async (index) => {
    console.log(courseTableData[index]);

    let res = await fetch(`https://ksir3-0backend.onrender.com/deletecourse/${courseRecords[index].program_id}`, {
      method: "GET"
    })

    res = await res.json();
    if (res.deleted) {
      toast.info("Course Deleted Successfully");
      fetchCoursesTableData();
    } else {
      toast.error("Course not Deleted");
    }
  }

  const deleteSubject = async (index) => {
    let res = await fetch(`https://ksir3-0backend.onrender.com/deletesubject/${subjectRecords[index].subject_id}`, {
      method: "GET"
    })

    res = await res.json();
    if (res.deleted) {
      toast.info("Subject Deleted Successfully");
      fetchSubjectsTableData();
    } else {
      toast.error("Subject not Deleted");
    }
  }

  const searchuser = async (e) => {
    let res = await fetch(`https://ksir3-0backend.onrender.com/searchuser/${e.target.value}`)
    res = await res.json();
    if (res.fetched) {
      setUserTableData(res.data);
    }
  }

  const searchcourse = async (e) => {
    let res = await fetch(`https://ksir3-0backend.onrender.com/searchcourse/${e.target.value}`)
    res = await res.json();
    if (res.fetched) {
      setCourseTableData(res.data);
    }
  }

  const searchsubject = async () => {
    let elements = document.getElementsByClassName('subjectfilterinput');
    console.log(elements);

    let data = {
      courseID: elements[3].selectedIndex !== 0 ? programs[elements[3].selectedIndex - 1].program_id : null,
      semester: elements[4].selectedIndex !== 0 ? elements[4].value : null,
      subjectName: elements[5].value !== 0 ? elements[5].value : ''
    }
    // console.log(data);
    let res = await fetch(`https://ksir3-0backend.onrender.com/searchsubject`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })

    res = await res.json();
    console.log(res);

    if (res.fetched) {
      setSubjectCurrentPage(1);
      setSubjectTableData(res.data);
    }else{
      toast.error("Record not found!");
    }
  }

  const searchsubjectmobile = async () => {
    let elements = document.getElementsByClassName('subjectfilterinput');
    console.log(elements);

    let data = {
      courseID: elements[0].selectedIndex !== 0 ? programs[elements[0].selectedIndex - 1].program_id : null,
      semester: elements[1].selectedIndex !== 0 ? elements[1].value : null,
      subjectName: elements[2].value !== 0 ? elements[2].value : ''
    }
    console.log(data);
    let res = await fetch(`https://ksir3-0backend.onrender.com/searchsubject`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })

    res = await res.json();
    console.log(res);

    if (res.fetched) {
      setSubjectCurrentPage(1);
      setSubjectTableData(res.data);
    }
  }

  useEffect(() => {
    fetchProgramList();
    fetchUserTableData();
    fetchCoursesTableData();
    fetchSubjectsTableData();
    if (window.innerWidth <= 800) {
      document.querySelector('.sidebarmaincontainer').style.transform = "translateX(110vw)";
    }
    if (isSidebarExtended == 1) {
      document.querySelector('.selectquestionspagemaincontainer').classList.add('megaselectquestionspagemaincontainer');
    } else {
      document.querySelector('.selectquestionspagemaincontainer').classList.remove('megaselectquestionspagemaincontainer');
    }
  }, []);

  //Pagination code starts here
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [subjectCurrentPage, setSubjectCurrentPage] = useState(1);
  const [courseCurrentPage, setCourseCurrentPage] = useState(1);

  const userRecordsPerPage = 3;
  const subjectRecordsPerPage = 4;
  const courseRecordsPerPage = 3;

  const userRecordsLastIndex = userCurrentPage * userRecordsPerPage;
  const subjectRecordsLastIndex = subjectCurrentPage * subjectRecordsPerPage;
  const courseRecordsLastIndex = courseCurrentPage * courseRecordsPerPage;

  let userRecordsFirstIndex = userRecordsLastIndex - userRecordsPerPage;
  let subjectRecordsFirstIndex = subjectRecordsLastIndex - subjectRecordsPerPage;
  let courseRecordsFirstIndex = courseRecordsLastIndex - courseRecordsPerPage;

  const userRecords = userTableData.slice(userRecordsFirstIndex, userRecordsLastIndex);
  const subjectRecords = subjectTableData.slice(subjectRecordsFirstIndex, subjectRecordsLastIndex);
  const courseRecords = courseTableData.slice(courseRecordsFirstIndex, courseRecordsLastIndex);

  const userNPage = Math.ceil(userTableData.length / userRecordsPerPage);
  const subjectNPage = Math.ceil(subjectTableData.length / subjectRecordsPerPage);
  const courseNPage = Math.ceil(courseTableData.length / courseRecordsPerPage);

  const userNumbers = [...Array(userNPage + 1).keys()].slice(1);
  const subjectNumbers = [...Array(subjectNPage + 1).keys()].slice(1);
  const courseNumbers = [...Array(subjectNPage + 1).keys()].slice(1);

  let divisions = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

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
      <div className='selectquestionspagemaincontainer'>
        <div className="manageuserpagechildcontainer">
          <div className="manageusersuppertables">
            <div className="manageusertablesection">
              <div className="selectcourseheader manageusertableheader">
                <p>Manage Users</p>
                <div className="usertablefiltermainsection">
                  <div className="usertablefilterchildcontainer">
                    <div className="usertablesearchfilter">
                      <input type="text" onChange={(e) => {
                        if (e.target.value === "") {
                          fetchUserTableData();
                        } else {
                          searchuser(e)
                        }
                      }
                      } placeholder='Search by name' />
                      {/* <i className="fa-solid fa-magnifying-glass"></i> */}
                    </div>
                  </div>
                  <div className="paginationbuttoncontainer">
                    <button className='paginationbtn prevpaginationbtn' onClick={() => {
                      if (userCurrentPage !== 1) {
                        setUserCurrentPage(userCurrentPage - 1);
                      }
                    }}>
                      <i class="fa-solid fa-angle-left"></i>
                    </button>
                    <button className='paginationbtn nextpaginationbtn' onClick={() => {
                      if (userCurrentPage !== userNPage) {
                        setUserCurrentPage(userCurrentPage + 1)
                      };
                    }}>
                      <i class="fa-solid fa-angle-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="manageusertablecontainer">
                <table cellSpacing={0} >
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Username</th>
                      <th>User Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody >
                    {userRecords.map((item, index) => (
                      <>
                        <tr>
                          <td>{userRecordsFirstIndex = userRecordsFirstIndex + 1}</td>
                          <td>{item.user_name}</td>
                          <td>{item.user_email}</td>
                          <td className='recorddeletebutton' onClick={() => { deleteUser(index) }}>
                            <p>
                              Delete
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>
            <div className="manageusertablesection">
              <div className="selectcourseheader manageusertableheader">
                <p>Manage Courses</p>
                <div className="usertablefiltermainsection">
                  <div className="usertablefilterchildcontainer">
                    <div className="usertablesearchfilter">
                      <input type="text" onChange={(e) => {
                        if (e.target.value === "") {
                          fetchCoursesTableData();
                        } else {
                          searchcourse(e)
                        }
                      }} placeholder='Search by name' />
                      {/* <i className="fa-solid fa-magnifying-glass"></i> */}
                    </div>
                  </div>
                  <div className="adduserbuttoncontainer">
                    <div className="paginationbuttoncontainer">
                      <button className='paginationbtn prevpaginationbtn' onClick={() => {
                        if (courseCurrentPage !== 1) {
                          setCourseCurrentPage(courseCurrentPage - 1);
                        }
                      }}>
                        <i class="fa-solid fa-angle-left"></i>
                      </button>
                      <button className='paginationbtn nextpaginationbtn' onClick={() => {
                        if (courseCurrentPage !== courseNPage) {
                          setCourseCurrentPage(courseCurrentPage + 1)
                        };
                      }}>
                        <i class="fa-solid fa-angle-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="managecoursetablecontainer">
                <table cellSpacing={0} >
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Course name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody >
                    {courseRecords.map((item, index) => (
                      <>
                        <tr>
                          <td>{courseRecordsFirstIndex = courseRecordsFirstIndex + 1}</td>
                          <td>{item.program_name}</td>
                          <td className='recorddeletebutton' onClick={() => { deleteCourse(index) }}>
                            <p>
                              Delete
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="manageuserslowertables">
            <div className="manageusertablesection managesubjecttablesection">
              <div className="selectcourseheader manageusertableheader">
                <p>Manage Subjects</p>
                <div className="subjecttablefilterchildcontainer">
                  <div className="subjecttablefilterheader">
                    <h2>Filters</h2>
                    <i className="fa-solid fa-xmark" onClick={() => {
                      if (document.querySelector('.subjecttablefilterchildcontainer').classList.contains('subjecttablefilterchildcontaineractive')) {
                        document.querySelector('.subjecttablefilterchildcontainer').classList.remove('subjecttablefilterchildcontaineractive');
                      }
                    }}></i>
                  </div>
                  <div className="subjecttablefilterselectitems">
                    <div className="usertableselectcoursefilter">
                      <select name="" id="" className='subjectfilterinput' onChange={(e) => {
                        if (e.target.selectedIndex !== 0) {
                          // setCourseID(programs[e.target.selectedIndex - 1].program_id);
                          document.getElementsByClassName('selectsemdd')[0].disabled = false;
                          setSemesters(programs[e.target.selectedIndex - 1].program_semesters);
                        } else {
                          setSemester(null);
                          // setCourseID(null);
                          document.getElementsByClassName('selectsemdd')[0].selectedIndex = 0;
                          document.getElementsByClassName('selectsemdd')[0].disabled = true;
                        }
                        searchsubject();
                      }}>
                        <option value="">Select Course...</option>
                        {programs.map((item, index) => (
                          <>
                            <option value={item.program_name}>{item.program_name}</option>
                          </>
                        ))}
                      </select>
                    </div>
                    <div className="usertableselectcoursefilter">
                      <select name="" disabled className='selectsemdd subjectfilterinput' id="" >
                        <option value="" >Select Semester...</option>
                        {divisions.map((item, index) => (
                          <>
                            {index < semesters ? <option value={index + 1}>{item}</option> : null}
                          </>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="usertablesearchfilter">
                    <input type="text" className='subjectfilterinput' placeholder='Search by name' />
                    {/* <i className="fa-solid fa-magnifying-glass"></i> */}
                  </div>
                  <div className="filtersectionbuttons">
                    <div className="applyfilterbutton" onClick={() => {
                      document.getElementsByClassName('subjectfilterinput')[0].selectedIndex = 0;
                      document.getElementsByClassName('subjectfilterinput')[1].selectedIndex = 0;
                      document.getElementsByClassName('subjectfilterinput')[2].value = "";
                      document.getElementsByClassName('subjectfilterinput')[1].disabled = true;
                      searchsubject();
                    }}>
                      <p>Reset</p>
                    </div>
                    <div className="applyfilterbutton" onClick={() => {
                      searchsubjectmobile();
                      if (document.querySelector('.subjecttablefilterchildcontainer').classList.contains('subjecttablefilterchildcontaineractive')) {
                        document.querySelector('.subjecttablefilterchildcontainer').classList.remove('subjecttablefilterchildcontaineractive');
                      }
                    }
                    }>
                      <p>Apply</p>
                    </div>
                  </div>
                </div>
                <div className="usertablefiltermainsection">
                  <div className="usertablefilterchildcontainer">
                    <div className="resetfilterbutton" onClick={() => {
                      document.getElementsByClassName('subjectfilterinput')[3].selectedIndex = 0;
                      document.getElementsByClassName('subjectfilterinput')[4].selectedIndex = 0;
                      document.getElementsByClassName('subjectfilterinput')[5].value = "";
                      document.getElementsByClassName('subjectfilterinput')[4].disabled = true;

                      searchsubject();
                    }}>
                      <i class="fa-solid fa-rotate"></i>
                    </div>
                    <div className="usertableselectcoursefilter">
                      <select name="" id="" className='subjectfilterinput' onChange={(e) => {
                        if (e.target.selectedIndex !== 0) {
                          // setCourseID(programs[e.target.selectedIndex - 1].program_id);
                          document.getElementsByClassName('selectsemdd')[1].disabled = false;
                          setSemesters(programs[e.target.selectedIndex - 1].program_semesters);
                        } else {
                          setSemester(null);
                          // setCourseID(null);
                          document.getElementsByClassName('selectsemdd')[1].selectedIndex = 0;
                          document.getElementsByClassName('selectsemdd')[1].disabled = true;
                        }
                        searchsubject();
                      }}>
                        <option value="">Select Course...</option>
                        {programs.map((item, index) => (
                          <>
                            <option value={item.program_name}>{item.program_name}</option>
                          </>
                        ))}
                      </select>
                    </div>
                    <div className="usertableselectcoursefilter">
                      <select name="" disabled className='selectsemdd subjectfilterinput' id="" >
                        <option value="" >Select Semester...</option>
                        {divisions.map((item, index) => (
                          <>
                            {index < semesters ? <option value={index + 1}>{item}</option> : null}
                          </>
                        ))}
                      </select>
                    </div>
                    <div className="usertablesearchfilter">
                      <input type="text" className='subjectfilterinput' placeholder='Search by name' />
                    </div>
                    <div className="applyfilterbutton" onClick={searchsubject}>
                      <p>Apply</p>
                    </div>
                  </div>
                  <div className="paginationbuttoncontainer">
                    <button className='paginationbtn filterbtn' onClick={() => {
                      if (document.querySelector('.subjecttablefilterchildcontainer').classList.contains('subjecttablefilterchildcontaineractive')) {
                        document.querySelector('.subjecttablefilterchildcontainer').classList.remove('subjecttablefilterchildcontaineractive');
                      } else {
                        document.querySelector('.subjecttablefilterchildcontainer').classList.add('subjecttablefilterchildcontaineractive');
                      }
                    }}>
                      <i className="fa-solid fa-filter"></i>
                    </button>
                    <button className='paginationbtn prevpaginationbtn' onClick={() => {
                      if (subjectCurrentPage !== 1) {
                        setSubjectCurrentPage(subjectCurrentPage - 1);
                      }
                    }}>
                      <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <button className='paginationbtn nextpaginationbtn' onClick={() => {
                      if (subjectCurrentPage !== subjectNPage) {
                        setSubjectCurrentPage(subjectCurrentPage + 1)
                      };
                    }}>
                      <i className="fa-solid fa-angle-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="managesubjecttablecontainer">
                <table cellSpacing={0} >
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Subject name</th>
                      <th>Semester</th>
                      <th>Course name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody >
                    {subjectRecords.map((item, index) => (
                      <>
                        <tr>
                          <td>{subjectRecordsFirstIndex = subjectRecordsFirstIndex + 1}</td>
                          <td>{item.subject_name}</td>
                          <td>{item.semester}</td>
                          <td>{item.program_name}</td>
                          <td className='recorddeletebutton' onClick={() => { deleteSubject(index) }}>
                            <p>
                              Delete
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="floatingactionbutton" >
            <i class="fa-solid fa-plus" onClick={() => {
              if (window.innerWidth <= 800) {
                document.querySelector('.floatingactionlistitems').classList.toggle('floatingactionlistitemsactive');
              }
            }}></i>
            <div className="floatingactionlistitems">
              <div className="floatingactionlistitem" onClick={toggleAddSubjectForm} >
                <i className="fa-solid fa-book"></i>
                <p>Add Subject</p>
              </div>
              <div className="floatingactionlistitem addcourseitem" onClick={toggleAddCourseForm}>
                <i className="fa-solid fa-layer-group"></i>
                <p>Add Course</p>
              </div>
              <div className="floatingactionlistitem adduseritembtn" onClick={toggleAddUserForm}>
                <i className="fa-solid fa-user-plus"></i>
                <p>Add User</p>
              </div>
            </div>
          </div>
          <div className="addcourseformcontainer">
            <div className="adduserformheader">
              <p>Add Course</p>
              <i class="fa-solid fa-angle-down" onClick={toggleAddCourseForm}></i>
            </div>
            <div className="adduserformbody">
              <div className="adduserforminputitem">
                <p>Enter Course Name</p>
                <input className='adduserformtextinput addcourseinputelement' type="text" name="" id="" />
              </div>
              <div className="adduserforminputitem">
                <p>Enter Number of Semesters</p>
                <select name="" id="" className=' adduserformselectinput addcourseinputelement' >
                  <option value="Select...">Select...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </div>
              <div className="adduserforminputitem">
                <p>Enter Number of Divisions</p>
                <select name="" id="" className='adduserformselectinput addcourseinputelement' >
                  <option value="Select...">Select...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>
              <div className="adduserformsubmitbtncontainer">
                <button div className="adduserformsubmitbtn" onClick={validateAddCourseInputs}>
                  Add Course
                </button>
              </div>
            </div>
          </div>
          <div className="addsubjectformcontainer">
            <div className="adduserformheader">
              <p>Add Subject</p>
              <i class="fa-solid fa-angle-down" onClick={toggleAddSubjectForm}></i>
            </div>
            <div className="adduserformbody">
              <div className="adduserforminputitem">
                <p>Enter Subject Name</p>
                <input className='adduserformtextinput addsubjectinputelement' type="text" name="" id="" />
              </div>
              <div className="adduserforminputitem">
                <p>Select Course</p>
                <select name="" id="" className='adduserformselectinput addsubjectinputelement' onChange={(e) => { fetchCourseSemAndId(e) }}>
                  <option value="Select...">Select...</option>
                  {programs.map((item, index) => (
                    <>
                      <option value={item.program_name}>{item.program_name}</option>
                    </>
                  ))}
                </select>
              </div>
              <div className="adduserforminputitem">
                <p>Select Semester</p>
                <select name="" id="" className=' adduserformselectinput addsubjectinputelement'>
                  <option value="Select...">Select...</option>
                  {semarray.map((item, index) => (
                    <>
                      {index < semesters ? <option value={index + 1}>{item}</option> : null}
                    </>
                  ))}
                </select>
              </div>
              <div className="adduserformsubmitbtncontainer">
                <button div className="adduserformsubmitbtn" onClick={validateAddSubjectInputs}>
                  Add Subject
                </button>
              </div>
            </div>
          </div>
          <div className="adduserformcontainer">
            <div className="adduserformheader">
              <p>Add User</p>
              <i class="fa-solid fa-angle-down" onClick={toggleAddUserForm}></i>
            </div>
            <div className="adduserformbody">
              <div className="adduserforminputitem">
                <p>Enter User Name</p>
                <input className='adduserformtextinput adduserinputelement' type="text" name="" id="" />
              </div>
              <div className="adduserforminputitem">
                <p>Enter User Email</p>
                <input className='adduserformtextinput adduserinputelement' type="email" name="" id="" />
              </div>
              <div className="adduserforminputitem">
                <p>Enter User Password</p>
                <input className='adduserformtextinput adduserinputelement' type="text" name="" id="" />
              </div>
              <div className="adduserformsubmitbtncontainer">
                <button div className="adduserformsubmitbtn" onClick={validateAddUserInputs}>
                  Add user
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
