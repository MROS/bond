# 無限城 3.0

## 建置
```sh
# 下載源碼
git clone https://github.com/MROS/infinite-city3
cd infinite-city3

# 安裝依賴
pnpm i

# 設定資料庫地址
echo "DATABASE_URL=\"file:./dev.db\"" > .env

# 灌入資料庫 schema
pnpm exec prisma db push

# 灌入預設文章（可選步驟）
pnpm exec prisma seed

# 啓動伺服器
pnpm dev
```

在正式環境使用：
```sh
pnpm build
node build
```
