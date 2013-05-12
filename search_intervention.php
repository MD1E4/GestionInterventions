<?php 
header('Content-Type: text/html; charset=ISO-8859-1');
include_once("lib/dbcnx.php");


//Base de la requete principale
$req = "SELECT prio.LIBELLE PRIORITE,
p.CODE_INTERVENTION, 
p.UTILISATEUR,
p.CODE_SITE SITE,
p.DATE_PREVUE,
a.nom TSP_NOM, 
a.prenom TSP_PRENOM,
p.service_fait FAIT,
e.LIBELLE ETAT,
p.DATE_DEBUT_REELLE,
p.DATE_FIN_REELLE,
p.duree_prevue DUREE_PREVUE,
p.motif_hors_delai MOTIF_HD,
p.COMMENTAIRE_TECHNICIEN,
SUBSTR(TIMEDIFF(p.DATE_FIN_REELLE, p.DATE_DEBUT_REELLE), 1, 5) DUREE_REELLE
FROM T_PILOTAGE p INNER JOIN T_AGENTS a ON p.code_agent = a.code_agent
INNER JOIN T_PRIORITE prio ON prio.id = p.ID_PRIORITE
INNER JOIN T_ETAT e ON e.id = p.ID_ETAT
WHERE a.groupe = 'Technicien' ";
//Recherche RTSP
if(isset($_GET['search_rtsp']))
{
	//On r�cup�re l'id	
	$id_agence2 = $_POST['agence_rtsp'];
	
	//On r�cup�re la requ�te de base
	$sql = $req;
	$agence =''; 
	//Si il y a une multis�lection d'agence
	if($_POST['chkMulti_rtsp'] )
	{
		if(count($id_agence2) > 1)
		{
			$agence.="IN (";
			$var = true;
			foreach($id_agence2 as $ag)
			{
				if(!$var)
				$agence.=',';
				
				$agence.="'".$ag."'";
				$var = false;
			}
			$agence.=")";
		}
		else
		$agence = "= '".$id_agence2[0]."'";
	}
	else
	{
		//On r�cup�re l'agence 		
		$agence = "= '".$id_agence2."'";
	}
	
	//On ajoute � la requ�te les crit�res d'extraction
	$sql .= " AND p.id_agence_niv2 ".$agence."
	AND p.id_etat IN (1, 2) ";
	
	//Si les types sont tous s�lectionn�s ou tous non s�lectionn�s
	//on ne fait aucun tri dessus sinon on r�cup�re les cases coch�es
	//et on ajoute le crit�re d'extraction
	if(isset($_POST['types_rtsp']) && count($_POST['types_rtsp']) < 3)
	{
		$inType = '(';
		$ind = false;
		foreach($_POST['types_rtsp'] as $chk)
		{
			if($ind)
			{
				$inType.=', ';
			}
			$inType .="'".$chk."'";
			$ind = true;
		}
		$inType .= ')';
		$sql.=' AND substr(p.code_intervention,1,2) IN '.$inType;
	}
	
	//Si les priorit�s sont toutes s�lectionn�es ou toutes non s�lectionn�es
	//on ne fait aucun tri dessus sinon on r�cup�re les cases coch�es
	//et on ajoute le crit�re d'extraction
	if(isset($_GET['prio']))
	{
		if(strpos($_GET['prio'], ','))
		{
			$sql.=" AND ID_PRIORITE in (".$_GET['prio'].")";
		}
		else
		{
			$sql.=" AND ID_PRIORITE = ".$_GET['prio'];
		}
		
	}
	
	$sql.=' ORDER BY 2';
	//On r�cup�re le r�sultat de la requ�te encod� en utf8 
	//pour ne pas avoir des valeurs nulles lors de l'encodage en json
	$res = GetUtf8EncodeResultAssoc($sql, $cnxBdd);
	header('Content-Type: application/json;');
	echo json_encode($res);
}


