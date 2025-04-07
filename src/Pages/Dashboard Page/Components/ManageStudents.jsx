import React, { useEffect, useState } from 'react'
import '../../../Css/Dashboard Page/ManageStudent.css'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageStudents() {

    const navigate = useNavigate();
    const [studentTableData, setStudentTableData] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [division, setDivision] = useState();
    const [semester, setSemester] = useState();
    // const [semesters, setSemesters] = useState([]);
    const [programID, setProgramID] = useState();
    const isSidebarExtended = useSelector((state) => state.ID.isSidebarExtended);
    let divisions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let semesters = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

    const resetFormInputs = () => {
        document.getElementsByClassName('addstudentsinputelement')[3].disabled = true
        document.getElementsByClassName('addstudentsinputelement')[4].disabled = true
        let elements = document.getElementsByClassName('adduserformtextinput');
        let elements2 = document.getElementsByClassName('adduserformselectinput');
        for (let i = 0; i < elements2.length; i++) {
            const element = elements2[i];
            element.value = "Select...";
            element.style.borderColor = "rgb(184,184,184)";
        }
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.value = "";
            element.style.borderColor = "rgb(184,184,184)";
        }
    }

    const toggleAddStudentsForm = () => {
        resetFormInputs();
        let ele = document.querySelector('.addcourseformcontainer');
        if (ele.classList.contains('addcourseformcontaineractive')) {
            ele.classList.remove('addcourseformcontaineractive');
        } else {
            ele.classList.add('addcourseformcontaineractive');
        }
    }

    const fetchAllStudent = async () => {
        let res = await fetch('https://ksir3-0backend.onrender.com/fetchallstudent', {
            method: "GET"
        })

        res = await res.json();

        console.log(res);
        if (res.fetched) {
            setStudentTableData(res.data);
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

    const fetchDivision = (e) => {
        if (e.target.value !== "Select...") {
            document.getElementsByClassName('addstudentsinputelement')[3].disabled = false;
            document.getElementsByClassName('addstudentsinputelement')[4].disabled = false;
            setDivision(programs[e.target.selectedIndex - 1].program_divisions);
            setSemester(programs[e.target.selectedIndex - 1].program_semesters);
            // console.log(programs[e.target.selectedIndex - 1].program_id);
            setProgramID(programs[e.target.selectedIndex - 1].program_id);
        } else {
            document.getElementsByClassName('addstudentsinputelement')[3].disabled = true;
            document.getElementsByClassName('addstudentsinputelement')[3].value = "Select...";
            document.getElementsByClassName('addstudentsinputelement')[4].disabled = true;
            document.getElementsByClassName('addstudentsinputelement')[4].value = "Select...";
        }
    }

    const validateAddStudentsInputs = () => {
        let elements = document.getElementsByClassName('addstudentsinputelement');
        let errorcounter = 0;
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            if (element.value === "" || element.value === "Select...") {
                errorcounter++;
                element.style.borderColor = "red";
            } else {
                element.style.borderColor = "rgb(184,184,184)";
            }
        }

        if (errorcounter === 0) {
            insertStudents();
        }
    }

    const insertStudents = async () => {
        let elements = document.getElementsByClassName('addstudentsinputelement');

        let data = {
            firstrollno: elements[0].value,
            lastrollno: elements[1].value,
            programID,
            division: elements[3].value,
            semester: elements[4].value
        }

        let res = await fetch("https://ksir3-0backend.onrender.com/insertstudent", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        })

        res = await res.json();
        console.log(res);

        if (res.inserted) {
            toast.info("Students Successfully added");
        } else {
            toast.error("Failed to add students");
        }
    }

    useEffect(() => {
        fetchProgramList();
        fetchAllStudent();
        if (window.innerWidth <= 800) {
            document.querySelector('.sidebarmaincontainer').style.transform = "translateX(110vw)";
        }
        if (isSidebarExtended == 1) {
            document.querySelector('.selectquestionspagemaincontainer').classList.add('megaselectquestionspagemaincontainer');
        } else {
            document.querySelector('.selectquestionspagemaincontainer').classList.remove('megaselectquestionspagemaincontainer');
        }
        // eslint-disable-next-line
    }, [])

    const deleteStudent = async (rollno) => {
        let res = await fetch(`https://ksir3-0backend.onrender.com/deletestudent/${rollno}`, {
            method: "GET"
        })

        res = await res.json();

        if (res.deleted) {
            toast.info("Student Successfully deleted");
            fetchAllStudent();
        } else {
            toast.error("Student not deleted");
        }
    }

    const searchstudents = async () => {
        let elements = document.getElementsByClassName('subjectfilterinput');
        console.log(elements);
        let data;
        if (window.innerWidth <= 800) {
            data = {
                courseID: elements[0].selectedIndex !== 0 ? programs[elements[0].selectedIndex - 1].program_id : null,
                semester: elements[1].selectedIndex !== 0 ? elements[1].value : null,
                division: elements[2].selectedIndex !== 0 ? elements[2].value : null,
            }
        }else{
            data = {
                courseID: elements[3].selectedIndex !== 0 ? programs[elements[3].selectedIndex - 1].program_id : null,
                semester: elements[4].selectedIndex !== 0 ? elements[4].value : null,
                division: elements[5].selectedIndex !== 0 ? elements[5].value : null,
            }
        }
        console.log(data);

        let res = await fetch('https://ksir3-0backend.onrender.com/searchstudent', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });

        res = await res.json();

        if (res.fetched && res.msg === "datafound") {
            setStudentTableData(res.data);
        } else if (res.fetched && res.msg === "nodata") {
            toast.error("Records not found!")
            // setStudentTableData([]);
        }
    }

    const [userCurrentPage, setUserCurrentPage] = useState(1);
    const userRecordsPerPage = 10;
    const userRecordsLastIndex = userCurrentPage * userRecordsPerPage;
    let userRecordsFirstIndex = userRecordsLastIndex - userRecordsPerPage;
    const userRecords = studentTableData.slice(userRecordsFirstIndex, userRecordsLastIndex);
    const userNPage = Math.ceil(studentTableData.length / userRecordsPerPage);
    const userNumbers = [...Array(userNPage + 1).keys()].slice(1);
    console.log(userRecords[0]);

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
                    <div className="managestudentfloatingactionbutton" onClick={toggleAddStudentsForm}>
                        <i className="fa-solid fa-user-plus"></i>
                        <p>Add Students</p>
                    </div>
                    <div className="manageuserslowertables">
                        <div className="manageusertablesection managestudenttablesection">
                            <div className="selectcourseheader manageusertableheader">
                                <p>Manage Students</p>
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
                                                    document.getElementsByClassName('selectsemdd')[1].disabled = false;
                                                    document.getElementsByClassName('selectsemdd')[2].disabled = false;
                                                    document.getElementsByClassName('selectsemdd')[3].disabled = false;
                                                    setSemester(programs[e.target.selectedIndex - 1].program_semesters);
                                                    setDivision(programs[e.target.selectedIndex - 1].program_divisions);
                                                } else {
                                                    setSemester(null);
                                                    // setCourseID(null);
                                                    document.getElementsByClassName('selectsemdd')[0].selectedIndex = 0;
                                                    document.getElementsByClassName('selectsemdd')[1].selectedIndex = 0;
                                                    document.getElementsByClassName('selectsemdd')[2].selectedIndex = 0;
                                                    document.getElementsByClassName('selectsemdd')[3].selectedIndex = 0;
                                                    document.getElementsByClassName('selectsemdd')[0].disabled = true;
                                                    document.getElementsByClassName('selectsemdd')[1].disabled = true;
                                                    document.getElementsByClassName('selectsemdd')[2].disabled = true;
                                                    document.getElementsByClassName('selectsemdd')[3].disabled = true;
                                                }
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
                                                {semesters.map((item, index) => (
                                                    <>
                                                        {index < semester ? <option value={index + 1}>{item}</option> : null}
                                                    </>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="usertableselectcoursefilter" style={{ width: "100%" }}>
                                        <select name="" disabled className='selectsemdd subjectfilterinput' id=""  >
                                            <option value="" >Select Division...</option>
                                            {divisions.map((item, index) => (
                                                <>
                                                    {index < division ? <option value={item}>{item}</option> : null}
                                                </>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="filtersectionbuttons">
                                        <div className="applyfilterbutton" onClick={() => {
                                            document.getElementsByClassName('subjectfilterinput')[0].selectedIndex = 0;
                                            document.getElementsByClassName('subjectfilterinput')[1].selectedIndex = 0;
                                            document.getElementsByClassName('subjectfilterinput')[2].selectedIndex = 0;
                                            fetchAllStudent();
                                        }}>
                                            <p>Reset</p>
                                        </div>
                                        <div className="applyfilterbutton" onClick={() => {
                                            searchstudents();
                                            if (document.querySelector('.subjecttablefilterchildcontainer').classList.contains('subjecttablefilterchildcontaineractive')) {
                                                document.querySelector('.subjecttablefilterchildcontainer').classList.remove('subjecttablefilterchildcontaineractive');
                                            }
                                        }}>
                                            <p>Apply</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="usertablefiltermainsection">
                                    <div className="usertablefilterchildcontainer">
                                        <div className="resetfilterbutton" onClick={() => {
                                            document.getElementsByClassName('subjectfilterinput')[3].selectedIndex = 0;
                                            document.getElementsByClassName('subjectfilterinput')[4].selectedIndex = 0;
                                            document.getElementsByClassName('subjectfilterinput')[5].selectedIndex = 0;
                                            fetchAllStudent();
                                        }}>
                                            <i class="fa-solid fa-rotate"></i>
                                        </div>
                                        <div className="usertableselectcoursefilter">
                                            <select name="" id="" className='subjectfilterinput' onChange={(e) => {
                                                if (e.target.selectedIndex !== 0) {
                                                    // setCourseID(programs[e.target.selectedIndex - 1].program_id);
                                                    document.getElementsByClassName('selectsemdd')[0].disabled = false;
                                                    document.getElementsByClassName('selectsemdd')[1].disabled = false;
                                                    document.getElementsByClassName('selectsemdd')[2].disabled = false;
                                                    document.getElementsByClassName('selectsemdd')[3].disabled = false;
                                                    setSemester(programs[e.target.selectedIndex - 1].program_semesters);
                                                    setDivision(programs[e.target.selectedIndex - 1].program_divisions);
                                                } else {
                                                    setSemester(null);
                                                    // setCourseID(null);
                                                    document.getElementsByClassName('selectsemdd')[0].selectedIndex = 0;
                                                    document.getElementsByClassName('selectsemdd')[1].selectedIndex = 0;
                                                    document.getElementsByClassName('selectsemdd')[2].selectedIndex = 0;
                                                    document.getElementsByClassName('selectsemdd')[3].selectedIndex = 0;
                                                    document.getElementsByClassName('selectsemdd')[0].disabled = true;
                                                    document.getElementsByClassName('selectsemdd')[1].disabled = true;
                                                    document.getElementsByClassName('selectsemdd')[2].disabled = true;
                                                    document.getElementsByClassName('selectsemdd')[3].disabled = true;
                                                }
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
                                                {semesters.map((item, index) => (
                                                    <>
                                                        {index < semester ? <option value={index + 1}>{item}</option> : null}
                                                    </>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="usertableselectcoursefilter">
                                            <select name="" disabled className='selectsemdd subjectfilterinput' id="" >
                                                <option value="" >Select Division...</option>
                                                {divisions.map((item, index) => (
                                                    <>
                                                        {index < division ? <option value={item}>{item}</option> : null}
                                                    </>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="applyfilterbutton" onClick={searchstudents}>
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
                                            if (userCurrentPage !== 1) {
                                                setUserCurrentPage(userCurrentPage - 1);
                                            }
                                        }}>
                                            <i className="fa-solid fa-angle-left"></i>
                                        </button>
                                        <button className='paginationbtn nextpaginationbtn' onClick={() => {
                                            if (userCurrentPage !== userNPage) {
                                                setUserCurrentPage(userCurrentPage + 1)
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
                                            <th>Student Roll number</th>
                                            <th>Division</th>
                                            <th>Semester</th>
                                            <th>Course name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {userRecords.map((item, index) => (
                                            <>
                                                <tr>
                                                    <td>{userRecordsFirstIndex = userRecordsFirstIndex + 1}</td>
                                                    <td>{item.student_rollno}</td>
                                                    <td>{item.student_division}</td>
                                                    <td>{item.student_semester}</td>
                                                    <td>{item.program_name}</td>
                                                    <td className='recorddeletebutton' onClick={() => { deleteStudent(item.student_rollno) }}>
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
                    <div className="addcourseformcontainer">
                        <div className="adduserformheader">
                            <p>Add Students</p>
                            <i class="fa-solid fa-angle-down" onClick={toggleAddStudentsForm}></i>
                        </div>
                        <div className="adduserformbody">
                            <div className="addstudentforminputitem">
                                <p>Enter Student Roll No. Range</p>
                                <div className="addstudentslimitinputparentcontainer">
                                    <input className='adduserformtextinput addstudentsinputelement addstudentslimitinput' placeholder='Ex. 501' type="number" name="" id="" />
                                    <input className='adduserformtextinput addstudentsinputelement addstudentslimitinput' placeholder='Ex. 550' type="number" name="" id="" />
                                </div>
                            </div>
                            <div className="addstudentforminputitem">
                                <p>Select Course</p>
                                <select name="" id="" className=' adduserformselectinput addstudentsinputelement' onChange={(e) => { fetchDivision(e) }}>
                                    <option value="Select..." >Select...</option>
                                    {programs.map((item, index) => (
                                        <>
                                            <option value={item.program_name}>{item.program_name}</option>
                                        </>
                                    ))}
                                </select>
                            </div>
                            <div className="addstudentforminputitem">
                                <p>Select Division</p>
                                <select name="" id="" className='adduserformselectinput addstudentsinputelement' >
                                    <option value="Select...">Select...</option>
                                    {divisions.map((item, index) => (
                                        <>
                                            {index < division ? <option value={item}>{item}</option> : null}
                                        </>
                                    ))}
                                </select>
                            </div>
                            <div className="addstudentforminputitem">
                                <p>Select Semester</p>
                                <select name="" id="" className='adduserformselectinput addstudentsinputelement' >
                                    <option value="Select...">Select...</option>
                                    {semesters.map((item, index) => (
                                        <>
                                            {index < semester ? <option value={index + 1}>{item}</option> : null}
                                        </>
                                    ))}
                                </select>
                            </div>
                            <div className="adduserformsubmitbtncontainer">
                                <button div className="adduserformsubmitbtn" onClick={validateAddStudentsInputs}>
                                    {/* <button div className="adduserformsubmitbtn" > */}
                                    Add Students
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
