# Use Python 3.11 slim image as the base
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .


# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt


# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Set Python path
ENV PYTHONPATH=/app

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "run:app"]