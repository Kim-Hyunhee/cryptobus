# **크립토버스**  
> **NFT(Non-Fungible Token) 가상 지갑을 연동하고, 추가적인 기능을 개발하는 프로젝트**

---

## **목차**
1. [실행 환경](#1-실행-환경)  
   1-1. [로컬 실행](#1-1-로컬-실행)  
   1-2. [환경 변수](#1-2-환경-변수)  
2. [기술 스택](#2-기술-스택)  
3. [디렉토리 구조](#3-디렉토리-구조)  
4. [ERD](#4-erd)  
5. [기능 구현](#5-기능-구현)  
   5-1. [로그인](#5-1-로그인)   
   5-2. [메타마스크 연결](#5-2-메타마스크-연결)  
   5-3. [매도/매수 CRUD](#5-3-매도/매수-CRUD)  

---

## **1. 실행 환경**
### **1-2. 환경 변수**  
- 아래 항목들이 `.env` 파일에 반드시 존재해야 합니다:
  - `DB_HOST`: 데이터베이스 연결 HOST 주소
  - `DB_TYPE`: 데이터베이스 연결 TYPE
  - `DB_USERNAME`: 데이터베이스 연결 username
  - `DB_PASSWORD`: 데이터베이스 연결 password
  - `DB_DATABASE`: 데이터베이스 연결 database 이름
  - `JWT_SECRET_KEY`: JWT 토큰 서명에 사용될 비밀 키
  - `UPBIT_PRIVATEKEY`: upbit 사용을 위한 비밀키

---

### 기술 스택
<img src="https://img.shields.io/badge/TypeScript-version 5-3178C6">&nbsp;
<img src="https://img.shields.io/badge/Node.js-version 10-E0234E">&nbsp;
<img src="https://img.shields.io/badge/TypeORM-version 0.3-fcad03">&nbsp;
<img src="https://img.shields.io/badge/MySQL-version 8-00758F">&nbsp;

</br>

---

## 디렉토리 구조

<details>
<summary><strong>디렉토리 구조</strong></summary>
<div markdown="1">
 
```bash
├─ leading
│  ├─src
│  │  │  app.ts
│  │  │  database.ts
│  │  │  index.ts
│  │  │
│  │  ├─apis
│  │  │      idealFarm.ts
│  │  │      upbit.ts
│  │  │
│  │  ├─controller
│  │  │      auth.ts
│  │  │      coin.ts
│  │  │      pick.ts
│  │  │      pickGroup.ts
│  │  │      trade.ts
│  │  │
│  │  ├─entity
│  │  │      bot.ts
│  │  │      coin.ts
│  │  │      index.ts
│  │  │      pick.ts
│  │  │      pickGroup.ts
│  │  │      trade.ts
│  │  │      user.ts
│  │  │
│  │  ├─helper
│  │  │      auth.ts
│  │  │      fcm.ts
│  │  │      pick.ts
│  │  │
│  │  ├─router
│  │  │      auth.ts
│  │  │      coin.ts
│  │  │      index.ts
│  │  │      pick.ts
│  │  │      pickGroup.ts
│  │  │      trade.ts
│  │  │
│  │  ├─service
│  │  │      auth.ts
│  │  │      bot.ts
│  │  │      coin.ts
│  │  │      noti.ts
│  │  │      pick.ts
│  │  │      pickGroup.ts
│  │  │      trade.ts
│  │  │
│  │  └─swagger
│  │          auth.yml
│  │          coin.yml
│  │          index.ts
│  │          pick.yml
│  │          pickGroup.yml
│  │          trade.yml
│  │
│  └─test
│      ├─helper
│      │      pick.test.ts
│      │
│      └─router
│              auth.test.ts
│              coin.test.ts
│              index.test.ts
│              pick.test.ts
│
└─upbit
    │  package-lock.json
    │  package.json
    │  tsconfig.json
    │
    └─src
        │  app.ts
        │  index.ts
        │
        ├─apis
        │      upbit.ts
        │
        ├─controller
        │      auth.ts
        │      order.ts
        │
        └─router
                auth.ts
                order.ts
```
</div>
</details>

</br>

## **ERD**

<details>
<summary><strong>ERD 이미지 보기</strong></summary>
<div markdown="1">

![ERD 이미지](https://github.com/user-attachments/assets/c4b856ce-8e08-4f3f-83e5-6d01eae03e60)

</div>
</details>

</br>

## 기능구현
### **5-1. 로그인** 
* 기존 아이디얼팜 회원이 로그인 성공 시 토큰 발급(JWT 토큰 발급)
  
### **5-2. 메타마스크 연결** 
* 업비트 자산 조회 구현

### **5-3. 매도/매수 CRUD**
* 매도/매수할 수 있는 코인 목록
* 매도/매수 구현

 ---
 
 ## **Swagger 문서**
API 명세는 Swagger를 통해 확인할 수 있습니다. 아래 링크를 클릭하여 Swagger 문서로 이동하세요.

[Swagger 문서 보러 가기](https://github.com/user-attachments/assets/e10793f5-65d1-4a4f-add6-346940961523)

---
