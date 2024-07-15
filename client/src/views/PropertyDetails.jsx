import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import PropertyDialog from '../components/dialogs/PropertyDialog.jsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  addPropertyApi,
  editPropertyApi,
  getPropertyApi,
  getPropertyStatusApi,
  propertyStatusTogglerApi,
} from '../services/apiConstants.js'
import { Input, Table, message, Switch, Checkbox } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export const CustomerAccount = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [tableRows, setTableRows] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(state => state.user)
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [filteredRows, setFilteredRows] = useState(tableRows)
  const [selectedProperty, setSelectedProperty] = useState(null)

  const handleDialogState = (property = null) => {
    if (property?.propertyName) {
      setSelectedProperty(property)
    } else {
      setSelectedProperty(null)
    }
    setOpenDialog(prev => !prev)
  }

  const fetchRows = async () => {
    try {
      setLoading(true)

      const fetchRows = await getPropertyApi()
      if (fetchRows.data.success) {
        setTableRows(fetchRows.data.properties?.reverse())
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleOnSubmit = async propertyData => {
    console.log('propertyData on submit = ', propertyData)

    // const aiFiles = propertyData?.aiFiles?.fileList?.map(file => file)
    // propertyData.aiFiles = aiFiles
    // const keyImages = propertyData?.keyImages?.fileList?.map(file => file)
    // propertyData.keyImages = keyImages
    const property = {
      propertyData: propertyData,
    }
console.log('sele',selectedProperty)
    try {
      const response = selectedProperty
        ? await editPropertyApi(propertyData,selectedProperty?._id) // Update Api
        : await addPropertyApi(propertyData) // Create Api
      if (response.data.success) {
        console.log('propertyData on response = ', response)
        message.success(
          selectedProperty
            ? ' Property Updated Successfully!'
            : ' Property Added Successfully!'
        )
        setSelectedProperty(null)
        fetchRows()
      }
    } catch (error) {
      setSelectedProperty(null)
      message.error(` ${error}!`)
    }
  }

  useEffect(() => {
    // Function to filter rows based on searchText
    const filterRows = () => {
      if (!tableRows) return // Do nothing if tableRows is not yet fetched

      const filteredRows = tableRows?.filter(row =>
        row?.propertyName?.toLowerCase()?.includes(searchText.toLowerCase())
      )
      setFilteredRows(filteredRows)
    }

    // Call filterRows when searchText or tableRows change
    filterRows()
  }, [searchText, JSON.stringify(tableRows)])
  const [statusData, setStatusData] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)

  const handleStatusChange = async (checked, propertyId) => {
    if (!statusData) {
      message.error('Status data is not loaded yet.')
      return
    }
    setStatusLoading(true)

    const activeStatus = statusData.find(status => status.label === 'Active')
    const InactiveStatus = statusData.find(
      status => status.label === 'Inactive'
    )

    const newStatusId = checked ? activeStatus?.value : InactiveStatus?.value

    try {
      const response = await propertyStatusTogglerApi({
        propertyData: { propertyId: propertyId, propertyStatusId: newStatusId },
      })
      if (response.data.success) {
        setStatusLoading(false)

        message.success('Property status updated successfully!')
        fetchRows()
      } else {
        setStatusLoading(false)
      }
    } catch (error) {
      setStatusLoading(false)

      message.error(`Error updating branch status: ${error}`)
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

  useEffect(() => {
    fetchRows()
    getStatuses()
  }, [])

  const handleRowClick = record => {
    const { _id } = record

    // Navigate to the property details page with the propertyId
    navigate(`/user-dashboard/property/${_id}`)
  }
  const statuses = Array.from(new Set(filteredRows.map(item => item.propertyStatus?.value).filter(Boolean)));


  const [filters, setFilters] = useState([]);
  const retainerStatuses = Array.from(new Set(filteredRows.map(item => item.propertyChargeable?.value).filter(Boolean)));

  // Extracting unique postcodes
  const postCodes = [...new Set(filteredRows.map(item => item.propertyAddress?.postCode))];
  const propertyTypes = [...new Set(filteredRows?.filter(item => item.propertyName)?.map(item => item.propertyName))];
  const branchTypes = [...new Set(filteredRows?.filter(item => item.branchName)?.map(item => item.branchName))];
  const customerTypes = [...new Set(filteredRows?.filter(item => item.customerName)?.map(item => item.customerName))];
  const idTypes = [...new Set(filteredRows?.filter(item => item.propertyId)?.map(item => item.propertyId))];
  const referenceTypes = [...new Set(filteredRows?.filter(item => item.propertyReference)?.map(item => item.propertyReference))];
  const subscriptionTypes = [...new Set(filteredRows?.filter(item => item.propertySubscriptionFee?.value)?.map(item => item.propertySubscriptionFee?.value))];

  const handleCheckboxChange = (postCode) => {
    setFilters(prevFilters => {
      if (prevFilters.includes(postCode)) {
        return prevFilters.filter(code => code !== postCode);
      } else {
        return [...prevFilters, postCode];
      }
    });
  };
 

  const columns = [
    {
      title: ' Name',
      dataIndex: 'propertyName',
      key: 'propertyName',
      align: 'center',
      render: (text, record) =>
        text ? (
          // <div style={{ whiteSpace: 'nowrap' }}>
          //   {text?.length > 30 ? `${text?.slice(0, 30)}...` : text - `${record._id
          //   .replace(/\D/g, '')
          //   .substring(0, 4)}`}
          // </div>
          <span
            className='text-blue-600'
            onClick={() => handleRowClick(record)}
            style={{ whiteSpace: 'nowrap' }}
          >{`${
            text?.length > 20 ? `${text?.slice(0, 20)}...` : text
          } - ${record?.propertyRandomId}`}</span>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) => a.propertyName?.localeCompare(b.propertyName),
      sortDirections: ['ascend', 'descend'],
      filters: propertyTypes?.map((item) => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.customerName === value,
    },
    {
      title: 'Branch Name',
      dataIndex: 'branchName',
      key: 'branchName',
      align: 'center',
      render: (text, record) =>
        text ? (
          // <div style={{ whiteSpace: 'nowrap' }}>
          //   {text?.length > 30 ? `${text?.slice(0, 30)}...` : text}
          // </div>
          <span style={{ whiteSpace: 'nowrap' }}>{`${
            text?.length > 20 ? `${text?.slice(0, 20)}...` : text
          } - ${record.branchRandomId}`}</span>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) => a.branchName?.localeCompare(b.branchName),
      sortDirections: ['ascend', 'descend'],
      filters: branchTypes?.map((item) => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.branchName === value,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      align: 'left',
      render: (text, record) =>
        text ? (
          // <div style={{ whiteSpace: 'nowrap' }}>
          //   {text?.length > 30 ? `${text?.slice(0, 30)}...` : text}
          // </div>
          <span style={{ whiteSpace: 'nowrap' }}>{`${text} - ${record.customerRandomId}`}</span>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) => a.customerName?.localeCompare(b.customerName),
      sortDirections: ['ascend', 'descend'],
      filters: customerTypes?.map((item) => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.customerName === value,
    },
    {
      title: ' ID',
      dataIndex: 'propertyId',
      key: 'propertyId',
      align: 'center',
      sorter: (a, b) => a.propertyId?.localeCompare(b.propertyId),
      sortDirections: ['ascend', 'descend'],
      filters: idTypes?.map((item) => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.propertyId === value,
    },
    {
      title: ' Reference',
      dataIndex: 'propertyReference',
      key: 'propertyReference',
      align: 'center',
      sorter: (a, b) => a.propertyReference?.localeCompare(b.propertyReference),
      sortDirections: ['ascend', 'descend'],
      filters: referenceTypes?.map((item) => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.propertyReference === value,
    },

    {
      title: ' Address',
      dataIndex: 'propertyAddress',
      key: 'propertyAddress',
      align: 'center',
      render: text =>
        text ? (
          <div style={{ whiteSpace: 'nowrap' }}>
            {text.address?.length > 30
              ? `${text.address?.slice(0, 30)}...`
              : text?.address}
          </div>
        ) : (
          <div>-</div>
        ),
      sorter: (a, b) =>
        a.propertyAddress?.address?.localeCompare(b.propertyAddress?.address),
      sortDirections: ['ascend', 'descend'],
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search  Address`}
            value={selectedKeys[0]}
            onChange={e => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              confirm({ closeDropdown: false });
            }}
            style={{ marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      onFilter: (value, record) => record.propertyAddress?.address?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Postcode',
      dataIndex: 'postCode',
      key: 'postCode',
      align: 'center',
      render: (text, record) => record?.propertyAddress?.postCode ? (
        <div style={{ whiteSpace: 'nowrap' }}>
          {record?.propertyAddress?.postCode}
        </div>
      ) : (
        <div>-</div>
      ),
      sorter: (a, b) =>
        a.propertyAddress?.postCode?.localeCompare(b.propertyAddress?.postCode),
      sortDirections: ['ascend', 'descend'],
      filters: postCodes?.map(item => ({
        text: item,
        value: item
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.propertyAddress?.postCode === value,
    },
    {
      title: ' Type',
      dataIndex: 'propertyType',
      key: 'propertyType',
      align: 'center',
      render: text =>
        text?.value ? (
          <div style={{ whiteSpace: 'nowrap' }}>{text.value}</div>
        ) : (
          <div>-</div>
        ),
        sorter: (a, b) =>
          a.propertyType?.value?.localeCompare(b.propertyType?.value),
     
      sortDirections: ['ascend', 'descend'],

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
      title: ' Status',
      dataIndex: 'propertyStatus',
      key: 'propertyStatus',
      align: 'center',
      sorter: (a, b) => {
        if (a?.propertyStatus?.value < b?.propertyStatus?.value) return -1;
        if (a?.propertyStatus?.value > b?.propertyStatus?.value) return 1;
        return 0;
      },
      filters: statuses?.map(item => ({
        text: item,
        value: item
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.propertyStatus?.value === value,

      render: (text, record) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          {text !== undefined && text !== null ? (
            <Switch
              className='z-10'
              loading={statusLoading}
              checked={text?.value == 'Active' ? true : false}
              onChange={checked => handleStatusChange(checked, record?._id)}
            />
          ) : (
            '-'
          )}
        </span>
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
        sorter: (a, b) => {
          const categoryA = a.propertyCategory ? String(a.propertyCategory) : '';
          const categoryB = b.propertyCategory ? String(b.propertyCategory) : '';
          return categoryA.localeCompare(categoryB);
        },
     
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
      title: 'Subscription Type',
      dataIndex: 'propertySubscriptionFee',
      key: 'propertySubscriptionFee',
      align: 'center',
      sorter: (a, b) => a.propertySubscriptionFee?.value?.localeCompare(b.propertySubscriptionFee?.value),
      sortDirections: ['ascend', 'descend'],
      filters: subscriptionTypes?.map(item => ({
        text: item,
        value: item
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.propertySubscriptionFee?.value === value,
      render: text =>
        text?.value ? (
          <div style={{ whiteSpace: 'nowrap' }}>{text.value}</div>
        ) : (
          <div>-</div>
        ),
    },

    {
      title: 'Retain Fee',
      dataIndex: 'propertySubscriptionFeeValue',
      key: 'propertySubscriptionFeeValue',
      align: 'center',
      sorter: (a, b) => a.propertySubscriptionFeeValue - b.propertySubscriptionFeeValue,
      render: text =>
        text ? (
          <div style={{ whiteSpace: 'nowrap' }}>{`£${text}`}</div>
        ) : (
          <div>-</div>
        ),
  
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button onClick={() => handleDialogState(record)}>Edit</Button>
      ),
    },
  ]

  return (
    <>
      <div className='my-5'>
        <Table
          virtual
          className='form cursor-pointer'
          // scroll={{ x: 7000, y: 800 }}
          title={() => (
            <div className='flex justify-between items-center'>
              <p className='text-lg font-semibold'>Properties</p>
              <Input
                className='h-[40px] w-[60%]'
                type='text'
                placeholder='Search By Poperty Name...'
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
              <Button variant='contained' onClick={handleDialogState}>
                Add
              </Button>
            </div>
          )}
          loading={loading || !tableRows}
          dataSource={filteredRows}
          bordered
          columns={columns}
          pagination={{
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} records`,
          }}
        />
      </div>
      {openDialog && (
        <PropertyDialog
          openDialog={openDialog}
          handleDialogState={handleDialogState}
          handleOnSubmit={handleOnSubmit}
          selectedProperty={selectedProperty}
        />
      )}
    </>
  )
}

export default CustomerAccount
