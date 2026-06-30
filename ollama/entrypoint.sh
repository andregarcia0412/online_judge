#!/bin/bash

/bin/ollama serve &

pid=$!

sleep 5

ollama create online_judge_chat_model -f /root/online_judge_chat_modelfile
ollama create online_judge_evaluation_model -f /root/online_judge_evaluation_modelfile

echo "✅ Ollama ready!"

wait $pid