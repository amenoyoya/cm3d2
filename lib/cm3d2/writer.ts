/**
 * Custom Maid 3D2 save data exporter
 */
import {BinaryWriter} from '../binary.io';

export class CM3D2Writer {
  // private member
  private writer: BinaryWriter;

  constructor() {
    this.writer = new BinaryWriter();
  }

  /**
   * Export json data to buffer
   * @param {*} data jsonデータ
   */
  exportSaveData(data) {
		this.writer.writeString('CM3D2_SAVE');
		this.writer.writeInt32(data.version);
    
    this.writer.writeString(data.header.saveTime);
		this.writer.writeInt32(data.header.gameDay);
		this.writer.writeString(data.header.playerName);
		this.writer.writeInt32(data.header.maidNum);
		this.writer.writeString(data.header.comment);
    
    this.writer.writeString('CM3D2_CHR_MGR');
		this.writer.writeInt32(data.version);
    
    this.writePlayerParam(data.version, data.chrMgr.playerParam);
    this.writer.writeInt32(data.chrMgr.stockMan.length);
    for (const man of data.chrMgr.stockMan) {
			this.writeMaidProps(data.version, man.props);
			this.writeMaidMisc(data.version, man.misc);
		}

		this.writer.writeInt32(data.chrMgr.stockMaid.length);
		for (const maid of data.chrMgr.stockMaid) {
			this.writeMaidProps(data.version, maid.props);
			this.writeMaidParts(data.version, maid.parts);
			this.writeMaidParam(data.version, maid.param);
			this.writeMaidMisc(data.version, maid.misc);
		}

		this.writer.writeString('CM3D2_SCRIPT');
		this.writer.writeInt32(data.version);
		this.writer.writeString('CM3D2_KAG');
		this.writer.writeInt32(data.version);
		this.writeBase64(data.script.kag);
		this.writer.writeBoolean(data.script.fadeWait);
		this.writer.writeBoolean(data.script.enabled);
		
		if (data.version >= 146) {
			this.writer.writeString('CM3D2_DeskCustomize');
			this.writer.writeInt32(data.version);
		
			this.writer.writeInt32(data.dskMgr.deskDecoration.length);
			for (const decoration of data.dskMgr.deskDecoration) {
				this.writer.writeFloat(decoration.id);
				this.writer.writeFloat(decoration.index);
				this.writer.writeBoolean(decoration.visible);
				this.writer.writeBoolean(decoration.monthOnly);
				this.writeXYZ(decoration.pos);
				this.writeXYZ(decoration.rot);
				this.writeXYZ(decoration.sca);
			}
		}
		return this.writer.buffer();
  }
  
  /**
   * @private Get the object keys
   */
  private getKeys(obj) {
		return Object.getOwnPropertyNames(obj).filter(name => {
			return name !== '_rv';
		});
	}

  /**
   * @private Write color info 
   */
  private writeRGBA(data) {
		this.writer.writeFloat(data.r);
		this.writer.writeFloat(data.g);
		this.writer.writeFloat(data.b);
		this.writer.writeFloat(data.a);
	}
  
  /**
   * @private Write position info
   */
	private writeXYZ(data) {
		this.writer.writeFloat(data.x);
		this.writer.writeFloat(data.y);
		this.writer.writeFloat(data.z);
	}

  /**
   * @private Write exp data
   */
	private writeExpData(data) {
		this.writer.writeInt32(data.currentExp);
		this.writer.writeInt32(data.totalExp);
		this.writer.writeInt32(data.nextExp);
		this.writer.writeInt32(data.level);
	}

  /**
   * @private Write maid property
   */
	private writeMaidProp(version, data) {
		this.writer.writeString('CM3D2_MPROP');
		this.writer.writeInt32(version);
		this.writer.writeInt32(data.idx);
		this.writer.writeString(data.name);
		this.writer.writeInt32(data.type);
		this.writer.writeInt32(data.valueDefault);
		this.writer.writeInt32(data.value);
		this.writer.writeInt32(data.tempValue);
		this.writer.writeInt32(data.valueLinkMax);
		this.writer.writeString(data.fileName);
		this.writer.writeInt32(data.fileNameRid);
		this.writer.writeBoolean(data.dut);
		this.writer.writeInt32(data.max);
		this.writer.writeInt32(data.min);
	}

