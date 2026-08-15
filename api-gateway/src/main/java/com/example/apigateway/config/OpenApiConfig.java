package com.example.apigateway.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Cinema Booking Microservices - Central API Gateway")
                        .version("1.0.0")
                        .description("Central API Gateway routing proxy, rate limiting, and security orchestration.\n\n" +
                                "### Security Protocols:\n" +
                                "- **Client to Gateway**: Requires header `X-Client-Secret: CinemaClientSecret2026!` on all client API calls.\n" +
                                "- **OAuth2 / JWT Token**: Requires `Authorization: Bearer <JWT_TOKEN>` for protected operations.\n" +
                                "- **Internal Gateway to Service**: Injects `X-API-KEY: SecretApiKey12345` automatically.")
                        .contact(new Contact().name("Cinema Booking Engineering Team").email("support@cinema.lk"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")))
                .addSecurityItem(new SecurityRequirement().addList("ClientSecretAuth").addList("BearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("ClientSecretAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .name("X-Client-Secret")
                                .description("Client-to-Gateway Secret Key header"))
                        .addSecuritySchemes("BearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT Bearer token for user authorization")));
    }
}
