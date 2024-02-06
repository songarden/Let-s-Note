import React, { Component } from "react";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import BeatColumn from "../BeatColumn/BeatColumn";
import VerticalPiano from "../WorkSpace/Piano";
import BeatChange from "../BeatControls/BeatChange";

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  background-color: ${(props) => props.background};
  border: 0.5px solid ${(props) => props.background};
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  border-radius: 10px;
`;

const LeftPanel = tw.div`
  flex-1
  flex
  flex-row
  w-[4%]
  h-full
  sticky
  left-0
  z-10
`;

const RightPanel = tw.div`
  flex-1
  w-[94%]
  h-60
  flex
  flex-row
`;

const BeatChangeContainer = tw.div`
  sticky
  top-0
  flex
  flex-col
  items-center
  justify-center
  bg-white
  ml-1
  mt-0.5
  h-full
`;

const ButtonContainer = tw.div`
  flex
  w-20
  items-center
  justify-center
`;

class BeatGrid extends Component {
  handleBoxClick = (row, column) => {
    console.log("clicked spaceId:", this.props.spaceId);
    const instrument = this.props.synth.activeInstrument;
    this.props.sendCoordinate(instrument, row, column, this.props.spaceId);
  };

  playBeat = (time) => {
    const { columns, count } = this.props;
    const activeBeat = count % columns;
    if (this.refs[activeBeat]) {
      this.refs[activeBeat].playBeat(time);
    }
  };

  trigger = (time) => {
    this.props.addCount();

    this.playBeat(time);
  };

  renderBeatColumns = () => {
    const {
      scale,
      drumScale,
      synth,
      columns,
      background,
      foreground,
      visualizeInstrument,
      count,
      changeColumns,
    } = this.props;
    const cols = [];
    for (let i = 0; i < columns; i++) {
      cols.push(
        <BeatColumn
          background={background}
          foreground={foreground}
          ref={i.toString(10)}
          key={i.toString(10)}
          id={i}
          scale={scale}
          drumScale={drumScale}
          playing={count % columns === i}
          synth={synth}
          onClick={this.handleBoxClick}
          visualizeInstrument={visualizeInstrument}
          isSnapshot={this.props.isSnapshot}
        />
      );
    }
    cols.push(
      <BeatChangeContainer>
        <ButtonContainer>
          <BeatChange mode="add" onClick={() => changeColumns(8)} />
        </ButtonContainer>
        <ButtonContainer>
          <BeatChange mode="subtract" onClick={() => changeColumns(-8)} />
        </ButtonContainer>
      </BeatChangeContainer>
    );
    return cols;
  };

  render() {
    const { background } = this.props;
    return (
      <Container background={background}>
        <LeftPanel>
          <VerticalPiano
            sendLoop={this.props.sendLoop}
            spaceLength={this.props.columns}
          />
        </LeftPanel>
        <RightPanel>{this.renderBeatColumns()}</RightPanel>
      </Container>
    );
  }
}

export default BeatGrid;
