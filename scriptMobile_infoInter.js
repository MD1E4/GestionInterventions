$('#monIntervention').on('pageshow', function () {

	$('#cmdParam').on('click', function() {
		$.ajax({
	        type:'POST',
	        url:'mobile_interventions.php?getEnCours',
	        datatype:'json',

	        success:function(mesInters)
	        {
	            if(mesInters.length == 0)
	            {
	                $('#link_deroulement').click();
	            }
	            else
	            {
	                if(mesInters[0].Code_intervention != $('#iNumero').text())
	                {
	                	alert('L\'intervention num\351ro '+mesInters[0].Code_intervention+' programm\351e \340 '+mesInters[0].Heure_prevue.substr(0,5)+' est d\351j\340 \340 l\'\351tat "En cours". \n Veuillez finir l\'intervention en cours avant d\'en commencer une nouvelle');
	                }
	                else
	                {
	                	$('#link_deroulement').click();
	                }
	            }
	        },

	        error:function()
	        {
	            alert('Erreur lors du chargement de vos interventions');
	        }
	    });
	});

});