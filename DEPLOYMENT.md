# Gotcha 배포 가이드

## 📋 사전 요구사항

- Docker & Docker Compose
- Git
- 충분한 디스크 공간 (최소 5GB)

## 🚀 배포 방법

### 1. 저장소 클론

```bash
git clone https://github.com/HANA-jae/Gotcha.git
cd Gotcha
```

### 2. 환경 변수 설정

`.env.example`을 참고하여 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

필요에 따라 `.env` 파일을 수정하세요:
- `DB_PASSWORD`: 데이터베이스 비밀번호 변경 (필수)
- `BACKEND_PORT`: 백엔드 포트 (기본: 8080)
- `FRONTEND_PORT`: 프론트엔드 포트 (기본: 3000)
- `REACT_APP_API_URL`: 프론트엔드에서 백엔드 접근 URL (배포 환경에 맞게 수정)

### 3. Docker Compose로 배포

#### 개발 환경
```bash
docker-compose up -d
```

#### 프로덕션 환경
```bash
docker-compose -f docker-compose.yml up -d --build
```

### 4. 배포 확인

각 서비스가 정상적으로 실행되고 있는지 확인하세요:

```bash
docker-compose ps
```

예상 결과:
```
NAME                 STATUS          PORTS
gotcha-postgres      Up (healthy)    0.0.0.0:5432->5432/tcp
gotcha-redis         Up (healthy)    0.0.0.0:6379->6379/tcp
gotcha-backend       Up              0.0.0.0:8080->8080/tcp
gotcha-frontend      Up              0.0.0.0:3000->3000/tcp
```

### 5. 서비스 접근

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **Swagger UI (API 문서)**: http://localhost:8080/swagger-ui.html

## 📊 데이터베이스 초기화

첫 실행 시 데이터베이스가 자동으로 생성됩니다.

데이터베이스를 초기화하려면:

```bash
docker-compose exec postgres psql -U gotcha_user -d gotcha_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker-compose restart backend
```

## 🛑 서비스 종료

```bash
docker-compose down
```

데이터를 유지하면서 종료:
```bash
docker-compose down -v  # -v 제거 시 볼륨 유지
```

## 📝 로그 확인

```bash
# 모든 서비스 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🔧 트러블슈팅

### 포트 충돌
이미 사용 중인 포트가 있으면 `.env` 파일에서 포트를 변경하세요:
```env
BACKEND_PORT=8081
FRONTEND_PORT=3001
```

### 메모리 부족
Docker 메모리 할당을 증가시키거나 불필요한 서비스를 종료하세요.

### 데이터베이스 연결 오류
PostgreSQL이 시작될 때까지 대기하세요 (healthcheck: ~10초):
```bash
docker-compose logs postgres
```

### 빌드 오류
캐시를 제거하고 다시 빌드하세요:
```bash
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## 🔐 보안 권장사항

### 프로덕션 배포 시:

1. **환경 변수 관리**
   - `.env` 파일을 버전 관리에서 제외 (이미 `.gitignore`에 포함)
   - 강력한 데이터베이스 비밀번호 설정

2. **데이터베이스 보안**
   - 기본 비밀번호 변경 (필수)
   - 정기적인 백업 설정

3. **SSL/TLS 설정**
   - Nginx/Apache와 같은 리버스 프록시 사용
   - HTTPS 인증서 설정

4. **네트워크 보안**
   - 방화벽 설정
   - 필요한 포트만 노출

## 📊 모니터링

### Docker 대시보드 사용
```bash
docker stats
```

### Portainer (웹 기반 관리)
```bash
docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer-ce
```

## 💾 백업

### PostgreSQL 백업
```bash
docker-compose exec postgres pg_dump -U gotcha_user gotcha_db > backup.sql
```

### Redis 백업
```bash
docker-compose exec redis redis-cli bgsave
docker cp gotcha-redis:/data/dump.rdb ./backup/redis_backup.rdb
```

## 🔄 업데이트

새 버전으로 업데이트하려면:

```bash
cd Gotcha
git pull origin main
docker-compose down
docker-compose up -d --build
```

## 📞 지원

문제가 발생하면:
- GitHub Issues: https://github.com/HANA-jae/Gotcha/issues
- 로그 확인: `docker-compose logs -f`
- 서비스 상태 확인: `docker-compose ps`

---

마지막 업데이트: 2026년 4월 8일