  /**
   * @private Write maid parts color
   */
	private writePartsColor(data) {
		this.writer.writeBoolean(data.use);
		this.writer.writeInt32(data.mainHue);
		this.writer.writeInt32(data.mainChroma);
		this.writer.writeInt32(data.mainBrightness);
		this.writer.writeInt32(data.mainConstrast);
		this.writer.writeInt32(data.shadowRate);
		this.writer.writeInt32(data.shadowHue);
		this.writer.writeInt32(data.shadowChroma);
		this.writer.writeInt32(data.shadowBrightness);
		this.writer.writeInt32(data.shadowContrast);
	}

  /**
   * @private Write maid parts
   */
	private writeMaidParts(version, data) {
		this.writer.writeString('CM3D2_MULTI_COL');
		this.writer.writeInt32(version);
		this.writer.writeInt32(data.length);
		for (const parts of data) {
			this.writePartsColor(parts);
		}
	}

  /**
   * @private Write maid parameters
   */
	private writeMaidParam(version, data) {
		this.writer.writeString('CM3D2_MAID_PPARAM');
		this.writer.writeInt32(version);

		this.writer.writeString(data.guid);
		this.writer.writeString(data.createTime);
		this.writer.writeInt64(data.createTimeNum);
		this.writer.writeInt32(data.employmentDay);
		this.writer.writeInt32(data.maidPoint);
		this.writer.writeString(data.lastName);
		this.writer.writeString(data.firstName);
		this.writer.writeString(data.profile);
		this.writer.writeString(data.freeComment);
		this.writer.writeInt32(data.initialExperience);
		this.writer.writeInt32(data.experience);
		this.writer.writeInt32(data.personal);
		this.writer.writeInt32(data.contractType);

		this.writer.writeInt32(data.maidClassData.length);
		for (const classData of data.maidClassData) {
			this.writer.writeBoolean(classData.have);
			this.writeExpData(classData.exp);
		}

		this.writer.writeInt32(data.currentMaidClass);

		this.writer.writeInt32(data.sexualClassData.length);
		for (const classData of data.sexualClassData) {
			this.writer.writeBoolean(classData.have);
			this.writeExpData(classData.exp);
		}

		this.writer.writeInt32(data.currentSexualClass);

		this.writer.writeInt32(data.features.length);
		for (const feature of data.features) {
			this.writer.writeInt32(feature);
		}

		this.writer.writeInt32(data.propensities.length);
		for (const propensity of data.propensities) {
			this.writer.writeInt32(propensity);
		}

		this.writer.writeInt32(data.body.height);
		this.writer.writeInt32(data.body.weight);
		this.writer.writeInt32(data.body.bust);
		this.writer.writeInt32(data.body.waist);
		this.writer.writeInt32(data.body.hip);
		this.writer.writeString(data.body.cup);
		this.writer.writeInt32(data.condition);
		this.writer.writeInt32(data.conditionSpecial);
		this.writer.writeInt32(data.sexCount);
		this.writer.writeInt32(data.othersPlayCount);
		this.writer.writeInt32(data.likability);
		this.writer.writeInt32(data.studyRate);
		this.writer.writeInt32(data.currentHP);
		this.writer.writeInt32(data.hp);
		this.writer.writeInt32(data.currentMind);
		this.writer.writeInt32(data.mind);
		this.writer.writeInt32(data.currentReason);
		this.writer.writeInt32(data.reason);
		this.writer.writeInt32(data.reception);
		this.writer.writeInt32(data.care);
		this.writer.writeInt32(data.lovely);
		this.writer.writeInt32(data.lust);
		this.writer.writeInt32(data.elegance);
		this.writer.writeInt32(data.masochism);
		this.writer.writeInt32(data.charm);
		this.writer.writeInt32(data.pervert);
		this.writer.writeInt32(data.service);
		this.writer.writeInt32(data.teachRate);
		this.writer.writeInt32(data.sexual.mouth);
		this.writer.writeInt32(data.sexual.throat);
		this.writer.writeInt32(data.sexual.nipple);
		this.writer.writeInt32(data.sexual.front);
		this.writer.writeInt32(data.sexual.back);
		this.writer.writeInt32(data.sexual.curi);
		this.writer.writeInt32(data.playNumber);
		this.writer.writeInt32(data.frustration);
		this.writer.writeInt32(data.popularRank);
		this.writer.writeInt64(data.evaluation);
		this.writer.writeInt64(data.totalEvaluation);
		this.writer.writeInt64(data.sales);
		this.writer.writeInt64(data.totalSales);
		this.writer.writeBoolean(data.isFirstNameCall);
		this.writer.writeBoolean(data.isRentalMaid);
		this.writer.writeInt32(data.noonWorkID);
		this.writer.writeInt32(data.nightWorkID);

		let keys = this.getKeys(data.skillData);
		this.writer.writeInt32(keys.length);
		for (const key of keys) {
			this.writer.writeInt32(parseInt(key));
			const val = data.skillData[key];
			this.writer.writeInt32(val.id);
			this.writer.writeUInt32(val.playCount);
			this.writeExpData(val.exp);
		}

		keys = this.getKeys(data.workData);
		this.writer.writeInt32(keys.length);
		for (const key of keys) {
			this.writer.writeInt32(parseInt(key));
			var val = data.workData[key];
			this.writer.writeInt32(val.id);
			this.writer.writeUInt32(val.playCount);
			this.writer.writeInt32(val.level);
		}

		keys = this.getKeys(data.genericFlag);
		this.writer.writeInt32(keys.length);
		for (const key of keys) {
			this.writer.writeString(key);
			this.writer.writeInt32(data.genericFlag[key]);
		}

		this.writer.writeBoolean(data.employment);
		this.writer.writeBoolean(data.leader);
		this.writer.writeInt32(data.eyePartsTab);

		keys = this.getKeys(data.partsDict);
		this.writer.writeInt32(keys.length);
		for (const key of keys) {
			this.writer.writeString(key);
			this.writer.writeString(data.partsDict[key]);
		}

		this.writer.writeInt32(data.maidClassBonusStatus.hp);
		this.writer.writeInt32(data.maidClassBonusStatus.mind);
		this.writer.writeInt32(data.maidClassBonusStatus.reception);
		this.writer.writeInt32(data.maidClassBonusStatus.care);
		this.writer.writeInt32(data.maidClassBonusStatus.lovely);
		this.writer.writeInt32(data.maidClassBonusStatus.lust);
		this.writer.writeInt32(data.maidClassBonusStatus.elegance);
		this.writer.writeInt32(data.maidClassBonusStatus.masochism);
		this.writer.writeInt32(data.maidClassBonusStatus.charm);
		this.writer.writeInt32(data.maidClassBonusStatus.pervert);
		this.writer.writeInt32(data.maidClassBonusStatus.service);
		this.writer.writeInt32(data.maidClassBonusStatus.teachRate);

		this.writer.writeInt32(1923480616);
	}

