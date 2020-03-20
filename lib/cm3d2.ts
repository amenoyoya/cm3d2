/**
 * Custom Maid 3D2
 */
import {BinaryReader} from './binary.io';

export class CM3D2 {
  // private member
  private reader: BinaryReader;

  /**
   * @param {Buffer} buffer 
   */
  constructor(buffer) {
    this.reader = new BinaryReader(buffer);
  }

  /**
   * Parse save data 
   */
  parseSaveData() {
		if (this.reader.readString() !== 'CM3D2_SAVE') {
			throw new Error('Expected CM3D2_SAVE');
		}
		const version = this.reader.readInt32();
		this.checkVersion(version);

		const ret = {
			version: version,
			header: {
				saveTime: this.reader.readString(),
				gameDay: this.reader.readInt32(),
				playerName: this.reader.readString(),
				maidNum: this.reader.readInt32(),
				comment: this.reader.readString(),
			},
			chrMgr: {
				playerParam: null,
				stockMan: [],
				stockMaid: []
			},
			dskMgr: {
				deskDecoration: []
			},
			script: null
		}

		if (this.reader.readString() !== 'CM3D2_CHR_MGR') {
			throw new Error('Expected CM3D2_CHR_MGR');
		}
		this.checkVersion(this.reader.readInt32());
		ret.chrMgr.playerParam = this.readPlayerParam();

		for (let i = this.reader.readInt32(); i > 0; --i) {
			ret.chrMgr.stockMan.push({
				props: this.readMaidProps(),
				misc: this.readMaidMisc()
			});
		}

		for (let i = this.reader.readInt32(); i > 0; --i) {
			ret.chrMgr.stockMaid.push({
				props: this.readMaidProps(),
				parts: this.readMaidParts(),
				param: this.readMaidParam(),
				misc: this.readMaidMisc()
			});
		}

		if (this.reader.readString() !== 'CM3D2_SCRIPT') {
			throw new Error('Expected CM3D2_SCRIPT');
		}
		this.checkVersion(this.reader.readInt32());

		if (this.reader.readString() !== 'CM3D2_KAG') {
			throw new Error('Expected CM3D2_KAG');
		}
		this.checkVersion(this.reader.readInt32());

		ret.script = {
			kag: this.readBase64(),
			fadeWait: this.reader.readBoolean(),
			enabled: this.reader.readBoolean()
		};
		
		if (version >= 146) {
			if (this.reader.readString() !== 'CM3D2_DeskCustomize') {
				throw new Error('Expected CM3D2_DeskCustomize');
			}
			this.checkVersion(this.reader.readInt32());

			for (let i = this.reader.readInt32(); i > 0; --i) {
				ret.dskMgr.deskDecoration.push({
					id: this.reader.readFloat(),
					index: this.reader.readFloat(),
					visible: this.reader.readBoolean(),
					monthOnly: this.reader.readBoolean(),
					pos: this.readXYZ(),
					rot: this.readXYZ(),
					sca: this.readXYZ()
				});
			}
		}

		if (!this.reader.isEof()) {
      throw Error('Unknown save data format');
    }
		return ret;
	}

  /**
   * @private Check the version is correct
   * @param {int} version
   */
  checkVersion(version) {
    if (version > 153 || version < 101) {
			throw new Error('Version ' + (version / 100) + ' is not supported');
		}
  }

