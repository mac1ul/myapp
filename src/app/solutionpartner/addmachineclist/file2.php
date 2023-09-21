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
	//$token = $_GET['token'];
	
	$response=isvalidToken($token);
	$userID=$response['user_id'];
	$solutionpartner_registered_id=$response['company_registered_id'];
	
//**********************************************************************************************

  $postdata = file_get_contents("php://input");

    $exceldata = json_decode($postdata);
    $data= json_encode($exceldata->data);
    
    $data = json_decode($data);
	
             echo json_encode($data);




  if(isset($postdata) && !empty($postdata) && $response!=false)
  {
    $currentdate = date("Y/m/d");
    $missingvalue = [];
    $exceldata = json_decode($postdata);
    $data= json_encode($exceldata->data);
 

    $data = json_decode($data);
	
	$getPartnerDetails =$con->prepare("SELECT location_name, solution_partner_company_name FROM project32.get_solution_partner_details where solutionpartner_registered_id='$solutionpartner_registered_id'");
    $getPartnerDetails->execute();
    $result = $getPartnerDetails->get_result();

    while($row = $result->fetch_assoc()){
        $location=  $row['location_name'];
        $solution_partner_company_name=  $row['solution_partner_company_name'];
    }
    $sql = "DELETE FROM project32.stockofsi WHERE stockofsi.company_registered_id ='$solutionpartner_registered_id'";
	
	if(mysqli_query($con,$sql))
  	{
    	// echo 'All Previous Entry has been Deleted';
  	}
  	else
  	{
    	echo json_encode(array("message" =>"Record is not Deleted","ok" => false));
  	}
   echo "<s";
 echo $data ;
 echo ">";
    foreach($data as $val)
    {
       
        // Store the data in one variable and check it
        $partnumber = mysqli_real_escape_string($con, trim($val->PartNumber));
        $typecode = mysqli_real_escape_string($con, trim($val->Typecode));
        // $country = mysqli_real_escape_string($con, trim($val->Country));
        // $company_name = mysqli_real_escape_string($con, trim($val->Company));
        $contact_person_email = mysqli_real_escape_string($con, trim($val->Email));
        $telephone = mysqli_real_escape_string($con, trim($val->Telephone));
        $mobile = mysqli_real_escape_string($con, trim($val->Mobile));
        $website = mysqli_real_escape_string($con, trim($val->Website));
        $quantity = mysqli_real_escape_string($con, trim($val->Quantity));

		$InsertNewStock = "INSERT INTO project32.stockofsi(
            company_registered_id,
			company_status,
            partnumber,
            typecode,
            country,
            company_name,
            contact_person_email,
            telephone,
            mobile,
            website,
            `update`,
            quantity,
            location,
			uploaded_by_user_id) VALUES(
                                '$solutionpartner_registered_id',
								'Solution_Partner',
                                '$partnumber',
                                '$typecode',
                                '$location',
                                '$solution_partner_company_name',
                                '$contact_person_email',
                                '$telephone',
                                '$mobile',
                                '$website',
                                '$currentdate',
                                '$quantity',
                                '$country',
								'$userID')";
            $response = mysqli_query($con,$InsertNewStock);
        // echo $InsertNewStock;
    }
    if(!$response)
    {
        echo json_encode(array("message" =>"Data Is Not Inserted","ok" => false));
    }
    else
    {
        echo json_encode(array("message" =>"Your latest stock has updated","ok" => true));
    }
  }else{
      echo "Data is not found!";
  }


   
?>


