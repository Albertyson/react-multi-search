import React from 'react';
import SearchEngine from './search_engine.jsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container } from '@material-ui/core';
const App = (props)=>{
  return (
    <div className="app-main-container">
      <CssBaseline/>
      <Container maxWidth="xl">
        <SearchEngine/>
      </Container>
    </div>
  );
}
export default App;