import React from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const DepartmentRegistrationForm = ({ onClose }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await adminService.registerDepartment(values);
      message.success('부서가 등록되었습니다!');
      onClose();
    } catch (error) {
      message.error('부서 등록에 실패했습니다.');
    }
  };

  return (
    <FormContainer>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
            <Select.Option value="시설관료">시설관료</Select.Option>
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

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            등록하기
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  padding: 24px;
`;

export default DepartmentRegistrationForm; 