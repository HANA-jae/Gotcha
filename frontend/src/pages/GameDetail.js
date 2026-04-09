import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getGames,
  getBoxesByGame,
  getItemsByBox,
  updateItem,
  deleteItem,
  createItem,
} from '../api/api';
import '../styles/GameDetail.css';

function GameDetail() {
  const { gameName } = useParams();  // ID가 아니라 게임 이름(slug)
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasedBundles, setPurchasedBundles] = useState({});
  const [bundleQuantity, setBundleQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [premiumBundles, setPremiumBundles] = useState({});
  const [unboxedItems, setUnboxedItems] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationItem, setCelebrationItem] = useState(null);

  // localStorage 키
  const getStorageKey = () => `gotcha_${gameName}`;

  // localStorage에서 상태 로드
  useEffect(() => {
    const stored = localStorage.getItem(getStorageKey());
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setPurchasedBundles(data.purchasedBundles || {});
        setPremiumBundles(data.premiumBundles || {});
        setUnboxedItems(data.unboxedItems || []);
      } catch (err) {
        console.error('Error loading saved data:', err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameName]);

  // 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (unboxedItems.length > 0 || Object.keys(purchasedBundles).length > 0 || Object.keys(premiumBundles).length > 0) {
      const data = {
        purchasedBundles,
        premiumBundles,
        unboxedItems,
      };
      localStorage.setItem(getStorageKey(), JSON.stringify(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchasedBundles, premiumBundles, unboxedItems, gameName]);

  // 데이터 초기화
  const handleReset = () => {
    if (window.confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem(getStorageKey());
      setPurchasedBundles({});
      setPremiumBundles({});
      setUnboxedItems([]);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadGameData();
  }, [gameName]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedBox) {
      loadBoxItems();
    }
  }, [selectedBox]);

  const loadGameData = async () => {
    try {
      setLoading(true);
      
      // 모든 게임 조회 후 gameName과 매칭되는 게임 찾기
      const gamesRes = await getGames();
      console.log('All games:', gamesRes);
      
      let gameData = null;
      let gameId = null;
      
      // 응답 형식에 따라 처리
      let gamesList = [];
      if (Array.isArray(gamesRes.data)) {
        gamesList = gamesRes.data;
      } else if (Array.isArray(gamesRes)) {
        gamesList = gamesRes;
      }
      
      // gameName과 일치하는 게임 찾기 (slug 또는 id로)
      gameData = gamesList.find(g => 
        g.slug === gameName || 
        g.name?.toLowerCase() === gameName?.toLowerCase() ||
        g.id?.toString() === gameName
      );

      if (!gameData) {
        setError(`게임을 찾을 수 없습니다: ${gameName}`);
        setLoading(false);
        return;
      }

      gameId = gameData.id;
      setGame(gameData);
      console.log('Found game:', gameData);

      // 박스 정보 로드
      const boxesRes = await getBoxesByGame(gameId);
      console.log('boxesRes:', boxesRes);
      
      // 다양한 응답 형식 처리
      let boxesData = [];
      if (Array.isArray(boxesRes.data)) {
        boxesData = boxesRes.data;
      } else if (Array.isArray(boxesRes)) {
        boxesData = boxesRes;
      } else if (boxesRes.data && Array.isArray(boxesRes.data.data)) {
        boxesData = boxesRes.data.data;
      }
      
      console.log('Final boxesData:', boxesData);
      setBoxes(boxesData);

      if (Array.isArray(boxesData) && boxesData.length > 0) {
        setSelectedBox(boxesData[0]);
      }
    } catch (err) {
      setError('게임 정보를 불러올 수 없습니다');
      console.error('Error loading game data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadBoxItems = async () => {
    try {
      const itemsRes = await getItemsByBox(selectedBox.id);
      setItems(itemsRes.data);
    } catch (err) {
      setError('아이템 목록을 불러올 수 없습니다');
      console.error('Error loading items:', err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'probability' ? parseFloat(value) : value,
    };
    setItems(updatedItems);
  };

  const handleSaveItem = async (index) => {
    try {
      const item = items[index];
      await updateItem(item.id, item);
      setError(null);
    } catch (err) {
      setError('아이템 저장에 실패했습니다');
      console.error('Error saving item:', err);
    }
  };

  const handleDeleteItem = async (index) => {
    try {
      const item = items[index];
      await deleteItem(item.id);
      loadBoxItems();
    } catch (err) {
      setError('아이템 삭제에 실패했습니다');
      console.error('Error deleting item:', err);
    }
  };

  const handleAddItem = async () => {
    try {
      const newItem = {
        boxId: selectedBox.id,
        name: '새 아이템',
        grade: 'Normal',
        probability: 0,
        imageUrl: '',
      };
      await createItem(selectedBox.id, newItem);
      loadBoxItems();
    } catch (err) {
      setError('아이템 추가에 실패했습니다');
      console.error('Error adding item:', err);
    }
  };

  const calculateTotalProbability = () => {
    return items.reduce((sum, item) => sum + (item.probability || 0), 0);
  };

  const handleBuyBundle = async () => {
    try {
      setPurchasing(true);
      
      // 현재 박스의 구매한 개수 증가
      const currentCount = purchasedBundles[selectedBox.id] || 0;
      setPurchasedBundles({
        ...purchasedBundles,
        [selectedBox.id]: currentCount + bundleQuantity,
      });
      
      setError(null);
    } catch (err) {
      setError('꾸러미 구매에 실패했습니다');
      console.error('Error buying bundle:', err);
    } finally {
      setPurchasing(false);
    }
  };

  // 일반 꾸러미 열기: 6.5% 확률로 최고급 꾸러미 획득
  const handleOpenBundle = () => {
    const rollChance = Math.random() * 100;
    let item;
    let showAnimation = false;

    if (rollChance < 6.5) {
      // 최고급 꾸러미 획득
      item = { name: '최고급 꾸러미', type: 'premium', rarity: 'premium' };
      setPremiumBundles({
        ...premiumBundles,
        [selectedBox.id]: (premiumBundles[selectedBox.id] || 0) + 1,
      });
      showAnimation = true; // 최고급 꾸러미 획득 시만 애니메이션 표시
    } else {
      // 일반 아이템 획득 (여기서는 임시로 랜덤 아이템)
      const regularItems = ['일반 도안', '이모트 팩', '낙하산', '무기'];
      item = { name: regularItems[Math.floor(Math.random() * regularItems.length)], type: 'regular', rarity: 'normal' };
    }

    setCelebrationItem(item);
    if (showAnimation) {
      setShowCelebration(true);
      // 3초 후 축하 애니메이션 숨기기
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
    setUnboxedItems([...unboxedItems, item]);

    // 일반 꾸러미 개수 1 감소
    const currentCount = purchasedBundles[selectedBox.id] || 0;
    if (currentCount > 1) {
      setPurchasedBundles({
        ...purchasedBundles,
        [selectedBox.id]: currentCount - 1,
      });
    } else {
      const newBundles = { ...purchasedBundles };
      delete newBundles[selectedBox.id];
      setPurchasedBundles(newBundles);
    }
  };

  // 최고급 꾸러미 열기
  const handleOpenPremiumBundle = () => {
    const rollChance = Math.random() * 100;
    let item;
    let showAnimation = false;

    // 카리나, 지젤, 윈터, 닝닝 캐릭터
    const characters = ['카리나', '지젤', '윈터', '닝닝'];

    // 세트 도안 (각 2.25%): 0~9%
    if (rollChance < 9) {
      const charIndex = Math.floor(rollChance / 2.25);
      item = { name: `${characters[charIndex]} 세트 도안`, type: 'premium_set', rarity: 'premium' };
      showAnimation = true; // 세트 도안 획득 시 애니메이션 표시
    }
    // 일반 도안 (각 4.5%): 9~27%
    else if (rollChance < 27) {
      const charIndex = Math.floor((rollChance - 9) / 4.5);
      item = { name: `${characters[charIndex]} 일반 도안`, type: 'premium_normal', rarity: 'rare' };
      showAnimation = true; // 일반 도안 획득 시 애니메이션 표시
    }
    // 나머지 (73%): 27~100
    else {
      const otherItems = ['aespa 무기', '이모트 팩', '낙하산'];
      item = { name: otherItems[Math.floor(Math.random() * otherItems.length)], type: 'premium_other', rarity: 'epic' };
    }

    setCelebrationItem(item);
    if (showAnimation) {
      setShowCelebration(true);
      // 3초 후 축하 애니메이션 숨기기
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
    setUnboxedItems([...unboxedItems, item]);

    // 최고급 꾸러미 개수 1 감소
    const currentCount = premiumBundles[selectedBox.id] || 0;
    if (currentCount > 1) {
      setPremiumBundles({
        ...premiumBundles,
        [selectedBox.id]: currentCount - 1,
      });
    } else {
      const newPremium = { ...premiumBundles };
      delete newPremium[selectedBox.id];
      setPremiumBundles(newPremium);
    }
  };

  if (loading) {
    return <div className="loading">게임 정보 로딩 중...</div>;
  }

  if (!game) {
    return (
      <div className="error-page">
        <p>게임을 찾을 수 없습니다</p>
        <button className="btn-back" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const totalProbability = calculateTotalProbability();
  const probabilityWarning = totalProbability > 100;

  return (
    <div className="game-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← 돌아가기
        </button>
        <h1 className="game-title">{game.name}</h1>
        <p className="game-description">{game.description}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="detail-layout">
        {/* Left Sidebar - Box List */}
        <aside className="sidebar">
          <h3 className="sidebar-title">박스 목록</h3>
          <div className="box-list">
            {boxes.map((box) => (
              <button
                key={box.id}
                className={`box-item ${selectedBox?.id === box.id ? 'active' : ''}`}
                onClick={() => setSelectedBox(box)}
              >
                {box.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {selectedBox && (
            <>
              {/* Items Section */}
              <section className="items-section">
                <h2>{selectedBox.name}</h2>

                {/* Probability Status */}
                <div className={`probability-status ${probabilityWarning ? 'warning' : ''}`}>
                  <span>확률 합계: {totalProbability.toFixed(1)}%</span>
                  {probabilityWarning && <span className="warning-text">⚠️ 100%를 초과합니다</span>}
                </div>

                {/* Items Table */}
                <div className="items-table-wrapper">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>아이템명</th>
                        <th>등급</th>
                        <th>확률 (%)</th>
                        <th>작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className={`grade-${item.grade.toLowerCase()}`}>
                          <td>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                              className="input-name"
                            />
                          </td>
                          <td>
                            <select
                              value={item.grade}
                              onChange={(e) => handleItemChange(index, 'grade', e.target.value)}
                              className="select-grade"
                            >
                              <option>Legend</option>
                              <option>Epic</option>
                              <option>Rare</option>
                              <option>Normal</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={item.probability}
                              onChange={(e) => handleItemChange(index, 'probability', e.target.value)}
                              className="input-probability"
                            />
                          </td>
                          <td>
                            <button
                              className="btn-save"
                              onClick={() => handleSaveItem(index)}
                            >
                              저장
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteItem(index)}
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button className="btn-add-item" onClick={handleAddItem}>
                  + 아이템 추가
                </button>
              </section>

              {/* Bundle Purchase Section */}
              <section className="simulator-section">
                <div className="section-header">
                  <h2>꾸러미 구매</h2>
                  <button className="btn-reset" onClick={handleReset} title="모든 데이터 초기화">
                    🔄 초기화
                  </button>
                </div>

                <div className="bundle-container">
                  {/* 구매 영역 */}
                  <div className="bundle-purchase">
                    <div className="simulator-controls">
                      <div className="control-group">
                        <label>구매 수량:</label>
                        <select
                          value={bundleQuantity}
                          onChange={(e) => setBundleQuantity(parseInt(e.target.value))}
                          disabled={purchasing}
                        >
                          <option value={1}>1개</option>
                          <option value={5}>5개</option>
                          <option value={10}>10개</option>
                        </select>
                      </div>

                      <button
                        className={`btn-purchase ${purchasing ? 'loading' : ''}`}
                        onClick={handleBuyBundle}
                        disabled={purchasing}
                      >
                        {purchasing ? '구매 중...' : '🛍️ 꾸러미 구매'}
                      </button>
                    </div>
                  </div>

                  {/* 꾸러미 열기 영역 */}
                  <div className="bundle-unbox">
                    <div className="unbox-section">
                      <h3>일반 꾸러미</h3>
                      <button
                        className={`btn-open ${purchasedBundles[selectedBox.id] > 0 ? 'active' : 'disabled'}`}
                        onClick={handleOpenBundle}
                        disabled={!purchasedBundles[selectedBox.id] || purchasedBundles[selectedBox.id] === 0}
                      >
                        🎁 열기 {purchasedBundles[selectedBox.id] > 0 && `(${purchasedBundles[selectedBox.id]}개)`}
                      </button>
                    </div>

                    <div className="unbox-section">
                      <h3>
                        최고급 꾸러미
                        {premiumBundles[selectedBox.id] > 0 && (
                          <span className="premium-badge">{premiumBundles[selectedBox.id]}개</span>
                        )}
                      </h3>
                      <button
                        className={`btn-open-premium ${premiumBundles[selectedBox.id] > 0 ? 'active' : 'disabled'}`}
                        onClick={handleOpenPremiumBundle}
                        disabled={!premiumBundles[selectedBox.id] || premiumBundles[selectedBox.id] === 0}
                      >
                        👑 열기 {premiumBundles[selectedBox.id] > 0 && `(${premiumBundles[selectedBox.id]}개)`}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 축하 애니메이션 */}
                {showCelebration && celebrationItem && (
                  <div
                    className="celebration-overlay"
                    onClick={() => setShowCelebration(false)}
                  >
                    <div
                      className={`celebration-content shake ${celebrationItem.rarity} ${celebrationItem.type}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="celebration-emoji">✨ 🎉 ✨</div>
                      <div className="celebration-text">획득!</div>
                      <div className="celebration-item">{celebrationItem.name}</div>
                    </div>
                  </div>
                )}

                {/* 획득한 아이템 목록 */}
                {unboxedItems.length > 0 && (
                  <div className="results-section">
                    <h3>획득한 아이템 ({unboxedItems.length}개)</h3>
                    <div className="items-list">
                      {unboxedItems.map((item, index) => (
                        <div
                          key={index}
                          className={`item-card ${item.rarity || 'normal'}`}
                        >
                          <div className="item-rarity">{item.rarity || 'Normal'}</div>
                          <div className="item-name">{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default GameDetail;
