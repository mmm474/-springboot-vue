package com.secondhand.common;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Random;

/**
 * 验证码工具类（生成 SVG 字符串，与原 svg-captcha 行为对齐）
 */
public class CaptchaUtil {

    private static final Random RANDOM = new Random();
    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    /**
     * 生成 4 位验证码文本
     */
    public static String generateText() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    /**
     * 生成验证码 SVG
     */
    public static String generateSvg(String text) {
        int width = 150;
        int height = 80;

        StringBuilder svg = new StringBuilder();
        svg.append("<svg xmlns='http://www.w3.org/2000/svg' width='").append(width)
                .append("' height='").append(height).append("'>");
        // 背景
        svg.append("<rect width='100%' height='100%' fill='#cc9966'/>");

        // 干扰线
        for (int i = 0; i < 4; i++) {
            int x1 = RANDOM.nextInt(width);
            int y1 = RANDOM.nextInt(height);
            int x2 = RANDOM.nextInt(width);
            int y2 = RANDOM.nextInt(height);
            svg.append("<line x1='").append(x1).append("' y1='").append(y1)
                    .append("' x2='").append(x2).append("' y2='").append(y2)
                    .append("' stroke='").append(randomColor()).append("' stroke-width='1'/>");
        }

        // 文字
        int charWidth = width / (text.length() + 1);
        for (int i = 0; i < text.length(); i++) {
            int x = charWidth * (i + 1);
            int y = 50 + RANDOM.nextInt(15);
            int fontSize = 44 + RANDOM.nextInt(10);
            int rotate = RANDOM.nextInt(40) - 20;
            svg.append("<text x='").append(x).append("' y='").append(y)
                    .append("' font-size='").append(fontSize)
                    .append("' fill='").append(randomColor())
                    .append("' font-family='Arial' font-weight='bold' text-anchor='middle'")
                    .append(" transform='rotate(").append(rotate).append(",").append(x).append(",").append(y).append(")'")
                    .append(">").append(text.charAt(i)).append("</text>");
        }

        // 干扰点
        for (int i = 0; i < 30; i++) {
            int x = RANDOM.nextInt(width);
            int y = RANDOM.nextInt(height);
            svg.append("<circle cx='").append(x).append("' cy='").append(y)
                    .append("' r='1' fill='").append(randomColor()).append("'/>");
        }

        svg.append("</svg>");
        return svg.toString();
    }

    private static String randomColor() {
        int r = RANDOM.nextInt(120);
        int g = RANDOM.nextInt(120);
        int b = RANDOM.nextInt(120);
        return String.format("#%02x%02x%02x", r, g, b);
    }
}
