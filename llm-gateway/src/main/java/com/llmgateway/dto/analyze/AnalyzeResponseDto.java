package com.llmgateway.dto.analyze;

public class AnalyzeResponseDto {
    private String model;
    private String created_at;
    private String response;
    private String thinking;
    private boolean done;
    private String done_reason;
    private long total_duration;
    private long load_duration;
    private long prompt_eval_count;
    private long prompt_eval_duration;
    private long eval_count;
    private long eval_duration;

    public AnalyzeResponseDto(String model, String created_at, String response, String thinking, boolean done, String done_reason, long total_duration, long load_duration, long prompt_eval_count, long prompt_eval_duration, long eval_count, long eval_duration) {
        this.model = model;
        this.created_at = created_at;
        this.response = response;
        this.thinking = thinking;
        this.done = done;
        this.done_reason = done_reason;
        this.total_duration = total_duration;
        this.load_duration = load_duration;
        this.prompt_eval_count = prompt_eval_count;
        this.prompt_eval_duration = prompt_eval_duration;
        this.eval_count = eval_count;
        this.eval_duration = eval_duration;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getThinking() {
        return thinking;
    }

    public void setThinking(String thinking) {
        this.thinking = thinking;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public String getDone_reason() {
        return done_reason;
    }

    public void setDone_reason(String done_reason) {
        this.done_reason = done_reason;
    }

    public long getTotal_duration() {
        return total_duration;
    }

    public void setTotal_duration(long total_duration) {
        this.total_duration = total_duration;
    }

    public long getLoad_duration() {
        return load_duration;
    }

    public void setLoad_duration(long load_duration) {
        this.load_duration = load_duration;
    }

    public long getPrompt_eval_count() {
        return prompt_eval_count;
    }

    public void setPrompt_eval_count(long prompt_eval_count) {
        this.prompt_eval_count = prompt_eval_count;
    }

    public long getPrompt_eval_duration() {
        return prompt_eval_duration;
    }

    public void setPrompt_eval_duration(long prompt_eval_duration) {
        this.prompt_eval_duration = prompt_eval_duration;
    }

    public long getEval_count() {
        return eval_count;
    }

    public void setEval_count(long eval_count) {
        this.eval_count = eval_count;
    }

    public long getEval_duration() {
        return eval_duration;
    }

    public void setEval_duration(long eval_duration) {
        this.eval_duration = eval_duration;
    }
}
