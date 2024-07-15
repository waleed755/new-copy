import { Form, Input, Button, Typography, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { loginApi } from '../services/apiConstants.js';
import Logo from '../assets/color.png';


const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (values) => {
    try {
setLoading(true)
      const response = await loginApi(values);
      localStorage.setItem('email',values?.email)

      if (response.data.success) {
        message.success('OTP sent to your email');
        // dispatch(setUser(response.data.user));
        setLoading(false)
        navigate('/verify-otp')
        // if (!response.data.user.isAdmin) {
        //   navigate('/user-dashboard/customer');
        // }
      }
    } catch (error) {
      setLoading(false)
      console.log('error',error)
      message.error(` ${error?.response?.data?.message}!`);
    }
  };

  const handleForgotPassword = () => {
    navigate('/reset-password'); // Navigate to Forgot Password screen
  };

  return (
    <div className="w-full md:w-[40%] mx-auto my-auto h-screen flex items-center justify-center">
      <Form
        className="w-full md:w-[50%] shadow-2xl rounded-lg p-5"
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
      >
        <Title level={6} align="center" style={{ paddingTop: '20px' }}>
          Login
        </Title>
<div className='flex items-center justify-center'>        <img src={Logo} height={'30%'} width={'30%'} alt="" className="my-5 " />
</div>
        <Text type="secondary" align="center">
        </Text>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email!' }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <div className="w-full">
  <Form.Item className="w-full" style={{ width: '100%' }}>
    <Button type="primary" style={{ width: '100%' }} className="w-full" htmlType="submit" loading={loading}>
      Login
    </Button>
  </Form.Item>
</div>

          <div className='flex justify-between items-center'><Button type="link" onClick={handleForgotPassword}>
            Can't log in?
          </Button><Button  type='link' onClick={()=>{navigate('/register-user')}}>Register a Company</Button>
          </div>
      </Form>
    </div>
  );
};

export default Login;
