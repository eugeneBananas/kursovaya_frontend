import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: '#282c34',
      color: 'white',
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <h2 style={{ margin: 0 }}>Курс Плюс</h2>
        </Link>
      </div>
      <nav>
        <Link to="/" style={{ margin: '0 16px', color: 'white', textDecoration: 'none' }}>Главная</Link>
        <Link to="/courses" style={{ margin: '0 16px', color: 'white', textDecoration: 'none' }}>Курсы</Link>
        <Link to="/about" style={{ margin: '0 16px', color: 'white', textDecoration: 'none' }}>О студенте</Link>
      </nav>
    </header>
  );
}

export default Header;
