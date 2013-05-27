////Crée l'option d'un select à partir de la valeur et de la vue passée en paramètre
function GetOption(value, view)
{
	option = '<option value="'+value+'">'+view+'</option>';
	return option;
}

function GetSelectedOption(value, view)
{
	option = '<option value="'+value+'" selected>'+view+'</option>';
	
	return option;
}
///////////
//RTSP
//////////////////////////////////////////////////////////////

//Méthode qui à partir d'un objet passé en paramètre 
//renvoit une ligne du résultat de la recherche d'interventions.
//Un compteur correspondant à l'index de la ligne est également passé en paramètre 
//afin de permettre la coloration d'une ligne sur deux
function GetBodyRes(val, cpt)
{
	//Vérification que les champs soient bien remplit,
	//sinon on leur attribut une valeur par défaut
	if(val.DUREE_REELLE == '')
		val.DUREE_REELLE = '-';
	
	
	var code_site = '';
	code_site = val.SITE;
	
	if(code_site.indexOf('\'') != -1)
	{
		code_site='';
		var array = val.SITE.split('\'');
		for(var j  = 0 ; j < array.length ; j++)
		{
			code_site+=array[j];

			if(j!=array.length-1)
			code_site+="\\'";
		}
	}
	
	if(val.COMMENTAIRE_TECHNICIEN == '')
	{
		val.COMMENTAIRE_TECHNICIEN = 'Pas de commentaire';
	}
	else
	{
		if(val.COMMENTAIRE_TECHNICIEN.indexOf('\'') != -1)
		{
			var comm ='';
			var array = val.COMMENTAIRE_TECHNICIEN.split('\'');
			for(var j  = 0 ; j < array.length ; j++)
			{
				comm+=array[j];
	
				if(j!=array.length-1)
				comm+="\\'";
			}
			val.COMMENTAIRE_TECHNICIEN = comm;
		}
	}
	
	if(val.UTILISATEUR == '')
	val.UTILISATEUR = '-';
	
	if(val.SITE == '')
	val.SITE = '-';
	
	if(val.DATE_PREVUE == '')
	val.DATE_PREVUE = '-';
	
	if(val.DATE_DEBUT_REELLE == '0000-00-00 00:00:00')
	val.DATE_DEBUT_REELLE = '-';
	
	if(val.DATE_FIN_REELLE== '0000-00-00 00:00:00')
	val.DATE_FIN_REELLE = '-';
	
	if(val.DUREE_PREVUE == '')
	val.DUREE_PREVUE = '-';
	else if(val.DUREE_PREVUE.split(':')[0].length == 1)
	{
		val.DUREE_PREVUE = '0'+val.DUREE_PREVUE;
	}
	
	if(val.MOTIF_HD == '')
	val.MOTIF_HD = '-';
	
	if(val.PRIORITE == '')
	val.PRIORITE = '-';
	
	if(val.CODE_INTERVENTION == '')
	val.CODE_INTERVENTION = '-';
	
	if(val.TSP_NOM != '' && val.TSP_PRENOM != '')
	var TSP = val.TSP_NOM+' '+val.TSP_PRENOM;
	else
	var TSP = '-';
	
	if(cpt%2==0)
	tbody='<tr class="odd">';
	else
	tbody='<tr class="even">';
	
	tbody+='<td>'+val.PRIORITE+'<br/>';
	if(!arguments[2])
	tbody+='<a href="#" class="histo_inter">'+val.CODE_INTERVENTION+'</a>';
	else
	tbody+=val.CODE_INTERVENTION;
	
	tbody+='</td>';
	tbody+='<td>'+val.UTILISATEUR+'<br/>';
	if(!arguments[2])
	tbody+='<a href="#" class="code_site" name="'+code_site+'" style="text-decoration:underline;color:#000">'+val.SITE.substr(0,val.SITE.lastIndexOf('(')-1)+'</a>';
	else
	tbody+=val.SITE.substr(0,val.SITE.lastIndexOf('(')-1);
	tbody+='</td>';	
	tbody+='<td style="text-align:center">';
	if(!arguments[2])
	tbody+='<a href="#" name="'+val.COMMENTAIRE_TECHNICIEN+'" style="text-decoration:underline;color:#000" class="rq_tsp">'+TSP+'</a>';
	else
	tbody+=TSP;
	
	tbody+='<br/>'+val.DATE_PREVUE.substr(0, 16)+'</td>';
	
	tbody+='<td style="text-align:center">'+val.DATE_DEBUT_REELLE.substr(0, 16)+'<br/>'+val.DATE_FIN_REELLE.substr(0, 16)+'</td>';
	
	tbody+='<td style="text-align:center">'+val.DUREE_PREVUE+'<br/>'+val.DUREE_REELLE+'</td>';

	tbody+='<td style="text-align:center"><span style="color:red;">'+val.MOTIF_HD+'</span><br/><a href="http://optimise.sso.francetelecom.fr/miopt/consultInterv.jsp?typTick=XXX&login_ticket='+val.CODE_INTERVENTION.substr(0, 15)+'" target="_blank"><img src="img/logo_opt.png"/></a></td>';
	
	tbody+='</tr>';
	
	return tbody;
}

function GetTHead()
{
	var thead = 
		'<tr>'+
		'<th>Priorité<br/>Code</th>'+
		'<th>Uilisateur<br/>Site</th>'+
		'<th>TSP<br/>Date Prévue</th>'+
		'<th>Date début<br/>Date fin</th>'+
		'<th>Durée prévue<br/>Durée réelle</th>'+
		'<th>Motif HD<br/>OPT</th>'+
		'</tr>';
		
		return thead;
}

