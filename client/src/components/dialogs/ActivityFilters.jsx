import React from 'react';
import { Modal, Form, Select, Button, DatePicker, Row, Col } from 'antd';

const { RangePicker } = DatePicker;

const ActivityFilterPopup = ({ visible, onClose, form, onFinish,properties,  customersData, branches, types, statusData, loading }) => {
  return (
    <Modal
      title="Filter Options"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="filter-popup"
    >
      <div className='filter-container'>
        <Form form={form} onFinish={onFinish} layout='vertical'>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name='dates'
                rules={[{ required: true, message: 'Please select start and end date' }]}
                label="Date Range"
              >
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['Start Date', 'End Date']}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name='customerId' label="Customer">
                <Select
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(input?.toLowerCase())
                  }
                  showSearch
                  placeholder='Select Customer'
                  options={customersData}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name='branchId' label="Branch">
                <Select
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(input?.toLowerCase())
                  }
                  showSearch
                  allowClear
                  placeholder='Select Branch'
                  options={branches}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='propertyId' label="Property">
                <Select
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(input?.toLowerCase())
                  }
                  showSearch
                  allowClear
                  placeholder='Select Customer'
                  options={properties}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='typeId' label="Type">
                <Select
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? '').includes(input?.toLowerCase())
                  }
                  showSearch
                  placeholder='Select Type'
                  options={types}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name='statusId' label="Status">
                <Select placeholder='Active' options={statusData} />
              </Form.Item>
            </Col>

            
            <Col span={24}>
              <Form.Item>
                <Button type='primary' htmlType='submit' loading={loading} style={{ width: '100%' }}>
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default ActivityFilterPopup;
