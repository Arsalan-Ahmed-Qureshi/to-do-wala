# Stage 1: build the application
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests clean package

# Stage 2: run the application
FROM eclipse-temurin:21-jre
RUN addgroup --system app && adduser --system --ingroup app app
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
RUN chown app:app /app/app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
