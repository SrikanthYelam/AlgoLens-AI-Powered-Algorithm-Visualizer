import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AlgorithmPage } from './pages/AlgorithmPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/algorithms/:id" element={<AlgorithmPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
