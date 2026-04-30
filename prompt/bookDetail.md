
## 1. 도서 상세페이지 만들기 

## 2. 디자인
- pencil books2.pen 에 Book Detail Page 를 구현 

## 3. API
- method : GET
- end-point :  /api/v1/books/{bookId}
- 매개변수 : X
- 서버 결과 데이터 :
```
 {  
    "code": 200,
    "data": {
      "bookId": "BOOK030",
       "title": "Do it! 플러터 앱 프로그래밍",
        "subtitle": "오픈소스 기반의 크로스 플랫폼 앱 개발",
         "author": "조준수",
         "publisher": "이지스퍼블리싱",
         "publishDate": "2022-08-25",
         "originalPrice": 30000,
         "salePrice": 27000,
         "description": "플러터의 기본부터 실전 앱 개발까지 한 권으로 끝내는 입문서.",
         "imageUrl": "https://image.aladin.co.kr/product/27849/87/cover200/k342734681_1.jpg",
         "contents": "http://222.239.249.197/images/books/BOOK030.png",
         "stock": 40,
         "reviewList": []
    } 
 }
  ```

##  4. 화면 설명 
- 이미지는  imageUrl 값 사용
- 광고는 contents 이미지 사용
- 나머지는 예시를 보고 잘 매치되도록 사용
- 장바구니, 바로구매 기능은 차후 개발 
- 리뷰 리스트는  10개씩  페이징 처리 
- 리뷰가 없을 경우, 리뷰가 없습니다. 출력되도록 함. 