//Méthode qui remplit les tableaux de résultat à partir 
//d'un résultat de requête encodé en json passé en paramètre
function RemplirTableau(res)
{
	//On récupère l'entête
	var thead = GetTHead();
	//On déclare un tbody et un compteur qui permet la coloration d'une ligne sur deux au chargement
	//et ce pour chauque tableau de chaque état
	var tbody_fait = ''; cptfait = 0;
	var tbody_nonfait = ''; cptnonfait = 0;
	var tbody_ordonnance = ''; cptordo = 0;
	for(var i = 0; i<res.length; i++)
	{
		if(res[i].ETAT == 'Ordonnancée')
		{

			tbody_ordonnance += GetBodyRes(res[i], cptordo);
			cptordo++;
		}
		else
		{
			if(res[i].FAIT == 'Oui')
			{
				tbody_fait += GetBodyRes(res[i], cptfait);
				cptfait++;
			}
			else
			{
				tbody_nonfait += GetBodyRes(res[i], cptnonfait);
				cptnonfait++;
			}
		}
	}
	var table_fait = '<table id="result_fait" class="tablesorter">'+
	'<thead>'+thead+'</thead>'+
	'<tbody>'+tbody_fait+'</tbody>'+
	'</table>';
	
	var table_nonfait = '<table id="result_nonfait" class="tablesorter">'+
	'<thead>'+thead+'</thead>'+
	'<tbody>'+tbody_nonfait+'</tbody>'+
	'</table>';
	
	var table_ordonnance = '<table id="result_ordonnance" class="tablesorter">'+
	'<thead>'+thead+'</thead>'+
	'<tbody>'+tbody_ordonnance+'</tbody>'+
	'</table>';
	
	$('#onglet_ordonnance, #onglet_fait, #onglet_nonfait').empty();
	$('#onglet_fait').append(table_fait);
	$('#onglet_nonfait').append(table_nonfait);
	$('#onglet_ordonnance').append(table_ordonnance);
	
	//Permet le tri du tableau
	//Bugg dans le cas ou le tableau a trier ne contient pas de données
	if(cptfait!=0)
	$('#result_fait').tablesorter({
		widthFixed: true, 
		widgets: ['zebra'], 
		sortList: [[0,0], [1,0]],
		headers: {2: {sorter:false}, 3: {sorter:false}}
	})
	.bind("sortEnd",function() {
		$(this).find('tbody tr:odd').removeClass('odd even').addClass('odd');
		$(this).find('tbody tr:even').removeClass('odd even').addClass('even'); 
	})
	.trigger("sortEnd");
	
	if(cptnonfait!=0)
	$('#result_nonfait').tablesorter({
		widthFixed: true, 
		widgets: ['zebra'], 
		sortList: [[0,0], [1,0]],
		headers: {2: {sorter:false}, 3: {sorter:false}}
	})
	.bind("sortEnd",function() {
		$(this).find('tbody tr:odd').removeClass('odd even').addClass('odd');
		$(this).find('tbody tr:even').removeClass('odd even').addClass('even'); 
	})
	.trigger("sortEnd");
	
	if(cptordo!=0)				
	$('#result_ordonnance').tablesorter({
		widthFixed: true, 
		widgets: ['zebra'], 
		sortList: [[0,0], [1,0]],
		headers: {2: {sorter:false}, 3: {sorter:false}}
	})
	.bind("sortEnd",function() {
		$(this).find('tbody tr:odd').removeClass('odd even').addClass('odd');
		$(this).find('tbody tr:even').removeClass('odd even').addClass('even'); 
	})
	.trigger("sortEnd");
}

function RemplirTableauPopup(res)
{
	//On récupère l'entête
	var thead = GetTHead();
		
	var tbody = '';
	
	for(var i = 0 ; i < res.length ; i++)
	{
		tbody += GetBodyRes(res[i], i, 1);
	}
	
	var table = '<table id="result_histo" class="tablesorter">'+
	'<thead>'+thead+'</thead>'+
	'<tbody>'+tbody+'</tbody>'+
	'</table>';
	
	$('#dialog').empty();
	$('#dialog').append(table);
}


function Test2(str)
{
	$('#info').append(str);
}

function RemplirAgence(id1Selected, id2Selected)
{
	// Remplissage combobox DI au chargement
	$.ajax({
		type:'POST',
		url:'lib/consult_inter.php?loadagence1',
		datatype:'json',

		success:function(res)
		{
			$('#di_rtsp').empty();

			for(var i = 0 ; i < res.length ; i++)
			{
				if(res[i].id == id1Selected)
				{
					$('#di_rtsp').append(GetSelectedOption(res[i].id, res[i].nom_agence1));
				}
				else
				$('#di_rtsp').append(GetOption(res[i].id, res[i].nom_agence1));
			}
			RemplirAgence2(id2Selected);
		},
		error:function()
		{
			alert('erreur');
		}
	});

}

function RemplirAgence2(idSelected)
{
	$.ajax({
		type:'POST',
		url:'lib/consult_inter.php?loadagence2',
		datatype:'json',
		data: $('#di_rtsp').serialize(),

		success:function(res)
		{
			$('#agence_rtsp').empty();

			for(var i = 0 ; i < res.length ; i++)
			{
				if(res[i].id == idSelected)
				{
					$('#agence_rtsp').append(GetSelectedOption(res[i].id, res[i].nom_agence2));
				}
				else
				$('#agence_rtsp').append(GetOption(res[i].id, res[i].nom_agence2));
			}
		}
	});
}