  /**
   * @private Read player parameters
   */
  readPlayerParam() {
    if (this.reader.readString() !== 'CM3D2_PPARAM') {
			throw new Error('Expected CM3D2_PPARAM');
		}
		const version = this.reader.readInt32();
		this.checkVersion(version);

		const ret = {
			playerName: this.reader.readString(),
			scenarioPhase: this.reader.readInt32(),
			phaseDays: this.reader.readInt32(),
			days: this.reader.readInt32(),
			shopUseMoney: this.reader.readInt64(),
			money: this.reader.readInt64(),
			initialSalonLoan: this.reader.readInt64(),
			salonLoan: this.reader.readInt64(),
			salonClean: this.reader.readInt32(),
			salonBeautiful: this.reader.readInt32(),
			salonEvaluation: this.reader.readInt32(),
			isFirstNameCall: this.reader.readBoolean(),
			currentSalonGrade: this.reader.readInt32(),
			bestSalonGrade: this.reader.readInt32(),
			scheduleSlots: [],
			genericFlag: {},
			nightWorksStateDict: {},
			shopLineupDict: {},
			haveItemList: {},
			haveTrophyList: [],
			maidClassOpenFlag: [],
			sexualClassOpenFlag: [],
			rentalMaidBackupDataDict: {},
		};

		for (let i = 0; i < 6; ++i) {
			const schedule = {
				maidGuid: this.reader.readString(),
				noonSuccessLevel: this.reader.readInt32(),
				nightSuccessLevel: this.reader.readInt32(),
				communication: this.reader.readBoolean(),
				backupStatusDict: {}
			};
			for (let j = this.reader.readInt32(); j > 0; --j) {
				schedule.backupStatusDict[this.reader.readString()] = this.reader.readInt32();
			}
			ret.scheduleSlots[i] = schedule;
		}

		for (let i = this.reader.readInt32(); i > 0; --i) {
			ret.genericFlag[this.reader.readString()] = this.reader.readInt32();
		}

		for (let i = this.reader.readInt32(); i > 0; --i) {
			ret.nightWorksStateDict[this.reader.readInt32()] = {
				workId: this.reader.readInt32(),
				calledMaidGuid: this.reader.readString(),
				finish: this.reader.readBoolean()
			};
		}

		for (let i = this.reader.readInt32(); i > 0; --i) {
			ret.shopLineupDict[this.reader.readInt32()] = this.reader.readInt32();
		}

		for (let i = this.reader.readInt32(); i > 0; --i) {
			ret.haveItemList[this.reader.readString()] = this.reader.readBoolean();
		}

		for (let i = this.reader.readInt32(); i > 0; --i) {
			ret.haveTrophyList.push(this.reader.readInt32());
		}

		for (let i = this.reader.readInt32(); i > 0; --i) {
			ret.maidClassOpenFlag.push(this.reader.readInt32());
		}

		for (let i = this.reader.readInt32(); i > 0; --i) {
			ret.sexualClassOpenFlag.push(this.reader.readInt32());
		}

		if (version >= 117) {
			for (let i = this.reader.readInt32(); i > 0; --i) {
				const key = this.reader.readString();
				const data = {
					name: this.reader.readString(),
					experience: this.reader.readInt32(),
					genericFlag: []
				};
				ret.rentalMaidBackupDataDict[key] = data;

				for (let j = this.reader.readInt32(); j > 0; --j) {
					data.genericFlag[this.reader.readString()] = this.reader.readInt32();
				}
			}
		}

		if (this.reader.readInt32() !== 348195810) {
			throw new Error('Magic number mismatch');
		}
		return ret;
  }

  /**
   * @private Read maid property 
   */
  readMaidProp() {
		if (this.reader.readString() !== 'CM3D2_MPROP') {
			throw new Error('Expected CM3D2_MPROP');
		}
		this.checkVersion(this.reader.readInt32());
    return {
      idx: this.reader.readInt32(),
      name: this.reader.readString(),
      type: this.reader.readInt32(),
      valueDefault: this.reader.readInt32(),
      value: this.reader.readInt32(),
      tempValue: this.reader.readInt32(),
      valueLinkMax: this.reader.readInt32(),
      fileName: this.reader.readString(),
      fileNameRid: this.reader.readInt32(),
      dut: this.reader.readBoolean(),
      max: this.reader.readInt32(),
      min: this.reader.readInt32()
		}
	}

  /**
   * @private Read maid properties
   */
  readMaidProps() {
		if (this.reader.readString() !== 'CM3D2_MPROP_LIST') {
			throw new Error('Expected CM3D2_MPROP_LIST');
		}
		this.checkVersion(this.reader.readInt32());

		const props = {};
		for (let i = this.reader.readInt32(); i > 0; --i) {
			props[this.reader.readString()] = this.readMaidProp();
		}
		return props;
  }
  
  /**
   * @private Read binary data as base64
   */
  readBase64() {
    const length = this.reader.readInt32();
		return this.reader.readBuffer(length).toString('base64');
  }

  /**
   * @private Read position info
   */
  readXYZ() {
		return {
			x: this.reader.readFloat(),
			y: this.reader.readFloat(),
			z: this.reader.readFloat()
		};
	}

