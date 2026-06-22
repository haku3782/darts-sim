# ダーツ物理シミュレーター

*他の言語で読む: [English](README.md), [日本語](README.ja.md)*

インタラクティブな3Dダーツ物理シミュレーションと、セッティング最適化のためのWebアプリケーションです。3D描画を担当するReact/TypeScriptフロントエンドと、物理演算を担当するSpring Boot/Javaバックエンドを分離した、疎結合なクラウドネイティブアーキテクチャを採用しています。

🚀 **[ライブデモ](https://darts-sim-web.vercel.app/)**
🔗 **APIエンドポイント:** `https://darts-sim-api.onrender.com/api`

---

## 🎯 主な機能

- **3D物理演算ビジュアライゼーション:** バレル/シャフトの重量配分や空気抵抗を考慮した、ダーツの軌道をリアルタイムで描画します。
- **セッティングシミュレーター:** バレル、シャフト、フライトの様々な組み合わせをインタラクティブにテストできます。
- **物理演算エンジン:** バレルの重量、シャフトの長さ、フライトの空気抵抗などのパラメータに基づいてダーツの飛行軌道を計算します。
- **コンテナ化アーキテクチャ:** マルチステージビルドによる完全なDocker化で、ローカルから本番環境まで一貫した実行環境を保証します。
- **自動化されたCI/CD:** GitHub Actionsによるフロントエンド・バックエンド両方の自動テストパイプライン。

---

## 🛠 技術スタック

### フロントエンド (`darts-sim-web`)

| | |
|---|---|
| フレームワーク | React 19 (TypeScript) |
| ビルドツール | Vite |
| 3D描画 | Three.js / React Three Fiber |
| ホスティング | Vercel |

### バックエンド (`darts-sim-api`)

| | |
|---|---|
| 言語 | Java 21 |
| フレームワーク | Spring Boot 4 |
| ビルドツール | Maven |
| コンテナ化 | Docker |
| ホスティング | Render |

---

## 🏗 システムアーキテクチャ

UIの描画処理と、重い物理演算を分離するための疎結合アーキテクチャを採用しています。

```mermaid
graph TD
    Dev((開発者))
    User((ユーザー))

    subgraph "Frontend Hosting (Vercel)"
        React[React / TypeScript<br/>UI & 3D描画]
    end

    subgraph "Backend Hosting (Render)"
        Spring[Spring Boot / Java 21<br/>物理演算 API]
        Docker((Docker Container))
        DB[(PostgreSQL)]
        Spring --- Docker
        Spring --- DB
    end

    subgraph "CI/CD & Source Control"
        Repo[(GitHub)]
        Actions[GitHub Actions<br/>自動テスト]
    end

    Dev -->|"1. コードをPush"| Repo
    Repo -->|"2. トリガー"| Actions
    Repo -->|"3. 自動デプロイ"| React
    Repo -->|"4. 自動デプロイ"| Spring

    User -->|"A. サイトにアクセス"| React
    React -->|"B. REST API (JSON)<br/>物理演算をリクエスト"| Spring
    Spring -.->|"C. 計算結果を返す"| React
```

---

## 📈 CI/CDとデプロイ

| | ホスティング | デプロイトリガー |
|---|---|---|
| フロントエンド | Vercel | `main` ブランチへのPushで自動デプロイ |
| バックエンド | Render (Docker) | `main` ブランチへのPushで自動デプロイ |

統合されたGitHub Actionsワークフロー（`.github/workflows/ci.yml`）により、pushのたびにフロントエンドのビルド/テストとバックエンドのユニットテストが実行されます。VercelとRenderはそれぞれリポジトリを独立して監視し、`main` ブランチが更新されると自動的にデプロイします。

> **注記:** 現状、テストとデプロイは独立して動作しています。CIの合格はデプロイの条件にはなっていません。
