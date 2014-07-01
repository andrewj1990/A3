$(function() {
        var icons = {
            header: "ui-icon-circle-arrow-e",
            headerSelected: "ui-icon-circle-arrow-s"
        };
        $( "#accordion" ).accordion({
            icons: icons,
            collapsible: true
        });
        $( "#header1" ).click(function(e) { return false;
            $( "#accordion" ).accordion( "option", "icons", false );
        });
});

$('#accordion .accClicked')
        .off('click')
    .click(function(){
        $(this).next().toggle('fast');
    });