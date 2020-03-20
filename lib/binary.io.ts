/**
 * BinaryReader
 */

export class BinaryReader {
  // private member
  private buf: Buffer;
  private ptr: number;

  /**
   * @param {Buffer} buffer 
   */
  constructor(buffer: Buffer) {
    this.buf = Buffer.from(buffer);
    this.ptr = 0;
  }
  
  readInt8() {
    return this.buf.readInt8(this.ptr++);
  }

  readUInt8() {
    return this.buf.readInt8(this.ptr++);
  }

  readInt16(littleEndian: boolean = true) {
    const ret = littleEndian ? this.buf.readInt16LE(this.ptr) : this.buf.readInt16BE(this.ptr);
    this.ptr += 2;
    return ret;
  }
  
  readUInt16(littleEndian: boolean = true) {
    const ret = littleEndian ? this.buf.readUInt16LE(this.ptr) : this.buf.readUInt16BE(this.ptr);
    this.ptr += 2;
    return ret;
  }
  
  readInt32(littleEndian: boolean = true) {
    const ret = littleEndian ? this.buf.readInt32LE(this.ptr) : this.buf.readInt32BE(this.ptr);
    this.ptr += 4;
    return ret;
  }
  
  readUInt32(littleEndian: boolean = true) {
    const ret = littleEndian ? this.buf.readUInt32LE(this.ptr) : this.buf.readUInt32BE(this.ptr);
    this.ptr += 4;
    return ret;
  }

  readInt64(littleEndian: boolean = true) {
    const lo = this.readInt32(littleEndian);
    const hi = this.readInt32(littleEndian);
    return littleEndian ? [lo, hi] : [hi, lo];
  }

  readUInt64(littleEndian: boolean = true) {
    const lo = this.readUInt32(littleEndian);
    const hi = this.readUInt32(littleEndian);
    return littleEndian ? [lo, hi] : [hi, lo];
  }

  readFloat(littleEndian: boolean = true) {
    const ret = littleEndian ? this.buf.readFloatLE(this.ptr) : this.buf.readFloatBE(this.ptr);
    this.ptr += 4;
    return ret;
  }
  
  readDouble(littleEndian: boolean = true) {
    const ret = littleEndian ? this.buf.readDoubleLE(this.ptr) : this.buf.readDoubleBE(this.ptr);
    this.ptr += 8;
    return ret;
  }
  
  readBoolean() {
    return this.readUInt8() !== 0;
  }

  readBuffer(length: number) {
    const slice = this.buf.slice(this.ptr, this.ptr + length);
    this.ptr += length;
    return Buffer.from(slice);
  }

  read7BitEncodedInt() {
    let value = 0, shift = 0, byte = 0;
    do {
      byte = this.readUInt8();
      value |= (byte & 0x7F) << shift;
      shift += 7;
    } while (byte & 0x80);
    return value;
  }
  
  readString(encoding: string = 'utf-8') {
    const length = this.read7BitEncodedInt();
    return this.readBuffer(length).toString(encoding);
  }
  
  isEof() {
    return this.ptr >= this.buf.length;
  }
};
