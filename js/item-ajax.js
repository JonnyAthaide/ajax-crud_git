$( document ).ready(function() {

var page = 1;
var current_page = 1;
var total_page = 0;
var is_ajax_fire = 0;
var token ="";

retrieveToken();

/* manage data list */
function retrieveToken() {

   $.post("https://www.mt4.com.br/vagas/desenvolvedor-frontend-junior/api/token",

    function(data, status){
        token = data.token;
      list(token);
    });
}


/* manage data list */
function list(token) {
    
    $.ajax({
        dataType: 'json',
        url: 'https://www.mt4.com.br/vagas/desenvolvedor-frontend-junior/api/listar',
        data: {
            token:token
        }
    }).done(function(response){
       manageRow(response.data);

    });

       

}




/* manage data list */





/* Get Page Data*/
function  getPageData() {
	$.ajax({
    	dataType: 'json',
    	url: url+'api/getData.php',
    	data: {page:page}
	}).done(function(data){
		manageRow(data.data);
	});
}


/* Add new Item table row */
function manageRow(data) {
	var	rows = '';
	$.each( data, function( key, value ) {
	  	rows = rows + '<tr>';
        rows = rows + '<td>'+value.name+'</td>';     
        rows = rows + '<td data-id=" '+value.id+'">'; 
        rows = rows + '<button data-toggle="modal" data-target="#edit-item" class="btn btn-primary edit-item">Edit</button> <button data-toggle="modal" data-id="'+value.id+'" data-target="#visualizar" class="btn btn-primary edit-item">Visualizar</button> <button class="btn btn-danger remove-item">Delete</button></td>'; 
	  	rows = rows + '</tr>';
	});        

	$("tbody").html(rows);
}

$("#subimit-cadastrar").click(function(){
    var name = $("#name-cadastrar").val();
    var email = $("#email-cadastrar").val();
    var telefone = $("#telefone-cadastrar").val();

$("#minhadiv").removeClass("hidden");

   $.ajax({
        dataType: 'json',
        url: 'https://www.mt4.com.br/vagas/desenvolvedor-frontend-junior/api/salvar',
        type:'POST',
        data: {
            token:token,
            id:id,
            name:name,
            email:email,
            telefone:telefone
        }
    }).done(function(response){
     var result = response.data;

$("#minhadiv").addClass("hidden");
$("#minhadiv").removeClass("hidden");


    });

});


$('#visualizar').on('shown.bs.modal', function(e) {
    id = $(e.relatedTarget).data("id");
    console.log(id);
 
   $.ajax({
        dataType: 'json',
        url: 'https://www.mt4.com.br/vagas/desenvolvedor-frontend-junior/api/detalhes',
        data: {
            token:token,
            id:id
        }
    }).done(function(response){
     var result = response.data;
     $("input[name='name']").val(result.name);
     $("input[name='email']").val(result.email);
    });
})


/* Create new Item */
$(".crud-submit").click(function(e){
    e.preventDefault();
    var form_action = $("#create-item").find("form").attr("action");
    var title = $("#create-item").find("input[name='title']").val();
    var description = $("#create-item").find("textarea[name='description']").val();

    if(title != '' && description != ''){
        $.ajax({
            dataType: 'json',
            type:'POST',
            url: url + form_action,
            data:{title:title, description:description}
        }).done(function(data){
            $("#create-item").find("input[name='title']").val('');
            $("#create-item").find("textarea[name='description']").val('');
            getPageData();
            $(".modal").modal('hide');
            toastr.success('Item Created Successfully.', 'Success Alert', {timeOut: 5000});
        });
    }else{
        alert('You are missing title or description.')
    }


});

/* Remove Item */
$("body").on("click",".remove-item",function(){
    var id = $(this).parent("td").data('id');
    var c_obj = $(this).parents("tr");

    $.ajax({
        dataType: 'json',
        type:'POST',
        url: url + 'api/delete.php',
        data:{id:id}
    }).done(function(data){
        c_obj.remove();
        toastr.success('Item Deleted Successfully.', 'Success Alert', {timeOut: 5000});
        getPageData();
    });

});


/* Edit Item */
$("body").on("click",".edit-item",function(){

    var id = $(this).parent("td").data('id');
    var name = $(this).parent("td").prev("td").text();
    $("#edit-item").find("input[name='name']").val(name);
    $("#edit-item").find(".edit-id").val(id);

});


/* Updated new Item */
$(".crud-submit-edit").click(function(e){

    e.preventDefault();
    var form_action = $("#edit-item").find("form").attr("action");
    var title = $("#edit-item").find("input[name='title']").val();

    var description = $("#edit-item").find("textarea[name='description']").val();
    var id = $("#edit-item").find(".edit-id").val();

    if(title != '' && description != ''){
        $.ajax({
            dataType: 'json',
            type:'POST',
            url: url + form_action,
            data:{title:title, description:description,id:id}
        }).done(function(data){
            getPageData();
            $(".modal").modal('hide');
            toastr.success('Item Updated Successfully.', 'Success Alert', {timeOut: 5000});
        });
    }else{
        alert('You are missing title or description.')
    }

});
});