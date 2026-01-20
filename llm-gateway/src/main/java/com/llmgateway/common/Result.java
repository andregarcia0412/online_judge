package com.llmgateway.common;

public class Result<T> {
    private final T data;
    private final String errorMessage;
    private final boolean success;

    private Result(T data, String errorMessage, boolean success) {
        this.data = data;
        this.errorMessage = errorMessage;
        this.success = success;
    }

    public static <T>Result<T> ok(T data){
        return new Result<>(data, null, true);
    }

    public static <T>Result<T> fail (String errorMessage){
        return new Result<>(null, errorMessage, false);
    }

    public boolean isOk(){
        return success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public T getData(){
        return data;
    }
}
