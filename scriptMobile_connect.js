$('#connexion').on('pageshow', function () {

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
            alert('Veuillez saisir votre mot de passe');
        }
        else
        {
            $.ajax({
                type:'POST',
                url:'consult_inter.php?connect',        
                datatype:'json',
                data:{ idUser: $('#idUser').val(), pwdUser: $('#pwdUser').val() },
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
                            if(res[i].Groupe == 'Technicien')
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
                            smallUser = res[index].Prenom.substr(0,1)+'. '+res[index].Nom;
                            alert('Bienvenue '+user);
                            $('#foot_mesInterventions, #foot_monIntervention, #foot_monIntervention_deroulement').empty();
                            $('#foot_mesInterventions, #foot_monIntervention, #foot_monIntervention_deroulement').append(smallUser);
                            $('#link_mesInterventions').click();
                        }
                    }
                },
                error:function()
                {
                    alert('Problème de connexion au serveur, veuillez réessayer ultérieurement')
                }
            });
        }
    });
});