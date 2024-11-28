import React from 'react';
import { Form, Input, Button, message } from 'antd';
import styled from 'styled-components';
import { loanService } from '../services/api';

const LoanProcessing = ({ staffId }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await loanService.processLoan({ ...values, staff_ID: staffId });
      message.success('대출 처리가 완료되었습니다.');
      form.resetFields();
    } catch (error) {
      message.error('대출 처리에 실패하였습니다.');
    }
  };

  return (
    <FormContainer>
      <h2>대출 처리</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="Customer_ID"
          label="고객 ID"
          rules={[{ required: true, message: '고객 ID를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Book_ID"
          label="도서 ID"
          rules={[{ required: true, message: '도서 ID를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            대출 처리
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  padding: 24px;
`;

export default LoanProcessing; 