package com.llmgateway.dto.ask;

public class AskResponseDto {
    private String response;

    public AskResponseDto(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}
