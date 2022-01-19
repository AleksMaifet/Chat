import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';

import { io } from 'socket.io-client';

import style from 'test_style.module.css';
import { ReturnComponentType } from 'types';

const socket = io('https://chat-online-socket.herokuapp.com', {
  withCredentials: true,
});
export const App = (): ReturnComponentType => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');

  const messageRef = useRef<HTMLDivElement>(null);

  const onClick = (): void => {
    socket.emit('new-message', message);
    setMessage('');
  };
  const onClickEvent = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter') onClick();
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    socket.on('new-messages-pushed', (array: []) => {
      setMessages(array);
    });
  }, []);

  useEffect(() => {
    socket.on('new-messages-sent', (arrayNew: any) => {
      setMessages(arrayNew);
    });
  }, []);

  return (
    <div className={style.container}>
      <div>
        <div className={style.container_Wrapper}>
          {messages.map(el => (
            <div
              className={style.container_Wrapper_MessageBlock}
              key={`${el.id}${el.name}`}
            >
              <div className={style.container_Wrapper_MessageBlock_UserName}>
                {el.user.name}:
              </div>
              <div>{el.message}</div>
              <div ref={messageRef} />
            </div>
          ))}
        </div>
        <div>
          <div>
            <textarea
              onKeyPress={e => onClickEvent(e)}
              value={message}
              onChange={e => setMessage(e.currentTarget.value)}
            />
          </div>
          <div>
            <button onClick={onClick} type="button">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
