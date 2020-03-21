"use strict";
/**
 * Binary IO library
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * BinaryReader
 */
var BinaryReader = /** @class */ (function () {
    /**
     * @param {Buffer} buffer
     */
    function BinaryReader(buffer) {
        this.buf = Buffer.from(buffer);
        this.ptr = 0;
    }
    BinaryReader.prototype.readInt8 = function () {
        return this.buf.readInt8(this.ptr++);
    };
    BinaryReader.prototype.readUInt8 = function () {
        return this.buf.readInt8(this.ptr++);
    };
    BinaryReader.prototype.readInt16 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var ret = littleEndian ? this.buf.readInt16LE(this.ptr) : this.buf.readInt16BE(this.ptr);
        this.ptr += 2;
        return ret;
    };
    BinaryReader.prototype.readUInt16 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var ret = littleEndian ? this.buf.readUInt16LE(this.ptr) : this.buf.readUInt16BE(this.ptr);
        this.ptr += 2;
        return ret;
    };
    BinaryReader.prototype.readInt32 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var ret = littleEndian ? this.buf.readInt32LE(this.ptr) : this.buf.readInt32BE(this.ptr);
        this.ptr += 4;
        return ret;
    };
    BinaryReader.prototype.readUInt32 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var ret = littleEndian ? this.buf.readUInt32LE(this.ptr) : this.buf.readUInt32BE(this.ptr);
        this.ptr += 4;
        return ret;
    };
    BinaryReader.prototype.readInt64 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var lo = this.readInt32(littleEndian);
        var hi = this.readInt32(littleEndian);
        return littleEndian ? [lo, hi] : [hi, lo];
    };
    BinaryReader.prototype.readUInt64 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var lo = this.readUInt32(littleEndian);
        var hi = this.readUInt32(littleEndian);
        return littleEndian ? [lo, hi] : [hi, lo];
    };
    BinaryReader.prototype.readFloat = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var ret = littleEndian ? this.buf.readFloatLE(this.ptr) : this.buf.readFloatBE(this.ptr);
        this.ptr += 4;
        return ret;
    };
    BinaryReader.prototype.readDouble = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        var ret = littleEndian ? this.buf.readDoubleLE(this.ptr) : this.buf.readDoubleBE(this.ptr);
        this.ptr += 8;
        return ret;
    };
    BinaryReader.prototype.readBoolean = function () {
        return this.readUInt8() !== 0;
    };
    BinaryReader.prototype.readBuffer = function (length) {
        var slice = this.buf.slice(this.ptr, this.ptr + length);
        this.ptr += length;
        return Buffer.from(slice);
    };
    BinaryReader.prototype.read7BitEncodedInt = function () {
        var value = 0, shift = 0, byte = 0;
        do {
            byte = this.readUInt8();
            value |= (byte & 0x7F) << shift;
            shift += 7;
        } while (byte & 0x80);
        return value;
    };
    BinaryReader.prototype.readString = function (encoding) {
        if (encoding === void 0) { encoding = 'utf-8'; }
        var length = this.read7BitEncodedInt();
        return this.readBuffer(length).toString(encoding);
    };
    BinaryReader.prototype.isEof = function () {
        return this.ptr >= this.buf.length;
    };
    return BinaryReader;
}());
exports.BinaryReader = BinaryReader;
/**
 * BinaryWriter
 */
var BinaryWriter = /** @class */ (function () {
    /**
     * @param {number} capacity
     */
    function BinaryWriter(capacity) {
        if (capacity === void 0) { capacity = 256; }
        this.buf = Buffer.alloc(capacity);
        this.ptr = 0;
    }
    /**
     * Expand buffer capacity
     * @param {number} ext
     */
    BinaryWriter.prototype.expandCapacity = function (ext) {
        this.buf = Buffer.concat([this.buf, Buffer.alloc(ext)]);
    };
    ;
    BinaryWriter.prototype.writeInt8 = function (val) {
        this.expandCapacity(1);
        this.buf.writeInt8(val, this.ptr++);
    };
    BinaryWriter.prototype.writeUInt8 = function (val) {
        this.expandCapacity(1);
        this.buf.writeUInt8(val, this.ptr++);
    };
    BinaryWriter.prototype.writeInt16 = function (val, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        this.expandCapacity(2);
        littleEndian ? this.buf.writeInt16LE(val, this.ptr) : this.buf.writeInt16BE(val, this.ptr);
        this.ptr += 2;
    };
    BinaryWriter.prototype.writeUInt16 = function (val, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        this.expandCapacity(2);
        littleEndian ? this.buf.writeUInt16LE(val, this.ptr) : this.buf.writeUInt16BE(val, this.ptr);
        this.ptr += 2;
    };
    BinaryWriter.prototype.writeInt32 = function (val, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        this.expandCapacity(4);
        littleEndian ? this.buf.writeInt32LE(val, this.ptr) : this.buf.writeInt32BE(val, this.ptr);
        this.ptr += 4;
    };
    BinaryWriter.prototype.writeUInt32 = function (val, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        this.expandCapacity(4);
        littleEndian ? this.buf.writeUInt32LE(val, this.ptr) : this.buf.writeUInt32BE(val, this.ptr);
        this.ptr += 4;
    };
    BinaryWriter.prototype.writeInt64 = function (val, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        if (littleEndian) {
            this.writeInt32(val[0]);
            this.writeInt32(val[1]);
        }
        else {
            this.writeInt32(val[1]);
            this.writeInt32(val[0]);
        }
    };
    BinaryWriter.prototype.writeUInt64 = function (val, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        if (littleEndian) {
            this.writeUInt32(val[0]);
            this.writeUInt32(val[1]);
        }
        else {
            this.writeUInt32(val[1]);
            this.writeUInt32(val[0]);
        }
    };
    BinaryWriter.prototype.writeFloat = function (val, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        this.expandCapacity(4);
        littleEndian ? this.buf.writeFloatLE(val, this.ptr) : this.buf.writeFloatBE(val, this.ptr);
        this.ptr += 4;
    };
    BinaryWriter.prototype.writeDouble = function (val, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        this.expandCapacity(8);
        littleEndian ? this.buf.writeDoubleLE(val, this.ptr) : this.buf.writeDoubleBE(val, this.ptr);
        this.ptr += 8;
    };
    BinaryWriter.prototype.writeBoolean = function (val) {
        this.writeUInt8(val ? 1 : 0);
    };
    BinaryWriter.prototype.writeBuffer = function (buffer) {
        this.expandCapacity(buffer.length);
        buffer.copy(this.buf, this.ptr);
        this.ptr += buffer.length;
    };
    BinaryWriter.prototype.write7BitEncodedInt = function (val) {
        val >>>= 0;
        while (val >= 0x80) {
            this.writeUInt8((val & 0x7F) | 0x80);
            val >>>= 7;
        }
        this.writeUInt8(val);
    };
    BinaryWriter.prototype.writeString = function (val) {
        var buffer = Buffer.from(val);
        this.write7BitEncodedInt(buffer.length);
        this.writeBuffer(buffer);
    };
    BinaryWriter.prototype.buffer = function () {
        return Buffer.from(this.buf);
    };
    return BinaryWriter;
}());
exports.BinaryWriter = BinaryWriter;
//# sourceMappingURL=binary.io.js.map