# Von-QBE

Von-QBE is a Ontology-Based Query-by-Example system that operates over a relational database using a virtualized RDF Ontology. It assists the user to write queries over the database without any formal query language or previous knowledge about the database structure.

## Running

To run the application, you must have installed:

* Java 8
* Maven
* SBT
* Nodejs
* NPM

To execute this system first you need to install at your local maven repository both [Linked-Graphast](https://github.com/InsightLab/linked-graphast) and [RoR](https://github.com/InsightLab/rdf-over-rdbms).

At the first time you run the system(or every time that anything is changed at the front-end), you will need to run:

`./build-and-run port host`

Where:

* **port**: the port where the application will run (default: 8080);
* **host**: the host where the server will run (public IP, local networl IP or localhost[default])

If you had already made one build, you can just run the server:
`./run-server port`

Note that the port must be the same specified at the **build-and-run** script, since the React front-end has been built configuring the requests to that port and host.

After the system is up, you can configure the databases and ontologies that you want to connect. To add a database, you need to upload 2 files:

* **mapping file** - the mappings from the ontology schema to the relational database, using [Ontop syntax](https://github.com/ontop/ontop/wiki/ontopOBDAModel), and the JDBC connection parameters. You can check a [example](https://github.com/InsightLab/von-qbe/blob/develop/src/main/resources/mapping.odba) at the resources folder
* **ontology schema file** - the ontology schema. Now, Von-QBE supports nt, rdf, xml and owl formats.

## Docker
To deploy Von-QBE on a docker container, go to the [docker folder](https://github.com/InsightLab/von-qbe/tree/develop/docker).
