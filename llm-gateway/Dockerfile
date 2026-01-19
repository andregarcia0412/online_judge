FROM maven:3.9.8-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn clean package spring-boot:repackage -DskipTests

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
COPY --from=build /app/target/llm-gateway-0.0.1-SNAPSHOT.jar ./app.jar

EXPOSE 8081
CMD ["java", "-jar", "app.jar"]
