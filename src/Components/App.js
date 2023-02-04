import '../App.css';
import Start from './Start';
import PostView from './PostView';
import NoPage from './NoPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="main" element={<PostView />} />
          <Route path="*" element={<NoPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
