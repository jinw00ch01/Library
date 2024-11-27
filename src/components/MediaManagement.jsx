import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';
import dayjs from 'dayjs';

const MediaManagement = () => {
  const [medias, setMedias] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    try {
      const response = await adminService.getMedias();
      setMedias(response.medias);
    } catch (error) {
      console.error('영상자료 목록 조회 실패:', error);
      message.error('영상자료 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleDetail = (media) => {
    setSelectedMedia(media);
    setIsModalVisible(true);
  };

  const handleEdit = () => {
    form.setFieldsValue({
      ...selectedMedia,
      media_date: dayjs(selectedMedia.media_date)
    });
    setIsEditMode(true);
  };

  const handleUpdate = async (values) => {
    try {
      const updatedData = {
        ...values,
        media_date: values.media_date.format('YYYY-MM-DD')
      };
      await adminService.updateMedia(selectedMedia.media_ID, updatedData);
      message.success('영상자료 정보가 수정되었습니다.');
      setIsEditMode(false);
      setIsModalVisible(false);
      fetchMedias();
    } catch (error) {
      console.error('영상자료 수정 실패:', error);
      message.error('영상자료 정보 수정에 실패하였습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteMedia(selectedMedia.media_ID);
      message.success('영상자료가 삭제되었습니다.');
      setIsModalVisible(false);
      fetchMedias();
    } catch (error) {
      console.error('영상자료 삭제 실패:', error);
      message.error('영상자료 삭제에 실패하였습니다.');
    }
  };

  const columns = [
    {
      title: '영상자료 ID',
      dataIndex: 'media_ID',
      key: 'media_ID',
    },
    {
      title: '미디어 링크',
      dataIndex: 'media_link',
      key: 'media_link',
    },
    {
      title: '도서 ID',
      dataIndex: 'Book_ID',
      key: 'Book_ID',
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
      <h2>영상자료 관리</h2>
      <Table columns={columns} dataSource={medias} rowKey="media_ID" />
      <Modal
        title="영상자료 상세 정보"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditMode(false);
          form.resetFields();
        }}
        footer={null}
      >
        {!isEditMode ? (
          <>
            <p><strong>영상자료 ID:</strong> {selectedMedia?.media_ID}</p>
            <p><strong>미디어 링크:</strong> {selectedMedia?.media_link}</p>
            <p><strong>도서 ID:</strong> {selectedMedia?.Book_ID}</p>
            <p><strong>등록일:</strong> {selectedMedia?.media_date}</p>
            <p><strong>직원 ID:</strong> {selectedMedia?.staff_ID}</p>
            <Button type="primary" onClick={handleEdit}>영상자료 정보 수정</Button>
            <Button type="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>영상자료 정보 삭제</Button>
          </>
        ) : (
          <Form form={form} onFinish={handleUpdate} layout="vertical">
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
            <Form.Item
              name="media_date"
              label="등록일"
              rules={[{ required: true, message: '등록일을 선택해주세요' }]}
            >
              <DatePicker style={{ width: '100%' }} />
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

export default MediaManagement; 