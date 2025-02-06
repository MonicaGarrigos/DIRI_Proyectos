import { Route, Routes } from 'react-router-dom';


const Home = () => {
  return (
    <div className='main-content'>
      <h1>Home</h1>
      <Routes>
        <Route path="faq" element={<div>HOMEEEE</div>} />
      </Routes>
    </div>
  );
};

export default Home;