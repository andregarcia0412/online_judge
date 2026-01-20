package com.llmgateway.llm;

import com.llmgateway.domain.exception.LlmException;
import com.llmgateway.llm.dto.Message;
import com.llmgateway.llm.dto.analyze.AnalyzeRequestDto;
import com.llmgateway.llm.dto.analyze.AnalyzeResponseDto;
import com.llmgateway.llm.dto.ask.AskRequestDto;
import com.llmgateway.llm.dto.ask.AskResponseDto;
import com.llmgateway.llm.dto.chat.ChatRequest;
import com.llmgateway.llm.dto.generate.GenerateRequest;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class LlmService {
    private final ObjectMapper mapper;
    private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

    public LlmService(ObjectMapper mapper){
        this.mapper = mapper;
    }

    public AnalyzeResponseDto analyzeComplexity(AnalyzeRequestDto userRequest){
        String response = sendToOllamaGenerate(String.format("ANALYZE_COMPLEXITY %s", userRequest.code()));
        return mapper.readValue(response, AnalyzeResponseDto.class);
    }

    //TODO: implementar historico de chat com redis
    public AskResponseDto generateResponse(AskRequestDto userRequest){
        String response = sendToOllamaChat(new Message("user", String.format("%s\nMy code in %s:\n%s", userRequest.question(), userRequest.language(), userRequest.code())), "5m");
        return new AskResponseDto(response);
    }

    private String sendToOllamaChat(Message message, String keepAlive){
        try {
            ChatRequest body = new ChatRequest("online_judge_model", new Message[]{ message }, false, keepAlive);
            String json = mapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://ollama:11434/api/chat"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString((json)))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (IOException e) {
            throw new LlmException("Error calling LLM:", e);
        } catch (InterruptedException e){
            Thread.currentThread().interrupt();
            throw new LlmException("LLM request interrupted:", e);
        }
    }
    private String sendToOllamaGenerate(String userPrompt){
        try {
            GenerateRequest body = new GenerateRequest("online_judge_model", userPrompt, false, "0");
            String json = mapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://ollama:11434/api/generate"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString((json)))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (IOException | InterruptedException e) {
            throw new LlmException("Error calling LLM:", e);
        }
    }
}
