import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const ReturnLoManagement = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLo, setSelectedLo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await adminService.getReturnLocations();
      setLocations(response.returnLocations);
    } catch (error) {
      message.error('반납장소 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleDetail = (location) => {
    setSelectedLo(location);
    setIsModalVisible(true);
  };

  const handleEdit = () => {
    form.setFieldsValue(selectedLo);
    setIsEditMode(true);
  };

  const handleUpdate = async (values) => {
    try {
      await adminService.updateReturnLocation(selectedLo.ReturnLo_ID, values);
      message.success('반납장소 정보가 수정되었습니다.');
      setIsEditMode(false);
      setIsModalVisible(false);
      fetchLocations();
    } catch (error) {
      message.error('반납장소 정보 수정에 실패하였습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteReturnLocation(selectedLo.ReturnLo_ID);
      message.success('반납장소가 삭제되었습니다.');
      setIsModalVisible(false);
      fetchLocations();
    } catch (error) {
      message.error('반납장소 삭제에 실패하였습니다.');
    }
  };

  const columns = [
    {
      title: '반납장소 ID',
      dataIndex: 'ReturnLo_ID',
      key: 'ReturnLo_ID',
    },
    {
      title: '반납장소',
      dataIndex: 'ReturnLo_location',
      key: 'ReturnLo_location',
    },
    {
      title: '연락처',
      dataIndex: 'ReturnLo_number',
      key: 'ReturnLo_number',
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
      <h2>반납장소 관리</h2>
      <Table columns={columns} dataSource={locations} rowKey="ReturnLo_ID" />
      <Modal
        title="반납장소 상세 정보"
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
            <p><strong>반납장소 ID:</strong> {selectedLo?.ReturnLo_ID}</p>
            <p><strong>반납장소:</strong> {selectedLo?.ReturnLo_location}</p>
            <p><strong>연락처:</strong> {selectedLo?.ReturnLo_number}</p>
            <p><strong>수용 가능 권수:</strong> {selectedLo?.ReturnLo_capacity}</p>
            <Button type="primary" onClick={handleEdit}>반납장소 정보 수정</Button>
            <Button type="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>반납장소 정보 삭제</Button>
          </>
        ) : (
          <Form form={form} onFinish={handleUpdate} layout="vertical">
            <Form.Item
              name="ReturnLo_location"
              label="반납장소"
              rules={[{ required: true, message: '반납장소를 입력해주세요' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="ReturnLo_number"
              label="연락처"
              rules={[{ required: true, message: '연락처를 입력해주세요' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="ReturnLo_capacity"
              label="수용 가능 권수"
              rules={[{ required: true, message: '수용 가능 권수를 입력해주세요' }]}
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

export default ReturnLoManagement; 