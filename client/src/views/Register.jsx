import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { registerApi } from '../services/apiConstants.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/user.slice.js';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleSubmit = async (userData) => {
    try {
      const response = await registerApi({ userData });
      if (response.data.success) {
        localStorage.setItem("token", response.data?.token);
        message.success(' User Registered Successfully!');
        dispatch(setUser(response.data.user));
  
        // Use window.location.replace to navigate without adding to history
        window.location.replace('/user-dashboard/dashboard');
      }
    } catch (error) {
      message.error(` ${error}!`);
    }
  };
  
  
  return (
    <div style={{ padding: '120px', textAlign: 'center' }}>
      <Typography.Title level={5}>Register</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        <Form.Item
          label='Full Name'
          name='fullName'
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Company Name'
          name='companyName'
          rules={[{ required: true, message: 'Please input your company name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Job'
          name='job'
          rules={[{ required: true, message: 'Please input your job!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Role'
          name='role'
          rules={[{ required: true, message: 'Please input your role!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Please input your email!', type: 'email' },
          ]}
        >
          <Input type='email' />
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
