import { useEffect } from 'preact/hooks';
import { useUnit } from 'effector-react';
import { classNames } from '@/shared/lib/func';
import s from './Chat.module.scss';
import { ChatMsgList } from '../ChatMsgList/ChatMsgList';
import { ChatInput } from '../ChatInput/ChatInput';
import { Precaution } from '../Precaution/Precaution';
import { chatsRepository } from '@/db';
import { $chatId, startNewChat } from '../../model/chat';

interface Props {
  className?: string;
}

export const Chat = (props: Props) => {
  const { className } = props;
  const chatId = useUnit($chatId);

  useEffect(() => {
    chatsRepository.getAll().then(console.log);
    if (chatId) return;
    startNewChat();
  }, [chatId]);

  return (
    <div className={classNames(s.chat, [className])}>
      <ChatMsgList className={s.msgList} />
      <ChatInput className={s.chatInput} />
      <Precaution />
    </div>
  );
};
