package com.llm_gateway.dto.analyze;

public class AnalyzeRequestDto {
    private String language;
    private String code;
    private String timeMs;

    public AnalyzeRequestDto(String language, String code, String timeMs) {
        this.language = language;
        this.code = code;
        this.timeMs = timeMs;
    }

    public AnalyzeRequestDto(){};

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTimeMs() {
        return timeMs;
    }

    public void setTimeMs(String timeMs) {
        this.timeMs = timeMs;
    }
}
