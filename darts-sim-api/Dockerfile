# 1. ビルド環境（Java 21とMaven）を準備
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 2. ソースコードをコンテナ内にコピーしてビルド（テストはスキップ）
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 3. 実行環境（軽量なJava 21環境）を準備
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 4. ビルドしたJARファイルだけを実行環境にコピー
COPY --from=build /app/target/*.jar app.jar

# 5. Renderに対して「8080ポートを使う」と宣言
EXPOSE 8080

# 6. アプリケーションの起動コマンド
ENTRYPOINT ["java", "-jar", "app.jar"]