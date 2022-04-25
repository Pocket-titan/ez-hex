import React, { useState } from "react";
import { Button, ButtonGroup, InputLabel, FilledInput } from "@mui/material";
import { withStyles } from "@mui/styles";
import type { BoardSize } from "types";

const StyledInput = withStyles({
  input: {
    padding: "12px 12px 10px",
  },
})(FilledInput);

const LowercaseButton = withStyles({
  label: {
    textTransform: "none",
  },
})(Button);

const sizes: BoardSize[] = [
  [9, 9],
  [11, 11],
  [13, 13],
];

const CreateGame = ({
  name,
  onNameChange,
  size,
  onSizeChange,
  placeholder,
}: {
  name: string;
  onNameChange?: (name: string) => void;
  size: BoardSize;
  onSizeChange: (size: BoardSize) => void;
  placeholder?: string;
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridGap: "0.8em",
        width: "100%",
      }}
    >
      <div>
        <InputLabel shrink>Game name</InputLabel>
        <StyledInput
          fullWidth
          placeholder={placeholder || undefined}
          value={name}
          onChange={({ target: { value } }) => {
            onNameChange && onNameChange(value.replaceAll(" ", "-"));
          }}
          disabled={!!name && !onNameChange}
        />
      </div>
      <div>
        <InputLabel shrink>Board size</InputLabel>
        <ButtonGroup
          color="primary"
          variant="contained"
          size="large"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${sizes.length}, 1fr)`,
          }}
        >
          {sizes.map(([x, y]) => {
            let selected = size[0] === x && size[1] === y;

            return (
              <LowercaseButton
                key={`${x},${y}`}
                color={selected ? "secondary" : "primary"}
                onClick={() => onSizeChange([x, y] as BoardSize)}
              >
                {x}x{y}
              </LowercaseButton>
            );
          })}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default CreateGame;
