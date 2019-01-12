(() => {
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
            let rotate = getRotationDegrees($('.tabuleiro'));
            $('.tabuleiro').css({
                transform: `perspective(50em) rotateX(${obj.value}deg) rotate(${rotate}deg)`
            });
        },
        ajudas(obj) {
            settings.ajudas[$(obj).data('tipo')] = $(obj).prop('checked');
        },
        getcsstransform(obj) {
            var isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);

            var TType = "undefined",
                rotateX = 0,
                rotateY = 0,
                rotateZ = 0;

            var matrix = obj.css("-webkit-transform") ||
                obj.css("-moz-transform") ||
                obj.css("-ms-transform") ||
                obj.css("-o-transform") ||
                obj.css("transform");
            if (matrix !== undefined && matrix !== 'none') {
                // if matrix is 2d matrix
                TType = "2D";
                if (matrix.indexOf('matrix(') >= 0) {
                    var values = matrix.split('(')[1].split(')')[0];
                    if (isIE)  //case IE
                    {
                        angle = parseFloat(values.replace('deg', STR_EMPTY));
                    } else {
                        values = values.split(',');
                        var a = values[0];
                        var b = values[1];
                        var rotateZ = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                    }
                } else {
                    // matrix is matrix3d
                    TType = "3D";
                    var values = matrix.split('(')[1].split(')')[0].split(',');
                    var sinB = parseFloat(values[8]);
                    var b = Math.round(Math.asin(sinB) * 180 / Math.PI);
                    var cosB = Math.cos(b * Math.PI / 180);
                    var matrixVal10 = parseFloat(values[9]);
                    var a = Math.round(Math.asin(-matrixVal10 / cosB) * 180 / Math.PI);
                    var matrixVal1 = parseFloat(values[0]);
                    var c = Math.round(Math.acos(matrixVal1 / cosB) * 180 / Math.PI);
                    rotateX = a;
                    rotateY = b;
                    rotateZ = c;
                }
            }

            return { TType: TType, rotateX: rotateX, rotateY: rotateY, rotateZ: rotateZ };
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
})();