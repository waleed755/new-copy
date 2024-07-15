import { Form, Input, Button, Typography, message } from 'antd';
import { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordApi, VerifyOTPApi, verifyEmail } from '../services/apiConstants';
import Logo from '../assets/color.png';

const { Title, Text } = Typography;

const OTPInput = ({ value = '', onChange, onPaste }) => {
  const inputs = useRef([]);

  useEffect(() => {
    if (value.length === 5) {
      inputs.current[4].blur();
    }
  }, [value]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^[0-9]$/.test(val) || val === '') {
      const otp = value.split('');
      otp[index] = val;
      onChange(otp.join(''));

      if (val.length === 1 && index < 4) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyUp = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && !value[index]) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    if (/^\d{5}$/.test(paste)) {
      onChange(paste);
      inputs.current[4].focus();
    }
    e.preventDefault();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',gap:10 }}>
      {Array(5).fill('').map((_, index) => (
        <Input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyUp={(e) => handleKeyUp(e, index)}
          onPaste={handlePaste}
          style={{ width: '20%',height:48, textAlign: 'center' }}
        />
      ))}
    </div>
  );
};

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (otp.length === 5) {
      form.submit();
    }
  }, [otp, form]);

  const handleSendOtp = async (values) => {
    setLoading(true);
    try {
      const response = await verifyEmail({ email: values.email });
      if (response.data.success) {
        message.success('OTP sent successfully.');
        setEmail(values.email);
        setStep(2);
      } else {
        message.error('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      message.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await VerifyOTPApi({ email, otp });
      if (response.data.success) {
        message.success('OTP verified successfully.');
        setStep(3);
      } else {
        message.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      message.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      const response = await ResetPasswordApi({ email, newPassword: values.password });
      if (response.data.success) {
        message.success('Password reset successfully.');
        navigate('/login');
      } else {
        message.error('Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      message.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[40%] mx-auto my-auto h-screen flex items-center justify-center">
      <Form
        className="w-full md:w-[50%] shadow-2xl rounded-lg p-5"
        form={form}
        onFinish={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword}
        layout="vertical"
        requiredMark={false}
      >
          <div className='flex items-center justify-center'>
        <img src={Logo} height={'82px'} width={'82px'} alt="" className="my-5" />
      </div>
        {step === 1 && (
          <>
            <Title level={6} align="center" style={{ paddingTop: '20px' }}>
              Reset Password
            </Title>
            <Text type="secondary" align="center">
              Enter your email address to receive an OTP.
            </Text>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter your email!' }]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item className="flex items-center justify-center">
              <Button type="primary" htmlType="submit" loading={loading}>
                Send OTP
              </Button>
            </Form.Item>
          </>
        )}
        {step === 2 && (
          <>
            <Title level={6} align="center" style={{ paddingTop: '20px' }}>
              Enter OTP
            </Title>
            <Text type="secondary" align="center">
              Enter the OTP sent to your email.
            </Text>
            <Form.Item
              label="OTP"
              name="otp"
              rules={[{ required: true, message: 'Please enter the OTP!' }]}
            >
              <OTPInput value={otp} onChange={setOtp} />
            </Form.Item>
            <Form.Item className="flex items-center justify-center">
              <Button type="primary" htmlType="submit" loading={loading}>
                Verify OTP
              </Button>
            </Form.Item>
          </>
        )}
        {step === 3 && (
          <>
            <Title level={6} align="center" style={{ paddingTop: '20px' }}>
              Reset Password
            </Title>
            <Text type="secondary" align="center">
              Enter a new password.
            </Text>
            <Form.Item
              label="New Password"
              name="password"
              rules={[{ required: true, message: 'Please enter a new password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item className="flex items-center justify-center">
              <Button type="primary" htmlType="submit" loading={loading}>
                Reset Password
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default ForgotPassword;
