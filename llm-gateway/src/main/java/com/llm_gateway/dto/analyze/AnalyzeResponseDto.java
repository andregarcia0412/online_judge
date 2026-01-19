package com.llm_gateway.dto.analyze;

public class AnalyzeResponseDto {
    private String complexity;
    private String explanation;

    public AnalyzeResponseDto(String complexity, String explanation) {
        this.complexity = complexity;
        this.explanation = explanation;
    }

    public String getComplexity() {
        return complexity;
    }

    public void setComplexity(String complexity) {
        this.complexity = complexity;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
