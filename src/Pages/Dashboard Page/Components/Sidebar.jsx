import React, { useEffect, useState } from 'react'
import '../../../Css/Dashboard Page/Sidebar.css'
import { useDispatch } from 'react-redux'
import { setIsSidebarExtended } from '../../../redux/ID/IDSlice'
import img2 from '../../../Images/DAV logo.jpeg'

import { NavLink, Outlet, useNavigate } from 'react-router-dom'

export default function Sidebar() {
    const dispatch = useDispatch();
    const [uname, setName] = useState();
    const [logo, setLogo] = useState();
    const [uemail, setEmail] = useState();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState();
    const enableSidebar = () => {
        let sidebar = document.querySelector('.sidebarmaincontainer');
        sidebar.style.transform = "translateX(20vw)"
        let closebtn = document.querySelector('.sidebarclosebtn');
        closebtn.style.display = "block";
    }
    const disableSidebar = () => {
        let sidebar = document.querySelector('.sidebarmaincontainer');
        sidebar.style.transform = "translateX(110vw)"
    }

    const logout = async () => {
        let res = await fetch('https://ksir3-0backend.onrender.com/logout', {
            method: 'GET',
            credentials: 'include'
        })

        res = await res.json();
        if (res.valid) {
            navigate('/');
        }
    }

    const fetchUserDetails = async () => {
        let res = await fetch('https://ksir3-0backend.onrender.com/fetchuserdetails', {
            method: 'GET',
            credentials: 'include'
        })
        try {
            res = await res.json();
            setName(res[0].user_name);
            setEmail(res[0].user_email);
            setLogo(res[0].user_name[0].toUpperCase());
            setIsAdmin(res[0].adminpermission);
            // console.log(res);
        } catch (error) {
        }
    }

    const togglesidebar = () => {
        let ele = document.getElementsByClassName('sidebarmaincontainer');
        let ele2 = document.getElementsByClassName('navbarmaincontainer ');
        if (ele[0].classList.contains('minisidebar')) {
            document.querySelector('.selectquestionspagemaincontainer').classList.remove('megaselectquestionspagemaincontainer');
            dispatch(setIsSidebarExtended(0));
            ele[0].classList.remove('minisidebar')
            ele2[0].style.width = "82vw"
            ele2[0].style.left = "18vw"
        } else {
            ele[0].classList.add('minisidebar')
            document.querySelector('.selectquestionspagemaincontainer').classList.add('megaselectquestionspagemaincontainer');
            dispatch(setIsSidebarExtended(1));
            ele2[0].style.width = "95vw"
            ele2[0].style.left = "5vw"
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <div className='dashboardmaincontainer'>
            <div className="sidebarmaincontainer ">
                <div className="sidebarchildcontainer">
                    <div className="sidebarhidebutton">
                        <i className="fa-solid fa-circle-chevron-left" onClick={togglesidebar}></i>
                    </div>
                    <div className="sidebarclosebtn" onClick={disableSidebar}>
                    <i className="fa-solid fa-angle-right"></i>
                    </div>
                    <div className="sidebarheadersection">
                        <div className="sidebarheaderimage">
                            <p>{logo}</p>
                        </div>
                        <div className="sidebarheadermainheading">
                            <p>{uname}</p>
                            <label>{uemail}</label>
                        </div>
                    </div>
                    <div className="sidebarbodysection">
                        <div className="sidebarbodylists">
                            <NavLink to='/dashboard/selectquestions' className={({ isActive }) => (isActive ? 'activesidebarbodylist' : 'sidebarbodylist')}>
                                <i className="fa-regular fa-square-check"></i>
                                <p>Select COPO Questions</p>
                            </NavLink>
                            <NavLink to='/dashboard/insertmarks' className={({ isActive }) => (isActive ? 'activesidebarbodylist' : 'sidebarbodylist')}>
                                <i className="fa-solid fa-plus"></i>
                                <p>Insert Marks</p>
                            </NavLink>
                            <NavLink to='/dashboard/generatereport' className={({ isActive }) => (isActive ? 'activesidebarbodylist' : 'sidebarbodylist')}>
                                <i className="fa-solid fa-download"></i>
                                <p>Generate Report</p>
                            </NavLink>
                            {isAdmin === 1 ?
                                <>
                                    <NavLink to='/dashboard/manageuser' className={({ isActive }) => (isActive ? 'activesidebarbodylist' : 'sidebarbodylist')}>
                                        <i className="fa-solid fa-gear"></i>
                                        <p>Manage System</p>
                                    </NavLink>
                                    <NavLink to='/dashboard/managestudent' className={({ isActive }) => (isActive ? 'activesidebarbodylist' : 'sidebarbodylist')}>
                                        <i className="fa-regular fa-user"></i>
                                        <p>Manage Students</p>
                                    </NavLink>
                                </> :
                                null
                            }
                            <div className="sidebarbodylist" onClick={logout}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <p>Logout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="navbarmaincontainer">
                <div className="navbarlogoandheader">
                    <div className="navbarlogo">
                        <img src={img2} alt="" />
                    </div>
                    <div className="navbarheader">
                        <p>Ramanand Arya D.A.V College</p>
                    </div>
                </div>
                <div className="sidebaricon" onClick={enableSidebar}>
                    <i className="fa-solid fa-bars"></i>
                </div>
            </div>
            <Outlet />
        </div>
    )
}
