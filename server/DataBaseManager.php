<?php

header("Access-Control-Allow-Origin: https://diplomarbeit-metzner.de/*");

require 'vendor/autoload.php';

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();

    $json = file_get_contents("php://input");
    $obj = json_decode($json);
    $response = array();

    function createSession($obj){
        // Zugangsdaten
        $db_server =  $_ENV["DB_HOST"];
        $db_benutzer = $_ENV["DB_USERNAME"];
        $db_passwort = $_ENV["DB_PASSWORD"];
        $db_name = $_ENV["DB"];

        try {
            $conn = new PDO("mysql:host=$db_server;dbname=$db_name", $db_benutzer, $db_passwort);

            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $userId = $obj->userId;
            $calcSliderValue = $obj->calcSliderValue;
            $userSliderValue = $obj->userSliderValue;
            $surveyMethod = $obj->surveyMethod;

            $sql = "INSERT INTO t_sessions (UserId, UserRiskValue, CalculatedRiskValue, SurveyMethod) VALUES ('$userId', '$userSliderValue', '$calcSliderValue', '$surveyMethod')";

            $conn->exec($sql);
           
        } catch (PDOException $e) {
            die('Fehler bei der Verbindung zur Datenbank: ' . $e->getMessage());
        }

        $conn = null;

    }

    function insertQuestionForm($obj){

        createSession($obj);

        // Zugangsdaten
        $db_server =  $_ENV["DB_HOST"];
        $db_benutzer = $_ENV["DB_USERNAME"];
        $db_passwort = $_ENV["DB_PASSWORD"];
        $db_name = $_ENV["DB"];
    
        try {
            $conn = new PDO("mysql:host=$db_server;dbname=$db_name", $db_benutzer, $db_passwort);

            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            
            $data = $obj->questionData;
            $userId = $obj->userId;
            $surveyMethod = $obj->surveyMethod;

            $dbTable = "";
         
            switch ($surveyMethod) {
                case "Chatbot":
                    $dbTable = "t_cb_questions";
                    break;

                case "RoboAdvisor":
                    $dbTable = "t_ra_questions";
                    break;
            }

            $sql = "INSERT INTO $dbTable (UserId, PhaseId, PhaseQuestion, Question, Question2, Answer, AnswerValue) VALUES ('$userId',?,?,?,?,?,?)";
            $stmt= $conn->prepare($sql);
            
           try {
                $conn->beginTransaction();

                foreach ($data as $row)
                {
                    $stmt->execute($row);
                }

                $conn->commit();
                $response["success"] = true;

            }catch (Exception $e){
                $response["error"] = $e->getMessage();
                throw $e;
            }

           
        } catch (PDOException $e) {
            $response["error"] = $e->getMessage();
            die($e->getMessage());
        }

        $conn = null;
        return $response;
    }

    insertQuestionForm($obj);
    $json_response = json_encode(true);
    echo $json_response;
?>