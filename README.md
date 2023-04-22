# nick-meet

參考google-meet，使用webRTC的技術以及firebase當作signaling server，實現簡單的多人視訊聊天

- 支援匿名或三方登入(目前apple無法使用)
![image](https://user-images.githubusercontent.com/34929382/233789484-0b634461-3295-4ea9-9fc8-a4bb450ba572.png)
- 可新建房間或是輸入房間號碼進入
![image](https://user-images.githubusercontent.com/34929382/233789462-a45db483-4a53-4620-838e-9ddce66ed2b7.png)
- 房間資訊
![image](https://user-images.githubusercontent.com/34929382/233791122-cf4965a3-6891-4f20-b41d-1618a9574422.png)
- 參與者列表
![image](https://user-images.githubusercontent.com/34929382/233791134-46bb6bd1-cc6b-4b84-8fde-d8677c6a47b4.png)
- 聊天室
![image](https://user-images.githubusercontent.com/34929382/233791172-6fd8495f-e9ad-4b43-896c-0ad259db66d5.png)


## 功能

- 登入系統 - 支援匿名登入或三方登入
- 選房系統 - 可創建新房間或加入現有房間
- 視訊聊天 - 可使用視訊和文字進行聊天，支援關麥或關視訊

## 使用技術
- [react-vite](https://github.com/vitejs/vite) - 建構框架
- [firebase Auth](https://github.com/firebase/firebase-js-sdk) - 登入驗證
- [webRTC](https://webrtc.org) - 影像串流與p2p瀏覽器溝通
- [firebase Realtime Database](https://github.com/firebase/firebase-js-sdk) - Signaling Server
- [react-redux](https://github.com/reduxjs/react-redux) - 狀態管理
- [react-router](https://github.com/remix-run/react-router) - 頁面路由
- [tailwindcss](https://github.com/tailwindlabs/tailwindcss) - CSS

## 事前準備

1. 創建一個[firebase](https://firebase.google.com/)帳號

2. 開起Authentication裡的 匿名登入、Google登入、github登入

3. 開啟Realtime Database，編輯權限全開或可以限定登入才可使用

4. 進入專案設定裡取得設定  
![image](https://user-images.githubusercontent.com/34929382/233793431-06d2e685-6fef-4efd-97a6-3d24571b87eb.png)

## 使用

1. 新增環境變數

新增檔案 `.env.local`，按照剛剛取得的設定貼上

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECTID=
VITE_FIREBASE_STORAGEBUCKET=
VITE_FIREBASE_MESSAGEING_SENDERID=
VITE_FIREBASE_APPID=
VITE_FIREBASE_MEASUREMENTID=
VITE_FIREBASE_DATABASEURL=
```

2. 啟動

```bash
npm install
npm run start
```
