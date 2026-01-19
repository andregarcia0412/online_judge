package com.llm_gateway.dto.ask;

public class AskRequestDto {
    private String language;
    private String code;
    private String question;

    public AskRequestDto(String language, String code, String question) {
        this.language = language;
        this.code = code;
        this.question = question;
    }

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

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
