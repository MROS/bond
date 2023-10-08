# 無限城 3.0

## 建置
```sh
# 下載源碼
git clone https://github.com/MROS/infinite-city3
cd infinite-city3

# 安裝依賴
pnpm i

# 設定資料庫地址，需先安裝／設定 PostgreSQL
echo "postgres://postgres:mypassword@localhost:5432/city" > .env

# 灌入資料庫 schema
pnpm exec prisma db push

# 灌入預設文章（可選步驟）
pnpm exec prisma seed

# 啓動伺服器
pnpm dev
```

`pnpm dev` 會啓用含熱更新的開發環境，若想打包後執行，可用以下指令：
```sh
pnpm build
node preview
```
