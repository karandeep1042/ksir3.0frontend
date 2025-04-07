import React, { useEffect, useState } from 'react'
import '../../../Css/LoginPage/LoginPage1.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setAccessToken, setIsAdmin } from '../../../redux/ID/IDSlice';

export default function LoginPage1() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [uemail, setEmail] = useState();
    const [otpEmail, setOtpEmail] = useState();
    const [upassword, setPassword] = useState();
    const [enteredOtp, setEnteredOtp] = useState();
    const [generatedOtp, setGeneratedOtp] = useState();
    const validateuserdetails = () => {
        let errorcounter = 0;
        let email = document.getElementById('emailid');
        let password = document.getElementById('password');
        let emailmsg = document.getElementById('emailerrormessage');
        let passmsg = document.getElementById('passworderrormessage');

        if (email.value === "") {
            email.style.border = "2px solid red";
            emailmsg.innerHTML = "Please Enter your email";
            emailmsg.style.visibility = "visible"
            emailmsg.style.color = "red";
            errorcounter++;
        } else if (!email.value.includes("@")) {
            errorcounter++;
            email.style.border = "2px solid red";
            emailmsg.style.color = "red";
            emailmsg.innerHTML = "Email shound include @";
            emailmsg.style.visibility = "visible"
        } else if (!email.value.includes(".com")) {
            errorcounter++;
            email.style.border = "2px solid red";
            emailmsg.innerHTML = "Email shound end with .com";
            emailmsg.style.visibility = "visible"
        } else {
            email.style.border = "2px solid #b4b4b4";
            emailmsg.value = "#";
            emailmsg.style.visibility = "hidden"
        }

        if (password.value === "") {
            errorcounter++;
            password.style.border = "2px solid red";
            passmsg.innerHTML = "Please Enter your password";
            passmsg.style.color = "red";
            passmsg.style.visibility = "visible"
        } else {
            password.style.border = "2px solid #b4b4b4";
            passmsg.value = "#";
            passmsg.style.visibility = "hidden"
        }

        if (errorcounter === 0) {
            getuserdetails();
        }
    }

    const validateemail = (e) => {
        let email = document.getElementsByClassName('forgotpassinput')[0];
        let emailmsg = document.getElementById('forgotpassemailerrormessage');
        let errorcounter = 0;
        if (email.value === "") {
            errorcounter++;
            email.style.border = "2px solid red";
            emailmsg.innerHTML = "Please Enter your email";
            emailmsg.style.visibility = "visible"
            emailmsg.style.color = "red";
            errorcounter++;
        } else if (!email.value.includes("@")) {
            errorcounter++;
            errorcounter++;
            email.style.border = "2px solid red";
            emailmsg.style.color = "red";
            emailmsg.innerHTML = "Email shound include @";
            emailmsg.style.visibility = "visible"
        } else if (!email.value.includes(".com")) {
            errorcounter++;
            email.style.border = "2px solid red";
            emailmsg.innerHTML = "Email shound end with .com";
            emailmsg.style.visibility = "visible"
        } else {
            email.style.border = "2px solid #b4b4b4";
            emailmsg.value = "#";
            emailmsg.style.visibility = "hidden"
        }

        if (errorcounter === 0) {
            console.log(otpEmail);
            checkEmail();
        }
    }

    const checkEmail = async () => {
        let emailmsg = document.getElementById('forgotpassemailerrormessage');
        let email = document.getElementsByClassName('forgotpassinput')[0];
        let res = await fetch(`https://ksir3-0backend.onrender.com/checkemail/${otpEmail}`, {
            method: "GET",
        });
        res = await res.json();
        if (res.valid) {
            sendotp();
            disableforgotpass();
            enableenterotp();
        } else {
            email.style.borderColor = "red"
            emailmsg.innerHTML = "Email not registered"
            emailmsg.style.color = "red"
            emailmsg.style.visibility = "visible"
        }
    }

    const sendotp = async () => {
        let otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        setGeneratedOtp(otp);
        console.log(otp);

        let res = await fetch(`https://ksir3-0backend.onrender.com/sendotp`, {
            method: "POST",
            body: JSON.stringify({ otp, otpEmail }),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });

        res = await res.json();
        console.log(res);
        if (res.sent) {
        }
    }

    const validateotp = () => {
        let otp = document.getElementsByClassName('enterotpinput')[0];
        let otperrormsg = document.getElementById('enterotperrormessage');
        if (enteredOtp === undefined || otp.value === "") {
            otperrormsg.style.color = "red"
            otp.style.borderColor = "red";
            otperrormsg.innerHTML = "Please Enter a OTP"
            otperrormsg.style.visibility = "visible"
            return;
        } else {
            otperrormsg.style.visibility = "hidden"
            otp.style.borderColor = "#b4b4b4";
        }

        if (enteredOtp === generatedOtp) {
            disableenterotp();
            enablenewpassform();
        } else {
            otperrormsg.style.color = "red"
            otp.style.borderColor = "red";
            otperrormsg.innerHTML = "Invalid OTP"
            otperrormsg.style.visibility = "visible"
        }
    }

    const validatenewpass = () => {
        let elements = document.getElementsByClassName('newpassinput');
        let errormsg = document.getElementsByClassName('newpasserrormsg');
        let errorcounter = 0;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.value === "") {
                errorcounter++;
                errormsg[i].style.color = "red";
                element.style.borderColor = "red";
                errormsg[i].style.visibility = "visible";
                errormsg[i].innerHTML = "This field cannot be empty";
            } else {
                element.style.borderColor = "grey";
                errormsg[i].style.visibility = "hidden";
            }
        }

        if (elements[0].value.length < 8 || elements[1].value.length < 8) {
            errorcounter++;
            elements[0].style.borderColor = "red";
            elements[1].style.borderColor = "red";
            errormsg[0].style.visibility = "visible";
            errormsg[1].style.visibility = "visible";
            errormsg[0].innerHTML = "Password length should be atleast 8 characters";
            errormsg[1].innerHTML = "Password length should be atleast 8 characters";
        }

        if (elements[0].value !== elements[1].value) {
            errorcounter++;
            elements[0].style.borderColor = "red";
            elements[1].style.borderColor = "red";
            errormsg[0].style.visibility = "visible";
            errormsg[1].style.visibility = "visible";
            errormsg[0].innerHTML = "Password should be same";
            errormsg[1].innerHTML = "Password should be same";
            // console.log("different");
        } else {
            console.log("same");
        }

        if (errorcounter === 0) {
            updatenewpass();
        }
    }

    const updatenewpass = async () => {
        let pass = document.getElementsByClassName('newpassinput')[0].value
        let res = await fetch(`https://ksir3-0backend.onrender.com/updatenewpass`, {
            method: "POST",
            body: JSON.stringify({ pass, otpEmail }),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        })

        res = await res.json();
        if (res.valid) {
            alert('Password was succesfully reset! you will be redirected to login page in few seconds');
            setTimeout(window.location.reload(), 5000);
        }
    }

    const getuserdetails = async () => {
        let res = await fetch(`https://ksir3-0backend.onrender.com/getuserdetails/${uemail}/${upassword}`, {
            method: "GET",
            credentials: 'include',
        });

        res = await res.json();
        console.log(res);
        if (res.msg === "valid") {
            console.log(res.data[0].adminpermission);
            dispatch(setIsAdmin(res.data[0].adminpermission));
            dispatch(setAccessToken(res.accessToken));
            navigate('/dashboard/selectquestions');
        } else {
            let email = document.getElementById('emailid');
            let password = document.getElementById('password');
            let emailmsg = document.getElementById('emailerrormessage');
            let passmsg = document.getElementById('passworderrormessage');

            email.style.border = "2px solid red";
            emailmsg.innerHTML = "Invalid credentials";
            emailmsg.style.visibility = "visible"
            emailmsg.style.color = "red";

            password.style.border = "2px solid red";
            passmsg.innerHTML = "Invalid credentials";
            passmsg.style.visibility = "visible"
            passmsg.style.color = "red";
        }
    }

    const enableforgotpass = () => {
        document.getElementsByClassName('fogotpasswordformcontainer')[0].style.display = "flex"
        document.getElementsByClassName('forgotpassinput')[0].value = "";
        setOtpEmail(undefined);
        document.getElementsByClassName('forgotpassinput')[0].style.borderColor = "grey";
        document.getElementById('forgotpassemailerrormessage').style.visibility = "hidden";

    }

    const disableforgotpass = () => {
        document.getElementsByClassName('fogotpasswordformcontainer')[0].style.display = "none"
        document.getElementsByClassName('forgotpassinput')[0].value = "";
    }

    const enableenterotp = () => {
        document.getElementsByClassName('enterotpformcontainer')[0].style.display = "flex"
        document.getElementsByClassName('enterotpinput')[0].value = "";
        setEnteredOtp(undefined);
        document.getElementsByClassName('enterotpinput')[0].style.borderColor = "grey";
        document.getElementById('enterotperrormessage').style.visibility = "hidden";
    }

    const disableenterotp = () => {
        document.getElementsByClassName('enterotpformcontainer')[0].style.display = "none"
        document.getElementsByClassName('enterotpinput')[0].value = "";
        setEnteredOtp(undefined);
    }

    const enableloginform = () => {
        document.getElementsByClassName('loginformcontainer')[0].style.display = "flex"
        document.getElementById('emailid').value = "";
        document.getElementById('password').value = "";
        setEmail(undefined);
        setPassword(undefined);
        document.getElementById('emailid').style.borderColor = "grey";
        document.getElementById('password').style.borderColor = "grey";
        document.getElementById('emailerrormessage').style.visibility = "hidden";
        document.getElementById('passworderrormessage').style.visibility = "hidden";
    }

    const disbleloginform = () => {
        document.getElementsByClassName('loginformcontainer')[0].style.display = "none"
        document.getElementById('emailid').value = "";
        document.getElementById('password').value = "";
        setEmail(undefined);
        setPassword(undefined);
        document.getElementById('emailid').style.borderColor = "grey";
        document.getElementById('password').style.borderColor = "grey";
        document.getElementById('emailerrormessage').style.visibility = "hidden";
        document.getElementById('passworderrormessage').style.visibility = "hidden";
    }

    const enablenewpassform = () => {
        document.getElementsByClassName('newpassformcontainer')[0].style.display = "flex"
    }

    const checkusertoken = async () => {
        let res = await fetch(`https://ksir3-0backend.onrender.com/checkusertoken`, {
            method: "GET",
            credentials: 'include',
        });

        res = await res.json();

        console.log(res);

        if (res.valid && res.msg === "loggedin") {
            navigate('/dashboard/selectquestions');
        }
    }
    useEffect(() => {
        checkusertoken();
        //eslint-disable-next-line
    }, [])


    return (
        <>
            <div className="loginformpagemaincontainer">
                <div className="loginformpagechildcontainer">
                    <div className="loginformcontainer">
                        <div className="loginformheadercontainer">
                            <div className="loginformheader">
                                <p>Login</p>
                            </div>
                        </div>
                        <div className="loginforminputfields">
                            <div className="loginforminputfield">
                                <label>Email Address</label>
                                <input type="email" className='loginforminput' placeholder='you@example.com' id="emailid" value={uemail} onChange={(e) => { setEmail(e.target.value) }} />
                                <p id='emailerrormessage' > asa</p>
                            </div>
                            <div className="loginforminputfield">
                                <div className="loginforminputfieldheader">
                                    <label>Password</label>
                                    <p className='forgotpasswordtext' onClick={() => {
                                        enableforgotpass();
                                        disbleloginform();
                                    }} >Forgot Password?</p>
                                </div>
                                <input type="password" placeholder='********' className='loginforminput' id="password" value={upassword} onChange={(e) => { setPassword(e.target.value) }} />
                                <p id='passworderrormessage' > asa</p>
                            </div>
                        </div>
                        <div className="loginformbtncontainer">
                            <button className="loginformbtn" onClick={validateuserdetails}>
                                LOGIN
                            </button>
                        </div>
                    </div>
                    <div className="newpassformcontainer">
                        <div className="loginformheadercontainer">
                            <div className="loginformheader">
                                <p>Set New Password</p>
                            </div>
                        </div>
                        <div className="loginforminputfields">
                            <div className="loginforminputfield newpassinputfield">
                                <label>Enter New Password</label>
                                <input type="password" className='newpassinput' placeholder='********' value={uemail} />
                                <p className='newpasserrormsg' style={{ visibility: 'hidden' }}> asa</p>
                            </div>
                            <div className="loginforminputfield newpassinputfield">
                                <div className="loginforminputfieldheader">
                                    <label>Re-enter New Password</label>
                                </div>
                                <input type="password" className='newpassinput' placeholder='********' value={upassword} />
                                <p className='newpasserrormsg' style={{ visibility: 'hidden' }} > asa</p>
                            </div>
                        </div>
                        <div className="loginformbtncontainer">
                            <button className="loginformbtn" onClick={() => {
                                validatenewpass();
                            }}>
                                Submit
                            </button>
                        </div>
                    </div>
                    <div className="fogotpasswordformcontainer">
                        <div className="forgotpasswordbackbutton" onClick={() => {
                            disableforgotpass();
                            enableloginform();
                        }}>
                            <i className="fa-solid fa-arrow-left"></i>
                            <p>Back</p>
                        </div>
                        <div className="forgotpasswordheadercontainer">
                            <div className="loginformheader">
                                <p>Forgot Password</p>
                            </div>
                        </div>
                        <div className="forgotpasswordforminputfields">
                            <div className="loginforminputfield">
                                <label>Enter your email</label>
                                <input type="email" className='forgotpassinput' placeholder='you@example.com' value={otpEmail} onChange={(e) => { setOtpEmail(e.target.value) }} />
                                <p id='forgotpassemailerrormessage' style={{ visibility: 'hidden' }} > asa</p>
                            </div>
                        </div>
                        <div className="loginformbtncontainer">
                            <button className="loginformbtn" onClick={(e) => {
                                validateemail(e);
                            }}>
                                Send Otp
                            </button>
                        </div>
                    </div>
                    <div className="enterotpformcontainer">
                        <div className="forgotpasswordbackbutton" onClick={() => {
                            disableenterotp();
                            enableforgotpass();
                        }}>
                            <i className="fa-solid fa-arrow-left"></i>
                            <p>Back</p>
                        </div>
                        <div className="forgotpasswordheadercontainer">
                            <div className="loginformheader">
                                <p>Forgot Password</p>
                            </div>
                            <div className="loginformsubheader">
                                <p>A OTP has been sent to {otpEmail}</p>
                            </div>
                        </div>
                        <div className="forgotpasswordforminputfields">
                            <div className="loginforminputfield">
                                <label>Enter OTP</label>
                                <input type="number" className='enterotpinput' placeholder='******' value={enteredOtp} onChange={(e) => {
                                    if (e.target.value.length < 7) {
                                        setEnteredOtp(e.target.value)
                                    }
                                }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <p id='enterotperrormessage' style={{ visibility: 'hidden' }}> asa</p>
                            </div>
                        </div>
                        <div className="loginformbtncontainer">
                            <button className="loginformbtn" onClick={() => {
                                validateotp();
                            }}>
                                Submit Otp
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
