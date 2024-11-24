import React from 'react';
import { Form, Input, Button, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const ReturnLoRegistrationForm = ({ onClose }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await adminService.registerReturnLo(values);
      message.success('반납 장소가 등록되었습니다!');
      onClose();
    } catch (error) {
      message.error('반납 장소 등록에 실패했습니다.');
    }
  };

  return (
    <FormContainer>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="ReturnLo_location"
          label="반납 장소"
          rules={[{ required: true, message: '반납 장소를 입력해주세요' }]}
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

export default ReturnLoRegistrationForm; 