//Recherche par numéro
if(isset($_GET['search_numero']))
{
	$sql = $req;
	
	$code_inter = '';

	if(isset($_GET['histo']))
	{
		$code_inter = $_GET['histo'];
	}
	else
	{
		$code_inter = $_POST['num_intervention'];
	}
	
	$sql.=" AND p.code_intervention like '%".$code_inter."%'";
	
	$sql.=' ORDER BY 2 LIMIT 500';
	//On récupère le résultat de la requête encodé en utf8
	$res = GetUtf8EncodeResultAssoc($sql, $cnxBdd);
	
	header('Content-Type: application/json;');
	echo json_encode($res);
}


//Récupération du récapitulatif
if(isset($_GET['recap']))
{
	//On d�clare les tableaux qui contiendront le r�capitulatif par type d'intervention
	$tabOt = array();
	$tabWo = array();
	$tabInc = array();
	
	//On d�clare les variables du r�capitulatif :
	//Une pour chaque type/priorite/etat pour chaque total/type/etat (total des priorites)
	$ot_rp1_fait = 0;  $ot_rp2_fait = 0;  $ot_rp3_fait = 0;	 $ot_rp4_fait = 0;	$ot_rt_fait = 0;
	$ot_rp1_nfait = 0; $ot_rp2_nfait = 0; $ot_rp3_nfait = 0; $ot_rp4_nfait = 0;	$ot_rt_nfait = 0;
	$ot_op1 = 0;	   $ot_op2 = 0;       $ot_op3 = 0;	     $ot_op4 = 0;       $ot_ot = 0;
	
	$wo_rp1_fait = 0;	$wo_rp2_fait = 0;	$wo_rp3_fait = 0;	$wo_rp4_fait = 0;	$wo_rt_fait = 0;	
	$wo_rp1_nfait = 0;	$wo_rp2_nfait = 0;	$wo_rp3_nfait = 0;	$wo_rp4_nfait = 0;	$wo_rt_nfait = 0;	
	$wo_op1 = 0;	    $wo_op2 = 0;	    $wo_op3 = 0;	    $wo_op4 = 0;	    $wo_ot = 0;	
	
	$inc_rp1_fait = 0;	$inc_rp2_fait = 0;	$inc_rp3_fait = 0;	$inc_rp4_fait = 0;	$inc_rt_fait = 0;
	$inc_rp1_nfait = 0;	$inc_rp2_nfait = 0;	$inc_rp3_nfait = 0;	$inc_rp4_nfait = 0;	$inc_rt_nfait = 0;
	$inc_op1 = 0;	    $inc_op2 = 0;	    $inc_op3 = 0;	    $inc_op4 = 0;	    $inc_ot = 0;
	//Requete renvoyant le total d'intervention par type, par etat et par priorite (dans l'ordre)
	$sql = "SELECT substr(p.code_intervention,1,2) TYPE,p.id_ETAT ETAT, p.id_PRIORITE PRIORITE, count(p.code_intervention) NB, p.service_fait FAIT
	FROM T_PILOTAGE p LEFT OUTER JOIN T_AGENTS a 
		ON p.code_agent=a.code_agent
	WHERE a.groupe = 'Technicien'
	AND p.id_etat IN (1,2)";

	//Si c'est le r�cap pour la recherche du rtsp
	if(isset($_GET['rtsp']))
	{
		//On l'(les) id d'agence2
		$id_agence2 = $_POST['agence_rtsp'];
		$agence='';
		//Si il y a une multis�lection d'agence
		if($_POST['chkMulti_rtsp'] )
		{
			if(count($id_agence2) > 1)
			{
				$agence.="IN (";
				$var = true;
				foreach($id_agence2 as $ag)
				{
					if(!$var)
					$agence.=',';
					
					$agence.="'".$ag."'";
					$var = false;
				}
				$agence.=")";
			}
			else
			$agence = "= '".$id_agence2[0]."'";
		}
		else
		{
			//On r�cup�re l'agence 		
			$agence = "= '".$id_agence2."'";
		}

		//On ajoute l'agence s�lectionn�e en crit�re d'extraction
		$sql.=" AND p.id_agence_niv2 ".$agence;
	}
	//group by pour count
	$sql.=" GROUP BY p.id_etat, p.id_priorite, SUBSTRING(p.code_intervention,1,2), p.service_fait ";
	
	//On execute la requete
	$query = $cnxBdd->prepare($sql);
	$query->execute();

	$res = $query->fetchAll(PDO::FETCH_ASSOC);
	
	//On parcours le r�sultat de la requ�te et on assigne chaque r�sultat � sa variable
	//(usine � gaz !!)
	for($i = 0; $i<count($res); $i++)
	{
		if($res[$i]['TYPE'] == 'OT')
		{
			if($res[$i]['ETAT'] == '1')
			{
				if($res[$i]['PRIORITE'] == '1')
				{
					$ot_op1 = $res[$i]['NB'];
				}
				else if($res[$i]['PRIORITE'] == '2')
				{
					$ot_op2 = $res[$i]['NB'];
				}
				else if($res[$i]['PRIORITE'] == '3')
				{
					$ot_op3 = $res[$i]['NB'];
				}
				else if($res[$i]['PRIORITE'] == '4')
				{
					$ot_op4 = $res[$i]['NB'];
				}
			}
			else if($res[$i]['ETAT'] == '2')
			{
				if($res[$i]['FAIT'] == 'Oui')
				{
					if($res[$i]['PRIORITE'] == '1')
					{
						$ot_rp1_fait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '2')
					{
						$ot_rp2_fait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '3')
					{
						$ot_rp3_fait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '4')
					{
						$ot_rp4_fait = $res[$i]['NB'];
					}
				}
				else
				{
					if($res[$i]['PRIORITE'] == '1')
					{
						$ot_rp1_nfait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '2')
					{
						$ot_rp2_nfait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '3')
					{
						$ot_rp3_nfait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '4')
					{
						$ot_rp4_nfait = $res[$i]['NB'];
					}
				}
			}
		}
		
		if($res[$i]['TYPE'] == 'WO')
		{
			if($res[$i]['ETAT'] == '1')
			{
				if($res[$i]['PRIORITE'] == '1')
				{
					$wo_op1 = $res[$i]['NB'];
				}
				else if($res[$i]['PRIORITE'] == '2')
				{
					$wo_op2 = $res[$i]['NB'];
				}
				else if($res[$i]['PRIORITE'] == '3')
				{
					$wo_op3 = $res[$i]['NB'];
				}
				else if($res[$i]['PRIORITE'] == '4')
				{
					$wo_op4 = $res[$i]['NB'];
				}
			}
			else if($res[$i]['ETAT'] == '2')
			{
				if($res[$i]['FAIT'] == 'Oui')
				{
					if($res[$i]['PRIORITE'] == '1')
					{
						$wo_rp1_fait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '2')
					{
						$wo_rp2_fait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '3')
					{
						$wo_rp3_fait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '4')
					{
						$wo_rp4_fait = $res[$i]['NB'];
					}
				}
				else
				{
					if($res[$i]['PRIORITE'] == '1')
					{
						$wo_rp1_nfait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '2')
					{
						$wo_rp2_nfait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '3')
					{
						$wo_rp3_nfait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '4')
					{
						$wo_rp4_nfait = $res[$i]['NB'];
					}
				}
			}
		}
		
		if($res[$i]['TYPE'] == 'IN')
		{
			if($res[$i]['ETAT'] == '1')
			{
				if($res[$i]['PRIORITE'] == '1')
				{
					$inc_op1 = $res[$i]['NB'];
				}
				else if($res[$i]['PRIORITE'] == '2')
				{
					$inc_op2 = $res[$i]['NB'];
				}
				else if($res[$i]['PRIORITE'] == '3')
				{
					$inc_op3 = $res[$i]['NB'];
				}
				else if($res[$i]['PRIORITE'] == '4')
				{
					$inc_op4 = $res[$i]['NB'];
				}
			}
			else if($res[$i]['ETAT'] == '2')
			{
				if($res[$i]['FAIT'] == 'Oui')
				{
					if($res[$i]['PRIORITE'] == '1')
					{
						$inc_rp1_fait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '2')
					{
						$inc_rp2_fait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '3')
					{
						$inc_rp3_fait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '4')
					{
						$inc_rp4_fait = $res[$i]['NB'];
					}
				}
				else
				{
					if($res[$i]['PRIORITE'] == '1')
					{
						$inc_rp1_nfait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '2')
					{
						$inc_rp2_nfait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '3')
					{
						$inc_rp3_nfait = $res[$i]['NB'];
					}
					else if($res[$i]['PRIORITE'] == '4')
					{
						$inc_rp4_nfait = $res[$i]['NB'];
					}
				}
			}
		}
	}
	//On calcul les totaux par type/etat
	$ot_ot = $ot_op1 + $ot_op2 + $ot_op3 + $ot_op4;
	$ot_rt_fait = $ot_rp1_fait + $ot_rp2_fait + $ot_rp3_fait + $ot_rp4_fait;
	$ot_rt_nfait = $ot_rp1_nfait + $ot_rp2_nfait + $ot_rp3_nfait + $ot_rp4_nfait;
	
	$wo_ot = $wo_op1 + $wo_op2 + $wo_op3 + $wo_op4;
	$wo_rt_fait = $wo_rp1_fait + $wo_rp2_fait + $wo_rp3_fait + $wo_rp4_fait;
	$wo_rt_nfait = $wo_rp1_nfait + $wo_rp2_nfait + $wo_rp3_nfait + $wo_rp4_nfait;
	
	$inc_ot = $inc_op1 + $inc_op2 + $inc_op3 + $inc_op4;
	$inc_rt_fait = $inc_rp1_fait + $inc_rp2_fait + $inc_rp3_fait + $inc_rp4_fait;
	$inc_rt_nfait = $inc_rp1_nfait + $inc_rp2_nfait + $inc_rp3_nfait + $inc_rp4_nfait;
		
	//On remplit les tableaux par type avec les variables
	$tabOt['ot_rp1_fait'] = $ot_rp1_fait;
	$tabOt['ot_rp2_fait'] = $ot_rp2_fait;	
	$tabOt['ot_rp3_fait'] = $ot_rp3_fait;
	$tabOt['ot_rp4_fait'] = $ot_rp4_fait;	
	$tabOt['ot_rt_fait'] = $ot_rt_fait;		
	$tabOt['ot_rp1_nfait'] = $ot_rp1_nfait;
	$tabOt['ot_rp2_nfait'] = $ot_rp2_nfait;
	$tabOt['ot_rp3_nfait'] = $ot_rp3_nfait;
	$tabOt['ot_rp4_nfait'] = $ot_rp4_nfait;
	$tabOt['ot_rt_nfait'] = $ot_rt_nfait;
	$tabOt['ot_op1'] = $ot_op1;
	$tabOt['ot_op2'] = $ot_op2;
	$tabOt['ot_op3'] = $ot_op3;
	$tabOt['ot_op4'] = $ot_op4;
	$tabOt['ot_ot'] = $ot_ot;

	$tabInc['inc_rp1_fait'] = $inc_rp1_fait;
	$tabInc['inc_rp2_fait'] = $inc_rp2_fait;
	$tabInc['inc_rp3_fait'] = $inc_rp3_fait;
	$tabInc['inc_rp4_fait'] = $inc_rp4_fait;
	$tabInc['inc_rt_fait'] = $inc_rt_fait;	
	$tabInc['inc_rp1_nfait'] = $inc_rp1_nfait;
	$tabInc['inc_rp2_nfait'] = $inc_rp2_nfait;
	$tabInc['inc_rp3_nfait'] = $inc_rp3_nfait;
	$tabInc['inc_rp4_nfait'] = $inc_rp4_nfait;
	$tabInc['inc_rt_nfait'] = $inc_rt_nfait;	
	$tabInc['inc_op1'] = $inc_op1;
	$tabInc['inc_op2'] = $inc_op2;
	$tabInc['inc_op3'] = $inc_op3;
	$tabInc['inc_op4'] = $inc_op4;
	$tabInc['inc_ot'] = $inc_ot;
	
	$tabWo['wo_rp1_fait'] = $wo_rp1_fait;
	$tabWo['wo_rp2_fait'] = $wo_rp2_fait;
	$tabWo['wo_rp3_fait'] = $wo_rp3_fait;
	$tabWo['wo_rp4_fait'] = $wo_rp4_fait;
	$tabWo['wo_rt_fait'] = $wo_rt_fait;
	$tabWo['wo_rp1_nfait'] = $wo_rp1_nfait;
	$tabWo['wo_rp2_nfait'] = $wo_rp2_nfait;
	$tabWo['wo_rp3_nfait'] = $wo_rp3_nfait;
	$tabWo['wo_rp4_nfait'] = $wo_rp4_nfait;
	$tabWo['wo_rt_nfait'] = $wo_rt_nfait;
	$tabWo['wo_op1'] = $wo_op1;
	$tabWo['wo_op2'] = $wo_op2;
	$tabWo['wo_op3'] = $wo_op3;
	$tabWo['wo_op4'] = $wo_op4;
	$tabWo['wo_ot'] = $wo_ot;
	//On regoupe ces tableaux dans un m�me tableau � valeur associative
	//qu'on renvoi en ajax encod� en json
	$tabRecap = array();
	$tabRecap['OT'] = $tabOt;
	$tabRecap['WO'] = $tabWo;
	$tabRecap['INC'] = $tabInc;
	header('Content-Type: application/json;');
	echo json_encode($tabRecap);
}


