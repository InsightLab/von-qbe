# Running on Docker

To easly run Von-QBE on a Docker container you just have to build the container passing the following arguments:
* **ip**: the machine visible IP, which will be used on React build to direct the requests to the websevice (default is localhost)
* **port**: the application port, which is going to be used by React build and Spring

The build command is:
`docker build -t <your_awesome_env_name> --build-arg ip=<machine_visible_ip> --build-arg port=<application_port> .`
