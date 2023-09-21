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

// $data = [{"Customer Number": 1,"Customer Name": "customer 1 ","Location": "germany"},{"Customer Number": 2,"Customer Name": "customer 2","Location": "germany"}]
  $postdata = file_get_contents("php://input");

  if(isset($postdata) && !empty($postdata) && $response!=false)
  {
    $currentdate = date("Y/m/d");
    $missingvalue = [];
    $exceldata = json_decode($postdata);
    $data= json_encode($exceldata->data);
    $data = json_decode($data);
    $returnData = array();
    foreach($data as $val)
    {
        $customer_number = mysqli_real_escape_string($con, trim($val->customer_number));
        $customer_name = mysqli_real_escape_string($con, trim($val->customer_name));
        $location = mysqli_real_escape_string($con, trim($val->location));

        if(strlen($customer_number) != 0 && strlen($customer_name) != 0 && strlen($location) != 0){
          $queries = "SELECT * FROM project32.project where project.project_number ='$customer_number' and project.solutionpartner_registered_id = '$solutionpartner_registered_id'";
            $get_project_number = mysqli_query($con,$queries);
            $rowss = mysqli_num_rows($get_project_number);
            if($rowss == 1){
              // Project already Exist
              $message = array("message" => "Customer Number: '$customer_number' already exist.","ok" => false);
              array_push($returnData,$message);
            }else{
              $addCustomerDetails = "INSERT INTO project32.project( project_number, project_name ,project_location, solutionpartner_registered_id, user_id) 
              VALUES('$customer_number','$customer_name','$location', '$solutionpartner_registered_id', '$user_id')";
              $response = mysqli_query($con,$addCustomerDetails);
              $message = array("message" => "Customer Name: '$customer_name' successfully added!","ok" => true);
              array_push($returnData,$message);
            }
        }
    }
    if(!$response)
    {
        echo json_encode(array("message" =>"Data Is Not Inserted","ok" => false));
    }
    else
    {
        echo json_encode($returnData);

    }
  }else{
      echo "Data is not found!";
  }

?>