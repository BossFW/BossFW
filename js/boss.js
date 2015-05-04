/*
	FIX IE VIEW POR BUG
*/

(function () {
	if(navigator.userAgent.match(/IEMobile\/10\.0/)){
		var msViewportStyle = document.createElement('style');
		msViewportStyle.appendChild(document.createTextNode('@-ms-viewport{width:auto!important}'));
		document.querySelector('head').appendChild(msViewportStyle);
	}
}());

/* VAR TO LOCK CHANGE PAGE */
var lockChangePage = false;
/* VAR TO LOOK EXIT PAGE, CLOSE BROWSER OR CLOSE TAB */
var lockClosePage = false;

window.Boss = {
	/* TOUCH EVENT */
	evtTouch: function(){
		var evtTouch;
		if (window.navigator.msPointerEnabled) {
			evtTouch = 'MSPointerDown';
		}else if('ontouchstart' in document.documentElement){
			evtTouch = 'touchstart';
		}else{
			evtTouch = 'mousedown';
		}
		return evtTouch;
	},
	/* UP TOUCH EVENT */
	evtTouchUp: function(){
		var evtTouchUp;
		if (window.navigator.msPointerEnabled) {
			evtTouchUp = 'MSPointerUp';
		}else if('ontouchstart' in document.documentElement){
			evtTouchUp = 'touchend';
		}else{
			evtTouchUp = 'mouseup';
		}
		return evtTouchUp;
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
		for(x = 0; x < lengt; x++){
			if(arr[x] === st){
				return true;
				break;
			}
		}
		return false;
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
	showhide: function(element, forElement){
		var el = Boss.getById(element);
		var forElement = Boss.getById(forElement);

		if(el.getElementsByTagName('span')[0]){
			var sp = el.getElementsByTagName('span')[0];
			if(forElement.classList.contains('hidden')){
				sp.classList.remove('rotate-180');
			}else{
				sp.classList.add('rotate-180');
			}
		}

		Boss.evts.add(Boss.evtTouchUp(), el, function(evts){
			if(el === Boss.targt(evts)){
				if(el.getElementsByTagName('span')[0]){
					var sp = el.getElementsByTagName('span')[0];
					if(forElement.classList.contains('hidden')){
						sp.classList.add('rotate-180');
					}else{
						sp.classList.remove('rotate-180');
					}
				}
				forElement.classList.toggle('hidden');
			}
		});
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
				if(inputs[x].getAttribute('name')){

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
				if(textareas[x].getAttribute('name')){
					frm.append(textareas[x].getAttribute('name'), textareas[x].value);
				}
			}

			var selects = form.getElementsByTagName('select');
			var tSelects = selects.length;

			for(x = 0; x < tSelects; x++){
				if(selects[x].getAttribute('name')){
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
	},
	pushstate: {
		init: function(configObj){

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

				xhrfn(window.location.href);

			});

			/* CLICK EVENTS */
			Boss.evts.add('click', document, function(evts){
				var elemt = Boss.targt(evts);

				if(elemt.nodeName === 'A' || elemt.nodeName === 'a'){
					if(elemt.href && !elemt.getAttribute('data-no-popstate')){
						if(evts.stopPropagation){
							evts.stopPropagation();
						}
						if(evts.preventDefault){
							evts.preventDefault();
						}

						Boss.pushstate.goXHR(elemt.href, xhrfn, lockChangePageFn);
					}
				}

				if(elemt.parentNode){
					if(elemt.parentNode.nodeName === 'A' || elemt.parentNode.nodeName === 'a'){
						if(elemt.parentNode.href && !elemt.parentNode.getAttribute('data-no-popstate')){
							if(evts.stopPropagation){
								evts.stopPropagation();
							}
							if(evts.preventDefault){
								evts.preventDefault();
							}
							Boss.pushstate.goXHR(elemt.parentNode.href, xhrfn, lockChangePageFn);
						}
					}
				}

				if(elemt.parentNode.parentNode){
					if(elemt.parentNode.parentNode.nodeName === 'A' || elemt.parentNode.parentNode.nodeName === 'a'){
						if(elemt.parentNode.parentNode.href && !elemt.parentNode.parentNode.getAttribute('data-no-popstate')){
							if(evts.stopPropagation){
								evts.stopPropagation();
							}
							if(evts.preventDefault){
								evts.preventDefault();
							}
							Boss.pushstate.goXHR(elemt.parentNode.parentNode.href, xhrfn, lockChangePageFn);
						}
					}
				}

				if(elemt.nodeName === 'BUTTON' || elemt.nodeName === 'button'){
					if(elemt.getAttribute('data-href')){
						Boss.pushstate.goXHR(elemt.getAttribute('data-href'), xhrfn, lockChangePageFn);
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
		goXHR: function(url, xhrfn, lockChangePageFn){

			if(lockChangePage === true){
				lockChangePageFn(url);
				return false;
			}

			history.pushState({}, '', url);
			var host = window.location.protocol+'//'+window.location.host;
			var controler = window.location.href.replace(host, '');
			xhrfn(controler);

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

					var finded = 0;

					for(x = 0; x < tlis; x++){
						if(typeof(lis[x].childNodes) !== 'undefined'){
							var tx = lis[x].getAttribute('data-value');
							if(exp.test(tx)){
								lis[x].classList.remove('hidden');
								finded = finded + 1;
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
			var selct = Boss.getById(selctString);
			var labl = Boss.getById('label-'+elemtString);

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

			labl.textContent = selct.options[selct.selectedIndex].textContent;
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
				li.innerHTML = '<input tabindex="-1" '+checkd+' type="radio"  name="'+elemtString+'" class="boss-comp-radio" value="'+lines[x].value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span>'+lines[x].innerHTML+'</label>';
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

					var finded = 0;

					for(x = 0; x < tlis; x++){
						if(typeof(lis[x].childNodes) !== 'undefined'){
							var tx = lis[x].getAttribute('data-value');
							if(exp.test(tx)){
								lis[x].classList.remove('hidden');
								finded = finded + 1;
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

									li.innerHTML = '<input tabindex="-1" type="radio" name="'+elemtString+'" class="boss-comp-radio" value="'+a.value+'" id="'+id+'"><label for="'+id+'"><span class="boss-comp-radio-span"></span>'+a.label+'</label>';
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
			if(confObj.today){
				today = confObj.today;
			}
			if(confObj.clear){
				clear = confObj.clear;
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
			mask += '<button type="button" id="clear-'+elemtString+'" tabindex="-1" class="btn btn-red float-left">'+confObj.clear+'</button>';
			mask += '<button type="button" id="today-'+elemtString+'" tabindex="-1" class="btn btn-green">'+confObj.today+'</button>';
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
		render: function(elemento){
			var elString = elemento;
			var ul = elemento;
			var lis, lisT, controlador;
			if(typeof(elemento) === 'string'){
				ul = Boss.getById(elemento);
			}
			lis = ul.getElementsByTagName('li');
			lisT = lis.length;

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
						lis[x].classList.add('ui-tabs-ativa');
					}else{
						Boss.getById(this.abas[elString][x]).classList.add('hidden');
						lis[x].classList.remove('ui-tabs-ativa');
					}
				}
			}else{
				for(x = 0; x < nAbas; x++){
					if(x == 0){
						Boss.getById(this.abas[elString][x]).classList.remove('hidden');
						lis[x].classList.add('ui-tabs-ativa');
					}else{
						Boss.getById(this.abas[elString][x]).classList.add('hidden');
						lis[x].classList.remove('ui-tabs-ativa');
					}
				}

			}

			/* CLICK EVENT */
			Boss.evts.add(Boss.evtTouch(), ul, function(evts){

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
						lis[x].classList.add('ui-tabs-ativa');
					}else{
						Boss.getById(Boss.tabs.abas[elString][x]).classList.add('hidden');
						lis[x].classList.remove('ui-tabs-ativa');
					}
				}
			});
		}
	}
}

Boss.validate = {
	rules: {
		cnpj: function(fld, parameter){

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
		cpf: function(fld, parameter){

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
        inteiro: function(value, parameter){

            if(value === ''){
                return true;
            }

            n = /^[0-9]+$/;
            if(!n.test(value)){
                return false;
            }

            n = /^[0]+/;
            if(n.test(value)){
                return false;
            }

            return true;
        },
		moeda: function(fld, parameter){

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
        decimal: function(value, parameter){

            if(value === ''){
                return true;
            }

            n = /^\d+(\.[\d]+)?$/;
            if(!n.test(value)){
                return false;
            }

            return true;
        },
		cep: function(fld, parameter){

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

			if(lengt < 2){
				var value = fld[0].value;
				if(value === ''){
					return false;
				}
			/* go to minSelection and maxSelection rules, if exists */
			}else{
				return true;
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
		url: function(fld, parametro) {

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
		igual: function(value, parameters){
			var igual = Boss.getName(parametro)[0];
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
        maiorId: function(value, parameters){
            var igual = Boss.getById(parametro);
            if(parseFloat(value) > parseFloat(igual.value)){
                return true;
            }
            return false;
        },
        maiorIgualId: function(value, parameter){
            var maiorigualid = Boss.getById(parametro);
            if(parseFloat(value) >= parseFloat(maiorigualid.value)){
                return true;
            }
            return false;
        },
        maiorIdNull: function(value, parameter){
            var igual = Boss.getById(parametro);
            if(parseFloat(value) >= parseFloat(igual.value) || igual.value == ''){
                return true;
            }
            return false;
        },
        maior: function(value, parameter){
            if(parseFloat(value) > parseFloat(parametro)){
                return true;
            }
            return false;
        },
        maiorIgual: function(value, parameter){
            if(parseFloat(value) >= parseFloat(parametro.value)){
                return true;
            }
            return false;
        },
        menor: function(value, parameter){
            if(parseFloat(value) < parseFloat(parametro.value)){
                return true;
            }
            return false;
        },
        menorIgual: function(value, parameter){
            if(parseFloat(value) <= parseFloat(parametro)){
                return true;
            }
            return false;
        },
        maiorNuloId: function(value, parameter){
            var igual = Boss.getById(parametro);
            if(parseFloat(value) >= parseFloat(igual.value) || value === ''){
                return true;
            }
            return false;
        },
        diferente: function(value, parameter){
            if(value !== parametro){
                return true;
            }
            return false;
        },
        diferenteId: function(value, parameter){
            var diff = Boss.getById(parametro);
            if(value !== diff.value || value === ''){
                return true;
            }
            return false;
        },
		tamanhoMaximo: function(fld, parameter){

			var value = '';
			var lengt = fld.length;

			if(lengt < 2){
				value = fld[0].value;
				if(value === ''){
					return true;
				}
			}

			if(value.length <= parameter.tamanhoMaximo){
				return false;
			}
			return true;

		},
        tamanhoMinimo: function(value, parameter){
            var tam = parseInt(fld);
            if(value.length < tam){
                return false;
            }
            return true;
        },
        sicredi: function(value, parameter){

            n = /^\d+?$/;
            if(!n.test(value)){
                return false;
            }

            if(value.length !== 7){
                return false;
            }
            return true;
        },
		banrisul: function(value, parameter){

			n = /^\d+?$/;
			if(!n.test(value)){
				return false;
			}

			if(value.length !== 7){
				return false;
			}
			return true;
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
						if(Boss.inArray(fld[f].type,parameters.fileMimeTypes) === false){
							return false;
						}
					}
				}
			}
			return true;
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

						fld[0].parentNode.classList.add(classError);
						fld[0].parentNode.classList.remove(classOk);
						
						/* BREAK LOOPS */
						return false;

						/* BREAK LOOPS */
						break;
					}else{
						fld[0].parentNode.classList.add(classOk);
						fld[0].parentNode.classList.remove(classError);
					}
				}else{
					console.warn('The rule "'+r+'" don\'t exists.');
				}
			}
		}
		return true;
	},
	process: function(form, evts){

		var frm = Boss.getById(form);
		var tFrm = frm.length;

		var statusValidate = true;

		if(evts.type === 'blur' || evts.type === 'change' || evts.type === 'keyup'){

			var fld = Boss.targt(evts);
			var nme = fld.getAttribute('name');

			/* IF NAME EXISTS */
			if(typeof(this.frmsMemory[form]['fields'][nme]) !== 'undefined'){
				this.processField(form, nme, this.frmsMemory[form]['fields'][nme].rules, evts.type);
			}

		/* SUBMIT */
		}else if(evts.type === 'submit'){
			
			var fld = Boss.targt(evts);

			/* ACROSS FIELDS */
			for(x in this.frmsMemory[form].names){

				var nme = this.frmsMemory[form].names[x];

				/* IF NAME EXISTS */
				if(typeof(this.frmsMemory[form]['fields'][nme]) !== 'undefined'){

					var tmStatus = this.processField(form, nme, this.frmsMemory[form]['fields'][nme].rules, evts.type);
					/* BREAK TRUE */
					if(statusValidate === true && tmStatus === false){
						statusValidate = tmStatus;
					}
				}

			}
		}

		return statusValidate;

	},
	frmsMemory: {},
	init: function(obj){

		if(Boss.getById(obj.config.formId)){

			var formid = obj.config.formId;
			var frm = Boss.getById(formid);
			var tFrm = frm.length;

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
}