package com.nobug.public_opinion_monitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableConfigurationProperties
@EnableAsync
@EnableScheduling
public class PublicOpinionMonitorApplication {

    public static void main(String[] args) {
        SpringApplication.run(PublicOpinionMonitorApplication.class, args);
    }

}