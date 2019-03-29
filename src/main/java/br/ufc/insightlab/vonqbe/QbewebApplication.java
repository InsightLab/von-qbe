package br.ufc.insightlab.vonqbe;

import br.ufc.insightlab.linkedgraphast.modules.figer.Figer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import br.ufc.insightlab.vonqbe.property.FileStorageProperties;

@SpringBootApplication
@EnableConfigurationProperties({
	FileStorageProperties.class
})
public class QbewebApplication {

	public static void main(String[] args) {
		SpringApplication.run(QbewebApplication.class, args);
	}
}
