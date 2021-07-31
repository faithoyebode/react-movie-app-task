import TopBar from './components/TopBar';
import Hero from './components/Hero';
import SearchResults from './components/SearchResults';
import './App.css';


const App = () => {
  return (
    <div className="App">
      <TopBar />
      <Hero />
      <SearchResults />
    </div>
  );
}

export default App;
