<?php
	global $userBdd, $mdpBdd, $urlBdd, $cnxBdd;
	$userBdd = "root";
	$mdpBdd = "azerty";
	$urlBdd = 'mysql:dbname=E4Interventions;host=127.0.0.1';

	$cnxBdd = new PDO($urlBdd, $userBdd, $mdpBdd);
	
?>