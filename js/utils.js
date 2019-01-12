window.$utils = {
    removeAllClass: () => {
        $(`.casa`).removeClass('selected');
        $(`.casa`).removeClass('select');
        $(`.casa`).removeClass('comer');
        $(`.casa`).removeClass('on');
        $(`.casa`).removeClass('go');
    },
    efetivoMov: (div, old) => {
        $(`.casa`).removeClass('selected');
        $(`.casa`).removeClass('select');
        $(`.casa`).removeClass('comer');
        $(`.casa`).removeClass('on');
        $(`.casa`).removeClass('go');
        if (settings.ajudas.ultimoMovimento) {
            $(div).addClass('go');
            $(old).addClass('on');
        }
    },
    resetMovs: () => {
        $(`.casa`).removeClass('select');
        $(`.casa`).removeClass('comer');
        $(`.casa`).removeClass('selected');
        if (!settings.ajudas.ultimoMovimentoClick) {
            $(`.casa`).removeClass('on')
            $(`.casa`).removeClass('go');
        }
    },
    newGame() {
        settings.game._new();
        $create.new(settings.game.rodada);
        movimentos = [];
        movimentosNoCheck = [];
        noXequeMateMovs = [];
    },
    inclinar(obj) {
        let  rotate = getRotationDegrees($('.tabuleiro'));
        $('.tabuleiro').css({
            transform: `perspective(50em) rotateX(${obj.value}deg) rotate(${rotate}deg)`
        });
    },
    ajudas(obj) {
        settings.ajudas[$(obj).data('tipo')] = $(obj).prop('checked');
    }
}

function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
        obj.css("-moz-transform") ||
        obj.css("-ms-transform") ||
        obj.css("-o-transform") ||
        obj.css("transform");
    if (matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
}