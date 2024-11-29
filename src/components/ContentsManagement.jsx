import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import styled from 'styled-components';
import { adminService } from '../services/api';
import dayjs from 'dayjs';

const ContentsManagement = () => {
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await adminService.getContents();
      setContents(response.contents);
    } catch (error) {
      console.error('콘텐츠 목록 조회 실패:', error);
      message.error('콘텐츠 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleDetail = (content) => {
    setSelectedContent(content);
    setIsModalVisible(true);
  };

  const handleEdit = () => {
    form.setFieldsValue({
      ...selectedContent,
      Contents_date: dayjs(selectedContent.Contents_date)
    });
    setIsEditMode(true);
  };

  const handleUpdate = async (values) => {
    try {
      const updatedData = {
        ...values,
        Contents_date: values.Contents_date.format('YYYY-MM-DD')
      };
      await adminService.updateContents(selectedContent.Contents_ID, updatedData);
      message.success('콘텐츠 정보가 수정되었습니다.');
      setIsEditMode(false);
      setIsModalVisible(false);
      fetchContents();
    } catch (error) {
      console.error('콘텐츠 수정 실패:', error);
      message.error('콘텐츠 정보 수정에 실패하였습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteContents(selectedContent.Contents_ID);
      message.success('콘텐츠가 삭제되었습니다.');
      setIsModalVisible(false);
      fetchContents();
    } catch (error) {
      console.error('콘텐츠 삭제 실패:', error);
      message.error('콘텐츠 삭제에 실패하였습니다.');
    }
  };

  const columns = [
    {
      title: '콘텐츠 ID',
      dataIndex: 'Contents_ID',
      key: 'Contents_ID',
    },
    {
      title: '콘텐츠명',
      dataIndex: 'Contents_name',
      key: 'Contents_name',
    },
    {
      title: '상태',
      dataIndex: 'Contents_state',
      key: 'Contents_state',
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
      <h2>콘텐츠 관리</h2>
      <Table columns={columns} dataSource={contents} rowKey="Contents_ID" />
      <Modal
        title="콘텐츠 상세 정보"
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
            <p><strong>콘텐츠 ID:</strong> {selectedContent?.Contents_ID}</p>
            <p><strong>도서 ID:</strong> {selectedContent?.Book_ID}</p>
            <p><strong>유형:</strong> {selectedContent?.Contents_type}</p>
            <p><strong>콘텐츠명:</strong> {selectedContent?.Contents_name}</p>
            <p><strong>주최자:</strong> {selectedContent?.Contents_author}</p>
            <p><strong>등록일:</strong> {selectedContent?.Contents_date ? dayjs(selectedContent.Contents_date).format('YYYY-MM-DD HH:mm:ss') : ''}</p>
            <p><strong>상태:</strong> {selectedContent?.Contents_state}</p>
            <Button type="primary" onClick={handleEdit}>콘텐츠 정보 수정</Button>
            <Button type="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>콘텐츠 정보 삭제</Button>
          </>
        ) : (
          <Form form={form} onFinish={handleUpdate} layout="vertical">
            <Form.Item
              name="Book_ID"
              label="도서 ID"
              rules={[{ required: true, message: '도서 ID를 입력해주세요' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="Contents_type"
              label="유형"
              rules={[{ required: true, message: '콘텐츠 유형을 선택해주세요' }]}
            >
              <Select>
                <Select.Option value="정기 행사">정기 행사</Select.Option>
                <Select.Option value="특별 행사">특별 행사</Select.Option>
                <Select.Option value="독서 프로그램">독서 프로그램</Select.Option>
                <Select.Option value="참여형 이벤트">참여형 이벤트</Select.Option>
                <Select.Option value="기타">기타</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="Contents_name"
              label="콘텐츠명"
              rules={[{ required: true, message: '콘텐츠명을 입력해주세요' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Contents_author"
              label="주최자"
              rules={[{ required: true, message: '주최자를 입력해주세요' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Contents_date"
              label="등록일"
              rules={[{ required: true, message: '등록일을 선택해주세요' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="Contents_state"
              label="상태"
              rules={[{ required: true, message: '상태를 선택해주세요' }]}
            >
              <Select>
                <Select.Option value="진행전">진행전</Select.Option>
                <Select.Option value="진행중">진행중</Select.Option>
                <Select.Option value="진행 완료">진행 완료</Select.Option>
                <Select.Option value="취소됨">취소됨</Select.Option>
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

export default ContentsManagement; 