import React, { useEffect, useState } from 'react'
import {
  Table,
  Input,
  Button,
  DatePicker,
  message,
  Form,
  Select,
  Divider,
} from 'antd'
import {
  getBranchApi,
  getBranchesNamesApi,
  getCustomerNamesApi,
  getPropertyAIApi,
  getPropertyCategoryApi,
  getPropertyChargeAbleApi,
  getPropertyStatusApi,
  getPropertyTypeApi,
  getPropertyReportApi,
  getActivityReportApi,
  getPropertyApi,
  getAllOfficersResponseApi,
} from '../services/apiConstants'
import { CSVLink } from 'react-csv'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'
import moment from 'moment'
import ActivityReportFilterPopup from '../components/dialogs/ActivityReportFilters'

const { Search } = Input
const { RangePicker } = DatePicker
const { Option } = Select

const ActivityReport = () => {
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [records, setRecords] = useState(null)

  const [customersData, setCustomersData] = useState(null)
  const [branches, setBranches] = useState(null)
  const [types, setTypes] = useState(null)
  const [categories, setCategories] = useState(null)
  const [aiData, setAIData] = useState(null)

  const [customersName, setCustomersName] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [branchesData, setBranchesData] = useState(null)
  const [chargeable, setChargeable] = useState(null)
  const [visible, setVisible] = useState(false)
  const statusData = [
    {
      value: 'On Site',
      label: 'On Site',
    },
    {
      value: 'Off Site',
      label: 'Off Site',
    },
    {
      value: 'Pending',
      label: 'Pending',
    },
    {
      value: 'Pending',
      label: 'Pending',
    },
  ]
  const showModal = () => {
    setVisible(true)
  }

  const handleClose = () => {
    setVisible(false)
  }

  const [form] = Form.useForm()

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  const handleSearch = value => {
    setSearchText(value?.target.value)
  }
  const [properties, setProperties] = useState(null)
  const getProperties = async () => {
    try {
      const fetchRows = await getPropertyApi()

      if (fetchRows.data.success) {
        const transformedData = fetchRows?.data?.properties

        setProperties(transformedData)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getProperties()
  }, [])
  const handleDateRangeChange = async ({
    dates,
    typeId,
    categoryId,
    branchId,
    customerId,
    aiID,
    statusId,
    timeOnSite,
    timeOffSite,
    startDate,
    endDate,
    propertyId,
    propertyChargeable,
  }) => {
    try {
      setLoading(true)

      const filters = {}

      // Add optional filters if provided
      if (typeId) {
        filters.typeId = typeId
      }
      if (categoryId) {
        filters.categoryId = categoryId
      }
      if (branchId) {
        filters.branchId = branchId
      }
      if (customerId) {
        filters.customerId = customerId
      }
      if (statusId) {
        filters.statusId = statusId
      }
      if (startDate) {
        filters.startDate = moment(new Date(startDate)).format('YYYY-MM-DD')
      }
      if (endDate) {
        filters.endDate = moment(new Date(endDate)).format('YYYY-MM-DD')
      }

      if (propertyId) {
        filters.propertyId = propertyId
      }
      console.log('filters', filters)

      // Call the report API with start and end dates
      const response = await getActivityReportApi(filters)

      if (response.data.success) {
        setRecords(response.data.activities)
      }
    } catch (error) {
      console.log('Report API Error:', error?.response?.data?.message)
      message.error(` ${error?.response?.data?.message}`)
    } finally {
      setLoading(false)
    }
  }

  const onFinish = async values => {
    console.log('callles1122 = ', values)

    try {
      setLoading(true)
      handleDateRangeChange(values)
      handleClose()
    } catch (error) {
      console.log('Report API Error:', error)
      message.error(`Failed to fetch reports--: ${error?.message}`)
      handleClose()
    } finally {
      handleClose()
      setLoading(false)
    }
  }

  //! =========================
  const getBranchesData = async () => {
    try {
      const fetchRows = await getBranchApi()
      if (fetchRows.data.success) {
        setBranchesData(fetchRows.data.branches)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getOfficerResponses = async () => {
    try {
      const fetchRows = await getAllOfficersResponseApi()
      if (fetchRows.data.success) {
        setResponseData(fetchRows.data.branches)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getType = async () => {
    try {
      const type = await getPropertyTypeApi()
      if (type.data.success) {
        const transformedData = type?.data?.types?.map(customer => ({
          value: customer._id, // Assuming customer id as value
          label: customer.value, // Assuming customer name as label
        }))
        setTypes(transformedData)
      }
    } catch (error) {
      console.error('Error fetching property types:', error)
    }
  }
  const getCustomers = async () => {
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

  const getCategory = async () => {
    try {
      const category = await getPropertyCategoryApi()
      if (category.data.success) {
        const transformedData = category?.data?.categories?.map(customer => ({
          value: customer._id, // Assuming customer id as value
          label: customer.value, // Assuming customer name as label
        }))
        setCategories(transformedData)
      }
    } catch (error) {
      console.error('Error fetching property categories:', error)
    }
  }
  const getAI = async () => {
    try {
      const ai = await getPropertyAIApi()
      if (ai.data.success) {
        const transformedData = ai?.data?.ais?.map(customer => ({
          value: customer._id, // Assuming customer id as value
          label: customer.value, // Assuming customer name as label
        }))
        setAIData(transformedData)
      }
    } catch (error) {
      console.error('Error fetching property AI data:', error)
    }
  }
  const getStatuses = async () => {
    try {
      const statuses = await getPropertyStatusApi()
      if (statuses.data.success) {
        const transformedData = statuses?.data?.statuses?.map(customer => ({
          value: customer._id, // Assuming customer id as value
          label: customer.value, // Assuming customer name as label
        }))
        setStatusData(transformedData)
      }
    } catch (error) {
      console.error('Error fetching property statuses:', error)
    }
  }
  const getBranches = async () => {
    try {
      const fetchRows = await getBranchesNamesApi()
      if (fetchRows.data.success) {
        const transformedData = fetchRows?.data?.branches?.map(customer => ({
          value: customer._id, // Assuming customer id as value
          label: customer.branchName, // Assuming customer name as label
        }))
        setBranches(transformedData)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getAllChargeAbles = async () => {
    try {
      const statuses = await getPropertyChargeAbleApi()
      if (statuses.data.success) {
        const transformedData = statuses?.data?.chargeAble?.map(customer => ({
          value: customer._id, // Assuming customer id as value
          label: customer.value, // Assuming customer name as label
        }))
        console.log('transformedData', transformedData)
        setChargeable(transformedData)
      }
    } catch (error) {
      console.error('Error fetching property statuses:', error)
    }
  }

  useEffect(() => {
    getAllChargeAbles()
    getCustomers()
    getBranchesData()
    getStatuses()
    getType()
    getCategory()
    getAI()
    getBranches()
    getProperties()
    getOfficerResponses()
  }, []) // Empty dependency array to run only once on component mount

  const handleBranchClear = () => {
    setSelectedBranch(null) // Clear selected branch when the selection is cleared
    // Additional logic can be added here when the selection is cleared
  }

  const handleCustomerChange = async customerId => {
    handleBranchClear()
    setCustomersName(customerId)
    await getBranches()
    await getProperties()
    setSelectedBranch(null)
    const filteredBranchesData = branchesData?.filter(
      item => item?.customerId == customerId
    )
    const filteredPropertiesData = properties?.filter(
      item => item?.customerId == customerId
    )
    const transformedData = filteredBranchesData?.map(branch => ({
      value: branch._id,
      label: branch.branchName,
    }))
    const transformedPropertiesData = filteredPropertiesData?.map(branch => ({
      value: branch?._id,
      label: branch?.propertyName,
    }))
    setBranches(transformedData)
    setProperties(transformedPropertiesData)
  }

  //! =========================

  const assignees = [
    ...new Set(
      records
        ?.filter(item => item.assignedToUserName)
        ?.map(item => item.assignedToUserName)
    ),
  ]
  const performers = [
    ...new Set(
      records
        ?.filter(item => item.performedByUserName)
        ?.map(item => item.performedByUserName)
    ),
  ]
  const statuses = [
    ...new Set(
      records
        ?.filter(item => item.activityStatus)
        ?.map(item => item.activityStatus)
    ),
  ]
  const activityTypes = [
    ...new Set(
      records?.filter(item => item.activityType)?.map(item => item.activityType)
    ),
  ]
  const propertyTypes = [
    ...new Set(
      records?.filter(item => item.propertyName)?.map(item => item.propertyName)
    ),
  ]
  const branchTypes = [
    ...new Set(
      records?.filter(item => item.branchName)?.map(item => item.branchName)
    ),
  ]
  const customerTypes = [
    ...new Set(
      records?.filter(item => item.customerName)?.map(item => item.customerName)
    ),
  ]
  const columns = [
    // Define your table columns here
    // Example:
    {
      title: 'Reference',
      dataIndex: 'activityReferenceNumber',
      key: 'activityReferenceNumber',
      render: (text, record) =>
        text ? (
          <div style={{ whiteSpace: 'nowrap' }}>{text}</div>
        ) : (
          <div>-</div>
        ),
    },
    {
      title: 'Type',
      dataIndex: 'activityType',
      key: 'type',
      filters: activityTypes?.map(item => ({
        text: item,
        value: item,
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.activityType === value,
    },
    {
      title: 'Property',
      dataIndex: 'propertyName',
      key: 'propertyName',
      filters: propertyTypes?.map(item => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.propertyName === value,
    },
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branchName',
      filters: branchTypes?.map(item => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.branchName === value,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      filters: customerTypes?.map(item => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.customerName === value,
    },

    {
      title: 'Assigned To',
      dataIndex: 'assignedToUserName',
      key: 'assignedToUserName',
      filters: assignees?.map(item => ({
        text: item,
        value: item,
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.assignedToUserName === value,
      render: (text, record) => (
        <div>
          {text ? (
            <div>{text}</div>
          ) : (
            <div
              style={{ whiteSpace: 'nowrap' }}
              className='text-blue-700 cursor-pointer'
              onClick={() => handleAssignModalOpen(record)}
            >
              Assign
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Performed By',
      dataIndex: 'performedByUserName',
      key: 'performedByUserName',
      filters: performers?.map(item => ({
        text: item,
        value: item,
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.performedByUserName === value,
      render: (text, record) => (
        <div>
          {text ? (
            <div>{text}</div>
          ) : (
            <div
              style={{ whiteSpace: 'nowrap' }}
              className='text-blue-700 cursor-pointer'
            >
              -
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Modified Time',
      dataIndex: 'updatedAt',
      key: 'updatedAt',

      render: (text, record) => (
        <div>
          {text ? (
            <div>
              {' '}
              {moment(record.updatedAt).format('DD-MM-YYYY')}
              <br />
              {moment(record.updatedAt, 'HH:mm').format('HH:mm')}
            </div>
          ) : (
            <div
              style={{ whiteSpace: '' }}
              className='text-blue-700 cursor-pointer'
            >
              -
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'activityStatus',
      key: 'activityStatus',
      filters: statuses?.map(item => ({
        text: item,
        value: item,
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.activityStatus === value,
      render: (text, record) =>
        text ? (
          <div
            style={{ whiteSpace: 'nowrap' }}
            // className='text-blue-700 cursor-pointer'
            // onClick={() => handleStatusClick(record)}
          >
            {text}
          </div>
        ) : (
          <div>-</div>
        ),
    },

    {
      title: 'Total Amount',
      dataIndex: 'activityTotalFee',
      key: 'activityTotalFee',
      align: 'center',
      render: text =>
        text || text === 0 ? (
          <span>{`£${text?.toFixed(2)}`}</span>
        ) : (
          <span>-</span>
        ),
    },
    // Add more columns as needed
  ]

  return (
    <div className='p-5'>
      <div>
        <ActivityReportFilterPopup
          visible={visible}
          onClose={handleClose}
          form={form}
          onFinish={onFinish}
          customersData={customersData}
          branches={branches}
          types={types}
          statusData={statusData}
          chargeable={chargeable}
          categories={categories}
          properties={properties}
          aiData={aiData}
          loading={false}
          onCustomerChange={handleCustomerChange}
        />
      </div>
      <div ref={componentRef}>
        <Table
          title={() => (
            <div className='flex justify-between items-center'>
              <p className='text-lg font-semibold'>Activity Report</p>
              <div className='flex items-center gap-5'>
                {records?.length > 0 && (
                  <>
                    <Button>
                      <CSVLink
                        filename={'Expense_Table.csv'}
                        const
                        data={
                          records?.length > 0
                            ? records.map(item => ({
                                propertyName: item?.propertyName,
                                totalPrice: item?.propertyTotalPrice,
                              }))
                            : []
                        }
                        className='btn btn-primary'
                        onClick={() => {
                          message.success('The file is downloading')
                        }}
                      >
                        Export to CSV
                      </CSVLink>
                    </Button>
                    <Button onClick={handlePrint} type='primary' danger>
                      Export to PDF
                    </Button>
                  </>
                )}
                <Button type='primary' onClick={showModal}>
                  Filters
                </Button>
              </div>
            </div>
          )}
          loading={loading}
          dataSource={records}
          bordered
          columns={columns}
        />
      </div>
    </div>
  )
}

export default ActivityReport
