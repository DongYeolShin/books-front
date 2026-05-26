
## 1. 결제 완료 페이지 만들기
- 결제완료 후 노출 페이지

## 2. UI 참고
- pencil 에서 Order Complete Page 컴포넌트 참고 
- 해당 컴포넌트대로 개발


## 3. API 정보 
- end-point : /api/v1/payments/complete
- method : get
- parameter : orderId
- data :
```
  {
    code : 200,
    data : {
       orderId : "30303033",
       orderList : [
       
          {
             bookId : 1,
             title : "파이썬",
             originalPrice : 
             salePrice : 30000,
             quantity : 1,   
          }
       ],
       usedPoints : 3000,
       orders : {
          name : "김철수",
          phone : "010-4444-5555",
          email : "eveing2@naver.com",
          paymethod : "이니시스",
          orderDate: "2025-06-10"
       },
       shipping : {
           name : "김철수",
          phone : "010-4444-5555",
          "address" : "서울시 성동구",
          "addressDetail" : "꿈마을나라"
          "status" : "배송중"
       }
       
    }
  }
```

## 3.  보안 설정
- 로그인 사용자 접근 가능