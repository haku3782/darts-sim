package com.example.dartssimapi.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** バックエンド疎通確認用エンドポイント */
@RestController
public class HelloController {

    @CrossOrigin(origins = "*")
    @GetMapping("/api/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Hello from Darts API! バックエンドとの通信成功です！");
    }
}
