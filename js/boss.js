/*FIX IE VIEW PORT BUG*/
(function () {
	if(navigator.userAgent.match(/IEMobile 10\.0/)){
		var msViewportStyle = document.createElement('style');
		msViewportStyle.appendChild(document.createTextNode('@-ms-viewport{width:auto!important}'));
		document.querySelector('head').appendChild(msViewportStyle);
	}

	if(navigator.userAgent.match(/MSIE 9\.0/)){
		if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
			Object.defineProperty(HTMLElement.prototype, 'classList', {
				get: function() {
					var self = this;
					function update(fn) {
						return function(value) {
						var classes = self.className.split(/\s+/),
						index = classes.indexOf(value);

						fn(classes, index, value);
						self.className = classes.join(" ");
						}
					}

					var ret = {
						add: update(function(classes, index, value) {
							~index || classes.push(value);
						}),

						remove: update(function(classes, index) {
							~index && classes.splice(index, 1);
						}),

						toggle: update(function(classes, index, value) {
							~index ? classes.splice(index, 1) : classes.push(value);
						}),

						contains: function(value) {
							return !!~self.className.split(/\s+/).indexOf(value);
						},

						item: function(i) {
							return self.className.split(/\s+/)[i] || null;
						}
					};

					Object.defineProperty(ret, 'length', {
						get: function() {
							return self.className.split(/\s+/).length;
						}
					});

					return ret;
				}
			});

			var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

			function InvalidCharacterError(message) {
				this.message = message;
			}
			InvalidCharacterError.prototype = new Error;
			InvalidCharacterError.prototype.name = 'InvalidCharacterError';

			object.btoa || (
				object.btoa = function (input) {
				var str = String(input);
				for (var block, charCode, idx = 0, map = chars, output = ''; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)){
					charCode = str.charCodeAt(idx += 3/4);
					if (charCode > 0xFF) {
						throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
					}
					block = block << 8 | charCode;
				}
				return output;
			});
		}
	}
}());

/* VAR TO LOCK CHANGE PAGE */
var lockChangePage = false;

/* VAR TO LOOK EXIT PAGE, CLOSE BROWSER OR CLOSE TAB */
var lockClosePage = false;

var touchEvents = false;

