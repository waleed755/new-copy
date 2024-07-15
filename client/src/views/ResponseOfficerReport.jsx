'use client'
import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Checkbox,
  Row,
  Col,
  Upload,
  message,
  Switch,
} from 'antd'
import {
  addOfficerResponseApi,
  getSingleActivityApi,
  officerResponseALreadyFilledApi,
  updateActivityStatusApi,
} from '../services/apiConstants'
import { useNavigate, useParams } from 'react-router-dom'
import PreviewResponseOfficerReport from './PreviewResponseOfficerReport.jsx'
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import dayjs from 'dayjs'
import { compressFile } from '../Utils/Image/index.jsx'

const { TextArea } = Input
const { Option } = Select

const ResponseOfficerReport = () => {
  const { reference } = useParams()
  const navigate = useNavigate()
  const [alreadyFilledForm, setAlreadyFilledForm] = useState(false)
  const [long, setLong] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [lat, setLat] = useState(null)
  const [reason, setReason] = useState('')
  const [isElectricMeter, setIsElectricMeter] = useState(false)
  const [isGasMeter, setIsGasMeter] = useState(false)
  const [isWaterMeter, setIsWaterMeter] = useState(false)
  const currentDateTime = dayjs()

  const [imageFiles, setImageFiles] = useState([])

  const [activity, setActivity] = useState({})
  const [isResetSuccessful, setIsResetSuccessful] = useState(false)

  const handleResetSuccess = (success) => {
    setIsResetSuccessful(success)
  }

  useEffect(() => {
    getActivity()
  }, [activity.activityStatus, isResetSuccessful])

  const getActivity = async () => {
    const fetchRows = await getSingleActivityApi(reference)
    if (fetchRows.data.success) {
      setActivity(fetchRows.data.activity)
    }
  }

  const submitFilled = async () => {
    const data = {
      officerResponseData: {
        officerResponseAlreadyFilled: reason,
        activityType: activity?.activityType,
        activityId: activity?._id,
      },
    }

    const fetchRows = await officerResponseALreadyFilledApi(data, reference)
    if (fetchRows.data.success) {
      message.success('Officer Response has been Added')
      updateActivityStatus(activity._id, 'Completed')
      navigate('/user-dashboard/all-activities')
    }
  }

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true)
      const activityData = new FormData()
      const formattedValues = {
        ...values,
        officerTimeOnSite: moment(new Date(values.officerTimeOnSite)).format(
          'HH:mm'
        ),
        officerTimeOffSite: moment(new Date(values.officerTimeOffSite)).format(
          'HH:mm'
        ),
        officerStartDate: moment(new Date(values.officerStartDate)).format(
          'DD-MM-YYYY'
        ),
        officerFinishDate: moment(new Date(values.officerFinishDate)).format(
          'DD-MM-YYYY'
        ),
      }
      activityData.append(
        'officerResponseData',
        JSON.stringify(formattedValues)
      )

      activityData.append('id', reference)

      // Append all image files to the FormData object
      imageFiles.forEach((file) => {
        activityData.append(`photos`, file.originFileObj)
      })

      const fetchRows = await addOfficerResponseApi(activityData, reference)
      if (fetchRows.data.success) {
        updateActivityStatus(activity._id, 'Submitted')

        message.success('Officer Response has been Added')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitLoading(false)
    }
  }

  const preventMinus = (e) => {
    if (e.code === 'Minus' || e.key == 'e' || e.key == 'E') {
      e.preventDefault()
    }
  }

  const renderForm = () => {
    switch (activity?.activityType) {
      case 'Vacant Property Check':
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name='officerGainEntry'
                label='Were you able to gain entry?'
                rules={[{ required: true, message: 'Please select an option' }]}
              >
                <Select size='large' placeholder='Select an option'>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerAlarmPanelDisplay'
                label='Intruder Alarm Panel Display'
              >
                <Input size='large' />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerAllAreasClear'
                label='All areas, footpaths & walkways clear and free from refuse, obstruction and hazards?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerExternalLighting'
                label='Is all of the external lighting functional?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerBrickwork'
                label='Does the brickwork, roof elevations & gutters look sound and free from defects?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerDoorsWindowsSecure'
                label='Are all doors, windows, shutters, locks & fasteners sound & secure?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerSecurityAlarm'
                label='Is the security alarm operational?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerEvidenceVandalism'
                label='Is there any evidence of vandalism or forced entry?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerFireAlarm'
                label='Is the fire alarm / smoke detector operational?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerLighting'
                label='Is the lighting / emergency lighting operational?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerHeating'
                label='Is the heating turned off?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerInternalAreasClear'
                label='Are all internal areas clear and free from obstruction and waste?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerEvidenceActivityVermin'
                label='Is there any evidence of activity from vermin/infestation?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerWaterTanks'
                label='Are the water tanks/plumbing etc all drained down and free from leaks?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerEvidenceWaterIngress'
                label='Is there any evidence of water ingress?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerEvidenceDamp'
                label='Is there any evidence of damp?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerIncreasedRisksLocation'
                label='Are there any increased risks at this location?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerIncreasedRisksSlipTrip'
                label='Are there any increased risks of slip, trip or fall?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerIssuesMainElectricitySupply'
                label='Are there any issues with the main electricity supply?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerLooseDangerousBuildingFabric'
                label='Is there any loose or dangerous building fabric?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerIssuesBoilerRoom'
                label='Are there any issues in the boiler room?'
              >
                <Select>
                  <Option value='yes'>Yes</Option>
                  <Option value='no'>No</Option>
                  <Option value='na'>N/A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name='officerElectricityMeter' label='Is there an electricity meter?'>
                <Checkbox
                  checked={isElectricMeter}
                  onChange={(e) => setIsElectricMeter(e.target.checked)}
                >
                  Checked
                </Checkbox>
              </Form.Item>
              {isElectricMeter && (
                <Form.Item
                  onKeyDown={preventMinus}
                  name='officerElectricityMeterReading'
                  label='Electricity meter reading'
                >
                  <Input size='large' />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name='officerGasMeter' label='Is there a gas meter?' valuePropName='checked'>
                <Checkbox
                  checked={isGasMeter}
                  onChange={(e) => setIsGasMeter(e.target.checked)}
                >
                  Checked
                </Checkbox>
              </Form.Item>
              {isGasMeter && (
                <Form.Item
                  name='officerGasMeterReading'
                  label='Gas meter reading'
                  onKeyDown={preventMinus}
                >
                  <Input size='large' />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name='officerWaterMeter' label='Is there a water meter?' valuePropName='checked'>
                <Checkbox
                  checked={isWaterMeter}
                  onChange={(e) => setIsWaterMeter(e.target.checked)}
                >
                  Checked
                </Checkbox>
              </Form.Item>
              {isWaterMeter && (
                <Form.Item
                  name='officerWaterMeterReading'
                  label='Water meter reading'
                  onKeyDown={preventMinus}
                >
                  <Input size='large' />
                </Form.Item>
              )}
            </Col>
            <Col xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                name='officerGeneralComments'
                label='General comments on the condition of the site'
              >
                <Input.TextArea size='large' />
              </Form.Item>
            </Col>
          </Row>
        )
      // Patrol configuration settings
      case 'Patrol':
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='PO number/Reference Number'
                name='officerReferenceNumber'
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Additional Instructions (visible to officers)'
                name='officerAdditionalInstructions'
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Internal Notes'
                name='officerInternalNotes'
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='CKH ref*'
                name='officerCkhRef'
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Patrol type*'
                name='patrolType'
              >
                <Select>
                  <Select.Option value='external'>External</Select.Option>
                  <Select.Option value='internal'>Internal</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Response Officer name'
                name='responseOfficerName'
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Response Officer report'
                name='responseOfficerReport'
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Exits checked?'
                name='exitsChecked'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Windows checked?'
                name='windowsChecked'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Toilets/kitchen checked?'
                name='toiletsKitchenChecked'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Patrol report'
                name='patrolReport'
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Intruder alarm re-armed?'
                name='intruderAlarmRearmed'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Have you contacted the ARC and confirmed that the intruder alarm is set?'
                name='arcContacted'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Follow-up actions'
                name='followUpActions'
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
        )

      case 'Unlock/lock':
      case 'Key Collection':
      case 'Key Drop off':
      case 'Access Visit':
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Status*'
                name='status'
              >
                <Select>
                  <Select.Option value='pending'>Pending</Select.Option>
                  <Select.Option value='completed'>Completed</Select.Option>
                  <Select.Option value='failed'>Failed</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Were you able to gain entry?'
                name='entryGained'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Intruder alarm panel display'
                name='intruderAlarmDisplay'
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='External patrol?'
                name='officerExternalPatrol'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Internal patrol?'
                name='officerInternalPatrol'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Exits checked?'
                name='exitsChecked'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Windows checked?'
                name='windowsChecked'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Toilets/kitchen checked?'
                name='toiletsKitchenChecked'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='People on-site?'
                name='peopleOnSite'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Patrol report'
                name='patrolReport'
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Cause of Activation'
                name='officerCauseOfActivation'
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Have you contacted the ARC and confirmed that the intruder alarm is set?'
                name='arcContacted'
              >
                <Select>
                  <Select.Option value='yes'>Yes</Select.Option>
                  <Select.Option value='no'>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Name of the ARC operator that you spoke to'
                name='arcOperatorName'
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'Please select an option' }]}
                label='Follow-up actions'
                name='followUpActions'
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
        )

      default:
        return null
    }
  }

  const [onSiteDateTime, setOnSiteDateTime] = useState(moment())

  const handleDateChange = (value) => {
    setOnSiteDateTime(value)
  }

  const handleImageChange = async (info) => {
    try {
      // Get all uploaded image files
      let newFileList = await Promise.all(
        info.fileList.map(async (file) => {
          if (file.originFileObj) {
            const compressedFile = await compressFile(file.originFileObj)
            return compressedFile // Ensure compressedFile contains originFileObj
          }
          return file // Return original file object if no compression
        })
      )

      setImageFiles(newFileList) // Update state with new file list
    } catch (error) {
      console.error('Error handling image change:', error)
      // Handle error state or logging as needed
    }
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  navigator.geolocation.getCurrentPosition(
    function (position) {
      getAddressFromCoordinates(
        position.coords.latitude,
        position.coords.longitude
      ) // Replace these coordinates with your own
      setLat(position.coords.latitude)
      setLong(position.coords.longitude)
      console.log(
        'Latitude:',
        position.coords.latitude,
        'Longitude:',
        position.coords.longitude
      )
    },
    function (error) {
      console.error('Error Code = ' + error.code + ' - ' + error.message)
    }
  )

  function getAddressFromCoordinates(latitude, longitude) {
    var url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`

    fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log('data', data) // This is your address string
        } else {
          console.log('Address not found')
        }
      })
      .catch((error) => console.error('Error:', error))
  }

  // Example usage with latitude and longitude

  const updateActivityStatus = (activityId, activityStatus, date, time) => {
    setLoading(true)
    const userStoreState = JSON.parse(localStorage.getItem('user'))

    // Initialize activity data with base fields
    const activityData = {
      activityId,
      activityStatus,
      performedByUserId: userStoreState?._id,
      activityAcceptedDate: undefined,
      activityAcceptedTime: undefined,
      activityOnTheWayDate: undefined,
      activityOnTheWayTime: undefined,
      activityOnSiteDate: undefined,
      activityOnSiteTime: undefined,
      activityOffSiteDate: undefined,
      activityOffSiteTime: undefined,
      onTheWayLat: undefined,
      onTheWayLong: undefined,
      onSiteLat: undefined,
      onSiteLong: undefined,
      offSiteLat: undefined,
      offSiteLong: undefined,
    }

    // Update date and time fields based on the current status
    const currentDate = moment()
    const currentTime = moment().format('HH:mm')

    switch (activityStatus) {
      case 'Accepted':
        activityData.activityAcceptedDate = currentDate
        activityData.activityAcceptedTime = currentTime
        activityData.onAcceptedlat = lat
        activityData.onAcceptedLong = long
        break
      case 'Enroute':
        activityData.activityOnTheWayDate = currentDate
        activityData.activityOnTheWayTime = currentTime
        activityData.onTheWaylat = lat
        activityData.onTheWayLong = long
        break
      case 'On Site':
        activityData.activityOnSiteDate = date
        activityData.activityOnSiteTime = time
        activityData.onSitelong = long
        activityData.onSitelat = lat
        break
      case 'Completed':
        activityData.activityOffSiteDate = moment(currentDate).format('DD-MM-YYYY')
        activityData.activityOffSiteTime = currentTime
        activityData.offSitelat = lat
        activityData.offSiteLong = long
        break
    }

    const updateStatus = async () => {
      try {
        const fetchRows = await updateActivityStatusApi({ activityData })
        if (fetchRows.data.success) {
          setActivity((prev) => ({
            ...prev,
            activityStatus: fetchRows.data.activity.activityStatus,
            // Update local state with the new times, dates, and coordinates
            ...activityData,
          }))
        }
      } catch (error) {
        setLoading(false)

        console.error('Error updating activity status:', error)
        // Handle error, e.g., show notification or message to the user
      } finally {
        setLoading(false)
        getActivity()
      }
    }

    updateStatus()
  }

  switch (activity.activityStatus) {
    case 'Pending':
    case 'Over Due':
    case 'Due':
      return (
        <Button
          loading={loading}
          type='primary'
          onClick={() => {
            updateActivityStatus(activity._id, 'Accepted')
          }}
          className='mt-7'
        >
          Accept
        </Button>
      )
    case 'Accepted':
      return (
        <Button
          loading={loading}
          type='primary'
          className='mt-7'
          onClick={() => {
            updateActivityStatus(activity._id, 'Enroute')
          }}
        >
          Enroute
        </Button>
      )
    case 'Enroute':
      return (
        <div className='flex mt-10 gap-5 items-center'>
          <Button
            loading={loading}
            type='primary'
            onClick={() => {
              updateActivityStatus(
                activity._id,
                'On Site',
                onSiteDateTime?.format('YYYY-MM-DD'),
                onSiteDateTime?.format('HH:mm')
              )
            }}
          >
            On Site
          </Button>
          <DatePicker
            defaultValue={currentDateTime}
            placeholder='Enter time and date'
            format='DD-MM-YYYY HH:mm'
            showTime
            needConfirm={false}
            // defaultValue={onSiteDateTime}
            //  selected={onSiteDateTime}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat='HH:mm'
            timeIntervals={15}
            timeCaption='time'
            dateFormat='MMMM d, yyyy hh:mm'
          />
        </div>
      )
    case 'On Site':
      return (
        <>
          <div className='flex gap-5 my-10 font-semibold ml-5'>
            <label htmlFor=''>Completed Using Third-Party App </label>
            <Switch
              defaultValue={false}
              value={alreadyFilledForm}
              onChange={() => {
                setAlreadyFilledForm(!alreadyFilledForm)
              }}
            />
          </div>
          {alreadyFilledForm ? (
            <div className='flex flex-col gap-5 items-end'>
              <Input.TextArea
                onChange={(e) => setReason(e.target.value)}
                placeholder='Please specify the app used for completion and provide any additional notes.'
              />
              <Button
                disabled={reason?.length < 1}
                type='primary'
                onClick={() => {
                  submitFilled()
                }}
              >
                Submit
              </Button>
            </div>
          ) : (
            <Form
              layout='vertical'
              name='response_officer_report'
              onFinish={onFinish}
              className='p-5'
            >
              <div className='text-2xl my-5 font-semibold w-full'>
                Response Officer Report
              </div>

              <Row gutter={[16, 16]}>
                {activity?.activityType !== 'Vacant Property Check' && (
                  <>
                    <Col xs={24} md={12}>
                      <Form.Item
                        rules={[{ required: true, message: 'Please select an option' }]}
                        name='officerGainEntry'
                        label='Were you able to gain entry?'
                      >
                        <Select size='large' placeholder='Select an option'>
                          <Option value='yes'>Yes</Option>
                          <Option value='no'>No</Option>
                          <Option value='na'>N/A</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name='officerAlarmPanelDisplay'
                        label='Intruder Alarm Panel Display'
                        rules={[{ required: true, message: 'Please select an option' }]}
                      >
                        <Input size='large' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name='officerInternalPatrol'
                        label='Internal Patrol'
                        rules={[{ required: true, message: 'Please select an option' }]}
                      >
                        <Select>
                          <Option value='yes'>Yes</Option>
                          <Option value='no'>No</Option>
                          <Option value='na'>N/A</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name='officerExternalPatrol'
                        label='External Patrol'
                        rules={[{ required: true, message: 'Please select an option' }]}
                      >
                        <Select>
                          <Option value='yes'>Yes</Option>
                          <Option value='no'>No</Option>
                          <Option value='na'>N/A</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name='peopleOnSite'
                        label='People on Site Patrol Report?'
                        rules={[{ required: true, message: 'Please select an option' }]}
                      >
                        <Select>
                          <Option value='yes'>Yes</Option>
                          <Option value='no'>No</Option>
                          <Option value='na'>N/A</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        rules={[{ required: true, message: 'Please select an option' }]}
                        label='Intruder alarm reset?'
                        name='intruderAlarmReset'
                      >
                        <Select>
                          <Select.Option value='yes'>Yes</Select.Option>
                          <Select.Option value='no'>No</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        rules={[{ required: true, message: 'Please select an option' }]}
                        label='Intruder alarm re-armed?'
                        name='intruderAlarmRearmed'
                      >
                        <Select>
                          <Select.Option value='yes'>Yes</Select.Option>
                          <Select.Option value='no'>No</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name='arcOperatorName'
                        label='Name of ARC Operator You Spoke To'
                        rules={[{ required: true, message: 'Please select an option' }]}
                      >
                        <Input size='large' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name='officerCauseOfActivation'
                        label='Cause of Activation'
                        rules={[{ required: true, message: 'Please select an option' }]}
                      >
                        <Input size='large' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name='officerFollowUpInstructions'
                        label='Follow Up Instructions'
                        rules={[{ required: true, message: 'Please select an option' }]}
                      >
                        <TextArea size='large' rows={4} />
                      </Form.Item>
                    </Col>
                  </>
                )}
                {renderForm()}
                <Col xs={24} md={12}>
                  <Form.Item
                    rules={[{ required: true, message: 'Please select an option' }]}
                    name='photos'
                    label='Upload Images and video'
                  >
                    <Upload
                      listType='picture-card'
                      fileList={imageFiles}
                      onChange={handleImageChange}
                      onRemove={(file) => {
                        const newFileList = imageFiles.filter(
                          (item) => item.uid !== file.uid
                        )
                        setImageFiles(newFileList)
                      }}
                      accept='image/*,video/mp4'
                      beforeUpload={() => false}
                      maxCount={10}
                      multiple
                    >
                      {uploadButton}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} className='flex gap-5 items-center'>
                  <Form.Item>
                    <Button
                      loading={submitLoading}
                      type='primary'
                      size='large'
                      htmlType='submit'
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
        </>
      )
    case 'Submitted':
    case 'Off Site':
    case 'Completed':
      return (
        <PreviewResponseOfficerReport
          activity={activity}
          onResetSuccess={handleResetSuccess}
        />
      )
    default:
      return null
  }
}

export default ResponseOfficerReport
