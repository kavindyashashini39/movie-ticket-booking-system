package com.example.apigateway.controller;

import com.example.apigateway.security.JwtGatewayValidator;
import com.example.apigateway.security.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Collections;
import java.util.Enumeration;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@Tag(name = "Central Gateway Proxy", description = "Central API Gateway proxy routing, JWT token verification, and Client Secret enforcement")
public class GatewayProxyController {

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

    @Value("${client.secret.key:CinemaClientSecret2026!}")
    private String expectedClientSecret;

    @Value("${api.key.secret:SecretApiKey12345}")
    private String internalApiKey;

    @Autowired
    private JwtGatewayValidator jwtValidator;

    @Autowired
    private RateLimiter rateLimiter;

    private final RestTemplate restTemplate;

    public GatewayProxyController() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        this.restTemplate = new RestTemplate(factory);
    }

    @GetMapping("/")
    @Operation(summary = "Gateway Health Check", description = "Checks if the Central API Gateway is operational")
    public ResponseEntity<?> rootHealthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "gateway", "Central API Gateway",
            "message", "Cinema Booking System API Gateway is running successfully!",
            "clientSecretHeaderRequired", "X-Client-Secret",
            "swaggerUi", "http://localhost:8080/swagger-ui.html"
        ));
    }

    @RequestMapping(value = {"/auth/**", "/movies/**", "/bookings/**", "/notifications/**", "/payments/**"},
            method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
    @Operation(summary = "Proxy Request Handler", description = "Validates X-Client-Secret, checks JWT token (if protected), and forwards request downstream with X-API-KEY")
    public ResponseEntity<?> handleProxy(
            @RequestBody(required = false) byte[] body,
            HttpServletRequest request) {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // 1. CORS Preflight Handling
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return ResponseEntity.ok().build();
        }

        // 2. Client-to-Gateway Secret Key Verification
        String clientSecretHeader = request.getHeader("X-Client-Secret");
        if (clientSecretHeader == null || !clientSecretHeader.equals(expectedClientSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "error", "Unauthorized",
                        "message", "Invalid or missing X-Client-Secret header. Client to API Gateway secret authentication failed."
                    ));
        }

        // 3. Rate Limiting Check
        String clientIp = getClientIp(request);
        if (!rateLimiter.isAllowed(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Rate limit exceeded", "message", "Too many requests. Please try again later."));
        }

        // 4. OAuth 2.0 / JWT Verification Check for Protected Endpoints
        boolean isPublic = path.startsWith("/auth/login") ||
                           path.startsWith("/auth/register") ||
                           (path.startsWith("/movies") && "GET".equalsIgnoreCase(method));

        if (!isPublic) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized", "message", "Missing or invalid Bearer JWT Token in Authorization header."));
            }
            String token = authHeader.substring(7);
            if (!jwtValidator.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized", "message", "JWT token expired or signature invalid."));
            }
        }

        // 5. Resolve Target Microservice URL
        String targetBaseUrl;
        if (path.startsWith("/auth")) {
            targetBaseUrl = authServiceUrl;
        } else if (path.startsWith("/movies")) {
            targetBaseUrl = movieServiceUrl;
        } else if (path.startsWith("/bookings")) {
            targetBaseUrl = bookingServiceUrl;
        } else if (path.startsWith("/notifications")) {
            targetBaseUrl = notificationServiceUrl;
        } else if (path.startsWith("/payments")) {
            targetBaseUrl = paymentServiceUrl;
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Route not found"));
        }

        String queryString = request.getQueryString();
        String targetUrl = targetBaseUrl + path + (queryString != null ? "?" + queryString : "");

        // 6. Construct Downstream Request with Injected X-API-KEY
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        if (headerNames != null) {
            while (headerNames.hasMoreElements()) {
                String name = headerNames.nextElement();
                if (!name.equalsIgnoreCase("host") &&
                    !name.equalsIgnoreCase("content-length") &&
                    !name.equalsIgnoreCase("transfer-encoding") &&
                    !name.equalsIgnoreCase("connection") &&
                    !name.equalsIgnoreCase("accept-encoding")) {
                    headers.put(name, Collections.list(request.getHeaders(name)));
                }
            }
        }
        headers.set("X-API-KEY", internalApiKey); // Injected Gateway Security Header

        HttpEntity<byte[]> httpEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(
                    URI.create(targetUrl),
                    HttpMethod.valueOf(method),
                    httpEntity,
                    byte[].class
            );

            HttpHeaders responseHeaders = filterResponseHeaders(response.getHeaders());
            return new ResponseEntity<>(response.getBody(), responseHeaders, response.getStatusCode());
        } catch (HttpStatusCodeException e) {
            HttpHeaders responseHeaders = filterResponseHeaders(e.getResponseHeaders());
            return ResponseEntity.status(e.getStatusCode())
                    .headers(responseHeaders)
                    .body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "Bad Gateway", "message", "Unable to connect to downstream microservice: " + e.getMessage()));
        }
    }

    private HttpHeaders filterResponseHeaders(HttpHeaders headers) {
        HttpHeaders cleanHeaders = new HttpHeaders();
        if (headers != null) {
            headers.forEach((name, values) -> {
                if (!name.equalsIgnoreCase("Transfer-Encoding") &&
                    !name.equalsIgnoreCase("Content-Length") &&
                    !name.equalsIgnoreCase("Connection") &&
                    !name.equalsIgnoreCase("Keep-Alive")) {
                    cleanHeaders.put(name, values);
                }
            });
        }
        return cleanHeaders;
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
