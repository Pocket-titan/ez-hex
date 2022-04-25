import React from "react";
import Toggle from "react-toggle";
import styled from "@emotion/styled";
import { css, useTheme } from "@emotion/react";
import { Moon, Sunny } from "@emotion-icons/ionicons-solid";
import "react-toggle/style.css";

const StyledToggle = styled(Toggle)`
  ${({ checked: dark }) =>
    dark
      ? css`
          .react-toggle-track {
            background-color: hsl(245, 15%, 31%);
          }

          &:hover .react-toggle-track {
            background-color: hsl(245, 15%, 31%) !important;
          }

          .react-toggle-thumb {
            border-color: hsl(245, 15%, 31%);
          }
        `
      : css`
          .react-toggle-track {
            background-color: hsl(0, 0%, 100%);
          }

          &:hover .react-toggle-track {
            background-color: hsl(0, 0%, 100%) !important;
          }

          .react-toggle-thumb {
            border-color: hsl(0, 0%, 95%);
            background-color: hsl(245, 15%, 31%);
          }
        `}

  &.react-toggle--focus .react-toggle-thumb,
  &.react-toggle:active .react-toggle-thumb {
    box-shadow: none !important;
  }
`;

const ThemeToggle = () => {
  const theme = useTheme();

  return (
    <StyledToggle
      className="ThemeToggle"
      onChange={({ target: { checked } }) => {
        window.__setPreferredTheme(checked ? "dark" : "light");
      }}
      checked={theme.isDark}
      icons={{
        checked: (
          <Moon
            style={{
              marginTop: -1,
              color: "hsl(0, 0%, 95%)",
            }}
          />
        ),
        unchecked: (
          <Sunny
            size={15}
            style={{
              marginTop: -2,
              color: "hsl(245, 15%, 31%)",
            }}
          />
        ),
      }}
    />
  );
};

export default ThemeToggle;
