$(document).ready(function(){

	var user ="";
	//On cache la div du résultat ne contenant rien au chargement
	$('#div_resultat').hide();

	//Avec authentification
    /*$('#centre').hide();*/

    //Sans authentification
    $('#connexion').hide();
    RemplirAgence(4,18);

    //Click pour l'authentification dans l'application
    $('#cmdConnect').on('click', function(){
    	if ($('#idUser').val() == '' && $('#pwdUser').val() == '') 
    	{
    		alert('Veuillez saisir votre identifiant et votre mot de passe');
    	}
    	else if($('#idUser').val() == '') 
    	{
    		alert('Veuillez saisir votre identifiant');
    	}
    	else if($('#pwdUser').val() == '')
    	{
    		alert('Veuillez saisire votre mot de passe');
    	}
    	else
    	{
	    	$.ajax({
	    		type:'POST',
	    		url:'lib/consult_inter.php?connect',
	    		datatype:'json',
	    		data:$('#connexion').serialize(),

	    		success:function(res)
	    		{
	    			if(res=='')
	    			{
	    				alert('Le nom d\'utilisateur ou le mot de passe n\'est pas valide');
	    			}
	    			else
	    			{
	    				var ok = false;
	    				var index;
	    				for (var i = 0; i < res.length; i++) 
	    				{
		    				if(res[i].Groupe == 'Responsable d\'intervenant')
		    				{		    					
		    					ok = true;
		    					index = i;
		    					break;
		    				}		    				
		    			}
		    			if(ok == false)
		    			{
		    				alert('Vous n\'êtes pas habilité à acceder à l\'outil');
		    			}
		    			else
		    			{
		    				user = res[index].Prenom+' '+res[index].Nom;
	    					alert('Bienvenue '+user);
	    					$('#centre').show();
	    					$('#connexion').hide();

	    					$('#userConnect').empty();
	    					$('#userConnect').append(user);

	    					RemplirAgence(res[index].Id_agence_niv1, res[index].Id_agence_niv2);
	    					if($('#di_rtsp').val() == res[index].Id_agence_niv1)
							{
								RemplirAgence2(res[index].Id_agence_niv2);
							}
		    			}
	    			}
	    		},
	    		error:function()
	    		{
	    			alert('Le nom d\'utilisateur ou le mot de passe n\'est pas valide2');
	    		}
	    	});
		}
    });

	//Evenement du click sur le lien de déconnection
	$('#deconnect').on('click', function(){
		//On cache la div du résultat ne contenant rien au chargement
		$('#div_resultat').hide();

		//Avec authentification
	    $('#centre').hide();

	    $('#connexion').show();
	});

	//Efface le test
    $('#lienPoub').on('click', function(){
    	$('#info').empty();
    });

    //Afficher l'historique de l'intervention au clic
	//sur le numéro d'intervention dans le tableau résultat
	$('#centre').on('click', '.histo_inter', function(){
		var numHisto = $(this).text().split('/')[0];
		$.ajax({
			url:'lib/search_intervention.php?search_numero&histo='+numHisto,
			datatype:'json',

			success:function(res)
			{
				RemplirTableauPopup(res);
			},
			error:function()
			{
				alert('Erreur de la récupération de l\'historique');
			}
		});

		//On ouvre un popup qui affiche l'historique de l'intervention sélectionnée
		//dans un tableau de résultat
		
		$('#dialog').attr('title', 'Historique de l\'intervention '+ numHisto);
		$("#dialog").dialog({
			width:1200,
			resizable:false,
			draggable:false,
			modal:true
		});
		;
	});

	//Lie de test PHP
	/*$('#centre').on('click', '#lien23', function(){
		$("#dialog").dialog({
			height:200,
			width:400,
			resizable:false,
			draggable:false,
			modal:true
		});
		Test2($('#dib').val());
		$.ajax({
			type:'POST',
			url:'../lib/search_intervention.php?test',
			datatype:'html',
			data: $('#form_rtsp').serialize(),
			
			success:function(res)
			{
				Test2(res);
			},
			error:function()
			{
				Test2('Erreur Du TEST');
			}
		});
	});*/

	
	// Remplissage combobox Agences au chargement
	$('#di_rtsp').on('change', function()
	{
		RemplirAgence2(0);
	});

	//Fonction qui gère les onglets du résultat
	jQuery( function($) {     
		$('.simple-tabs').each( function() {
			var container = $(this);         
			container.find('> ul li a').click( function () {             
					 $(this).parent().addClass( 'selected-tab' ).siblings().removeClass( 'selected-tab' );
					 container.find('.tab-panel').hide().filter(this.hash).show();
					 return false;
			}).eq(0).click();
		});
	});
	
			
	//Chargement des Checkboxs priorités
	$.ajax({
		type:'POST',
		url:'lib/consult_inter.php?loadpriorite',
		datatype:'json',

		success:function(res)
		{
			var mesCouleurs = ['#ff6600', '#ff7e27', '#ff954e', '#ffad76', '#ffc49d', '#ffdcc4'];
			var fausse = '';
			for(var i = 0; i<mesCouleurs.length; i++)
			{
				fausse += mesCouleurs[mesCouleurs.length-1-i]
			}

			var html='<td style="text-align:right;font-weight:bold;"><label>Priorités :</label></td>';
			for(var i = 0 ; i < res.length ; i++)
			{
				html+='<td class="prio" style="border:1px solid #000;text-align:center;width:'+100/(res.length+1)+'%;height:30px;background-color:'+mesCouleurs[i]+'">'+res[i].Libelle+'&nbsp; <input type="checkbox" class="chkPrio" name="priority[]" value="'+res[i].Id+'" checked/>&nbsp;&nbsp;&nbsp;</td>';
			}

			$('#priorite_rtsp').append(html);
		}
	});
						   
	$('#centre').on('mouseover', '#lien23', function(){
		overlib('<ul>'+$(this).attr('name')+'<ul>', ABOVE, CENTER,SNAPY, 10, CAPTION,'Code site',WIDTH,'320',FGCOLOR ,'#ff751a ',BGCOLOR ,'#3e3e3e');	
	});
	$('#centre').on('mouseout', '#lien23', function(){
		nd();	
	});
	

	
	//Au clic dans la cellule la chk se coche et se décoche (priorité)
	$('#centre').on('click', '.prio', function()
	{
		var chk = $(this).children();
		if(chk.prop('checked'))
		{
			chk.prop('checked', false);
		}
		else
		{
			chk.prop('checked', true);
		}
	});

	$('#centre').on('click', '.chkPrio', function(e){
		e.stopPropagation();
	});
	
	//Au passsage de la souris sur le site et le tsp dans le tableau résultat
	$('#centre').on('mouseover', '.code_site, .rq_tsp', function(){
		var titre = '';	
		if($(this).attr('class')=='code_site')
		titre = 'Code site';
		else if($(this).attr('class')=='rq_tsp')
		titre = 'Remarque TSP';
		//On ouvre une infobulle grace à la bibliotèque overlib
		overlib('<ul>'+$(this).attr('name')+'<ul>',  ABOVE, CENTER,SNAPY, 10, CAPTION,titre,WIDTH,'320',FGCOLOR ,'#ff8434',BGCOLOR ,'#3e3e3e');		
	});
	
	//Quand le curseur de la souris s'enlèvele du site et du tsp dans le tableau résultat
	//On ferme l'infobulle (overlib)
	$('#centre').on('mouseout', '.code_site, .rq_tsp, .infoBulle', function(){
		nd();		
	});
	
	//Au passage de la souris sur les "?"
	$('#centre').on('mouseover', '.infoBulle', function(){
		var titre='';
		var contenu='';
		if($(this).attr('id') == 'infoNum')
		{
			titre = 'Recherche du numéro d\'intervention';
			contenu = '<li>Recherche globale : <ul style="list-style-type:disc"><li>Tout &eacutetat</li><li>Tout type</li><li>Toute date</li></ul></li><li>Vous pouvez ne renseigner que les nombre significatis</li><li>Vous pouvez renseigner le code entier de la demande</li>';
		}
		if($(this).attr('id') == 'infoRtsp')
		{
			titre = 'Recherche des interventions en cours pour mon agence';
			contenu = '<li>Affiche le brief du jour pour votre agence</li><li>Si toutes o&ugrave aucunes des priorit&eacutes ne sont coch&eacutees,<br/>le crit&egravere ne sera pas pris en compte</li><li>Si tous o&ugrave aucun des types ne sont coch&eacutes,<br/>le crit&egravere ne sera pas pris en compte</li>';
		}
		
		overlib('<ul style="list-style-type:square">'+contenu+'</ul>',  BELOW, CENTER,SNAPY, 10, CAPTION,titre,WIDTH,'320',FGCOLOR ,'#ff8434',BGCOLOR ,'#3e3e3e');		
	});
	
	//Clic sur recherhce du RTSP
	$('#centre').on('click', '#search_rtsp', function(){
		//On remplit les tableau récapitulatifs
		$.ajax({
			type:'POST',
			url:'lib/search_intervention.php?recap&rtsp',
			datatype:'json',
			data:$('#form_rtsp').serialize(),
			
			success:function(res)
			{
				//On assigne les valeurs retournées du tableau
				//dans chaque cellule du tableau récapitulatif
				$('#ot_rea_p1_fait').text(res['OT']['ot_rp1_fait']);
				$('#ot_rea_p2_fait').text(res['OT']['ot_rp2_fait']);
				$('#ot_rea_p3_fait').text(res['OT']['ot_rp3_fait']);
				$('#ot_rea_p4_fait').text(res['OT']['ot_rp4_fait']);
				$('#ot_rea_tot_fait').text(res['OT']['ot_rt_fait']);				
				$('#ot_rea_p1_nfait').text(res['OT']['ot_rp1_nfait']);
				$('#ot_rea_p2_nfait').text(res['OT']['ot_rp2_nfait']);
				$('#ot_rea_p3_nfait').text(res['OT']['ot_rp3_nfait']);
				$('#ot_rea_p4_nfait').text(res['OT']['ot_rp4_nfait']);
				$('#ot_rea_tot_nfait').text(res['OT']['ot_rt_nfait']);				
				$('#ot_ord_p1').text(res['OT']['ot_op1']);
				$('#ot_ord_p2').text(res['OT']['ot_op2']);
				$('#ot_ord_p3').text(res['OT']['ot_op3']);
				$('#ot_ord_p4').text(res['OT']['ot_op4']);
				$('#ot_ord_tot').text(res['OT']['ot_ot']);
				
				$('#wo_rea_p1_fait').text(res['WO']['wo_rp1_fait']);
				$('#wo_rea_p2_fait').text(res['WO']['wo_rp2_fait']);
				$('#wo_rea_p3_fait').text(res['WO']['wo_rp3_fait']);
				$('#wo_rea_p4_fait').text(res['WO']['wo_rp4_fait']);
				$('#wo_rea_tot_fait').text(res['WO']['wo_rt_fait']);				
				$('#wo_rea_p1_nfait').text(res['WO']['wo_rp1_nfait']);
				$('#wo_rea_p2_nfait').text(res['WO']['wo_rp2_nfait']);
				$('#wo_rea_p3_nfait').text(res['WO']['wo_rp3_nfait']);
				$('#wo_rea_p4_nfait').text(res['WO']['wo_rp4_nfait']);
				$('#wo_rea_tot_nfait').text(res['WO']['wo_rt_nfait']);				
				$('#wo_ord_p1').text(res['WO']['wo_op1']);
				$('#wo_ord_p2').text(res['WO']['wo_op2']);
				$('#wo_ord_p3').text(res['WO']['wo_op3']);
				$('#wo_ord_p4').text(res['WO']['wo_op4']);
				$('#wo_ord_tot').text(res['WO']['wo_ot']);
				
				$('#inc_rea_p1_fait').text(res['INC']['inc_rp1_fait']);
				$('#inc_rea_p2_fait').text(res['INC']['inc_rp2_fait']);
				$('#inc_rea_p3_fait').text(res['INC']['inc_rp3_fait']);
				$('#inc_rea_p4_fait').text(res['INC']['inc_rp4_fait']);
				$('#inc_rea_tot_fait').text(res['INC']['inc_rt_fait']);
				$('#inc_rea_p1_nfait').text(res['INC']['inc_rp1_nfait']);
				$('#inc_rea_p2_nfait').text(res['INC']['inc_rp2_nfait']);
				$('#inc_rea_p3_nfait').text(res['INC']['inc_rp3_nfait']);
				$('#inc_rea_p4_nfait').text(res['INC']['inc_rp4_nfait']);
				$('#inc_rea_tot_nfait').text(res['INC']['inc_rt_nfait']);				
				$('#inc_ord_p1').text(res['INC']['inc_op1']);
				$('#inc_ord_p2').text(res['INC']['inc_op2']);
				$('#inc_ord_p3').text(res['INC']['inc_op3']);
				$('#inc_ord_p4').text(res['INC']['inc_op4']);
				$('#inc_ord_tot').text(res['INC']['inc_ot']);
			},
			error:function()
			{
				alert('Erreur de chargement du récapitulatif');
			}
		});
		
		//On affiche uniquement les récapitulatifs
		//des types d'interventions sélectionnés
		
		if($('#ot_rtsp').is(':checked') == false)
		{
			$('#div_recap_ot').hide();
		}
		else
		$('#div_recap_ot').show();
		
		if($('#wo_rtsp').is(':checked') == false)
		{
			$('#div_recap_wo').hide();
		}
		else
		$('#div_recap_wo').show();
		
		if($('#inc_rtsp').is(':checked') == false)
		{
			$('#div_recap_inc').hide();
		}
		else
		$('#div_recap_inc').show();
		
		if($('#inc_rtsp, #ot_rtsp, #wo_rtsp').is(':checked') == false)
		{
			$('#div_recap_inc, #div_recap_ot, #div_recap_wo').show();
		}

		var prio = '';

		if($('.chkPrio:checked').size() < $('.chkPrio').size() && $('.chkPrio:checked').size() > 0)
		{
			$('.chkPrio:checked').each(function(){
				prio += $(this).val()+',';
			});
			prio = prio.substr(0, prio.length-1);
		}

		var txturl = 'lib/search_intervention.php?search_rtsp';
		if(prio != '')
		txturl+='&prio='+prio;
		
		//On remplit le tableau d'affichage du résultat
		$.ajax({
			type:'POST',
			url:txturl,
			datatype:'json',
			data:$('#form_rtsp').serialize(),
			
			success:function(res)
			{
				$('#info').empty();
				$('#info').append(res);
				RemplirTableau(res);
				//On affiche la div avec les onglet de résultat caché au chargement
				$('#recap').show();
				$('#div_resultat').show();
			},
			error:function()
			{
				alert('Erreur du chargement du résultat');
			}
		});
	});	
	
	//Clic sur recherche par numéro
	$('#centre').on('click', '#search_numero', function(){
		//Vérification de saisie
		if($('#num_intervention').val() == "")
		alert('Veuillez saisir un numéro d\'intervention ou la partie significative du numéro d\'intervention.');
		else
		{
			$.ajax({
				type:'POST',
				url:'lib/search_intervention.php?search_numero',
				datatype:'json',
				data:$('#form_numero').serialize(),
				success:function(res)
				{
					alert(res.length);
					//Si le résultat renvoyé contient plus de 500 lignes
					//On demande une confirmation d'affichage des 500 premières inter
					if(res.length == 500)
					{
						if(confirm('Le résultat de la recherche retourne un nombre d\'intervention supérieur à 500.\n'+'Veuillez renseigner le champs numéro  plus précisément\n\nCliquez sur OK pour afficher les 500 premi lèresignes\nCliquez sur Annuler pour retourner à la recherche'))
						{
							RemplirTableau(res);
							//On cache le récap pour ce résultat
							$('#recap').hide();
							$('#div_resultat').show();
							$('#fait').click();
						}
					}
					//Si la requete ne renvoit rien, on l'indique à l'utilisateur
					else if(res.length == 0)
					{
						alert('Aucunes interventions ne corresponds au numéro saisi.');
					}
					//Sinon on affiche le résultat
					else
					{
						RemplirTableau(res);					
						$('#recap').hide();
						$('#div_resultat').show();
						$('#fait').click();
					}
				},
				error:function()
				{
					alert('Erreur du chargement de la recherche par numéro');
				}
			});
		}
	});
	
	//Permet de lancer la recherche en appuyat sur la touche "Entrée"
	$('#centre').on('keydown', '#num_intervention', function(e){
		if(e.keyCode==13)
		{
			$('#search_numero').click();
		}
	});	
													 
	// Permet la sélection multiple sur les listes déroulantes
	//
	//
	// Permet la selection multiple DI, Agence de la section RSTP
	$('#chkMulti_rtsp').change(function(){
		if(!$(this).prop('checked'))
		{
			$('#agence_rtsp').attr('multiple', false);
			$('#agence_rtsp').attr('size', '1');
			$('#agence_rtsp').attr('name', 'agence_rtsp');
			$('.label_rtsp').css('vertical-align', '1px');
			$('multi_rtsp').css('vertical-align', '2px');
			$('#di_rtsp').css('vertical-align', '0px');
		}
		else
		{
			$('#agence_rtsp').attr('multiple', true);
			$('#agence_rtsp').attr('size', '5');
			$('#agence_rtsp').attr('name', 'agence_rtsp[]');
			$('.label_rtsp').css('vertical-align', '70px');
			$('#di_rtsp').css('vertical-align', '68px');
		}
	});
	$('#multi_rtsp').on('click', function(){
		$('#chkMulti_rtsp').click();
	});

});