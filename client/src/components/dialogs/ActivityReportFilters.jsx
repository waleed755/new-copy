import React from 'react'
import {
  Modal,
  Form,
  Select,
  Button,
  DatePicker,
  Row,
  Col,
  TimePicker,
} from 'antd'

const { RangePicker } = DatePicker

const ActivityReportFilterPopup = ({
  visible,
  onClose,
  form,
  onCustomerChange,
  onFinish,
  properties,
  customersData,
  branches,
  types,
  statusData,
  chargeable,
  categories,
  aiData,
  loading,
}) => {
  return (
    <Modal
      title='Filter Options'
      open={visible}
      onCancel={onClose}
      footer={null}
      className='filter-popup'
    >
      <div className='filter-container'>
        <Form form={form} onFinish={onFinish} layout='vertical'>
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item name='startDate' label='Activity Start Date'>
                <DatePicker style={{width:'100%'}} size='large' format={'DD-MM-YYYY'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='endDate' label='Activity End Date'>
                <DatePicker style={{width:'100%'}} size='large' format={'DD-MM-YYYY'} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name='customerId' label='Customer'>
                <Select
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(
                      input?.toLowerCase()
                    )
                  }
                  showSearch
                  placeholder='Select Customer'
                  options={customersData}
                  onChange={onCustomerChange}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name='branchId' label='Branch'>
                <Select
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(
                      input?.toLowerCase()
                    )
                  }
                  showSearch
                  allowClear
                  placeholder='Select Branch'
                  options={branches}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='propertyId' label='Property'>
                <Select
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(
                      input?.toLowerCase()
                    )
                  }
                  showSearch
                  placeholder='Select Property'
                  options={properties}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='type' label='Type'>
                <Select
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(
                      input?.toLowerCase()
                    )
                  }
                  showSearch
                  size='large'
                  className='  text-lg font-bold h-[50px] min-w-fit  rounded-md border border-transparent transition-all duration-300 ease-in-out hover:border-white'
                  // value={selectedOption}
                  // onChange={handleSelectChange}
                  placeholder='Select Activity'
                >
                  <Option value='Vacant Property Check'>
                    Vacant Property Check
                  </Option>
                  <Option value='alarmActivation'>Alarm Activation</Option>
                  <Option value='patrol'>Patrol</Option>
                  <Option value='alarmCall'>Unlock/lock</Option>
                  <Option value='accessVisit'>
                    Emergency on-site Visit requested
                  </Option>
                  <Option value='keyCollection'>Key Check</Option>
                  <Option value='keyPickup'>Key Pick-up</Option>
                  <Option value='keyDropoff'>Key drop-off</Option>
                  <Option value='fireAlarmTest'>Fire alarm test</Option>
                  <Option value='KeyDropoff'>Void Property Inspection</Option>
                  <Option value='staticGuard'>Static guard</Option>
                </Select>
              </Form.Item>
            </Col>

          

            
            <Col span={24}>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  )
}

export default ActivityReportFilterPopup
