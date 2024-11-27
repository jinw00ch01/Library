import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const CooperationManagement = () => {
  const [cooperations, setCooperations] = useState([]);
  const [selectedCoop, setSelectedCoop] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCooperations();
  }, []);

  const fetchCooperations = async () => {
    try {
      const response = await adminService.getCooperations();
      setCooperations(response.cooperations);
    } catch (error) {
      message.error('공급업체 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleDetail = (cooperation) => {
    setSelectedCoop(cooperation);
    setIsModalVisible(true);
  };

  const handleEdit = () => {
    form.setFieldsValue(selectedCoop);
    setIsEditMode(true);
  };

  const handleUpdate = async (values) => {
    try {
      await adminService.updateCooperation(selectedCoop.Cooperation_ID, values);
      message.success('공급업체 정보가 수정되었습니다.');
      setIsEditMode(false);
      setIsModalVisible(false);
      fetchCooperations();
    } catch (error) {
      message.error('공급업체 정보 수정에 실패하였습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteCooperation(selectedCoop.Cooperation_ID);
      message.success('공급업체가 삭제되었습니다.');
      setIsModalVisible(false);
      fetchCooperations();
    } catch (error) {
      message.error('공급업체 삭제에 실패하였습니다.');
    }
  };

  const columns = [
    {
      title: '공급업체 ID',
      dataIndex: 'Cooperation_ID',
      key: 'Cooperation_ID',
    },
    {
      title: '업체명',
      dataIndex: 'Cooperation_name',
      key: 'Cooperation_name',
    },
    {
      title: '업체 구분',
      dataIndex: 'Cooperation_classification',
      key: 'Cooperation_classification',
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
      <h2>공급업체 관리</h2>
      <Table columns={columns} dataSource={cooperations} rowKey="Cooperation_ID" />
      <Modal
        title="공급업체 상세 정보"
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
            <p><strong>공급업체 ID:</strong> {selectedCoop?.Cooperation_ID}</p>
            <p><strong>업체명:</strong> {selectedCoop?.Cooperation_name}</p>
            <p><strong>주소:</strong> {selectedCoop?.Cooperation_address}</p>
            <p><strong>담당자명:</strong> {selectedCoop?.Cooperation_pername}</p>
            <p><strong>연락처:</strong> {selectedCoop?.Cooperation_number}</p>
            <p><strong>업체 구분:</strong> {selectedCoop?.Cooperation_classification}</p>
            <Button type="primary" onClick={handleEdit}>공급업체 정보 수정</Button>
            <Button type="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>공급업체 정보 삭제</Button>
          </>
        ) : (
          <Form form={form} onFinish={handleUpdate} layout="vertical">
            <Form.Item
              name="Cooperation_name"
              label="업체명"
              rules={[{ required: true, message: '업체명을 입력해주세요' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Cooperation_address"
              label="주소"
              rules={[{ required: true, message: '주소를 입력해주세요' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Cooperation_pername"
              label="담당자명"
              rules={[{ required: true, message: '담당자명을 입력해주세요' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Cooperation_number"
              label="연락처"
              rules={[{ required: true, message: '연락처를 입력해주세요' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Cooperation_classification"
              label="업체 구분"
              rules={[{ required: true, message: '업체 구분을 선택해주세요' }]}
            >
              <Select>
                <Select.Option value="출판사">출판사</Select.Option>
                <Select.Option value="기관">기관</Select.Option>
                <Select.Option value="학교">학교</Select.Option>
                <Select.Option value="기타">기타</Select.Option>
              </Select>
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

export default CooperationManagement; 