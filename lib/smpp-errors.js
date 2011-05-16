/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var sys = require('sys');

module.exports = function(err) {
    self = this;
    
    if (typeof err === 'object') {
        self.name = err.name || 'SMPPError';
        self.message = err.message || '';
    } else {
        self.name = 'SMPPError';
        self.message = err;
    }
    
};

sys.inherits(module.exports, Error);