const $torre = {
    getPositions(pos) {
        let movs = [];
        for (let p = 0; p < 2; p++) {
            for (let value = 1; value < 9; value++) {
                if (value == (p % 2 == 0 ? +pos[0] : +pos[1])) continue;
                movs.push({
                    r: p % 2 == 0 ? value : +pos[0],
                    c: p % 2 == 0 ? +pos[1] : value,
                    t: p % 2 == 0 ? 'row' : 'col'
                })
            }
        }
        return movs;
    },
    movValid(mov, pos, element) {
        let isRow = mov.t == 'row';
        let r = {
            start: +pos[isRow ? 0 : 1],
            end: mov[isRow ? 'r' : 'c']
        };
        let casa;
        let ocupadas = [];

        if (r.start > r.end) {
            for (let p = r.start - 1; p > r.end; p--) {
                casa = isRow
                    ? $(`.casa[data-pos="${p}-${mov.c}"]`)
                    : $(`.casa[data-pos="${mov.r}-${p}"]`);
                if (casa.html()) ocupadas.push(1);
            }
        } else {
            for (let p = r.start + 1; p < r.end; p++) {
                casa = isRow
                    ? $(`.casa[data-pos="${p}-${mov.c}"]`)
                    : $(`.casa[data-pos="${mov.r}-${p}"]`);
                if (casa.html()) ocupadas.push(1);
            }
        }
        let img = $(`.casa[data-pos="${mov.r}-${mov.c}"]`).find('img');

        if (
            ocupadas.length ||
            $(img).attr('data-cor') == $(element).attr('data-cor')
        ) return false;

        mov.a = img.length
            ? 'atk' : 'mov';

        return mov;
    },
    setMov(movs, pos, element) {
        movs.forEach(x => {
            let mov = $torre.movValid(x, pos, element);
            if (!mov) return;
            let casa = $(`.casa[data-pos="${mov.r}-${mov.c}"]`);
            if (mov.a == 'mov') {
                casa.addClass('select');
                movimentos.push(mov);
            } else {
                casa.addClass('comer');
                movimentos.push(mov);
            }
        });
    }
}
const $bispo = {
    getPositions(pos) {
        let movs = [];

        for (let p = 0; p < 4; p++) {
            let cond = true;
            let r = pos[0];
            let c = pos[1];
            while (cond) {
                r += p < 2
                    ? p % 2 == 0 ? -1 : 1
                    : p % 2 == 0 ? -1 : 1;
                c += p < 2
                    ? p % 2 == 0 ? -1 : 1
                    : p % 2 == 0 ? 1 : -1;
                if (
                    (p == 0 && r > 0 && c > 0) ||
                    (p == 1 && r < 9 && c < 9) ||
                    (p == 2 && r > 0 && c < 9) ||
                    (p == 3 && r < 9 && c > 0)
                )
                    movs.push({ r, c });
                else
                    cond = false;
            }
        }
        return movs;
    },
    movValid(mov, pos, element) {
        let r = {
            start: pos[0] > mov.r ? mov.r : pos[0],
            end: pos[0] > mov.r ? pos[0] : mov.r
        };
        let casa;
        let ocupadas = [];
        let col = pos[0] > mov.r ? mov.c : pos[1];
        let multi = pos[0] > mov.r
            ? mov.c > pos[1] ? -1 : 1
            : pos[1] > mov.c ? -1 : 1;

        for (let p = r.start + 1; p < r.end; p++) {
            col += (1 * multi);
            casa = $(`.casa[data-pos="${p}-${col}"]`);
            if (casa.html() && casa.html().trim()) {
                ocupadas.push(1)
            };
        }

        let img = $(`.casa[data-pos="${mov.r}-${mov.c}"]`).find('img');

        if (
            ocupadas.length ||
            $(img).attr('data-cor') == $(element).attr('data-cor')
        ) return false;

        mov.a = img.length
            ? 'atk' : 'mov';

        return mov;
    },
    setMov(movs, pos, element) {
        movs.forEach(x => {
            let mov = $bispo.movValid(x, pos, element);
            if (!mov) return;
            let casa = $(`.casa[data-pos="${mov.r}-${mov.c}"]`);
            if (mov.a == 'mov') {
                casa.addClass('select');
                movimentos.push(mov);
            } else {
                casa.addClass('comer');
                movimentos.push(mov);
            }
        });
    }
}
const $cavalo = {
    getPositions(pos) {
        let movs = [];
        for (let k = 0; k < 2; k++) { // esqueda | direita
            for (let p = 0; p < 2; p++) { // cima | baixo
                for (let q = 0; q < 2; q++) { // jg1 | jg2
                    movs.push({
                        r: pos[0] + ((q % 2 == 0 ? 1 : 2) * (p % 2 == 0 ? -1 : 1)),
                        c: pos[1] + ((q % 2 == 0 ? 2 : 1) * (k % 2 == 0 ? -1 : 1))
                    });
                }
            }
        }
        return movs;
    },
    setMov(movs, pos, element) {
        movs.forEach(x => {
            let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
            if (!casa.html()) {
                casa.addClass('select');
                movimentos.push(x);
                return;
            }
            if ($(element).attr('data-cor') == casa.find('img').attr('data-cor'))
                return;

            casa.addClass('comer');
            movimentos.push(x);
        });
    }
}
const $peao = {
    getPositions(pos, isClara) {
        return [
            {
                r: +pos[0] + (isClara ? 1 : -1),
                c: +pos[1],
                t: 'mov'
            }, {
                r: isClara ? +pos[0] + 1 : +pos[0] - 1,
                c: +pos[1] + 1,
                t: 'atk'
            }, {
                r: isClara ? +pos[0] + 1 : +pos[0] - 1,
                c: +pos[1] - 1,
                t: 'atk'
            }
        ];
    },
    setMov(movs, pos, element) {
        movs.forEach(x => {
            let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
            if (x.t == 'mov') {
                if (!casa.html()) {
                    movimentos.push(x);
                }
            } else {
                if (casa.html() && $(element).attr(`data-cor`) != casa.find('img').attr(`data-cor`)) {
                    movimentos.push(x);
                }
            }
        });
    }
}

