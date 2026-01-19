package com.llm_gateway.service;

import com.llm_gateway.dto.Message;
import com.llm_gateway.dto.analyze.AnalyzeRequestDto;
import com.llm_gateway.dto.analyze.AnalyzeResponseDto;
import com.llm_gateway.dto.ask.AskRequestDto;
import com.llm_gateway.dto.ask.AskResponseDto;
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
        String response = sendToOllama(new Message("user", String.format("My code in %s:\n%s\nExecuted in: %sMs", userRequest.getLanguage(), userRequest.getCode(), userRequest.getTimeMs())), "30s");
        return new AnalyzeResponseDto(response.split(" ")[0], response.split(" ")[1]);
    }

    //TODO: implementar historico de chat com redis
    public AskResponseDto generateResponse(AskRequestDto userRequest){
        String response = sendToOllama(new Message("user", String.format("%s\nMy code in %s:\n%s", userRequest.getQuestion(), userRequest.getLanguage(), userRequest.getCode())), "5m");
        return new AskResponseDto(response);
    }

    private String sendToOllama(Message message, String keepAlive){
        try {
            String json = String.format("""
                    {
                        "model":"online_judge_llm",
                        "message":"%s",
                        "stream":false,
                        "keep_alive": "%s"
                    }
                    """, message.getContent(), keepAlive);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:11434/api/chat"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString((json)))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
