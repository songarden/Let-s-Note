import React, { useState } from 'react';
import styled from 'styled-components';


const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;  
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000; // 높은 z-index 값 설정
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;  
  padding: 20px;
  border-radius: 10px;  
`;

const CreateSpaceModal = ({ onClose, onPublish }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    return (
        <ModalBackground onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <h2>작업실 생성하기</h2>
                <div>
                    작업실 이름을 정해주세요<br/>
                    <input
                        type="text"
                        placeholder="작업실 이름"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div> <br/>
                <div>
                    작업실 설명(선택)<br/>
                    <textarea
                        placeholder="작업실 설명"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button onClick={() => onPublish(title, description)}>생성하기</button>
            </ModalContent>
        </ModalBackground>
    );
};

export default CreateSpaceModal;
