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
  getPropertyApi,
} from '../services/apiConstants'
import { CSVLink } from 'react-csv'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'
import moment from 'moment'
import FilterPopup from '../components/dialogs/ReportsFilters'

const { Search } = Input
const { RangePicker } = DatePicker
const { Option } = Select

const Reports = () => {
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [properties, setProperties] = useState(null)
  const [records, setRecords] = useState(null)

  const [customersData, setCustomersData] = useState(null)
  const [branches, setBranches] = useState(null)
  const [statusData, setStatusData] = useState(null)
  const [types, setTypes] = useState(null)
  const [categories, setCategories] = useState(null)
  const [aiData, setAIData] = useState(null)
  const [customersName, setCustomersName] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [branchesData, setBranchesData] = useState(null)
  const [chargeable, setChargeable] = useState(null)
  const [visible, setVisible] = useState(false)
  const retainerStatuses = Array.from(new Set(records?.map(item => item.propertyChargeable?.value).filter(Boolean)));

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

  const handleDateRangeChange = async ({
    dates,
    typeId,
    categoryId,
    branchId,
    customerId,
    aiID,
    statusId,
    propertyChargeable,
    propertyId

  }) => {
    if (dates && dates.length === 2) {
      const startDate = moment(new Date(dates[0])).format('YYYY-MM-DD')
      const endDate = moment(new Date(dates[1])).format('YYYY-MM-DD')


      try {
        setLoading(true)

        const filters = { startDate, endDate }

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
        if (aiID) {
          filters.aiID = aiID
        }
        if (statusId) {
          filters.statusId = statusId
        }
        if (propertyChargeable) {
          filters.propertyChargeable = propertyChargeable
        }
      
console.log('filters',filters)
        // Call the report API with start and end dates
        const response = await getPropertyReportApi(filters)

        if (response.data.success) {
          setRecords(response.data.properties)
        }
      } catch (error) {
        console.error('Report API Error:', error)
        message.error(`Failed to fetch reports: ${error?.message}`)
      } finally {
        setLoading(false)
      }
    }
  }

  const onFinish = async values => {
    console.log('Values =11 ', values)
    try {
      setLoading(true)
      await handleDateRangeChange({
        ...values,
        startDate: moment(new Date(values?.dates[0])).format('DD-MM-YYYY'),
        endDate: moment(new Date(values?.dates[1])).format('DD-MM-YYYY'),
      })
      handleClose()
    } catch (error) {
      handleClose()
      console.error('Report API Error:', error)
      message.error(`Failed to fetch reports: ${error?.message}`)
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
  const getPropertiesData = async () => {
    try {
      const fetchRows = await   getPropertyApi()
      if (fetchRows.data.success) {
        
        
        setProperties(fetchRows?.data?.properties)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const propertyTypes = [...new Set(records?.filter(item => item.propertyName)?.map(item => item.propertyName))];
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
    getPropertiesData()
  }, []) // Empty dependency array to run only once on component mount

  const handleBranchClear = () => {
    setSelectedBranch(null) // Clear selected branch when the selection is cleared
    // Additional logic can be added here when the selection is cleared
  }

  const handleCustomerChange = async customerId => {
    handleBranchClear()
    setCustomersName(customerId)

    setSelectedBranch(null)
    const filteredBranchesData = branchesData?.filter(
      item => item?.customerId == customerId
    )
    const transformedData = filteredBranchesData?.map(branch => ({
      value: branch._id,
      label: branch.branchName,
    }))
    setBranches(transformedData)
  }

  //! =========================

  const columns = [
    // Define your table columns here
    // Example:
    {
      title: 'Property Name',
      dataIndex: 'propertyName',
      key: 'propertyName',
      render: text => (text ? <span>{text}</span> : <span>-</span>),
      filters: propertyTypes?.map((item) => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.propertyName === value,
    },
    {
      title: 'Branch Name',
      dataIndex: 'branchName',
      key: 'branchName',
      align: 'center',
      render: text =>
        text ? (
          <div style={{ whiteSpace: 'nowrap' }}>
            {text?.length > 30 ? `${text?.slice(0, 30)}...` : text}
          </div>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) => a.branchName?.localeCompare(b.branchName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      align: 'center',
      render: text =>
        text ? (
          <div style={{ whiteSpace: 'nowrap' }}>
            {text?.length > 30 ? `${text?.slice(0, 30)}...` : text}
          </div>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) => a.customerName?.localeCompare(b.customerName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Property Status',
      dataIndex: 'propertyStatus',
      key: 'propertyStatus',
      align: 'center',

      render: text =>
        text ? (
          <div style={{ whiteSpace: 'nowrap' }}>
            {text?.length > 30
              ? `${text?.value?.slice(0, 30)}...`
              : text?.value}
          </div>
        ) : (
          <div>-</div>
        ),
    },
    {
      title: 'Retainer',
      dataIndex: 'propertyChargeable',
      key: 'propertyChargeable',
      align: 'center',
      sorter: (a, b) => {
        if (a?.propertyChargeable?.value < b?.propertyChargeable?.value) return -1;
        if (a?.propertyChargeable?.value > b?.propertyChargeable?.value) return 1;
        return 0;
      },
      filters: retainerStatuses?.map(item => ({
        text: item,
        value: item
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.propertyChargeable?.value === value,
      render: text =>
        text?.value ? (
          <div style={{ whiteSpace: 'nowrap' }}>{text.value}</div>
        ) : (
          <div>-</div>
        ),
    },

    {
      title: 'Category',
      dataIndex: 'propertyCategory',
      key: 'propertyCategory',
      align: 'center',
      render: text =>
        text?.value ? (
          <div style={{ whiteSpace: 'nowrap' }}>{text.value}</div>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) =>
        a.propertyCategory?.value?.localeCompare(b.propertyCategory.value),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Start Date',
      dataIndex: 'propertyStartDate',
      key: 'propertyStartDate',
      align: 'center',
      render: text =>
        text ? (
          <div style={{ whiteSpace: 'nowrap' }}>
            {moment(text).format('DD-MM-YYYY')}
          </div>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) =>
        moment(a.propertyStartDate).valueOf() -
        moment(b.propertyStartDate).valueOf(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Finish Date',
      dataIndex: 'propertyFinishDate',
      key: 'propertyFinishDate',
      align: 'center',
      render: text =>
        text ? (
          <div style={{ whiteSpace: 'nowrap' }}>
            {moment(text).format('DD-MM-YYYY')}
          </div>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) =>
        moment(a.propertyFinishDate).valueOf() -
        moment(b.propertyFinishDate).valueOf(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'AI',
      dataIndex: 'propertyAI',
      key: 'propertyAI',
      align: 'center',
      render: text =>
        text?.value ? (
          <div style={{ whiteSpace: 'nowrap' }}>{text.value}</div>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) => a.propertyAI?.value?.localeCompare(b.propertyAI.value),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Keys',
      dataIndex: 'propertyKeys',
      key: 'propertyKeys',
      align: 'center',
      render: text =>
        text?.value ? (
          <div style={{ whiteSpace: 'nowrap' }}>{`${text?.value}`}</div>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) => a.propertyAI?.value?.localeCompare(b.propertyAI.value),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Retain Fee',
      dataIndex: 'propertySubscriptionFeeValue',
      key: 'propertySubscriptionFeeValue',
      align: 'center',
      render: text =>
        text ? (
          <div style={{ whiteSpace: 'nowrap' }}>{`£${text}`}</div>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) => a.propertyAI?.value?.localeCompare(b.propertyAI.value),
      sortDirections: ['ascend', 'descend'],
    },

    {
      title: 'Total Amout',
      dataIndex: 'propertyTotalPrice',
      key: 'propertyTotalPrice',
      align: 'center',
      render: text =>
        text ? <span>{`£${text?.toFixed(2)}` || '-'}</span> : <span>-</span>,
      sorter: (a, b) => {
        const priceA = parseFloat(a.propertyTotalPrice) || 0;
        const priceB = parseFloat(b.propertyTotalPrice) || 0;
        return priceA - priceB;
      },
      sortDirections: ['ascend', 'descend'],
      
    },
    // Add more columns as needed
  ]
  const calculateTotalPriceForAll = () => {
    let totalPrice = 0;
    records?.forEach(record => {
      totalPrice += parseFloat(record.propertyTotalPrice) || 0;
    });
    return totalPrice.toFixed(2);
  };


  return (
    <div className='p-5'>
      <div>
        <FilterPopup
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
          aiData={aiData}
          loading={false}
        />
      </div>
      <div ref={componentRef}>
        <Table
          title={() => (
            <div className='flex justify-between items-center'>
              <p className='text-lg font-semibold'>Property Report</p>
              <div className='flex items-center gap-5'>
                {records?.length > 0 && (
                  <>
                    <Button>
                      <CSVLink
                        filename={'Expense_Table.csv'}
                        const
                        data={
                          records?.map(item => ({
                            propertyName: item.propertyName,
                            branchName: item.branchName,
                            customerName: item.customerName,
                            propertyStatus: item.propertyStatus?.value || '-',
                            propertyChargeable: item.propertyChargeable?.value || '-',
                            propertyCategory: item.propertyCategory?.value || '-',
                            propertyStartDate: moment(item.propertyStartDate).format('DD-MM-YYYY'),
                            propertyFinishDate: moment(item.propertyFinishDate).format('DD-MM-YYYY'),
                            propertyAI: item.propertyAI?.value || '-',
                            propertyKeys: item.propertyKeys?.value || '-',
                            propertySubscriptionFeeValue: `£${item.propertySubscriptionFeeValue}`,
                            propertyTotalPrice: `£${item.propertyTotalPrice?.toFixed(2)}`
                            
                          }))
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
          
          // pagination={{ pageSize: 10 }}
          bordered
          columns={columns}
          footer={() => (
            <div className='flex justify-end items-center'>
              <p className='font-semibold'>Total Amount:</p>
              <p className='ml-2'>£{calculateTotalPriceForAll()}</p>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default Reports
