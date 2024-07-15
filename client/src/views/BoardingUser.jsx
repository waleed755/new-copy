import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/slices/user.slice.js'
import { findUserApi, registerApi } from '../services/apiConstants.js'
import { Typography, Button, Form, Input, message, Select, Upload } from 'antd'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import Logo from '../assets/color.png'
import axios from 'axios'
import { BASE_URL } from '../config.js'
import { FaCheck } from 'react-icons/fa6'

const { Title, Text } = Typography

export const BoardingUser = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    role: 'Admin',
    job: '',
    email: '',
    // userPhoto: null
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userPhoto, setUserphoto] = useState([])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = info => {
    let fileList = [...info.fileList]

    setUserphoto(fileList.map(file => file.originFileObj))
  }

  const roles = [
    { label: 'Controller', value: 'Controller' },
    { label: 'Mobile Driver', value: 'Mobile Driver' },
  ]

  const handleSubmit = async () => {
    try {
      localStorage.removeItem('token')
      console.log('formData', formData)
      const data = new FormData()
      userPhoto.forEach(file => {
        data.append('userPhoto', file)
      })
      data.append('userData', JSON.stringify(formData))

      // const response = await axios.post(`${BASE_URL}/register`, data, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })
      // localStorage.removeItem("token");
      // console.log('formData', formData);

      const response = await axios.post(
        `${BASE_URL}/register`,
        { userData: formData },
        {
          headers: {
            // 'Content-Type': 'multipart/form-data'
          },
        }
      )

      console.log('user response  = ', response)

      if (response.data.success) {
        localStorage.setItem('role', 'Admin')
        localStorage.setItem('token', response.data?.token)

        message.success(' User Registered Successfully!')
        dispatch(setUser(response.data.user))

        window.location.replace('/register-company')
      }
    } catch (error) {
      message.error(` ${error.response?.data?.message || error.message}!`)
    }
  }

  return (
    <div className='w-full md:w-[40%] shadow-2xl flex-col rounded-lg p-5 md:mt-[8%] mx-auto my-auto flex items-center justify-center'>
      <div className='flex items-center justify-center'>
        <img
          src={Logo}
          height={'82px'}
          width={'82px'}
          alt=''
          className='my-5 '
        />
      </div>
      <Title level={1} align='center' style={{ paddingTop: '20px' }}>
        Start Your Free 14-day Trail
      </Title>
      <div className='flex items-center gap-2 mb-5'>
        <span className='flex gap-2 items-center'>
          <FaCheck /> No Credit Card Required
        </span>
        <span className='flex gap-2 items-center'>
          <FaCheck /> Cancel Anytime
        </span>
      </div>

      <Form className='w-full' layout='vertical' onFinish={handleSubmit}>
        <Form.Item
          label='Full Name'
          name='fullName'
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input
            type='text'
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label='What is your job Role ?'
          name='designation'
          rules={[{ required: true, message: 'Please enter your designation' }]}
        >
          <Input
            type='text'
            name='job'
            value={formData.job}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label='Email'
          name='email'
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input
            type='text'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Item>

        {/* <Form.Item
          label="Profile Picture"
          name="userPhoto"
        >
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            listType="picture-card"
            multiple={false}
            maxCount={1}
            >
<PlusOutlined />
          </Upload>
        </Form.Item> */}

        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Next
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default BoardingUser
