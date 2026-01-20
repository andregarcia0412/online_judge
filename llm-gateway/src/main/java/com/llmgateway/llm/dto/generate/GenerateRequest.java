package com.llmgateway.llm.dto.generate;

import jakarta.validation.constraints.NotBlank;

public record GenerateRequest (
        @NotBlank
        String model,

        @NotBlank
        String prompt,

        boolean stream,

        @NotBlank
        String keep_alive
){}
