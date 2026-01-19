package com.llmgateway.service;

import com.llmgateway.domain.exception.LlmException;
import com.llmgateway.dto.Message;
import com.llmgateway.dto.analyze.AnalyzeRequestDto;
import com.llmgateway.dto.analyze.AnalyzeResponseDto;
import com.llmgateway.dto.ask.AskRequestDto;
import com.llmgateway.dto.ask.AskResponseDto;
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
    private ObjectMapper mapper = new ObjectMapper();
    private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

    public AnalyzeResponseDto analyzeComplexity(AnalyzeRequestDto userRequest){
        String response = sendToOllamaGenerate(String.format("ANALYZE_COMPLEXITY %s", userRequest.getCode()));
        return mapper.readValue(response, AnalyzeResponseDto.class);
    }

    //TODO: implementar historico de chat com redis
    public AskResponseDto generateResponse(AskRequestDto userRequest){
        String response = sendToOllamaChat(new Message("user", String.format("%s\nMy code in %s:\n%s", userRequest.getQuestion(), userRequest.getLanguage(), userRequest.getCode())), "5m");
        return new AskResponseDto(response);
    }

    private String sendToOllamaChat(Message message, String keepAlive){
        try {
            var body = new Object(){
                public final String model = "online_judge_llm";
                public final Message[] messages = new Message[]{ message };
                public final boolean stream = false;
                public final String keep_alive = keepAlive;
            };
            String json = mapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:11434/api/chat"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString((json)))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (IOException | InterruptedException e) {
            throw new LlmException("Error calling LLM:", e);
        }
    }
    private String sendToOllamaGenerate(String userPrompt){
        try {
            var body = new Object(){
                public final String model = "online_judge_llm";
                public final String prompt = userPrompt;
                public final boolean stream = false;
                public final int keep_alive = 0;
            };
            String json = mapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:11434/api/generate"))
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
