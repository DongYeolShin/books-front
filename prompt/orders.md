
## 1. 목적
- 구매 페이지 구현
- 선택한 도서를 구매하는 페이지 

## 2. 디자인
- pencil5.pen 파일에서 Order Page  구현

## 3. open api 연동 
- 주소 찾기 할 때  다음 주소 API 이용 
- 선택된 주소가  주소 input box 에 등록 


## 4. router  
- 도서를 여러권 구매 가능
- id를 콤마(,) 로 붙여서 router 데이터로 전송

### 4.1 라우터 데이터
```
    books : [
        {
           bookId : BOOK001,
           quantity : 1
        },
        {
           bookId : BOOK001,
            quantity : 1
        },
    ]
```


##  5. 기능
- 주소 찾기 기능
- 주문 상품정보 api 연동
- 금액, 할인금액, 포인트 차감, 결제금액 계산 

## 6. server api 연동 
- 구매할 도서 정보 가져오는 api
  - end-point : /api/v1/books
  - method :get 
  - 파라메터 
    - order-books : BOOK001,BOOK002...
  

### 6.1 결과 데이터 
```
{
    "code": 200,
    "data": [
        {
            "bookId": "BOOK028",
            "title": "스위프트 프로그래밍",
            "originalPrice": 38000,
            "salePrice": 34200,
            "imageUrl": "https://image.aladin.co.kr/product/36471/14/cover200/k522039911_1.jpg"
        },
        {
            "bookId": "BOOK029",
            "title": "젯팩 컴포즈로 개발하는 안드로이드 UI",
            "originalPrice": 36000,
            "salePrice": 32400,
            "imageUrl": "https://image.aladin.co.kr/product/30709/49/cover200/k102830240_1.jpg"
        }
    ]
}
```

## 7. 권한 설정
- 해당 페이지는 로그인을 해야 접속 가능
- 페이지 이동 시 로그인 여부 판단
- 비 로그인 시 로그인 페이지로 이동
- 로그인 후에는 주문 페이지로 이동
- 선택된 정보는 저장했다가, 로그인 후 페이지 이동 시 전달 


## 7. 주의 사항
- 내용에 없는 개발 금지
- 관계없는 코드 수정 금지
- 내용에 없는 수정사항 필요 시 허락 받기 
