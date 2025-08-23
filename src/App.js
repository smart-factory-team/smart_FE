import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { AppRouter } from './router';

// 전역 스타일
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Roboto", Helvetica, sans-serif;
    background-color: #ffffff;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AppRouter />
    </>
  );
}

export default App;