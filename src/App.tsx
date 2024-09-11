import './App.css';
// src/App.tsx
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="hidden lg:flex lg:gap-x-12">
      <Navbar />
      {/* Otros componentes */}
    </div>
  );
}

export default App;
