package com.realnest.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("RealNest API")
                        .description("REST API documentation for the RealNest real estate platform")
                        .version("v1")
                        .contact(new Contact().name("RealNest Team")))
                .externalDocs(new ExternalDocumentation()
                        .description("RealNest Repository")
                        .url("https://example.com"));
    }
}
