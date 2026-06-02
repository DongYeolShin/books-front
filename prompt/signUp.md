

## 1. 목적
- 회원가입 API 연동

## 2. API 서버 
- endpoint : /api/v1/users/signup
- method : POST
- contentType : application/json
- 매개변수
```
  {
    "userId": "필수", "email": "필수(이메일형식)", "passwd": "필수", "name": "필수",
    "phone": "필수", "gender": "선택", "birthDate": "yyyy-MM-dd(필수)",
    "postalCode": "필수", "address": "필수", "addressDetail": "선택"
  }

```
- 결과
```
{
   code : 200,
   message : "회원가입이 완료되었습니다"
}
```

## 3. 회원 가입 후
- 회원가입 성공 및 실패에 대한 결과 팝업 출력 
- 회원가입 후에는 로그인 화면으로 이동
