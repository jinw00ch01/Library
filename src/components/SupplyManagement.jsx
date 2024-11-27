import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';
import dayjs from 'dayjs';

const SupplyManagement = () => {
  const [supplies, setSupplies] = useState([]);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      const response = await adminService.getSupplies();
      setSupplies(response.supplies);
    } catch (error) {
      message.error('공급명세 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleDetail = (supply) => {
    setSelectedSupply(supply);
    setIsModalVisible(true);
  };

  const handleEdit = () => {
    form.setFieldsValue({
      ...selectedSupply,
      Supply_date: dayjs(selectedSupply.Supply_date),
    });
    setIsEditMode(true);
  };

  const handleUpdate = async (values) => {
    try {
      const updatedData = {
        ...values,
        Supply_date: values.Supply_date.format('YYYY-MM-DD'),
      };
      await adminService.updateSupply(selectedSupply.Supply_ID, updatedData);
      message.success('공급명세 정보가 수정되었습니다.');
      setIsEditMode(false);
      setIsModalVisible(false);
      fetchSupplies();
    } catch (error) {
      message.error('공급명세 정보 수정에 실패하였습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteSupply(selectedSupply.Supply_ID);
      message.success('공급명세가 삭제되었습니다.');
      setIsModalVisible(false);
      fetchSupplies();
    } catch (error) {
      message.error('공급명세 삭제에 실패하였습니다.');
    }
  };

  const columns = [
    {
      title: '공급명세 ID',
      dataIndex: 'Supply_ID',
      key: 'Supply_ID',
    },
    {
      title: '공급일',
      dataIndex: 'Supply_date',
      key: 'Supply_date',
    },
    {
      title: '금액',
      dataIndex: 'Supply_price',
      key: 'Supply_price',
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleDetail(record)}>상세정보</Button>
      ),
    },
  ];

  return (
    <Container>
      <h2>공급명세 관리</h2>
      <Table columns={columns} dataSource={supplies} rowKey="Supply_ID" />
      <Modal
        title="공급명세 상세 정보"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditMode(false);
          form.resetFields();
        }}
        footer={null}
      >
        {!isEditMode ? (
          <>
            <p><strong>공급명세 ID:</strong> {selectedSupply?.Supply_ID}</p>
            <p><strong>부서 ID:</strong> {selectedSupply?.Department_ID}</p>
            <p><strong>공급일:</strong> {selectedSupply?.Supply_date}</p>
            <p><strong>금액:</strong> {selectedSupply?.Supply_price}</p>
            <p><strong>도서 ID:</strong> {selectedSupply?.Book_ID}</p>
            <p><strong>직원 ID:</strong> {selectedSupply?.staff_ID}</p>
            <Button type="primary" onClick={handleEdit}>공급명세 정보 수정</Button>
            <Button type="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>공급명세 정보 삭제</Button>
          </>
        ) : (
          <Form form={form} onFinish={handleUpdate} layout="vertical">
            <Form.Item
              name="Department_ID"
              label="부서 ID"
              rules={[{ required: true, message: '부서 ID를 입력해주세요' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="Supply_date"
              label="공급일"
              rules={[{ required: true, message: '공급일을 선택해주세요' }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="Supply_price"
              label="금액"
              rules={[{ required: true, message: '금액을 입력해주세요' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="Book_ID"
              label="도서 ID"
              rules={[{ required: true, message: '도서 ID를 입력해주세요' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Button type="primary" htmlType="submit">저장</Button>
            <Button onClick={() => setIsEditMode(false)} style={{ marginLeft: '10px' }}>취소</Button>
          </Form>
        )}
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
`;

export default SupplyManagement; 