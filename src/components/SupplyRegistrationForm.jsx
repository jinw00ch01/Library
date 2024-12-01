import React from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const SupplyRegistrationForm = ({ staffId }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const formData = {
        ...values,
        Supply_date: values.Supply_date.format('YYYY-MM-DD'),
        Supply_price: parseFloat(values.Supply_price),
        staff_ID: staffId,
      };

      if (!formData.Department_ID || !formData.Supply_date || 
          !formData.Supply_price || !formData.Book_ID || !formData.staff_ID) {
        throw new Error('모든 필수 필드를 입력해주세요.');
      }

      console.log('Sending supply data:', formData);

      await adminService.registerSupply(formData);
      message.success('공급명세가 등록되었습니다!');
      form.resetFields();
    } catch (error) {
      console.error('Supply registration error:', error);
      message.error(error.message || '공급명세 등록에 실패했습니다.');
    }
  };

  return (
    <FormContainer>
      <h2>신규 공급명세 등록</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
          <DatePicker style={{ width: '100%' }} />
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
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

export default SupplyRegistrationForm; 