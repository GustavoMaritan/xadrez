(() => {
    const $torre = {
        getPositions(pos, ativo) {
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
        movValid(mov, pos, element, ativo) {
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
            casa = $(`.casa[data-pos="${mov.r}-${mov.c}"]`);
            if (ocupadas.length) return false;
            if (!ativo && _mesmaCor(element, casa)) return mov;
            if (_mesmaCor(element, casa)) return false;
            mov.a = casa.html() ? 'atk' : 'mov';
            return mov;
        },
        setMov(movs, pos, element, ativo) {
            movs.forEach(x => {
                let mov = $torre.movValid(x, pos, element, ativo);
                if (!mov) return;
                movimentos.push(mov);
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
        movValid(mov, pos, element, ativo) {
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

            casa = $(`.casa[data-pos="${mov.r}-${mov.c}"]`);
            if (ocupadas.length) return false;
            if (!ativo && _mesmaCor(element, casa)) return mov;
            if (_mesmaCor(element, casa)) return false;
            mov.a = casa.html() ? 'atk' : 'mov';
            return mov;
        },
        setMov(movs, pos, element, ativo) {
            movs.forEach(x => {
                let mov = $bispo.movValid(x, pos, element, ativo);
                if (!mov) return;
                movimentos.push(mov);
            });
        }
    }
    const $cavalo = {
        getPositions(pos) {
            let movs = [];
            for (let k = 0; k < 2; k++) { // esqueda | direita
                for (let p = 0; p < 2; p++) { // cima | baixo
                    for (let q = 0; q < 2; q++) { // jg1 | jg2
                        let m = {
                            r: pos[0] + ((q % 2 == 0 ? 1 : 2) * (p % 2 == 0 ? -1 : 1)),
                            c: pos[1] + ((q % 2 == 0 ? 2 : 1) * (k % 2 == 0 ? -1 : 1))
                        };
                        if (m.r > 0 && m.r < 9 && m.c > 0 && m.c < 9)
                            movs.push(m)
                    }
                }
            }
            return movs;
        },
        setMov(movs, pos, element, ativo) {
            movs.forEach(x => {
                let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
                if (!casa.html()) {
                    x.a = 'mov';
                    movimentos.push(x);
                    return;
                }
                if ((!ativo && _mesmaCor(element, casa)) || !_mesmaCor(element, casa)) {
                    x.a = 'atk';
                    movimentos.push(x);
                };
            });
        }
    }
    const $peao = {
        getPositions(pos, isClara, ativo) {
            let movs = [
                {
                    r: isClara ? +pos[0] + 1 : +pos[0] - 1,
                    c: +pos[1] + 1,
                    t: 'atk'
                }, {
                    r: isClara ? +pos[0] + 1 : +pos[0] - 1,
                    c: +pos[1] - 1,
                    t: 'atk'
                }
            ];

            if (ativo)
                movs.push({
                    r: +pos[0] + (isClara ? 1 : -1),
                    c: +pos[1],
                    t: 'mov'
                })
            return movs;
        },
        setMov(movs, pos, element, ativo) {
            movs.forEach(x => {
                console.log('Peao P ', x)
                let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
                x.a = x.t;
                if (x.t == 'mov') {
                    if (!casa.html()) {
                        movimentos.push(x);
                    }
                } else {
                    if (!ativo) {
                        if (!casa.html() || _mesmaCor(element, casa))
                            movimentos.push(x);
                    }
                    if (casa.html() && !_mesmaCor(element, casa)) {
                        movimentos.push(x);
                    }
                }
            });
            console.log('Peao M ', movimentos)
        }
    }
    const $rei = {
        getPositions(pos, isClara) {

        },
        setMov(movs, pos, element) {

        }
    }
    const _getCasa = (x) => {
        return $(`.casa[data-pos="${x.r}-${x.c}"]`);
    }
    const _mesmaCor = (element, casa) => {
        return $(element).attr(`data-cor`) == casa.find('img').attr(`data-cor`);
    }
    const _getPosition = (element) => {
        return $(element).attr('data-pos').split('-').map(Number);
    }
    const _setCasas = ($movimentos) => {
        $movimentos.map(x => {
            let casa = $(`.casa[data-pos="${x.r}-${x.c}"]`);
            casa.addClass(x.a == 'mov' ? 'select' : 'comer');
        });
    }

    window.$setCasas = _setCasas;
    window.$jogadas = {
        peao: (element, ativo) => {
            let isClara = $(element).attr(`data-cor`) == 'clara';
            let pos = _getPosition(element);
            let movs = $peao.getPositions(pos, isClara, ativo);
            $peao.setMov(movs, pos, element, ativo);
        },
        torre: (element, ativo) => {
            let pos = _getPosition(element);
            let movs = $torre.getPositions(pos, ativo);
            $torre.setMov(movs, pos, element, ativo);
        },
        cavalo: (element, ativo) => {
            let pos = _getPosition(element);
            let movs = $cavalo.getPositions(pos);
            $cavalo.setMov(movs, pos, element, ativo);
        },
        bispo: (element, ativo) => {
            let pos = _getPosition(element);
            let movs = $bispo.getPositions(pos, ativo);
            $bispo.setMov(movs, pos, element, ativo);
        },
        rainha: (element, ativo) => {
            let pos = _getPosition(element);
            let movs = $torre.getPositions(pos, ativo);
            $torre.setMov(movs, pos, element, ativo);
            movs = $bispo.getPositions(pos, ativo);
            $bispo.setMov(movs, pos, element, ativo);
        },
        rei: (element, ativo) => {
            let pos = _getPosition(element);
            let corAdvers = $(element).attr('data-cor') == 'clara' ? 'escura' : 'clara';
            let movs = []; // $torre.getPositions(pos);
            for (let p = 0; p < 4; p++) {
                let mr = p == 0 ? -1 : p == 1 ? 0 : 1;
                let mc = p == 3 ? 0 : -1;
                let l1 = {
                    r: pos[0] + mr,
                    c: pos[1] + mc
                }
                let l2 = {
                    r: pos[0] + (mr * -1),
                    c: pos[1] + (mc * -1)
                }
                if (l1.r > 0 && l1.r < 9 && l1.c > 0 && l1.c < 9) {
                    let casa = _getCasa(l1);
                    if (!casa.html() || !_mesmaCor(element, casa))
                        movs.push(l1);
                }
                if (l2.r > 0 && l2.r < 9 && l2.c > 0 && l2.c < 9) {
                    let casa = _getCasa(l2);
                    if (!casa.html() || !_mesmaCor(element, casa))
                        movs.push(l2);
                }
            }

            if (!ativo) {
                movs.forEach(x => {
                    movimentos.push({
                        r: x.r,
                        c: x.c
                    });
                })
                return;
            }

            $(`.peca[data-cor="${corAdvers}"]`).each(function (obj) {
                $jogadas[$(this).attr('data-tipo')](this);
            });

            let possiveis = movs.map(x => {
                if (!movimentos.some(y => y.r == x.r && y.c == x.c)) {
                    let casa = _getCasa(x);
                    x.a = casa.html() ? 'atk' : 'mov';
                    return x;
                }
            }).filter(x => x);

            movimentos = possiveis;
        }
    }
})();