import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import CreateGame from "components/CreateGame";
import type { BoardSize } from "types";
import { emit } from "ts/state";
import { useHistory } from "react-router-dom";
import { useLocalStorage } from "ts/hooks";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledPaper = styled(Paper)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0.75em;
  width: clamp(150px, 40%, 300px);
  padding: 1.25em;
`;

const simpleAnimals = [
  "fox",
  "cat",
  "dog",
  "cow",
  "mouse",
  "rat",
  "snake",
  "owl",
  "chicken",
  "rooster",
  "elephant",
  "giraffe",
  "lion",
  "zebra",
  "wolf",
  "bison",
  "buffalo",
  "bear",
  "puma",
  "tiger",
  "whale",
  "dolphin",
  "deer",
  "reindeer",
  "bunny",
  "rabbit",
  "sheep",
  "goat",
  "monkey",
  "gorilla",
  "bat",
  "bird",
  "fish",
  "salmon",
  "tuna",
  "trout",
];

const simpleColors = [
  "red",
  "blue",
  "green",
  "brown",
  "teal",
  "pink",
  "purple",
  "orange",
  "yellow",
  "cyan",
  "white",
  "black",
  "grey",
  "lime",
  "violet",
  "navy",
  "magenta",
  "olive",
  "beige",
];

function generateRandomGameName() {
  const randomName = uniqueNamesGenerator({
    dictionaries: [simpleColors, simpleAnimals],
    separator: "-",
  });
  return randomName;
}

const Modal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [name, setName] = useState<string>("");
  const [size, setSize] = useState<BoardSize>([11, 11]);
  const placeholder = useMemo(generateRandomGameName, []);
  const history = useHistory();

  return (
    <Dialog keepMounted open={open} onClose={onClose}>
      <DialogTitle>Create a new game</DialogTitle>
      <DialogContent>
        <CreateGame
          name={name}
          size={size}
          onNameChange={setName}
          onSizeChange={setSize}
          placeholder={placeholder}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={async () => {
            let response = await emit("ask_if_game_name_is_available", {
              game_id: name.length > 0 ? name : placeholder,
            });

            console.log(`response`, response);

            if (response.available) {
              let game = await emit("create_game", {
                game_id: response.game_id,
                board_size: size,
              });

              console.log("created game:", game);

              history.push(`/${game.game_id}`);
            } else {
            }
          }}
        >
          Create game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Home = () => {
  const [name, setName] = useLocalStorage("name", "");
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <Container>
      <StyledPaper elevation={3}>
        <TextField
          label="Enter your name"
          variant="filled"
          value={name}
          onChange={({ target: { value } }) => void setName(value)}
        />
        <Button variant="contained" color="primary" size="large" onClick={openModal}>
          Create game
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={() => {}}>
          Join game
        </Button>
      </StyledPaper>
      <Modal open={open} onClose={closeModal} />
    </Container>
  );
};

export default Home;
