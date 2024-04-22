import { Collection, Database, Q } from '@nozbe/watermelondb';

import { assignValues, serialize } from '@/shared/lib/func';

import { ChatModel } from './chat.model.ts';
import { chatsTable } from './chat.schema.ts';

export interface ChatMsg {
  id: Id;
  text: string;
  isUser?: boolean;
  user?: { name: string };
  assistant?: {
    userMsgId: Id;
    input: string;
  };
}

export interface Chat {
  id: Id;
  title: string;
  messages: ChatMsg[];
  isPinned: boolean;
  isArchived: boolean;
  model: string;
  createdAt: number;
  updatedAt: number;
}

interface ListParams {
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  search?: string;
}

export class ChatsRepository {
  chatsCollection: Collection<ChatModel>;

  constructor(private db: Database) {
    this.chatsCollection = this.db.get(chatsTable.name);
  }

  async getById(id: Id): Promise<Chat> {
    return this.serialize(await this.chatsCollection.find(id));
  }

  async getAll(params?: ListParams): Promise<Chat[]> {
    const { limit = 10, offset = 0, order = 'desc', search } = params || {};

    const query: Q.Clause[] = [
      Q.where(chatsTable.cols.isArchived, Q.eq('false')),
      Q.sortBy(chatsTable.cols.updatedAt, Q[order]),
      Q.skip(offset),
      Q.take(limit),
    ];

    if (search) {
      query.push(Q.where(chatsTable.cols.title, Q.like(`%${search}%`)));
    }

    return this.mapSerialize(await this.chatsCollection.query(...query).fetch());
  }

  async create(data: Dto<Chat>): Promise<Chat> {
    const newChat = await this.db.write(() =>
      this.chatsCollection.create((post) => assignValues(post, data))
    );

    return this.serialize(newChat);
  }

  async update(id: Id, data: UpdateDto<Chat>): Promise<Chat> {
    const chat = await this.chatsCollection.find(id);

    try {
      const updatedChat = await this.db.write(() =>
        chat.update((chat) => {
          assignValues(chat, data);
        })
      );

      return this.serialize(updatedChat);
    } catch (e) {
      return chat;
    }
  }

  async remove(id: Id): Promise<void> {
    const chat = await this.chatsCollection.find(id);
    await this.db.write(() => chat.destroyPermanently());
  }

  private serialize(chat: ChatModel): Chat {
    return serialize(chat, [
      'id',
      'title',
      'messages',
      'model',
      'createdAt',
      'updatedAt',
      'isArchived',
      'isPinned',
    ]);
  }

  private mapSerialize(chats: ChatModel[]): Chat[] {
    return chats.map(this.serialize);
  }
}
