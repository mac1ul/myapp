<?Php
header('Access-Control-Allow-Origin: * ');
header('Access-Control-Allow-Headers: Origin, content-type, X-Requested-With, Accept');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// Internet Database of SPM Project 09
$host = "fe0vm2043.rbdmz01.com";
$port = 38150;
$socket = "";
$user = "kne1mk";
$password = "VK#vfrtg1dft5";
$dbname = "project09";


// $host = "fe0vmc1208.de.bosch.com";
// $port = 38150;
// $socket = "";
// $user = "Admin";
// $password = "welcom321#4";
// $dbname = "project09";

//Herstellung der Verbindung zum MySQL Server
$con = mysqli_connect( $host, $user, $password, $dbname, $port, $socket );

if ( $con ) {
	//echo "- ";
} else {
	die( "Keine Verbindung zum MySQL Server moglich" . mysqli_connect_error() );
}

//Herstellung der Verbindung zur Datenbank
$db_link = mysqli_select_db( $con, $dbname );

if ( $db_link ) {
	//echo "-";
} else {
	die( "Keine Verbindung zur Datenbank war nicht moglich" );
}


// Local Database of SPM Project 09
// $host = "fe0vmc1208.de.bosch.com";
// $port = 38150;
// $socket = "";
// $user = "Admin";
// $password = "welcom321#4";
// $dbname = "project09";

// Internet Database of SPM Project 09
// $host = "fe0vm2043.rbdmz01.com";
// $port = 38150;
// $socket = "";
// $user = "kne1mk";
// $password = "VK#vfrtg1dft5";
// $dbname = "project09";

// Local Mobile Hydraulics Database 
// $host = "fe0vmc1208.de.bosch.com";
// $port = 38150;
// $socket = "";
// $user = "Admin";
// $password = "welcom321#4";
// $dbname = "mobilehydraulics";
?>
