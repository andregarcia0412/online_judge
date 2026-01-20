package com.llmgateway.domain.llm;

import com.llmgateway.domain.common.Result;
import com.llmgateway.domain.llm.dto.analyze.AnalyzeRequestDto;
import com.llmgateway.domain.llm.dto.analyze.AnalyzeResponseDto;
import com.llmgateway.domain.llm.dto.ask.AskRequestDto;
import com.llmgateway.domain.llm.dto.ask.AskResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/llm")
@CrossOrigin(origins = "*")
public class LlmController {
    private final LlmService llmService;

    public LlmController(LlmService llmService){
        this.llmService = llmService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeComplexity(@Valid @RequestBody AnalyzeRequestDto request){
        Result<AnalyzeResponseDto> result = llmService.analyzeComplexity(request);

        if(!result.isOk()){
            return ResponseEntity.badRequest().body(Map.of("error", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    @PostMapping("/ask")
    public ResponseEntity<?> askLlm(@Valid @RequestBody AskRequestDto request){
        Result<AskResponseDto> result = llmService.askLlm(request);

        if(!result.isOk()){
            return ResponseEntity.badRequest().body(Map.of("error", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }
}
