package com.llmgateway.llm;

import com.llmgateway.llm.dto.analyze.AnalyzeRequestDto;
import com.llmgateway.llm.dto.analyze.AnalyzeResponseDto;
import com.llmgateway.llm.dto.ask.AskRequestDto;
import com.llmgateway.llm.dto.ask.AskResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<AnalyzeResponseDto> analyzeComplexity(@Valid @RequestBody AnalyzeRequestDto request){
        return new ResponseEntity<>(llmService.analyzeComplexity(request), HttpStatus.OK);
    }

    @PostMapping("/ask")
    public ResponseEntity<AskResponseDto> generateResponse(@RequestBody AskRequestDto request){
        return new ResponseEntity<>(llmService.generateResponse(request), HttpStatus.CREATED);
    }
}
