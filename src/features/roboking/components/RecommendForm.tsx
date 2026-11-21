import { Button, Checkbox, Input, Typography, message } from 'antd';
import { useState } from 'react';

import { friendsList } from '../api/friendsList';
import { submitRecommend } from '../api/recommendApi';

import '../roboking.css';

const MAX_SELECTABLE_FRIENDS = 3;

const { Title, Paragraph } = Typography;

export function RecommendForm() {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleFriend = (key: number) => {
    setSelectedKeys((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_SELECTABLE_FRIENDS) {
        message.warning(
          `친구는 최대 ${MAX_SELECTABLE_FRIENDS}명까지 선택할 수 있습니다.`,
        );
        return prev;
      }
      return [...prev, key];
    });
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      message.error('이름과 이메일을 입력해주세요.');
      return;
    }
    submitRecommend({ name, email, friendKeys: selectedKeys }).then(() =>
      setSubmitted(true),
    );
  };

  if (submitted) {
    return (
      <div className="roboking-recommend">
        <Title level={3} className="roboking-recommend-title">
          추천이 완료되었습니다!
        </Title>
      </div>
    );
  }

  return (
    <div className="roboking-recommend">
      <Title level={3} className="roboking-recommend-title">
        친구에게 추천하기
      </Title>
      <Paragraph className="roboking-recommend-text">
        친구를 최대 {MAX_SELECTABLE_FRIENDS}명까지 선택하세요.
      </Paragraph>
      <div className="roboking-recommend-friend-list">
        {friendsList.friend.map((friend) => (
          <Checkbox
            key={friend.key}
            checked={selectedKeys.includes(friend.key)}
            onChange={() => toggleFriend(friend.key)}
            className="roboking-recommend-friend-item"
          >
            <img
              src={friend.smallThumb}
              alt={friend.id}
              width={43}
              height={44}
            />
            <span>{friend.id}</span>
          </Checkbox>
        ))}
      </div>
      <Input
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="roboking-recommend-input"
      />
      <Input
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="roboking-recommend-input"
      />
      <Button type="primary" onClick={handleSubmit}>
        추천 보내기
      </Button>
    </div>
  );
}
