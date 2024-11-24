import React from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';

const MediaRegistrationForm = ({ onClose, staffId }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const formData = {
        ...values,
        media_date: values.media_date?.format('YYYY-MM-DD'),
        staff_ID: staffId
      };
      await adminService.registerMedia(formData);
      message.success('영상 자료가 등록되었습니다!');
      onClose();
    } catch (error) {
      message.error('영상 자료 등록에 실패했습니다.');
    }
  };

  return (
    <FormContainer>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="media_link"
          label="미디어 링크"
          rules={[{ required: true, message: '미디어 링크를 입력해주세요' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Book_ID"
          label="도서 ID"
          rules={[{ required: true, message: '도서 ID를 입력해주세요' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item name="media_date" label="등록일">
          <DatePicker style={{ width: '100%' }} />
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

export default MediaRegistrationForm; 