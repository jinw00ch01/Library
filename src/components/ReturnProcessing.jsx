import React from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import styled from 'styled-components';
import { returnService } from '../services/api';

const ReturnProcessing = ({ staffId }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await returnService.processReturn({ ...values, staff_ID: staffId });
      message.success('반납 처리가 완료되었습니다.');
      form.resetFields();
    } catch (error) {
      message.error('반납 처리에 실패하였습니다.');
    }
  };

  return (
    <FormContainer>
      <h2>반납 처리</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="Book_ID"
          label="도서 ID"
          rules={[{ required: true, message: '도서 ID를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ReturnLo_ID"
          label="반납 장소 ID"
          rules={[{ required: true, message: '반납 장소 ID를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Customer_ID"
          label="고객 ID"
          rules={[{ required: true, message: '고객 ID를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Return_condition"
          label="반납 상태"
          rules={[{ required: true, message: '반납 상태를 선택해주세요' }]}
        >
          <Select>
            <Select.Option value="좋음">좋음</Select.Option>
            <Select.Option value="양호">양호</Select.Option>
            <Select.Option value="나쁨">나쁨</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            반납 처리
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  padding: 24px;
`;

export default ReturnProcessing; 