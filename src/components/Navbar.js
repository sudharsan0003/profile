import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className='nav'>
      <Link to='/'>
        <h2>Home</h2>
      </Link>
      <h2>Crud</h2>
      <button onClick={() => navigate('/add')}>Add user</button>
    </div>
  );
};

export default Navbar;
