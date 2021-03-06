/* jslint node: true */

'use strict';

/**
 * Авторы - Никита Кирилов, Алексей Костюченко
 * 
 * Описание - данный модуль содержит различные инструменты для оперирование данными во время игры. Например, проверка никнейма, расчет массы и дистанции.
 */

const config = require('../../../config.json');

/**
 * @description Проверка введенного никнейма. Разрешаются только буквы и цифры.
 * @param {String} nickname никнейм игрока.
 */
exports.validNick = function (nickname) {
    var regex = /^\w*$/;
    return regex.exec(nickname) !== null;
};

/**
 * @description Определение массы из радиуса окружности.
 * @param {Number} mass масса.
 */
exports.massToRadius = function (mass) {
    return 4 + Math.sqrt(mass) * 6;
};

// Переопределение функции Math.log
exports.log = (function () {
    var log = Math.log;
    return function (n, base) {
        return log(n) / (base ? log(base) : 1);
    };
})();

/**
 * @description Получение расстояния между краями двух фигур.
 * @param {Object} p1 первая фигура.
 * @param {Object} p2 вторая фигура.
 */
exports.getDistance = function (p1, p2) {
    try {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) - p1.radius - p2.radius;
    } catch (e) {}
};

/**
 * @description Генерирует случайное значение в заданном диапазоне.
 * @param {Number} start начальное значение.
 * @param {Number} finish конечное значение.
 */
exports.randomInRange = function (start, finish) {
    return Math.floor(Math.random() * (finish - start)) + start;
};

/**
 * @description Генерирует случайную позицию в пределах поля игры.
 * @param {Number} radius радиус игрока, либо еды.
 * 
 * @returns Вернет объект, содержащий координаты x и y.
 */
exports.randomPosition = function (radius) {
    return {
        x: exports.randomInRange(radius, config.gameWidth - radius),
        y: exports.randomInRange(radius, config.gameHeight - radius)
    };
};

/**
 * @description Определение наилучшей позиции при размещении сущностей. Необходима, чтобы сущности не накладывались друг на друга.
 * @param {Array} points массив объектов.
 * @param {Number} radius радиус объектов.
 */
exports.uniformPosition = function (points, radius) {
    let bestCandidate, maxDistance = 0;
    let numberOfCandidates = 10;

    if (points.length === 0) {
        return exports.randomPosition(radius);
    }

    // Generate the candidates
    for (let ci = 0; ci < numberOfCandidates; ci++) {
        let minDistance = Infinity;
        let candidate = exports.randomPosition(radius);
        candidate.radius = radius;

        for (let pi = 0; pi < points.length; pi++) {
            let distance = exports.getDistance(candidate, points[pi]);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }

        if (minDistance > maxDistance) {
            bestCandidate = candidate;
            maxDistance = minDistance;
        } else {
            return exports.randomPosition(radius);
        }
    }

    return bestCandidate;
};

/**
 * @description Поиск индекса в массиве по идентификатору.
 * @param {Array} arr массив данных.
 * @param {*} id идентификатор
 * 
 * @returns Вернет индекс элемента, если объект будет найдет, иначе -1.
 */
exports.findIndex = function (arr, id) {
    let len = arr.length;

    while (len--) {
        if (arr[len].id === id) {
            return len;
        }
    }

    return -1;
};
