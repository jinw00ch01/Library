import React from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const CooperationRegistrationForm = ({ onClose }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await adminService.registerCooperation(values);
      message.success('공급업체가 등록되었습니다!');
      onClose();
    } catch (error) {
      message.error('공급업체 등록에 실패했습니다.');
    }
  };

  return (
    <FormContainer>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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

export default CooperationRegistrationForm; 