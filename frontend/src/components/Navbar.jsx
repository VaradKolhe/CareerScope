import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#eee' }}>
      <Link to="/"><strong>CareerPath AI</strong></Link>
      <Link to="/quiz-u10">Start U10 Quiz</Link>
      <div style={{ marginLeft: 'auto' }}>
        <Link to="/profile">My Profile</Link> | <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};
export default Navbar;