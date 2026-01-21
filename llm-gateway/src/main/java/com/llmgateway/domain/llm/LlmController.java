package com.llmgateway.domain.llm;

import com.llmgateway.domain.common.Result;
import com.llmgateway.domain.llm.dto.analyze.AnalyzeRequestDto;
import com.llmgateway.domain.llm.dto.analyze.AnalyzeResponseDto;
import com.llmgateway.domain.llm.dto.ask.AskRequestDto;
import com.llmgateway.domain.llm.dto.ask.AskResponseDto;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AnalyzeResponseDto.class)
                    )
            ),
    })
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeComplexity(@Valid @RequestBody AnalyzeRequestDto request){
        Result<AnalyzeResponseDto> result = llmService.analyzeComplexity(request);

        if(!result.isOk()){
            return ResponseEntity.badRequest().body(Map.of("error", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AskResponseDto.class)
    )
            )
    })
    @PostMapping("/ask")
    public ResponseEntity<?> askLlm(@Valid @RequestBody AskRequestDto request){
        Result<AskResponseDto> result = llmService.askLlm(request);

        if(!result.isOk()){
            return ResponseEntity.badRequest().body(Map.of("error", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }
}
