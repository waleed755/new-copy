import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Spin, message } from "antd";
import { ResendOTPApi, VerifyOTPApi } from "../services/apiConstants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { setUser } from '../store/slices/user.slice.js';
import Logo from '../assets/color.png';



function GetOtp({onVerify}) {
  const [otpValues, setOtpValues] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [timer, setTimer] = useState(60); // Timer in seconds
  const email = localStorage.getItem('email');
  const navigate = useNavigate();
const dispatch = useDispatch()
  const inputRefs = useRef(Array.from({ length: 5 }, () => React.createRef()));

  // Auto focus on the first input box when component mounts
  useEffect(() => {
    inputRefs.current[0].current.focus();
    startResendTimer(); // Start the resend timer when component mounts
  }, []);
  const startResendTimer = () => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  };
  const handleOtpChange = (index, value) => {
    const newOtpValues = [...otpValues];
  
    // Update the OTP value at the specified index
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
  
    // Move focus to the previous input box on backspace from an empty box
    if (value === "" && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  
    // Move focus to the next input box if the current box is filled
    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].current.focus();
    }
  
    // Check if the last input box is filled and trigger OTP verification
    if (index === inputRefs.current.length - 1 && value !== "") {
      handleVerifyOtp(newOtpValues);
    }
  
    // Automatically move focus to the next empty input box when typing after backspacing
    if (value !== "" && index > 0 && newOtpValues[index - 1] !== "") {
      for (let i = index + 1; i < inputRefs.current.length; i++) {
        if (newOtpValues[i] === "") {
          inputRefs.current[i].current.focus();
          break;
        }
      }
    }
  };
  
  
  const handleVerifyOtp = async (values) => {
    try {
      setLoading(true);
      const otpString = values.join(""); // Concatenate OTP values into a string
      const response = await VerifyOTPApi({ otp: otpString, email: email });

      if (response.data.success) {
        localStorage.setItem("token", response.data?.token);
        localStorage.setItem('role',response.data?.role)
        localStorage.setItem('user',JSON.stringify(response.data?.user));

        const token = localStorage.getItem("token");
        if(token){
          message.success(" OTP Verified Successfully!");
          onVerify()
          if(response.data?.role == 'Controller' || response.data?.role == 'Admin'){
            window.location.replace('/user-dashboard/dashboard');

          }else{
            window.location.replace('/user-dashboard/all-activities');

          }
        }
        
      } else {
        message.error(` ${response?.data?.message}!`);
      }
    } catch (error) {
      message.error(` ${error}!`);
    } finally {
      setLoading(false);
    }
  };
  const userStoreState = useSelector(state => state.user);
  console.log('call',userStoreState)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text");

    if (pastedData.length === otpValues.length) {
      const newOtpValues = pastedData.split("").slice(0, otpValues.length);
      setOtpValues(newOtpValues);

      // Fill all input boxes with pasted data
      newOtpValues.forEach((value, index) => {
        if (inputRefs.current[index] && inputRefs.current[index].current) {
          inputRefs.current[index].current.focus();
        }
      });

      // Verify OTP if all boxes are filled after pasting
      handleVerifyOtp(newOtpValues);
    }
  };
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const response = await ResendOTPApi({ email:email });

      if (response.data.success) {
        message.success("📧 OTP Resent Successfully!");
        setTimer(60); // Reset timer
        startResendTimer(); // Restart the resend timer
      } else {
        message.error(` ${response?.data?.message}!`);
      }
    } catch (error) {
      message.error(` ${error}!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[424px] h-[323px] flex flex-col items-center justify-between border-[1.5px] rounded-lg border-solid border-[#4DAEEC33] p-[32px]">
      <div className='flex items-center justify-center'>        <img src={Logo} height={'30%'} width={'30%'} alt="" className="my-5 " />
      </div>
        <div className="flex gap-[14px] my-3">
          {otpValues.map((value, index) => (
            <Input
              key={index}
              className="customInput h-[72px] w-[60px] rounded-xl text-center"
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onPaste={handlePaste}
              ref={inputRefs.current[index]}
              maxLength={1}
            />
          ))}
        </div>
        <div className=" flex w-full justify-between  items-center gap-3 text-[18px] text-[#666666] mb-2">
          {timer > 0
            ? `Resend OTP in ${timer} seconds`
            : "Didn't get OTP ?"}
            <button
          onClick={handleResendOtp}
          className="text-[16px]   text-center underline  font-medium   flex items-center justify-center bg-transparent border-none"
          disabled={loading || timer > 0}
        >
          Resend OTP
          {loading && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
        </button>
        </div>
        <Button
        loading={loading}
          onClick={() => handleVerifyOtp(otpValues)}
          className="text-[16px] gap-4 w-full text-center font-medium rounded-xl px-[20px] py-[14px] flex items-center justify-center bg-[#228ACB]"
          disabled={loading}
        >
          Verify
          
        </Button>
      </div>
    </div>
  );
}

export default GetOtp;
