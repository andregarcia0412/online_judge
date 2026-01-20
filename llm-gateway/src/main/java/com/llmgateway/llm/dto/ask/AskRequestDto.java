package com.llmgateway.llm.dto.ask;

import jakarta.validation.constraints.NotBlank;

public record AskRequestDto (
    @NotBlank(message = "Language can't be blank")
    String language,
    @NotBlank(message = "Code can't be blank")
    String code,
    @NotBlank(message = "Question can't be blank")
    String question
){}
