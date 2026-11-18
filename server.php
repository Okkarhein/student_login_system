<?php
    $servername="localhost";
    $username="root";
    $password="";
    $databasename="student_register";

    $connection=new mysqli($servername, $username, $password, $databasename);
    if($connection->connect_error)
        {
            die("Connection Failed". $connection->connect_error);
        }
?>