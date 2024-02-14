import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setHoverPosition } from "../../app/slices/cursorSlice";

const Container = styled.div`
  flex: 1;
  margin: 0.05rem;
  background-color: ${(props) =>
    props.active[props.instrumentList.indexOf("drum")] &&
    props.visualizeInstrument[props.instrumentList.indexOf("drum")] === true
      ? pickActiveColor("drum")
      : props.inactiveColor};
  width: 3rem;
  height: 1.5rem;
  margin-bottom: ${(props) => (props.row % 7 === 0 ? 2 : 0)}rem;
  position: relative; /* Ensure the circle is positioned relative to this container */
  opacity: ${(props) => (props.playing ? 0.7 : 1)};

  &::after {
    content: ""; /* Create a pseudo-element for the circle */
    display: ${(props) =>
      props.active[props.instrumentList.indexOf("drum")] &&
      props.visualizeInstrument[props.instrumentList.indexOf("drum")] === true
        ? "none" // Hide the circle when the condition is satisfied
        : "block"};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${(props) =>
      props.row % 2 === 0
        ? "0.5rem"
        : "0.8rem"}; /* Adjust the width of the circle based on the condition */
    height: ${(props) =>
      props.row % 2 === 0
        ? "0.5rem"
        : "0.8rem"}; /* Adjust the height of the circle based on the condition */
    background-color: lightgray; /* Set the background color of the circle */
    border-radius: 50%; /* Make it a circle */
  }
`;

// const Container = styled.div`
//   flex: 1;
//   margin: 0.1rem;
//   background-color: ${(props) =>
//     props.active &&
//     props.visualizeInstrument[
//       props.instrumentList.indexOf(props.instrument)
//     ] === true
//       ? pickActiveColor(props.instrument)
//       : props.col % 8 < 4
//       ? "lightgray"
//       : props.inactiveColor};
//   width: 2rem;
//   height: 2rem;

//   margin-bottom: ${(props) => (props.row % 12 === 11 ? 0.2 : 0)}rem;
// `;

const pickActiveColor = (instrument) => {
  switch (instrument) {
    case "piano":
      return "#FFA1A1 50%";
    case "guitar":
      return "#4886FF 50%";
    case "drum":
      return "rgb(250 204 21)";
    default:
      return "black";
  }
};

const DrumBox = ({
  active: propActive,
  note,
  onClick,
  inactiveColor,
  activeColor,
  setActiveBoxes,
  visualizeInstrument,
  col,
  row,
  isSnapshot,
  playing,
  containerRef,
}) => {
  const dispatch = useDispatch();

  const [active, setActive] = useState([false, false, false]);
  const innerContent = useSelector((state) => state.innerContent.innerContent);
  const instrumentList = ["piano", "guitar", "drum"];
  const workspaceNotes = useSelector(
    (state) => state.innerContent.workspaceNotes
  );
  const snapshotNotes = useSelector(
    (state) => state.innerContent.snapshotNotes
  );

  // 처음 마운트 시 전역상태의 노트정보 반영
  useEffect(() => {
    let activeNotes;

    if (isSnapshot) {
      activeNotes = snapshotNotes.filter((n) => n.x === col && n.y === row);
    } else {
      activeNotes = workspaceNotes.filter((n) => n.x === col && n.y === row);
    }

    // 해당하는 노트가 있으면 상태 업데이트
    activeNotes.forEach((activeNote) => {
      setActive((prevActive) => {
        const instrumentIndex = instrumentList.indexOf(activeNote.instrument);
        const newActive = [...prevActive];
        newActive[instrumentIndex] = true;
        return newActive;
      });
      setActiveBoxes(row, activeNote.instrument, true);
    });
  }, []);

  useEffect(() => {
    const instrumentIndex = instrumentList.indexOf(innerContent.instrument);
    // Check if x and y match col and row
    if (
      innerContent.x === col &&
      innerContent.y === row &&
      !active[instrumentIndex]
    ) {
      const newActive = [...active];
      newActive[instrumentIndex] = !newActive[instrumentIndex];
      setActive(newActive);
      setActiveBoxes(row, innerContent.instrument, true);
    } else if (
      innerContent.x === col &&
      innerContent.y === row &&
      active[instrumentIndex]
    ) {
      const newActive = [...active];
      newActive[instrumentIndex] = !newActive[instrumentIndex];
      setActive(newActive);
      setActiveBoxes(row, innerContent.instrument, false);
    }
  }, [innerContent]);

  // for 마우스 커서 공유
  const boxRef = useRef(null);

  const handleMouseOver = (e) => {
    // BeatBox와 BeatGrid의 절대 위치 추출
    const boxRect = boxRef.current.getBoundingClientRect();
    const gridRect = containerRef.current.getBoundingClientRect();

    // BeatGrid 내의 스크롤 위치 고려
    const scrollLeft = containerRef.current.scrollLeft;
    const scrollTop = containerRef.current.scrollTop;

    // BeatBox 내부에서의 상대 좌표 계산
    const mouseX = e.clientX - boxRect.left;
    const mouseY = e.clientY - boxRect.top;

    // 스크롤 위치 + 박스 내부의 위치를 반영한 마우스 좌표 계산
    const relativeX = boxRect.left + scrollLeft + mouseX - gridRect.left;
    const relativeY = boxRect.top + scrollTop + mouseY - gridRect.top;

    dispatch(setHoverPosition({ i: col, j: row, x: relativeX, y: relativeY }));
  };

  return (
    <Container
      ref={boxRef}
      active={active}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      onClick={() => (onClick === null ? null : onClick())}
      visualizeInstrument={visualizeInstrument}
      instrumentList={instrumentList}
      row={row}
      playing={playing}
      onMouseOver={handleMouseOver}
    />
  );
};

export default DrumBox;