  /**
   * @private Write base64 data as binary data
   */
	private writeBase64(data) {
		const buffer = Buffer.from(data, 'base64');
		this.writer.writeInt32(buffer.length);
		this.writer.writeBuffer(buffer);
	}

  /**
   * @private Write maid misc
   */
	private writeMaidMisc(version, data) {
		this.writer.writeString('CM3D2_MAID_MISC');
		this.writer.writeInt32(version);
		this.writer.writeInt32(data.activeSlotNo);
		this.writeBase64(data.texIcon);
		this.writer.writeString(data.thumbCardTime);
		this.writeRGBA(data.colorMan);
	}

  /**
   * @private Write maid properties
   */
	private writeMaidProps(version, data) {
		this.writer.writeString('CM3D2_MPROP_LIST');
		this.writer.writeInt32(version);

		const keys = this.getKeys(data);
		this.writer.writeInt32(keys.length);
		for (const key of keys) {
			this.writer.writeString(key);
			this.writeMaidProp(version, data[key]);
		}
	}

  /**
   * @private Write player parameters
   */
	private writePlayerParam(version, data) {
		this.writer.writeString('CM3D2_PPARAM');
		this.writer.writeInt32(version);

		this.writer.writeString(data.playerName);
		this.writer.writeInt32(data.scenarioPhase);
		this.writer.writeInt32(data.phaseDays);
		this.writer.writeInt32(data.days);
		this.writer.writeInt64(data.shopUseMoney);
		this.writer.writeInt64(data.money);
		this.writer.writeInt64(data.initialSalonLoan);
		this.writer.writeInt64(data.salonLoan);
		this.writer.writeInt32(data.salonClean);
		this.writer.writeInt32(data.salonBeautiful);
		this.writer.writeInt32(data.salonEvaluation);
		this.writer.writeBoolean(data.isFirstNameCall);
		this.writer.writeInt32(data.currentSalonGrade);
		this.writer.writeInt32(data.bestSalonGrade);

		for (let i = 0; i < 6; ++i) {
			const schedule = data.scheduleSlots[i];
			this.writer.writeString(schedule.maidGuid);
			this.writer.writeInt32(schedule.noonSuccessLevel);
			this.writer.writeInt32(schedule.nightSuccessLevel);
			this.writer.writeBoolean(schedule.communication);

			const keys = this.getKeys(schedule.backupStatusDict);
			this.writer.writeInt32(keys.length);
			for (const key of keys) {
				this.writer.writeString(key);
				this.writer.writeInt32(schedule.backupStatusDict[key]);
			}
		}

		let keys = this.getKeys(data.genericFlag);
		this.writer.writeInt32(keys.length);
		for (const key of keys) {
			this.writer.writeString(key);
			this.writer.writeInt32(data.genericFlag[key]);
		}

		keys = this.getKeys(data.nightWorksStateDict);
		this.writer.writeInt32(keys.length);
		for (const key of keys) {
			this.writer.writeInt32(parseInt(key));
			const val = data.nightWorksStateDict[key];
			this.writer.writeInt32(val.workId);
			this.writer.writeString(val.calledMaidGuid);
			this.writer.writeBoolean(val.finish);
		}

		keys = this.getKeys(data.shopLineupDict);
		this.writer.writeInt32(keys.length);
		for (const key of keys) {
			this.writer.writeInt32(parseInt(key));
			this.writer.writeInt32(data.shopLineupDict[key]);
		}

		keys = this.getKeys(data.haveItemList);
		this.writer.writeInt32(keys.length);
		for (const key of keys) {
			this.writer.writeString(key);
			this.writer.writeBoolean(data.haveItemList[key]);
		}

		this.writer.writeInt32(data.haveTrophyList.length);
		for (const trophy of data.haveTrophyList) {
			this.writer.writeInt32(trophy);
		}

		this.writer.writeInt32(data.maidClassOpenFlag.length);
		for (const flag of data.maidClassOpenFlag) {
			this.writer.writeInt32(flag);
		}

		this.writer.writeInt32(data.sexualClassOpenFlag.length);
		for (const flag of data.sexualClassOpenFlag) {
			this.writer.writeInt32(flag);
		}

		if (version >= 117) {
			const keys = this.getKeys(data.rentalMaidBackupDataDict);
			this.writer.writeInt32(keys.length);
			for (const key of keys) {
				this.writer.writeString(key);
				const data2 = data.rentalMaidBackupDataDict[key];
				this.writer.writeString(data2.name);
				this.writer.writeInt32(data2.experience);

				const flagKeys = this.getKeys(data2.genericFlag);
				this.writer.writeInt32(flagKeys.length);
				for (const key of flagKeys) {
					this.writer.writeString(key);
					this.writer.writeInt32(data2.genericFlag[key]);
				}
			}
		}
		this.writer.writeInt32(348195810);
	}
}