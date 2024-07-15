import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  message,
} from 'antd'
import {
  addActivityApi,
  getBranchApi,
  getCustomerNamesApi,
  getPropertyApi,
} from '../services/apiConstants'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import dayjs from 'dayjs'

const { Option } = Select
const { Item } = Form

const Activities = () => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [properties, setProperties] = useState(null)
  const [customersData, setCustomersData] = useState(null)
  const [loading, setLoading] = useState(false)

  const [propertyLoading, setPropertyLoading] = useState(false)
  const [branches, setBranches] = useState(null)
  const [customersName, setCustomersName] = useState(null)
  const navigate = useNavigate()
  const [form] = Form.useForm() // Ant Design Form instance

  const handleCustomerChange = async customerId => {
    form.setFieldsValue({ branchId: '' })
    form.setFieldsValue({ propertyId: '' })

    await setCustomersName(customerId)
    getProperties()
  }

  const getBranchesData = async () => {
    try {
      if (customersName) {
        const fetchRows = await getBranchApi()
        if (fetchRows.data.success) {
          if (customersName) {
            const filteredBranchesData = fetchRows.data.branches?.filter(
              item => item?.customerId == customersName
            )
            const transformedData = filteredBranchesData?.map(branch => ({
              value: branch._id,
              label: branch.branchName,
            }))
            setBranches(transformedData)
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [startValue, setStartValue] = useState(null)
  console.log('startValue', startValue)
  // Handler for when the start date changes
  const handleStartDateChange = (_, value) => {
    setStartValue(value)
    // Reset the finish date if it's before the selected start date
    form.setFieldsValue({
      activityFinishDate: null,
    })
  }

  useEffect(() => {
    getBranchesData()
    getProperties()
  }, [customersName])

  const getClients = async () => {
    try {
      const response = await getCustomerNamesApi()
      if (response.data.success) {
        // Transforming fetched data into { value, label } format
        const transformedData = response.data.customers.map(customer => ({
          value: customer._id, // Assuming customer id as value
          label: customer.accountName, // Assuming customer name as label
        }))
        setCustomersData(transformedData)
      }
    } catch (error) {
      console.error('Error fetching customer names:', error)
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      patrolRequired: 1,
      activityVpis: 1,
      activityFinishDate: dayjs(),
      activityStartDate: dayjs(),
      activityStartTime: dayjs().hour(0).minute(0),
      activityFinishTime: dayjs().hour(23).minute(59),
    })
  }, [])

  const getProperties = async () => {
    try {
      if (customersName) {
        setPropertyLoading(true)

        const fetchRows = await getPropertyApi()

        if (fetchRows.data.success) {
          if (customersName) {
            const transformedData = fetchRows?.data?.properties
              ?.filter(item => item?.customerId == customersName)
              ?.map(customer => ({
                value: customer._id, // Assuming customer id as value
                label: customer.propertyName, // Assuming customer name as label
              }))
            setProperties(transformedData)
          }
          setPropertyLoading(false)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getClients()
  }, [])

  const preventMinus = e => {
    if (e.code === 'Minus' || e.key == 'e' || e.key == 'E') {
      e.preventDefault()
    }
  }

  const renderForm = () => {
    switch (selectedOption) {
      case 'Vacant Property Check':
        return (
          <Row gutter={24}>
            <Col md={12} sm={24} xs={24}>
              <Item
                rules={[{ required: true }]}
                onKeyDown={preventMinus}
                label="No of VPI's Required"
                name='activityVpis'
              >
                <Input min={1} type='number' size='large' />
              </Item>
            </Col>
          </Row>
        )
      case 'Patrol':
        return (
          <Col md={12} sm={24} xs={24}>
            <Item
              rules={[{ required: true }]}
              onKeyDown={preventMinus}
              label='No of Patrols Required'
              name='patrolRequired'
            >
              <Input defaultValue={1} type='number' />
            </Item>
          </Col>
        )
      case 'Alarm Call':
        return (
          <Row gutter={24}>
            <Col md={12} sm={24} xs={24}>
              <Item label='Type of alram activation' name='alarmActivationType'>
                <Input />
              </Item>
            </Col>
          </Row>
        )
      default:
        return null
    }
  }

  const handleSelectChange = value => {
    setSelectedOption(value)
  }

  const onSubmit = async values => {
    console.log('values', values)
    try {
      setLoading(true)
      const formattedValues = {
        ...values,
        activityStartTime: values.activityStartTime.format('HH:mm:ss'),
        activityFinishTime: values.activityFinishTime.format('HH:mm:ss'),
      }
      const fetchRows = await addActivityApi({ activityData: formattedValues })
      if (fetchRows.data.success) {
        message.success('Activity Added Successfully')
        navigate('/user-dashboard/all-activities')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false) // Set loading to false after submission
    }
  }

  return (
    <div className='flex flex-col items-start p-10 h-[180vh] md:h-[100%]'>
      <div className='text-2xl  font-semibold w-full'>Add Activity</div>
      <div className=' mx-auto mt-3 '>
        <Form
          form={form}
          layout='vertical'
          className='p-4 bg-white'
          onFinish={onSubmit}
        >
          <Row gutter={24}>
            <Col md={12} sm={24} xs={24}>
              <Item
                rules={[{ required: true }]}
                label={'Customer'}
                name='customerId'
              >
                <Select
                  placeholder={'Select Customer'}
                  size='large'
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(
                      input?.toLowerCase()
                    )
                  }
                  showSearch
                  options={customersData}
                  onChange={data => handleCustomerChange(data)}
                />
              </Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Item
                rules={[{ required: true }]}
                label={'Branch'}
                name='branchId'
              >
                <Select
                  placeholder={'Select Branch'}
                  size='large'
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(
                      input?.toLowerCase()
                    )
                  }
                  showSearch
                  options={branches}
                />
              </Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Item
                rules={[{ required: true }]}
                label={'Property'}
                name={'propertyId'}
              >
                <Select
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(
                      input?.toLowerCase()
                    )
                  }
                  showSearch
                  placeholder={'Select Property'}
                  size='large'
                  options={properties}
                  loading={propertyLoading}
                />
              </Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Item
                rules={[{ required: true }]}
                label='Type'
                name='activityType'
              >
                <Select
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(
                      input?.toLowerCase()
                    )
                  }
                  showSearch
                  size='large'
                  className='  text-lg font-bold h-[50px] min-w-fit  rounded-md border border-transparent transition-all duration-300 ease-in-out hover:border-white'
                  value={selectedOption}
                  onChange={handleSelectChange}
                  placeholder='Select Activity'
                >
                  <Option value='Vacant Property Check'>
                    Vacant Property Check
                  </Option>
                  <Option value='Patrol'>Patrol</Option>
                  <Option value='Unlock'>Unlock</Option>
                  <Option value='Lock'>Lock</Option>
                  <Option value='Alarm Call'>Alarm Call</Option>
                  <Option value='Access Visit'>Access Visit</Option>
                  <Option value='Key Collection'>Key Collection</Option>
                  <Option value='Key Drop Off'>Key Drop off</Option>
                </Select>
              </Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Item
                rules={[{ required: true }]}
                label='Date From'
                name='activityStartDate'
              >
                <DatePicker
                  defaultValue={dayjs()}
                  onChange={(_, value) => handleStartDateChange('', value)}
                  format={'DD-MM-YYYY'}
                  style={{ width: '100%' }}
                  size='large'
                />
              </Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Item
                rules={[{ required: true }]}
                label='Date To'
                name='activityFinishDate'
              >
                <DatePicker
                  format={'DD-MM-YYYY'}
                  disabledDate={current => {
                    return current && current < moment(startValue, 'DD-MM-YYYY')
                  }}
                  style={{ width: '100%' }}
                  size='large'
                />
              </Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Item
                rules={[{ required: true }]}
                label='Start From'
                name='activityStartTime'
              >
                <TimePicker
                  needConfirm={false}
                  format={'HH:mm'}
                  style={{ width: '100%' }}
                  size='large'
                  showTime
                />
              </Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Item
                rules={[{ required: true }]}
                label='Finish Time'
                name='activityFinishTime'
              >
                <TimePicker
                  needConfirm={false}
                  format={'HH:mm'}
                  style={{ width: '100%' }}
                  size='large'
                  showTime
                />
              </Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Item label='PO/Reference Number' name='activityReferenceNumber'>
                <Input />
              </Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Item
                label='Additional Instructions (visible to officers)'
                name='activityAdditionalInstructions'
              >
                <Input.TextArea />
              </Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Item label='Internal Notes' name='activityInternalNotes'>
                <Input.TextArea />
              </Item>
            </Col>
          </Row>

          {selectedOption && renderForm()}
          <Col span={24}>
            <Item>
              <Button loading={loading} type='primary' htmlType='submit'>
                Submit
              </Button>
            </Item>
          </Col>
        </Form>
      </div>
    </div>
  )
}

export default Activities
