import React, { useEffect, useState } from 'react'
import { Button, Text, Box, Grid, GridItem, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Stack, RadioGroup, Radio } from '@chakra-ui/react';
import { MdBuild, MdOutlineRestartAlt } from "react-icons/md"
import { MinesweeperTile } from './MinesweeperTile';
import { Point, TileDetails, Difficulty, difficultyDetails } from './types';

enum GameState {
  IN_PROGRESS = "😀",
  USER_WON = "😎",
  USER_LOST = "😵",
}

// TODO -- when you click a bomb, it shows more than 1 bomb sometimes
// TODO -- show flags that are not correct

const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState(Difficulty.BEGINNER)
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [gameState, setGameState] = useState(GameState.IN_PROGRESS);
  const [tiles, setTiles] = useState(initializeBoard(difficulty));
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setGameState(GameState.IN_PROGRESS);
    setTiles(initializeBoard(difficulty));
  }, [difficulty]);

  const numMines = difficultyDetails.get(difficulty)!.numMines;

  const handleRestartGameClick = () => {
    setGameState(GameState.IN_PROGRESS);
    setTiles(initializeBoard(difficulty));
  }

  const handleToggleFlag = (point: Point) => {
    if (gameState !== GameState.IN_PROGRESS) return;
    if (tiles.get(point.toString())!.revealed) return;

    const tilesArr: [string, TileDetails][] = Array.from(tiles.entries()).map(([point_str, tile]) => {
      if (point.toString() !== point_str) return [point_str, tile]
      const newTileDetails: TileDetails = {
        ...tile,
        flagged: !tile.flagged,
      }
      return [point_str, newTileDetails];
    })

    setTiles(new Map(tilesArr));
  }

  const handleRevealTile = (point: Point) => {
    if (gameState !== GameState.IN_PROGRESS) return;
    const currTile = tiles.get(point.toString())!
    if (currTile.revealed) return;
    if (currTile.flagged) return;

    const tilesArr: [string, TileDetails][] = Array.from(tiles.entries()).map(([point_str, tile]) => {
      if (point.toString() !== point_str) return [point_str, tile]
      const newTileDetails: TileDetails = {
        ...tile,
        revealed: true,
      }
      return [point_str, newTileDetails];
    })

    const updatedTiles = new Map(tilesArr);

    // if the tile has no mine neighbours, find area of no mines
    if (currTile.numNeighborMines === 0) {
      const pointsToReveal: Point[] = findPointsToReveal(updatedTiles, point)
      pointsToReveal.forEach(p => {
        const tile = updatedTiles.get(p.toString())!
        const newTileDetails: TileDetails = {
          ...tile,
          revealed: true
        }
        updatedTiles.set(p.toString(), newTileDetails);
      });
    }

    setTiles(updatedTiles);

    // check game conditions
    if (currTile.mine) {
      setGameState(GameState.USER_LOST);
      return;
    }
    const numTilesToReveal = Array.from(updatedTiles.entries()).filter(([point_str, tile]) => !tile.revealed).length
    if (numTilesToReveal === numMines) setGameState(GameState.USER_WON);
  }

  const handleChangeSelectedDifficulty = (nextValue: string) => {
    const updatedDifficulty = nextValue as Difficulty;
    setSelectedDifficulty(updatedDifficulty);
  }

  const handleCloseChangeDifficultyModal = () => {
    onClose();
    if (difficulty !== selectedDifficulty) {
      setDifficulty(selectedDifficulty)
    }
  }

  const board = Array.from(tiles.entries()).map(([point_str, tile]) => {
    const point = Point.fromString(point_str)

    return (
      <GridItem gridRow={point.row + 1} gridColumn={point.col + 1} >
        <MinesweeperTile
          key={point.toString()}
          point={point}
          tile={tile}
          revealTile={handleRevealTile}
          toggleFlag={handleToggleFlag}
        />
      </GridItem>
    );
  });

  return (
    <>
      <Box p={5}>
        <Text fontSize="2xl" mb={4}>Minesweeper</Text>
        <Text mb={4} fontSize={24}>{gameState}</Text>

        <Stack direction='row' spacing={4}>
          <Button colorScheme="green" onClick={onOpen} mb={4} leftIcon={<MdBuild />}>Change Difficulty</Button>
          <Button colorScheme="blue" onClick={handleRestartGameClick} mb={4} leftIcon={<MdOutlineRestartAlt />}>Restart Game</Button>
        </Stack>

        <Grid templateColumns="repeat(auto-fill, 40px)" gap={0} autoRows="repeat(auto-fill, 40px)">
          {board}
        </Grid>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Difficulty</ModalHeader>
          <ModalCloseButton onClick={handleRestartGameClick} />
          <ModalBody>
            <RadioGroup value={selectedDifficulty} onChange={handleChangeSelectedDifficulty}>
              <Stack direction='row'>
                <Radio value={Difficulty.BEGINNER}>Beginner</Radio>
                <Radio value={Difficulty.INTERMEDIATE}>Intermediate</Radio>
                <Radio value={Difficulty.EXPERT}>Expert</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCloseChangeDifficultyModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const initializeBoard = (difficulty: Difficulty): Map<string, TileDetails> => {
  const difficultyDetail = difficultyDetails.get(difficulty)!;
  const rows = difficultyDetail.rows;
  const cols = difficultyDetail.cols;
  const numMines = difficultyDetail.numMines;

  const tiles: Map<string, TileDetails> = new Map();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const location = new Point(row, col)
      const tileDetails: TileDetails = {
        mine: false,
        revealed: false,
        flagged: false,
        numNeighborMines: 0,
      }
      tiles.set(location.toString(), tileDetails);
    }
  }

  // set mine locations
  const tileLocations = Array.from(tiles.keys());
  const mineLocations = tileLocations.sort(() => 0.5 - Math.random()).slice(0, numMines);

  // update board with mines
  mineLocations.forEach(point_str => {
    const point = Point.fromString(point_str);
    // add mine
    const updatedMine: TileDetails = {
      ...tiles.get(point_str)!,
      mine: true,
      numNeighborMines: -1,
    }
    tiles.set(point_str, updatedMine);

    // go through mine neighbours and update num mines hint
    point.adjacent8().forEach(adjP => {
      const adjacentTile = tiles.get(adjP.toString());
      if (adjacentTile === undefined) return;
      const updatedTileDetails: TileDetails = {
        ...adjacentTile,
        numNeighborMines: adjacentTile.numNeighborMines + 1,
      }
      tiles.set(adjP.toString(), updatedTileDetails);
    })
  })

  return tiles;
}


