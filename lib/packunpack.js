/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

/**
 * Simplified javascript unpack, since lib only uses N, n, c, and C. SMPP protocol always is big endian.
 *
 * @param format Format, according to which pack binary string
 * @param buffer Data (Buffer or String) to unpack
 * @return Array Unpacked array or single element, if unpacking only one value.
 */
exports.unpack = function(format, buffer) {
    var pos = 0;
    var result = [];
    var quantifier = '';
    var instruction = '';
    var i = 0;
    var bufferpos = 0;

    if ((typeof buffer === 'string') || (buffer instanceof String)) {
        buffer = new Buffer(buffer, 'binary');
    }
    while (pos < format.length) {
        quantifier = '';

        instruction = format[pos];
        if ((pos < format.length - 1) && (format[pos+1] === '*')) {
            quantifier = -1;
            pos++;
        } else {
            while ((pos+1 < format.length) && (format[pos+1].match(/[\d]/) !== null)) {
                quantifier += format[pos+1];
                pos++;
            }
            if (quantifier === '') {
                quantifier = 1;
            }
        }
        quantifier *= 1;

        switch (instruction) {
            case 'n':
                // unsigned short (always 16 bit, big endian byte order)
                if (quantifier === -1) {
                    quantifier = Math.floor((buffer.length - bufferpos)/2);
                }
                quantifier = quantifier === 0 ? 1 : quantifier;
                if (buffer.length < quantifier * 2 + bufferpos) {
                    throw new Error('Buffer data not enough.');
                }
                for (i = 0; i < quantifier; i++) {
                    val = 0;
                    val += buffer[bufferpos] << 8;
                    val += buffer[bufferpos + 1];
                    result.push(val);
                    bufferpos += 2;
                }
                break;
            case 'c':
                // signed char
            case 'C':
                // unsigned char
                if (quantifier === -1) {
                    quantifier = (buffer.length - bufferpos);
                }
                if (buffer.length < quantifier + bufferpos) {
                    throw new Error('Buffer data not enough.');
                }
                for (i = 0; i < quantifier; i++) {
                    result.push(buffer[bufferpos]);
                    bufferpos++;
                }
                break;
            case 'N':
                // unsigned long (always 32 bit, big endian byte order)
                if (quantifier === -1) {
                    quantifier = Math.floor((buffer.length - bufferpos)/4);
                }
                quantifier = quantifier === 0 ? 1 : quantifier;
                if (buffer.length < quantifier * 4 + bufferpos) {
                    throw new Error('Buffer data not enough.');
                }
                for (i = 0; i < quantifier; i++) {
                    val = 0;
                    val += buffer[bufferpos] << 24;
                    val += buffer[bufferpos+1] << 16;
                    val += buffer[bufferpos+2] << 8;
                    val += buffer[bufferpos+3];
                    val = val >>> 0;
                    bufferpos += 4;
                    result.push(val);
                }
                break;
            default:
                throw new Error('Unknown format instruction ("' + instruction + '" (x' + quantifier + ') at position "' + pos + '"');
        }

        pos++;
    }
    if (result.length === 1) {
        return result[0];
    }
    return(result);
};


/**
 * Simplified javascript pack, since lib only uses N, n, c, and C. SMPP protocol always is big endian.
 *
 * @param format Format, according to which pack binary string
 * @param ...    Any number of params, according to format.
 * @return Buffer() Packed binary string
 */
exports.pack = function(format) {
    var pos = 0;
    var argpos = 0;
    var result = '';
    var quantifier = '';
    var instruction = '';
    var i = 0;

    while (pos < format.length) {
        quantifier = '';

        instruction = format[pos];
        if ((pos < format.length - 1) && (format[pos+1] === '*')) {
            quantifier = arguments.length - pos + -1;
            pos++;
        } else {
            while ((pos+1 < format.length) && (format[pos+1].match(/[\d]/) !== null)) {
                quantifier += format[pos+1];
                pos++;
            }
            if (quantifier === '') {
                quantifier = 1;
            }
        }
        quantifier *= 1;

        if (arguments.length < argpos + 1 + quantifier) {
            throw new Error('Not enough arguments to pack (for instruction "' + instruction + '" (x' + quantifier + ') at position "' + pos + '"');
        }

        switch (instruction) {
            case 'n':
                // unsigned short (always 16 bit, big endian byte order)
                for (i = 0; i < quantifier; i++) {
                    result += String.fromCharCode(arguments[argpos+1+i] >> 8 & 0xFF);
                    result += String.fromCharCode(arguments[argpos+1+i] & 0xFF);
                }
                break;
            case 'c':
                // signed char
            case 'C':
                // unsigned char
                for (i = 0; i < quantifier; i++) {
                    result += String.fromCharCode(arguments[argpos+1+i]);
                }
                break;
            case 'N':
                // unsigned long (always 32 bit, big endian byte order)
                for (i = 0; i < quantifier; i++) {
                    result += String.fromCharCode(arguments[argpos+1+i] >> 24 & 0xFF);
                    result += String.fromCharCode(arguments[argpos+1+i] >> 16 & 0xFF);
                    result += String.fromCharCode(arguments[argpos+1+i] >> 8  & 0xFF);
                    result += String.fromCharCode(arguments[argpos+1+i] & 0xFF);
                }
                break;
            default:
                throw new Error('Unknown format instruction ("' + instruction + '" (x' + quantifier + ') at position "' + pos + '"');
        }

        pos++;
        argpos += quantifier;
    }
    return(new Buffer(result, 'binary'));
};