window.Boss = {

	/* TOUCH EVENT */
	evtTouch: function(){
		if (window.navigator.msPointerEnabled) {
			return 'MSPointerDown';
		}else if('ontouchstart' in window && touchEvents === true){
			return 'touchstart';
		}else{
			return 'mousedown';
		}
	},
	/* UP AND END TOUCH EVENT */
	evtTouchUp: function(){
		if (window.navigator.msPointerEnabled) {
			return 'MSPointerUp';
		}else if('ontouchend' in window && touchEvents === true){
			return 'touchend';
		}else{
			return 'mouseup';
		}
	},
	/* TOUCH MOVE EVENT */
	evtTouchMove: function(){
		if('ontouchmove' in window && touchEvents === true){
			return 'touchmove';
		}else{
			return 'mousemove';
		}
	},
	/* ADD EVENTS */
	evts: {
		add: function (evt, el, fn) {
			if(el !== null){
				if(window.addEventListener){
					el.addEventListener(evt, function(evt){
						fn(evt);
					}, true);
				}else{
					el.attachEvent("on"+evt, function(){
						fn(evt);
					});
				}
			}
		}
	},
	trigger: function (ev, el){
		if(document.createEvent){
			evento = document.createEvent('HTMLEvents');
			evento.initEvent(ev, true, true);
			el.dispatchEvent(evento);
		}else{
			evento = document.createEventObject();
			el.fireEvent('on'+ev, evento);
		}
	},
	getById: function(element){
		return document.getElementById(element);
	},
	getName: function(element){
		return document.getElementsByName(element);
	},
	remover: function(el){
		el.parentNode.removeChild(el);
	},
	targt: function (e) {
		e = e.target ? e : window.event;
		return e.target || e.srcElement;
	},
	inArray: function(st, arr){
		var lengt = arr.length;
		var x;
		for(x = 0; x < lengt; x++){
			if(arr[x] === st){
				return true;
				break;
			}
		}
		return false;
	},
	isChild: function(parent, child) {
		if(child.parentNode){
			var node = child.parentNode;
			while(node !== null){
				if(node === parent){
					return true;
				}
				node = node.parentNode;
			}
		}
		return false;
	},
	positionAtTop: function(el){
		posicao = 0;
		if(el.offsetParent){
			do{
				posicao += el.offsetTop;
			} while (el = el.offsetParent);
		}
		return posicao;
	},
	insertAfter: function(newElement, targetElement){
		var parent = targetElement.parentNode;
		if(parent.lastchild == targetElement) {
			parent.appendChild(newElement);
		}else{
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	},
	getUri: function(){
		var lca = window.location.href.split('?');
		var getUri = {};

		if(typeof(lca[1]) !== 'undefined'){
			var parts = lca[1].split('&');
			for (var i = 0; i < parts.length; i++) {
				var temp = parts[i].split('=');
				getUri[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
			}
		}
		return getUri;
	},
	focusOut: function(parnt, chld){
		if(chld){
			var nod = chld.parentNode;
			while (nod !== null) {
				if (nod === parnt) {
					return true;
				}
				nod = nod.parentNode;
			}
			return false;
		}else{
			return false;
		}
	},
	toBytes: function(lengt){
		if(lengt < 1024){
			var siz = lengt.toFixed(1)+'B';
		}else if(lengt >= 1024 && lengt < 1048576){
			var siz = lengt / 1024;
			var siz = siz.toFixed(1)+'KB';
		}else{
			var siz = lengt / 1048576;
			var siz = siz.toFixed(1)+'MB';
		}
		return siz;
	},
	serializer: function(formid){
		if(this.getById(formid)){
			var form = this.getById(formid);
			var inputs =  form.getElementsByTagName('input');
			var selects = form.getElementsByTagName('select');
			var textareas = form.getElementsByTagName('textarea');
			ti = inputs.length;
			ts = selects.length;
			tt = textareas.length;
			serializado = {};
			for(it = 0; it < ti; it++){
				if(inputs[it].name && !inputs[it].getAttribute('disabled')){
					if(inputs[it].getAttribute('type') === 'radio' || inputs[it].getAttribute('type') === 'checkbox'){
						if(inputs[it].checked === true){
							serializado[inputs[it].getAttribute('name')] = inputs[it].value;
						}
					}else{
						serializado[inputs[it].getAttribute('name')] = inputs[it].value;
					}
				}
			}
			for(st = 0; st < ts; st++){
				if(selects[st].getAttribute('name') && !selects[st].getAttribute('disabled')){
					serializado[selects[st].getAttribute('name')] = selects[st].value;
				}
			}
			for(t = 0; t < tt; t++){
				if(textareas[t].getAttribute('name') && !textareas[t].getAttribute('disabled')){
					serializado[textareas[t].getAttribute('name')] = textareas[t].value;
				}
			}
			return serializado;
		}else{
			return false;
		}
	},
	render: function(options, data){
		if(!options.renderTo){
			console.warn('Hey stupid, set up: renderTo');
			return false;
		}
		if(!options.element){
			console.warn('Hey stupid, set up: element');
			return false;
		}
		if(!options.mask){
			console.warn('Hey stupid, set up: mask');
			return false;
		}

		var sizeData = data.length;

		if(sizeData > 0){

			var renderTo = this.getById(options.renderTo);

			for(x = 0; x < sizeData; x++){

				var mask = options.mask;
				var element = document.createElement(options.element);
				var replaceInMask = data[x].replaceInMask;

				for(r in replaceInMask){
					var regex = new RegExp('\%\%'+r+'\%\%', 'g');
					mask = mask.replace(regex, replaceInMask[r]);
				}

				var updateElement = false;

				/* IF EXISTS PARENT ATTRIBUTES */
				if(data[x].parentAttributes){
					var parentAttributes = data[x].parentAttributes;
					for(a in parentAttributes){
						
						/* ATTRIBUTE ID */
						if(parentAttributes.id){
							element.setAttribute(a, parentAttributes[a]);

							/* IF THE ELEMENT ALREADY EXISTS */
							if(this.getById(parentAttributes[a])){
								updateElement = this.getById(parentAttributes[a]);
							}
						/* OTHER ATTRIBUTES */
						}else{
							element.setAttribute(a, parentAttributes[a]);
						}
					}
				}

				/* UPDATING ELEMENT */
				if(updateElement){
					this.diff(updateElement, mask);
					/*updateElement.innerHTML = mask;*/
				/* CREATING ELEMENT */
				}else{
					element.innerHTML = mask;
					renderTo.appendChild(element);
				}
			}
		}
	},
	diff: function(oldElement, newHtml){
		var virtual = document.createElement('div');
		virtual.innerHTML = newHtml;

		var oldNodes = oldElement.childNodes;
		var sizeOldNodes = oldNodes.length;

		var newNodes = virtual.childNodes;

		for(o = 0; o < sizeOldNodes; o++){

			if(oldNodes[o].attributes){

				var oldNodesAttributes = oldNodes[o].attributes;
				var sizeOldNodesAttributes = oldNodesAttributes.length;

				if(typeof(newNodes[o]) !== 'undefined'){

					var newNodesAttributes = newNodes[o].attributes;

					if(sizeOldNodesAttributes > 0){
						for(a = 0; a < sizeOldNodes; a++){
							if(oldNodesAttributes[a]){
								var attrOld = oldNodes[o].getAttribute(oldNodesAttributes[a].name);
								var attrNew = newNodes[o].getAttribute(newNodesAttributes[a].name);

								if(attrOld !== attrNew){
									oldNodes[o].setAttribute(newNodesAttributes[a].name, newNodesAttributes[a].value);
								}
							}
						}
					}

					if(typeof(oldNodes[o].value) !== 'undefined'){
						if(oldNodes[o].value !== newNodes[o].value){
							oldNodes[o].value = newNodes[o].value;
						}
					}

					if(typeof(oldNodes[o].innerHTML) !== 'undefined'){
						if(oldNodes[o].innerHTML !== newNodes[o].innerHTML){
							oldNodes[o].innerHTML = newNodes[o].innerHTML;
						}
					}
				}
			}
		}
	},
	screensizes: function(){

		var orient;

		if(window.screen.mozOrientation){
			orient = window.screen.mozOrientation;
		}else if(window.screen.msOrientation){
			orient = window.screen.msOrientation
		}else if(window.screen.orientation){
			if(window.screen.orientation.type){
				orient = window.screen.orientation.type;
			}else{
				orient = window.screen.orientation;
			}
		}else{
			if(window.screen.height > window.screen.width){
				orient = 'portrait-primary';
			}else{
				orient = 'landscape-primary';
			}
		}

		return {
			'viewWidth': window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			'viewHeight': window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
			'pageWidth': document.body.clientWidth || document.body.offsetWidth,
			'pageHeight': document.body.clientHeight || document.body.offsetHeight,
			'resolutionWidth': window.screen.width,
			'resolutionHeight': window.screen.height,
			'orientation': orient,
			'colorDepth': window.screen.colorDepth,
			'pixelDepth': window.screen.pixelDepth
		}

	},
	/* SHOW HIDE COMPONENT */
	showhide: function(element, forElement, closeOut){

		if(typeof(closeOut) === 'undefined'){
			closeOut = false;
		}

		var el = Boss.getById(element);
		var forEl = Boss.getById(forElement);

		el.setAttribute('tabindex', '0');
		el.classList.add('outline-none');
		forEl.setAttribute('tabindex', '0');
		forEl.classList.add('outline-none');

		if(el.getElementsByTagName('span')[0]){
			var sp = el.getElementsByTagName('span')[0];
			if(forEl.classList.contains('hidden')){
				sp.classList.remove('rotate-180');
			}else{
				sp.classList.add('rotate-180');
			}
		}

		Boss.evts.add(Boss.evtTouchUp(), el, function(evts){
			if(el === Boss.targt(evts)){
				if(el.getElementsByTagName('span')[0]){
					var sp = el.getElementsByTagName('span')[0];
					if(forEl.classList.contains('hidden')){
						sp.classList.add('rotate-180');
					}else{
						sp.classList.remove('rotate-180');
					}
				}
				forEl.classList.toggle('hidden');
				if(closeOut === true){
					Boss.delay(function(){
						if(!forEl.classList.contains('hidden')){
								Boss.getById(forElement).focus();
							}
					}, 50);
				}
			}
		});

		if(closeOut === true){

			/* BLUR */
			Boss.evts.add('blur', Boss.getById(forElement), function(evts){

				var el = Boss.getById(element);
				el.setAttribute('data-last-evt', 'blur');

				/* BLUR OUT WITHOUT CHILD ELEMENT */
				if(Boss.focusOut(Boss.getById(forElement), evts.relatedTarget) === false){

					/* IF THE BLUR EVENT WAS HAPPENED OUT THE forElement ELEMENT */
					if(Boss.getById(element) !== evts.relatedTarget && Boss.getById(forElement) !== evts.relatedTarget){

						var forEl = Boss.getById(forElement);
						forEl.classList.add('hidden');

						var el = Boss.getById(element);
						if(el.getElementsByTagName('span')[0]){
							var sp = el.getElementsByTagName('span')[0];
							if(forEl.classList.contains('hidden')){
								sp.classList.remove('rotate-180');
							}else{
								sp.classList.add('rotate-180');
							}
						}
					}
				}
			});
		}
	},
	ajax: function (options) {
		var XHR;
		var strPost = new Array();
		var r20 = /%20/g;

		if(window.XMLHttpRequest){
			XHR = new XMLHttpRequest();
		}else if(window.ActiveXObject){
			XHR = new ActiveXObject('Msxml2.XMLHTTP');
			if(!XHR){
				XHR = new ActiveXObject('Microsoft.XMLHTTP');
			}
		}else{
			console.warn('This Browser do not support XMLHttpRequest');
			return false;
		}

		if(options.progress){
			XHR.upload.addEventListener('progress', options.progress, false);
		}

		if(options.error){
			XHR.addEventListener('error', options.error, false);
			XHR.addEventListener('abort', options.error, false);
		}

		XHR.open('POST', options.url, true);

		/* AS DATA */
		if(options.data){

			XHR.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");

			for(x in options.data){
				strPost.push(encodeURIComponent(x)+'='+encodeURIComponent(options.data[x]));
			}

			stPost = strPost.join('&').replace(r20, "+");
			XHR.send(stPost);

		/* AS FORM */
		}else if(options.formId){

			var form = Boss.getById(options.formId);
			var frm = new FormData();

			var inputs = form.getElementsByTagName('input');
			var tInputs = inputs.length;

			for(x = 0; x < tInputs; x++){
				if(inputs[x].getAttribute('name') && !inputs[x].getAttribute('disabled')){

					/* INPUT FILE */
					if(inputs[x].type === 'file'){
						
						var tFiles = inputs[x].files.length;

						if(tFiles > 0){
							for(z = 0; z < tFiles; z++){
								var fle = inputs[x].files[z];
								frm.append(inputs[x].getAttribute('name'), fle);
							}
						}

					/* RADIO AND CHECKBOX */
					}else if(inputs[x].type === 'radio' || inputs[x].type === 'checkbox'){
						if(inputs[x].checked === true){
							frm.append(inputs[x].getAttribute('name'), inputs[x].value);
						}
					/* OTHERS INPUTS FIELDS */
					}else{
						frm.append(inputs[x].getAttribute('name'), inputs[x].value);
					}
				}
			}

			var textareas = form.getElementsByTagName('textarea');
			var tTextareas = textareas.length;

			for(x = 0; x < tTextareas; x++){
				if(textareas[x].getAttribute('name') && !textareas[x].getAttribute('disabled')){
					frm.append(textareas[x].getAttribute('name'), textareas[x].value);
				}
			}

			var selects = form.getElementsByTagName('select');
			var tSelects = selects.length;

			for(x = 0; x < tSelects; x++){
				if(selects[x].getAttribute('name') && !selects[x].getAttribute('disabled')){
					frm.append(selects[x].getAttribute('name'), selects[x].value);
				}
			}

			XHR.send(frm);

		}

		XHR.onreadystatechange = function(){

			if(XHR.readyState === 4 && (XHR.status === 200 || XHR.status === 304)){
				if(typeof(options.dataType) !== 'undefined'){

					if(options.dataType === 'JSON' || options.dataType === 'json'){
						jsonStr = XHR.responseText;
						if(JSON.parse(XHR.responseText)){
							jsonStr = eval("("+XHR.responseText+")");
						}
						if(typeof(options.done) === 'function'){
							options.done(jsonStr);
						}
					}

				}else{
					if (typeof(options.done) === 'function'){
						options.done(XHR.responseText);
					}
				}
			}

			if(XHR.readyState === 4 && XHR.status === 404){
				if(typeof(options.error) === 'function'){
					options.error(XHR);
				}
			}

			if(XHR.readyState === 4 && XHR.status === 500){
				if(typeof(options.error) === 'function'){
					options.error(XHR);
				}
			}
		}

		return XHR;
	},
	get: function(url, fn){

		var XHR = new XMLHttpRequest();

		XHR.onreadystatechange = function(){
			if (XHR.readyState == 4 && (XHR.status == 200 || XHR.status == 400 || XHR.status === 304)){

				jsonStr = XHR.responseText;
				if(JSON.parse(XHR.responseText)){
					jsonStr = eval("("+XHR.responseText+")");
				}
				if(typeof(fn) === 'function'){
					fn(jsonStr);
				}
			}
		};

		XHR.open("GET", url, true);
		XHR.send();

	},
	pushstate: {
		init: function(configObj){

			history.scrollRestoration = 'manual';

			var xhrfn = function(){};
			var lockChangePageFn = function(){};
			var lockExitMessage = '';

			if(typeof(configObj.xhrfn) === 'function'){
				xhrfn = configObj.xhrfn;
			}

			if(typeof(configObj.lockChangePageFn) === 'function'){
				lockChangePageFn = configObj.lockChangePageFn;
			}

			if(configObj.lockExitMessage){
				lockExitMessage = configObj.lockExitMessage;
			}

			/* POPSTATE EVENT */
			Boss.evts.add('popstate', window, function(evts){

				if(lockChangePage === true){
					lockChangePageFn(window.location.href);
					return false;
				}

				var host = window.location.protocol+'//'+window.location.host;
				var controler = window.location.href.replace(host, '')+'!popstate';
				xhrfn(controler, function(){});

			});

			/* CLICK EVENTS */
			Boss.evts.add('click', document, function(evts){

				var elemt = Boss.targt(evts);

				var expJs = new RegExp('javascript:', 'i');
				var expFTP = new RegExp('ftp:', 'i');
				var expMail = new RegExp('mailto:', 'i');
				var expWhatsapp = new RegExp('whatsapp:', 'i');

				var domain = window.location.hostname;

				if(elemt.nodeName === 'BUTTON' && elemt.getAttribute('data-href') && elemt.getAttribute('data-href') !== false){

					var hrefDomain = elemt.getAttribute('data-href').replace('http://', '');
					hrefDomain = hrefDomain.replace('https://', '');

					var re = new RegExp('^\/', 'i'); 

					if(re.test(hrefDomain) === true){
						hrefDomain = domain+hrefDomain;
					}

					var urlIn = new RegExp('^'+domain, 'i');

					if(urlIn.test(hrefDomain) === true){
						Boss.pushstate.goXHR(elemt.getAttribute('data-href'), xhrfn, lockChangePageFn);
					}else{
						var a = document.createElement('a');
						a.href = elemt.getAttribute('data-href');
						Boss.trigger('click', a);
					}
				}else{

					var wl = true;
					while(wl === true){

						if(elemt.parentNode !== null && elemt.nodeName !== 'A'){
							elemt = elemt.parentNode;
						}else{
							wl = false;

							if(elemt.href){

								var hrefDomain = elemt.href.replace('http://', '');
								hrefDomain = hrefDomain.replace('https://', '');

								var urlIn = new RegExp('^'+domain, 'i');

								if(urlIn.test(hrefDomain) === true && !elemt.getAttribute('data-href')){

									/* GOXHR*/
									if(expJs.test(elemt.href) === false || 
										expFTP.test(elemt.href) === false || 
										expMail.test(elemt.href) === false || 
										expWhatsapp.test(elemt.href) === false || 
										!elemt.getAttribute('data-href')){

										if(evts.stopPropagation){
											evts.stopPropagation();
										}
										if(evts.preventDefault){
											evts.preventDefault();
										}
										Boss.pushstate.goXHR(elemt.href, xhrfn, lockChangePageFn);
									}

								}
							}
						}
					}
				}
			});

			/* beforeunload EVENT  */
			Boss.evts.add('beforeunload', window, function(evts){
				if(lockClosePage === true){

					evts.cancelBubble = true;

					evts.returnValue = lockExitMessage;

					if(evts.stopPropagation){
						evts.stopPropagation();
					}

					if(evts.preventDefault){
						evts.preventDefault();
					}

					return lockExitMessage;
				}
			});
		},
		goXHR: function(controler, xhrfn, lockChangePageFn){

			if(lockChangePage === true){
				lockChangePageFn(controler);
				return false;
			}

			var host = window.location.protocol+'//'+window.location.host;
			var ctrlpage = window.location.href.replace(host, '');
			XHRPopStateScroll[ctrlpage] = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

			xhrfn(controler, function(){
				history.pushState({atual: controler}, '', controler);
			});

		}
	},
	confirm: function(obj){
		if(obj.message && obj.ok){
			
			var mask = '<div class="boss-confirm"><p class="text-center strong">'+obj.message+'</p><p class="text-center"><button id="boss-confirm-ok" class="btn btn-green-invs">'+obj.ok+'</button></p></div>';

			if(obj.no !== false){
				var mask = '<div class="boss-confirm"><p class="text-center strong">'+obj.message+'</p><p class="text-center"><button id="boss-confirm-ok" class="btn btn-green-invs">'+obj.ok+'</button> <button id="boss-confirm-no" class="btn btn-red">'+obj.no+'</button></p></div>';
			}

			if(Boss.getById('boss-confirm')){
				var div = Boss.getById('boss-confirm');
				div.innerHTML = mask;
			}else{
				var div = document.createElement('div');
				div.setAttribute('id', 'boss-confirm');
				div.innerHTML = mask;
				document.body.appendChild(div);
			}

			div.classList.remove('hidden');

			Boss.evts.add(Boss.evtTouchUp(), div, function(evts){
				if(div === Boss.targt(evts)){
					div.classList.add('hidden');

					if(obj.okFunction){
						obj.okFunction();
					}
				}
			});
			
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('boss-confirm-ok'), function(evts){
				div.classList.add('hidden');

				if(obj.okFunction){
					obj.okFunction();
				}
			});

			if(obj.noFunction){
				Boss.evts.add(Boss.evtTouchUp(), Boss.getById('boss-confirm-no'), function(evts){
					div.classList.add('hidden');
					obj.noFunction();
				});
			}

		}
	},
	warning: function(obj){
		if(obj.message){

			var mask = '<div class="boss-warning"><p class="text-center strong">'+obj.message+'</p></div>';

			if(Boss.getById('boss-warning')){
				var div = Boss.getById('boss-warning');
				div.innerHTML = mask;
			}else{
				var div = document.createElement('div');
				div.setAttribute('id', 'boss-warning');
				div.innerHTML = mask;
				document.body.appendChild(div);
			}

			if(obj.color){
				div.setAttribute('class', obj.color);
			}else{
				div.removeAttribute('class');
			}

			div.classList.remove('hidden');
			div.style.top = '0px';
			div.style.opacity = '1';

			Boss.delayPersistent(function(){
				div.style.top = '-80px';
				div.style.opacity = '0';
			}, 3000);

			Boss.delay(function(){
				div.style.top = '-80px';
				div.style.opacity = '0';
			}, 8000);

		}
	},
	delay: function (fn, tm) {
		window.setTimeout(function () {
			fn();
		}, tm);
	},
	delayPersistent: (function(fn, ms){
		var timer = 0;
		return function(fn, ms){
			clearTimeout(timer);
			timer = setTimeout(fn, ms);
		};
	}()),
	numberFormat: function(n){

		var spt = String(n).split('.');

		var milhar = '0';
		var centavos = '00';
		var valor = '';

		if(spt[0]){
			milhar = spt[0];
			var sptMilahr = milhar.split('');
			var tsptMilahr = sptMilahr.length;
			if(tsptMilahr > 0){
				var tres = 0;
				for(x = (tsptMilahr - 1); x >= 0; x = x-1){
					valor = sptMilahr[x]+valor;
					tres = tres + 1;
					if(tres === 3 && sptMilahr[(x-1)]){
						valor = '.'+valor;
						tres = 0;
					}
				}
			}

		}
		if(spt[1]){
			centavos = spt[1];
		}

		return valor+','+centavos;
	},
	slct: {
		data: {},
		filter: function(elem, select, arr){

			if(Boss.getById(elem) && Boss.getById(select) && Boss.getById(select).nodeName === 'SELECT'){

				var el = Boss.getById(elem);
				var sel = Boss.getById(select);
				var ul = Boss.getById('ul_'+elem+'_ul');
				ul.innerHTML = '';
				var opts = sel.getElementsByTagName('option');
				var lopts = opts.length;

				for(var x = 0; x < lopts; x++){

					if(opts[x].value !== ''){

						if(typeof(arr[opts[x].value]) !== 'undefined'){
							opts[x].removeAttribute('disabled');
						}else{
							opts[x].setAttribute('disabled', 'disabled');
						}
					}
				}

				this.render(elem, ul, opts);
			}

		},
		setValue: function(){

		},
		unsetValue: function(){
			
		},
		render: function(elem, ul, opts){

			var lopts = opts.length;
			var lb = Boss.getById('label-'+elem);

			for(var x = 0; x < lopts; x++){

				if(!opts[x].getAttribute('disabled')){
					var li = document.createElement('li');
					li.setAttribute('data-value', opts[x].getAttribute('value'));
					li.setAttribute('data-label', opts[x].textContent);

					/* IF EXISTS IMAGE */
					if(opts[x].getAttribute('data-img') !== null && opts[x].getAttribute('data-img') !== ''){

						var img = document.createElement('img');
						img.setAttribute('src', opts[x].getAttribute('data-img'));
						li.appendChild(img);

						li.setAttribute('data-img', opts[x].getAttribute('data-img'));
					}

					var tcon = document.createTextNode(opts[x].textContent);

					li.appendChild(tcon);

					ul.appendChild(li);

					if(opts[x].getAttribute('selected') !== null){

						/* IF EXISTS IMAGE */
						if(opts[x].getAttribute('data-img') !== null && opts[x].getAttribute('data-img') !== ''){
							lb.innerHTML = '<img src="'+opts[x].getAttribute('data-img')+'" alt="'+opts[x].textContent+'" />'+opts[x].textContent;
						}else{
							lb.textContent = opts[x].textContent;
						}

					}
				}
			}
		},
		init: function(elem, select){

			if(Boss.getById(elem) && Boss.getById(select) && Boss.getById(select).nodeName === 'SELECT'){

				var el = Boss.getById(elem);
				var sel = Boss.getById(select);

				el.setAttribute('tabindex', '0');
				el.setAttribute('data-last-evt', 'blur');
				el.setAttribute('data-open', 'close');
				sel.setAttribute('tabindex', '-1');

				var lb = document.createElement('div');
				lb.classList.add('boss-slct-label');
				lb.setAttribute('id', 'label-'+elem);

				var dv = document.createElement('div');
				dv.style.height = '0px';
				dv.style.opacity = '0';
				dv.classList.add('boss-slct-area');
				dv.setAttribute('id', 'boss-slct-area'+elem);
				dv.style.top = (el.clientHeight - 2)+'px';

				var ul = document.createElement('ul');
				ul.setAttribute('id', 'ul_'+elem+'_ul');

				var opts = sel.getElementsByTagName('option');

				if(opts[0]){

					/* IF EXISTS IMAGE */
					if(opts[0].getAttribute('data-img') !== null && opts[0].getAttribute('data-img') !== ''){

						var img = document.createElement('img');
						img.setAttribute('src', opts[0].getAttribute('data-img'));
						lb.appendChild(img);
					}

					var tcon = document.createTextNode(opts[0].textContent);

					lb.appendChild(tcon);
				}

				/* CLICK/TOUCH IN LABEL */
				Boss.evts.add(Boss.evtTouchUp(), lb, function(evt){

					var dv = Boss.getById('boss-slct-area'+elem);
					var el = Boss.getById(elem);
					var sizes = Boss.screensizes();
					var viewHeight = sizes.viewHeight;

					var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

					/* COLISÃO BOTTOM */
					if((viewHeight+scrollY) < (Boss.positionAtTop(el) + dv.clientHeight)){
					
						dv.style.top = '-'+dv.clientHeight+'px';

					/* SEM COLISÃO BOTTOM */
					}else{

						dv.style.top = (el.clientHeight - 2)+'px';

					}

					var hpx = dv.style.height.replace('px', '');

					if(hpx == '0'){
						dv.style.height = 'auto';
						dv.style.height = dv.clientHeight+'px';
						dv.style.opacity = '1';
						el.setAttribute('data-last-evt', 'focus');
						el.setAttribute('data-open', 'open');
					}else{
						dv.style.height = '0px';
						dv.style.opacity = '0';
						el.setAttribute('data-last-evt', 'blur');
						el.setAttribute('data-open', 'close');
					}

					Boss.delay(function(){
						Boss.trigger('scroll', window);
					}, 160);
				});

				/* SCROLL IN WINDOW LABEL */
				Boss.evts.add('scroll', window, function(evt){

					if(Boss.getById(elem) && Boss.getById('boss-slct-area'+elem)){

						var dv = Boss.getById('boss-slct-area'+elem);
						var el = Boss.getById(elem);
						var sizes = Boss.screensizes();
						var viewHeight = sizes.viewHeight;

						var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

						/* COLISÃO BOTTOM */
						if((viewHeight+scrollY) < (Boss.positionAtTop(el) + dv.clientHeight)){
						
							dv.style.top = '-'+dv.clientHeight+'px';

						/* SEM COLISÃO BOTTOM */
						}else{

							dv.style.top = (el.clientHeight - 2)+'px';

						}
					}
				});

				/* CLICK IN LI OPTION AND TRIGGER CHANGE IN SELECT */
				Boss.evts.add('click', el, function(evt){

					var targt = Boss.targt(evt);
					var dv = Boss.getById('boss-slct-area'+elem);

					if(targt.nodeName === 'LI'){
						if(targt.getAttribute('data-label') !== null){

							if(targt.getAttribute('data-img') !== null && targt.getAttribute('data-img') !== ''){
								lb.innerHTML = '<img src="'+targt.getAttribute('data-img')+'" alt="'+targt.getAttribute('data-label')+'" />'+targt.getAttribute('data-label');
							}else{
								lb.textContent = targt.getAttribute('data-label');
							}
						}
						if(targt.getAttribute('data-value') !== null){
							sel.value = targt.getAttribute('data-value');

							Boss.delay(function(){
								Boss.trigger('change', Boss.getById(select));
								dv.style.height = '0px';
								dv.style.opacity = '0';
							}, 160);
						}
					}
				});

				/* BLUR */
				Boss.evts.add('blur', el, function(evts){

					Boss.delay(function(){

						var elemt = Boss.getById(elem);

						/* IF THE BLUR EVENT WAS HAPPENED OUT THE COMPONENT */
						if(elemt.getAttribute('data-last-evt') == 'focus' && elemt.getAttribute('data-open') == 'open' && Boss.focusOut(elemt, evts.relatedTarget) === false){
						
							elemt.setAttribute('data-last-evt', 'blur');
							elemt.setAttribute('data-open', 'close');

							var dv = Boss.getById('boss-slct-area'+elem);
							var el = Boss.getById(elem);

							var hpx = dv.style.height.replace('px', '');

							dv.style.height = '0px';
							dv.style.opacity = '0';

						}
					}, 150);

				});

				/* FOCUS */
				Boss.evts.add('focus', el, function(evts){

					Boss.delay(function(){

						var elemt = Boss.getById(elem);

						if(elemt.getAttribute('data-last-evt') == 'blur' && elemt.getAttribute('data-open') == 'close'){

							elemt.setAttribute('data-last-evt', 'focus');
							elemt.setAttribute('data-open', 'open');

							var spn = elemt.getElementsByTagName('span')[0];

							var dv = Boss.getById('boss-slct-area'+elem);
							var el = Boss.getById(elem);

							dv.style.height = 'auto';
							dv.style.height = dv.clientHeight+'px';
							dv.style.opacity = '1';

							Boss.delay(function(){
								Boss.trigger('scroll', window);
							}, 350);
						}
					}, 150);
				});

				dv.appendChild(ul);

				el.appendChild(lb);

				el.appendChild(dv);

				/* RENDER */
				this.render(elem, ul, opts);
			}
		}
	},
	dualRange: {
		last: null,
		data: {},
		setValueStart: function(id, val){

			var value = 0;
			Boss.dualRange.sizes(id);

			var fld = Boss.getName(Boss.dualRange.data[id].name);

			var arr = Boss.dualRange.data[id].values;
			var t = Boss.dualRange.data[id].values.length;
			var x = 0;
			var y = 0;
			var p = 0;
			for(x = 0; x < t; x++){
				if(val == arr[x]){
					value = arr[x];
					p = x;
					break;
				}else if(Number(arr[x]) > Number(val)){
					y = x - 1;
					if(y < 0){
						y = 0;
					}
					value = arr[y];
					p = y;
					break;
				}
			}

			var n = Boss.dualRange.data[id].values[p];
			p = p * ((Boss.dualRange.data[id].size - Boss.dualRange.data[id].widthPin) / Boss.dualRange.data[id].values.length);
			p = p.toFixed(1);

			if(Number(n) <= Number(fld[1].value)){
				Boss.dualRange._start(id, p, n);
				return true;
			}
			return false;
	
		},
		setValueEnd: function(id, val){

			Boss.dualRange.sizes(id);

			var fld = Boss.getName(Boss.dualRange.data[id].name);

			var arr = Boss.dualRange.data[id].values;
			var t = Boss.dualRange.data[id].values.length;

			var value = t -1;
			var x = 0;
			var y = 0;
			var p = 0;
			for(x = t; x >= 0; x--){
				if(val == arr[x]){
					value = arr[x];
					p = x;
					break;
				}else if(Number(arr[x]) < Number(val)){
					value = arr[x];
					p = x;
					break;
				}
			}

			var n = Boss.dualRange.data[id].values[p];
			p = Boss.dualRange.data[id].size - Boss.dualRange.data[id].widthPin - (p * (Boss.dualRange.data[id].size - Boss.dualRange.data[id].widthPin) / Boss.dualRange.data[id].values.length);
			p = p.toFixed(1);

			if(Number(fld[0].value) <= Number(n)){
				Boss.dualRange._end(id, p, n);
				return true;
			}
			return false;
		},
		_start: function(id, p, n){

			p = Number(p);

			Boss.dualRange.sizes(id);

			if(Boss.getById(id+'-start') && !Boss.getById(id+'-start').classList.contains('boss-dualrange-moving')){
				Boss.getById(id+'-start').classList.add('boss-dualrange-moving');
			}

			var fld = Boss.getName(Boss.dualRange.data[id].name);
			var opts = Boss.dualRange.data[id].opts;

			Boss.dualRange.data[id].elStr = Boss.getById(id+'-start');

			Boss.getById(id+'-startval').textContent = fld[0].getAttribute('data-prefix')+' '+opts.startFn(Number(n));
			Boss.dualRange.data[id].xap = p;
			Boss.dualRange.data[id].elStr.style.left = p+'px';
			Boss.getById(id+'-cross').style.left = (p + Number(Boss.dualRange.data[id].elStr.clientWidth / 2))+'px';
			fld[0].value = Number(n);

		},
		_end: function(id, p, n){

			p = Number(p);

			Boss.dualRange.sizes(id);

			if(Boss.getById(id+'-end') && !Boss.getById(id+'-end').classList.contains('boss-dualrange-moving')){
				Boss.getById(id+'-end').classList.add('boss-dualrange-moving');
			}

			var fld = Boss.getName(Boss.dualRange.data[id].name);
			var opts = Boss.dualRange.data[id].opts;

			Boss.dualRange.data[id].elEnd = Boss.getById(id+'-end');

			Boss.getById(id+'-endval').textContent = fld[1].getAttribute('data-prefix')+' '+opts.endFn(Number(n));
			Boss.dualRange.data[id].xbp = p;
			Boss.dualRange.data[id].elEnd.style.right = p+'px';
			Boss.getById(id+'-cross').style.right = (p + (Boss.dualRange.data[id].elEnd.clientWidth / 2))+'px';
			fld[1].value = Number(n);

		},
		sizes: function(id){
			var viewWidth = Boss.screensizes();
			if(viewWidth.viewWidth < 1024){
				Boss.dualRange.data[id]['widthPin'] = 36;
			}else{
				Boss.dualRange.data[id]['widthPin'] = 22;
			}
			var elRange = Boss.getById(id);
			Boss.dualRange.data[id]['size'] = elRange.clientWidth;
			Boss.dualRange.data[id]['byPixel'] = (Boss.dualRange.data[id].values.length / (Boss.dualRange.data[id].size - Boss.dualRange.data[id].widthPin)).toFixed(4);
		},
		removeMovingStyle: function(id){
			if(Boss.getById(id+'-start')){
				Boss.getById(id+'-start').classList.remove('boss-dualrange-moving');
			}
			if(Boss.getById(id+'-end')){
				Boss.getById(id+'-end').classList.remove('boss-dualrange-moving');
			}
		},
		init: function(id, render, name, opts, fnChange){

			if(Boss.getById(id) && Boss.getById(render)){

				var elRange = Boss.getById(id);
				elRange.setAttribute('tabindex', '0');

				this.data[id] = {
					'render': render,
					'name': name, 
					'opts': opts,
					'values': opts.values,
					'fnChange': null,
					'elStr': null,
					'elEnd': null,
					'xa': 0,
					'xap': 0,
					'xb': 0,
					'xbp': 0,
					'min': 0,
					'max': 0,
					'size': 0,
					'byPixel': 0,
					'widthPin': 22
				};

				var fld = Boss.getName(name);

				this.data[id]['fnChange'] = fnChange;

				this.data[id]['min'] = Number(fld[0].getAttribute('data-min'));
				this.data[id]['max'] = Number(fld[1].getAttribute('data-max'));

				this.data[id].elStr = Boss.getById(id+'-start');
				this.data[id].elEnd = Boss.getById(id+'-end');

				var rend = '<span class="boss-dualrange-label boss-label-title">'+opts.label+'</span>';
				rend += '<span class="boss-dualrange-line"></span>';
				rend += '<span id="'+id+'-cross" class="boss-dualrange-cross"></span>';
				rend += '<span id="'+id+'-start" class="boss-dualrange-start"></span>';
				rend += '<span id="'+id+'-end" class="boss-dualrange-end"></span>';
				rend += '<span class="boss-dualrange-range">';
				rend += '<span id="'+id+'-startval" class="float-left">'+fld[0].getAttribute('data-prefix')+' '+opts.startFn(this.data[id].min)+'</span>';
				rend += '<span id="'+id+'-endval">'+fld[1].getAttribute('data-prefix')+' '+opts.endFn(this.data[id].max)+'</span>';
				rend += '</span>';

				Boss.getById(render).innerHTML = rend;

				Boss.dualRange.sizes(id);

				function initStart(evt){

					Boss.dualRange.data[id].elStr = Boss.getById(id+'-start');
					Boss.dualRange.last = Boss.targt(evt);
					Boss.getById(id+'-start').style.zIndex = '3';
					Boss.getById(id+'-end').style.zIndex = '2';
					Boss.dualRange.data[id].xa = (evt.pageX || evt.targetTouches[0].pageX) - Boss.dualRange.data[id].xap;

					Boss.dualRange.sizes(id);

				}

				function initEnd(evt){

					Boss.dualRange.data[id].elEnd = Boss.getById(id+'-end');
					Boss.dualRange.last = Boss.targt(evt);
					Boss.getById(id+'-end').style.zIndex = '3';
					Boss.getById(id+'-start').style.zIndex = '2';
					Boss.dualRange.data[id].xb = (evt.pageX || evt.targetTouches[0].pageX) + Boss.dualRange.data[id].xbp;

					Boss.dualRange.sizes(id);

				}

				function moveStart(evt){
					if(Boss.dualRange.last !== null && Boss.dualRange.last === Boss.dualRange.data[id].elStr){

						var p = (evt.pageX || evt.targetTouches[0].pageX) - Boss.dualRange.data[id].xa;
						var par = Boss.dualRange.data[id].size - Boss.dualRange.data[id].elStr.clientWidth;

						if(p < 0){
							p = 0;
						}
						if(p > par){
							p = par;
						}

						var n = (p * Boss.dualRange.data[id].byPixel).toFixed(0);
						n = Boss.dualRange.data[id].values[n];

						if(Number(n) <= Number(fld[1].value)){
							Boss.dualRange._start(id, p, n);
						}
					}
				}

				function moveEnd(evt){
					if(Boss.dualRange.last !== null && Boss.dualRange.last === Boss.dualRange.data[id].elEnd){

						var p = Boss.dualRange.data[id].xb - (evt.pageX || evt.targetTouches[0].pageX);
						var par = Boss.dualRange.data[id].size - Boss.dualRange.data[id].elEnd.clientWidth;

						if(p < 0){
							p = 0;
						}
						if(p > par){
							p = par;
						}

						var n = Boss.dualRange.data[id].values.length - (p * Boss.dualRange.data[id].byPixel).toFixed(0);
						n = Boss.dualRange.data[id].values[n];

						if(Number(fld[0].value) <= Number(n)){
							Boss.dualRange._end(id, p, n);
						}
					}
				}

				function endMove(){
					if(Boss.dualRange.last !== null){
						id = Boss.dualRange.last.parentElement.parentElement.getAttribute('id');
						Boss.dualRange.data[id].fnChange();
						Boss.dualRange.removeMovingStyle(id);
						Boss.dualRange.last = null;
					}
				}

				Boss.evts.add('mousedown', Boss.getById(id+'-start'), function(evt){
					initStart(evt);
					Boss.evts.add('mousemove', document, function(evt){
						Boss.delayPersistent(function(){
							moveStart(evt);
						}, 2);
					});
					Boss.evts.add('mouseup', document, function(evt){
						endMove();
					});
				});

				Boss.evts.add('touchstart', Boss.getById(id+'-start'), function(evt){
					initStart(evt);
					Boss.evts.add('touchmove', document, function(evt){
						Boss.delayPersistent(function(){
							moveStart(evt);
						}, 2);
					});
					Boss.evts.add('touchend', document, function(evt){
						endMove();
					});
				});

				Boss.evts.add('mousedown', Boss.getById(id+'-end'), function(evt){
					initEnd(evt);
					Boss.evts.add('mousemove', document, function(evt){
						Boss.delayPersistent(function(){
							moveEnd(evt);
						}, 2);
					});
					Boss.evts.add('mouseup', document, function(evt){
						endMove();
					});
				});

				Boss.evts.add('touchstart', Boss.getById(id+'-end'), function(evt){
					initEnd(evt);
					Boss.evts.add('touchmove', document, function(evt){
						Boss.delayPersistent(function(){
							moveEnd(evt);
						}, 2);
					});
					Boss.evts.add('touchend', document, function(evt){
						endMove();
					});
				});
			}
		}
	},
	clickNumber: {
		data: {},
		render: function(comp){

			var el = Boss.getById(comp);
			var impt = Boss.getById('input-'+comp);
			var list = Boss.getById('ul-'+comp);
			var lis = list.getElementsByTagName('li');
			var tlis = lis.length;
			var p = (100 / tlis).toFixed(4);

			for(var x = 0; x < tlis; x++){
				lis[x].style.width = p+'%';

				if(impt.value == lis[x].getAttribute('data-value')){
					lis[x].classList.add('boss-clicknumber-active');
				}else{
					lis[x].classList.remove('boss-clicknumber-active');
				}
			}

		},
		init: function(comp, fnChange){

			if(Boss.getById(comp)){

				this.data[comp] = {
					'comp': comp
				};

				var el = Boss.getById(comp);

				this.render(comp);

				Boss.evts.add('click', el, function(evt){
					var targt = Boss.targt(evt);
					if(targt.getAttribute('data-value') !== null){
						var impt = Boss.getById('input-'+comp);
						impt.value = targt.getAttribute('data-value');
						Boss.clickNumber.render(comp);
						fnChange();
					}
				});
			}
		}
	},
	selectMultiple: {
		data: {},
		setValue: function(elemtString, selctString, val){

			var elemt = Boss.getById(elemtString);
			var selct = Boss.getById(selctString);

			var ul = Boss.getById('list-'+elemtString).getElementsByTagName('ul')[0];
			var lines = selct.getElementsByTagName('option');
			var tlines = lines.length;

			var checkeds = 0;

			for(x = 0; x < tlines; x++){
				if(lines[x].value === val){
					lines[x].selected = true;
					Boss.getById('id-'+elemtString+'-'+x).checked = true;
				}

				if(lines[x].value !== '' && lines[x].selected === true){
					checkeds = checkeds + 1;
				}
			}

			if(checkeds < 1){

				for(x = 0; x < tlines; x++){

					if(lines[x].value === ''){
						lines[x].selected = true;
						Boss.getById('id-'+elemtString+'-').checked = true;
					}
				}

			}else{

				for(x = 0; x < tlines; x++){
					if(lines[x].value === ''){
						lines[x].selected = false;
						Boss.getById('id-'+elemtString+'-').checked = false;
					}
				}
			}
		},
		unsetValue: function(elemtString, selctString, val){

			var elemt = Boss.getById(elemtString);
			var selct = Boss.getById(selctString);

			var ul = Boss.getById('list-'+elemtString).getElementsByTagName('ul')[0];
			var lines = selct.getElementsByTagName('option');
			var tlines = lines.length;

			var checkeds = 0;

			for(x = 0; x < tlines; x++){
				if(lines[x].value === val){
					lines[x].selected = false;
					Boss.getById('id-'+elemtString+'-'+x).checked = false;
				}

				if(lines[x].value !== '' && lines[x].selected === true){
					checkeds = checkeds + 1;
				}
			}

			if(checkeds < 1){

				for(x = 0; x < tlines; x++){

					if(lines[x].value === ''){
						lines[x].selected = true;
						Boss.getById('id-'+elemtString+'-').checked = true;
					}
				}

			}else{

				for(x = 0; x < tlines; x++){
					if(lines[x].value === ''){
						lines[x].selected = false;
						Boss.getById('id-'+elemtString+'-').checked = false;
					}
				}
			}

		},
		init: function(elemtString, selctString, confObj){

			var initShow = false;
			var all = 'all';
			var add = 'add';
			var addXHR = false;
			var clear = 'clear';
			var ok = 'ok';
			var placeholder = 'search';

			if(typeof(elemtString) !== 'string'){
				console.warn('Hey stupid, the first parameter need be a string.');
				return false;
			}

			if(typeof(confObj) !== 'object'){
				console.warn('Hey stupid, the thirty parameter need be a object.');
				return false;
			}

			var elemt = Boss.getById(elemtString);

			if(typeof(selctString) !== 'string'){
				console.warn('Hey stupid, the second parameter need be a string.');
				return false;
			}

			var selct = Boss.getById(selctString);
			selct.setAttribute('tabindex', '-1');
			if(selct.nodeName !== 'SELECT' && selct.nodeName !== 'select'){
				console.warn('Hey stupid, the second parameter need be a select field.');
				return false;
			}

			/* FIX TABINDEX IN THE COMPONENT */
			elemt.setAttribute('tabindex', '0');

			/* CALL CHANGE */
			if(confObj.callChange){

				Boss.evts.add('change', elemt, function(evts){
					var targt = Boss.targt(evts);
					if(targt === elemt){
						confObj.callChange(evts);
					}
				});
			}

			if(confObj.initShow){
				initShow = confObj.initShow;
			}
			if(confObj.all){
				all = confObj.all;
			}

			if(confObj.addXHR){
				addXHR = true;
			}

			if(confObj.clear){
				clear = confObj.clear;
			}
			if(confObj.ok){
				ok = confObj.ok;
			}
			if(confObj.placeholder){
				placeholder = confObj.placeholder;
			}

			/* RENDER HTML OF COMPONENT */
			var mask = '<div id="showhide-'+elemtString+'" class="boss-js-select-label no-select"><div>'+confObj.label+' <span class="boss-showhide-triangle animation"></span></div></div>';

			if(initShow === true){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-select-label-show">';
			}
			if(initShow === false){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-select-label-show hidden">';
			}

			/* MASK OF THIS CONPONENT */
			mask += '	<div class="boss-js-select-search"><div><input tabindex="-1" class="boss-js-select-search-input" id="search-'+elemtString+'" type="text" placeholder="'+placeholder+'" /><span class="hidden" id="search-clear-'+elemtString+'">+</span></div></div>';
			mask += '	<div class="boss-js-select-check-all no-select">';
			mask += '		<input type="checkbox" tabindex="-1" class="boss-comp-checkbox" id="all-'+elemtString+'"><label for="all-'+elemtString+'"><span class="boss-comp-checkbox-span"></span>'+all+'</label>';
			mask += '		<div id="ok-'+elemtString+'" class="button">'+ok+'</div>';
			mask += '		<div id="clear-'+elemtString+'" class="button">'+clear+'</div>';
			if(addXHR !== false){
				mask += '		<div id="add-'+elemtString+'" class="hidden button">'+add+'</div>';
			}
			mask += '	</div>';
			mask += '	<div id="list-'+elemtString+'" class="boss-js-select-list no-select">';
			mask += '		<ul></ul>';
			mask += '	</div>';
			mask += '	<div class="boss-js-select-status" id="status-'+elemtString+'">status</div>';
			mask += '</div>';

			var tempElemt = document.createElement('div');
			tempElemt.innerHTML = mask;

			elemt.appendChild(tempElemt);

			/* RENDER LIST */
			var ul = Boss.getById('list-'+elemtString).getElementsByTagName('ul')[0];
			var lines = selct.getElementsByTagName('option');
			var tlines = lines.length;

			var tcheckd = 0;

			for(x = 0; x < tlines; x++){

				var li = document.createElement('li');
				li.setAttribute('data-value', lines[x].innerHTML);
				var id = 'id-'+elemtString+'-'+lines[x].value;
				var checkd = '';
				if(lines[x].selected){
					checkd = 'checked';
					tcheckd = tcheckd + 1;
				}
				li.innerHTML = '<input tabindex="-1" '+checkd+' type="checkbox" class="boss-comp-checkbox" value="'+lines[x].value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-checkbox-span"></span>'+lines[x].innerHTML+'</label>';
				ul.appendChild(li);

			}

			var stats = Boss.getById('status-'+elemtString);
			stats.textContent = (tlines - 1)+' linhas, '+tcheckd+' marcados';

			/* CLEAR SEARCH */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('search-clear-'+elemtString), function(evnt){
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));
			});

			/* SEARCH EVENTs */
			Boss.evts.add('keyup', Boss.getById('search-'+elemtString), function(evnt){
				/* TIME DELAY AFTER LAST DIGIT PRESSED */
				Boss.delayPersistent(function(){

					var search = Boss.targt(evnt);
					var lis = ul.getElementsByTagName('li');
					var tlis = lis.length;
					var exp = new RegExp(search.value, 'i');

					var found = 0;

					for(x = 0; x < tlis; x++){
						if(typeof(lis[x].childNodes) !== 'undefined'){
							var tx = lis[x].getAttribute('data-value');
							if(exp.test(tx)){
								lis[x].classList.remove('hidden');
								found = found + 1;
							}else{
								lis[x].classList.add('hidden');
							}
						}
					}

					if(search.value.length > 1){
						if(addXHR !== false){
							Boss.getById('add-'+elemtString).classList.remove('hidden');
						}
						Boss.getById('search-clear-'+elemtString).classList.remove('hidden');
					}else{
						if(addXHR !== false){
							Boss.getById('add-'+elemtString).classList.add('hidden');
						}
						Boss.getById('search-clear-'+elemtString).classList.add('hidden');
					}

				}, 650);
			});

			/* CHECKBOX EVENTs */
			Boss.evts.add('change', Boss.getById(elemtString), function(evnt){

				Boss.delay(function(){

					var all = Boss.getById('all-'+elemtString);
					var checkboxs = ul.getElementsByTagName('input');
					var lengt = checkboxs.length;
					var checkeds = 0;
					var selct = Boss.getById(selctString);
					
					for(x = 0; x < lengt; x++){
						/* IGNORE THE FIRST */
						if(x > 0){
							if(checkboxs[x].checked === true){
								checkeds = checkeds + 1;
							}
						}
						if(checkboxs[x].checked === true){
							selct.options[x].selected = true;
						}else{
							selct.options[x].selected = false;
						}
					}

					var stats = Boss.getById('status-'+elemtString);
					stats.textContent = lengt+' linhas, '+checkeds+' marcados';

					if((lengt - 1) <= checkeds){
						all.checked = true;
					}else{
						all.checked = false;
						/* FORCE THE VALUE="" ELEMENT KEEP CHECKED */
					}

					if(checkeds < 1){
						checkboxs[0].checked = true;
					}else{
						checkboxs[0].checked = false;
					}

				}, 10);

			});

			/* ALL BUTTON */
			Boss.evts.add('change', Boss.getById('all-'+elemtString), function(evnt){

				var all = Boss.targt(evnt);

				var checkboxs = ul.getElementsByTagName('input');
				var tcheckboxs = checkboxs.length;
				var selct = Boss.getById(selctString);

				for(x = 0; x < tcheckboxs; x++){
					if(typeof(checkboxs[x].childNodes) !== 'undefined'){

						if(all.checked === true){
							if(selct.options[x].value == ''){
								checkboxs[x].checked = false;
								selct.options[x].selected = false;
							}else{
								checkboxs[x].checked = true;
								selct.options[x].selected = true;
							}
						}else{
							if(selct.options[x].value == ''){
								checkboxs[x].checked = true;
								selct.options[x].selected = true;
							}else{
								checkboxs[x].checked = false;
								selct.options[x].selected = false;
							}
						}
					}
				}
			});

			/* CLEAR BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('clear-'+elemtString), function(evnt){

				var checkboxs = ul.getElementsByTagName('input');
				var tcheckboxs = checkboxs.length;
				var selct = Boss.getById(selctString);

				var all = Boss.getById('all-'+elemtString);
				all.checked = false;

				for(x = 0; x < tcheckboxs; x++){
					if(typeof(checkboxs[x].childNodes) !== 'undefined'){

						if(checkboxs[x].value == ''){
							checkboxs[x].checked = true;
							selct.options[x].selected = true;
						}else{
							checkboxs[x].checked = false;
							selct.options[x].selected = false;
						}
					}
				}
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));
			});

			/* ADD BUTTON */
			if(addXHR !== false){
				if(confObj.addXHR){
					Boss.evts.add(Boss.evtTouchUp(), Boss.getById('add-'+elemtString), function(evnt){
						
						Boss.getById('add-'+elemtString).classList.add('hidden');
						Boss.ajax({
							url: confObj.addXHR.url,
							data: {'value': Boss.getById('search-'+elemtString).value, 'name': elemtString},
							dataType: 'json',
							done: function(a){
								if(a.stats === true){

									var li = document.createElement('li');
									li.setAttribute('data-value', a.label);
									var id = 'id-'+elemtString+'-'+a.value;

									li.innerHTML = '<input tabindex="-1" checked type="checkbox" class="boss-comp-checkbox" value="'+a.value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-checkbox-span"></span>'+a.label+'</label>';
									ul.appendChild(li);

									var opt = document.createElement('option');
									opt.value = a.value;
									opt.setAttribute('selected', 'selected');
									opt.innerHTML = a.label;

									selct.appendChild(opt);

									Boss.getById('search-'+elemtString).value = '';

									Boss.trigger('keyup', Boss.getById('search-'+elemtString));

								}
								if(a.stats === false){

									var stats = Boss.getById('status-'+elemtString);
									stats.innerHTML = '<span class="red">'+a.error+'</span>';

								}
							}
						});
					});
				}
			}

			/* OK BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('ok-'+elemtString), function(evnt){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);

				elemtShowHide.classList.add('hidden');
				spn.classList.remove('rotate-180');

				Boss.trigger('change', Boss.getById(elemtString));
				Boss.trigger('blur', Boss.getById(elemtString));
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));

			});

			/* ACTION IN CONPONENT */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('showhide-'+elemtString), function(evnt){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);
				
				/* FIX BUG AT FIRST FUCOS */
				if(elemt.getAttribute('data-last-evt') === 'focus'){
					elemt.setAttribute('data-last-evt', 'up');
				}else{
					if(elemtShowHide.classList.contains('hidden')){
						elemtShowHide.classList.remove('hidden');
						spn.classList.add('rotate-180');
					}else{
						elemtShowHide.classList.add('hidden');
						spn.classList.remove('rotate-180');
					}
				}
			});

			/* BLUR */
			Boss.evts.add('blur', elemt, function(evts){

				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'blur');
				var spn = elemt.getElementsByTagName('span')[0];


				/* IF THE BLUR EVENT WAS HAPPENED OUT THE COMPONENT */
				if(Boss.focusOut(elemt, evts.relatedTarget) === false){

					Boss.getById('target-showhide-'+elemtString).classList.add('hidden');
					spn.classList.remove('rotate-180');
				}

			});

			/* FOCUS */
			Boss.evts.add('focus', elemt, function(evts){

				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'focus');

				var spn = elemt.getElementsByTagName('span')[0];

				Boss.getById('target-showhide-'+elemtString).classList.remove('hidden');
				spn.classList.add('rotate-180');

			});
		}
	},
	selectUnique: {
		data: {},
		setValue: function(elemtString, selctString, val){

			var elemt = Boss.getById(elemtString);
			var rads = Boss.getName(elemtString);
			var labl = Boss.getById('label-'+elemtString);

			var selct = Boss.getById(selctString);
			var tlines = selct.options.length;

			for(x = 0; x < tlines; x++){
				if(selct.options[x].value == val){
					selct.options[x].selected = true;
					rads[x].checked = true;
					labl.textContent = selct.options[x].textContent;
				}else{
					rads[x].checked = false;
				}
			}
		},
		unsetValue: function(elemtString, selctString, val){

			var elemt = Boss.getById(elemtString);
			var selct = Boss.getById(selctString);
			var labl = Boss.getById('label-'+elemtString);

			var ul = Boss.getById('list-'+elemtString).getElementsByTagName('ul')[0];
			var lines = selct.getElementsByTagName('option');
			var tlines = lines.length;

			var checkeds = 0;

			for(x = 0; x < tlines; x++){
				if(lines[x].value === val){
					lines[x].selected = false;
					Boss.getById('id-'+elemtString+'-'+x).checked = false;
				}

				if(lines[x].value !== '' && lines[x].selected === true){
					checkeds = checkeds + 1;
				}
			}

			if(checkeds < 1){

				for(x = 0; x < tlines; x++){

					if(lines[x].value === ''){
						lines[x].selected = true;
						Boss.getById('id-'+elemtString+'-').checked = true;
					}
				}

			}else{

				for(x = 0; x < tlines; x++){
					if(lines[x].value === ''){
						lines[x].selected = false;
						Boss.getById('id-'+elemtString+'-').checked = false;
					}
				}
			}

			labl.textContent = selct.options[selct.selectedIndex].textContent;

		},
		init: function(elemtString, selctString, confObj){

			var initShow = false;
			var add = 'add';
			var addXHR = false;
			var searchXHR = false;
			var clear = 'clear';
			var ok = 'ok';
			var placeholder = 'search';

			if(typeof(elemtString) !== 'string'){
				console.warn('Hey stupid, the first parameter need be a string.');
				return false;
			}

			if(typeof(confObj) !== 'object'){
				console.warn('Hey stupid, the thirty parameter need be a object.');
				return false;
			}

			var elemt = Boss.getById(elemtString);

			if(typeof(selctString) !== 'string'){
				console.warn('Hey stupid, the second parameter need be a string.');
				return false;
			}

			var selct = Boss.getById(selctString);
			selct.setAttribute('tabindex', '-1');
			if(selct.nodeName !== 'SELECT' && selct.nodeName !== 'select'){
				console.warn('Hey stupid, the second parameter need be a select field.');
				return false;
			}

			/* FIX TABINDEX IN THE COMPONENT */
			elemt.setAttribute('tabindex', '0');

			/* CALL CHANGE */
			if(confObj.callChange){

				Boss.evts.add('change', elemt, function(evts){
					var targt = Boss.targt(evts);
					if(targt === elemt){
						confObj.callChange(evts);
					}
				});
			}
			if(confObj.initShow){
				initShow = confObj.initShow;
			}
			if(confObj.addXHR){
				addXHR = true;
			}
			if(confObj.searchXHR){
				searchXHR = true;
			}
			if(confObj.clear){
				clear = confObj.clear;
			}
			if(confObj.ok){
				ok = confObj.ok;
			}
			if(confObj.placeholder){
				placeholder = confObj.placeholder;
			}

			/* RENDER HTML OF COMPONENT */
			var mask = '<div id="showhide-'+elemtString+'" class="boss-js-select-label no-select"><div><div id="label-'+elemtString+'"></div> <span class="boss-showhide-triangle animation"></span></div></div>';

			if(initShow === true){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-select-label-show">';
			}
			if(initShow === false){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-select-label-show hidden">';
			}

			/* MASK OF THIS CONPONENT */
			mask += '	<div class="boss-js-select-search"><div><input tabindex="-1" class="boss-js-select-search-input" id="search-'+elemtString+'" type="text" placeholder="'+placeholder+'" /><span class="hidden" id="search-clear-'+elemtString+'">+</span></div></div>';
			mask += '	<div class="boss-js-select-check-all no-select">';
			mask += '		<div id="ok-'+elemtString+'" class="button">'+ok+'</div>';
			mask += '		<div id="clear-'+elemtString+'" class="button">'+clear+'</div>';
			if(addXHR !== false){
				mask += '		<div id="add-'+elemtString+'" class="hidden button">'+add+'</div>';
			}
			mask += '	</div>';
			mask += '	<div id="list-'+elemtString+'" class="boss-js-select-list no-select">';
			mask += '		<ul></ul>';
			mask += '	</div>';
			mask += '	<div class="boss-js-select-status" id="status-'+elemtString+'">status</div>';
			mask += '</div>';

			var tempElemt = document.createElement('div');
			tempElemt.innerHTML = mask;

			elemt.appendChild(tempElemt);

			/* RENDER LIST */
			var ul = Boss.getById('list-'+elemtString).getElementsByTagName('ul')[0];
			var lines = selct.getElementsByTagName('option');
			var tlines = lines.length;

			var tcheckd = 0;

			for(x = 0; x < tlines; x++){

				var li = document.createElement('li');
				li.setAttribute('data-value', lines[x].innerHTML);
				var id = 'id-'+elemtString+'-'+lines[x].value;
				var checkd = '';
				if(lines[x].selected){
					checkd = 'checked';
					tcheckd = tcheckd + 1;
				}
				li.innerHTML = '<input tabindex="-1" '+checkd+' type="radio" name="'+elemtString+'" class="boss-comp-radio" value="'+lines[x].value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span>'+lines[x].innerHTML+'</label>';
				ul.appendChild(li);

			}

			/* LABEL WRITE */
			var labl = Boss.getById('label-'+elemtString);
			labl.textContent = selct.options[selct.selectedIndex].textContent;

			var stats = Boss.getById('status-'+elemtString);
			stats.textContent = (tlines - 1)+' linhas, '+tcheckd+' marcados';

			/* CLEAR SEARCH */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('search-clear-'+elemtString), function(evnt){
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));
			});

			/* SEARCH EVENTs */
			Boss.evts.add('keyup', Boss.getById('search-'+elemtString), function(evnt){
				/* TIME DELAY AFTER LAST DIGIT PRESSED */
				Boss.delayPersistent(function(){

					var search = Boss.targt(evnt);
					var lis = ul.getElementsByTagName('li');
					var tlis = lis.length;
					var exp = new RegExp(search.value, 'i');

					
					if(searchXHR === true && search.value.length > 2){
						Boss.ajax({
							'url': confObj.searchXHR,
							'data': {'label': search.value},
							'dataType': 'json',
							'done': function(rtn){

								var lengt = Object.keys(rtn).length;

								var saveLabel = '';
								var saveValue = '';
								/* SAVE SELECTED */
								if(selct.value !== ''){
									saveLabel = selct.options[selct.selectedIndex].textContent;
									saveValue = selct.value;
								}

								/* REMOVE OPTIONS AND LIs */
								ul.innerHTML = '<li data-value=" - - "><input tabindex="-1" type="radio" name="'+elemtString+'" class="boss-comp-radio" value="" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span> - - </label></li>';
								selct.innerHTML = '<option value=""> - - </option>';
								
								/* INSERT SAVED SELECTED */
								if(saveLabel.value !== '' && saveValue !== ''){

									var li = document.createElement('li');
									li.setAttribute('data-value', saveLabel);
									var id = 'id-'+elemtString+'-'+saveValue;

									li.innerHTML = '<input checked tabindex="-1" type="radio" name="'+elemtString+'" class="boss-comp-radio" value="'+saveValue+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span>'+saveLabel+'</label>';
									ul.appendChild(li);

									var opt = document.createElement('option');
									opt.value = saveValue;
									opt.setAttribute('selected', 'selected');
									opt.innerHTML = saveLabel;

									selct.appendChild(opt);
								}

								/* SAVE found */
								for(x = 0; x < lengt; x++){

									if(saveValue != rtn[x].value){

										var li = document.createElement('li');
										li.setAttribute('data-value', rtn[x].label);
										var id = 'id-'+elemtString+'-'+rtn[x].value;

										li.innerHTML = '<input tabindex="-1" type="radio" name="'+elemtString+'" class="boss-comp-radio" value="'+rtn[x].value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span>'+rtn[x].label+'</label>';
										ul.appendChild(li);

										var opt = document.createElement('option');
										opt.value = rtn[x].value;
										opt.innerHTML = rtn[x].label;

										selct.appendChild(opt);

									}
								}
							}
						});
					}else{
						var found = 0;
						for(x = 0; x < tlis; x++){
							if(typeof(lis[x].childNodes) !== 'undefined'){
								var tx = lis[x].getAttribute('data-value');
								if(exp.test(tx)){
									lis[x].classList.remove('hidden');
									found = found + 1;
								}else{
									lis[x].classList.add('hidden');
								}
							}
						}

						if(search.value.length > 1){
							if(addXHR !== false){
								Boss.getById('add-'+elemtString).classList.remove('hidden');
							}
							Boss.getById('search-clear-'+elemtString).classList.remove('hidden');
						}else{
							if(addXHR !== false){
								Boss.getById('add-'+elemtString).classList.add('hidden');
							}
							Boss.getById('search-clear-'+elemtString).classList.add('hidden');
						}
					}

				}, 650);
			});

			/* CHECKBOX EVENTs */
			Boss.evts.add('change', Boss.getById(elemtString), function(evnt){

				Boss.delay(function(){

					var checkboxs = ul.getElementsByTagName('input');
					var lengt = checkboxs.length;
					var checkeds = 0;
					var selct = Boss.getById(selctString);
					var labl = Boss.getById('label-'+elemtString);
					
					for(x = 0; x < lengt; x++){
						/* IGNORE THE FIRST */
						if(x > 0){
							if(checkboxs[x].checked === true){
								checkeds = checkeds + 1;
							}
						}
						if(checkboxs[x].checked === true){
							selct.options[x].selected = true;
						}else{
							selct.options[x].selected = false;
						}
					}

					var stats = Boss.getById('status-'+elemtString);
					stats.textContent = lengt+' linhas, '+checkeds+' marcados';

					if(checkeds < 1){
						checkboxs[0].checked = true;
					}else{
						checkboxs[0].checked = false;
					}

					labl.textContent = selct.options[selct.selectedIndex].textContent;

				}, 10);

			});

			/* CLEAR BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('clear-'+elemtString), function(evnt){

				var checkboxs = ul.getElementsByTagName('input');
				var tcheckboxs = checkboxs.length;
				var selct = Boss.getById(selctString);
				var labl = Boss.getById('label-'+elemtString);

				for(x = 0; x < tcheckboxs; x++){
					if(typeof(checkboxs[x].childNodes) !== 'undefined'){

						if(checkboxs[x].value == ''){
							checkboxs[x].checked = true;
							selct.options[x].selected = true;
						}else{
							checkboxs[x].checked = false;
							selct.options[x].selected = false;
						}
					}
				}
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));
			
				labl.textContent = selct.options[selct.selectedIndex].textContent;
			});

			/* ADD BUTTON */
			if(addXHR !== false){
				if(confObj.addXHR){
					Boss.evts.add(Boss.evtTouchUp(), Boss.getById('add-'+elemtString), function(evnt){
						
						Boss.getById('add-'+elemtString).classList.add('hidden');
						Boss.ajax({
							url: confObj.addXHR.url,
							data: {'value': Boss.getById('search-'+elemtString).value, 'name': elemtString},
							dataType: 'json',
							done: function(a){
								if(a.stats === true){

									var li = document.createElement('li');
									li.setAttribute('data-value', a.label);
									var id = 'id-'+elemtString+'-'+a.value;

									li.innerHTML = '<input checked tabindex="-1" type="radio" name="'+elemtString+'" class="boss-comp-radio" value="'+a.value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span>'+a.label+'</label>';
									ul.appendChild(li);

									var opt = document.createElement('option');
									opt.value = a.value;
									opt.setAttribute('selected', 'selected');
									opt.innerHTML = a.label;

									selct.appendChild(opt);

									Boss.getById('search-'+elemtString).value = '';

									Boss.trigger('keyup', Boss.getById('search-'+elemtString));

								}
								if(a.stats === false){

									var stats = Boss.getById('status-'+elemtString);
									stats.innerHTML = '<span class="red">'+a.error+'</span>';

								}
							}
						});
					});
				}
			}

			/* OK BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('ok-'+elemtString), function(evnt){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);
				var labl = Boss.getById('label-'+elemtString);

				elemtShowHide.classList.add('hidden');
				spn.classList.remove('rotate-180');

				Boss.trigger('change', Boss.getById(elemtString));
				Boss.trigger('change', Boss.getById(selctString));
				Boss.trigger('blur', Boss.getById(elemtString));
				Boss.getById('search-'+elemtString).value = '';
				Boss.trigger('keyup', Boss.getById('search-'+elemtString));
			
				labl.textContent = selct.options[selct.selectedIndex].textContent;

			});

			/* ACTION IN CONPONENT */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('showhide-'+elemtString), function(evnt){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);
				
				/* FIX BUG AT FIRST FUCOS */
				if(elemt.getAttribute('data-last-evt') === 'focus'){
					elemt.setAttribute('data-last-evt', 'up');
				}else{
					if(elemtShowHide.classList.contains('hidden')){
						elemtShowHide.classList.remove('hidden');
						spn.classList.add('rotate-180');
					}else{
						elemtShowHide.classList.add('hidden');
						spn.classList.remove('rotate-180');
					}
				}
			});

			/* BLUR */
			Boss.evts.add('blur', elemt, function(evts){

				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'blur');
				var spn = elemt.getElementsByTagName('span')[0];


				/* IF THE BLUR EVENT WAS HAPPENED OUT THE COMPONENT */
				if(Boss.focusOut(elemt, evts.relatedTarget) === false){

					Boss.getById('target-showhide-'+elemtString).classList.add('hidden');
					spn.classList.remove('rotate-180');
				}

			});

			/* FOCUS */
			Boss.evts.add('focus', elemt, function(evts){

				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'focus');

				var spn = elemt.getElementsByTagName('span')[0];

				Boss.getById('target-showhide-'+elemtString).classList.remove('hidden');
				spn.classList.add('rotate-180');

			});
		}
	},
	compDate: {
		weekDays: Array('Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'),
		setData: function(elemtString, inputString, val){

			if(typeof(elemtString) !== 'string'){
				console.warn('Hey stupid, the first parameter need be a string.');
				return false;
			}

			var elemt = Boss.getById(elemtString);

			if(typeof(inputString) !== 'string'){
				console.warn('Hey stupid, the second parameter need be a string.');
				return false;
			}

			var inpt = Boss.getById(inputString);
			inpt.setAttribute('tabindex', '-1');
			if(inpt.nodeName !== 'INPUT' && inpt.nodeName !== 'input'){
				console.warn('Hey stupid, the second parameter need be a input field.');
				return false;
			}

			var monthDays = Array('31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31');

			var labl 	= Boss.getById('label-'+elemtString);
			var year 	= Boss.getById('year-'+elemtString);
			var month 	= Boss.getById('month-'+elemtString);
			var day 	= Boss.getById('day-'+elemtString);

			if(val.length === 8){

				var yyyy = val.substr(0,4);
				var mm = val.substr(4,2);
				var dd = val.substr(6,2);

				/* LEAP YEAR */
				if(yyyy % 4 === 0 && (yyyy % 100 !== 0 || yyyy % 400 === 0)){
					monthDays[1] = '29';
				}

				/* VERIFY LAST DAY OF MONTH */
				if(dd > monthDays[(mm-1)]){
					dd = monthDays[(mm-1)];
				}
			
				var wk = new Date(yyyy, (mm - 1), dd);

				year.value = yyyy;
				month.value = mm;
				day.value =  dd;

				inpt.value = ''+yyyy+mm+dd;
				labl.textContent = Boss.compDate.weekDays[wk.getDay()]+' - '+dd+'/'+mm+'/'+yyyy;

			}else{
				year.value = '';
				month.value = '';
				day.value = '';

				inpt.value = '';
				labl.textContent = '_ /_ /_';
			}
		},
		init: function(elemtString, inputString, confObj){

			var initShow = false;
			var today = 'today';
			var clear = 'clear';
			var ok = 'ok';

			var ny = new Date();

			var minYear = ny.getFullYear();
			var maxYear = ny.getFullYear();

			if(confObj.years){
				if(confObj.years.min){
					minYear = confObj.years.min;
				}
				if(confObj.years.max){
					maxYear = confObj.years.max;
				}
			}

			if(typeof(elemtString) !== 'string'){
				console.warn('Hey stupid, the first parameter need be a string.');
				return false;
			}

			if(typeof(confObj) !== 'object'){
				console.warn('Hey stupid, the thirty parameter need be a object.');
				return false;
			}

			var elemt = Boss.getById(elemtString);

			/* FIX TABINDEX IN THE COMPONENT */
			elemt.setAttribute('tabindex', '0');

			if(typeof(inputString) !== 'string'){
				console.warn('Hey stupid, the second parameter need be a string.');
				return false;
			}

			var inpt = Boss.getById(inputString);
			inpt.setAttribute('tabindex', '-1');
			if(inpt.nodeName !== 'INPUT' && inpt.nodeName !== 'input'){
				console.warn('Hey stupid, the second parameter need be a input field.');
				return false;
			}

			if(confObj.initShow){
				initShow = confObj.initShow;
			}
			if(confObj.ok){
				ok = confObj.ok;
			}

			/* RENDER HTML OF COMPONENT */
			var mask = '<div id="showhide-'+elemtString+'" class="boss-js-date-label no-select"><div id="label-'+elemtString+'">_ /_ /_</div><span class="boss-showhide-triangle animation"></span></div>';

			if(initShow === true){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-date-show">';
			}
			if(initShow === false){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-date-show hidden">';
			}

			var optYear = '';
			if(minYear === maxYear){
				optYear += '<option value="'+minYear+'">'+minYear+'</option>';
			}else if(maxYear > minYear){
				var lY = maxYear - minYear;
				for(x = 0; x <= lY; x++){
					optYear += '<option value="'+(minYear + x)+'">'+(minYear + x)+'</option>';
				}
			}else{
				var lY = minYear - maxYear;
				for(x = 0; x <= lY; x++){
					optYear += '<option value="'+(minYear - x)+'">'+(minYear - x)+'</option>';
				}
			}

			mask += '<p>';
			mask += '<select id="day-'+elemtString+'" class="width-30" tabindex="-1"><option value="">-</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option></select>';
			mask += '<select id="month-'+elemtString+'" class="width-30" tabindex="-1"><option value="">-</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select>';
			mask += '<select id="year-'+elemtString+'" class="width-40" tabindex="-1"><option value="">-</option>'+optYear+'</select>';
			mask += '</p>';
			mask += '<p class="text-center">';

			if(confObj.clear){
				mask += '<button type="button" id="clear-'+elemtString+'" tabindex="-1" class="btn btn-red float-left">'+confObj.clear+'</button>';
			}

			if(confObj.today){
				mask += '<button type="button" id="today-'+elemtString+'" tabindex="-1" class="btn btn-green">'+confObj.today+'</button>';
			}

			mask += '<button type="button" id="ok-'+elemtString+'" tabindex="-1" class="btn btn-blue float-right">'+confObj.ok+'</button>';
			mask += '</p>';
			mask += '</div>';

			var tempElemt = document.createElement('div');
			tempElemt.innerHTML = mask;

			elemt.appendChild(tempElemt);

			var val = inpt.value;

			if(val.length === 8){
				Boss.compDate.setData(elemtString, inputString, val);
			}

			/* CLEAR BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('clear-'+elemtString), function(evts){
				Boss.compDate.setData(elemtString, inputString, '');
			});

			/* NOW BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('today-'+elemtString), function(evts){

				var now = new Date();
				var yr = now.getFullYear();
				var mont = (now.getMonth() + 1);
				if(mont < 10){
					mont = '0'+mont;
				}
				var dy = now.getDate();
				if(dy < 10){
					dy = '0'+dy;
				}
				var val = ''+yr+mont+dy;
				Boss.compDate.setData(elemtString, inputString, val);

			});

			/* OK BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('ok-'+elemtString), function(evts){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);

				elemtShowHide.classList.add('hidden');
				spn.classList.remove('rotate-180');

				var labl = Boss.getById('label-'+elemtString);
				var year = Boss.getById('year-'+elemtString);
				var month = Boss.getById('month-'+elemtString);
				var day = Boss.getById('day-'+elemtString);

				var yyyy = year.value;
				var mm = month.value;
				var dd = day.value;

				if(yyyy.length === 4 && mm.length === 2 && dd.length === 2){
			
					var wk = new Date(yyyy, (mm - 1), dd);
					var val = ''+yyyy+mm+dd;
					Boss.compDate.setData(elemtString, inputString, val);

				}

				Boss.trigger('change', Boss.getById(elemtString));
				Boss.trigger('blur', Boss.getById(elemtString));

			});

			/* CHANGE IN COMPONENT */
			Boss.evts.add('change', Boss.getById(elemtString), function(evts){

				var year = Boss.getById('year-'+elemtString);
				var month = Boss.getById('month-'+elemtString);
				var day = Boss.getById('day-'+elemtString);

				if(Boss.targt(evts) === year || Boss.targt(evts) === month || Boss.targt(evts) === day){
					var val = ''+year.value+month.value+day.value;
					if(val.length === 8){
						Boss.compDate.setData(elemtString, inputString, val);
					}
				}

				if(confObj.callChange){
					if(typeof(confObj.callChange) === 'function'){
						if(Boss.getById(elemtString) === Boss.targt(evts)){
							confObj.callChange(evts);
						}
					}
				}
			});

			/* ACTION IN COMPONENT */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('showhide-'+elemtString), function(evts){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);
				
				/* FIX BUG AT FIRST FUCOS */
				if(elemt.getAttribute('data-last-evt') === 'focus'){
					elemt.setAttribute('data-last-evt', 'up');
				}else{
					if(elemtShowHide.classList.contains('hidden')){
						elemtShowHide.classList.remove('hidden');
						spn.classList.add('rotate-180');
					}else{
						elemtShowHide.classList.add('hidden');
						spn.classList.remove('rotate-180');
					}
				}
			});

			/* BLUR */
			Boss.evts.add('blur', elemt, function(evts){

				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'blur');
				var spn = elemt.getElementsByTagName('span')[0];

				var year = Boss.getById('year-'+elemtString);
				var month = Boss.getById('month-'+elemtString);
				var day = Boss.getById('day-'+elemtString);

				if(Boss.targt(evts) === year || Boss.targt(evts) === month || Boss.targt(evts) === day){
					if(evts.preventDefault){
						evts.preventDefault();
					}
					if(evts.stopPropagation){
						evts.stopPropagation();
					}
					return false;
				}

				/* IF THE BLUR EVENT WAS HAPPENED OUT THE COMPONENT */
				if(Boss.focusOut(elemt, evts.relatedTarget) === false){

					Boss.getById('target-showhide-'+elemtString).classList.add('hidden');
					spn.classList.remove('rotate-180');
				}

			});

			/* FOCUS */
			Boss.evts.add('focus', elemt, function(evts){
				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'focus');
				var spn = elemt.getElementsByTagName('span')[0];
				Boss.getById('target-showhide-'+elemtString).classList.remove('hidden');
				spn.classList.add('rotate-180');
			});

		}
	},
	compTime: {
		setTime: function(elemtString, inputString, val){

			if(typeof(elemtString) !== 'string'){
				console.warn('Hey stupid, the first parameter need be a string.');
				return false;
			}

			var elemt = Boss.getById(elemtString);

			if(typeof(inputString) !== 'string'){
				console.warn('Hey stupid, the second parameter need be a string.');
				return false;
			}

			var inpt = Boss.getById(inputString);
			inpt.setAttribute('tabindex', '-1');
			if(inpt.nodeName !== 'INPUT' && inpt.nodeName !== 'input'){
				console.warn('Hey stupid, the second parameter need be a input field.');
				return false;
			}

			var labl 	= Boss.getById('label-'+elemtString);

			var hour 	= Boss.getById('hour-'+elemtString);
			var minute 	= Boss.getById('minute-'+elemtString);

			if(val.length === 4){

				var hh = val.substr(0,2);
				var mm = val.substr(2,2);

				hour.value = hh;
				minute.value =  mm;

				inpt.value = hh+mm;
				labl.textContent = hh+':'+mm;

			}else{
				hour.value = '';
				minute.value = '';

				inpt.value = '';
				labl.textContent = '--:--';
			}
		},
		init: function(elemtString, inputString, confObj){

			var initShow = false;
			var now = 'now';
			var clear = 'clear';
			var ok = 'ok';

			if(typeof(elemtString) !== 'string'){
				console.warn('Hey stupid, the first parameter need be a string.');
				return false;
			}

			if(typeof(confObj) !== 'object'){
				console.warn('Hey stupid, the thirty parameter need be a object.');
				return false;
			}

			var elemt = Boss.getById(elemtString);

			/* FIX TABINDEX IN THE COMPONENT */
			elemt.setAttribute('tabindex', '0');

			if(typeof(inputString) !== 'string'){
				console.warn('Hey stupid, the second parameter need be a string.');
				return false;
			}

			var inpt = Boss.getById(inputString);
			inpt.setAttribute('tabindex', '-1');
			if(inpt.nodeName !== 'INPUT' && inpt.nodeName !== 'input'){
				console.warn('Hey stupid, the second parameter need be a input field.');
				return false;
			}

			if(confObj.initShow){
				initShow = confObj.initShow;
			}
			if(confObj.now){
				now = confObj.now;
			}
			if(confObj.clear){
				clear = confObj.clear;
			}
			if(confObj.ok){
				ok = confObj.ok;
			}

			/* RENDER HTML OF COMPONENT */
			var mask = '<div id="showhide-'+elemtString+'" class="boss-js-time-label no-select"><div id="label-'+elemtString+'">--:--</div><span class="boss-showhide-triangle animation"></span></div>';

			if(initShow === true){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-time-show">';
			}
			if(initShow === false){
				mask += '<div id="target-showhide-'+elemtString+'" class="boss-js-time-show hidden">';
			}

			mask += '<p>';
			mask += '<select id="hour-'+elemtString+'" class="width-50" tabindex="-1"><option value="">-</option><option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select>';
			mask += '<select id="minute-'+elemtString+'" class="width-50" tabindex="-1"><option value="">-</option><option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option><option value="32">32</option><option value="33">33</option><option value="34">34</option><option value="35">35</option><option value="36">36</option><option value="37">37</option><option value="38">38</option><option value="39">39</option><option value="40">40</option><option value="41">41</option><option value="42">42</option><option value="43">43</option><option value="44">44</option><option value="45">45</option><option value="46">46</option><option value="47">47</option><option value="48">48</option><option value="49">49</option><option value="50">50</option><option value="51">51</option><option value="52">52</option><option value="53">53</option><option value="54">54</option><option value="55">55</option><option value="56">56</option><option value="57">57</option><option value="58">58</option><option value="59">59</option></select>';
			mask += '</p>';
			mask += '<p class="text-center">';
			mask += '<button type="button" id="clear-'+elemtString+'" tabindex="-1" class="btn btn-red float-left">'+confObj.clear+'</button>';
			mask += '<button type="button" id="now-'+elemtString+'" tabindex="-1" class="btn btn-green">'+confObj.now+'</button>';
			mask += '<button type="button" id="ok-'+elemtString+'" tabindex="-1" class="btn btn-blue float-right">'+confObj.ok+'</button>';
			mask += '</p>';
			mask += '</div>';

			var tempElemt = document.createElement('div');
			tempElemt.innerHTML = mask;

			elemt.appendChild(tempElemt);

			var val = inpt.value;

			if(val.length === 4){
				Boss.compTime.setTime(elemtString, inputString, val);
			}

			/* CLEAR BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('clear-'+elemtString), function(evts){
				Boss.compTime.setTime(elemtString, inputString, '');
			});

			/* NOW BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('now-'+elemtString), function(evts){

				var nw = new Date();
				var hh = nw.getHours();
				var mm = nw.getMinutes();
				if(hh < 10){
					hh = '0'+hh;
				}
				if(mm < 10){
					mm = '0'+mm;
				}
				var hhmm = ''+hh+mm;
				Boss.compTime.setTime(elemtString, inputString, hhmm);

			});

			/* OK BUTTON */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('ok-'+elemtString), function(evts){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);

				elemtShowHide.classList.add('hidden');
				spn.classList.remove('rotate-180');

				var labl = Boss.getById('label-'+elemtString);
				var hour = Boss.getById('hour-'+elemtString);
				var minute = Boss.getById('minute-'+elemtString);

				var hour = hour.value;
				var minute = minute.value;

				if(hour.length === 2 && minute.length === 2){
					
					var val = ''+hour+minute;
					Boss.compTime.setTime(elemtString, inputString, val);

				}

				Boss.trigger('change', Boss.getById(elemtString));
				Boss.trigger('blur', Boss.getById(elemtString));

			});

			/* CHANGE IN COMPONENT */
			Boss.evts.add('change', Boss.getById(elemtString), function(evts){

				var hour = Boss.getById('hour-'+elemtString);
				var minute = Boss.getById('minute-'+elemtString);

				if(Boss.targt(evts) === hour || Boss.targt(evts) === minute){
					var val = ''+hour.value+minute.value;
					if(val.length === 4){
						Boss.compTime.setTime(elemtString, inputString, val);
					}
				}
			});

			/* ACTION IN COMPONENT */
			Boss.evts.add(Boss.evtTouchUp(), Boss.getById('showhide-'+elemtString), function(evts){

				var elemt = Boss.getById(elemtString);
				var spn = elemt.getElementsByTagName('span')[0];
				var elemtShowHide = Boss.getById('target-showhide-'+elemtString);
				
				/* FIX BUG AT FIRST FUCOS */
				if(elemt.getAttribute('data-last-evt') === 'focus'){
					elemt.setAttribute('data-last-evt', 'up');
				}else{
					if(elemtShowHide.classList.contains('hidden')){
						elemtShowHide.classList.remove('hidden');
						spn.classList.add('rotate-180');
					}else{
						elemtShowHide.classList.add('hidden');
						spn.classList.remove('rotate-180');
					}
				}
			});

			/* BLUR */
			Boss.evts.add('blur', elemt, function(evts){

				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'blur');
				var spn = elemt.getElementsByTagName('span')[0];

				var hour = Boss.getById('hour-'+elemtString);
				var minute = Boss.getById('minute-'+elemtString);

				if(Boss.targt(evts) === hour || Boss.targt(evts) === minute){
					if(evts.preventDefault){
						evts.preventDefault();
					}
					if(evts.stopPropagation){
						evts.stopPropagation();
					}
					return false;
				}

				/* IF THE BLUR EVENT WAS HAPPENED OUT THE COMPONENT */
				if(Boss.focusOut(elemt, evts.relatedTarget) === false){

					Boss.getById('target-showhide-'+elemtString).classList.add('hidden');
					spn.classList.remove('rotate-180');
				}

			});

			/* FOCUS */
			Boss.evts.add('focus', elemt, function(evts){
				var elemt = Boss.getById(elemtString);
				elemt.setAttribute('data-last-evt', 'focus');
				var spn = elemt.getElementsByTagName('span')[0];
				Boss.getById('target-showhide-'+elemtString).classList.remove('hidden');
				spn.classList.add('rotate-180');
			});

		}
	},
	tabs: {
		abas:{},
		render: function(elemento, modo){
			var elString = elemento;
			var ul = elemento;
			var lis, lisT, controlador;
			if(typeof(elemento) === 'string'){
				ul = Boss.getById(elemento);
			}
			lis = ul.getElementsByTagName('li');
			lisT = lis.length;

			if(typeof(modo) === 'undefined'){
				modo = 'horizontal';
			}

			var hs = window.location.hash;
			if(hs !== ''){
				hss = hs.split('?');
				if(typeof(hss[0]) !== 'undefined'){
					controlador = hss[0];
				}
			}
			this.abas[elString] = {};

			for(i = 0; i < lisT; i++){
				var texto = lis[i].getAttribute('data-para');
				this.abas[elString][i] = texto;
				var tabId = elString+'-'+i+'-li';
				lis[i].setAttribute('id', tabId);
			}

			/* ATIVAR TAB */
			var nAbas = Object.keys(this.abas[elString]).length;

			var uri = Boss.getUri();

			if(typeof(uri.tabs) !== 'undefined'){
				for(x = 0; x < nAbas; x++){
					if(this.abas[elString][x] === uri.tabs){
						Boss.getById(this.abas[elString][x]).classList.remove('hidden');
						lis[x].classList.add('boss-tabs-'+modo+'-active');
					}else{
						Boss.getById(this.abas[elString][x]).classList.add('hidden');
						lis[x].classList.remove('boss-tabs-'+modo+'-active');
					}
				}
			}else{
				for(x = 0; x < nAbas; x++){
					if(x == 0){
						Boss.getById(this.abas[elString][x]).classList.remove('hidden');
						lis[x].classList.add('boss-tabs-'+modo+'-active');
					}else{
						Boss.getById(this.abas[elString][x]).classList.add('hidden');
						lis[x].classList.remove('boss-tabs-'+modo+'-active');
					}
				}

			}

			/* CLICK EVENT */
			Boss.evts.add(Boss.evtTouchUp(), ul, function(evts){

				var elString = Boss.targt(evts).parentNode.getAttribute('id');

				var ul = Boss.getById(elString);

				/* PARA USO DE TRIGGER */
				if(!ul.getElementsByTagName('li')){
					ul = ul.parentNode;
				}
				var lis = ul.getElementsByTagName('li');

				var nAbas = Object.keys(Boss.tabs.abas[elString]).length;

				for(x = 0; x < nAbas; x++){

					if(Boss.tabs.abas[elString][x] ==  Boss.targt(evts).getAttribute('data-para')){
						Boss.getById(Boss.tabs.abas[elString][x]).classList.remove('hidden');
						lis[x].classList.add('boss-tabs-'+modo+'-active');
					}else{
						Boss.getById(Boss.tabs.abas[elString][x]).classList.add('hidden');
						lis[x].classList.remove('boss-tabs-'+modo+'-active');
					}
				}
			});
		}
	}
}

