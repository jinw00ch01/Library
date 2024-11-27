import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await adminService.getDepartments();
      setDepartments(response.departments);
    } catch (error) {
      message.error('부서 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleDetail = (department) => {
    setSelectedDept(department);
    setIsModalVisible(true);
  };

  const handleEdit = () => {
    form.setFieldsValue(selectedDept);
    setIsEditMode(true);
  };

  const handleUpdate = async (values) => {
    try {
      await adminService.updateDepartment(selectedDept.department_ID, values);
      message.success('부서 정보가 수정되었습니다.');
      setIsEditMode(false);
      setIsModalVisible(false);
      fetchDepartments();
    } catch (error) {
      message.error('부서 정보 수정에 실패하였습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteDepartment(selectedDept.department_ID);
      message.success('부서가 삭제되었습니다.');
      setIsModalVisible(false);
      fetchDepartments();
    } catch (error) {
      message.error('부서 삭제에 실패하였습니다.');
    }
  };

  const columns = [
    {
      title: '부서 ID',
      dataIndex: 'department_ID',
      key: 'department_ID',
    },
    {
      title: '부서명',
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: '부서 연락처',
      dataIndex: 'department_number',
      key: 'department_number',
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
      <h2>부서 관리</h2>
      <Table columns={columns} dataSource={departments} rowKey="department_ID" />
      <Modal
        title="부서 상세 정보"
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
            <p><strong>부서 ID:</strong> {selectedDept?.department_ID}</p>
            <p><strong>부서명:</strong> {selectedDept?.department_name}</p>
            <p><strong>부서 구분:</strong> {selectedDept?.department_classification}</p>
            <p><strong>부서 위치:</strong> {selectedDept?.department_location}</p>
            <p><strong>부서 연락처:</strong> {selectedDept?.department_number}</p>
            <Button type="primary" onClick={handleEdit}>부서 정보 수정</Button>
            <Button type="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>부서 정보 삭제</Button>
          </>
        ) : (
          <Form form={form} onFinish={handleUpdate} layout="vertical">
            <Form.Item
              name="department_name"
              label="부서명"
              rules={[{ required: true, message: '부서명을 입력해주세요' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="department_classification"
              label="부서 구분"
              rules={[{ required: true, message: '부서 구분을 선택해주세요' }]}
            >
              <Select>
                <Select.Option value="공급">공급</Select.Option>
                <Select.Option value="경리">경리</Select.Option>
                <Select.Option value="서비스">서비스</Select.Option>
                <Select.Option value="프로그램">프로그램</Select.Option>
                <Select.Option value="디지털자료">디지털자료</Select.Option>
                <Select.Option value="시설관리">시설관리</Select.Option>
                <Select.Option value="행정지원">행정지원</Select.Option>
                <Select.Option value="기타">기타</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="department_location"
              label="부서 위치"
              rules={[{ required: true, message: '부서 위치를 입력해주세요' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="department_number"
              label="부서 연락처"
              rules={[{ required: true, message: '부서 연락처를 입력해주세요' }]}
            >
              <Input />
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

export default DepartmentManagement; 