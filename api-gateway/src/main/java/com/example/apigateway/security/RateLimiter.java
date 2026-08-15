package com.example.apigateway.security;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiter {

    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private final Map<String, ClientRateLimit> clients = new ConcurrentHashMap<>();

    public synchronized boolean isAllowed(String clientIp) {
        long currentTime = System.currentTimeMillis();
        ClientRateLimit rateLimit = clients.computeIfAbsent(clientIp, k -> new ClientRateLimit(currentTime));

        if (currentTime - rateLimit.startTime > 60000) {
            rateLimit.startTime = currentTime;
            rateLimit.requestCount = 1;
            return true;
        }

        if (rateLimit.requestCount < MAX_REQUESTS_PER_MINUTE) {
            rateLimit.requestCount++;
            return true;
        }

        return false;
    }

    private static class ClientRateLimit {
        long startTime;
        int requestCount;

        ClientRateLimit(long startTime) {
            this.startTime = startTime;
            this.requestCount = 1;
        }
    }
}