Boss.validate = {
	rules: {
		notUppercase: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			var upper = {'A':'','B':'','C':'','D':'','E':'','F':'','G':'','H':'','I':'','J':'','K':'','L':'','M':'','N':'','O':'','P':'','Q':'','R':'','S':'','T':'','U':'','V':'','W':'','X':'','Y':'','Z':''};
			var lower = {'a':'','b':'','c':'','d':'','e':'','f':'','g':'','h':'','i':'','j':'','k':'','l':'','m':'','n':'','o':'','p':'','q':'','r':'','s':'','t':'','u':'','v':'','w':'','x':'','y':'','z':''};

			var lengtUpper = 0;
			var lengtLower = 0;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var temp = value.split('');
			var lTemp = temp.length;

			if(lTemp > 4){

				for (x = 0; x < lTemp; x++) {

					if(typeof(upper[temp[x]]) !== 'undefined'){
						lengtUpper = lengtUpper + 1;
					}else if(typeof(lower[temp[x]]) !== 'undefined'){
						lengtLower = lengtLower + 1;
					}else{
						lengtLower = lengtLower + 1;
					}
				}

				// MORE UPPER WHO LOWER
				if(lengtUpper > lengtLower){
					return false;
				}

			}

			return true;

		},
		notSpace: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var temp = value.split('');
			var lTemp = temp.length;

			for (x = 0; x < lTemp; x++) {

				if(temp[x] == ' '){
					return false;
				}
			}

			return true;

		},
		cnpj: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var value = value.replace(/\D/g, "");

			while(value.length < 14){
				value = "0" + value;
			}
			var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
			var a = [];
			var b = 0;
			var c = [6,5,4,3,2,9,8,7,6,5,4,3,2], x;

			for (var i = 0; i < 12; i++){
				a[i] = value.charAt(i);
				b += a[i] * c[i+1];
			}

			if((x = b % 11) < 2){
				a[12] = 0;
			}else{
				a[12] = 11 - x;
			}

			b = 0;
			for (var y = 0; y < 13; y++){
				b += (a[y] * c[y]);
			}

			if ((x = b % 11) < 2){
				a[13] = 0;
			}else{
				a[13] = 11 - x;
			}

			if ((parseInt(value.charAt(12), 10) !== a[12]) || (parseInt(value.charAt(13), 10) !== a[13]) || value.match(expReg) ){
				return false;
			}
			return true;
		},
		cpf: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			value = value.replace(".","");
			value = value.replace(".","");
			var cpf = value.replace("-","");

			var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
			var a = [];
			var b = 0;
			var c = 11;
			var x, y;
			for (var i = 0; i < 11; i++){
				a[i] = cpf.charAt(i);
				if (i < 9){
					b += (a[i] * --c);
				}
			}
			if ((x = b % 11) < 2){
				a[9] = 0;
			}else{
				a[9] = 11-x;
			}

			b = 0;
			c = 11;

			for(y=0; y<10; y++){
				b += (a[y] * c--);
			}

			if((x = b % 11) < 2){
				a[10] = 0;
			}else{
				a[10] = 11-x;
			}

			if((parseInt(cpf.charAt(9), 10) !== a[9]) || (parseInt(cpf.charAt(10), 10) !== a[10]) || cpf.match(expReg)){
				return false;
			}

			return true;
		},
		inteiro: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^[0-9]+$/;
			if(!n.test(value)){
				return false;
			}

			var n = /^[0]+/;
			if(n.test(value)){
				return false;
			}

			return true;
		},
		inteiroZero: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^[0-9]+$/;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		moeda: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^-*\d+(\.\d{1,2})?$/;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		decimal: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		cep: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^[0-9]{5}-*[0-9]{3}$/;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		empty: function(fld, parameters){

			var lengt = fld.length;

			if(lengt < 2 && fld[0].type !== 'radio'){
				value = fld[0].value;
				if(value === ''){
					return false;
				}
			}else if(fld[0].type === 'radio'){
				for(x = 0; x < lengt; x++){
					if(fld[x].checked === true && fld[x].value === ''){
						return false;
						break;
					}
				}
			}

			return true;
		},
		tel: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^\(*[0-9]{2}\)* *-*[0-9]{4} *-* *[0-9]{4}$|^\(*[0-9]{2}\)* *-*[0-9]{5} *-* *[0-9]{4}$/;

			if(!n.test(value)){
				return false;
			}

			return true;
		},
		email: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^[a-z-A-Z0-9\._\-]+@[a-z-A-Z0-9\._\-]+\.[a-z-A-Z0-9]\.*[a-z]+$/;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		url: function(fld, parameters) {

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
			if(!n.test(value)){
				return false;
			}

			return true;
		},
		complexidadeSenha: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^([0-9a-zA-Z]+).{6,}$/;
			if(!n.test(value)){
				return false;
			}

			return true;  
		},
		igual: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var igual = Boss.getName(parameters.igual)[0];
			if(value === igual.value){
				return true;
			}
			return false;
		},
		igualId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var igual = Boss.getById(parameters.igualId);
			if(value === igual.value){
				return true;
			}
			return false;
		},
		maiorId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			var igual = Boss.getById(parameters.maiorId);
			if(parseFloat(value) > parseFloat(igual.value)){
				return true;
			}
			return false;
		},
		maiorIgualId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			var maiorigualid = Boss.getById(parameters.maiorIgualId);
			if(parseFloat(value) >= parseFloat(maiorigualid.value)){
				return true;
			}
			return false;
		},
		maiorIdNull: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			var igual = Boss.getById(parameters.maiorIdNull);
			if(parseFloat(value) >= parseFloat(igual.value) || igual.value == ''){
				return true;
			}
			return false;

		},
		maior: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			if(parseFloat(value) > parseFloat(parameters.maior)){
				return true;
			}
			return false;

		},
		maiorIgual: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			if(parseFloat(value) >= parseFloat(parameters.maiorIgual)){
				return true;
			}
			return false;
		},
		menor: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			if(Number(value) < Number(parameters.menor)){
				return true;
			}
			return false;
		},
		menorIgual: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			if(parseFloat(value) <= parseFloat(parameters.menorIgual)){
				return true;
			}
			return false;

		},
		menorIgualId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var n = /^\d+(\.[\d]+)?$/;

			value = Math.abs(value);

			/* Math.abs PARA IGNORAR VALORES NEGATIVOS */
			if(!n.test(value)){
				return false;
			}

			var igual = Boss.getById(parameters.menorIgualId);
			if(parseFloat(value) <= parseFloat(Math.abs(igual.value)) || Math.abs(igual.value) == ''){
				return true;
			}
			return false;

		},
		maiorNuloId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}
			
			var n = /^\d+(\.[\d]+)?$/;
			if(!n.test(value)){
				return false;
			}

			var igual = Boss.getById(parameters.maiorNuloId);
			if(parseFloat(value) >= parseFloat(igual.value) || value === ''){
				return true;
			}
			return false;

		},
		diferente: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			if(value !== parameters.diferente){
				return true;
			}
			return false;
		},
		diferenteId: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			var diff = Boss.getById(parameters.diferenteId);
			if(value !== diff.value || value === ''){
				return true;
			}
			return false;
		},
		tamanhoMaximo: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			if(value.length <= parameters.tamanhoMaximo){
				return true;
			}
			return false;

		},
		tamanhoMinimo: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			if(value.length >= parameters.tamanhoMinimo){
				return true;
			}
			return false;
		},
		sicredi: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			n = /^\d+?$/;
			if(!n.test(value)){
				return false;
			}

			if(value.length === 7){
				return true;
			}
			return false;

		},
		banrisul: function(fld, parameters){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			n = /^\d+?$/;
			if(!n.test(value)){
				return false;
			}

			if(value.length === 7){
				return true;
			}
			return false;

		},
		minSelection: function(fld, parameters){
			
			if(parameters.minSelection){

				var lengt = fld.length;

				if(fld[0].type === 'checkbox' || fld[0].type === 'radio'){
					var checkeds = 0;
					for(x = 0; x < lengt; x++){
						if(fld[x].checked === true){
							checkeds = checkeds + 1;
						}
					}
					if(checkeds < parameters.minSelection){
						return false;
					}
				}

				if(fld[0].type === 'select-multiple' || fld[0].type === 'select-one'){
					var selecteds = 0;
					var opts = fld[0].options;
					var lOpts = opts.length;
					for(o = 0; o < lOpts; o++){
						if(opts[o].selected === true){
							selecteds = selecteds + 1;
						}
					}
					if(selecteds < parameters.minSelection){
						return false;
					}
				}

				if(fld[0].type === 'file'){
					var tFls = fld[0].files.length;
					if(tFls < parameters.minSelection){
						return false;
					}
				}
			}

			return true;
		},
		maxSelection: function(fld, parameters){
			
			if(parameters.maxSelection){

				var checkeds = 0;
				var selecteds = 0;
				var lengt = fld.length;

				if(fld[0].type === 'checkbox' || fld[0].type === 'radio'){
					for(x = 0; x < lengt; x++){
						if(fld[x].checked === true){
							checkeds = checkeds + 1;
						}
					}
					if(checkeds > parameters.maxSelection){
						return false;
					}
				}

				if(fld[0].type === 'select-multiple' || fld[0].type === 'select-one'){
					var opts = fld[0].options;
					var lOpts = opts.length;
					for(o = 0; o < lOpts; o++){
						if(opts[o].selected === true){
							selecteds = selecteds + 1;
						}
					}
					if(selecteds > parameters.maxSelection){
						return false;
					}
				}

				if(fld[0].type === 'file'){
					var tFls = fld[0].files.length;
					if(tFls > parameters.maxSelection){
						return false;
					}
				}
			}

			return true;
		},
		fileMaxBytes: function(fld, parameters){
			
			if(parameters.fileMaxBytes){
				if(fld[0].type === 'file'){
					var fld = fld[0].files;
					var tFls = fld.length;
					for(f = 0; f < tFls; f++){
						if(fld[f].size > parameters.fileMaxBytes){
							return false;
						}
					}
				}
			}
			return true;
		},
		fileMimeTypes: function(fld, parameters){
			
			if(parameters.fileMimeTypes){
				if(fld[0].type === 'file'){
					var fld = fld[0].files;
					var tFls = fld.length;
					for(f = 0; f < tFls; f++){
						console.warn('Tipo de arquivo: '+fld[f].type);
						if(fld[f].type !== '' && Boss.inArray(fld[f].type,parameters.fileMimeTypes) === false){
							return false;
						}
					}
				}
			}
			return true;
		}
	},
	frmsMemory: {},
	locks: {},
	processLock: function(formid){

		if(Boss.validate.locks[formid].lock === true){

			/* UNLOCK */
			if(Boss.validate.locks[formid].initString === Boss.validate.locks[formid].changeString){
				lockChangePage = false;
				lockClosePage = false;

			/* LOCK */
			}else{
				lockChangePage = true;
				lockClosePage = true;
			}
		}

	},
	processField: function(form, nme, rules, evtstype){

		var fld = document.getElementsByName(this.frmsMemory[form].names[nme]);
		var lengt = fld.length;

		/* THE RULES */
		for(r in this.frmsMemory[form]['fields'][nme].rules){

			var rFn = Boss.validate.rules[r];

			var parameters = '';
			if(this.frmsMemory[form]['fields'][nme].rules[r].parameters){
				parameters = this.frmsMemory[form]['fields'][nme].rules[r].parameters;
			}
			var rMessage = this.frmsMemory[form]['fields'][nme].rules[r].error;
			var classError = this.frmsMemory[form]['fields'][nme].classError;
			var classOk = this.frmsMemory[form]['fields'][nme].classOk;

			if(typeof(this.frmsMemory[form]['fields'][nme].rules[r].active) == 'undefined' || this.frmsMemory[form]['fields'][nme].rules[r].active === true){
				if(typeof(rFn) === 'function'){
					if(rFn(fld, parameters) === false){

						if(evtstype !== 'keyup'){
							Boss.warning({message: rMessage});
						}

						// selectUnique COMPONENT
						if(fld[0].getAttribute('tabindex') == '-1' && fld[0].type === 'radio'){

							var selectUnique = fld[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

							selectUnique.classList.add(classError);
							selectUnique.classList.remove(classOk);

						}else{

							fld[0].parentNode.classList.add(classError);
							fld[0].parentNode.classList.remove(classOk);

						}
						
						/* BREAK LOOPS */
						return false;

						/* BREAK LOOPS */
						break;
					}else{

						// selectUnique COMPONENT
						if(fld[0].getAttribute('tabindex') == '-1' && fld[0].type === 'radio'){

							var selectUnique = fld[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

							selectUnique.classList.add(classOk);
							selectUnique.classList.remove(classError);

						}else{
							fld[0].parentNode.classList.add(classOk);
							fld[0].parentNode.classList.remove(classError);
						}
					}
				}else{
					console.warn('The rule "'+r+'" don\'t exists.');
				}
			}
		}
		return true;
	},
	goMask: function(form, nme, mask, evts){

		if(mask === 'tel'){
			mask = '(99) 9999-9999';
		}
		if(mask === 'cnpj'){
			mask = '99.999.999/9999-99';
		}
		if(mask === 'cpf'){
			mask = '999.999.999-99';
		}
		if(mask === 'cep'){
			mask = '99999-999';
		}

		if(evts.keyCode !== 37 && evts.keyCode !== 37 && evts.keyCode !== 37 && evts.keyCode !== 40){

			var fld = document.getElementsByName(this.frmsMemory[form].names[nme])[0];
			var val = fld.value;

			var spltMask = mask.split('');
			var lengtMask = spltMask.length;

			var spltVal = val.split('');

			var partial = '';

			var cut = Array();
			var outs = {};
			var pcut = 0;

			for(x = 0; x < lengtMask; x++){

				var d = /\d/;
				var a = /\w/;

				if(d.test(spltMask[x]) && a.test(spltMask[x])){
					if(!cut[pcut]){
						cut[pcut] = 0;
					}
					cut[pcut] = cut[pcut] + 1;
				}else{
					pcut++;
					cut[pcut] = spltMask[x];
					outs[spltMask[x]] = spltMask[x];
					pcut++;
				}
			}

			var v = val;
			for(o in outs){
				var reg = new RegExp('\\'+outs[o], 'g');
				v = v.replace(reg, '');
			}

			/* 10 and 11 digitos for fone */
			if(v.length === 11 && mask === '(99) 9999-9999'){
				cut = Array("(", 2, ")"," ", 5, "-", 4);
			}else if(v.length === 10 && mask === '(99) 9999-9999'){
				cut = Array("(", 2, ")"," ", 4, "-", 4);
			}

			var start = 0;

			var masked = '';

			for(c in cut){
				if(cut[c] > 0){
					masked += v.substr(start, cut[c]);
					start = start + cut[c];
				}else{
					if(v.length >= start){
						masked += cut[c];
					}
				}
			}

			if(masked === '('){
				masked = '';
			}

			fld.value = masked;

		}

	},
	process: function(form, evts){

		var frm = Boss.getById(form);
		var tFrm = frm.length;

		var statusValidate = true;

		if(evts.type === 'blur' || evts.type === 'change' || evts.type === 'keyup'){

			var fld = Boss.targt(evts);
			var nme = fld.getAttribute('name');

			/* IF NAME EXISTS */
			if(typeof(Boss.validate.frmsMemory[form]['fields'][nme]) !== 'undefined'){
				this.processField(form, nme, this.frmsMemory[form]['fields'][nme].rules, evts.type);
			}

			if(evts.type === 'blur' || evts.type === 'change' || evts.type === 'keyup' && evts.keyCode !== 8){
				if(typeof(Boss.validate.frmsMemory[form]['fields'][nme]) !== 'undefined'){
					if(typeof(Boss.validate.frmsMemory[form]['fields'][nme].mask) !== 'undefined'){
						this.goMask(form, nme, this.frmsMemory[form]['fields'][nme].mask, evts);
					}
				}
			}

			if(evts.type === 'keyup' && evts.keyCode === 8){
				if(typeof(Boss.validate.frmsMemory[form]['fields'][nme]) !== 'undefined'){
					if(typeof(Boss.validate.frmsMemory[form]['fields'][nme].mask) !== 'undefined'){
						Boss.delayPersistent(function(){
							var fld = Boss.targt(evts);
							var nme = fld.getAttribute('name');
							Boss.validate.goMask(form, nme, Boss.validate.frmsMemory[form]['fields'][nme].mask, evts);
							Boss.trigger('keyup', fld);
						}, 1300);
					}
				}
			}

		/* SUBMIT */
		}else if(evts.type === 'submit' || evts === 'submit'){

			/* ACROSS FIELDS */
			for(x in this.frmsMemory[form].names){

				var nme = this.frmsMemory[form].names[x];

				/* IF NAME EXISTS */
				if(typeof(this.frmsMemory[form]['fields'][nme]) !== 'undefined'){

					var tmStatus = this.processField(form, nme, this.frmsMemory[form]['fields'][nme].rules, 'submit');
					/* BREAK TRUE */
					if(statusValidate === true && tmStatus === false){
						statusValidate = tmStatus;
					}
				}

			}
		}

		return statusValidate;

	},
	init: function(obj){

		if(Boss.getById(obj.config.formId)){

			var formid = obj.config.formId;
			var frm = Boss.getById(formid);
			var tFrm = frm.length;

			Boss.validate.locks[formid] = {};

			var lockPushState = false;

			if(typeof(obj.config.lockPushState) !== 'undefined'){
				lockPushState = obj.config.lockPushState;
			}

			if(lockPushState === true){

				Boss.validate.locks[formid]['lock'] = true;
				Boss.validate.locks[formid]['initString'] = JSON.stringify(Boss.serializer(formid));

			}

			if(lockPushState === false){
				Boss.validate.locks[formid]['lock'] = false;
			}

			if(frm.nodeName === 'FORM'){

				/* INIT FORM */
				this.frmsMemory[formid] = {};
				/* STORE FORM */
				this.frmsMemory[formid] = obj;
				/* INIT FORM NAMES */
				this.frmsMemory[formid]['names'] = {};

				/* FIND FIELDS NAMES OF THIS FORM */
				/* STORE FORM */
				for(f = 0; f < tFrm; f++){
					/* IF EXISTS NAME ATTRIBUTE */
					if(frm[f].getAttribute('name')){
						var nam = frm[f].getAttribute('name');
						/* STORE NAMES */
						this.frmsMemory[formid]['names'][nam] = nam;
					}
				}

				/* STOP SUBMIT EVENT */
				Boss.evts.add('submit', frm, function(evts){
					
					var valid = Boss.validate.process(formid, evts);

					if(valid === true){
						lockChangePage = false;
						lockClosePage = false;

						/* SEND BY FUNCTION */
						if(obj.send){
							obj.send();
						}
					}else{
						lockChangePage = true;
						lockClosePage = true;
					}

					/* CANCEL EVENT */
					evts.cancelBubble = true;

					if(evts.stopPropagation){
						evts.stopPropagation();
					}

					if(evts.preventDefault){
						evts.preventDefault();
					}

				});

				/* KEYUP EVENT */
				Boss.evts.add('keyup', frm, function(evts){
					Boss.delayPersistent(function(){
						var elem = Boss.targt(evts);
						/* SOME ELEMENTS ALLOW BLUR */
						if(elem.nodeName !== 'BUTTON' && (elem.nodeName === 'INPUT' || elem.nodeName === 'TEXTAREA')){
							if(elem.type !== 'radio' && elem.type !== 'checkbox' && elem.type !== 'select' && elem.type !== 'button' && elem.type !== 'submit' && elem.type !== 'reset' && elem.type !== 'image'){
								Boss.validate.process(formid, evts);

								Boss.validate.locks[formid]['changeString'] = JSON.stringify(Boss.serializer(formid));
								Boss.validate.processLock(formid);

							}
						}
					}, 100);
				});

				/* BLUR EVENT */
				Boss.evts.add('blur', frm, function(evts){
					var elem = Boss.targt(evts);
					/* SOME ELEMENTS ALLOW BLUR */
					if(elem.nodeName !== 'BUTTON' && (elem.nodeName === 'INPUT' || elem.nodeName === 'TEXTAREA')){
						if(elem.type !== 'radio' && elem.type !== 'checkbox' && elem.type !== 'select' && elem.type !== 'button' && elem.type !== 'submit' && elem.type !== 'reset' && elem.type !== 'image'){
							Boss.validate.process(formid, evts);
						}
					}
				});

				/* FOCUS EVENT */
				Boss.evts.add('focus', frm, function(evts){
					var elem = Boss.targt(evts);
					/* SOME ELEMENTS ALLOW BLUR */
					if(elem.nodeName !== 'BUTTON' && (elem.nodeName === 'INPUT' || elem.nodeName === 'TEXTAREA')){
						if(elem.type !== 'radio' && elem.type !== 'checkbox' && elem.type !== 'select' && elem.type !== 'button' && elem.type !== 'submit' && elem.type !== 'reset' && elem.type !== 'image'){
							Boss.validate.process(formid, evts);
						}
					}
				});

				/* CHANGE EVENT */
				Boss.evts.add('change', frm, function(evts){
					Boss.validate.process(formid, evts);

					Boss.validate.locks[formid]['changeString'] = JSON.stringify(Boss.serializer(formid));
					Boss.validate.processLock(formid);

				});

				/* PASTE EVENT */
				Boss.evts.add('paste', frm, function(evts){

					Boss.validate.locks[formid]['changeString'] = JSON.stringify(Boss.serializer(formid));
					Boss.validate.processLock(formid);

				});

				/* CUT EVENT */
				Boss.evts.add('cut', frm, function(evts){

					Boss.validate.locks[formid]['changeString'] = JSON.stringify(Boss.serializer(formid));
					Boss.validate.processLock(formid);

				});

			}else{
				console.warn('This isn\'t a form.');
				return false;
			}

		}else{
			console.warn('Bro, I did not find his form.');
			return false;
		}
	}
};

Boss.htmlEditor = {
	setTextareaValue: function(elem, values){
		var texta = Boss.getById(elem);
		if(values === '<p contenteditable="true"></p>' || values === '<p></p>'){
			texta.value = '';
		}else{
			/* REMOVE TRASH ATRIBUTES */
			var tempDiv = document.createElement('div');
			tempDiv.innerHTML = values;

			var ps = tempDiv.getElementsByTagName('p');
			var lps = ps.length;
			for(x = 0; x < lps; x++){
				ps[x].removeAttribute('style');
				ps[x].removeAttribute('contenteditable');
				ps[x].removeAttribute('tabindex');
				if(ps[x].getAttribute('class') === ''){
					ps[x].removeAttribute('class');
				}
			}

			var h1 = tempDiv.getElementsByTagName('h1');
			var lh1 = h1.length;
			for(x = 0; x < lh1; x++){
				h1[x].removeAttribute('style');
				h1[x].removeAttribute('contenteditable');
				h1[x].removeAttribute('tabindex');
				if(h1[x].getAttribute('class') === ''){
					h1[x].removeAttribute('class');
				}
			}

			var h2 = tempDiv.getElementsByTagName('h2');
			var lh2 = h2.length;
			for(x = 0; x < lh2; x++){
				h2[x].removeAttribute('style');
				h2[x].removeAttribute('contenteditable');
				h2[x].removeAttribute('tabindex');
				if(h2[x].getAttribute('class') === ''){
					h2[x].removeAttribute('class');
				}
			}

			var h3 = tempDiv.getElementsByTagName('h3');
			var lh3 = h3.length;
			for(x = 0; x < lh3; x++){
				h3[x].removeAttribute('style');
				h3[x].removeAttribute('contenteditable');
				h3[x].removeAttribute('tabindex');
				if(h3[x].getAttribute('class') === ''){
					h3s[x].removeAttribute('class');
				}
			}
			texta.value = tempDiv.innerHTML;
		}
	},
	init: function(id){

		var elem = Boss.getById(id);
		elem.classList.add('hidden');

		var toolbar = document.createElement('div');
		toolbar.setAttribute('id', 'toolbar-'+id);
		toolbar.classList.add('boss-input-editor-toolbar');
		var mask = '<button data-tool="H1" type="button" class="btn">h1</button><button data-tool="H2" type="button" class="btn">h2</button><button data-tool="H3" type="button" class="btn">h3</button><button data-tool="P" type="button" class="btn">parágrafo</button>';

		mask += ' <button data-strong="strong" type="button" class="btn">strong</button>';

		mask += ' <button type="button" id="to-lef-'+id+'" data-class="text-left" class="boss-input-editor-toolbar-text-left"></button>';
		mask += ' <button type="button" id="to-cen-'+id+'" data-class="text-center" class="boss-input-editor-toolbar-text-center"></button>';
		mask += ' <button type="button" id="to-rig-'+id+'" data-class="text-right" class="boss-input-editor-toolbar-text-right"></button>';
		mask += ' <button type="button" id="to-jus-'+id+'" data-class="text-justify" class="boss-input-editor-toolbar-text-justify"></button>';

		mask += ' <button type="button" id="to-nor-'+id+'" data-color="" class="boss-input-editor-toolbar-color"></button>';
		mask += ' <button type="button" id="to-red-'+id+'" data-color="red" class="boss-input-editor-toolbar-color-red"></button>';
		mask += ' <button type="button" id="to-gre-'+id+'" data-color="green" class="boss-input-editor-toolbar-color-green"></button>';
		mask += ' <button type="button" id="to-blu-'+id+'" data-color="blue" class="boss-input-editor-toolbar-color-blue"></button>';

		toolbar.innerHTML = mask;
		elem.parentNode.appendChild(toolbar);

		var editor = document.createElement('div');
		editor.classList.add('boss-input-editor-editable');
		editor.setAttribute('contenteditable', 'true');
		editor.setAttribute('id', 'editor-'+id);

		if(elem.value !== ''){
			editor.innerHTML = elem.value;
		}
		if(elem.value === ''){
			editor.innerHTML = '<p></p>';
		}

		elem.parentNode.appendChild(editor);

		Boss.evts.add(Boss.evtTouchUp(), Boss.getById('toolbar-'+id), function(evts){

			var tgt = Boss.targt(evts);
			var editor = Boss.getById('editor-'+id)

			if(document.selection){
				var select = document.selection.createRange().parentElement();
			}else{
				var select = window.getSelection().anchorNode.parentNode; 
			}

			if(Boss.isChild(editor, select) === true){
				if(tgt.getAttribute('data-tool')){
					if(tgt.getAttribute('data-tool') === 'H1' || tgt.getAttribute('data-tool') === 'H2' || tgt.getAttribute('data-tool') === 'H3' || tgt.getAttribute('data-tool') === 'P'){
						if(tgt.nodeName !== tgt.getAttribute('data-tool')){
							var newel = document.createElement(tgt.getAttribute('data-tool'));
							newel.innerHTML = select.innerHTML;
							editor.replaceChild(newel, select);

							if(document.selection){
								var targt = document.selection.createRange().parentElement();
								var sel = document.selection;
							}else{
								var targt = window.getSelection().anchorNode.parentNode; 
								var sel = window.getSelection();
							}

							var range = document.createRange();

							range.setStart(newel, 1);
							range.collapse(true);
							sel.removeAllRanges();
							sel.addRange(range);
						}
					}
				}

				if(typeof(tgt.getAttribute('data-class')) !== null){

					var toLeft 		= Boss.getById('to-lef-'+id);
					var toCenter 	= Boss.getById('to-cen-'+id);
					var toRight 	= Boss.getById('to-rig-'+id);
					var toJustify 	= Boss.getById('to-jus-'+id);

					if(tgt.getAttribute('data-class') === 'text-left'){
						select.classList.remove('text-left');
						select.classList.remove('text-center');
						select.classList.remove('text-right');
						select.classList.remove('text-justify');

						toLeft.classList.add('boss-input-editor-toolbar-text-left-active');
						toCenter.classList.remove('boss-input-editor-toolbar-text-center-active');
						toRight.classList.remove('boss-input-editor-toolbar-text-right-active');
						toJustify.classList.remove('boss-input-editor-toolbar-text-justify-active');
					}
					if(tgt.getAttribute('data-class') === 'text-center'){
						select.classList.add('text-center');
						select.classList.remove('text-left');
						select.classList.remove('text-right');
						select.classList.remove('text-justify');

						toLeft.classList.remove('boss-input-editor-toolbar-text-left-active');
						toCenter.classList.add('boss-input-editor-toolbar-text-center-active');
						toRight.classList.remove('boss-input-editor-toolbar-text-right-active');
						toJustify.classList.remove('boss-input-editor-toolbar-text-justify-active');
					}
					if(tgt.getAttribute('data-class') === 'text-right'){
						select.classList.add('text-right');
						select.classList.remove('text-left');
						select.classList.remove('text-center');
						select.classList.remove('text-justify');

						toLeft.classList.remove('boss-input-editor-toolbar-text-left-active');
						toCenter.classList.remove('boss-input-editor-toolbar-text-center-active');
						toRight.classList.add('boss-input-editor-toolbar-text-right-active');
						toJustify.classList.remove('boss-input-editor-toolbar-text-justify-active');
					}
					if(tgt.getAttribute('data-class') === 'text-justify'){
						select.classList.add('text-justify');
						select.classList.remove('text-left');
						select.classList.remove('text-center');
						select.classList.remove('text-right');

						toLeft.classList.remove('boss-input-editor-toolbar-text-left-active');
						toCenter.classList.remove('boss-input-editor-toolbar-text-center-active');
						toRight.classList.remove('boss-input-editor-toolbar-text-right-active');
						toJustify.classList.add('boss-input-editor-toolbar-text-justify-active');
					}
				}

				if(typeof(tgt.getAttribute('data-color')) !== null){

					var toNormal 	= Boss.getById('to-nor-'+id);
					var toRed 		= Boss.getById('to-red-'+id);
					var toGreen 	= Boss.getById('to-gre-'+id);
					var toBlue 		= Boss.getById('to-blu-'+id);

					if(tgt.getAttribute('data-color') === 'red'){
						select.classList.add('red');
						select.classList.remove('green');
						select.classList.remove('blue');
						toNormal.classList.remove('boss-input-editor-toolbar-color-active');
						toRed.classList.add('boss-input-editor-toolbar-color-red-active');
						toGreen.classList.remove('boss-input-editor-toolbar-color-green-active');
						toBlue.classList.remove('boss-input-editor-toolbar-color-blue-active');
					}else if(tgt.getAttribute('data-color') === 'green'){
						select.classList.add('green');
						select.classList.remove('red');
						select.classList.remove('blue');
						toNormal.classList.remove('boss-input-editor-toolbar-color-active');
						toRed.classList.remove('boss-input-editor-toolbar-color-red-active');
						toGreen.classList.add('boss-input-editor-toolbar-color-green-active');
						toBlue.classList.remove('boss-input-editor-toolbar-color-blue-active');
					}else if(tgt.getAttribute('data-color') === 'blue'){
						select.classList.add('blue');
						select.classList.remove('red');
						select.classList.remove('green');
						toNormal.classList.remove('boss-input-editor-toolbar-color-active');
						toRed.classList.remove('boss-input-editor-toolbar-color-red-active');
						toGreen.classList.remove('boss-input-editor-toolbar-color-green-active');
						toBlue.classList.add('boss-input-editor-toolbar-color-blue-active');
					}else{
						select.classList.remove('red');
						select.classList.remove('green');
						select.classList.remove('blue');
						toNormal.classList.add('boss-input-editor-toolbar-color-active');
						toRed.classList.remove('boss-input-editor-toolbar-color-red-active');
						toGreen.classList.remove('boss-input-editor-toolbar-color-green-active');
						toBlue.classList.remove('boss-input-editor-toolbar-color-blue-active');
					}
				}

				if(typeof(tgt.getAttribute('data-strong')) !== null){
					if(tgt.getAttribute('data-strong') === 'strong'){
						select.classList.toggle('strong');
					}
				}
				Boss.htmlEditor.setTextareaValue(id, editor.innerHTML);
			}
		});

		Boss.evts.add('keypress', Boss.getById('editor-'+id), function(evts){

			var editor = Boss.getById('editor-'+id);

			/* ENTER */
			if(evts.keyCode === 13){

				if(evts.stopPropagation){
					evts.stopPropagation();
				}
				if(evts.preventDefault){
					evts.preventDefault();
				}

				if(document.selection){
					var targt = document.selection.createRange().parentElement();
					var sel = document.selection;
				}else{
					var targt = window.getSelection().anchorNode.parentNode; 
					var sel = window.getSelection();
				}

				if(targt.parentNode === editor){
				
					var newP = document.createElement('p');
					Boss.insertAfter(newP, targt);

					var range = document.createRange();

					range.setStart(newP, 0);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
			if(evts.keyCode === 8){
				if(evts.stopPropagation){
					evts.stopPropagation();
				}
				if(evts.preventDefault){
					evts.preventDefault();
				}
			}
		});

		Boss.evts.add('keyup', Boss.getById('editor-'+id), function(evts){

			var editor = Boss.getById('editor-'+id);

			if(evts.keyCode === 8){

				if(editor.innerHTML === ''){

					if(document.selection){
						var targt = document.selection.createRange().parentElement();
						var sel = document.selection;
					}else{
						var targt = window.getSelection().anchorNode.parentNode; 
						var sel = window.getSelection();
					}
					
					var newP = document.createElement('p');
					editor.appendChild(newP);

					var range = document.createRange();

					range.setStart(newP, 0);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);

				}
			}

			Boss.htmlEditor.setTextareaValue(id, editor.innerHTML);
		});

		Boss.evts.add('mousedown', Boss.getById('editor-'+id), function(evts){
			Boss.targt(evts).focus();
		});

		Boss.evts.add('resizestart', Boss.getById('editor-'+id), function(evts){
			if(evts.stopPropagation){
				evts.stopPropagation();
			}
			e.cancelBubble = true;
			if(evts.preventDefault){
				evts.preventDefault();
			}
			e.returnValue = false;
			return false;
		});
	}
};

Boss.evts.add('touchmove', document, function(evt){
	if(touchEvents === false){
		touchEvents = true;
	}
});

Boss.evts.add('touchstart', document, function(evt){
	if(touchEvents === false){
		touchEvents = true;
	}
});