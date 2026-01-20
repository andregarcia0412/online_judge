package com.llmgateway.llm.dto;

import jakarta.validation.constraints.NotBlank;

public record Message (
    @NotBlank
    String role,
    @NotBlank
    String content
){}
