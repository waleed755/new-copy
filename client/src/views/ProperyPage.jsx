import React from 'react'
import { Empty, Image, Table, Tabs } from 'antd'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSinglePropertyApi } from '../services/apiConstants'
import { useEffect } from 'react'
import moment from 'moment'

const { TabPane } = Tabs
function PropertyPage() {
  const [propertyDetails, setPropertyDetails] = useState({})
  const [loading, setLoading] = useState(false)

  const { id } = useParams() // Extract id from URL
  const getPropertyData = async () => {
    try {
      setLoading(true)

      const fetchRows = await getSinglePropertyApi(id)
      if (fetchRows.data.success) {
        setPropertyDetails(fetchRows.data.property)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getPropertyData()
  }, [])
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
  ]

  console.log('id', id)
  return (
    <div className='p-5'>
      <p className='text-xl font-semibold ml-5 mb-5'> Property Detail</p>

      <Tabs defaultActiveKey='1' className='ml-5'>
        <TabPane tab='Branch Info' key='1'>
          <div className='flex gap-5  '>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Customer Name</p>
              <p className='text-base font normal'>
                {propertyDetails?.customerName || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Branch Name</p>
              <p className='text-base font normal'>
                {propertyDetails?.branchName || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property ID</p>
              <p className='text-base font normal'>
                {propertyDetails?.propertyId || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property Reference</p>
              <p className='text-base font normal'>
                {propertyDetails?.propertyReference || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3'>
              <p className='text-base font-medium'>Property Name</p>
              <p className='text-base font normal'>
                {propertyDetails?.propertyName || '-'}
              </p>
            </span>
          </div>
        </TabPane>
        <TabPane tab='Address' key='2'>
          <div className='flex gap-5  '>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property Address</p>
              <p className='text-base font normal'>
                {propertyDetails?.propertyAddress?.address || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property Postcode</p>
              <p className='text-base font normal'>
                {propertyDetails?.propertyAddress?.postCode || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property City</p>
              <p className='text-base font normal'>
                {propertyDetails?.propertyAddress?.city || '-'}
              </p>
            </span>
          </div>
        </TabPane>
        <TabPane tab='Property Data' key='3'>
          <div className='flex gap-5  '>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property Type</p>
              <p className='text-base font normal'>
                {propertyDetails?.propertyType?.value || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property Status</p>
              <p className='text-base font normal'>
                {propertyDetails?.propertyStatus?.value || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property Category</p>
              <p className='text-base font normal'>
                {propertyDetails?.propertyCategory?.value || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property AI</p>
              <p className='text-base font normal'>
                {propertyDetails?.propertyCategory?.value || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property Start Date</p>
              <p className='text-base font normal'>
                {propertyDetails.propertyStartDate
                  ? moment(propertyDetails?.propertyStartDate).format(
                      'DD-MM-YYYY'
                    )
                  : '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property Finish Date</p>
              <p className='text-base font normal'>
                {propertyDetails.propertyFinishDate
                  ? moment(propertyDetails?.propertyFinishDate).format(
                      'DD-MM-YYYY'
                    )
                  : '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
    <p className='text-base font-medium'>AI Files</p>
    <div className='flex gap-3'>
         <Image.PreviewGroup
    items={
      propertyDetails?.aiFiles
    }
  >
    <Image
      width={150}
      height={150}
      src={propertyDetails?.aiFiles?.length > 0 && propertyDetails?.aiFiles[0]}
    />
  </Image.PreviewGroup>
    </div>
  </span>
          </div>
        </TabPane>
        <TabPane tab='Point of Contact' key='4'>
          {propertyDetails?.propertyPointOfContact?.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
              {propertyDetails?.propertyPointOfContact.map(contact => (
                <div
                  key={contact._id}
                  className='bg-white shadow-md rounded-lg p-4'
                >
                  <p className='text-lg font-semibold'>Name : {contact.name}</p>
                  <p className='text-gray-600 text-base'>
                    <span className='font-medium text-base text-black'>
                      Contact :
                    </span>
                    {contact.contact}
                  </p>
                  <p className='text-gray-600 text-base'>
                    <span className='font-medium text-base text-black'>
                      Email :
                    </span>
                    {contact.email}
                  </p>
                  <p className='text-gray-600 text-base'>
                    <span className='font-medium text-base text-black'>
                      Address :
                    </span>
                    {contact.address}
                  </p>
                  <p className='text-gray-600 text-base'>
                    <span className='font-medium text-base text-black'>
                      City :
                    </span>
                    {contact.city}
                  </p>
                  <p className='text-gray-600 text-base'>
                    <span className='font-medium text-base text-black'>
                      Postcode :
                    </span>
                    {contact?.postCode}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <Empty description={'No Point of Contacts Found'} />
          )}
        </TabPane>
        <TabPane tab='Keys Data' key='5'>
          <div className='flex gap-5  '>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property Key Name</p>
              <p className='text-base font normal'>
                {propertyDetails.propertyKeys?.value || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Property Key Value</p>
              <p className='text-base font normal'>
                {propertyDetails.propertyKeyValue || '-'}
              </p>
            </span>
          <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
    <p className='text-base font-medium'>Key Images</p>
    <div className='flex gap-3'>

    <Image.PreviewGroup
    items={
      propertyDetails?.keyImages
    }
  >
    <Image
      width={100}
      src={propertyDetails?.keyImages?.length > 0 && propertyDetails?.keyImages[0]}
    />
  </Image.PreviewGroup>
     
    </div>
  </span>
  </div>

        </TabPane>
        <TabPane tab='Fee' key='6'>
          <div className='flex flex-col gap-[40px] '>
            <div className='flex gap-5 '>
              <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
                <p className='text-base font-medium'>Subscription Plan</p>
                <p className='text-base font normal'>
                  {propertyDetails.propertySubscriptionFee?.value || '-'}
                </p>
              </span>
              <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
                <p className='text-base font-medium'>Subscription Fee Value</p>
                <p className='text-base font normal'>
                  {propertyDetails.propertySubscriptionFeeValue || '-'}
                </p>
              </span>
            </div>

            <Table
              title={() => (
                <div className='flex justify-center items-center'>
                  <p className='text-lg font-semibold text-center'>
                    Flat fee Data
                  </p>
                </div>
              )}
              dataSource={propertyDetails?.propertyFlatFeeServiceData}
              columns={columns}
              pagination={false}
              bordered
              // Disable pagination if not needed
            />
          </div>
        </TabPane>
        <TabPane tab='Notes' key='7'>
          <div className='flex gap-5  '>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>Internal Notes</p>
              <p className='text-base font normal'>
                {propertyDetails.propertyInternalNotes || '-'}
              </p>
            </span>
            <span className='flex flex-col gap-3 border-r border-[#e5e5e5] px-5'>
              <p className='text-base font-medium'>External Notes</p>
              <p className='text-base font normal'>
                {propertyDetails.propertyExternalNotes || '-'}
              </p>
            </span>
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default PropertyPage
