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
		System.out.println("Total memory: "+Runtime.getRuntime().totalMemory()/1024.0/1024.0/1024.0);
		System.out.println("Free memory: "+Runtime.getRuntime().freeMemory()/1024.0/1024.0/1024.0);
//		Figer.init("src/main/resources/figer.conf");
		SpringApplication.run(QbewebApplication.class, args);
	}
}