  /**
   * @private Read color info
   */
  readRGBA() {
    return {
			r: this.reader.readFloat(),
			g: this.reader.readFloat(),
			b: this.reader.readFloat(),
			a: this.reader.readFloat()
		};
  }

  /**
   * @private Read maid misc
   */
  readMaidMisc() {
		if (this.reader.readString() !== 'CM3D2_MAID_MISC') {
			throw new Error('Expected CM3D2_MAID_MISC');
		}
    this.checkVersion(this.reader.readInt32());
    return {
      activeSlotNo: this.reader.readInt32(),
      texIcon: this.readBase64(),
      thumbCardTime: this.reader.readString(),
      colorMan: this.readRGBA()
    }
  }

  /**
   * @private Read maid parts color
   */
  readPartsColor() {
		return {
			use: this.reader.readBoolean(),
			mainHue: this.reader.readInt32(),
			mainChroma: this.reader.readInt32(),
			mainBrightness: this.reader.readInt32(),
			mainConstrast: this.reader.readInt32(),
			shadowRate: this.reader.readInt32(),
			shadowHue: this.reader.readInt32(),
			shadowChroma: this.reader.readInt32(),
			shadowBrightness: this.reader.readInt32(),
			shadowContrast: this.reader.readInt32()
		};
	}
  
  /**
   * @private Read maid parts 
   */
  readMaidParts() {
		if (this.reader.readString() !== 'CM3D2_MULTI_COL') {
			throw new Error('Expected CM3D2_MULTI_COL');
		}
		this.checkVersion(this.reader.readInt32());

		const ret = [];
		for (let i = this.reader.readInt32(); i > 0; --i) {
			ret.push(this.readPartsColor());
		}
		return ret;
	}

  /**
   * @private Read maid EXP data
   */
  readExpData() {
    return {
			currentExp: this.reader.readInt32(),
			totalExp: this.reader.readInt32(),
			nextExp: this.reader.readInt32(),
			level: this.reader.readInt32()
		};
  }

  /**
   * @private Read maid class data
   */
  readMaidClassData() {
    const ret = [];
    for (let i = this.reader.readInt32(); i > 0; --i) {
      ret.push({
        have: this.reader.readBoolean(),
        exp: this.readExpData()
      });
    }
    return ret;
  }

  /**
   * @private Read maid sexial class data
   */
  readSexialClassData() {
    const ret = [];
    for (let i = this.reader.readInt32(); i > 0; --i) {
      ret.push({
        have: this.reader.readBoolean(),
        exp: this.readExpData()
      });
    }
    return ret;
  }

  /**
   * @private Read maid features
   */
  readFeatures() {
    const ret = [];
    for (let i = this.reader.readInt32(); i > 0; --i) {
      ret.push(this.reader.readInt32()); // Feature
    }
    return ret;
  }

  /**
   * @private Read maid propensities
   */
  readPropensities() {
    const ret = [];
    for (let i = this.reader.readInt32(); i > 0; --i) {
      ret.push(this.reader.readInt32()); // Propensity
    }
    return ret;
  }

  /**
   * @private Read maid skill data
   */
  readSkillData() {
    const ret = {};
    for (let i = this.reader.readInt32(); i > 0; --i) {
      ret[this.reader.readInt32()] = {
        id: this.reader.readInt32(),
        playCount: this.reader.readUInt32(),
        exp: this.readExpData()
      };
    }
    return ret;
  }

  /**
   * @private Read maid work data
   */
  readWorkData() {
    const ret = {};
    for (let i = this.reader.readInt32(); i > 0; --i) {
      ret[this.reader.readInt32()] = {
        id: this.reader.readInt32(),
        playCount: this.reader.readUInt32(),
        level: this.reader.readInt32()
      };
    }
    return ret;
  }

  /**
   * @private Read maid generic flag
   */
  readGenericFlag() {
    const ret = {};
    for (let i = this.reader.readInt32(); i > 0; --i) {
      ret[this.reader.readString()] = this.reader.readInt32();
    }
    return ret;
  }

  /**
   * @private Read maid parts dictionary
   */
  readPartsDict() {
    const ret = {};
    for (let i = this.reader.readInt32(); i > 0; --i) {
      ret[this.reader.readString()] = this.reader.readString();
    }
    return ret;
  }

