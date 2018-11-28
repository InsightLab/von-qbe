# Von-QBE

Von-QBE is a Ontology-Based Query-by-Example system that operates over a relational database using a virtualized RDF Ontology. It assists the user to write queries over the database without any formal query language or previous knowledge about the database structure.

## Running

To execute this system, first you need to install at your local maven repository both [Linked-Graphast]() and [RoR] modules(all in [InsightLab]() repository.
Second, you need to provide 3 files(which must be at home directory) to run the application:

* **ontologiaXML.owl** - the ontology schema that represents the relational data that will be queried;
* **mapping.odba** - the mappings from the ontology schema to the relational database, using [Ontop syntax](https://github.com/ontop/ontop/wiki/ontopOBDAModel), and the JDBC connection parameters;
* **schema.nt** - the ontology schema in N-Triple format.

Once the modules are installed and all the files are in the correct place, you can run QbewebApplication(which will run on port 8080) or generate the *.war* and deploy into a server.