function _setCasas($movimentos) {
    $movimentos.map(x => {
        let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
        casa.addClass(x.t == 'mov' ? 'select' : 'comer');
    });
}

window.$jogadas = {
    peao: (element) => {
        resetMovs();
        let isClara = $(element).attr(`data-cor`) == 'clara';
        let pos = $(element).attr('data-pos').split('-');
        let movs = $peao.getPositions(pos, isClara);
        $peao.setMov(movs, pos, element);
        _setCasas(movimentos);
        if (movimentos.length)
            $(element).closest(`.casa`).addClass('on');
    },
    torre: (element) => {
        resetMovs();
        let pos = $(element).attr('data-pos').split('-');
        let movs = $torre.getPositions(pos);
        $torre.setMov(movs, pos, element);
        _setCasas(movimentos);
        if (movimentos.length)
            $(element).closest(`.casa`).addClass('on');
    },
    cavalo: (element) => {
        resetMovs();
        let pos = $(element).attr('data-pos').split('-').map(Number);
        let movs = $cavalo.getPositions(pos);
        $cavalo.setMov(movs, pos, element);
        _setCasas(movimentos);
        if (movimentos.length)
            $(element).closest(`.casa`).addClass('on');
    },
    bispo: (element) => {
        resetMovs();
        let pos = $(element).attr('data-pos').split('-').map(Number);
        let movs = $bispo.getPositions(pos);
        $bispo.setMov(movs, pos, element);
        _setCasas(movimentos);
        if (movimentos.length)
            $(element).closest(`.casa`).addClass('on');
    },
    rainha: (element) => {
        resetMovs();
        let pos = $(element).attr('data-pos').split('-').map(Number);
        let movs = $torre.getPositions(pos);
        $torre.setMov(movs, pos, element);
        movs = $bispo.getPositions(pos);
        $bispo.setMov(movs, pos, element);
        _setCasas(movimentos);
        if (movimentos.length)
            $(element).closest(`.casa`).addClass('on');
    },
    rei: (element) => {
        resetMovs();
        let pos = $(element).attr('data-pos').split('-').map(Number);
        let movs = $torre.getPositions(pos);
        $torre.setMov(movs, pos, element);
        movs = $bispo.getPositions(pos);
        $bispo.setMov(movs, pos, element);
        if (movimentos.length)
            $(element).closest(`.casa`).addClass('on');
    }
}
