import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import BranchDialog from '../components/dialogs/BranchDialog.jsx'
import { useEffect, useState } from 'react'
import {
  addBranchApi,
  branchStatusTogglerApi,
  editBranchApi,
  getBranchApi,
  getPropertyStatusApi,
} from '../services/apiConstants.js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Table, message, Input, Switch } from 'antd'
import { Button, Typography } from '@mui/material'

import moment from 'moment/moment.js'

export const BranchDetails = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)

  const [tableRows, setTableRows] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [filteredRows, setFilteredRows] = useState(tableRows)
  const [statusData, setStatusData] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const statuses = [...new Set(filteredRows?.filter(item => item.branchStatus)?.map(item => item.branchStatus))];


  const handleStatusChange = async (checked, branchId) => {
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
      const response = await branchStatusTogglerApi({
        branchData: { branchId: branchId, branchStatusId: newStatusId },
      })
      if (response.data.success) {
        setStatusLoading(false)

        message.success('Branch status updated successfully!')
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

  const handleDialogState = (branch = null) => {
    if (branch?.branchName) {
      setSelectedBranch(branch)
    }else{
      setSelectedBranch(null)
    }
    setOpenDialog(prev => !prev)
  }

  const fetchRows = async () => {
    try {
      setLoading(true)
      const fetchRows = await getBranchApi()
      if (fetchRows.data.success) {
        setTableRows(fetchRows.data.branches?.reverse())
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

  useEffect(() => {
    // Function to filter rows based on searchText
    const filterRows = () => {
      if (!tableRows) return // Do nothing if tableRows is not yet fetched

      const filteredRows = tableRows?.filter(row =>
        row?.branchName?.toLowerCase()?.includes(searchText.toLowerCase())
      )
      setFilteredRows(filteredRows)
    }

    // Call filterRows when searchText or tableRows change
    filterRows()
  }, [searchText, JSON.stringify(tableRows)])

  const handleOnSubmit = async branchData => {
    const branch = { branchData: branchData }

    try {
      const response = selectedBranch
        ? await editBranchApi(branch) // Edit Api
        : await addBranchApi(branch) // Branch Api
      if (response.data.success) {
        message.success(
          selectedBranch
            ? 'Branch Updated Successfully!'
            : 'Branch Added Successfully!'
        )
        setSelectedBranch(null)
        fetchRows()
      }
    } catch (error) {
      setSelectedBranch(null)
      message.error(` ${error}!`)
    }
  }

  const columns = [
    {
      title: ' Name',
      dataIndex: 'branchName',
      key: 'branchName',
      align: 'center',
      
      render: (text, record) =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{`${text} - ${record.branchRandomId}`}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.branchName?.localeCompare(b.branchName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: ' ID',
      dataIndex: 'branchId',
      key: 'branchId',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.branchId?.localeCompare(b.branchId),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: ' Address',
      dataIndex: 'branchAddress',
      key: 'branchAddress',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.branchAddress?.localeCompare(b.branchAddress),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: ' Contact Details',
      dataIndex: 'branchContact',
      key: 'branchContact',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.branchContact?.localeCompare(b.branchContact),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: ' Email Address',
      dataIndex: 'branchEmail',
      key: 'branchEmail',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.branchEmail?.localeCompare(b.branchEmail),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: ' Status',
      dataIndex: 'branchStatus',
      key: 'branchStatus',
      align: 'center',
      filters: statuses?.map(item => ({
        text: item?.value,
        value: item?.id
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.branchStatus?.id === value,
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
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>
            {moment(text).format('DD-MM-YYYY')}
          </span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) =>
        moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Created By',
      dataIndex: 'branchCreatedByUserName',
      key: 'branchCreatedByUserName',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) =>
        a.branchCreatedByUserName?.localeCompare(b.branchCreatedByUserName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      align: 'center',
      render: (text, record) =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{`${text} - ${record.customerRandomId}`}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.customerName?.localeCompare(b.customerName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Notes',
      dataIndex: 'branchNotes',
      key: 'branchNotes',
      align: 'center',
      render: text =>
        text ? (
          <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
        ) : (
          <span>-</span>
        ),
      sorter: (a, b) => a.branchNotes?.localeCompare(b.branchNotes),
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
        // scroll={{x:500,y:600}}
          title={() => (
            <div className='flex justify-between items-center'>
              <p className='text-lg font-semibold'>Branches</p>
              <Input
                className='h-[40px] w-[60%]'
                type='text'
                placeholder='Search By Branch Name...'
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
        <BranchDialog
          openDialog={openDialog}
          handleDialogState={handleDialogState}
          handleOnSubmit={handleOnSubmit}
          selectedBranch={selectedBranch}
        />
      )}
    </>
  )
}

export default BranchDetails
