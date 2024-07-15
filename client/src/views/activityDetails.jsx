import { Button, Table, Select, Modal, Form, Input, DatePicker, TimePicker, message, Row, Col, Menu, Dropdown } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignActivityToUsersApi, editActivityApi, getActivityApi, getAllOfficersResponseApi, getAllUsersApi, getBranchApi, getCustomerNamesApi, getPropertyApi, updateActivityStatusApi, updateCancelActivityApi, } from '../services/apiConstants';
import moment from 'moment';
import ActivityFilterPopup from '../components/dialogs/ActivityFilters';
import { MoreOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);


const { Option } = Select;
const { Item } = Form;

const ActivityDetails = () => {
  const [loading, setLoading] = useState(false);
  const [tableRows, setTableRows] = useState(null);
  const [visible, setVisible] = useState(false);
  const [customersData, setCustomersData] = useState(null);
  const [branches, setBranches] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [types, setTypes] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const navigate = useNavigate();
  const [selectedRowKey, setSelectedRowKey] = useState();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [users, setUsers] = useState();
  const [responsesData, setResponseData] = useState(null);
  const [form] = Form.useForm();
  const [properties, setProperties] = useState(null)
  const currentRole = localStorage.getItem("role");
  const [dates, setDates] = useState([]);
  const [isCancelReasonModalVisible, setIsCancelReasonModalVisible] = useState(false);

  const [cancellationReason, setCancellationReason] = useState('');

  const showCancellationPopup = (record) => {
    setCancellationReason(record.cancellationReason || 'No reason provided');
    setIsCancelReasonModalVisible(true);
  };
  const handleCancelOk = () => {
    setIsCancelReasonModalVisible(false);
  };

  const handleCancelReason = () => {
    setIsCancelReasonModalVisible(false);
  };
const [filteredData, setFilteredData] = useState([]); // Assuming 'data' is your original data source
const { RangePicker } = DatePicker;


const handleDateChange = (dates) => {
  console.log('Received dates:', dates);

  if (Array.isArray(dates) && dates.length === 2) {
    const [startRaw, endRaw] = dates;
    console.log('Raw Start Date:', startRaw, 'Raw End Date:', endRaw);

    const start = dayjs(startRaw).startOf('day');
    const end = dayjs(endRaw).startOf('day');

    if (!start.isValid() || !end.isValid()) {
      console.error('Invalid dates:', startRaw, endRaw);
      setFilteredData(tableRows); // Reset to original data if dates are invalid
      return;
    }

    console.log('Parsed Start Date:', start.format('YYYY-MM-DD'), 'Parsed End Date:', end.format('YYYY-MM-DD'));

    const filtered = tableRows.filter(record => {
      const activityStart = dayjs(record.activityStartDate).startOf('day');
      const activityEnd = dayjs(record.activityFinishDate).startOf('day');
      
      const isStartBetween = activityStart.isBetween(start, end, null, '[]');
      const isEndBetween = activityEnd.isBetween(start, end, null, '[]');

      console.log(`Record: ${record.id}`, 
                  'Activity Start:', activityStart.format('DD-MM-YYYY'), 
                  'Activity End:', activityEnd.format('DD-MM-YYYY'),
                  'isStartBetween:', isStartBetween, 
                  'isEndBetween:', isEndBetween);
      
      return isStartBetween && isEndBetween;
    });

    console.log('Filtered Data:', filtered);
    setFilteredData(filtered);
  } else {
    console.error('Invalid date array:', dates);
    setFilteredData(tableRows); // Reset to original data if no dates are selected or invalid dates
  }
};


useEffect(()=>{
  setFilteredData(tableRows); 
},[JSON.stringify(tableRows)])
  const handleAssignModalOpen = (record) => {
    setCurrentRecord(record);
    setShowModal(true);
  };
  useEffect(() => {
    getUsers();
    getOfficerResponses();
    getActivities();
    getClients();
    getProperties()

  }, []);
  const userStoreState =JSON.parse( localStorage.getItem('user'));
console.log('call',userStoreState)
  const getOfficerResponses = async () => {
    try {
      const fetchRows = await getAllOfficersResponseApi();
      if (fetchRows.data.success) {
        setResponseData(fetchRows.data.allOfficersResponses);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUsers = async () => {
    try {
      const fetchRows = await getAllUsersApi();
      if (fetchRows.data.success) {
        const transformedData = fetchRows.data.users?.map((user) => ({
          value: user._id,
          label: user?.fullName,
        }));
        setUsers(transformedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getActivities = async () => {
    try {
      setLoading(true);
      const fetchRows = await getActivityApi();
      if (fetchRows.data.success) {
        setTableRows(fetchRows.data.allActivities?.reverse()?.filter(item => item?.activityStatus !=='Cancelled'));
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getClients = async () => {
    try {
      const response = await getCustomerNamesApi();
      if (response.data.success) {
        const transformedData = response.data.customers.map((customer) => ({
          value: customer._id,
          label: customer.accountName,
        }));
        setCustomersData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching customer names:", error);
    }
  };

  const handleAssignedToChange = (value) => {
    // Handle the assigned user change
    setSelectedRowKey(value);

    // Update the currentRecord or call an API to save the assignment
  };

  const getBranchesData = async (customerId) => {
    try {
      const fetchRows = await getBranchApi();
      if (fetchRows.data.success) {
        const filteredBranchesData = fetchRows.data.branches?.filter(
          (item) => item?.customerId === customerId
        );
        const transformedData = filteredBranchesData?.map((branch) => ({
          value: branch._id,
          label: branch.branchName,
        }));
        setBranches(transformedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProperties = async (customerId) => {
    try {
      const fetchRows = await getPropertyApi();
      if (fetchRows.data.success) {
        const transformedData = fetchRows?.data?.properties
          ?.filter((item) => item?.customerId === customerId)
          ?.map((customer) => ({
            value: customer._id,
            label: customer.propertyName,
          }));
        setProperties(transformedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = (record) => {
    setCurrentRecord(record);
    if(!record?.isCancelled){
      setIsCancelModalVisible(true);
    }else{
      unCancelActivity(record)
    }
  };

  const handleCancelModalClose = () => {
    setIsCancelModalVisible(false);
  };

  const handleCancelConfirm = async() => {
    // Perform the cancel action with the cancel reason
    console.log('Cancel reason:', cancelReason);
await updateStatus()
    setIsCancelModalVisible(false);
  };


   const updateStatus = async () => {
    const activityData = {
      activityId:currentRecord?._id,
      isCancelled:currentRecord?.isCancelled ? false : true,
      cancellationReason:currentRecord?.isCancelled ? '' :cancelReason
    }
      const fetchRows = await updateCancelActivityApi({ activityData })
      if (fetchRows.data.success) {
        getActivities();
      }
    }
    const unCancelActivity = async (record) => {
      const activityData = {
        activityId:record?._id,
        isCancelled:false,
      cancellationReason:''
      }
        const fetchRows = await updateCancelActivityApi({ activityData })
        if (fetchRows.data.success) {
          getActivities();
        }
      }

  const handleModalOpen = async (record) => {
    setCurrentRecord(record);
    setShowEditModal(true);
    form.setFieldsValue({
      ...record,
      activityStartDate: dayjs(record.activityStartDate),
      activityFinishDate: dayjs(record.activityFinishDate),
      activityStartTime: dayjs(record.activityStartTime, 'HH:mm:ss'),
      activityFinishTime: dayjs(record.activityFinishTime, 'HH:mm:ss'),
    });
    await getBranchesData(record.customerId);
    await getProperties(record.customerId);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
  };

  const handleSubmit = async (values) => {
    try {
      const fetchRows = await assignActivityToUsersApi({activityData:{
        userId:selectedRowKey,
        activityId: currentRecord?._id,

      }})
      if(fetchRows?.data?.success){
        getActivities()
        setShowModal(false)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubmit = async (values) => {
    const formattedValues = {
      ...values,
      activityStartTime: values.activityStartTime.format('HH:mm:ss'),
      activityFinishTime: values.activityFinishTime.format('HH:mm:ss'),
    };
    console.log('current',currentRecord)
    try {
      const fetchRows = await editActivityApi({
        activityData: { ...formattedValues }, id: currentRecord?._id
      });
      if (fetchRows.data.success) {
        message.success("Activity Updated Successfully");
        getActivities();
        handleModalClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const assignees = [...new Set(tableRows?.filter(item => item.assignedToUserName)?.map(item => item.assignedToUserName))];
  const performers = [...new Set(tableRows?.filter(item => item.performedByUserName)?.map(item => item.performedByUserName))];
  const statuses = [...new Set(tableRows?.filter(item => item.activityStatus)?.map(item => item.activityStatus))];
  const activityTypes = [...new Set(tableRows?.filter(item => item.activityType)?.map(item => item.activityType))];
  const propertyTypes = [...new Set(tableRows?.filter(item => item.propertyName)?.map(item => item.propertyName))];
  const branchTypes = [...new Set(tableRows?.filter(item => item.branchName)?.map(item => item.branchName))];
  const customerTypes = [...new Set(tableRows?.filter(item => item.customerName)?.map(item => item.customerName))];


  const handleStatusClick = async(record) => {
    const { _id } = record;
    if(!record?.assignedToUserName){try {
      const fetchRows = await assignActivityToUsersApi({activityData:{
        userId:userStoreState?._id,
        activityId: record?._id,
        

      }})
      if(fetchRows?.data?.success){
        getActivities()
      }
    } catch (error) {
      console.error(error);
    }}
    navigate(`/user-dashboard/activity/response-officer-report/${_id}`);

  }

  const ActionsDropdown = ({ record, handleModalOpen, handleCancel }) => {
    const menu = (
      <Menu>
        <Menu.Item key="edit" onClick={() => handleModalOpen(record)}>
          Edit
        </Menu.Item>
        <Menu.Item key="cancel" onClick={() => handleCancel(record)}>
          {!record?.isCancelled ? 'Cancel' : 'Uncancelled'}
        </Menu.Item>
      </Menu>
    );
  
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <Button type='link'>
           <MoreOutlined size={40} style={{fontSize:24,color:'#121212'}} />
        </Button>
      </Dropdown>
    );
  };


  const columns = [
    {
      title: 'Reference',
      dataIndex: 'activityReferenceNumber',
      key: 'activityReferenceNumber',
      render: (text, record) =>
        text ? (
          <div
            style={{ whiteSpace: 'nowrap' }}
          
          >
            {text}
          </div>
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
        value: item
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.activityType === value,
    },
    {
      title: 'Property',
      dataIndex: 'propertyName',
      key: 'propertyName',
      filters: propertyTypes?.map((item) => ({
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
      filters: branchTypes?.map((item) => ({
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
      filters: customerTypes?.map((item) => ({
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
        value: item
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
        value: item
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
      dataIndex: 'officerResponseUpdatedAtDate',
      key: 'officerResponseUpdatedAtDate',
   
      render: (text, record) => (
        <div>
          {text ? (
            <div>  {moment(record.officerResponseUpdatedAtDate).format('DD-MM-YYYY')}
            <br />
            {moment(record.officerResponseUpdatedAtDate, 'HH:mm').format('HH:mm')}</div>
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
      title: 'Modified By',
      dataIndex: 'officerResponseModifiedByUserName',
      key: 'officerResponseModifiedByUserName',
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
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text, record) =>
        record ? (
          <div style={{ whiteSpace: 'nowrap' }} className='cursor-pointer'>
            {moment(record.activityStartDate).format('DD-MM-YYYY')}
            <br />
            {moment(record.activityStartTime, 'HH:mm').format('HH:mm')} -
            <br />
            {moment(record.activityFinishDate).format('DD-MM-YYYY')}
            <br />
            {moment(record.activityFinishTime, 'HH:mm').format('HH:mm')}
          </div>
        ) : (
          <div>-</div>
        ),
    },
  
    {
      title: 'Accepted Time',
      dataIndex: 'activityAcceptedTime',
      key: 'activityAcceptedTime',
      render: (text, record) =>
        record ? (
          <div style={{ whiteSpace: 'nowrap' }} className='cursor-pointer'>
            {record?.activityAcceptedDate ? dayjs(record.activityAcceptedDate).format('DD-MM-YYYY'):'-'}
            <br />
            {record.activityAcceptedTime ? record.activityAcceptedTime : '-'} 

          
          </div>
        ) : (
          <div>-</div>
        ),
    },
    {
      title: 'Enroute Time',
      dataIndex: 'activityAcceptedTime',
      key: 'activityAcceptedTime',
      render: (text, record) =>
        record ? (
          <div style={{ whiteSpace: 'nowrap' }} className='cursor-pointer'>
            {record?.activityAcceptedDate ? moment(record.activityAcceptedDate).format('DD-MM-YYYY'):'-'}

            <br />
            {record.activityOnTheWayTime ? moment(record.activityOnTheWayTime, 'HH:mm').format('HH:mm') : '-'} 
          
          </div>
        ) : (
          <div>-</div>
        ),
    },
    {
      title: 'Time on Site',
      dataIndex: 'activityOnSiteTime',
      key: 'activityOnSiteTime',
      render: (text, record) => {
        return text ? (
          <div style={{ whiteSpace: 'nowrap' }} className='cursor-pointer'>
          {record?.activityOnSiteDate ? moment(record.activityOnSiteDate).format('DD-MM-YYYY'):'-'}

          <br />
          {record.activityOnSiteTime ? moment(record.activityOnSiteTime, 'HH:mm').format('HH:mm') : '-'} 

        
        </div>
        ) : (
          <div>-</div>
        );
      }
    },
    {
      title: 'Time off Site',
      dataIndex: 'activityOffSiteTime',
      key: 'activityOffSiteTime',
      render: (text, record) => {
        
        return text ? (
          <div style={{ whiteSpace: 'nowrap' }} className='cursor-pointer'>
            {record?.activityOffSiteDate ? moment(record.activityOffSiteDate).format('DD-MM-YYYY'):'-'}

            <br />
            {record.activityOffSiteTime ? moment(record.activityOffSiteTime, 'HH:mm').format('HH:mm') : '-'} 

          
          </div>
        ) : (
          <div>-</div>
        );
      }},
    {
      title: 'Status',
      dataIndex: 'activityStatus',
      key: 'activityStatus',
      filters: statuses?.map(item => ({
        text: item,
        value: item
      })),
      filterSearch: true,

      onFilter: (value, record) => record?.activityStatus === value,
      render: (text, record) =>
        text ? (
          <div
            style={{ whiteSpace: 'nowrap' }}
            className='text-blue-700 cursor-pointer'
            onClick={() => {
              if (record?.isCancelled) {
                showCancellationPopup(record);
              } else {
                handleStatusClick(record);
              }
            }}          >
            {record?.isCancelled ? 'Cancelled' : text}
          </div>
        ) : (
          <div>-</div>
        ),
    },
    {
      title: 'Actions',
      key: 'edit',
      render: (text, record) => (
       currentRole !== 'Mobile Driver' &&  <ActionsDropdown record={record} handleModalOpen={handleModalOpen} handleCancel={handleCancel} />
      ),
    },
  ].filter(column => !(column.key === 'edit' && currentRole === 'Mobile Driver'));
 
  const rowClassName = (record) => {
    return record.isCancelled ? 'hover:bg-red-100 bg-red-100' : '';
  };

  return (
    <div className='relative'>
      <div className='flex justify-between my-4 items-center flex-col md:flex-row'>
        <h2 className='text-xl font-bold'>Activities</h2>
        <span className=' flex gap-3 items-center' ><p className='text-xl font-medium hidden md:block'> </p> <RangePicker  size='large' onChange={handleDateChange} /></span>
      </div>
      

      <Table virtual className='overflow-x-scroll' columns={columns} dataSource={filteredData} loading={loading} rowKey='_id'       rowClassName={rowClassName}
 />

      <ActivityFilterPopup visible={visible} setVisible={setVisible} />
      <Modal
        title='Assign Activity'
        open={showModal}
        onCancel={()=>setShowModal(false)}
        footer={[
        <span className='flex gap-3 justify-end'>
          <Button  key="cancel" onClick={()=>setShowModal(false)}>
            Cancel
          </Button>
          <Button loading={loading} type='primary' key="cancel" onClick={handleSubmit}>
          Assign
        </Button>
        </span>,
        ]}
        onOk={() => form.submit()}
        okText='Save'
      >
        <Select
          // defaultValue={currentRecord?.assignedTo}
          style={{ width: '100%' }}
          onChange={handleAssignedToChange}
          options={users}
        /></Modal>
      <Modal
        title='Edit Activity'
        open={showEditModal}
        onCancel={handleModalClose}
        onOk={() => form.submit()}
        okText='Save'
      >
        <Form form={form} layout='vertical' onFinish={handleEditSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Item name='activityReferenceNumber' label='Activity Reference Number'>
                <Input disabled />
              </Item>
            </Col>
            <Col span={12}>
              <Item name='activityType' label='Activity Type'>
                <Select disabled>
                  {types?.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Item name='customerId' label='Customer'>
                <Select disabled onChange={(value) => getBranchesData(value)}>
                  {customersData?.map(customer => (
                    <Option key={customer.value} value={customer.value}>
                      {customer.label}
                    </Option>
                  ))}
                </Select>
              </Item>
            </Col>
            <Col span={12}>
              <Item name='branchId' label='Branch'>
                <Select disabled onChange={(value) => getProperties(value)}>
                  {branches?.map(branch => (
                    <Option key={branch.value} value={branch.value}>
                      {branch.label}
                    </Option>
                  ))}
                </Select>
              </Item>
            </Col>
            <Col span={12}>
              <Item name='propertyId' label='Property'>
                <Select disabled options={properties}>
                 
                </Select>
              </Item>
            </Col>
            <Col span={12}>
              <Item name='assignedToUserId' label='Assigned To'>
                <Select>
                  {users?.map(user => (
                    <Option key={user.value} value={user.value}>
                      {user.label}
                    </Option>
                  ))}
                </Select>
              </Item>
            </Col>
            <Col span={12}>
              <Item name='activityStartDate' label='Start Date'>
                <DatePicker format={'DD-MM-YYYY'} />
              </Item>
            </Col>
            <Col span={12}>
              <Item name='activityStartTime' label='Start Time'>
                <TimePicker needConfirm={false} format='HH:mm' />
              </Item>
            </Col>
            <Col span={12}>
              <Item name='activityFinishDate' label='Finish Date'>
                <DatePicker format={'DD-MM-YYYY'} />
              </Item>
            </Col>
            <Col span={12}>
              <Item name='activityFinishTime' label='Finish Time'>
                <TimePicker needConfirm={false}  format='HH:mm' />
              </Item>
            </Col>
           
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Cancel Reason"
        open={isCancelModalVisible}
        onOk={handleCancelConfirm}
        onCancel={handleCancelModalClose}
      >
        <Input.TextArea
          placeholder="Please enter the reason for cancellation"
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </Modal>
      <Modal
        title="Cancellation Reason"
        open={isCancelReasonModalVisible}
        onOk={handleCancelOk}
        onCancel={handleCancelReason}
      >
        <p> {cancellationReason}</p>
      </Modal>

    </div>
  );
};

export default ActivityDetails;