  /**
   * @private Read maid parameters
   */
  readMaidParam() {
    if (this.reader.readString() !== 'CM3D2_MAID_PPARAM') {
			throw new Error('Expected CM3D2_MAID_PPARAM');
		}
    this.checkVersion(this.reader.readInt32());
    const param = {
			guid: this.reader.readString(),
			createTime: this.reader.readString(),
			createTimeNum: this.reader.readInt64(),
			employmentDay: this.reader.readInt32(),
			maidPoint: this.reader.readInt32(),
			lastName: this.reader.readString(),
			firstName: this.reader.readString(),
			profile: this.reader.readString(),
			freeComment: this.reader.readString(),
			initialExperience: this.reader.readInt32(), // 初期性経験
			experience: this.reader.readInt32(), // 性経験
			personal: this.reader.readInt32(),
			contractType: this.reader.readInt32(),
			maidClassData: this.readMaidClassData(), // 全メイドタイプ
			currentMaidClass: this.reader.readInt32(), // 現在のメイドタイプ
			sexialClassData: this.readSexialClassData(), // 全夜伽タイプ
			currentYotogiClass: this.reader.readInt32(), // 現在の夜伽タイプ
			features: this.readFeatures(),
			propensities: this.readPropensities(),
			body: {
				height: this.reader.readInt32(),
				weight: this.reader.readInt32(),
				bust: this.reader.readInt32(),
				waist: this.reader.readInt32(),
				hip: this.reader.readInt32(),
				cup: this.reader.readString()
			},
			condition: this.reader.readInt32(), // 状態
			conditionSpecial: this.reader.readInt32(), // 特殊状態
			sexCount: this.reader.readInt32(),
			othersPlayCount: this.reader.readInt32(),
			likability: this.reader.readInt32(),
			studyRate: this.reader.readInt32(),
			currentHP: this.reader.readInt32(),
			hp: this.reader.readInt32(),
			currentMind: this.reader.readInt32(),
			mind: this.reader.readInt32(),
			currentReason: this.reader.readInt32(),
			reason: this.reader.readInt32(),
			reception: this.reader.readInt32(),
			care: this.reader.readInt32(),
			lovely: this.reader.readInt32(),
			inyoku: this.reader.readInt32(),
			elegance: this.reader.readInt32(),
			mValue: this.reader.readInt32(),
			charm: this.reader.readInt32(),
			pervert: this.reader.readInt32(),
			service: this.reader.readInt32(),
			teachRate: this.reader.readInt32(),
			sexual: {
				mouth: this.reader.readInt32(),
				throat: this.reader.readInt32(),
				nipple: this.reader.readInt32(),
				front: this.reader.readInt32(),
				back: this.reader.readInt32(),
				curi: this.reader.readInt32()
			},
			playNumber: this.reader.readInt32(),
			frustration: this.reader.readInt32(),
			popularRank: this.reader.readInt32(),
			evaluation: this.reader.readInt64(),
			totalEvaluation: this.reader.readInt64(),
			sales: this.reader.readInt64(),
			totalSales: this.reader.readInt64(),
			isFirstNameCall: this.reader.readBoolean(),
			isRentalMaid: this.reader.readBoolean(),
			noonWorkID: this.reader.readInt32(),
			nightWorkID: this.reader.readInt32(),
			skillData: this.readSkillData(),
			workData: this.readWorkData(),
			genericFlag: this.readGenericFlag(),
			employment: this.reader.readBoolean(),
			leader: this.reader.readBoolean(),
			eyePartsTab: this.reader.readInt32(),
			partsDict: this.readPartsDict(),
			maidClassBonusStatus: {
				hp: this.reader.readInt32(),
				mind: this.reader.readInt32(),
				reception: this.reader.readInt32(),
				care: this.reader.readInt32(),
				lovely: this.reader.readInt32(),
				lust: this.reader.readInt32(),
				elegance: this.reader.readInt32(),
				mValue: this.reader.readInt32(),
				charm: this.reader.readInt32(),
				pervert: this.reader.readInt32(),
				service: this.reader.readInt32(),
				teachRate: this.reader.readInt32()
			}
		};
		if (this.reader.readInt32() !== 1923480616) {
			throw new Error('Magic number mismatch');
		}
		return param;
  }
}