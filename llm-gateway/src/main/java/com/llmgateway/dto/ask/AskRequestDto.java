package com.llmgateway.dto.ask;

import jakarta.validation.constraints.NotBlank;

public class AskRequestDto {
    @NotBlank(message = "Language can't be blank")
    private String language;
    @NotBlank(message = "Code can't be blank")
    private String code;
    @NotBlank(message = "Question can't be blank")
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
