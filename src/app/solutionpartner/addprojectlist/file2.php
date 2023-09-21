<?php
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    die();
  }

  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
 
  require "config1.php";
  
  // Getting token from Header / Request parameter******************************************************
	require 'jwtTokenValidationForGetRequest.php';
	$header = apache_request_headers();
  $token = $header['token'];
	
	$response=isvalidToken($token);
	$user_id=$response['user_id'];
	$solutionpartner_registered_id=$response['company_registered_id'];
	
//**********************************************************************************************

  $postdata = file_get_contents("php://input");

     $currentdate = date("Y/m/d");
    $missingvalue = [];
    $exceldata = json_decode($postdata);
    $data= json_encode($exceldata->data);
    $data = json_decode($data);
    $returnData = array();
     echo json_encode($postdata);

    
  
?>