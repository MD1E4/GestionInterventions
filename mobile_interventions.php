<?php
	include_once("lib/dbcnx.php");

	session_start();
	$codeUser = $_SESSION['code_user'];

	if(isset($_GET['getMesInters']))
	{
		if($_SESSION['code_user'] == '')
		{
			echo "";
		}
		else
		{
			$req = "SELECT Code_intervention, TIME(Date_prevue) Heure_prevue
			FROM T_PILOTAGE
			WHERE code_agent = '".$_SESSION['code_user']."'
			AND id_etat IN (1, 4)
			AND DATE(Date_prevue) = '2013-03-13'
			ORDER BY 2";

			$query = $cnxBdd->prepare($req);
			$query->execute();
			$res = $query->fetchAll(PDO::FETCH_ASSOC);

			header('Content-Type: application/json;');
			echo json_encode($res);
		}
	}

	if(isset($_GET['getMonInter']))
	{
		$codeInter = $_POST['codeInter'];

		$req = "SELECT Code_intervention, TIME(Date_prevue) Heure_prevue, Duree_prevue, Code_site, prio.libelle Priorite, Utilisateur, Id_etat
			FROM T_PILOTAGE p INNER JOIN T_PRIORITE prio ON p.Id_priorite = prio.id
			WHERE code_intervention = '".$codeInter."'";

		$query = $cnxBdd->prepare($req);
		$query->execute();
		$res = $query->fetchAll(PDO::FETCH_ASSOC);

		header('Content-Type: application/json;');
		echo json_encode($res);
	}

	if(isset($_GET['getEnCours']))
	{
		$req = "SELECT Code_intervention, TIME(Date_prevue) Heure_prevue
			FROM T_PILOTAGE
			WHERE id_etat = 4
			AND DATE(Date_prevue) = '2013-03-13'";

		$query = $cnxBdd->prepare($req);
		$query->execute();
		$res = $query->fetchAll(PDO::FETCH_ASSOC);

		header('Content-Type: application/json;');
		echo json_encode($res);
	}

?>