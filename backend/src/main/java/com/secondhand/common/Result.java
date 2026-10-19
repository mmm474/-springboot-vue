package com.secondhand.common;

import lombok.Data;

import java.io.Serializable;

/**
 * 统一响应结果
 */
@Data
public class Result<T> implements Serializable {

    private Integer code;
    private String msg;
    private Boolean success;
    private T data;

    public Result() {
    }

    public Result(Integer code, String msg, Boolean success, T data) {
        this.code = code;
        this.msg = msg;
        this.success = success;
        this.data = data;
    }

    public static <T> Result<T> success() {
        return new Result<>(200, "操作成功", true, null);
    }

    public static <T> Result<T> success(String msg) {
        return new Result<>(200, msg, true, null);
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(200, "操作成功", true, data);
    }

    public static <T> Result<T> success(String msg, T data) {
        return new Result<>(200, msg, true, data);
    }

    public static <T> Result<T> fail(String msg) {
        return new Result<>(201, msg, false, null);
    }

    public static <T> Result<T> fail(Integer code, String msg) {
        return new Result<>(code, msg, false, null);
    }

    public static <T> Result<T> fail(Integer code, String msg, T data) {
        return new Result<>(code, msg, false, data);
    }
}
