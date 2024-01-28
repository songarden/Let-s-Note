import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkSpaceContainer from "../containers/workplace/WorkSpaceContainer";
import WebSocketContainer from "../containers/WebSocket/WebSocketContainer";
import ChatContainer from "../containers/workplace/ChatContainer";

const WorkPlacePage = () => {
  const { spaceId } = useParams(); // 현재 spaceId 얻기

  return (
    <>
      <WebSocketContainer spaceId={spaceId} />
      <WorkSpaceContainer />
      <ChatContainer spaceId={spaceId} />
    </>
  );
};

export default WorkPlacePage;