import { useEffect, useState } from 'react';
import { Button, Input, Modal, Form, Select, Table, Typography, message, Row, Col, Card } from 'antd';
import moment from 'moment';
import {
  addUserApi,
  staffStatusTogglerApi,
  getAllUsersApi,
  getPropertyStatusApi,
  updateUserApi,
} from '../services/apiConstants.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsPlusCircle } from 'react-icons/bs';
import { FaMinusCircle } from 'react-icons/fa';
import axios from 'axios';
import BASE_URL from '../config.js';
import dayjs from 'dayjs';

const UsersDetails = () => {
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [tableRows, setTableRows] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredRows, setFilteredRows] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [formList, setFormList] = useState([{ email: '', fullName: '', role: '' }]);
  const { user } = useSelector(state => state.user);
  const [form] = Form.useForm(); // Ant Design Form instance
  const navigate = useNavigate();
  const roles = [
    { label: 'Controller', value: 'Controller' },
    { label: 'Mobile Driver', value: 'Mobile Driver' }
  ];

  const handleSubmit = async (userData) => {
    try {
      setLoading(true);
      let response;
      if (selectedOfficer) {
        response = await updateUserApi(selectedOfficer._id, { userData: { ...userData } });
      } else {
        response = await addUserApi({ userData: { ...userData } });
      }
      if (response.data.success) {
        localStorage.setItem("token", response.data?.token);
        message.success(` User ${selectedOfficer ? 'Updated' : 'Added'} Successfully!`);
        form.resetFields();
        fetchRows();
        setOpenDialog(false); // Close the dialog after submission
      }
    } catch (error) {
      message.error(` ${error?.response?.data?.message}!`);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async () => {
    for (let formData of formList) {
      if (!formData.email || !formData.fullName || !formData.role) {
        message.error('Please fill out all fields.');
        return;
      }
    }

    const usersData = formList.map(formData => ({
      email: formData.email,
      fullName: formData.fullName,
      role: formData.role,
    }));

    try {
      setInviteLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${BASE_URL}/invite-user`,
        { users: usersData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('res invite user = ', response);
      if (response.data.message) {
        message.success('Invitation Link has been sent on the provided Email');
        setFormList([{ email: '', fullName: '', role: '' }])
        fetchRows();
        setIsInviteModalVisible(false); // Close modal instead of navigating
      }
    } catch (error) {
      console.log('erere', error);
      message.error(`${error?.response?.data?.message}`);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleStatusChange = async (checked, staffId) => {
    if (!statusData) {
      message.error('Status data is not loaded yet.');
      return;
    }
    setStatusLoading(true);

    const activeStatus = statusData.find(status => status.label === 'Active');
    const InactiveStatus = statusData.find(status => status.label === 'Inactive');
    const newStatusId = checked ? activeStatus?.value : InactiveStatus?.value;

    try {
      const response = await staffStatusTogglerApi({
        staffData: { staffId: staffId, statusId: newStatusId },
      });
      if (response.data.success) {
        setStatusLoading(false);
        message.success('User status updated successfully!');
        fetchRows();
      } else {
        setStatusLoading(false);
      }
    } catch (error) {
      setStatusLoading(false);
      message.error(`Error updating branch status: ${error}`);
    }
  };

  const getStatuses = async () => {
    try {
      const statuses = await getPropertyStatusApi();
      if (statuses.data.success) {
        const transformedData = statuses.data.statuses.map(customer => ({
          value: customer._id, // Assuming customer id as value
          label: customer.value, // Assuming customer name as label
        }));
        setStatusData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching property statuses:', error);
    }
  };

  const handleDialogState = (officer = null) => {
    console.log('officer', officer);
    setSelectedOfficer(officer || null);
    if (officer) {
      form.setFieldsValue({
        fullName: officer.fullName,
        job: officer.job,
        role: officer.role,
        email: officer.email,
      });
    } else {
      form.resetFields();
    }
    setOpenDialog(prev => !prev);
  };

  const fetchRows = async () => {
    try {
      setLoading(true);
      const fetchRows = await getAllUsersApi();
      if (fetchRows.data.success) {
        setTableRows(fetchRows.data.users.reverse());
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInviteChange = (index, e) => {
    const { name, value } = e.target;
    const newFormList = formList.slice();
    newFormList[index][name] = value;
    setFormList(newFormList);
  };

  const handleInviteSelectChange = (index, value) => {
    const newFormList = formList.slice();
    newFormList[index].role = value;
    setFormList(newFormList);
  };

  const addInviteForm = () => {
    setFormList(prevFormList => [
      ...prevFormList,
      { email: '', fullName: '', role: '' },
    ]);
  };

  const removeInviteForm = index => {
    console.log('Removing item at index:', index);
    const newFormList = formList.filter((_, i) => i !== index);
    setFormList(newFormList);
  };

  useEffect(() => {
    fetchRows();
    getStatuses();
  }, []);

  useEffect(() => {
    // Function to filter rows based on searchText
    const filterRows = () => {
      if (!tableRows) return; // Do nothing if tableRows is not yet fetched

      const filteredRows = tableRows.filter(row =>
        row?.fullName?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredRows(filteredRows);
    };

    // Call filterRows when searchText or tableRows change
    filterRows();
  }, [searchText, tableRows]);

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
      render: (text) => text ? <span style={{ whiteSpace: 'nowrap' }}>{`${text}`}</span> : <span>-</span>,
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      align: 'center',
      render: (text) => text ? <span style={{ whiteSpace: 'nowrap' }}>{text}</span> : <span>-</span>,
      sorter: (a, b) => a.companyName?.localeCompare(b.companyName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      render: (text) => text ? <span style={{ whiteSpace: 'nowrap' }}>{text}</span> : <span>-</span>,
      sorter: (a, b) => a.email?.localeCompare(b.email),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: (text) => text ? <span style={{ whiteSpace: 'nowrap' }}>{text}</span> : <span>-</span>,
      sorter: (a, b) => a.role?.localeCompare(b.role),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
      sorter: (a, b) => moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf(),
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
              <p className='text-lg font-semibold'>Users</p>
              <Input
                className='h-[40px] w-[60%]'
                type='text'
                placeholder='Search by user'
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
              <span className='flex items-center gap-4'>
                <Button type='primary' variant='primary' onClick={() => setIsInviteModalVisible(true)}>
                  Invite
                </Button>
                <Button type='primary' variant='contained' onClick={() => handleDialogState()}>
                  Add
                </Button>
              </span>
            </div>
          )}
          loading={loading}
          dataSource={filteredRows}
          bordered
          columns={columns}
          pagination={{
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} records`,
            pageSize: 10,  // Adjust page size as needed
          }}
        />
      </div>
      <Modal
        title="Invite Users"
        open={isInviteModalVisible}
        onCancel={() => setIsInviteModalVisible(false)}
        width={'65vw'}
        footer={[
          <Button key="cancel" onClick={() => setIsInviteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleInviteSubmit} loading={inviteLoading}>
            Submit
          </Button>,
        ]}
      >
        <Card>
          {formList.map((formData, index) => (
            <Row
              key={index}
              gutter={32}
              align='middle'
              style={{ marginBottom: 16 }}
            >
              <Col span={7}>
                <label>Full Name</label>
                <Input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={e => handleInviteChange(index, e)}
                  placeholder='Full Name'
                  required
                />
              </Col>
              <Col span={7}>
                <label>Email</label>
                <Input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={e => handleInviteChange(index, e)}
                  placeholder='Email'
                  required
                />
              </Col>
              <Col span={7}>
                <label>Role</label>
                <Select
                  value={formData.role}
                  onChange={value => handleInviteSelectChange(index, value)}
                  placeholder='Select Role'
                  required
                  style={{ width: '100%' }}
                >
                  <Option value='Mobile Driver'>Mobile Driver</Option>
                  <Option value='Controller'>Controller</Option>
                </Select>
              </Col>
              <Col span={3}>
                {formList.length > 1 && (
                  <FaMinusCircle
                    onClick={() => removeInviteForm(index)}
                    style={{
                      fontSize: '24px',
                      color: 'red',
                      cursor: 'pointer',
                      marginTop: 30,
                    }}
                  />
                )}
              </Col>
            </Row>
          ))}
          <div className='flex items-center justify-between'>
            <Button type='dashed' onClick={addInviteForm} icon={<BsPlusCircle />}>
              Add User
            </Button>
          </div>
        </Card>
      </Modal>
      <Modal   
        title={selectedOfficer ? "Edit user" : "Add new user"}
        open={openDialog}
        onCancel={() => setOpenDialog(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              form.validateFields().then(values => {
                handleSubmit(values);
              }).catch(info => {
                console.log('Validate Failed:', info);
              });
            }}
            loading={loading}
          >
            {selectedOfficer ? "Update" : "Add"}
          </Button>,
        ]}
      >
        <div>
          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: '400px', margin: '0 auto' }}
          >
            <Form.Item
              label='Full Name'
              name='fullName'
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Job'
              name='job'
              rules={[{ required: true, message: 'Please input your job!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Role'
              name='role'
              rules={[{ required: true, message: 'Please input your role!' }]}
            >
              <Select options={roles} />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              
              rules={[
                { required: true, message: 'Please input your email!', type: 'email' },
              ]}
            >
              <Input disabled={selectedOfficer?.email} type='email' />
            </Form.Item>
            {!selectedOfficer && (
              <Form.Item
                label='Password'
                name='password'
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default UsersDetails;
