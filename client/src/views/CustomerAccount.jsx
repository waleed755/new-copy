import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import CustomerDialog from '../components/dialogs/CustomerDialog.jsx'
import {
  addCustomerApi,
  customerStatusTogglerApi,
  editCustomerApi,
  getCustomerApi,
  getPropertyStatusApi,
} from '../services/apiConstants.js'
import { Input, Switch, Table, message } from 'antd'
import { render } from 'react-dom'
import moment from 'moment/moment.js'

export const CustomerAccount = () => {
  const [openDialog, setOpenDialog] = useState(false)

  const [loading, setLoading] = useState(false)
  const [tableRows, setTableRows] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [filteredRows, setFilteredRows] = useState(tableRows)
  const [statusData, setStatusData] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const statuses = [...new Set(filteredRows?.filter(item => item.accountStatus)?.map(item => item.accountStatus))];
  const handleStatusChange = async (checked, customerId) => {
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
      const response = await customerStatusTogglerApi({
        customerData: { customerId: customerId, accountStatusId: newStatusId },
      })
      if (response.data.success) {
        setStatusLoading(false)

        message.success('Customer status updated successfully!')
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
  console.log('filteredRows', filteredRows)
  console.log('Statuses = ', statusData)

  const handleDialogState = (customer = null) => {
    if (customer?.accountName) {
      setSelectedCustomer(customer)
    }else{
      setSelectedCustomer(null)
    }

    setOpenDialog(prev => !prev)
  }


  const fetchRows = async () => {
    try {
      setLoading(true)
      const fetchRows = await getCustomerApi()
      if (fetchRows.data.success) {
        setTableRows(fetchRows.data.customers?.reverse())
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchRows()
    getStatuses()
  }, [])

  const handleOnSubmit = async customerData => {
    console.log('customerData', customerData)
    const customer = { customerData: customerData }
    try {
      const response = selectedCustomer
        ? await editCustomerApi(customer) // Update API
        : await addCustomerApi(customer) // Add API

      if (response.data.success) {
        message.success(
          selectedCustomer
            ? ' Updated Successfully!'
            : ' Added Successfully!'
        )
        setSelectedCustomer(null)
        fetchRows()
      }
    } catch (error) {
      setSelectedCustomer(null)
      message.error(` ${error}!`)
    }
  }

  useEffect(() => {
    // Function to filter rows based on searchText
    const filterRows = () => {
      if (!tableRows) return // Do nothing if tableRows is not yet fetched

      const filteredRows = tableRows?.filter(row =>
        row?.accountName?.toLowerCase()?.includes(searchText.toLowerCase())
      )
      setFilteredRows(filteredRows)
    }

    // Call filterRows when searchText or tableRows change
    filterRows()
  }, [searchText, JSON.stringify(tableRows)])
  const columns = [
    {
      title: ' ID',
      dataIndex: 'accountId',
      key: 'accountId',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.accountId - b.accountId,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: ' Name',
      dataIndex: 'accountName',
      key: 'accountName',
      align: 'center',
      render: (text, record) =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{`${text} - ${record.customerRandomId}`}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.accountName?.localeCompare(b.accountName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: ' Address',
      dataIndex: 'accountAddress',
      key: 'accountAddress',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.accountAddress?.localeCompare(b.accountAddress),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: ' Contact',
      dataIndex: 'accountContact',
      key: 'accountContact',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.accountContact?.localeCompare(b.accountContact),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: ' Email',
      dataIndex: 'accountEmail',
      key: 'accountEmail',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.accountEmail?.localeCompare(b.accountEmail),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: ' Status',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      align: 'center',
      filters: statuses?.map(item => ({
        text: item?.value,
        value: item?.id
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.accountStatus?.id === value,
      render: (text, record) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          {text !== undefined && text !== null ? (
            <Switch
              loading={statusLoading}
              checked={text?.value === 'Active'}
              onChange={checked => handleStatusChange(checked, record._id)}
            />
          ) : (
            '-'
          )}
        </span>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: row => moment(row?.createdAt).format('DD-MM-YYYY'),
      sorter: (a, b) =>
        moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Created By',
      dataIndex: 'accountCreatedByUserName',
      key: 'accountCreatedByUserName',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) =>
        a.accountCreatedByUserName.localeCompare(b.accountCreatedByUserName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Notes',
      dataIndex: 'accountNotes',
      key: 'accountNotes',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.accountNotes.localeCompare(b.accountNotes),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button onClick={() => handleDialogState(record)}>Edit</Button>
      ),
    },
  ];
  

  return (
    <>
      <div className='my-5'>
        <Table
          virtual

          title={() => (
            <div className='flex justify-between items-center'>
              <p className='text-lg font-semibold'>
                Customers
              </p>
              <Input
                className='h-[40px] w-[60%]'
                type='text'
                placeholder='Search by customer'
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
            pageSize: 10,  // Adjust page size as needed
          }}
        />
      </div>

      {openDialog && (
        <CustomerDialog
          openDialog={openDialog}
          handleDialogState={handleDialogState}
          handleOnSubmit={handleOnSubmit}
          selectedCustomer={selectedCustomer}
          
        />
      )}
    </>
  )
}

export default CustomerAccount
