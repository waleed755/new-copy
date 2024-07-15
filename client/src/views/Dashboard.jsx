import React, { useState, useEffect } from 'react';
import { Tabs, Table, Spin } from 'antd';
import moment from 'moment';
import { assignActivityToUsersApi, getTodayActivitiesApi, getUserAssignedActivitiesApi } from '../services/apiConstants';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const Dashboard = () => {
  const [assignedActivities, setAssignedActivities] = useState([]);
  const [todaysActivities, setTodaysActivities] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate()

useEffect(() => {
  const fetchActivities = async () => {
    try {
      const assignedResponse = await getUserAssignedActivitiesApi();
      setAssignedActivities(assignedResponse.data?.allActivities);

      const todayResponse = await getTodayActivitiesApi();
      setTodaysActivities(todayResponse.data?.allActivities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchActivities();
}, []);


  const currentRole = localStorage.getItem("role");

  const assignees = [...new Set(assignedActivities?.filter(item => item.assignedToUserName)?.map(item => item.assignedToUserName))];
  const performers = [...new Set(assignedActivities?.filter(item => item.performedByUserName)?.map(item => item.performedByUserName))];
  const statuses = [...new Set(assignedActivities?.filter(item => item.activityStatus)?.map(item => item.activityStatus))];
  const activityTypes = [...new Set(assignedActivities?.filter(item => item.activityType)?.map(item => item.activityType))];
  const propertyTypes = [...new Set(assignedActivities?.filter(item => item.propertyName)?.map(item => item.propertyName))];
  const BranchTypes = [...new Set(assignedActivities?.filter(item => item.branchName)?.map(item => item.branchName))];
  const CustomerTypes = [...new Set(assignedActivities?.filter(item => item.customerName)?.map(item => item.customerName))];



  const handleStatusClick = async(record) => {
    const { _id } = record;
    if(!record?.assignedToUserName){try {
      const fetchRows = await assignActivityToUsersApi({activityData:{
        userId:userStoreState?._id,
        activityId: record?._id,
        

      }})
      if(fetchRows?.data?.success){
        fetchActivities()
      }
    } catch (error) {
      console.error(error);
    }}
    navigate(`/user-dashboard/activity/response-officer-report/${_id}`);

  }

  const columns = [
    {
      title: 'Reference',
      dataIndex: 'activityReferenceNumber',
      key: 'activityReferenceNumber',
      render: (text) =>
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
      filters: activityTypes?.map((item) => ({
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
      filters: BranchTypes?.map((item) => ({
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
      filters: CustomerTypes?.map((item) => ({
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
      filters: assignees?.map((item) => ({
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
              className="text-blue-700 cursor-pointer"
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
      filters: performers?.map((item) => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.performedByUserName === value,
      render: (text) => (
        <div>
          {text ? (
            <div>{text}</div>
          ) : (
            <div
              style={{ whiteSpace: 'nowrap' }}
              className="text-blue-700 cursor-pointer"
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
          <div style={{ whiteSpace: 'nowrap' }} className="cursor-pointer">
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
          <div style={{ whiteSpace: 'nowrap' }} className="cursor-pointer">
            {record?.activityAcceptedDate
              ? moment(record.activityAcceptedDate).format('DD-MM-YYYY')
              : '-'}
            <br />
            {record.activityAcceptedTime
              ? moment(record.activityAcceptedTime, 'HH:mm').format('HH:mm')
              : '-'}
          </div>
        ) : (
          <div>-</div>
        ),
    },
    {
      title: 'Modified Time',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
   
      render: (text, record) => (
        <div>
          {text ? (
            <div>  {moment(record.updatedAt).format('DD-MM-YYYY')}
            <br />
            {moment(record.updatedAt, 'HH:mm').format('HH:mm')}</div>
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
      title: 'Enroute Time',
      dataIndex: 'activityAcceptedTime',
      key: 'activityAcceptedTime',
      render: (text, record) =>
        record ? (
          <div style={{ whiteSpace: 'nowrap' }} className="cursor-pointer">
            {record?.activityAcceptedDate
              ? moment(record.activityAcceptedDate).format('DD-MM-YYYY')
              : '-'}
            <br />
            {record.activityOnTheWayTime
              ? moment(record.activityOnTheWayTime, 'HH:mm').format('HH:mm')
              : '-'}
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
          <div style={{ whiteSpace: 'nowrap' }} className="cursor-pointer">
            {record?.activityOnSiteDate
              ? moment(record.activityOnSiteDate).format('DD-MM-YYYY')
              : '-'}
            <br />
            {record.activityOnSiteTime
              ? moment(record.activityOnSiteTime, 'HH:mm').format('HH:mm')
              : '-'}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      title: 'Time off Site',
      dataIndex: 'activityOffSiteTime',
      key: 'activityOffSiteTime',
      render: (text, record) => {
        return text ? (
          <div style={{ whiteSpace: 'nowrap' }} className="cursor-pointer">
            {record?.activityOffSiteDate
              ? moment(record.activityOffSiteDate).format('DD-MM-YYYY')
              : '-'}
            <br />
            {record.activityOffSiteTime
              ? moment(record.activityOffSiteTime, 'HH:mm').format('HH:mm')
              : '-'}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'activityStatus',
      key: 'activityStatus',
      filters: statuses?.map((item) => ({
        text: item,
        value: item,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.activityStatus === value,
      render: (text, record) =>
        text ? (
          <div
            style={{ whiteSpace: 'nowrap' }}
            className="text-blue-700 cursor-pointer"
            onClick={() => handleStatusClick(record)}
          >
            {text}
          </div>
        ) : (
          <div>-</div>
        ),
    },
    // {
    //   title: 'Actions',
    //   key: 'edit',
    //   render: (text, record) => (
    //     currentRole !== 'Mobile Driver' && (
    //       <ActionsDropdown
    //         record={record}
    //         handleModalOpen={handleModalOpen}
    //         handleCancel={handleCancel}
    //       />
    //     )
    //   ),
    // },
  ].filter((column) => !(column.key === 'edit' && currentRole === 'Mobile Driver'));

  return (
    <div className="custom-tabs-container mt-10">
    <Spin spinning={loading} >
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="My Activities" key="1">
          <div className="table-container">
            <Table
              columns={columns}
              dataSource={assignedActivities}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }} // Enable horizontal scroll if needed
            />
          </div>
        </TabPane>
        <TabPane tab="Due Activities" key="2">
          <div className="table-container">
            <Table
              columns={columns}
              dataSource={todaysActivities}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }} // Enable horizontal scroll if needed
            />
          </div>
        </TabPane>
      </Tabs>
    </Spin>
  </div>
  );
};

export default Dashboard;
