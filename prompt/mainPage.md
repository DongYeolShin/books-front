

## 1. 목적
- 도서판매사이트 메인페이지 만들기 

## 2. UI
- pencil mcp 연동된  books.pen 파일에서  Main Page 컴포넌트 구현 
- 디자인과 동일하게 구현하고, 추가사항이 필요한 경우 허락을 받을 것 

## 3. API 연동 정보 
- method : GET
- end-point :  /api/v1/books/topn
- 매개변수 : X
- 서버 결과 데이터 :
```
 {
    code : 200,
    data  : {
      "bestTopN" : [
        {
           "bookId": " ",
           "title" : " ",
           "author" : " ",
           "price" : 0,
           "imageUrl" : ""
         }
      ],
      "newTopN" : [{
           "bookId": " ",
           "title" : " ",
           "author" : " ",
           "price" : 0,
           "imageUrl" : ""
         }],
      "basicTopN" : [{
           "bookId": " ",
           "title" : " ",
           "author" : " ",
            "price" : 0,
           "imageUrl" : ""
        }]
    }
 }
  ```

## 4. 데이터 적용
- api로 부터 받은 데이터를 가지고 UI 에 적용할 것
- 더보기 버튼에는 카테고리 type 적용
  - bestSeller : '베스트셀러',
  - Basic :  '기본서',
  - 새로운 책 : '새책'