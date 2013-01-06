// Constantes
var DISK_MAX_SIZE = 150;
var DEFAULT_N = 5;
var MIN_DISKS = 2;
var MAX_DISKS = 9;
var COLORS = ["red", "yellow", "blue", "green", "gray", "purple", "white", "black", "orange"];

// Cache dos elementos acessados frequentemente
var $n = $("#n");
var $moves = $("#moves");
var $timer = $("#timer");
var $minus = $("#minus");
var $plus = $("#plus");
var $reset = $("#reset");
var $rules = $("#rules");

// Inicialização do cronômetro
var timer = null;

$reset.click(new_game);
$plus.click(add_disk);
$minus.click(remove_disk);

// Ao passar mouse sobre a interrogação, são exibidas as regras do jogo
$("#help").hover(
    function() { $rules.css("display", "block"); },
    function() { $rules.css("display", "none");  }
);

// Botão "OK" da janela modal que aparece quando há vitória
$("#close").click(function() {
    $("#modal").css("display", "none");
    new_game();
});

// Definição do tamanho do fundo preto que aparece sob a janela modal de vitória
$("#mask").css("height", $(document).height()).css("width", $(window).width());

// Inicialização do jogo
new_game();


function new_game() {
    current_moves = 0;
    current_seconds = 0;
    if (!$n.html())
        $n.html(DEFAULT_N);
    $timer.html("0s");
    $moves.html("0");
    $(".disk").remove();
    create_disks();
    update_move_buttons();
    start_timer();
}

function create_disks() {
    var n = $n.html();
    for (var i = 0; i < n; i++)
        $("<div id='disk" + i + "' class='disk " + COLORS[i] + "'></div>").css("width", DISK_MAX_SIZE - ((n - 1 - i) * 15)).appendTo("#towerA .disks");
}

function update_move_buttons() {
    var $buttons = $(".move:not(.deactivate)");
    if (!!$buttons.length)
        $buttons.addClass("deactivate").unbind("click");

    $(".move").each(function() {
        var button_id = $(this).attr("id");

        var from = button_id.substring(4,5);
        var $top_from = $(".disk", "#tower" + from).eq(0);
        
        var to =  button_id.substring(5);
        var $top_to = $(".disk", "#tower" + to).eq(0);

        if ((!!$top_from.length && !!$top_to.length && ($top_from.attr("id").substring(4) < $top_to.attr("id").substring(4))) || (!!$top_from.length && !$top_to.length)) {
            $(this).removeClass("deactivate").click(function() {
                $top_from.prependTo("#tower" + to + " .disks");
                $moves.html(++current_moves);
                update_move_buttons();
                check_winner();
            });
        }
    });
}

function start_timer() {
    if (timer)
        clearInterval(timer);

    timer = setInterval(function() {
        var hours = Math.floor(++current_seconds / (60 * 60));
        var divisor_for_minutes = current_seconds % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        var now = seconds + "s";
        if (!!minutes)
            now = minutes + "m " + now;
        if (!!hours)
            now = hours + "h " + now;
        $timer.html(now);
    }, 1000);
}


function add_disk() {
    var count = parseInt($n.html());
    var i = count;

    $n.html(++count);

    if (count == MAX_DISKS)
        $plus.addClass("deactivate").unbind("click");

    if ($minus.hasClass("deactivate") && count > MIN_DISKS)
        $minus.removeClass("deactivate").click(remove_disk);

    new_game();
}

function remove_disk() {
    var n = parseInt($n.html());

    $n.html(--n);

    if (n == MIN_DISKS)
        $minus.addClass("deactivate").unbind("click");

    if ($plus.hasClass("deactivate") && n < MAX_DISKS)
        $plus.removeClass("deactivate").click(add_disk);

    new_game();
}

function check_winner() {
    if ($("#towerC .disk").length == parseInt($n.html())) {
        clearInterval(timer);
        $("#final_n").html($n.html());
        $("#final_moves").html(current_moves);
        $("#final_time").html($timer.html());

        $("#modal").css("display", "block");
        
        var $congrats = $("#congrats");
        $congrats.css("top", $(window).height() / 2 - $congrats.outerHeight() / 2).css("left", $(window).width() / 2 - $congrats.outerWidth() / 2);
    }
}