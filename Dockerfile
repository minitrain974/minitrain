# Use a lightweight Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app files
COPY . .

# Cloud Run expects the app to listen on 0.0.0.0:8080
ENV PORT=8080
EXPOSE 8080

# Start with Gunicorn using the appropriate Flask WSGI setup
CMD ["gunicorn", "-w", "4", "-k", "gthread", "-b", "0.0.0.0:8080", "app:app"]
