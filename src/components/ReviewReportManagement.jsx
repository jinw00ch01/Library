import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { reviewService } from '../services/api';

const ReviewReportManagement = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReportedReviews();
  }, []);

  const fetchReportedReviews = async () => {
    try {
      const response = await reviewService.getReportedReviews();
      setReviews(response.reviews);
    } catch (error) {
      message.error('신고된 리뷰를 불러오는데 실패했습니다.');
    }
  };

  const handleBlind = async (reviewId, isBlinded) => {
    try {
      if (isBlinded) {
        // 블라인드 해제
        await reviewService.unblindReview(reviewId);
        message.success('블라인드가 해제되었습니다.');
      } else {
        // 블라인드 처리
        await reviewService.blindReview(reviewId);
        message.success('블라인드 처리되었습니다.');
      }
      fetchReportedReviews();
    } catch (error) {
      message.error('작업에 실패했습니다.');
    }
  };

  const columns = [
    {
      title: '리뷰 ID',
      dataIndex: 'Review_ID',
      key: 'Review_ID',
    },
    {
      title: '도서 ID',
      dataIndex: 'Book_ID',
      key: 'Book_ID',
    },
    {
      title: '고객 이름',
      dataIndex: 'Customer_name',
      key: 'Customer_name',
    },
    {
      title: '신고수',
      dataIndex: 'Review_issues',
      key: 'Review_issues',
    },
    {
      title: '블라인드 여부',
      dataIndex: 'isBlinded',
      key: 'isBlinded',
      render: (value) => (value ? '블라인드됨' : '정상'),
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Button
          type={record.isBlinded ? 'default' : 'danger'}
          onClick={() => handleBlind(record.Review_ID, record.isBlinded)}
        >
          {record.isBlinded ? '블라인드 해제' : '블라인드 처리'}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>신고된 리뷰 관리</h2>
      <Table columns={columns} dataSource={reviews} rowKey="Review_ID" />
    </div>
  );
};

export default ReviewReportManagement; 