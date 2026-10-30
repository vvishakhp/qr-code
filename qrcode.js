/**
 * @fileoverview
 * - Using the 'QRCode for Javascript library'
 * - Fixed dataset of 'QRCode for Javascript library' for support full-spec.
 * - this library has no dependencies.
 * 
 * @author davidshimjs
 * @see <a href="http://www.d-project.com/" target="_blank">http://www.d-project.com/</a>
 * @see <a href="http://jeromeetienne.github.com/jquery-qrcode/" target="_blank">http://jeromeetienne.github.com/jquery-qrcode/</a>
 */
var QRCode;

(function () {
	//---------------------------------------------------------------------
	// QRCode for JavaScript
	//
	// Copyright (c) 2009 Kazuhiko Arase
	//
	// URL: http://www.d-project.com/
	//
	// Licensed under the MIT license:
	//   http://www.opensource.org/licenses/mit-license.php
	//
	// The word "QR Code" is registered trademark of 
	// DENSO WAVE INCORPORATED
	//   http://www.denso-wave.com/qrcode/faqpatent-e.html
	//
	//---------------------------------------------------------------------
	function QR8bitByte(data) {
		this.mode = QRMode.MODE_8BIT_BYTE;
		this.data = data;
		this.parsedData = [];

		// Added to support UTF-8 Characters
		for (var i = 0, l = this.data.length; i < l; i++) {
			var byteArray = [];
			var code = this.data.charCodeAt(i);

			if (code > 0x10000) {
				byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
				byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
				byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
				byteArray[3] = 0x80 | (code & 0x3F);
			} else if (code > 0x800) {
				byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
				byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
				byteArray[2] = 0x80 | (code & 0x3F);
			} else if (code > 0x80) {
				byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
				byteArray[1] = 0x80 | (code & 0x3F);
			} else {
				byteArray[0] = code;
			}

			this.parsedData.push(byteArray);
		}

		this.parsedData = Array.prototype.concat.apply([], this.parsedData);

		if (this.parsedData.length != this.data.length) {
			this.parsedData.unshift(191);
			this.parsedData.unshift(187);
			this.parsedData.unshift(239);
		}
	}

	QR8bitByte.prototype = {
		getLength: function (buffer) {
			return this.parsedData.length;
		},
		write: function (buffer) {
			for (var i = 0, l = this.parsedData.length; i < l; i++) {
				buffer.put(this.parsedData[i], 8);
			}
		}
	};

	function QRCodeModel(typeNumber, errorCorrectLevel) {
		this.typeNumber = typeNumber;
		this.errorCorrectLevel = errorCorrectLevel;
		this.modules = null;
		this.moduleCount = 0;
		this.dataCache = null;
		this.dataList = [];
	}

	QRCodeModel.prototype={addData:function(data){var newData=new QR8bitByte(data);this.dataList.push(newData);this.dataCache=null;},isDark:function(row,col){if(row<0||this.moduleCount<=row||col<0||this.moduleCount<=col){throw new Error(row+","+col);}
	return this.modules[row][col];},getModuleCount:function(){return this.moduleCount;},make:function(){this.makeImpl(false,this.getBestMaskPattern());},makeImpl:function(test,maskPattern){this.moduleCount=this.typeNumber*4+17;this.modules=new Array(this.moduleCount);for(var row=0;row<this.moduleCount;row++){this.modules[row]=new Array(this.moduleCount);for(var col=0;col<this.moduleCount;col++){this.modules[row][col]=null;}}
	this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(test,maskPattern);if(this.typeNumber>=7){this.setupTypeNumber(test);}
	if(this.dataCache==null){this.dataCache=QRCodeModel.createData(this.typeNumber,this.errorCorrectLevel,this.dataList);}
	this.mapData(this.dataCache,maskPattern);},setupPositionProbePattern:function(row,col){for(var r=-1;r<=7;r++){if(row+r<=-1||this.moduleCount<=row+r)continue;for(var c=-1;c<=7;c++){if(col+c<=-1||this.moduleCount<=col+c)continue;if((0<=r&&r<=6&&(c==0||c==6))||(0<=c&&c<=6&&(r==0||r==6))||(2<=r&&r<=4&&2<=c&&c<=4)){this.modules[row+r][col+c]=true;}else{this.modules[row+r][col+c]=false;}}}},getBestMaskPattern:function(){var minLostPoint=0;var pattern=0;for(var i=0;i<8;i++){this.makeImpl(true,i);var lostPoint=QRUtil.getLostPoint(this);if(i==0||minLostPoint>lostPoint){minLostPoint=lostPoint;pattern=i;}}
	return pattern;},createMovieClip:function(target_mc,instance_name,depth){var qr_mc=target_mc.createEmptyMovieClip(instance_name,depth);var cs=1;this.make();for(var row=0;row<this.modules.length;row++){var y=row*cs;for(var col=0;col<this.modules[row].length;col++){var x=col*cs;var dark=this.modules[row][col];if(dark){qr_mc.beginFill(0,100);qr_mc.moveTo(x,y);qr_mc.lineTo(x+cs,y);qr_mc.lineTo(x+cs,y+cs);qr_mc.lineTo(x,y+cs);qr_mc.endFill();}}}
	return qr_mc;},setupTimingPattern:function(){for(var r=8;r<this.moduleCount-8;r++){if(this.modules[r][6]!=null){continue;}
	this.modules[r][6]=(r%2==0);}
	for(var c=8;c<this.moduleCount-8;c++){if(this.modules[6][c]!=null){continue;}
	this.modules[6][c]=(c%2==0);}},setupPositionAdjustPattern:function(){var pos=QRUtil.getPatternPosition(this.typeNumber);for(var i=0;i<pos.length;i++){for(var j=0;j<pos.length;j++){var row=pos[i];var col=pos[j];if(this.modules[row][col]!=null){continue;}
	for(var r=-2;r<=2;r++){for(var c=-2;c<=2;c++){if(r==-2||r==2||c==-2||c==2||(r==0&&c==0)){this.modules[row+r][col+c]=true;}else{this.modules[row+r][col+c]=false;}}}}}},setupTypeNumber:function(test){var bits=QRUtil.getBCHTypeNumber(this.typeNumber);for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=mod;}
	for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[i%3+this.moduleCount-8-3][Math.floor(i/3)]=mod;}},setupTypeInfo:function(test,maskPattern){var data=(this.errorCorrectLevel<<3)|maskPattern;var bits=QRUtil.getBCHTypeInfo(data);for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<6){this.modules[i][8]=mod;}else if(i<8){this.modules[i+1][8]=mod;}else{this.modules[this.moduleCount-15+i][8]=mod;}}
	for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<8){this.modules[8][this.moduleCount-i-1]=mod;}else if(i<9){this.modules[8][15-i-1+1]=mod;}else{this.modules[8][15-i-1]=mod;}}
	this.modules[this.moduleCount-8][8]=(!test);},mapData:function(data,maskPattern){var inc=-1;var row=this.moduleCount-1;var bitIndex=7;var byteIndex=0;for(var col=this.moduleCount-1;col>0;col-=2){if(col==6)col--;while(true){for(var c=0;c<2;c++){if(this.modules[row][col-c]==null){var dark=false;if(byteIndex<data.length){dark=(((data[byteIndex]>>>bitIndex)&1)==1);}
	var mask=QRUtil.getMask(maskPattern,row,col-c);if(mask){dark=!dark;}
	this.modules[row][col-c]=dark;bitIndex--;if(bitIndex==-1){byteIndex++;bitIndex=7;}}}
	row+=inc;if(row<0||this.moduleCount<=row){row-=inc;inc=-inc;break;}}}}};QRCodeModel.PAD0=0xEC;QRCodeModel.PAD1=0x11;QRCodeModel.createData=function(typeNumber,errorCorrectLevel,dataList){var rsBlocks=QRRSBlock.getRSBlocks(typeNumber,errorCorrectLevel);var buffer=new QRBitBuffer();for(var i=0;i<dataList.length;i++){var data=dataList[i];buffer.put(data.mode,4);buffer.put(data.getLength(),QRUtil.getLengthInBits(data.mode,typeNumber));data.write(buffer);}
	var totalDataCount=0;for(var i=0;i<rsBlocks.length;i++){totalDataCount+=rsBlocks[i].dataCount;}
	if(buffer.getLengthInBits()>totalDataCount*8){throw new Error("code length overflow. ("
	+buffer.getLengthInBits()
	+">"
	+totalDataCount*8
	+")");}
	if(buffer.getLengthInBits()+4<=totalDataCount*8){buffer.put(0,4);}
	while(buffer.getLengthInBits()%8!=0){buffer.putBit(false);}
	while(true){if(buffer.getLengthInBits()>=totalDataCount*8){break;}
	buffer.put(QRCodeModel.PAD0,8);if(buffer.getLengthInBits()>=totalDataCount*8){break;}
	buffer.put(QRCodeModel.PAD1,8);}
	return QRCodeModel.createBytes(buffer,rsBlocks);};QRCodeModel.createBytes=function(buffer,rsBlocks){var offset=0;var maxDcCount=0;var maxEcCount=0;var dcdata=new Array(rsBlocks.length);var ecdata=new Array(rsBlocks.length);for(var r=0;r<rsBlocks.length;r++){var dcCount=rsBlocks[r].dataCount;var ecCount=rsBlocks[r].totalCount-dcCount;maxDcCount=Math.max(maxDcCount,dcCount);maxEcCount=Math.max(maxEcCount,ecCount);dcdata[r]=new Array(dcCount);for(var i=0;i<dcdata[r].length;i++){dcdata[r][i]=0xff&buffer.buffer[i+offset];}
	offset+=dcCount;var rsPoly=QRUtil.getErrorCorrectPolynomial(ecCount);var rawPoly=new QRPolynomial(dcdata[r],rsPoly.getLength()-1);var modPoly=rawPoly.mod(rsPoly);ecdata[r]=new Array(rsPoly.getLength()-1);for(var i=0;i<ecdata[r].length;i++){var modIndex=i+modPoly.getLength()-ecdata[r].length;ecdata[r][i]=(modIndex>=0)?modPoly.get(modIndex):0;}}
	var totalCodeCount=0;for(var i=0;i<rsBlocks.length;i++){totalCodeCount+=rsBlocks[i].totalCount;}
	var data=new Array(totalCodeCount);var index=0;for(var i=0;i<maxDcCount;i++){for(var r=0;r<rsBlocks.length;r++){if(i<dcdata[r].length){data[index++]=dcdata[r][i];}}}
	for(var i=0;i<maxEcCount;i++){for(var r=0;r<rsBlocks.length;r++){if(i<ecdata[r].length){data[index++]=ecdata[r][i];}}}
	return data;};var QRMode={MODE_NUMBER:1<<0,MODE_ALPHA_NUM:1<<1,MODE_8BIT_BYTE:1<<2,MODE_KANJI:1<<3};var QRErrorCorrectLevel={L:1,M:0,Q:3,H:2};var QRMaskPattern={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var QRUtil={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:(1<<10)|(1<<8)|(1<<5)|(1<<4)|(1<<2)|(1<<1)|(1<<0),G18:(1<<12)|(1<<11)|(1<<10)|(1<<9)|(1<<8)|(1<<5)|(1<<2)|(1<<0),G15_MASK:(1<<14)|(1<<12)|(1<<10)|(1<<4)|(1<<1),getBCHTypeInfo:function(data){var d=data<<10;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)>=0){d^=(QRUtil.G15<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)));}
	return((data<<10)|d)^QRUtil.G15_MASK;},getBCHTypeNumber:function(data){var d=data<<12;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)>=0){d^=(QRUtil.G18<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)));}
	return(data<<12)|d;},getBCHDigit:function(data){var digit=0;while(data!=0){digit++;data>>>=1;}
	return digit;},getPatternPosition:function(typeNumber){return QRUtil.PATTERN_POSITION_TABLE[typeNumber-1];},getMask:function(maskPattern,i,j){switch(maskPattern){case QRMaskPattern.PATTERN000:return(i+j)%2==0;case QRMaskPattern.PATTERN001:return i%2==0;case QRMaskPattern.PATTERN010:return j%3==0;case QRMaskPattern.PATTERN011:return(i+j)%3==0;case QRMaskPattern.PATTERN100:return(Math.floor(i/2)+Math.floor(j/3))%2==0;case QRMaskPattern.PATTERN101:return(i*j)%2+(i*j)%3==0;case QRMaskPattern.PATTERN110:return((i*j)%2+(i*j)%3)%2==0;case QRMaskPattern.PATTERN111:return((i*j)%3+(i+j)%2)%2==0;default:throw new Error("bad maskPattern:"+maskPattern);}},getErrorCorrectPolynomial:function(errorCorrectLength){var a=new QRPolynomial([1],0);for(var i=0;i<errorCorrectLength;i++){a=a.multiply(new QRPolynomial([1,QRMath.gexp(i)],0));}
	return a;},getLengthInBits:function(mode,type){if(1<=type&&type<10){switch(mode){case QRMode.MODE_NUMBER:return 10;case QRMode.MODE_ALPHA_NUM:return 9;case QRMode.MODE_8BIT_BYTE:return 8;case QRMode.MODE_KANJI:return 8;default:throw new Error("mode:"+mode);}}else if(type<27){switch(mode){case QRMode.MODE_NUMBER:return 12;case QRMode.MODE_ALPHA_NUM:return 11;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 10;default:throw new Error("mode:"+mode);}}else if(type<41){switch(mode){case QRMode.MODE_NUMBER:return 14;case QRMode.MODE_ALPHA_NUM:return 13;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 12;default:throw new Error("mode:"+mode);}}else{throw new Error("type:"+type);}},getLostPoint:function(qrCode){var moduleCount=qrCode.getModuleCount();var lostPoint=0;for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount;col++){var sameCount=0;var dark=qrCode.isDark(row,col);for(var r=-1;r<=1;r++){if(row+r<0||moduleCount<=row+r){continue;}
	for(var c=-1;c<=1;c++){if(col+c<0||moduleCount<=col+c){continue;}
	if(r==0&&c==0){continue;}
	if(dark==qrCode.isDark(row+r,col+c)){sameCount++;}}}
	if(sameCount>5){lostPoint+=(3+sameCount-5);}}}
	for(var row=0;row<moduleCount-1;row++){for(var col=0;col<moduleCount-1;col++){var count=0;if(qrCode.isDark(row,col))count++;if(qrCode.isDark(row+1,col))count++;if(qrCode.isDark(row,col+1))count++;if(qrCode.isDark(row+1,col+1))count++;if(count==0||count==4){lostPoint+=3;}}}
	for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount-6;col++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row,col+1)&&qrCode.isDark(row,col+2)&&qrCode.isDark(row,col+3)&&qrCode.isDark(row,col+4)&&!qrCode.isDark(row,col+5)&&qrCode.isDark(row,col+6)){lostPoint+=40;}}}
	for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount-6;row++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row+1,col)&&qrCode.isDark(row+2,col)&&qrCode.isDark(row+3,col)&&qrCode.isDark(row+4,col)&&!qrCode.isDark(row+5,col)&&qrCode.isDark(row+6,col)){lostPoint+=40;}}}
	var darkCount=0;for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount;row++){if(qrCode.isDark(row,col)){darkCount++;}}}
	var ratio=Math.abs(100*darkCount/moduleCount/moduleCount-50)/5;lostPoint+=ratio*10;return lostPoint;}};var QRMath={glog:function(n){if(n<1){throw new Error("glog("+n+")");}
	return QRMath.LOG_TABLE[n];},gexp:function(n){while(n<0){n+=255;}
	while(n>=256){n-=255;}
	return QRMath.EXP_TABLE[n];},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)};for(var i=0;i<8;i++){QRMath.EXP_TABLE[i]=1<<i;}
	for(var i=8;i<256;i++){QRMath.EXP_TABLE[i]=QRMath.EXP_TABLE[i-4]^QRMath.EXP_TABLE[i-5]^QRMath.EXP_TABLE[i-6]^QRMath.EXP_TABLE[i-8];}
	for(var i=0;i<255;i++){QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]]=i;}
	function QRPolynomial(num,shift){if(num.length==undefined){throw new Error(num.length+"/"+shift);}
	var offset=0;while(offset<num.length&&num[offset]==0){offset++;}
	this.num=new Array(num.length-offset+shift);for(var i=0;i<num.length-offset;i++){this.num[i]=num[i+offset];}}
	QRPolynomial.prototype={get:function(index){return this.num[index];},getLength:function(){return this.num.length;},multiply:function(e){var num=new Array(this.getLength()+e.getLength()-1);for(var i=0;i<this.getLength();i++){for(var j=0;j<e.getLength();j++){num[i+j]^=QRMath.gexp(QRMath.glog(this.get(i))+QRMath.glog(e.get(j)));}}
	return new QRPolynomial(num,0);},mod:function(e){if(this.getLength()-e.getLength()<0){return this;}
	var ratio=QRMath.glog(this.get(0))-QRMath.glog(e.get(0));var num=new Array(this.getLength());for(var i=0;i<this.getLength();i++){num[i]=this.get(i);}
	for(var i=0;i<e.getLength();i++){num[i]^=QRMath.gexp(QRMath.glog(e.get(i))+ratio);}
	return new QRPolynomial(num,0).mod(e);}};function QRRSBlock(totalCount,dataCount){this.totalCount=totalCount;this.dataCount=dataCount;}
	QRRSBlock.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];QRRSBlock.getRSBlocks=function(typeNumber,errorCorrectLevel){var rsBlock=QRRSBlock.getRsBlockTable(typeNumber,errorCorrectLevel);if(rsBlock==undefined){throw new Error("bad rs block @ typeNumber:"+typeNumber+"/errorCorrectLevel:"+errorCorrectLevel);}
	var length=rsBlock.length/3;var list=[];for(var i=0;i<length;i++){var count=rsBlock[i*3+0];var totalCount=rsBlock[i*3+1];var dataCount=rsBlock[i*3+2];for(var j=0;j<count;j++){list.push(new QRRSBlock(totalCount,dataCount));}}
	return list;};QRRSBlock.getRsBlockTable=function(typeNumber,errorCorrectLevel){switch(errorCorrectLevel){case QRErrorCorrectLevel.L:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+0];case QRErrorCorrectLevel.M:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+1];case QRErrorCorrectLevel.Q:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+2];case QRErrorCorrectLevel.H:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+3];default:return undefined;}};function QRBitBuffer(){this.buffer=[];this.length=0;}
	QRBitBuffer.prototype={get:function(index){var bufIndex=Math.floor(index/8);return((this.buffer[bufIndex]>>>(7-index%8))&1)==1;},put:function(num,length){for(var i=0;i<length;i++){this.putBit(((num>>>(length-i-1))&1)==1);}},getLengthInBits:function(){return this.length;},putBit:function(bit){var bufIndex=Math.floor(this.length/8);if(this.buffer.length<=bufIndex){this.buffer.push(0);}
	if(bit){this.buffer[bufIndex]|=(0x80>>>(this.length%8));}
	this.length++;}};var QRCodeLimitLength=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]];
	
	function _isSupportCanvas() {
		return typeof CanvasRenderingContext2D != "undefined";
	}
	
	// android 2.x doesn't support Data-URI spec
	function _getAndroid() {
		var android = false;
		var sAgent = navigator.userAgent;
		
		if (/android/i.test(sAgent)) { // android
			android = true;
			var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);
			
			if (aMat && aMat[1]) {
				android = parseFloat(aMat[1]);
			}
		}
		
		return android;
	}

	//---------------------------------------------------------------------
	// QR module / marker shape helpers
	//---------------------------------------------------------------------

	function _normalizeShape(shape, fallback) {
		if (!shape || typeof shape !== "string") {
			return fallback || "square";
		}

		shape = shape.toLowerCase();

		if (shape === "dot") {
			shape = "dots";
		} else if (shape === "round") {
			shape = "rounded";
		} else if (shape === "extra-round" || shape === "extrarounded") {
			shape = "extra-rounded";
		} else if (shape === "classy") {
			shape = "leaf";
		}

		return shape;
	}

	function _isTransparentBackground(option) {
		var light;

		if (option && option.transparent === true) {
			return true;
		}

		light = option && option.colorLight != null ? String(option.colorLight).toLowerCase() : "";
		return light === "transparent" || light === "rgba(0,0,0,0)";
	}

	function _resolveShapes(option) {
		var moduleShape = _normalizeShape(option.moduleShape, "square");
		var markerShape = _normalizeShape(option.markerShape, "square");
		var markerInnerShape = _normalizeShape(option.markerInnerShape, markerShape === "leaf" ? "square" : markerShape);
		var alignmentShape = _normalizeShape(option.alignmentShape, markerShape);

		if (moduleShape === "circle") {
			moduleShape = "dots";
		}
		if (markerShape === "dots") {
			markerShape = "circle";
		}
		if (markerInnerShape === "dots") {
			markerInnerShape = "circle";
		}
		if (alignmentShape === "dots") {
			alignmentShape = "circle";
		}

		return {
			module: moduleShape,
			marker: markerShape,
			markerInner: markerInnerShape,
			alignment: alignmentShape
		};
	}

	function _isFinderModule(row, col, nCount) {
		if (row < 7 && col < 7) {
			return true;
		}
		if (row < 7 && col >= nCount - 7) {
			return true;
		}
		if (row >= nCount - 7 && col < 7) {
			return true;
		}
		return false;
	}

	function _alignmentCenters(typeNumber, nCount) {
		var pos = QRUtil.getPatternPosition(typeNumber);
		var centers = [];
		var i, j, row, col;

		if (!pos || !pos.length) {
			return centers;
		}

		for (i = 0; i < pos.length; i++) {
			for (j = 0; j < pos.length; j++) {
				row = pos[i];
				col = pos[j];
				if (_isFinderModule(row, col, nCount)) {
					continue;
				}
				centers.push({ row: row, col: col });
			}
		}

		return centers;
	}

	function _isAlignmentModule(row, col, centers) {
		var i;
		for (i = 0; i < centers.length; i++) {
			if (Math.abs(row - centers[i].row) <= 2 && Math.abs(col - centers[i].col) <= 2) {
				return true;
			}
		}
		return false;
	}

	function _moduleNeighbors(oQRCode, row, col) {
		var nCount = oQRCode.getModuleCount();
		return {
			t: row > 0 && oQRCode.isDark(row - 1, col),
			r: col < nCount - 1 && oQRCode.isDark(row, col + 1),
			b: row < nCount - 1 && oQRCode.isDark(row + 1, col),
			l: col > 0 && oQRCode.isDark(row, col - 1)
		};
	}

	function _clampRadius(r, w, h) {
		return Math.max(0, Math.min(r || 0, w / 2, h / 2));
	}

	function _shapeCornerRadii(shape, size) {
		var r;
		switch (shape) {
			case "rounded":
				r = size * 0.2;
				return { tl: r, tr: r, br: r, bl: r };
			case "extra-rounded":
				r = size * 0.35;
				return { tl: r, tr: r, br: r, bl: r };
			case "leaf":
				r = size * 0.45;
				return { tl: r, tr: 0, br: r, bl: 0 };
			default:
				return { tl: 0, tr: 0, br: 0, bl: 0 };
		}
	}

	function _canvasRoundRect(ctx, x, y, w, h, rtl, rtr, rbr, rbl) {
		rtl = _clampRadius(rtl, w, h);
		rtr = _clampRadius(rtr, w, h);
		rbr = _clampRadius(rbr, w, h);
		rbl = _clampRadius(rbl, w, h);

		ctx.moveTo(x + rtl, y);
		ctx.lineTo(x + w - rtr, y);
		ctx.arcTo(x + w, y, x + w, y + h, rtr);
		ctx.lineTo(x + w, y + h - rbr);
		ctx.arcTo(x + w, y + h, x, y + h, rbr);
		ctx.lineTo(x + rbl, y + h);
		ctx.arcTo(x, y + h, x, y, rbl);
		ctx.lineTo(x, y + rtl);
		ctx.arcTo(x, y, x + w, y, rtl);
		ctx.closePath();
	}

	function _canvasAddShapePath(ctx, x, y, w, h, shape) {
		var radii;

		if (shape === "circle") {
			ctx.moveTo(x + w, y + h / 2);
			if (typeof ctx.ellipse === "function") {
				ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
			} else {
				ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
			}
			ctx.closePath();
			return;
		}

		if (shape === "diamond") {
			ctx.moveTo(x + w / 2, y);
			ctx.lineTo(x + w, y + h / 2);
			ctx.lineTo(x + w / 2, y + h);
			ctx.lineTo(x, y + h / 2);
			ctx.closePath();
			return;
		}

		radii = _shapeCornerRadii(shape, Math.min(w, h));
		_canvasRoundRect(ctx, x, y, w, h, radii.tl, radii.tr, radii.br, radii.bl);
	}

	function _canvasFillShape(ctx, x, y, w, h, shape, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		_canvasAddShapePath(ctx, x, y, w, h, shape);
		ctx.fill();
	}

	function _canvasFillRing(ctx, x, y, outerW, outerH, insetX, insetY, innerW, innerH, shape, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		_canvasAddShapePath(ctx, x, y, outerW, outerH, shape);
		_canvasAddShapePath(ctx, x + insetX, y + insetY, innerW, innerH, shape);
		ctx.fill("evenodd");
	}

	function _canvasFillModule(ctx, x, y, w, h, shape, neighbors) {
		var radiusRatio;

		if (shape === "dots") {
			ctx.beginPath();
			ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) * 0.4, 0, Math.PI * 2);
			ctx.fill();
			return;
		}

		if (shape === "diamond") {
			ctx.beginPath();
			ctx.moveTo(x + w / 2, y);
			ctx.lineTo(x + w, y + h / 2);
			ctx.lineTo(x + w / 2, y + h);
			ctx.lineTo(x, y + h / 2);
			ctx.closePath();
			ctx.fill();
			return;
		}

		if (shape === "rounded" || shape === "extra-rounded") {
			radiusRatio = shape === "extra-rounded" ? 0.5 : 0.35;
			ctx.beginPath();
			_canvasRoundRect(
				ctx, x, y, w, h,
				(!neighbors.t && !neighbors.l) ? w * radiusRatio : 0,
				(!neighbors.t && !neighbors.r) ? w * radiusRatio : 0,
				(!neighbors.b && !neighbors.r) ? w * radiusRatio : 0,
				(!neighbors.b && !neighbors.l) ? w * radiusRatio : 0
			);
			ctx.fill();
			return;
		}

		ctx.fillRect(x, y, w + 0.5, h + 0.5);
	}

	function _canvasDrawFinder(ctx, x, y, moduleW, moduleH, outerShape, innerShape, colorDark) {
		_canvasFillRing(ctx, x, y, moduleW * 7, moduleH * 7, moduleW, moduleH, moduleW * 5, moduleH * 5, outerShape, colorDark);
		_canvasFillShape(ctx, x + moduleW * 2, y + moduleH * 2, moduleW * 3, moduleH * 3, innerShape, colorDark);
	}

	function _canvasDrawAlignment(ctx, x, y, moduleW, moduleH, shape, colorDark) {
		var eyeShape = shape === "leaf" ? "square" : shape;

		_canvasFillRing(ctx, x, y, moduleW * 5, moduleH * 5, moduleW, moduleH, moduleW * 3, moduleH * 3, shape, colorDark);
		_canvasFillShape(ctx, x + moduleW * 2, y + moduleH * 2, moduleW, moduleH, eyeShape, colorDark);
	}

	function _svgRoundRectPath(x, y, w, h, rtl, rtr, rbr, rbl) {
		rtl = _clampRadius(rtl, w, h);
		rtr = _clampRadius(rtr, w, h);
		rbr = _clampRadius(rbr, w, h);
		rbl = _clampRadius(rbl, w, h);

		return "M" + (x + rtl) + "," + y +
			"H" + (x + w - rtr) +
			(rtr ? ("A" + rtr + "," + rtr + " 0 0 1 " + (x + w) + "," + (y + rtr)) : "") +
			"V" + (y + h - rbr) +
			(rbr ? ("A" + rbr + "," + rbr + " 0 0 1 " + (x + w - rbr) + "," + (y + h)) : "") +
			"H" + (x + rbl) +
			(rbl ? ("A" + rbl + "," + rbl + " 0 0 1 " + x + "," + (y + h - rbl)) : "") +
			"V" + (y + rtl) +
			(rtl ? ("A" + rtl + "," + rtl + " 0 0 1 " + (x + rtl) + "," + y) : "") +
			"Z";
	}

	function _svgShapePath(x, y, size, shape) {
		var radii;
		var r;
		var cx;
		var cy;

		if (shape === "circle") {
			r = size / 2;
			cx = x + r;
			cy = y + r;
			return "M" + (cx - r) + "," + cy +
				"a" + r + "," + r + " 0 1 1 " + size + ",0" +
				"a" + r + "," + r + " 0 1 1 " + (-size) + ",0z";
		}

		if (shape === "diamond") {
			return "M" + (x + size / 2) + "," + y +
				"L" + (x + size) + "," + (y + size / 2) +
				"L" + (x + size / 2) + "," + (y + size) +
				"L" + x + "," + (y + size / 2) + "Z";
		}

		radii = _shapeCornerRadii(shape, size);
		return _svgRoundRectPath(x, y, size, size, radii.tl, radii.tr, radii.br, radii.bl);
	}

	function _svgShapeElement(makeSVG, x, y, size, shape, fill) {
		var radii;

		if (shape === "circle") {
			return makeSVG("circle", {
				cx: x + size / 2,
				cy: y + size / 2,
				r: size / 2,
				fill: fill
			});
		}

		if (shape === "diamond") {
			return makeSVG("polygon", {
				points: (x + size / 2) + "," + y + " " +
					(x + size) + "," + (y + size / 2) + " " +
					(x + size / 2) + "," + (y + size) + " " +
					x + "," + (y + size / 2),
				fill: fill
			});
		}

		radii = _shapeCornerRadii(shape, size);
		if (!radii.tl && !radii.tr && !radii.br && !radii.bl) {
			return makeSVG("rect", { x: x, y: y, width: size, height: size, fill: fill });
		}

		return makeSVG("path", {
			d: _svgShapePath(x, y, size, shape),
			fill: fill
		});
	}

	function _svgRingElement(makeSVG, x, y, outerSize, holeSize, shape, fill) {
		var inset = (outerSize - holeSize) / 2;
		return makeSVG("path", {
			d: _svgShapePath(x, y, outerSize, shape) + _svgShapePath(x + inset, y + inset, holeSize, shape),
			fill: fill,
			"fill-rule": "evenodd"
		});
	}

	function _svgModuleElement(makeSVG, x, y, size, shape, neighbors, fill) {
		var radiusRatio;
		var r;

		if (shape === "dots") {
			return makeSVG("circle", {
				cx: x + size / 2,
				cy: y + size / 2,
				r: size * 0.4,
				fill: fill
			});
		}

		if (shape === "diamond") {
			return makeSVG("polygon", {
				points: (x + size / 2) + "," + y + " " +
					(x + size) + "," + (y + size / 2) + " " +
					(x + size / 2) + "," + (y + size) + " " +
					x + "," + (y + size / 2),
				fill: fill
			});
		}

		if (shape === "rounded" || shape === "extra-rounded") {
			radiusRatio = shape === "extra-rounded" ? 0.5 : 0.35;
			r = size * radiusRatio;
			return makeSVG("path", {
				d: _svgRoundRectPath(
					x, y, size, size,
					(!neighbors.t && !neighbors.l) ? r : 0,
					(!neighbors.t && !neighbors.r) ? r : 0,
					(!neighbors.b && !neighbors.r) ? r : 0,
					(!neighbors.b && !neighbors.l) ? r : 0
				),
				fill: fill
			});
		}

		return makeSVG("rect", { x: x, y: y, width: size, height: size, fill: fill });
	}

	function _svgAppendFinder(svg, makeSVG, x, y, outerShape, innerShape, colorDark) {
		svg.appendChild(_svgRingElement(makeSVG, x, y, 7, 5, outerShape, colorDark));
		svg.appendChild(_svgShapeElement(makeSVG, x + 2, y + 2, 3, innerShape, colorDark));
	}

	function _svgAppendAlignment(svg, makeSVG, x, y, shape, colorDark) {
		svg.appendChild(_svgRingElement(makeSVG, x, y, 5, 3, shape, colorDark));
		svg.appendChild(_svgShapeElement(makeSVG, x + 2, y + 2, 1, shape === "leaf" ? "square" : shape, colorDark));
	}

	function _makeSVGNode(tag, attrs) {
		var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
		var k;
		for (k in attrs) {
			if (attrs.hasOwnProperty(k) && attrs[k] != null) {
				el.setAttribute(k, attrs[k]);
			}
		}
		return el;
	}

	function _createSVGElement(oQRCode, option, forExport) {
		var nCount = oQRCode.getModuleCount();
		var transparent = _isTransparentBackground(option);
		var svg = _makeSVGNode("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 " + nCount + " " + nCount,
			width: forExport ? String(option.width || nCount) : "100%",
			height: forExport ? String(option.height || nCount) : "100%",
			fill: transparent ? "none" : option.colorLight
		});

		_drawStyledQRCode(oQRCode, option, {
			drawBackground: function () {
				if (transparent) {
					return;
				}
				svg.appendChild(_makeSVGNode("rect", {
					fill: option.colorLight,
					width: "100%",
					height: "100%"
				}));
			},
			drawModule: function (col, row, shape, neighbors) {
				svg.appendChild(_svgModuleElement(_makeSVGNode, col, row, 1, shape, neighbors, option.colorDark));
			},
			drawFinder: function (col, row, outerShape, innerShape) {
				_svgAppendFinder(svg, _makeSVGNode, col, row, outerShape, innerShape, option.colorDark);
			},
			drawAlignment: function (col, row, shape) {
				_svgAppendAlignment(svg, _makeSVGNode, col, row, shape, option.colorDark);
			}
		});

		return svg;
	}

	function _createSVGString(oQRCode, option) {
		return new XMLSerializer().serializeToString(_createSVGElement(oQRCode, option, true));
	}

	function _paintOnCanvas(ctx, oQRCode, option, width, height) {
		var nCount = oQRCode.getModuleCount();
		var nWidth = width / nCount;
		var nHeight = height / nCount;

		ctx.clearRect(0, 0, width, height);

		_drawStyledQRCode(oQRCode, option, {
			drawBackground: function () {
				if (_isTransparentBackground(option)) {
					return;
				}
				ctx.fillStyle = option.colorLight;
				ctx.fillRect(0, 0, width, height);
			},
			drawModule: function (col, row, shape, neighbors) {
				ctx.fillStyle = option.colorDark;
				_canvasFillModule(ctx, col * nWidth, row * nHeight, nWidth, nHeight, shape, neighbors);
			},
			drawFinder: function (col, row, outerShape, innerShape) {
				_canvasDrawFinder(ctx, col * nWidth, row * nHeight, nWidth, nHeight, outerShape, innerShape, option.colorDark);
			},
			drawAlignment: function (col, row, shape) {
				_canvasDrawAlignment(ctx, col * nWidth, row * nHeight, nWidth, nHeight, shape, option.colorDark);
			}
		});
	}

	function _renderExportCanvas(oQRCode, option, size) {
		var canvas = document.createElement("canvas");
		var width = size || option.width || 256;
		var height = size || option.height || width;

		canvas.width = width;
		canvas.height = height;
		_paintOnCanvas(canvas.getContext("2d"), oQRCode, option, width, height);
		return canvas;
	}

	function _triggerDownload(filename, data, mime) {
		var url;
		var revoke = false;
		var link = document.createElement("a");

		if (typeof Blob !== "undefined" && data instanceof Blob) {
			url = URL.createObjectURL(data);
			revoke = true;
		} else if (typeof data === "string" && data.indexOf("data:") === 0) {
			url = data;
		} else {
			url = URL.createObjectURL(new Blob([data], { type: mime || "application/octet-stream" }));
			revoke = true;
		}

		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		if (revoke) {
			setTimeout(function () {
				URL.revokeObjectURL(url);
			}, 1000);
		}
	}

	function _drawStyledQRCode(oQRCode, option, helpers) {
		var nCount = oQRCode.getModuleCount();
		var shapes = _resolveShapes(option);
		var centers = _alignmentCenters(oQRCode.typeNumber, nCount);
		var row, col, i;

		helpers.drawBackground();

		for (row = 0; row < nCount; row++) {
			for (col = 0; col < nCount; col++) {
				if (!oQRCode.isDark(row, col)) {
					continue;
				}
				if (_isFinderModule(row, col, nCount) || _isAlignmentModule(row, col, centers)) {
					continue;
				}
				helpers.drawModule(col, row, shapes.module, _moduleNeighbors(oQRCode, row, col));
			}
		}

		helpers.drawFinder(0, 0, shapes.marker, shapes.markerInner);
		helpers.drawFinder(nCount - 7, 0, shapes.marker, shapes.markerInner);
		helpers.drawFinder(0, nCount - 7, shapes.marker, shapes.markerInner);

		for (i = 0; i < centers.length; i++) {
			helpers.drawAlignment(centers[i].col - 2, centers[i].row - 2, shapes.alignment);
		}
	}
	
	var svgDrawer = (function() {

		var Drawing = function (el, htOption) {
			this._el = el;
			this._htOption = htOption;
		};

		Drawing.prototype.draw = function (oQRCode) {
			this.clear();
			this._el.appendChild(_createSVGElement(oQRCode, this._htOption, false));
		};
		Drawing.prototype.clear = function () {
			while (this._el.hasChildNodes())
				this._el.removeChild(this._el.lastChild);
		};
		return Drawing;
	})();

	var useSVG = document.documentElement.tagName.toLowerCase() === "svg";

	// Drawing in DOM by using Table tag
	var Drawing = useSVG ? svgDrawer : !_isSupportCanvas() ? (function () {
		var Drawing = function (el, htOption) {
			this._el = el;
			this._htOption = htOption;
		};
			
		/**
		 * Draw the QRCode
		 * 
		 * @param {QRCode} oQRCode
		 */
		Drawing.prototype.draw = function (oQRCode) {
            var _htOption = this._htOption;
            var _el = this._el;
			var nCount = oQRCode.getModuleCount();
			var nWidth = Math.floor(_htOption.width / nCount);
			var nHeight = Math.floor(_htOption.height / nCount);
			var shapes = _resolveShapes(_htOption);
			var aHTML = ['<table style="border:0;border-collapse:collapse;">'];
			var moduleRadius = "0";
			var moduleClip = "";

			if (shapes.module === "dots") {
				moduleRadius = "50%";
			} else if (shapes.module === "rounded") {
				moduleRadius = "35%";
			} else if (shapes.module === "extra-rounded") {
				moduleRadius = "50%";
			} else if (shapes.module === "diamond") {
				moduleClip = "clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);";
			}
			
			for (var row = 0; row < nCount; row++) {
				aHTML.push('<tr>');
				
				for (var col = 0; col < nCount; col++) {
					aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? _htOption.colorDark : (_isTransparentBackground(_htOption) ? "transparent" : _htOption.colorLight)) + ';border-radius:' + (oQRCode.isDark(row, col) ? moduleRadius : "0") + ';' + (oQRCode.isDark(row, col) ? moduleClip : "") + '"></td>');
				}
				
				aHTML.push('</tr>');
			}
			
			aHTML.push('</table>');
			_el.innerHTML = aHTML.join('');
			
			// Fix the margin values as real size.
			var elTable = _el.childNodes[0];
			var nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2;
			var nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;
			
			if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
				elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";	
			}
		};
		
		/**
		 * Clear the QRCode
		 */
		Drawing.prototype.clear = function () {
			this._el.innerHTML = '';
		};
		
		return Drawing;
	})() : (function () { // Drawing in Canvas
		function _onMakeImage() {
			this._elImage.src = this._elCanvas.toDataURL("image/png");
			this._elImage.style.display = "block";
			this._elCanvas.style.display = "none";			
		}
		
		// Android 2.1 bug workaround
		// http://code.google.com/p/android/issues/detail?id=5141
		if (this._android && this._android <= 2.1) {
	    	var factor = 1 / window.devicePixelRatio;
	        var drawImage = CanvasRenderingContext2D.prototype.drawImage; 
	    	CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
	    		if (("nodeName" in image) && /img/i.test(image.nodeName)) {
		        	for (var i = arguments.length - 1; i >= 1; i--) {
		            	arguments[i] = arguments[i] * factor;
		        	}
	    		} else if (typeof dw == "undefined") {
	    			arguments[1] *= factor;
	    			arguments[2] *= factor;
	    			arguments[3] *= factor;
	    			arguments[4] *= factor;
	    		}
	    		
	        	drawImage.apply(this, arguments); 
	    	};
		}
		
		/**
		 * Check whether the user's browser supports Data URI or not
		 * 
		 * @private
		 * @param {Function} fSuccess Occurs if it supports Data URI
		 * @param {Function} fFail Occurs if it doesn't support Data URI
		 */
		function _safeSetDataURI(fSuccess, fFail) {
            var self = this;
            self._fFail = fFail;
            self._fSuccess = fSuccess;

            // Check it just once
            if (self._bSupportDataURI === null) {
                var el = document.createElement("img");
                var fOnError = function() {
                    self._bSupportDataURI = false;

                    if (self._fFail) {
                        self._fFail.call(self);
                    }
                };
                var fOnSuccess = function() {
                    self._bSupportDataURI = true;

                    if (self._fSuccess) {
                        self._fSuccess.call(self);
                    }
                };

                el.onabort = fOnError;
                el.onerror = fOnError;
                el.onload = fOnSuccess;
                el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
                return;
            } else if (self._bSupportDataURI === true && self._fSuccess) {
                self._fSuccess.call(self);
            } else if (self._bSupportDataURI === false && self._fFail) {
                self._fFail.call(self);
            }
		};
		
		/**
		 * Drawing QRCode by using canvas
		 * 
		 * @constructor
		 * @param {HTMLElement} el
		 * @param {Object} htOption QRCode Options 
		 */
		var Drawing = function (el, htOption) {
    		this._bIsPainted = false;
    		this._android = _getAndroid();
		
			this._htOption = htOption;
			this._elCanvas = document.createElement("canvas");
			this._elCanvas.width = htOption.width;
			this._elCanvas.height = htOption.height;
			el.appendChild(this._elCanvas);
			this._el = el;
			this._oContext = this._elCanvas.getContext("2d");
			this._bIsPainted = false;
			this._elImage = document.createElement("img");
			this._elImage.alt = "Scan me!";
			this._elImage.style.display = "none";
			this._el.appendChild(this._elImage);
			this._bSupportDataURI = null;
		};
			
		/**
		 * Draw the QRCode
		 * 
		 * @param {QRCode} oQRCode 
		 */
		Drawing.prototype.draw = function (oQRCode) {
            var _elImage = this._elImage;
            var _htOption = this._htOption;

			_elImage.style.display = "none";
			this.clear();
			_paintOnCanvas(this._oContext, oQRCode, _htOption, _htOption.width, _htOption.height);
			this._bIsPainted = true;
		};
			
		/**
		 * Make the image from Canvas if the browser supports Data URI.
		 */
		Drawing.prototype.makeImage = function () {
			if (this._bIsPainted) {
				_safeSetDataURI.call(this, _onMakeImage);
			}
		};
			
		/**
		 * Return whether the QRCode is painted or not
		 * 
		 * @return {Boolean}
		 */
		Drawing.prototype.isPainted = function () {
			return this._bIsPainted;
		};
		
		/**
		 * Clear the QRCode
		 */
		Drawing.prototype.clear = function () {
			this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
			this._bIsPainted = false;
		};
		
		/**
		 * @private
		 * @param {Number} nNumber
		 */
		Drawing.prototype.round = function (nNumber) {
			if (!nNumber) {
				return nNumber;
			}
			
			return Math.floor(nNumber * 1000) / 1000;
		};
		
		return Drawing;
	})();
	
	/**
	 * Get the type by string length
	 * 
	 * @private
	 * @param {String} sText
	 * @param {Number} nCorrectLevel
	 * @return {Number} type
	 */
	function _getTypeNumber(sText, nCorrectLevel) {			
		var nType = 1;
		var length = _getUTF8Length(sText);
		
		for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
			var nLimit = 0;
			
			switch (nCorrectLevel) {
				case QRErrorCorrectLevel.L :
					nLimit = QRCodeLimitLength[i][0];
					break;
				case QRErrorCorrectLevel.M :
					nLimit = QRCodeLimitLength[i][1];
					break;
				case QRErrorCorrectLevel.Q :
					nLimit = QRCodeLimitLength[i][2];
					break;
				case QRErrorCorrectLevel.H :
					nLimit = QRCodeLimitLength[i][3];
					break;
			}
			
			if (length <= nLimit) {
				break;
			} else {
				nType++;
			}
		}
		
		if (nType > QRCodeLimitLength.length) {
			throw new Error("Too long data");
		}
		
		return nType;
	}

	function _getUTF8Length(sText) {
		var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
		return replacedText.length + (replacedText.length != sText ? 3 : 0);
	}
	
	/**
	 * @class QRCode
	 * @constructor
	 * @example 
	 * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
	 *
	 * @example
	 * var oQRCode = new QRCode("test", {
	 *    text : "http://naver.com",
	 *    width : 128,
	 *    height : 128
	 * });
	 * 
	 * oQRCode.clear(); // Clear the QRCode.
	 * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
	 *
	 * @param {HTMLElement|String} el target element or 'id' attribute of element.
	 * @param {Object|String} vOption
	 * @param {String} vOption.text QRCode link data
	 * @param {Number} [vOption.width=256]
	 * @param {Number} [vOption.height=256]
	 * @param {String} [vOption.colorDark="#000000"]
	 * @param {String} [vOption.colorLight="#ffffff"]
	 * @param {Boolean} [vOption.transparent=false] Skip the light fill so the background is transparent
	 * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H]
	 * @param {String} [vOption.moduleShape="square"] Data modules: square|rounded|extra-rounded|dots|diamond
	 * @param {String} [vOption.markerShape="square"] Finder markers: square|rounded|extra-rounded|circle|leaf
	 * @param {String} [vOption.markerInnerShape] Finder eyes; defaults to markerShape (square|rounded|extra-rounded|circle|diamond)
	 * @param {String} [vOption.alignmentShape] Alignment (edge) markers; defaults to markerShape
	 */
	QRCode = function (el, vOption) {
		this._htOption = {
			width : 256, 
			height : 256,
			typeNumber : 4,
			colorDark : "#000000",
			colorLight : "#ffffff",
			transparent : false,
			correctLevel : QRErrorCorrectLevel.H,
			moduleShape : "square",
			markerShape : "square",
			markerInnerShape : undefined,
			alignmentShape : undefined
		};
		
		if (typeof vOption === 'string') {
			vOption	= {
				text : vOption
			};
		}
		
		// Overwrites options
		if (vOption) {
			for (var i in vOption) {
				this._htOption[i] = vOption[i];
			}
		}
		
		if (typeof el == "string") {
			el = document.getElementById(el);
		}

		if (this._htOption.useSVG) {
			Drawing = svgDrawer;
		}
		
		this._android = _getAndroid();
		this._el = el;
		this._oQRCode = null;
		this._oDrawing = new Drawing(this._el, this._htOption);
		
		if (this._htOption.text) {
			this.makeCode(this._htOption.text);	
		}
	};
	
	/**
	 * Make the QRCode
	 * 
	 * @param {String} sText link data
	 */
	QRCode.prototype.makeCode = function (sText) {
		this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
		this._oQRCode.addData(sText);
		this._oQRCode.make();
		this._el.title = sText;
		this._oDrawing.draw(this._oQRCode);			
		this.makeImage();
	};
	
	/**
	 * Make the Image from Canvas element
	 * - It occurs automatically
	 * - Android below 3 doesn't support Data-URI spec.
	 * 
	 * @private
	 */
	QRCode.prototype.makeImage = function () {
		if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
			this._oDrawing.makeImage();
		}
	};
	
	/**
	 * Clear the QRCode
	 */
	QRCode.prototype.clear = function () {
		this._oDrawing.clear();
	};

	/**
	 * SVG markup for the current QR code. Vector, so it scales to any size.
	 *
	 * @return {String}
	 */
	QRCode.prototype.getSVG = function () {
		if (!this._oQRCode) {
			throw new Error("QRCode is not generated yet");
		}
		return _createSVGString(this._oQRCode, this._htOption);
	};

	/**
	 * Download the current QR code as an SVG file.
	 *
	 * @param {String} [filename="qrcode.svg"]
	 */
	QRCode.prototype.downloadSVG = function (filename) {
		_triggerDownload(filename || "qrcode.svg", this.getSVG(), "image/svg+xml;charset=utf-8");
	};

	/**
	 * PNG data URL of the current QR code.
	 *
	 * @param {Number} [size] Pixel width/height. Defaults to the constructor width.
	 * @return {String}
	 */
	QRCode.prototype.getDataURL = function (size) {
		if (!this._oQRCode) {
			throw new Error("QRCode is not generated yet");
		}
		return _renderExportCanvas(this._oQRCode, this._htOption, size).toDataURL("image/png");
	};

	/**
	 * Download the current QR code as a PNG. Pass a large size (2048, 4096, ...) for print use.
	 *
	 * @param {String} [filename="qrcode.png"]
	 * @param {Number} [size=2048]
	 */
	QRCode.prototype.downloadPNG = function (filename, size) {
		var canvas;

		if (!this._oQRCode) {
			throw new Error("QRCode is not generated yet");
		}

		filename = filename || "qrcode.png";
		canvas = _renderExportCanvas(this._oQRCode, this._htOption, size || 2048);

		if (typeof canvas.toBlob === "function") {
			canvas.toBlob(function (blob) {
				_triggerDownload(filename, blob, "image/png");
			}, "image/png");
			return;
		}

		_triggerDownload(filename, canvas.toDataURL("image/png"));
	};
	
	/**
	 * @name QRCode.CorrectLevel
	 */
	QRCode.CorrectLevel = QRErrorCorrectLevel;

	/**
	 * @name QRCode.Shape
	 */
	QRCode.Shape = {
		Square: "square",
		Rounded: "rounded",
		ExtraRounded: "extra-rounded",
		Dots: "dots",
		Circle: "circle",
		Diamond: "diamond",
		Leaf: "leaf"
	};
})();
