/**
 * BinaryReader
 */
class BinaryReader {
  // private member
  #buf = null;
  #ptr = 0;

  /**
   * @param {Buffer} buffer 
   */
  constructor(buffer) {
    this.#buf = Buffer.from(buffer);
  }
  
  readUInt8() {
    return this.#buf.readUInt8(this.#ptr++);
  }

  readUInt8() {
    return this.#buf.readInt8(this.#ptr++);
  }

  readInt16(littleEndian = true) {
    const ret = littleEndian ? this.#buf.readInt16LE(this.#ptr) : this.#buf.readInt16BE(this.#ptr);
    this.#ptr += 2;
    return ret;
  }
  
  readUInt16(littleEndian = true) {
    const ret = littleEndian ? this.#buf.readUInt16LE(this.#ptr) : this.#buf.readUInt16BE(this.#ptr);
    this.#ptr += 2;
    return ret;
  }
  
  readInt32(littleEndian = true) {
    const ret = littleEndian ? this.#buf.readInt32LE(this.#ptr) : this.#buf.readInt32BE(this.#ptr);
    this.#ptr += 4;
    return ret;
  }
  
  readUInt32(littleEndian = true) {
    const ret = littleEndian ? this.#buf.readUInt32LE(this.#ptr) : this.#buf.readUInt32BE(this.#ptr);
    this.#ptr += 4;
    return ret;
  }

  readInt64(littleEndian = true) {
    const lo = this.readInt32(littleEndian);
    const hi = this.readInt32(littleEndian);
    return littleEndian ? [lo, hi] : [hi, lo];
  }

  readUInt64(littleEndian = true) {
    const lo = this.readUInt32(littleEndian);
    const hi = this.readUInt32(littleEndian);
    return littleEndian ? [lo, hi] : [hi, lo];
  }

  readFloat(littleEndian = true) {
    const ret = littleEndian ? this.#buf.readFloatLE(this.#ptr) : this.#buf.readFloatBE(this.#ptr);
    this.#ptr += 4;
    return ret;
  }
  
  readDouble(littleEndian = true) {
    const ret = littleEndian ? this.#buf.readDoubleLE(this.#ptr) : this.#buf.readDoubleBE(this.#ptr);
    this.#ptr += 8;
    return ret;
  }
  
  readBoolean() {
    return this.readUInt8() !== 0;
  }
  
  read7BitEncodedInt() {
    let value = 0, shift = 0, byte;
    do {
      byte = this.readUInt8();
      value |= (byte & 0x7F) << shift;
      shift += 7;
    } while (byte & 0x80);
    return value;
  }
  
  readString() {
    const length = this.read7BitEncodedInt();
    let ret = '';
    for (let i = 0; i < length; ++i) {
      ret += String.fromCharCode(this.readUInt8());
    }
    return ret;
  }

  readBuffer(length) {
    const slice = this.#buf.slice(this.#ptr, this.#ptr + length);
    this.#ptr += length;
    return Buffer.from(slice);
  }
  
  isEof() {
    return this.#ptr >= this.#buf.length;
  }
};

module.exports = {
  BinaryReader
};