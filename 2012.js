/**
 * 2012 褰╄泲鏁堟灉婧愮爜
 * author: dron
 * date: 2012-3-10
 */

void function(window, undefined){

	var baseURL = "http://s1.bdstatic.com/r/www/cache/2012cp/images/";
	// var baseURL = "images/";

	// var baseURL = "http://hot.baidu.com/savetheearth/img/";
	var nopUrl = "http://hot.baidu.com/savetheearth/savetheearth/?a=total&cb=getNOP";

	var targetNumber = 500000;
	var nowNumber = 0;
	var activityUrl = "http://hot.baidu.com/savetheearth"; // 娲诲姩椤靛湴鍧€

	var doc = document;
	var de = doc.documentElement;
	var body = doc.body;
	var out = doc.getElementById("out");
	var swapDoms = [];

	
	var max = Math.max;
	var min = Math.min;
	var sqrt = Math.sqrt;
	var pow = Math.pow;
	var abs = Math.abs;
	var round = Math.round;

	var ua = navigator.userAgent;
	var ie = /msie/i.test(ua) && !document.addEventListener;
	var ie6 = /msie 6/i.test(ua);
	var cr = /chrome/i.test(ua);
	var sf = /safari/i.test(ua);
	var ff = /firefox/i.test(ua);
	var op = /opera/i.test(ua);

	var time = ie ? 16 : 30;
	var sframesNum = 40;

	window.getNOP = function(data){
	    nowNumber = data.total;
	};

	var zIndexs = {
		background: 4000, // 鑳屾櫙灞�
		forceground: 5000, // 鍓嶆櫙灞�
		chasm: 6000, // 瑁傜棔
		chip: 7000, // 纰庣煶
		ticket: 8000, // 鑸圭エ
		text: 9000 // 鏂囧瓧
	};

	var css = function(window, undefined){

		var cache = {};

		var getPms = function(index){
		    return [].slice.apply(
		    	arguments.callee.caller.arguments, [index || 1]);
		};

		var decode = function(styles){
		    var res = [], idx = 0;
		    for(var n in styles)
		        res[idx ++] = fullname(n) + ": " + value(styles[n]) + "; ";
		    return res.join("");
		};

		var fullname = function(){
			var shorts = { pos: "position", w: "width", h: "height", l: "left", t: "top" };
		  	return function(name){
			    return shorts[name] || name;
			}
		}();

		var value = function(value){
			return value - 0 === value ? value + "px" : value;
		};

		var join = function(objs){
			var res = [];
			for(var i = 0, l = objs.length, obj; i < l; i ++){
				obj = objs[i];
		    	if(/^=/.test(obj))
		    		res[i] = loadRes(obj);
		    	else if(obj + "" === obj)
		    		res[i] = obj;
		    	else
		    	    res[i] = decode(obj);
			}
			return res.join(";");
		};

		var saveRes = function(name){
			cache[name] = join(getPms(1));
		};

		var loadRes = function(name){
		    return cache[name];
		};

		var replaceTag = function(tag){
		   	if(/^<(\w+)([^>]*)>$/.test(tag)){
		   		var tag = RegExp.$1, atts = RegExp.$2;
		   		return "<" + tag + atts + " style='" + join(getPms(1)) + "'></" + tag + ">";
		   	}
		};

		var dom = function(dom){
		    dom.style.cssText += ";" + join(getPms(1));
		};

		return function(fst, sec){
			var fn;
			if(!fst){
			    throw new Error();
			}else if(/^=/.test(fst)){
		        if(sec === undefined)
		            fn = loadRes;
		        else
		        	fn = saveRes;
		    }else if(/^<[^>]+>$/.test(fst)){
		    	fn = replaceTag;
		    }else if(fst.nodeType && fst.nodeType != 3){
		    	fn = dom;
		    }
		    return fn.apply(this, arguments);
		}
	}(window);

	var style = function(dom, config){
		for(var name in config)
			dom.style[name] = config[name];
	}

	var makeDom = function(tag, parent, style, recycle){
	    var dom = doc.createElement(tag || "div");
	   	style && css.apply(null, [dom].concat(style));
	   	parent && parent.appendChild(dom);
	   	recycle && recycle.push(dom);
	   	return dom;
	};

	var frame = function(fn, time, min){
		var start = new Date().getTime();
		var end = start + time;
		var pRate = 1 / (min || 5);
		var lastRate = 0;
		var endCb;
	    var interval = setInterval(function(){
	        var now = new Date().getTime();
	        var rate = (now - start) / time;
	        if(rate > lastRate + pRate)
	            rate = lastRate + pRate;
	        lastRate = rate;
	        if(rate < 1)
	            fn(rate);
	        else{
	        	clearInterval(interval);
	            fn(1);
	            endCb && endCb();
	        }
	    }, 1);
	    return {
	    	end: function(fn){
	    	    endCb = fn;
	    	}
	    }
	};

	var alpha = function(){
		return typeof document.body.style.opacity == "string" ?

		function (dom, n){
		    dom.style.opacity = n;
		} :

		function(dom, n){
			var key = "alpha";
			n = n * 100 | 0;
			if(~ dom.style.filter.indexOf(key)){
				dom.filters.item(key).opacity = n;
			}else{
				dom.style.filter += " alpha(opacity=" + n + ")";
			}
		}
	}();

	var rotate = function(dom, ang, origin){
		var r = ang * Math.PI / 180;
		var cos = Math.cos(r);
		var sin = Math.sin(r);
		matrix(dom, cos, -sin, sin, cos, origin || "center center");
	};

	var matrix = function(){
		var originKey, transformKey;
		if(cr || sf){
		    originKey = "-webkit-transform-origin";
		    transformKey = "-webkit-transform";
		}else if(ff){
			originKey = "MozTransformOrigin";
			transformKey = "MozTransform";
		}else if(op){
			originKey = "OTransformOrigin";
			transformKey = "OTransform";
		}
		return ie ?
		function(dom, M11, M12, M21, M22, origin){
			// TODO: origin 鏈疄鐜�
			var key = "DXImageTransform.Microsoft.Matrix";
			var style = dom.style;
			if(~ style.filter.indexOf(key)){
				var matrix = dom.filters.item(key);
				matrix.M11 = M11, matrix.M12 = M12, matrix.M21 = M21, matrix.M22 = M22;
			}else{
				style.filter += " progid:" + key + "(M11=" + M11 + ", M12=" + M12 +", M21=" + M21 + ", M22=" + M22 + ", FilterType='bilinear', SizingMethod='auto expand')";
			}
		} :
		function(dom, M11, M12, M21, M22, origin){
			var conf = {};
			conf[originKey] = origin || "0 0";
			conf[transformKey] = "matrix(" + [M11, M21, M12, M22].join(",") + ",0,0)";
		    style(dom, conf);
		}
	}();

	var removeDom = function(parent, tag){
		var els = parent.getElementsByTagName(tag);
		for(var i = els.length - 1; i >= 0; i --)
			els[i].parentNode.removeChild(els[i]);
	};

	var turnOverX = function(dom, w, h, x, y, dx){
		var dy = h / 2;
		var center, end;
		frame(function(rate){
			rate = exponential(rate, 0, 1, 1);
			var r = rate * Math.PI;
			var p = rate < .5 ? -1 : 1;
			var M12 = p * Math.sin(r) * dx / w;
			var M22 = -p * Math.cos(r);
			if(rate >= .5)
			    center && center(), center = null;
			matrix(dom, 1, M12, 0, M22);
			M12 = ie ? Math.abs(M12) : M12;
			style(dom, { left: x - M12 * w / 4 + "px", top: y + dy * (1 - M22) + "px" });
		}, 1200, 24).end(function(){ end && end(); });
		var rt = {
			center: function(fn){ center = fn; return rt; },
			end: function(fn){ end = fn; return rt; }
		};
		return rt;
	};

	var addEvent = function(target, name, fn){
		var call = function(){
			fn.apply(target, arguments);
		};
		if(window.attachEvent){
			target.attachEvent("on" + name, call);
		}else if(window.addEventListener){
			target.addEventListener(name, call, false);
		}else{
			target["on" + name] = call;
		};
		return call;
	};

	var swapDom = function(el, other){
		var p1, p2, t;
		p1 = el.parentNode;
		p2 = other.parentNode;
		t = document.createTextNode("");

		p1.insertBefore(t, el);
		p2.insertBefore(el, other);
		p1.insertBefore(other, t);
		p1.removeChild(t);
	};

	css("=abs", "position: absolute;");
	css("=thide", "top: -5000px;");
	css("=hide", "overflow: hidden");
	css("=chip", "=abs", "=hide", "background: url(" + baseURL + "all.png) no-repeat 0 0; z-index: " + zIndexs.chip + ";");
	css("=broken1", "=abs", "=thide", "background: url(" + baseURL + "all.png) no-repeat 0 0; z-index: " + zIndexs.chasm + ";");
	css("=broken2", "=abs", "=thide", "=hide", "z-index: " + zIndexs.chasm + ";");
	css("=background", "=abs", "=thide", "=hide", "background: #050006 url(" + baseURL + "all.png) no-repeat 0 -462px; z-index: " + zIndexs.background + ";");
	css("=forceground", "=abs", "=thide", "=hide", "height: 355px; background-color: #fff; z-index: " + zIndexs.forceground + ";");
	css("=ticket-layer", "=abs", "=hide", "z-index: " + zIndexs.ticket + "; width: 602px; height: 258px; background: url(" + baseURL + "ticket.jpg) no-repeat 0 0;");
	css("=ticket-shadow", "=ticket-layer", "background: #000;");
	css("=loading", "=abs", "z-index: " + zIndexs.text + "; background: url(" + baseURL + "all.png) no-repeat -829px -521px; width: 300px; height: 20px;");
	css("=loading-bar", "=hide", "width: 0; height: 20px; background: url(" + baseURL + "all.png) no-repeat -829px -541px;");
	css("=text", "=abs", "color: #a3cb4c; font-size: 18px; font-weight: 700; width: 72px; height: 20px; text-align: center; z-index: " + zIndexs.text + ";");
	css("=join", "=abs", "width: 132px; height: 42px; background: url(" + baseURL + "all.png) no-repeat -687px -521px; z-index: " + zIndexs.text + ";");
	css("=close", "=abs", "width: 27px; height: 27px; background: url(" + baseURL + "all.png) no-repeat -650px -521px; z-index: " + zIndexs.text + ";");

	/**
	 * 鍦伴渿
	 */
	var earthquake = function(){
		var level = 1;
		var interval;
		var onQuake = function(){};

		var f = ie6 ? function(x, y){
		    return { left: x + "px", top: y + "px" };
		} : function(x, y){
		    return { marginLeft: x + "px", marginTop: y + "px" };
		};

		return {
			start: function(){
			    interval = itv(function(){
			        var left = level * 2 - random(level * 4);
					var top = level * 1 - random(level * 2);
					style(out, f(left, top));
					onQuake(left, top);
			    });
			},
			stop: function(){
			    clearInterval(interval);
			    tout(function(){
			        style(out, f(0, 0));
					onQuake(0, 0);
			    }, 1);
			    // resetOver();
			},
			setLevel: function(n){
			    level = n;
			},
			onQuake: function(callback){
			    onQuake = callback;
			}
		}
	}();

	/**
	 * 鎺夎惤纰庣煶
	 */
	var chip = function(){
		var chips = [ [28, 27, 0], [22, 27, 27], [16, 25, 54] ]; // width, height, top
	    return {
	    	create: function(){
		        var c = chips[random(chips.length)];
		        var top = -50, left = random(body.clientWidth) - 40;
		        var div = makeDom("div", body, ["=chip", { w: c[0], h: c[1], l: left, t: top, "background-position": "-612px -" + (c[2] + 521) + "px" }]);

		        frame(function(rate){
		     		div.style.top = quadratic(rate, top, 800, 1) + "px"; // 800 = 750 - (-50)
		        }, 1e3).end(function(){
		            body.removeChild(div);
		        });
	    	}
	    }
	}();

	/**
	 * 瑁傜棔
	 */
	var forceground;
	var chasm = function(){
		var level = 0;
		var bg = baseURL + "all.png";
		var img2 = baseURL + "broken.png";
		var imgObj1, imgObj2;
		var background;

		var searchBoxWidth = 620; // 鎼滅储妗嗚嚦灏戝搴�
		var fixTop = -7;
		var fixLeft = 68;
		var frameWidth = 227;
		var frameHeight = 452;
		var framePics = 8;
		var elQueue = [];

	    return {
	    	prepare: function(){
	    		var iw = min(frameWidth, de.clientWidth - searchBoxWidth);

	    		// 鍒涘缓瑁傜紳 gif 灞�
	    	    imgObj1 = makeDom("div", body, ["=broken1", { l: searchBoxWidth + "px", w: iw + "px", h: frameHeight + "px" }], elQueue);

	    	    // 鍒涘缓瑁傜紳 png 灞�
	    	    imgObj2 = makeDom("div", body, ["=broken2", { l: searchBoxWidth, w: iw, h: frameHeight }], elQueue);

	    	    imgObj2.innerHTML = "<div style=\"width: " + (frameWidth * framePics) + "px; height: " + frameHeight + "px; " +
	    	    	(ie6 ? "filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img2 + "',sizingMethod='scale');" :
	    	    	"background: url(" + img2 + ") right 0;")
	    	    + "\">&nbsp;</div>";

	    	    // 鍒涘缓鑳屾櫙灞�
	    	    background = makeDom("div", body, ["=background", { l: searchBoxWidth + fixLeft + 15, w: max(body.clientWidth - searchBoxWidth - fixLeft - 15, 0), h: 80 }], elQueue);

	    	    // 鍒涘缓鍓嶆櫙灞傦紙鐢ㄤ簬鏃嬭浆锛�
	    	    forceground = makeDom("div", body, ["=forceground", { l: searchBoxWidth + fixLeft, w: max(body.clientWidth - searchBoxWidth - fixLeft, 0) }], elQueue);

	    	    // 鍒涘缓鏃嬭浆灞�
	    	    var body2 = makeDom("div", forceground, [{ w: body.clientWidth, "z-index": zIndexs.chasm, padding: "6px 0 0" }], elQueue);

	    	    removeDom(out, "script");

	    	    var outCloner = out.cloneNode(true);
	    	    removeDom(outCloner, "iframe");
	    	    
	    	    outCloner.style.position = "relative";

	    	    body2.appendChild(outCloner);
	    	    this.disposeCloneEvent(outCloner);
	    	    elQueue.push(outCloner);

	    	    forceground.scrollLeft = 1e5;

	    	    addEvent(window, "resize", function(){
	    	    	if(closeAll.status)return;
	    	        background.style.width = max(0, body.clientWidth - searchBoxWidth - fixLeft - 15) + "px";
	    	        forceground.style.width = max(0, body.clientWidth - searchBoxWidth - fixLeft) + "px";
	    	        body2.style.width = body.clientWidth + "px";
	    	        background.style.background = "#050006 url(" + bg + ") no-repeat " + ((body.clientWidth - searchBoxWidth - fixLeft - 15) - 1214) + "px -452px";
	    	        forceground.scrollLeft = 1e5; });
	    	},

	    	disposeCloneEvent: function(cloneEl){
	    		var ids = " u tools ";
	    	    var all = cloneEl.getElementsByTagName("*");
	    	    for(var i = all.length - 1, el, o; i >= 0; i --)
	    	    	if(el = all[i], el.id && (~ids.indexOf(" " + el.id + " "))){
	    	    		o = document.getElementById(el.id);
	    	    		swapDoms.push([el, o]);
	    	    		swapDom(el, o);
	    	    	}
	    	},

	    	setLevel: function(n){
	    		level = n;

	    		if(n == 0){
	    			imgObj1.style.top =
	    			imgObj2.style.top =
	    			background.style.top =
	    			forceground.style.top = "-5000px";
	    			return ;
	    		}else{
	    			imgObj1.style.top =
	    			imgObj2.style.top = fixTop + "px";
	    			background.style.top = "0";
	    			forceground.style.top = "2px";
	    		}

	    		var left = (n - 1) * frameWidth;
	    		imgObj1.style.backgroundPosition = "-" + left + "px 0";
	    		imgObj2.scrollLeft = left;

	    		if(n > 3){
	    		    rotate(forceground, (n - 3) * .8, "left bottom");
	    		    background.style.background = "#050006 url(" + bg + ") no-repeat " + ((body.clientWidth - searchBoxWidth - fixLeft - 15) - 1214) + "px -452px";
	    		}else{
	    		    rotate(forceground, 0, "left bottom");
	    		    background.style.background = "#fff";
	    		}
	    	},

	    	healing: function(){
	    		var num = nowNumber > targetNumber ? targetNumber : nowNumber;
	    	    var rate = round(framePics - (num / targetNumber) * framePics);
	    	    var level = framePics;

	    	    var interval = itv(function(){
	    	    	if(level == rate)
	    	            return clearInterval(interval);
	    	        level > rate ? (level --) : (level ++);
	    	        chasm.setLevel(level);
	    	    }, 500);
	    	},

	    	fixPos: function(left, top){
	    	    if(level == 0)return ;
	    	    imgObj1.style.left =
	    	    imgObj2.style.left = searchBoxWidth + left + "px";
	    	    imgObj1.style.top =
	    	    imgObj2.style.top = top + fixTop + "px";
	    	    forceground.style.left = searchBoxWidth + fixLeft + left + "px";
	    	    forceground.style.top = top + 2 + "px";
	    	},

	    	dispose: function(){
				for(var i = elQueue.length - 1; i >= 0; i --)
					try{elQueue[i].parentNode.removeChild(elQueue[i]);}catch(e){}
	    	}
	    }
	}();

	/**
	 * 褰╃エ
	 */
	var ticket = function(){
		// 鍙傝€冩暟鎹昂瀵�
	    var referenceDataSize = [642, 265];

	    var dialogWidth = 602, dialogHeight = 258, shadowZoom = 1.25;
		var shadowDiffPos = [dialogWidth * (shadowZoom - 1) / 2, dialogHeight * (shadowZoom - 1) / 2];

	    var keyPoints = [
	    	/* [point, helper, offsetAngle] */
	    	// A:
	    	[ [543, 56], [342, 182], .001 ],
	    	// B:
	    	[ [43, 59], [172, 192], 1/9 ],
	    	// C:
	    	// [ [852, 90], [431, 284], 1/3 ]
	    	[ [852, 150], [431, 284], 1/3 ]
	    	// D:
	    	// [ [461, 222], [336, 256] ]
	    ];

	    // 鍙傝€冩暟寰勬闆�
	    var referencePaths = [];

	    for(var i = 1, s, e, kp, l = keyPoints.length; i < l; i ++){
	    	s = keyPoints[i - 1];
	    	e = keyPoints[i];
	    	referencePaths.push(bezierPoints([s[0], s[1], e[1], e[0]], 300));
	    }

	    var keyStartPoint = keyPoints[0], keyEndPoint = keyPoints[keyPoints.length - 1];
	    var startPoint = keyPoints[0][0], endPoint, lightPoint, sDistance;
	    var shadowOffset = [640, 480];
	    var elQueue = [];
	    var layer, shadow, centerd, scDistance;

	    return {
	    	show: function(){
	    		var bodyWidth = de.clientWidth, bodyHeight = de.clientHeight;

	    	    endPoint = [(bodyWidth - dialogWidth) / 2 | 0,  (bodyHeight - dialogHeight) / 2 | 0];

	    	    lightPoint = [bodyWidth / 2 | 0, 0];

	    	    // scDistance = [lightPoint[0] - startPoint[0], lightPoint[1] - startPoint[1]];
	    	    scDistance = 640;

	    	    shadow = makeDom("div", body, ["=ticket-shadow"]);
	    	    layer = makeDom("div", body, ["=ticket-layer"], elQueue);
	    	    // layer.src = baseURL + "ticket-front.png";

	    	    var lastPoint = [0, 0], lastZoom = keyPoints[keyPoints.length - 1][2], lastAngle = 0;

	    	    // var drawPoint = function(x, y){
	    	    //     var div = document.createElement("div");
	    	    //     div.style.cssText = "position: absolute; width: 3px; height: 3px; left: " + x + "px; top: " + y + "px; background: red; overflow: hidden;";
	    	    //     document.body.appendChild(div);
	    	    // }

	    	    var setTicket = function(){
	    	    	var last = [0, 0];
	    	      	return function(x, y, z, a, r){
	    	      		if(last[0] == x && last[1] == y)
	    	      		    return ;

	    	      		// drawPoint(x, y);

	        			var sinr = Math.sin(r *= Math.PI / 180) * z,
	    	        		cosr = Math.cos(r) * z;
	    	        	var sinr2 = sinr * .5,
	    	        		sinr3 = sinr * .75;

	    	        	if(ie)
	    	        	    x += dialogWidth * sinr2,
	    	        	    y += dialogHeight * sinr3;

		    	    	var c = [x + dialogWidth * z / 2, y + dialogHeight * z / 2];
		    	        var distanceZoom = [(c[0] - lightPoint[0]) / scDistance, (c[1] - lightPoint[1]) / scDistance];

	    	        	style(layer, { left: x + "px", top: y + "px" });
	    	        	style(shadow, {
	    	        		left: x + shadowOffset[0] * distanceZoom[0] * z - shadowDiffPos[0] * z + "px",
	    	        		top: y + shadowOffset[1] * distanceZoom[1] * z - shadowDiffPos[1] * z + "px" });

	    	        	alpha(shadow, a);
	    	        	matrix(layer, cosr, sinr2, sinr3, cosr, "0 0");
	    	        	matrix(shadow, cosr * shadowZoom, sinr2 * shadowZoom, sinr3 * shadowZoom, cosr * shadowZoom, "0 0");

	    	        	last = [x, y];
		    	    }
	    	    }();

	    	    var playLastTicket = function(){
	    	        var targetAngle = abs(360 - lastAngle) > lastAngle ? 0 : 360;
	    	        // var index = 0, framesNum = 1e3;
	    	        frame(function(rate){
	    	        	// var index = round(rate * framesNum);
	    	        	setTicket(
	    	        		cubic(rate, lastPoint[0], endPoint[0] - lastPoint[0], 1),
	    	        		cubic(rate, lastPoint[1], endPoint[1] - lastPoint[1], 1),
	    	        		cubic(rate, lastZoom, 1 - lastZoom, 1),
	    	        		cubic(rate, .33, -.33, 1),
	    	        		cubic(rate, lastAngle, targetAngle - lastAngle, 1)
	    	        	);
	    	        }, 1200, 14).end(function(){
	    	            shadow.parentNode.removeChild(shadow);
	    	            tout(function(){
	    	            	centerd = true;
	    	                ticket.turnOver(ticket.showLoadingBar);
	    	            }, 1e3);
	    	        });
	    	    };

	    	    var playBezierPath = function(points, bezierIndex, z1, z2, callback){
	    	    	// var framesNum = 1e3, angle = 0;
	    	    	frame(function(rate){
	    	    		// var index = round(rate * framesNum);
	    	    	   	var pIndex = round(cubic(rate, 0, 299, 1));
	    	            var z = cubic(rate, z1, z2 - z1, 1);
	    	            var a = 1 - cubic(rate, bezierIndex * .33, .33, 1);
	    	            var p = lastPoint = points[pIndex], p1;
	    	         	var r;

	    	         	if(p1 = points[pIndex + 1])
	    	         		lastAngle = r = (getAngleByRadian(pointToRadian(p, p1)) + (bezierIndex % 2 ? 0 : 180)) % 360;

    	                setTicket(p[0], p[1], z, a, r || lastAngle);
	    	    	}, 1200, 14).end(callback);
	    	    };

	    	    var playPaths = function(index){
	    	    	var points = referencePaths[index];
	    	    	if(points){
	    	    		// alert([keyPoints[index][2], keyPoints[index + 1][2]]);
		    	        playBezierPath(points, index, keyPoints[index][2], keyPoints[index + 1][2], function(){
		    	        	playPaths(index + 1);
		    	    	});
	    	    	}else{
	    	    	    playLastTicket();
	    	    	}
	    	    };

	    	    playPaths(0);

	    	   	addEvent(window, "resize", function(){
	    	   		if(closeAll.status)return;
	    	    	endPoint = [(de.clientWidth - dialogWidth) / 2 | 0,  (de.clientHeight - dialogHeight) / 2 | 0];
	    	    	if(centerd)
	    	    	    style(layer, { left: endPoint[0] + "px", top: endPoint[1] + "px" });
	    	    });
	    	},

	    	turnOver: function(end){
	    		var x = parseInt(layer.style.left);
	    		var y = parseInt(layer.style.top);

	    		turnOverX(layer, dialogWidth, dialogHeight, x, y, 150).center(function(){
	    		    // layer.src = baseURL + "blank.gif";
	    		    layer.style.backgroundPosition = "0 -260px";
	    		}).end(end);
	    	},

	    	showLoadingBar: function(){
	    		var loadingOffset = [125, ie ? 206 : 207];
	    	    var textOffset = [77, 230];
	    	    var joinButtonOffset = [449, 208];
	    	    var closeButtonOffset = [574, 3];

	    	    var template = "<span id='deliverer-num'></span>";

	    	    var loading = makeDom("div", body, ["=loading", { l: endPoint[0] + loadingOffset[0], t: endPoint[1] + loadingOffset[1] }], elQueue);
	    	    var loadingBar = makeDom("div", loading, ["=loading-bar"], elQueue);
	    	    var layer = makeDom("div", body, ["=text", { l: endPoint[0] + textOffset[0], t: endPoint[1] + textOffset[1] }], elQueue);
	    	    var joinButton = makeDom("div", body, ["=join", { l: endPoint[0] + joinButtonOffset[0], t: endPoint[1] + joinButtonOffset[1] }], elQueue);
	    	    var closeButton = makeDom("div", body, ["=close", { l: endPoint[0] + closeButtonOffset[0], t: endPoint[1] + closeButtonOffset[1] }], elQueue);

	    	   	addEvent(window, "resize", function(){
	    	   		if(closeAll.status)return;
	    	    	endPoint = [(de.clientWidth - dialogWidth) / 2 | 0,  (de.clientHeight - dialogHeight) / 2 | 0];
	    	    	css(loading, { l: endPoint[0] + loadingOffset[0], t: endPoint[1] + loadingOffset[1] });
	    	    	css(layer, { l: endPoint[0] + textOffset[0], t: endPoint[1] + textOffset[1] });
	    	    	css(joinButton, { l: endPoint[0] + joinButtonOffset[0], t: endPoint[1] + joinButtonOffset[1] });
	    	    	css(closeButton, { l: endPoint[0] + closeButtonOffset[0], t: endPoint[1] + closeButtonOffset[1] });
	    	    });

	    	    joinButton.onmouseover = function(){ this.style.backgroundPosition = "-687px -563px"; };
	    	    joinButton.onmouseout = function(){ this.style.backgroundPosition = "-687px -521px"; };
	    	    joinButton.onclick = function(){ open(activityUrl); };

	    	    closeButton.onmouseover = function(){ this.style.backgroundPosition = "-650px -548px"; };
	    	    closeButton.onmouseout = function(){ this.style.backgroundPosition = "-650px -521px"; };
	    	    closeButton.onclick = function(){ closeAll(); };

	    	    var formatNumber = function(number){
	    	        return round(number).toString().replace(/(\d)(?=(\d{3})+$)/ig, "$1,");;
	    	    };

	    	    layer.innerHTML = template;

	    	    var deliverer = doc.getElementById("deliverer-num");
	    	    // var index = 0, framesNum = 60;
	    	    // var interval = itv(function(){
	    	    //     var number1 = linear(index, 0, nowNumber, framesNum);
	    	    //     var number2 = exponential(index, 0, nowNumber, framesNum);
	    	    //     deliverer.innerHTML = formatNumber(number2);
	    	    //     loadingBar.style.width = round(number1 / targetNumber * 20) * 15 + "px";
	    	    //     if(++ index > framesNum){
	    	    //         clearInterval(interval);
	    	    //         tout(function(){ chasm.healing(); }, 1e3);
	    	    //     }
	    	    // });
	    	    frame(function(rate){
	    	        var number1 = linear(rate, 0, nowNumber, 1);
	    	        var number2 = exponential(rate, 0, nowNumber, 1);
	    	        deliverer.innerHTML = formatNumber(number2);
	    	        loadingBar.style.width = round(number1 / targetNumber * 20) * 15 + "px";
	    	    }, 1200, 24).end(function(){
	    	        tout(function(){ chasm.healing(); }, 1e3);
	    	    });
	    	},

	    	dispose: function(){
				for(var i = elQueue.length - 1; i >= 0; i --)
					try{elQueue[i].parentNode.removeChild(elQueue[i]);}catch(e){}
	    	}
	    }
	}();

	// 鍏抽棴鏁堟灉
	var closeAll = function(){
		closeAll.status = 1;
	    chasm.dispose();
	    ticket.dispose();

	    for(var i = swapDoms.length - 1, s; i >= 0; i --){
	    	s = swapDoms[i];
	    	swapDom(s[0], s[1]);
	    }

	    resetOver();
	};

	/**
	 * 椤甸潰鍑嗗
	 */

	try{
		ie && doc.execCommand("BackgroundImageCache", false, true);
	}catch(e){};

	var earthquakeLevel = 1;

	style(out,   ie6 ? ({ position: "relative", left: 0, top: 0, display: "block" }) : ({ display: "block" })  );

	earthquake.onQuake(function(left, top){
		// 鍦伴渿鐨勫悓鏃讹紝鎺夎惤纰庣煶
	    if(random(10) < earthquakeLevel)
	    	chip.create();
	    chasm.fixPos(left, top);
	});

	/**
	 * 涓荤嚎涓氬姟
	 */

	var nopScript = document.createElement("script");
	nopScript.type = "text/javascript";
	nopScript.src = nopUrl;
	body.appendChild(nopScript);

	var cimg = new Image();
	cimg.src = baseURL + "ticket.jpg";

	var imageLoader = new Image();
	imageLoader.onload = function(){
		disOver();

		tout(function(){
			earthquake.start();
			chasm.prepare();
		}, 0);

		tout(function(){ chasm.setLevel(1); }, 500);

		for(var i = 2; i < 8; i ++)
			tout(function(i){
			    return function(){
			        earthquake.setLevel(earthquakeLevel = i);
			    	chasm.setLevel(i);
			    }
			}(i), i * 400);

		tout(function(){ earthquake.stop(); chasm.setLevel(8); }, 3500);
		tout(ticket.show, 4500);
	}
	imageLoader.src = baseURL + "all.png";

	/**
	 * Tools
	 */
	function itv(f, t){ return setInterval(f, t || time); }
	function tout(f, t){ return setTimeout(f, t || time); }
	function random(number){ return Math.random() * number | 0; }
	function quadratic(index, offset, target, framesNum){ return target * (index /= framesNum) * index + offset; }

	function disOver(){
	    de.style.overflowX = "hidden";
	}

	function resetOver(){
	    de.style.overflowX = "auto";
	}

	// 寮у害杞崲涓鸿搴�
	function getAngleByRadian(radian){ return radian * 180 / Math.PI; }

	// 鏍规嵁 origin 璁＄畻 point 鐨勬柟鍚戯紝杩斿洖寮у害鍊�
	function pointToRadian(origin, point){
		var PI = Math.PI;
		if (point[0] == origin[0]) {
			if (point[1] > origin[1])
				return PI * 0.5;
			return PI * 1.5
		} else if (point[1] == origin[1]) {
			if (point[0] > origin[0])
				return 0;
			return PI;
		}
		var t = Math.atan((origin[1] - point[1]) / (origin[0] - point[0]));
		if (point[0] > origin[0] && point[1] < origin[1])
			return t + 2 * PI;
		if (point[0] > origin[0] && point[1] > origin[1])
			return t;
		return t + PI; // 瑙掑害
	}

	function curveLength(curve){ return max((distance(curve[0], curve[1]) + distance(curve[1], curve[2]) + distance(curve[2], curve[3])) | 0, 1); }

	/*
	 * 涓ょ偣闂磋窛绂�
	 */
	function distance(a, b){ return sqrt(pow(a[0] - b[0], 2) + pow(a[1] - b[1], 2)); }

	function bezier(curve, rate){
		var cx = 3 * (curve[1][0] - curve[0][0])
			, bx = 3 * (curve[2][0] - curve[1][0]) - cx
			, ax = curve[3][0] - curve[0][0] - cx - bx
			, cy = 3 * (curve[1][1] - curve[0][1])
			, by = 3 * (curve[2][1] - curve[1][1]) - cy
			, ay = curve[3][1] - curve[0][1] - cy - by;
		return [ax * pow(rate, 3) + bx * pow(rate, 2) + cx * rate + curve[0][0],
			ay * pow(rate, 3) + by * pow(rate, 2) + cy * rate + curve[0][1]];
	}

	// 绛夎窛
	function bezierPoints(curve, count){
		if (count < 2) return;
		var len = curveLength(curve);
		var points = [];
		// 璁＄畻鏇茬嚎涓婄偣鐨勪俊鎭�
		points[0] = {
			p: curve[0],
			t: 0,
			l: 0
		};
		for (var i = 1; i <= len; i++){
			var t = i / len,
				p = bezier(curve, t),
				l = points[i - 1].l + distance(p, points[i - 1].p);
			points[i] = {
				i: i,
				p: p,
				t: t,
				l: l
			}
		}
		var max = points[len].l; // 鏇茬嚎鎬婚暱搴�
		var result = [];
		var t = 0;
		for (var i = 0; i <= count; i++){
			var tl = max * (i / (count - 1));
			for (var j = t; j < points.length; j++){
				var point = points[j]
				if (point.l >= tl){
					t = j;
					result.push(point.p);
					break;
				}
			}
		}
		return result;
	}

	function linear(index, offset, target, framesNum){ return target * index / framesNum + offset; }

	function cubic(index, offset, target, framesNum){
		if((index /= framesNum / 2) < 1)
			return target / 2 * index * index * index + offset;
		else
			return target / 2 * ((index -= 2) * index * index + 2) + offset;
	}

	function exponential(index, offset, target, framesNum){
		if(index == 0)
			return offset;
		else if(index == framesNum)
			return offset + target;
		else if((index /= framesNum / 2) < 1)
			return target / 2 * Math.pow(2, 10 * (index - 1)) + offset;
		else
			return target / 2 * (-Math.pow(2, -10 * -- index) + 2) + offset;
	}
}(window);