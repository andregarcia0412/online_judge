package com.llm_gateway.controller;

import com.llm_gateway.dto.analyze.AnalyzeRequestDto;
import com.llm_gateway.dto.analyze.AnalyzeResponseDto;
import com.llm_gateway.dto.ask.AskRequestDto;
import com.llm_gateway.dto.ask.AskResponseDto;
import com.llm_gateway.service.LlmService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/llm")
@CrossOrigin(origins = "*")
public class LlmController {
    private final LlmService llmService;

    public LlmController(LlmService llmService){
        this.llmService = llmService;
    }

    @PostMapping("/analyze")
    public AnalyzeResponseDto analyzeComplexity(@RequestBody AnalyzeRequestDto request){
        return llmService.analyzeComplexity(request);
    }

    @PostMapping("/ask")
    public AskResponseDto generateResponse(@RequestBody AskRequestDto request){
        return llmService.generateResponse(request);
    }
}
