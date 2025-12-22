#!/bin/bash
# Script to start the backend server

cd "$(dirname "$0")/backend"
source ../.venv/bin/activate
echo "Starting backend server on http://127.0.0.1:8000"
echo "API docs available at http://127.0.0.1:8000/docs"
uvicorn main:app --reload --host 127.0.0.1 --port 8000

