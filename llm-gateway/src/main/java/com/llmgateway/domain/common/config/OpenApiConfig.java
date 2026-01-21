package com.llmgateway.domain.common.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "online judge LLM Gateway"
        )
)

@Configuration
public class OpenApiConfig {
}
