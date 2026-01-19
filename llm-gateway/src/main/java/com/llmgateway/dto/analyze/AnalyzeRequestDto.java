package com.llmgateway.dto.analyze;

import jakarta.validation.constraints.NotBlank;
public class AnalyzeRequestDto {
    @NotBlank(message = "Code can't be blank")
    private String code;

    public AnalyzeRequestDto(String code) {
        this.code = code;
    }

    public AnalyzeRequestDto(){};

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
