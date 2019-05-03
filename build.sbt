name := "von_qbe"
 
version := "4.0"
      
lazy val `von_qbe` = (project in file(".")).enablePlugins(PlayScala)
val macwire = "com.softwaremill.macwire" %% "macros" % "2.3.0" % "provided"

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"
      
resolvers += "Akka Snapshot Repository" at "http://repo.akka.io/snapshots/"
      
scalaVersion := "2.12.2"

libraryDependencies ++= Seq("com.softwaremill.macwire" %% "macros" % "2.3.0", jdbc , ehcache , ws , specs2 % Test , guice )

unmanagedResourceDirectories in Test <+=  baseDirectory ( _ /"target/web/public/test" )

/*libraryDependencies += "com.softwaremill.macwire" %% "util" % "2.2.0"*/
/*libraryDependencies += "com.softwaremill.macwire" %% "macros" % "2.2.0"*/

/*libraryDependencies ++= Seq("com.softwaremill.macwire" %% "macros" % "" % "provided")*/