import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import CustomerDialog from '../components/dialogs/CustomerDialog.jsx'
import {
  addCustomerApi,
  addStaffApi,
  customerStatusTogglerApi,
  editCustomerApi,
  editStaffApi,
  getCustomerApi,
  getPropertyStatusApi,
  getStaffApi,
  staffStatusTogglerApi,
} from '../services/apiConstants.js'
import { Input, Switch, Table, message } from 'antd'
import { render } from 'react-dom'
import moment from 'moment/moment.js'
import OfficerDialog from '../components/dialogs/OfficerDialog.jsx'

export const OfficerAccount = () => {
  const [openDialog, setOpenDialog] = useState(false)

  const [loading, setLoading] = useState(false)
  const [tableRows, setTableRows] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [filteredRows, setFilteredRows] = useState(tableRows)
  const [statusData, setStatusData] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [selectedOfficer, setSelectedOfficer] = useState(null)

  const handleStatusChange = async (checked, staffId) => {
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
      const response = await staffStatusTogglerApi({
        staffData: { staffId: staffId,statusId: newStatusId },
      })
      if (response.data.success) {
        setStatusLoading(false)

        message.success('Staff status updated successfully!')
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

  const handleDialogState = (officer = null) => {
    if (officer?.staffName) {
      setSelectedOfficer(officer)
    }else{
      setSelectedOfficer(null)
    }

    setOpenDialog(prev => !prev)
  }


  const fetchRows = async () => {
    try {
      setLoading(true)
      const fetchRows = await getStaffApi()
      if (fetchRows.data.success) {
        setTableRows(fetchRows.data.allStaff?.reverse())
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

  const handleOnSubmit = async officerData => {
    console.log('customerData', officerData)
    const customer = { staffData: officerData }
    try {
      const response = selectedOfficer
        ? await editStaffApi(customer) // Update API
        : await addStaffApi(customer) // Add API

      if (response.data.success) {
        message.success(
          selectedOfficer
            ? 'Partner Updated Successfully!'
            : 'Partner Added Successfully!'
        )
        setSelectedOfficer(null)
        fetchRows()
      }
    } catch (error) {
      setSelectedOfficer(null)
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
      title: 'Name',
      dataIndex: 'staffName',
      key: 'staffName',
      align: 'center',
      render: (text, record) =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{`${text} - ${record._id
            .replace(/\D/g, '')
            .substring(0, 4)}`}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.staffName?.localeCompare(b.staffName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'ID',
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
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branchName',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.branchName - b.branchName,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Address',
      dataIndex: 'staffAddress',
      key: 'staffAddress',
      align: 'center',
      render: text =>
        text?.address ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text?.address}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.staffAddress?.localeCompare(b.staffAddress),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Contact',
      dataIndex: 'staffContact',
      key: 'staffContact',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.staffContact?.localeCompare(b.staffContact),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Status',
      dataIndex: 'staffStatus',
      key: 'staffStatus',
      align: 'center',
      render: (text, record) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          {text !== undefined && text !== null ? (
            <Switch
              loading={statusLoading}
              checked={text?.value == 'Active' ? true : false}
              onChange={checked => handleStatusChange(checked, record._id)}
            />
          ) : (
            '-'
          )}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'staffEmail',
      key: 'staffEmail',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.staffEmail?.localeCompare(b.staffEmail),
      sortDirections: ['ascend', 'descend'],
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
      dataIndex: 'staffCreatedByUserName',
      key: 'staffCreatedByUserName',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) =>
        a.staffCreatedByUserName.localeCompare(b.staffCreatedByUserName),
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
  ]

  return (
    <>
      <div className='my-5'>
        <Table
          virtual
          title={() => (
            <div className='flex justify-between items-center'>
              <p className='text-lg font-semibold'>
                Partners              </p>
              <Input
                className='h-[40px] w-[60%]'
                type='text'
                placeholder='Search By Partner Name...'
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
              <Button variant='contained' onClick={handleDialogState}>
                Add
              </Button>
            </div>
          )}
          loading={loading}
          dataSource={tableRows}
          bordered
          columns={columns}
          pagination={{
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} records`,
            pageSize: 10,  // Adjust page size as needed
          }}
        />
      </div>

      {openDialog && (
        <OfficerDialog
          openDialog={openDialog}
          handleDialogState={handleDialogState}
          handleOnSubmit={handleOnSubmit}
          selectedOfficer={selectedOfficer}
          
        />
      )}
    </>
  )
}

export default OfficerAccount
