package com.llmgateway.llm.dto.analyze;

public record AnalyzeResponseDto (
    String model,
    String created_at,
    String response,
    String thinking,
    boolean done,
    String done_reason,
    long total_duration,
    long load_duration,
    long prompt_eval_count,
    long prompt_eval_duration,
    long eval_count,
    long eval_duration
){}