const findPointsToReveal = (tiles: Map<string, TileDetails>, point: Point): Point[] => {
  const currTile = tiles.get(point.toString())!
  if (currTile.numNeighborMines !== 0) return []

  // find all zero neighbour points connected to point
  let zeroNeighbourKeys = new Set<string>();
  let searchedKeys = new Set<string>();
  let toSearchKeys = [point.toString()]

  while (toSearchKeys.length > 0) {
    const p_key = toSearchKeys.pop()!;
    searchedKeys.add(p_key);
    const s = tiles.get(p_key)!
    if (s.numNeighborMines === 0) zeroNeighbourKeys.add(p_key);

    Point.fromString(p_key).adjacent8().forEach(adjP => {
      const adjPStr = adjP.toString();
      const adjacentTile = tiles.get(adjPStr);
      if (adjacentTile === undefined) return
      if (adjacentTile.flagged === true) return
      if (adjacentTile.numNeighborMines !== 0) return
      if (searchedKeys.has(adjPStr)) return
      toSearchKeys.push(adjPStr);
    })
  }

  // get all adjacent points to zeroNeighbourKeys
  const frontierPoints: Set<string> = new Set();
  zeroNeighbourKeys.forEach(key => {
    Point.fromString(key).adjacent8().forEach(frontierP => {
      const s = tiles.get(frontierP.toString());
      if (s === undefined) return
      if (s.flagged === true) return
      frontierPoints.add(frontierP.toString())
    })
  })

  const allKeysToReveal = Array.from(frontierPoints).concat(Array.from(zeroNeighbourKeys));

  return allKeysToReveal.map(pStr => Point.fromString(pStr));
}

export default Minesweeper;
