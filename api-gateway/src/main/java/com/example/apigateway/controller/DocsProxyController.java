package com.example.apigateway.controller;

import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Hidden
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api-docs")
public class DocsProxyController {

    @Value("${auth.service.url:http://localhost:8081}")
    private String authServiceUrl;

    @Value("${movie.service.url:http://localhost:8082}")
    private String movieServiceUrl;

    @Value("${booking.service.url:http://localhost:8083}")
    private String bookingServiceUrl;

    @Value("${notification.service.url:http://localhost:8084}")
    private String notificationServiceUrl;

    @Value("${payment.service.url:http://localhost:8085}")
    private String paymentServiceUrl;

    @Value("${api.key.secret:SecretApiKey12345}")
    private String internalApiKey;

    private final RestTemplate restTemplate;

    public DocsProxyController() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(4000);
        factory.setReadTimeout(5000);
        this.restTemplate = new RestTemplate(factory);
    }

    @GetMapping("/{service}")
    public ResponseEntity<String> getServiceDocs(@PathVariable String service) {
        String targetUrl;
        switch (service.toLowerCase()) {
            case "auth":
                targetUrl = authServiceUrl + "/v3/api-docs";
                break;
            case "movies":
            case "movie":
                targetUrl = movieServiceUrl + "/v3/api-docs";
                break;
            case "bookings":
            case "booking":
                targetUrl = bookingServiceUrl + "/v3/api-docs";
                break;
            case "notifications":
            case "notification":
                targetUrl = notificationServiceUrl + "/v3/api-docs";
                break;
            case "payments":
            case "payment":
                targetUrl = paymentServiceUrl + "/v3/api-docs";
                break;
            default:
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"error\": \"Service documentation not found for: " + service + "\"}");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-API-KEY", internalApiKey);
            headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    targetUrl,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_JSON);
            return new ResponseEntity<>(response.getBody(), responseHeaders, response.getStatusCode());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\": \"Failed to fetch documentation from downstream service (" + service + "): " + e.getMessage() + "\"}");
        }
    }
}
