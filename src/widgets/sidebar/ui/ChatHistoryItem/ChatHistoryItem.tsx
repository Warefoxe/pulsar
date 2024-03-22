import { withObservables } from '@nozbe/watermelondb/react';
import { memo } from 'preact/compat';

import { chatsRepository } from '@/db';
import { ChatModel } from '@/db/chat';
import { classNames } from '@/shared/lib/func';
import { Button } from '@/shared/ui';
import { switchChat } from '@/widgets/chat';

import { DeleteChatIcon } from '../../assets/DeleteChatIcon.tsx';
import s from './ChatHistoryItem.module.scss';

interface Props {
  className?: string;
  chat?: ChatModel;
  isCurrent: boolean;
  id: string;
}

const ChatHistoryItem = (props: Props) => {
  const { className, chat, id, isCurrent } = props;

  const handleChatClick = () => switchChat(id);

  const handleDeleteChat = () => chatsRepository.remove(id);

  return (
    <Button
      variant="clear"
      active={isCurrent}
      onClick={handleChatClick}
      className={classNames(s.chatHistoryItem, [className])}
      suffixClassName={s.suffixWrapper}
      activeSuffix={
        <Button
          className={s.suffix}
          onClick={handleDeleteChat}
          variant="clear"
          icon={DeleteChatIcon}
          iconSize={18}
        />
      }
    >
      <span>{chat?.title}</span>
    </Button>
  );
};

const enhance = withObservables(['id'], ({ id }: Props) => ({
  chat: chatsRepository.chatsCollection.findAndObserve(id),
}));

// @ts-ignore
const EnhancedChatHistoryItem = memo(enhance(ChatHistoryItem));

export { EnhancedChatHistoryItem as ChatHistoryItem };
