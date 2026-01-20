package com.llmgateway.domain.llm.dto.chat;

import com.llmgateway.domain.llm.dto.Message;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record ChatRequest (
        @NotBlank
        String model,

        @NotEmpty
        Message[] messages,

        boolean stream,

        @NotBlank
        String keep_alive
){}
