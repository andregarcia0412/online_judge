package com.llmgateway.domain.llm;

import com.llmgateway.domain.common.Result;
import com.llmgateway.domain.llm.dto.Message;
import com.llmgateway.domain.llm.dto.analyze.AnalyzeRequestDto;
import com.llmgateway.domain.llm.dto.analyze.AnalyzeResponseDto;
import com.llmgateway.domain.llm.dto.ask.AskRequestDto;
import com.llmgateway.domain.llm.dto.ask.AskResponseDto;
import com.llmgateway.domain.llm.dto.chat.ChatRequest;
import com.llmgateway.domain.llm.dto.generate.GenerateRequest;
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

    public Result<AnalyzeResponseDto> analyzeComplexity(AnalyzeRequestDto userRequest){
        Result<String> llmResult = sendToOllamaGenerate(String.format("ANALYZE_COMPLEXITY %s", userRequest.code()));

        if(!llmResult.isOk()){
            return Result.fail(llmResult.getErrorMessage());
        }

        AnalyzeResponseDto response = mapper.readValue(llmResult.getData(), AnalyzeResponseDto.class);
        return Result.ok(response);
    }

    //TODO: implementar historico de chat com redis
    public Result<AskResponseDto> askLlm(AskRequestDto userRequest){
        Result<String> llmResult = sendToOllamaChat(new Message("user", String.format("%s\nMy code in %s:\n%s", userRequest.question(), userRequest.language(), userRequest.code())), "5m");

        if(!llmResult.isOk()){
            return Result.fail(llmResult.getErrorMessage());
        }

        return Result.ok(new AskResponseDto(llmResult.getData()));
    }

    private Result<String> sendToOllamaChat(Message message, String keepAlive){
        try {
            ChatRequest body = new ChatRequest("online_judge_model", new Message[]{ message }, false, keepAlive);
            String json = mapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://ollama:11434/api/chat"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString((json)))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200){
                return Result.fail("Ollama Error: Status " + response.statusCode());
            }

            return Result.ok(response.body());
        } catch (IOException | InterruptedException e) {
            if(e instanceof InterruptedException){
                Thread.currentThread().interrupt();
            }

            return Result.fail("Connection Error: " + e.getMessage());
        }
    }
    private Result<String> sendToOllamaGenerate(String userPrompt){
        try {
            GenerateRequest body = new GenerateRequest("online_judge_model", userPrompt, false, "0");
            String json = mapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://ollama:11434/api/generate"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString((json)))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if(response.statusCode() != 200){
                return Result.fail("Ollama Error: Status " + response.statusCode());
            }

            return Result.ok(response.body());

        } catch (IOException | InterruptedException e) {
            if(e instanceof InterruptedException){
                Thread.currentThread().interrupt();
            }

            return Result.fail("Connection Error: " + e.getMessage());
        }
    }
}
