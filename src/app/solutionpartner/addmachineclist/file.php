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
    $project_id= json_encode($exceldata->project_id);

    $data = json_decode($data);
    $project_id= json_decode($project_id);

    $returnData = array();
  if(isset($postdata) && !empty($postdata) && $response!=false)
  {
   
   
   foreach($data as $val)
    {
     
        $machinename  = $data->Machine_Name;
        $desc = $data->Decription;
        $Industry_sector_1 = $data->Industry_sector_1;
        $industry_sector_2 = $data->Industry_sector_2;
        $application= $data->Application;
        $phase = $data->Machine_Phase;
       
        $date = date("Y/m/d");


        if(strlen($machinename) == 0 || strlen($desc) == 0 || strlen($phase) == 0){
            echo json_encode(array("message" =>"Please enter correct value.","ok" => false));
          }else{
            $sql1 = "INSERT INTO project22.add_machine_details( project_id, machine_name, machine_description ,machine_phase, industry_sector_1, industry_sector, application, last_update) 
                    VALUES('$project_id','$machinename','$desc', '$phase', '$Industry_sector_1', '$industry_sector_2', '$application', '$date')";    
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
    $project_id= json_encode($exceldata->project_id);

    $data = json_decode($data);
    $returnData = array();
  if(isset($postdata) && !empty($postdata) && $response!=false)
  {
   
   
   foreach($data as $val)
    {
     
        $machinename  = $data->Machine_Name;
        $desc = $data->Decription;
        $Industry_sector_1 = $data->Industry_sector_1;
        $industry_sector_2 = $data->Industry_sector_2;
        $application= $data->Application;
        $phase = $data->Machine_Phase;
       
        $date = date("Y/m/d");


        if(strlen($machinename) == 0 || strlen($desc) == 0 || strlen($phase) == 0){
            echo json_encode(array("message" =>"Please enter correct value.","ok" => false));
          }else{
            $sql1 = "INSERT INTO project22.add_machine_details( project_id, machine_name, machine_description ,machine_phase, industry_sector_1, industry_sector, application, last_update) 
                    VALUES('$project_id','$machinename','$desc', '$phase', '$Industry_sector_1', '$industry_sector_2', '$application', '$date')";    
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
    $project_id= json_encode($exceldata->project_id);

    $data = json_decode($data);
    $project_id= json_decode( $project_id);

    $returnData = array();
  if(isset($postdata) && !empty($postdata) && $response!=false)
  {
    $project_id= json_decode( $project_id);

   
   foreach($data as $val)

    {

               $machinename   = mysqli_real_escape_string($con, trim($val->Machine_Name));
               $desc  = mysqli_real_escape_string($con, trim($val->Decription));


               $Industry_sector_1 = mysqli_real_escape_string($con, trim($val->Industry_sector_1));

               $industry_sector_2 = mysqli_real_escape_string($con, trim($val->Industry_sector_2));

               $application = mysqli_real_escape_string($con, trim($val->Application));

               $phase  = mysqli_real_escape_string($con, trim($val->Machine_Phase));


              
        $date = date("Y/m/d");


        if(strlen($machinename) == 0 || strlen($desc) == 0 || strlen($phase) == 0){
            echo json_encode(array("message" =>"Please enter correct value.","ok" => false));
          }else{
           echo json_encode( $project_id);

            $sql1 = "INSERT INTO project22.add_machine_details( project_id, machine_name, machine_description ,machine_phase, industry_sector_1, industry_sector, application, last_update) 
                    VALUES('$project_id','$machinename','$desc', '$phase', '$Industry_sector_1', '$industry_sector_2', '$application', '$date')";    

          }

     
    }
     }else{
      echo "Data is not found!";
  }

  ?>