if(isset($_GET['test']))
{
	if(isset($_POST['types_rtsp']) && count($_POST['types_rtsp']) < 3)
	{
		$inType = '(';
		$ind = false;
		foreach($_POST['types_rtsp'] as $chk)
		{
			if($ind)
			{
				$inType.=', ';
			}
			$inType .="'".$chk."'";
			$ind = true;
		}
		$inType .= ')';
		$sql.=' AND substr(p.code_intervention,0,2) IN '.$inType;
		echo $sql;
	}
	else
		echo 'rien';
}

//Fonction qui renvoit le resultat encodé en utf8
//d'une requête et d'une connexion passées en paramètre
function GetUtf8EncodeResultAssoc($requete, $cnxBdd)
{
	$query = $cnxBdd->prepare($requete);
	$query->execute();
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	
	for($i = 0; $i<count($result); $i++)
	{
		$result[$i]['PRIORITE'] = utf8_encode($result[$i]['PRIORITE']);
		$result[$i]['CODE_INTERVENTION'] = utf8_encode($result[$i]['CODE_INTERVENTION']);
		$result[$i]['UTILISATEUR'] = utf8_encode($result[$i]['UTILISATEUR']);
		$result[$i]['SITE'] = utf8_encode($result[$i]['SITE']);
		$result[$i]['DATE_PREVUE'] = utf8_encode($result[$i]['DATE_PREVUE']);
		$result[$i]['TSP_PRENOM'] = utf8_encode($result[$i]['TSP_PRENOM']);
		$result[$i]['TSP_NOM'] = utf8_encode($result[$i]['TSP_NOM']);
		
		$result[$i]['FAIT'] = utf8_encode($result[$i]['FAIT']);
		$result[$i]['ETAT'] = utf8_encode($result[$i]['ETAT']);
		$result[$i]['DATE_DEBUT_REELLE'] = utf8_encode($result[$i]['DATE_DEBUT_REELLE']);
		$result[$i]['DATE_FIN_REELLE'] = utf8_encode($result[$i]['DATE_FIN_REELLE']);
		$result[$i]['DUREE_PREVUE'] = utf8_encode($result[$i]['DUREE_PREVUE']);
		$result[$i]['MOTIF_HD'] = utf8_encode($result[$i]['MOTIF_HD']);
		$result[$i]['COMMENTAIRE_TECHNICIEN'] = utf8_encode($result[$i]['COMMENTAIRE_TECHNICIEN']);
		$result[$i]['DUREE_REELLE'] = utf8_encode($result[$i]['DUREE_REELLE']);
	}
	
	return $result;
}
?>