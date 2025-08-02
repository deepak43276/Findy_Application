# Use an official JDK image
FROM eclipse-temurin:22-jdk AS builder

WORKDIR /app

# Copy Maven files and build the app
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline

# Copy source and build
COPY src src
RUN ./mvnw clean package -DskipTests

# Use a smaller JDK image for running
FROM eclipse-temurin:22-jdk

WORKDIR /app

# Copy the built JAR from the builder
COPY --from=builder /app/target/*.jar app.jar

# Run the app
CMD ["java", "-jar", "app.jar"]
