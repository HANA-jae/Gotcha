
import { Link } from 'react-router-dom';
import { Game } from '../types';

// Hardcoded games data
const GAMES: Game[] = [
  {
    id: 1,
    name: 'BATTLEGROUNDS',
    slug: 'battlegrounds',
    description: '배틀그라운드 무기 스킨 및 의상 확률을 확인하세요',
  },
];

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">GOTCHA</h1>
          <p className="hero-subtitle">확률확인시스템</p>
          <p className="hero-description">다양한 게임의 확률을 확인하고 뽑기를 시뮬레이션하세요</p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="games-section">
        <h2 className="section-title">게임 선택</h2>
        <div className="games-grid">
          {GAMES.map((game) => (
            <Link to={`/game/${game.slug}`} key={game.id} className="game-card-link">
              <div className="game-card">
                <div className="game-card-image">
                  <div className="game-image-placeholder">
                    {game.slug === 'battlegrounds' && (
                      <div className="bg-gradient pubg-logo">PUBG</div>
                    )}
                  </div>
                </div>
                <div className="game-card-content">
                  <h3 className="game-name">{game.name}</h3>
                  <p className="game-description">{game.description}</p>
                  <button className="view-button">확률 확인하기</button>
                </div>
              </div>
            </Link>
          ))}

          {/* Coming Soon Cards */}
          <div className="game-card coming-soon">
            <div className="game-card-image">
              <div className="game-image-placeholder">
                <span className="coming-badge">준비 중</span>
              </div>
            </div>
            <div className="game-card-content">
              <h3 className="game-name">게임 2</h3>
              <p className="game-description">새로운 게임이 곧 추가됩니다</p>
            </div>
          </div>

          <div className="game-card coming-soon">
            <div className="game-card-image">
              <div className="game-image-placeholder">
                <span className="coming-badge">준비 중</span>
              </div>
            </div>
            <div className="game-card-content">
              <h3 className="game-name">게임 3</h3>
              <p className="game-description">새로운 게임이 곧 추가됩니다</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
