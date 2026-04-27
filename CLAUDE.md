# 도서판매 사이트 프로젝트

## 프로젝트 개요
React 기반 프론트엔드와 Spring Boot 기반 백엔드로 구성된 도서판매 웹사이트를 개발합니다.

## 기술 스택

### 프론트엔드
- **React** (최신 버전)
- **React Router** (최신 버전) - **Data Mode**(`createBrowserRouter`) 방식으로 작성
- **Axios** (최신 버전) - API 통신
- **Tailwind CSS** (최신 버전) - 유틸리티 기반 스타일링
- **CSS Modules** - 컴포넌트별 스코프 스타일링

### 백엔드
- **Spring Boot** (최신 버전)

### 공통 원칙
- **모든 라이브러리와 버전은 항상 최신 버전으로 설치할 것**
- 프로젝트에 필요한 라이브러리는 누락 없이 모두 설치할 것

## 프론트엔드 폴더 구조

```
project-root/
├── public/
│   └── mocks/              # Mock 데이터 파일
├── src/
│   ├── components/         # 재사용 가능한 공통 컴포넌트
│   ├── pages/              # 라우팅 단위 페이지 컴포넌트
│   ├── services/           # API 연동 서비스 로직
│   ├── apis/               # Axios 인스턴스 및 API 엔드포인트 정의
│   └── routers/            # React Router 설정 파일
└── ...
```

### 폴더별 역할
- `components/` : Header, Footer, Button 등 재사용 가능한 UI 컴포넌트
- `pages/` : 각 라우트에 대응되는 페이지 컴포넌트
- `services/` : 비즈니스 로직과 API 호출을 처리하는 서비스 레이어
- `apis/` : Axios 인스턴스 설정 및 API 엔드포인트 모음
- `routers/` : `createBrowserRouter`를 사용한 라우터 설정
- `public/mocks/` : 개발용 Mock JSON 데이터

## 페이지 구성

### Layout 구조
- **기본 Layout 페이지**를 중심으로 구성
- Layout은 다음 요소를 포함:
    - **Header 컴포넌트** : 사이트 메뉴(네비게이션) 포함
    - **`<Outlet />` 영역** : 선택된 메뉴에 해당하는 서브 페이지가 렌더링되는 공간

### 라우팅 방식
- React Router의 **Data Mode** 사용 (`createBrowserRouter` + `RouterProvider`)
- Layout을 부모 라우트로 두고, 각 페이지를 자식 라우트로 구성
- 메뉴 클릭 시 `<Outlet />` 영역에 해당 페이지가 표시됨

## 스타일링 규칙
- **Tailwind CSS**: 레이아웃, 여백, 색상 등 일반적인 유틸리티 스타일링
- **CSS Modules**: 컴포넌트별로 격리가 필요한 커스텀 스타일
- 두 방식을 적절히 조합하여 사용

## API 통신 규칙
- 모든 API 통신은 **Axios** 라이브러리를 사용
- `apis/` 폴더에 Axios 인스턴스를 생성하여 baseURL, 인터셉터 등을 통합 관리
- `services/` 폴더에서 `apis/`의 인스턴스를 활용하여 실제 API 호출 함수 작성
- 페이지/컴포넌트는 직접 Axios를 호출하지 않고, `services/`를 통해 데이터 요청

## 서버 및 API 설정

### 백엔드 (Spring Boot)
- **서버 주소**: `localhost`
- **포트**: `8080`
- **API 엔드포인트 기본 경로**: `/api/v1`로 시작
    - 예시: `http://localhost:8080/api/v1/books`, `http://localhost:8080/api/v1/users`
- 모든 REST API는 위 prefix를 따를 것

### 프론트엔드 개발 서버 설정
- **프록시 설정 추가**
    - 개발 서버에서 `/api` 요청을 `http://localhost:8080`으로 프록시 처리
    - CORS 이슈 없이 백엔드 API 호출이 가능하도록 구성
    - Vite 사용 시 `vite.config.js`의 `server.proxy` 옵션에 설정
    - CRA 사용 시 `package.json`의 `proxy` 또는 `setupProxy.js`에 설정
- **브라우저 자동 실행**
    - 프로젝트 시작(`npm start` 또는 `npm run dev`) 시 브라우저가 자동으로 열리도록 세팅
    - Vite: `server.open: true` 옵션 사용
    - CRA: `BROWSER` 환경변수 또는 기본 동작 활용

### Axios 기본 설정
- `apis/` 폴더의 Axios 인스턴스 `baseURL`은 `/api/v1`로 설정
- 프록시를 통해 자동으로 백엔드 서버(`http://localhost:8080/api/v1`)로 전달됨

## 작업 요청
위 내용을 바탕으로 다음 작업을 수행해주세요:

1. React 프로젝트 초기 세팅 (최신 버전 기준)
2. Tailwind CSS + CSS Modules 환경 구성
3. 위 폴더 구조에 맞춰 디렉토리 생성
4. Axios 인스턴스 기본 세팅 (`baseURL: /api/v1`)
5. React Router Data Mode 기반 라우터 설정
6. 기본 Layout 컴포넌트 작성 (Header + Outlet 구조)
7. **개발 서버 프록시 설정** (`/api` → `http://localhost:8080`)
8. **프로젝트 시작 시 브라우저 자동 실행 설정**
9. 필요한 모든 라이브러리 최신 버전으로 설치
10. Spring Boot 백엔드 프로젝트 초기 세팅
    - 포트: `8080`
    - API 기본 경로: `/api/v1`