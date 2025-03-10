# ベースイメージとして公式のNode.jsイメージを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# 開発サーバーを起動するためのポートを指定
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]