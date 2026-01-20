#!/bin/bash

/bin/ollama serve &

pid=$!

sleep 5

ollama create online_judge_model -f /root/online_judge_modelfile

echo "✅ Ollama ready!"

wait $pid