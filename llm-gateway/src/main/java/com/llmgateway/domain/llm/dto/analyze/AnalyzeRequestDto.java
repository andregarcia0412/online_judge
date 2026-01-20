package com.llmgateway.domain.llm.dto.analyze;

import jakarta.validation.constraints.NotBlank;
public record AnalyzeRequestDto (
    @NotBlank(message = "Code can't be blank")
    String code
){}
