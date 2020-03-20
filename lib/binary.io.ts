/**
 * Binary IO library
 */

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
}

/**
 * BinaryWriter
 */
export class BinaryWriter {
  // private member
  private buf: Buffer;
  private ptr: number;

  /**
   * @param {number} capacity 
   */
  constructor(capacity: number = 256) {
    this.buf = Buffer.alloc(capacity);
    this.ptr = 0;
  }
  
  /**
   * Expand buffer capacity
   * @param {number} ext
   */
  expandCapacity(ext: number) {
    this.buf = Buffer.concat([this.buf, Buffer.alloc(ext)]);
  };
  
  writeInt8(val: number) {
    this.expandCapacity(1);
    this.buf.writeInt8(val, this.ptr++);
  }

  writeUInt8(val: number) {
    this.expandCapacity(1);
    this.buf.writeUInt8(val, this.ptr++);
  }

  writeInt16(val: number, littleEndian: boolean = true) {
    this.expandCapacity(2);
    littleEndian? this.buf.writeInt16LE(val, this.ptr): this.buf.writeInt16BE(val, this.ptr);
    this.ptr += 2;
  }

  writeUInt16(val: number, littleEndian: boolean = true) {
    this.expandCapacity(2);
    littleEndian? this.buf.writeUInt16LE(val, this.ptr): this.buf.writeUInt16BE(val, this.ptr);
    this.ptr += 2;
  }

  writeInt32(val: number, littleEndian: boolean = true) {
    this.expandCapacity(4);
    littleEndian? this.buf.writeInt32LE(val, this.ptr): this.buf.writeInt32BE(val, this.ptr);
    this.ptr += 4;
  }

  writeUInt32(val: number, littleEndian: boolean = true) {
    this.expandCapacity(4);
    littleEndian? this.buf.writeUInt32LE(val, this.ptr): this.buf.writeUInt32BE(val, this.ptr);
    this.ptr += 4;
  }

  writeInt64(val: Int32Array, littleEndian: boolean = true) {
    if (littleEndian) {
      this.writeInt32(val[0]);
      this.writeInt32(val[1]);
    } else {
      this.writeInt32(val[1]);
      this.writeInt32(val[0]);
    }
  }

  writeUInt64(val: Uint32Array, littleEndian: boolean = true) {
    if (littleEndian) {
      this.writeUInt32(val[0]);
      this.writeUInt32(val[1]);
    } else {
      this.writeUInt32(val[1]);
      this.writeUInt32(val[0]);
    }
  }

  writeFloat(val: number, littleEndian: boolean = true) {
    this.expandCapacity(4);
    littleEndian? this.buf.writeFloatLE(val, this.ptr): this.buf.writeFloatBE(val, this.ptr);
    this.ptr += 4;
  }

  writeDouble(val: number, littleEndian: boolean = true) {
    this.expandCapacity(8);
    littleEndian? this.buf.writeDoubleLE(val, this.ptr): this.buf.writeDoubleBE(val, this.ptr);
    this.ptr += 8;
  }
  
  writeBoolean(val: boolean) {
    this.writeUInt8(val ? 1 : 0);
  }

  writeBuffer(buffer: Buffer) {
    this.expandCapacity(buffer.length);
    buffer.copy(this.buf, this.ptr);
    this.ptr += buffer.length;
  }
  
  write7BitEncodedInt(val: number) {
    val >>>= 0;
    while (val >= 0x80) {
      this.writeUInt8((val & 0x7F) | 0x80);
      val >>>= 7;
    }
    this.writeUInt8(val);
  }
  
  writeString(val: string) {
    const buffer = Buffer.from(val);
    this.write7BitEncodedInt(buffer.length);
    this.writeBuffer(buffer);
  }
  
  buffer() {
    return Buffer.from(this.buf);
  }
}