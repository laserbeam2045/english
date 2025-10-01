# 英単語学習アプリ

Next.js + TypeScript + Supabase で構築された英単語学習アプリケーションです。中学・高校の英単語を学年・カテゴリ別に学習し、クイズで実力をチェックできます。

## 技術スタック

- **フレームワーク**: Next.js 15.5.4 (App Router)
- **言語**: TypeScript 5
- **データベース**: Supabase (PostgreSQL)
- **スタイリング**: Tailwind CSS 4
- **UI/UX**:
  - React 19.1.0
  - canvas-confetti (クイズクリア時のアニメーション)

## 機能

### 1. 単語一覧 (`/words`)
- 学年・カテゴリ別で英単語を閲覧
- フィルター機能で特定の学年・カテゴリに絞り込み
- 各単語の意味を複数表示

### 2. 英単語クイズ (`/quiz`)
- 学年・カテゴリを選択してクイズに挑戦
- 日本語の意味を見て英単語を入力
- 最大20問をランダムに出題
- 即座に正誤判定とフィードバック
- スコア表示と詳細な結果画面
- 80点以上で紙吹雪のアニメーション
- クイズ中断機能（確認モーダル付き）
- レスポンシブデザイン対応

## データベーススキーマ

### スキーマ: `english`

#### テーブル構成

**1. english_categories**
```sql
- grade (INTEGER): 学年 (1=中1, 2=中2, 3=中3, 4=高1, 5=高2, 6=高3)
- id (INTEGER): カテゴリID
- label (VARCHAR(100)): カテゴリ名
- PRIMARY KEY: (grade, id)
```

**2. english_means**
```sql
- id (SERIAL PRIMARY KEY): 意味ID
- flag (INTEGER): フラグ (デフォルト: 0)
- mean (TEXT): 日本語の意味
- created (TIMESTAMP): 作成日時
- modified (TIMESTAMP): 更新日時
```

**3. english_spells**
```sql
- id (SERIAL PRIMARY KEY): スペルID
- spell (VARCHAR(50) UNIQUE): 英単語
- grade (INTEGER): 学年
- category (INTEGER): カテゴリID
- created (TIMESTAMP): 作成日時
- modified (TIMESTAMP): 更新日時
- FOREIGN KEY: (grade, category) -> english_categories(grade, id)
```

**4. english_relations**
```sql
- spell_id (INTEGER): スペルID
- mean_id (INTEGER): 意味ID
- created (TIMESTAMP): 作成日時
- modified (TIMESTAMP): 更新日時
- PRIMARY KEY: (spell_id, mean_id)
- FOREIGN KEY: spell_id -> english_spells(id)
- FOREIGN KEY: mean_id -> english_means(id)
```

### データフィルタリングルール

アプリケーション側で以下のカテゴリを非表示にしています：
- `grade = 0` または `category = 0`（未分類）
- `grade = 6` かつ `category IN (16, 17, 18)`（特定の高校3年生カテゴリ）

### Row Level Security (RLS)

全テーブルに対して、匿名ユーザーを含む全員に読み取り権限を付与：
```sql
CREATE POLICY "Allow public read access" ON english.[table_name]
FOR SELECT TO public
USING (true);
```

## セットアップ

### 1. 環境変数の設定

`.env.local` ファイルを作成し、Supabase の認証情報を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. データベースマイグレーション

Supabase プロジェクトで以下のマイグレーションを実行：

1. `supabase/migrations/20250101000000_create_english_tables.sql` - テーブル作成
2. データインポート（CSV経由）
3. `supabase/migrations/20250101000001_add_foreign_keys.sql` - 外部キー制約追加

**重要**: Supabase ダッシュボードの Settings → API で `english` スキーマを公開スキーマリストに追加してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## プロジェクト構成

```
/
├── app/
│   ├── page.tsx                 # ホームページ
│   ├── words/
│   │   └── page.tsx            # 単語一覧ページ
│   └── quiz/
│       ├── page.tsx            # クイズ選択ページ
│       └── start/
│           ├── page.tsx        # クイズ開始（サーバーコンポーネント）
│           └── QuizClient.tsx  # クイズUI（クライアントコンポーネント）
├── lib/
│   ├── supabase.ts             # Supabase クライアント設定
│   └── gradeLabels.ts          # 学年ラベル変換ヘルパー
├── scripts/
│   ├── export_mysql_to_csv.py # MySQL → CSV エクスポート
│   └── find_missing_categories.py # データ整合性チェック
└── supabase/
    └── migrations/             # データベースマイグレーション
```

## ビルド & デプロイ

### プロダクションビルド

```bash
npm run build
```

### 起動

```bash
npm start
```

## データ管理

### MySQL から Supabase へのデータ移行

既存の MySQL データベースからデータを移行する場合：

1. `scripts/export_mysql_to_csv.py` でデータをCSVにエクスポート
2. Supabase ダッシュボードの Table Editor から CSV をインポート
3. `scripts/find_missing_categories.py` でデータ整合性をチェック
4. 外部キー制約マイグレーションを実行

## ライセンス

Private project
