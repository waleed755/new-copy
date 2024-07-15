import { useNavigate } from 'react-router-dom'
import LogoutButton from '../components/Logout.jsx'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCompany } from '../store/slices/company.slice.js'
import { registerCompanyApi } from '../services/apiConstants.js'
import { setUser } from '../store/slices/user.slice.js'
import {
  Typography,
  Button,
  Form,
  Input,
  message,
  Select,
  Upload,
  Row,
  Col,
} from 'antd'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import { BASE_URL } from '../config.js'
import Logo from '../assets/color.png'
import { BsPlus } from 'react-icons/bs'
import { FaCheck } from 'react-icons/fa6'
import countryList from 'react-select-country-list'

const { Title, Text } = Typography
const { Option } = Select

export const BoardingCompany = () => {
  const { isAuthenticated } = useAuth0()
  const [formData, setFormData] = useState({
    companyName: '',
    business: '',
    target: '',
    turnOver: '',
    totalEmployers: '',
    country: '',
  })

  const userStoreState = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/');
  //   }
  // }, [isAuthenticated, history]);

  const handleChange = e => {
    console.log('e', e)
    if (e.target) {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    } else {
      setFormData({ ...formData, country: e })
    }
  }

  const handleSubmit = async values => {
    const token = localStorage.getItem('token')

    try {
      // localStorage.removeItem('token')
      console.log('formData', formData)

      const response = await axios.post(
        `${BASE_URL}/register-company`,
        { companyData: values },
        {
          headers: {
            // 'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      )

      if (response.data.success) {
        message.success(' Company Registration Successfully!')
        navigate('/add-users')
      }
    } catch (error) {
      message.error(` ${error.response?.data?.message || error.message}!`)
    }
  }
  const options = useMemo(() => countryList().getData(), [])
  const industries = [
    {
      label: 'Cleaning',
      value: 'Cleaning',
    },
    {
      label: 'Construction',
      value: 'Construction',
    },
    {
      label: 'Education',
      value: 'Education',
    },
    {
      label: 'Healthcare',
      value: 'Healthcare',
    },
    {
      label: 'Hospitality',
      value: 'Hospitality',
    },
    {
      label: 'Manufactoring',
      value: 'Manufactoring',
    },
    {
      label: 'Security',
      value: 'Security',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ]

  return (
    <div className='w-full md:w-[40%] shadow-2xl flex-col rounded-lg p-5 md:mt-[10%] mx-auto my-auto flex items-center justify-center'>
      <div className='flex items-center justify-center'>
        <img
          src={Logo}
          height={'82px'}
          width={'82px'}
          alt=''
          className='my-5'
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Company Name'
              name='companyName'
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input
                type='text'
                value={formData.companyName}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Industry'
              name='industry'
            >
              <Select
                onChange={value =>
                  setFormData({ ...formData, industry: value })
                }
                options={industries}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Street Address' name='streetAddress'>
              <Input
                type='text'
                value={formData.business}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='City/Town' name='city'>
              <Input
                type='text'
                value={formData.target}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Postcode' name='postCode'>
              <Input
                type='text'
                value={formData.turnOver}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Country' name='country'>
              <Select
                placeholder='Select a country'
                value={formData?.country}
                onChange={handleChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                showSearch
              >
                {options.map(option => (
                  <Option key={option.value} value={option.label}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Time Zone'
              name='timeZone'
              rules={[{ required: true, message: 'Please enter time zone' }]}
            >
              <Input
                type='text'
                value={formData.totalEmployers}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Currency'
              name='currency'
              rules={[{ required: true, message: 'Please enter currency' }]}
            >
              <Input
                type='text'
                value={formData.totalEmployers}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
        </Row>
<<<<<<< HEAD
=======
        <Form.Item label='Company Logo' name='companyLogo'>
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            listType='picture-card'
            multiple={false}
          >
            <PlusOutlined />
          </Upload>
        </Form.Item> */}
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default BoardingCompany
