import React from 'react';
import { Empty, Table, Tabs } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleActivityApi } from '../services/apiConstants';
import { useEffect } from 'react';
import moment from 'moment';

const { TabPane } = Tabs;

function ActivityPage() {
  const [activityDetails, setActivityDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const { reference } = useParams(); // Extract id from URL
  console.log('reference', reference);

  const getActivityData = async () => {
    try {
      setLoading(true);
      const fetchRows = await getSingleActivityApi(reference);
      if (fetchRows.data.success) {
        setActivityDetails(fetchRows.data.activity);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getActivityData();
  }, []);

  const columns = [
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Initial Time (Minutes)',
      dataIndex: 'initialTimeMinutes',
      key: 'initialTimeMinutes',
    },
    {
      title: 'Initial Time Fees',
      dataIndex: 'initialTimeFees',
      key: 'initialTimeFees',
    },
    {
      title: 'Additional Time (Minutes)',
      dataIndex: 'additionalTimeMinutes',
      key: 'additionalTimeMinutes',
    },
    {
      title: 'Additional Time Fees',
      dataIndex: 'additionalTimeFees',
      key: 'additionalTimeFees',
    },
  ];

  return (
    <div className='p-5'>
      <p className='text-xl font-semibold ml-5 mb-5'>Activity Detail</p>

      <Tabs defaultActiveKey='1' className='ml-5'>
        <TabPane tab='General Details' key='1'>
          <div className='flex gap-5'>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Customer Name</p>
              <p className='text-base font-normal'>
                {activityDetails?.assignedToCustomerName || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Branch Name</p>
              <p className='text-base font-normal'>
                {activityDetails?.branchName || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property ID</p>
              <p className='text-base font-normal'>
                {activityDetails?.propertyId || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Activity Reference</p>
              <p className='text-base font-normal'>
                {activityDetails?.activityReferenceNumber || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3'>
              <p className='text-base font-medium'>Property Name</p>
              <p className='text-base font-normal'>
                {activityDetails?.propertyName || '-'}
              </p>
            </span>
          </div>
        </TabPane>
        <TabPane tab='Activity Data' key='2'>
          <div className='flex gap-5'>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Activity Type</p>
              <p className='text-base font-normal'>
                {activityDetails?.activityType || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Activity Start Date</p>
              <p className='text-base font-normal'>
                {activityDetails?.activityStartDate
                  ? moment(activityDetails?.activityStartDate).format('DD-MM-YYYY')
                  : '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3'>
              <p className='text-base font-medium'>Activity Finish Date</p>
              <p className='text-base font-normal'>
                {activityDetails?.activityFinishDate
                  ? moment(activityDetails?.activityFinishDate).format('DD-MM-YYYY')
                  : '-'}
              </p>
            </span>
          </div>
        </TabPane>
        <TabPane tab='Assignment Instructions' key='3'>
          <div className='flex gap-5'>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Internal Notes</p>
              <p className='text-base font-normal'>
                {activityDetails?.activityInternalNotes || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3'>
              <p className='text-base font-medium'>Additional Instructions</p>
              <p className='text-base font-normal'>
                {activityDetails?.activityAdditionalInstructions || '-'}
              </p>
            </span>
          </div>
        </TabPane>
        <TabPane tab='Questions & Complaints' key='4'>
          {activityDetails?.comments ? (
            <div className='bg-white shadow-md rounded-lg p-4'>
              <p className='text-lg font-semibold'>Comments</p>
              <p className='text-gray-600 text-base'>
                {activityDetails.comments}
              </p>
            </div>
          ) : (
            <Empty description={'No Comments Found'} />
          )}
        </TabPane>
        <TabPane tab='Location' key='5'>
          <div className='flex gap-5'>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Activity Area</p>
              <p className='text-base font-normal'>
                {activityDetails?.activityArea || '-'}
              </p>
            </span>
          </div>
        </TabPane>
  
        <TabPane tab='Reference' key='7'>
          <div className='flex gap-5'>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Internal Reference</p>
              <p className='text-base font-normal'>
                {activityDetails?.activityInternalReference || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3'>
              <p className='text-base font-medium'>Created By</p>
              <p className='text-base font-normal'>
                {activityDetails?.activityCreatedByUserName || '-'}
              </p>
            </span>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default ActivityPage;
