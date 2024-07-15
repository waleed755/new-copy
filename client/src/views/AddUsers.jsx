import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { inviteUserApi } from '../services/apiConstants.js'
import {
  Typography,
  Button,
  Input,
  Space,
  Row,
  Col,
  Card,
  Select,
  message,
} from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Logo from '../assets/color-logo-black-text.png'
import axios from 'axios'
import BASE_URL from '../config.js'
import { FaCheck } from 'react-icons/fa6'
const { Title, Text } = Typography

const { Option } = Select

export const AddUsers = () => {
  const { isAuthenticated } = useAuth0()
  const [formList, setFormList] = useState([
    { email: '', fullName: '', role: '' },
  ])
  const userString = localStorage.getItem('user')
  const user = JSON.parse(userString)
  const navigate = useNavigate()

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const newFormList = formList.slice()
    newFormList[index][name] = value
    setFormList(newFormList)
  }

  const handleSelectChange = (index, value) => {
    const newFormList = formList.slice()
    newFormList[index].role = value
    setFormList(newFormList)
  }

  const handleSubmit = async () => {
    // Check if all fields are filled
    for (let formData of formList) {
      if (!formData.email || !formData.fullName || !formData.role) {
        message.error('Please fill out all fields.')
        return
      }
    }

    const usersData = formList.map(formData => ({
      email: formData.email,
      fullName: formData.fullName,
      role: formData.role,
    }))

    try {
      const token = localStorage.getItem('token')

      const response = await axios.post(
        `${BASE_URL}/invite-user`,
        { users: usersData },
        {
          headers: {
            // 'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      )

      console.log('res invite user = ', response)
      if (response.data.message) {
        message.success(`Invitation Link has been sent on the provided Email`)
        handleClick()
      }
    } catch (error) {
      console.log('erere',error)
      message.error(`${error?.response?.data?.message}`)
    }
  }

  const handleClick = () => {
    navigate('/user-dashboard/dashboard')
  }

  const addForm = () => {
    setFormList(prevFormList => [
      ...prevFormList,
      { email: '', fullName: '', role: '' },
    ])
  }

  const removeForm = index => {
    console.log('Removing item at index:', index)
    const newFormList = formList.filter((_, i) => i !== index)
    setFormList(newFormList)
  }

  console.log('formList', formList)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      <ToastContainer />
      <div style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', border: '1px solid #e8e8e8', padding: '20px', maxWidth: '90%', width: '100%', background: '#fff' }}>
      <div className='flex items-center justify-center'>
        <img
          src={Logo}
          height={'182px'}
          width={'182px'}
          alt=''
          className='my-5'
        />
      </div>
      <Title level={6} align='center' style={{ paddingTop: '20px' }}>
        Who else is on your team ? 
      </Title>
     
        
        <Card>
          {formList.map((formData, index) => (
            <Row
              key={index}
              gutter={32}
              align='middle'
              style={{ marginBottom: 16 }}
            >
              <Col span={7}>
                <label>Full Name</label>
                <Input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={e => handleChange(index, e)}
                  placeholder='Full Name'
                  required
                />
              </Col>
              <Col span={7}>
                <label>Email</label>
                <Input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={e => handleChange(index, e)}
                  placeholder='Email'
                  required
                />
              </Col>
              <Col span={7}>
                <label>Role</label>
                <Select
                  value={formData.role}
                  onChange={value => handleSelectChange(index, value)}
                  placeholder='Select Role'
                  required
                  style={{ width: '100%' }}
                >
                  <Option value='Mobile Driver'>Mobile Driver</Option>
                  <Option value='Controller'>Controller</Option>
                </Select>
              </Col>
              <Col span={3}>
                {formList.length > 1 && (
                  <MinusCircleOutlined
                    onClick={() => removeForm(index)}
                    style={{
                      fontSize: '24px',
                      color: 'red',
                      cursor: 'pointer',
                      marginTop: 30,
                    }}
                  />
                )}
              </Col>
            </Row>
          ))}
          {/* <div className='flex items-start justify-between'> */}
        <div className='flex  justify-between items-start gap-3'>   <div className='flex flex-col gap-12'>
        <Button type='dashed' onClick={addForm} icon={<PlusOutlined />}>
              Add Another
            </Button>
            <div className='flex  items-center gap-5'><Button type='primary' onClick={handleSubmit}>
                Invite
              </Button><Button type='dashed' onClick={()=>{handleClick()}}>Skip</Button> </div>
        </div>
            <Space>
             
            </Space>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AddUsers
