"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom Maid 3D2 save data exporter
 */
var binary_io_1 = require("../binary.io");
var CM3D2Writer = /** @class */ (function () {
    function CM3D2Writer() {
        this.writer = new binary_io_1.BinaryWriter();
    }
    /**
     * Export json data to buffer
     * @param {*} data jsonデータ
     */
    CM3D2Writer.prototype.exportSaveData = function (data) {
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
        for (var _i = 0, _a = data.chrMgr.stockMan; _i < _a.length; _i++) {
            var man = _a[_i];
            this.writeMaidProps(data.version, man.props);
            this.writeMaidMisc(data.version, man.misc);
        }
        this.writer.writeInt32(data.chrMgr.stockMaid.length);
        for (var _b = 0, _c = data.chrMgr.stockMaid; _b < _c.length; _b++) {
            var maid = _c[_b];
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
            for (var _d = 0, _e = data.dskMgr.deskDecoration; _d < _e.length; _d++) {
                var decoration = _e[_d];
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
    };
    /**
     * @private Get the object keys
     */
    CM3D2Writer.prototype.getKeys = function (obj) {
        return Object.getOwnPropertyNames(obj).filter(function (name) {
            return name !== '_rv';
        });
    };
    /**
     * @private Write color info
     */
    CM3D2Writer.prototype.writeRGBA = function (data) {
        this.writer.writeFloat(data.r);
        this.writer.writeFloat(data.g);
        this.writer.writeFloat(data.b);
        this.writer.writeFloat(data.a);
    };
    /**
     * @private Write position info
     */
    CM3D2Writer.prototype.writeXYZ = function (data) {
        this.writer.writeFloat(data.x);
        this.writer.writeFloat(data.y);
        this.writer.writeFloat(data.z);
    };
    /**
     * @private Write exp data
     */
    CM3D2Writer.prototype.writeExpData = function (data) {
        this.writer.writeInt32(data.currentExp);
        this.writer.writeInt32(data.totalExp);
        this.writer.writeInt32(data.nextExp);
        this.writer.writeInt32(data.level);
    };
    /**
     * @private Write maid property
     */
    CM3D2Writer.prototype.writeMaidProp = function (version, data) {
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
    };
    /**
     * @private Write maid parts color
     */
    CM3D2Writer.prototype.writePartsColor = function (data) {
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
    };
    /**
     * @private Write maid parts
     */
    CM3D2Writer.prototype.writeMaidParts = function (version, data) {
        this.writer.writeString('CM3D2_MULTI_COL');
        this.writer.writeInt32(version);
        this.writer.writeInt32(data.length);
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var parts = data_1[_i];
            this.writePartsColor(parts);
        }
    };
    /**
     * @private Write maid parameters
     */
    CM3D2Writer.prototype.writeMaidParam = function (version, data) {
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
        for (var _i = 0, _a = data.maidClassData; _i < _a.length; _i++) {
            var classData = _a[_i];
            this.writer.writeBoolean(classData.have);
            this.writeExpData(classData.exp);
        }
        this.writer.writeInt32(data.currentMaidClass);
        this.writer.writeInt32(data.sexualClassData.length);
        for (var _b = 0, _c = data.sexualClassData; _b < _c.length; _b++) {
            var classData = _c[_b];
            this.writer.writeBoolean(classData.have);
            this.writeExpData(classData.exp);
        }
        this.writer.writeInt32(data.currentSexualClass);
        this.writer.writeInt32(data.features.length);
        for (var _d = 0, _e = data.features; _d < _e.length; _d++) {
            var feature = _e[_d];
            this.writer.writeInt32(feature);
        }
        this.writer.writeInt32(data.propensities.length);
        for (var _f = 0, _g = data.propensities; _f < _g.length; _f++) {
            var propensity = _g[_f];
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
        var keys = this.getKeys(data.skillData);
        this.writer.writeInt32(keys.length);
        for (var _h = 0, keys_1 = keys; _h < keys_1.length; _h++) {
            var key = keys_1[_h];
            this.writer.writeInt32(parseInt(key));
            var val_1 = data.skillData[key];
            this.writer.writeInt32(val_1.id);
            this.writer.writeUInt32(val_1.playCount);
            this.writeExpData(val_1.exp);
        }
        keys = this.getKeys(data.workData);
        this.writer.writeInt32(keys.length);
        for (var _j = 0, keys_2 = keys; _j < keys_2.length; _j++) {
            var key = keys_2[_j];
            this.writer.writeInt32(parseInt(key));
            var val = data.workData[key];
            this.writer.writeInt32(val.id);
            this.writer.writeUInt32(val.playCount);
            this.writer.writeInt32(val.level);
        }
        keys = this.getKeys(data.genericFlag);
        this.writer.writeInt32(keys.length);
        for (var _k = 0, keys_3 = keys; _k < keys_3.length; _k++) {
            var key = keys_3[_k];
            this.writer.writeString(key);
            this.writer.writeInt32(data.genericFlag[key]);
        }
        this.writer.writeBoolean(data.employment);
        this.writer.writeBoolean(data.leader);
        this.writer.writeInt32(data.eyePartsTab);
        keys = this.getKeys(data.partsDict);
        this.writer.writeInt32(keys.length);
        for (var _l = 0, keys_4 = keys; _l < keys_4.length; _l++) {
            var key = keys_4[_l];
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
    };
    /**
     * @private Write base64 data as binary data
     */
    CM3D2Writer.prototype.writeBase64 = function (data) {
        var buffer = Buffer.from(data, 'base64');
        this.writer.writeInt32(buffer.length);
        this.writer.writeBuffer(buffer);
    };
    /**
     * @private Write maid misc
     */
    CM3D2Writer.prototype.writeMaidMisc = function (version, data) {
        this.writer.writeString('CM3D2_MAID_MISC');
        this.writer.writeInt32(version);
        this.writer.writeInt32(data.activeSlotNo);
        this.writeBase64(data.texIcon);
        this.writer.writeString(data.thumbCardTime);
        this.writeRGBA(data.colorMan);
    };
    /**
     * @private Write maid properties
     */
    CM3D2Writer.prototype.writeMaidProps = function (version, data) {
        this.writer.writeString('CM3D2_MPROP_LIST');
        this.writer.writeInt32(version);
        var keys = this.getKeys(data);
        this.writer.writeInt32(keys.length);
        for (var _i = 0, keys_5 = keys; _i < keys_5.length; _i++) {
            var key = keys_5[_i];
            this.writer.writeString(key);
            this.writeMaidProp(version, data[key]);
        }
    };
    /**
     * @private Write player parameters
     */
    CM3D2Writer.prototype.writePlayerParam = function (version, data) {
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
        for (var i = 0; i < 6; ++i) {
            var schedule = data.scheduleSlots[i];
            this.writer.writeString(schedule.maidGuid);
            this.writer.writeInt32(schedule.noonSuccessLevel);
            this.writer.writeInt32(schedule.nightSuccessLevel);
            this.writer.writeBoolean(schedule.communication);
            var keys_12 = this.getKeys(schedule.backupStatusDict);
            this.writer.writeInt32(keys_12.length);
            for (var _i = 0, keys_6 = keys_12; _i < keys_6.length; _i++) {
                var key = keys_6[_i];
                this.writer.writeString(key);
                this.writer.writeInt32(schedule.backupStatusDict[key]);
            }
        }
        var keys = this.getKeys(data.genericFlag);
        this.writer.writeInt32(keys.length);
        for (var _a = 0, keys_7 = keys; _a < keys_7.length; _a++) {
            var key = keys_7[_a];
            this.writer.writeString(key);
            this.writer.writeInt32(data.genericFlag[key]);
        }
        keys = this.getKeys(data.nightWorksStateDict);
        this.writer.writeInt32(keys.length);
        for (var _b = 0, keys_8 = keys; _b < keys_8.length; _b++) {
            var key = keys_8[_b];
            this.writer.writeInt32(parseInt(key));
            var val = data.nightWorksStateDict[key];
            this.writer.writeInt32(val.workId);
            this.writer.writeString(val.calledMaidGuid);
            this.writer.writeBoolean(val.finish);
        }
        keys = this.getKeys(data.shopLineupDict);
        this.writer.writeInt32(keys.length);
        for (var _c = 0, keys_9 = keys; _c < keys_9.length; _c++) {
            var key = keys_9[_c];
            this.writer.writeInt32(parseInt(key));
            this.writer.writeInt32(data.shopLineupDict[key]);
        }
        keys = this.getKeys(data.haveItemList);
        this.writer.writeInt32(keys.length);
        for (var _d = 0, keys_10 = keys; _d < keys_10.length; _d++) {
            var key = keys_10[_d];
            this.writer.writeString(key);
            this.writer.writeBoolean(data.haveItemList[key]);
        }
        this.writer.writeInt32(data.haveTrophyList.length);
        for (var _e = 0, _f = data.haveTrophyList; _e < _f.length; _e++) {
            var trophy = _f[_e];
            this.writer.writeInt32(trophy);
        }
        this.writer.writeInt32(data.maidClassOpenFlag.length);
        for (var _g = 0, _h = data.maidClassOpenFlag; _g < _h.length; _g++) {
            var flag = _h[_g];
            this.writer.writeInt32(flag);
        }
        this.writer.writeInt32(data.sexualClassOpenFlag.length);
        for (var _j = 0, _k = data.sexualClassOpenFlag; _j < _k.length; _j++) {
            var flag = _k[_j];
            this.writer.writeInt32(flag);
        }
        if (version >= 117) {
            var keys_13 = this.getKeys(data.rentalMaidBackupDataDict);
            this.writer.writeInt32(keys_13.length);
            for (var _l = 0, keys_11 = keys_13; _l < keys_11.length; _l++) {
                var key = keys_11[_l];
                this.writer.writeString(key);
                var data2 = data.rentalMaidBackupDataDict[key];
                this.writer.writeString(data2.name);
                this.writer.writeInt32(data2.experience);
                var flagKeys = this.getKeys(data2.genericFlag);
                this.writer.writeInt32(flagKeys.length);
                for (var _m = 0, flagKeys_1 = flagKeys; _m < flagKeys_1.length; _m++) {
                    var key_1 = flagKeys_1[_m];
                    this.writer.writeString(key_1);
                    this.writer.writeInt32(data2.genericFlag[key_1]);
                }
            }
        }
        this.writer.writeInt32(348195810);
    };
    return CM3D2Writer;
}());
exports.CM3D2Writer = CM3D2Writer;
//# sourceMappingURL=writer.js.map