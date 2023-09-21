/* global jQuery */

(function($) {

	'use strict';

	var app;

	/**
	 * @typedef App
	 */

	function App() {
		this.controllers = {};
		this.services = {};
	}

	/**
	 * @memberOf App
	 */
	App.prototype.start = function() {
		var $nodes = $('[data-dc-app]').addBack('[data-dc-app]');

		this.compilePlugins($nodes);
	};

	App.prototype.compilePlugins = function($nodes) {
		var $elements = $nodes.find('[data-plugin]').addBack('[data-plugin]');

		$elements.each(function(index, element) {
			var $element = $(element),
				pluginName = $element.data('plugin');

			if ($.fn[pluginName]) {
				$element[pluginName]();

				return;
			}

		});
	};

	/**
	 * @memberOf App
	 * @param {string} name
	 * @param {*} component
	 * @param {*} componentStorage
	 * @returns {*}
	 */
	App.prototype.component = function(name, component, componentStorage) {
		var registeredComponent = componentStorage[name];

		if (component) {
			if (registeredComponent) {
				throw '{name} is already registered'.replace('{name}', name);
			}

			componentStorage[name] = component;

			return;
		}

		if (!registeredComponent) {
			throw '{name} is not registered'.replace('{name}', name);
		}

		return registeredComponent;
	};

	/**
	 * @memberOf App
	 * @param {string} name
	 * @param {*} [controller]
	 * @returns {*}
	 */
	App.prototype.controller = function (name, controller) {
		return this.component(name, controller, this.controllers);
	};

	/**
	 * @memberOf App
	 * @param {string} name
	 * @param {*} [service]
	 * @returns {*}
	 */
	App.prototype.service = function (name, service) {
		return this.component(name, service, this.services);
	};

	app = new App();

	$(function() {
		app.start();
	});

	window.dcApp = app;

	// Immediate execution preliminary to modules.

})(jQuery);

/* global _, jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp
	);
}(function(_, $, app) {

	'use strict';

	/**
	 * @class
	 * @param {jQuery} $element
	 * @param {*} [options]
	 * @constructor
	 */
	function Animate($element, options) {
		var defaults = {
			showClass: 'show',
			animateClass: 'animate',
			duration: 350
		};

		if ($element.length > 1) {
			throw 'Only animate one element at a time.';
		}

		this.$element = $element;
		this.options = $.extend({}, defaults, options);
	}

	Animate.prototype.in = function() {
		var self = this,
			element = this.$element.get(0);

		this.$element.addClass(this.options.showClass);

		if (element.animatePromise) {
			window.clearTimeout(this.promise);
		}

		element.animatePromise = window.setTimeout(function() {
			delete element.animatePromise;

			self.$element.addClass(
				self.options.animateClass
			);
		}, 50);
	};

	/**
	 * @param {function} [callback]
	 */
	Animate.prototype.out = function(callback) {
		var self = this,
			element = this.$element.get(0);

		if (!element) {
			callback && callback();
			return;
		}

		this.$element.removeClass(
			this.options.animateClass
		);

		if (element.animatePromise) {
			window.clearTimeout(element.animatePromise);
		}

		element.animatePromise = window.setTimeout(function() {
			delete element.animatePromise;

			self.$element.removeClass(
				self.options.showClass
			);

			callback && callback();
		}, this.options.duration);
	};

	app.service('Animate', Animate);

}));

/* global _, jQuery, autoComplete */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp,
		autoComplete
	);
}(function(_, $, app, AutoComplete) {

	'use strict';

	app.service(
		'AutoComplete',
		/**
		 * @param {*} options
		 */
		function(options) {
			var menuClass,
				defaults,
				setup;

			defaults = {
				minChars: 3
			};

			setup = $.extend({}, defaults, options);
			menuClass = setup.customClass || '';

			if (!setup.url) {
				return;
			}

			/*
			 * @link @link https://goodies.pixabay.com/javascript/auto-complete/demo.html
			 */
			new AutoComplete({
				selector: setup.selector,
				minChars: setup.minChars,
				menuClass: menuClass,
				source: function(term, suggest) {
					$.getJSON(
						setup.url.replace('{queue}', term),
						function(response) {
							var data = setup.responseHook
								? setup.responseHook(response)
								: response;

							suggest(data);
						}
					);
				}
			});
		}
	);

}));


/* global _, jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp
	);
}(function(_, $, app) {

	'use strict';

	var $body = $('body');

	/**
	 * @typedef {Object} BodyScrolling
	 * @property {function} disable
	 * @property {function} enable
	 */

	app.service('BodyScrolling', {
		disable: function() {
			$body.addClass('body-no-scroll');
		},
		enable: function() {
			$body.removeClass('body-no-scroll');
		},
		toggle: function() {
			$body.toggleClass('body-no-scroll');
		}
	});

}));

/* global _, jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp
	);
}(function(_, $, app) {

	'use strict';

	var $document = $(document),
		$window = $(window);

	/**
	 * @typedef {Object} BrowserEvents
	 * @property {function} on
	 * @property {function} off
	 */

	/*
	 * Usage with "resize" or "scroll":
	 * var handle = BrowserEvents.on('resize', function () {});
	 * BrowserEvents.off('resize', handle);
	 */

	app.service('BrowserEvents', {
		/**
		 * @param {string} type
		 * @param {function} callback
		 */
		on: function(type, callback) {
			var handle;

			if (type === 'scroll') {
				handle = _.throttle(callback, 250, { leading: false });
				$document.on('scroll', handle);
			}
			else if (type === 'resize') {
				handle = _.debounce(callback, 100);
				$window.on('resize', handle);
			}

			return handle;
		},
		/**
		 * @param {string} type
		 * @param {function} callback
		 */
		off: function(type, callback) {
			if (type === 'scroll') {
				$document.off('scroll', callback);
			}
			else if (type === 'resize') {
				$window.off('resize', callback);
			}
		}
	});

}));

/* global _, jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp
	);
}(function(_, $, app) {

	'use strict';

	var dataContainer = {};

	/**
	 * @typedef {Object} DataContainer
	 */

	app.service('DataContainer', {
		/**
		 * @memberOf DataContainer
		 * @param {string} namespace
		 * @param {*} data
		 */
		set: function(namespace, data) {
			dataContainer[namespace] = data;
		},
		/**
		 * @memberOf DataContainer
		 * @param {string} namespace
		 * @returns {*}
		 */
		get: function(namespace) {
			return dataContainer[namespace];
		}
	});

}));

/* global _, jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp
	);
}(function(_, $, app) {

	'use strict';

	var service = {},
		callbacks = {};

	/**
	 * Registers a click action under the give name(space) to enable
	 * interception using this name(space).
	 *
	 * @param {string} namespace
	 * @param {function} callback
	 */
	service.on = function(namespace, callback) {
		var message;

		if (callbacks[namespace]) {
			message = 'Callback "{namespace}" already registered. Forgot to release it previously?';

			console.log(
				message.replace('{namespace}', namespace)
			);
		}

		callbacks[namespace] = callback;
	};

	/**
	 * @param {string} namespace
	 */
	service.off = function(namespace) {
		delete callbacks[namespace]; // Allow garbage collection of connected scope.
	};

	/**
	 * Checks if the given name(space) already has a registered callback.
	 *
	 * @param {string} namespace
	 */
	service.has = function(namespace) {
		return !!callbacks[namespace];
	};

	/**
	 * Trigger callback execution for all registered actions
	 * except the intercepted ones.
	 *
	 * @param {Event} event
	 */
	service.trigger = function(event) {
		_.each(callbacks, function(callback) {
			if (callback.eventBubblingIntercept) {
				delete callback.eventBubblingIntercept;
			}
			else {
				callback(event);
			}
		});
	};

	/**
	 * Intercepts click callback for given name(space).
	 *
	 * @param {string} namespace
	 */
	service.intercept = function(namespace) {
		var message;

		if (callbacks[namespace]) {
			callbacks[namespace].eventBubblingIntercept = true;

			return;
		}

		message = 'No callback registered for namespace "{namespace}" and thus cannot be intercepted.';

		console.log(
			message.replace('{namespace}', namespace)
		);
	};

	app.service('EventBubbling', service);


	$('[data-event-bubbling]').on('click touch', service.trigger);
	$('[data-event-bubbling-intercept]').on('click touch', function() {
		var namespace = $(this).data('event-bubbling-intercept');
		service.intercept(namespace);
	});

}));

/* global _, jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp
	);
}(function(_, $, app) {

	'use strict';

	var listeners = {};

	/**
	 * @typedef {Object} EventHub
	 * @property {function} on
	 * @property {function} trigger
	 */

	app.service('EventHub', {
		/**
		 * @param {string} event name of the main event.
		 * @param {string} token name of the token to react with "truePart".
		 * @param {function} truePart
		 * @param {function} falsePart
		 */
		on: function(event, token, truePart, falsePart) {
			if (!listeners[event]) {
				listeners[event] = [];
			}

			listeners[event].push({
				token: token,
				truePart: truePart || function() {},
				falsePart: falsePart || function() {}
			});
		},

		trigger: function(event, token, payload) {
			$.each(listeners[event], function(index, listener) {
				listener.token === token
					? listener.truePart(payload)
					: listener.falsePart(payload);
			});
		}
	});

}));

/* global _, jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp,
		window.dcApp.service('EventHub'),
		window.dcApp.service('BrowserEvents')
	);
}(function(_, $, app, EventHub, BrowserEvents) {

	'use strict';

	var service,
		$breakpoints = $('.component-breakpoint .breakpoint'),
		breakpoints = {
			xs: '.breakpoint-xs',
			sm: '.breakpoint-sm',
			md: '.breakpoint-md',
			lg: '.breakpoint-lg',
			xl: '.breakpoint-xl'
		},
		breakpointList = Object.keys(breakpoints),
		currentBreakpoint,
		lastBreakpoint;

	service = {

		/**
		 * @param {string} breakpoint [xs, sm, md, lg, xl]
		 * @returns {boolean}
		 */
		is: function(breakpoint) {
			return $breakpoints.filter(breakpoints[breakpoint]).is(':visible');
		},

		/**
		 * @param {string} breakpoint including
		 * @returns {boolean}
		 */
		from: function(breakpoint) {
			var index = breakpointList.indexOf(breakpoint),
				keys = breakpointList.slice(index),
				list = [],
				selectors;

			_.each(keys, function(key) {
				list.push(breakpoints[key]);
			});

			selectors = list.join(',');

			return $breakpoints.filter(selectors).is(':visible');
		},

		/**
		 * @param {string} breakpoint excluding
		 * @returns {boolean}
		 */
		to: function(breakpoint) {
			return !this.from(breakpoint);
		},

		/**
		 * @param {string} breakpointFrom including
		 * @param {string} breakpointTo excluding
		 * @returns {boolean}
		 */
		fromTo: function(breakpointFrom, breakpointTo) {
			return(
				this.from(breakpointFrom) &&
				this.to(breakpointTo)
			);
		},

		/**
		 * Returns current Breakpoint
		 * @returns (string)
		 */
		getCurrentBreakpoint: function() {
			return $('.component-breakpoint .breakpoint:visible').data('breakpoint');
		},

		/**
		 * Returns when the Breakpoint has changed
		 * @returns (boolean)
		 */
		_hasBreakPointChanged: function() {
			var breakpoint = this.getCurrentBreakpoint();

			if (breakpoint !== currentBreakpoint) {
				lastBreakpoint = currentBreakpoint;
				currentBreakpoint = breakpoint;

				return true;
			}
			return false;
		},

		/**
		 * Modules use this Function to register to the Change Event
		 * @param callback
		 */
		onBreakPointChange: function(callback) {
			EventHub.on('break-point', 'change', callback);
		}
	};

	BrowserEvents.on('resize', function() {
		if (service._hasBreakPointChanged()) {
			EventHub.trigger('break-point', 'change');
		}
	});

	/**
	 * @typedef {Object} Breakpoint
	 * @property {function} is
	 */

	app.service('Breakpoint', service);
}));

/* globals jQuery */

/*
 * Global events service to decouple components.
 */
(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp
	);
}(function(_, $, app) {

	'use strict';

	var listeners = {},
		service = {};

	/**
	 * @typedef {Object} GlobalEvents
	 * @property {function} on
	 * @property {function} trigger
	 * @property {function} off
	 * @property {function} clear
	 */

	/**
	 * @param {string} event
	 * @param {function} callback
	 */
	service.on = function(event, callback) {
		if (!listeners[event]) {
			listeners[event] = [];
		}

		listeners[event].push(callback);
	};

	/**
	 * @param {string} event
	 * @param {*} [data]
	 */
	service.trigger = function(event, data) {
		$.each(listeners[event], function(index, callback) {
			callback(data);
		});
	};

	/**
	 * @param {string} event
	 * @param {function} callback pointer to remove.
	 */
	service.off = function(event, callback) {
		var index;

		if (!listeners[event]) {
			return;
		}

		index = listeners[event].indexOf(callback);

		if (index > -1) {
			listeners[event].splice(index, 1);
		}
	};

	/**
	 * Resets all listeners.
	 */
	service.clear = function() {
		listeners = {};
	};

	app.service('GlobalEvents', service);

	$.globalEvents = service;

}));


// @TODO Move into own service file and/or replace with event bubbling system.

/**
 * Function to detect clicks outside of an element. Should be added if flyout is open and removed if flyout is closed to prevent performance problems
 *
 * @param {DOMElement} element - Element to check for in- or outside
 * @param {Boolean} bind - binds or unbinds click event
 * @param {Function} runOnClick - function to be called if user clicked outside
 */
window.bindOutsideClick = function(element, bind, runOnClick) {
	if (bind) {
		window.runOnOutsideClick = runOnClick;
		element.addEventListener('click', window.stopClickPropagation);
		document.addEventListener('click', outsideClick);

		element.addEventListener('touchstart', window.stopClickPropagation);
		document.addEventListener('touchstart', outsideClick);
	}
	else {
		window.runOnOutsideClick = null;
		document.removeEventListener('click', outsideClick);
		element.removeEventListener('click', window.stopClickPropagation);

		document.removeEventListener('touchstart', outsideClick);
		element.removeEventListener('touchstart', window.stopClickPropagation);
	}
};

window.stopClickPropagation = function(event){return event.stopPropagation()};
window.runOnOutsideClick = null;

function outsideClick() {
	if (window.runOnOutsideClick && typeof window.runOnOutsideClick === 'function') {
		window.runOnOutsideClick();
	}
}


/**
 * Window scroll event for e.g. sticky navigation. Fires custom event "window:scrollstart" and "window:scrollend"
 * @event scroll
 * @param {Event}
 */
window.oldScrollY = window.pageYOffset; // saves old scroll position to compare on scroll
window.minScrollDelta = 100; // delta user has to be scrolled to trigger events
window.scrollStart = true; // if scrolling just startet
window.scrollTimeout = null; // timeout for detecting scroll ending

window.addEventListener('scroll', function(event) {
	var scrollPosY = window.pageYOffset,
		scrollDelta = scrollPosY - window.oldScrollY,
		direction = null;

	/* Events are only triggered if user scrolled min delta pixels */
	if (Math.abs(scrollDelta) >= window.minScrollDelta) {

		/* Check for scroll direction */
		if (scrollDelta > 0) {
			direction = 'down';
		}
		else if (scrollDelta < 0) {
			direction = 'up';
		}

		/* Bind scroll event for scroll startet and triggers it for modules */
		if (window.scrollStart) {
			var scrollStart = new CustomEvent('window:scrollstart', {
				detail: {
					scrollDirection: direction
				}
			});
			window.dispatchEvent(scrollStart);
		}

		// save new scroll position for direction changes
		window.oldScrollY = scrollPosY;
		window.scrollStart = false;

		window.clearTimeout(window.scrollTimeout);
	}

	/* Bind timeout and scroll event for scroll ended and triggers it for modules */
	window.scrollTimeout = window.setTimeout(function() {
		// trigger scroll end only if specific delta was scrolled
		if (Math.abs(scrollDelta) >= window.minScrollDelta) {
			var scrollEnd = new CustomEvent('window:scrollend', {
				detail: {
					scrollDirection: direction
				}
			});
			window.dispatchEvent(scrollEnd);
			window.scrollStart = true;
		}
	}, 250);
});

/* globals jQuery */

/*
 * Global events service to decouple components.
 */
(function (factory) {
	factory(
		_,
		jQuery,
		window.dcApp
	);
}(function (_, $, app) {

	'use strict';

	var service = {};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} closest
	 */

	/**
	 * @param {object} element
	 * @param {string} selector
	 * @param {string} stop
	 */
	service.closestParent = function (element, selector, stop) {
		if (!element || !element.parentElement) {
			return null;
		} else if (stop && element.parentElement.matches(stop)) {
			return null;
		} else if (element.parentElement.matches(selector)) {
			return element.parentElement;
		} else {
			return service.closestParent(element.parentElement, selector, stop);
		}
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} getUrlParameter
	 */

	/**
	 * @param {string} urlparam
	 */
	service.getUrlParameter = function (urlparam) {
		urlparam = urlparam.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + urlparam + '=([^&#]*)');
		// var regex = new RegExp('[\\?|&]' + parameter.toLowerCase() + '=([^&#]*)');
		var results = regex.exec(location.search);
		// var results = regex.exec('?' + url.toLowerCase().split('?')[1]);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} setUrlParameter
	 */

	/**
	 * @param {string} parameter
	 * @param {string} value
	 * @param {string} url
	 */
	service.setUrlParameter = function (parameter, value, url) {
		var key = encodeURIComponent(parameter),
			val = encodeURIComponent(value);

		if (!url) {
			url = location.href;
		}

		var baseUrl = url.split('?')[0],
			newParam = key + '=' + val,
			params = '?' + newParam,
			urlQueryString;

		if (url.split('?')[1] === undefined) { // if there are no query strings, make urlQueryString empty
			urlQueryString = '';
		} else {
			urlQueryString = '?' + url.split('?')[1];
		}

		// If the "search" string exists, then build params from it
		if (urlQueryString) {
			var updateRegex = new RegExp('([\?&])' + key + '[^&]*');
			var removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');

			if (val === undefined || val === null || val === '') { // Remove param if value is empty
				params = urlQueryString.replace(removeRegex, "$1");
				params = params.replace(/[&;]$/, "");

			} else if (urlQueryString.match(updateRegex) !== null) { // If param exists already, update it
				params = urlQueryString.replace(updateRegex, "$1" + newParam);

			} else if (urlQueryString === '') { // If there are no query strings
				params = '?' + newParam;
			} else { // Otherwise, add it to end of query string
				params = urlQueryString + '&' + newParam;
			}
		}

		// no parameter was set so we don't need the question mark
		params = params === '?' ? '' : params;

		return baseUrl + params;
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} getOffset
	 */

	/**
	 * @param {object} element
	 */
	service.getOffset = function (element) {
		var xPos = 0;
		var yPos = 0;

		while (element) {
			if (element.tagName === "BODY") {
				var xScroll = element.scrollLeft || document.documentElement.scrollLeft;
				var yScroll = element.scrollTop || document.documentElement.scrollTop;

				xPos += element.offsetLeft - xScroll + element.clientLeft;
				yPos += element.offsetTop - yScroll + element.clientTop;
			} else {
				xPos += element.offsetLeft - element.scrollLeft + element.clientLeft;
				yPos += element.offsetTop - element.scrollTop + element.clientTop;
			}

			element = element.offsetParent;
		}
		return {
			x: xPos,
			y: yPos
		};
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} compareValues
	 */

	/**
	 * @param {string} key
	 * @param {string} order
	 */
	service.compareValues = function (key, order) {
		return function (a, b) {
			if (!a.hasOwnProperty(key) ||
				!b.hasOwnProperty(key)) {
				return 0;
			}

			var varA,
				varB;

			if (typeof a[key] === 'string') {
				varA = a[key].toUpperCase();
			} else {
				varA = a[key];
			}

			if (typeof b[key] === 'string') {
				varB = b[key].toUpperCase();
			} else {
				varB = b[key];
			}

			var comparison = 0;
			if (varA > varB) {
				comparison = 1;
			} else if (varA < varB) {
				comparison = -1;
			}
			if (order === 'desc') {
				return comparison * -1;
			} else {
				return comparison;
			}
		};
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} scrollToTop
	 */

	/**
	 * @param {string} scrollDuration
	 */
	service.scrollToTop = function (scrollDuration) {
		var cosParameter = window.pageYOffset / 2,
			scrollCount = 0,
			oldTimestamp = performance.now();

		function step(newTimestamp) {
			scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
			if (scrollCount >= Math.PI) {
				window.scrollTo(0, 0);
			}
			if (window.pageYOffset === 0) {
				return;
			}
			window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
			oldTimestamp = newTimestamp;
			window.requestAnimationFrame(step);
		}

		window.requestAnimationFrame(step);
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} parseQueryArray
	 */

	/**
	 * @param {object} queryArr
	 */
	service.parseQueryArray = function (queryArr) {
		var resultArr = [];

		if (Array.isArray(queryArr)) {
			for (var c = 0; c < queryArr.length; c++) {
				if (queryArr.length > 0) {
					for (var key in queryArr[c]) {
						if (queryArr[c].hasOwnProperty(key)) {
							resultArr.push(key + '=' + queryArr[c][key]);
						}
					}
				}
			}
			return resultArr;
		}
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} startProgressIcon
	 */

	/**
	 * @param {object} selector
	 */
	service.startProgressIcon = function (selector) {
		selector.classList.add('loading');
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} stopProgressIcon
	 */

	/**
	 * @param {object} selector
	 */
	service.stopProgressIcon = function (selector) {
		selector.classList.remove('loading');
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} parseDate
	 */

	/**
	 * @param {string} input
	 */
	service.parseDate = function (input) {
		var parts = input.split('-');
		// new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
		return new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} slideUp
	 */

	/**
	 * @param {object} target
	 * @param {int} duration
	 * @param {string} className
	 */
	service.slideUp = function (target, duration, className) {
		if (duration === void 0) {
			duration = 500;
		}

		if (className) {
			target.classList.remove(className);
		}

		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.boxSizing = 'border-box';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(function () {
			target.style.display = 'none';
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property'); //alert("!");
		}, duration);
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} slideDown
	 */

	/**
	 * @param {object} target
	 * @param {int} duration
	 * @param {string} className
	 * @param {boolean} flex
	 */
	service.slideDown = function (target, duration, className, flex) {
		var displayStyle;

		if (duration === void 0) {
			duration = 500;
		}

		if (className) {
			target.classList.add(className);
		}

		if (flex) {
			displayStyle = 'flex';
		} else {
			displayStyle = 'block';
		}

		target.style.removeProperty('display');
		var display = window.getComputedStyle(target).display;
		if (display === 'none') display = 'block';
		target.style.display = displayStyle;
		var height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.boxSizing = 'border-box';
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(function () {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
		}, duration);
	};

	/**
	 * @typedef {Object} GlobalFunctions
	 * @property {function} slideDown
	 */

	/**
	* @param {object} target
	* @param {int} duration
	* @param {string} className
	* @param {boolean} flex
	*/
	service.slideToggle = function (target, duration, className, flex) {
		if (duration === void 0) {
			duration = 500;
		}

		if (window.getComputedStyle(target).display === 'none') {
			return service.slideDown(target, duration, className, flex);
		} else {
			return service.slideUp(target, duration, className);
		}
	};

	app.service('GlobalFunctions', service);

	$.GlobalFunctions = service;

}));

/* globals jQuery, rivets */

/*
 * Global rivets JS events, bindings, formatters...
 */
(function (factory) {
	factory(
		_,
		jQuery,
		rivets,
		window.dcApp.service('GlobalFunctions')
	);
}(function (_, $, rivets, GlobalFunctions) {

	'use strict';

	/**
	 * Formatters
	 */
	rivets.formatters['='] = function (val, arg) {
		return val === arg;
	};

	rivets.formatters['>'] = function (val, arg) {
		return val > arg;
	};

	rivets.formatters['<'] = function (val, arg) {
		return val < arg;
	};

	rivets.formatters['+'] = function (val, arg) {
		return val + arg;
	};

	rivets.formatters.activeAmount = function (val, arg) {
		var activeNum = GlobalFunctions.getUrlParameter('num');
		return !(arg === parseInt(activeNum));
	};

	rivets.formatters.args = function (fn) {
		var args = Array.prototype.slice.call(arguments, 1);
		return function () {
			return fn.apply(null, args);
			// return fn.apply(this, Array.prototype.concat.call(arguments, args));
		};
	};

	rivets.formatters.attribute = function (oid, gid, prefix, suffix) {
		var propA, propB, propC, propD;

		if (typeof oid !== 'undefined') {
			if (typeof oid === 'number') {
				propA = '_' + oid.toString();
			} else {
				propA = '_' + oid.toLowerCase();
			}
		} else {
			propA = '';
		}

		if (typeof gid !== 'undefined') {
			if (typeof gid === 'string') {
				propB = '_' + gid.toLowerCase();
			} else {
				propB = '_' + gid;
			}
		} else {
			propB = '';
		}

		if (typeof prefix !== 'undefined') {
			if (typeof prefix === 'string') {
				propC = prefix.toLowerCase();
			} else {
				propC = prefix;
			}
		} else {
			propC = '';
		}

		if (typeof suffix !== 'undefined') {
			if (typeof suffix === 'string') {
				propD = '_' + suffix.toLowerCase();
			} else {
				propD = '_' + suffix;
			}
		} else {
			propD = '';
		}

		return propC + propB + propA + propD;
	};

	rivets.formatters.eq = function (val, arg) {
		if (typeof arg !== 'undefined') {
			var temp = arg.split(',');
			for (var i = 0; i < temp.length; i++) {
				if (parseInt(val, 10) === parseInt(temp[i], 10)) {
					return true;
				}
			}
		}
	};

	rivets.formatters.generateUrlFromSearchParam = function (val) {
		var currentUrl = window.location.href;

		if (currentUrl.indexOf('q=') > -1 && val !== 'undefined') {
			return currentUrl.replace(GlobalFunctions.getUrlParameter('q'), val);
		}
	};

	rivets.formatters.highlight = function (text) {
		var regExp = /<b>(\b[A-Za-z0-9_äÄöÖüÜß]*\b)<\/b>/gi,
			replace = '<mark>$1</mark>';

		return text.replace(regExp, replace);
	};

	rivets.formatters.id = function (val, arg, comp) {
		var diacriticsMap = [
			{
				'base': 'A',
				'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
			},
			{'base': 'AA', 'letters': /[\uA732]/g},
			{'base': 'AE', 'letters': /[\u00C4\u00C6\u01FC\u01E2]/g},
			{'base': 'AO', 'letters': /[\uA734]/g},
			{'base': 'AU', 'letters': /[\uA736]/g},
			{'base': 'AV', 'letters': /[\uA738\uA73A]/g},
			{'base': 'AY', 'letters': /[\uA73C]/g},
			{'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
			{'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
			{
				'base': 'D',
				'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
			},
			{'base': 'DZ', 'letters': /[\u01F1\u01C4]/g},
			{'base': 'Dz', 'letters': /[\u01F2\u01C5]/g},
			{
				'base': 'E',
				'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
			},
			{'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
			{
				'base': 'G',
				'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
			},
			{
				'base': 'H',
				'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
			},
			{
				'base': 'I',
				'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
			},
			{'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g},
			{
				'base': 'K',
				'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
			},
			{
				'base': 'L',
				'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
			},
			{'base': 'LJ', 'letters': /[\u01C7]/g},
			{'base': 'Lj', 'letters': /[\u01C8]/g},
			{'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
			{
				'base': 'N',
				'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
			},
			{'base': 'NJ', 'letters': /[\u01CA]/g},
			{'base': 'Nj', 'letters': /[\u01CB]/g},
			{
				'base': 'O',
				'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
			},
			{'base': 'OE', 'letters': /[\u00D6\u0152]/g},
			{'base': 'OI', 'letters': /[\u01A2]/g},
			{'base': 'OO', 'letters': /[\uA74E]/g},
			{'base': 'OU', 'letters': /[\u0222]/g},
			{'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
			{'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
			{
				'base': 'R',
				'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
			},
			{
				'base': 'S',
				'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
			},
			{
				'base': 'T',
				'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
			},
			{'base': 'TZ', 'letters': /[\uA728]/g},
			{
				'base': 'U',
				'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
			},
			{'base': 'UE', 'letters': /[\u00DC]/g},
			{'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
			{'base': 'VY', 'letters': /[\uA760]/g},
			{'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
			{'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
			{
				'base': 'Y',
				'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
			},
			{
				'base': 'Z',
				'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
			},
			{
				'base': 'a',
				'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
			},
			{'base': 'aa', 'letters': /[\uA733]/g},
			{'base': 'ae', 'letters': /[\u00E4\u00E6\u01FD\u01E3]/g},
			{'base': 'ao', 'letters': /[\uA735]/g},
			{'base': 'au', 'letters': /[\uA737]/g},
			{'base': 'av', 'letters': /[\uA739\uA73B]/g},
			{'base': 'ay', 'letters': /[\uA73D]/g},
			{'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
			{
				'base': 'c',
				'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
			},
			{
				'base': 'd',
				'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
			},
			{'base': 'dz', 'letters': /[\u01F3\u01C6]/g},
			{
				'base': 'e',
				'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
			},
			{'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
			{
				'base': 'g',
				'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
			},
			{
				'base': 'h',
				'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
			},
			{'base': 'hv', 'letters': /[\u0195]/g},
			{
				'base': 'i',
				'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
			},
			{'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
			{
				'base': 'k',
				'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
			},
			{
				'base': 'l',
				'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
			},
			{'base': 'lj', 'letters': /[\u01C9]/g},
			{'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
			{
				'base': 'n',
				'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
			},
			{'base': 'nj', 'letters': /[\u01CC]/g},
			{
				'base': 'o',
				'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
			},
			{'base': 'oe', 'letters': /[\u00F6\u0153]/g},
			{'base': 'oi', 'letters': /[\u01A3]/g},
			{'base': 'ou', 'letters': /[\u0223]/g},
			{'base': 'oo', 'letters': /[\uA74F]/g},
			{'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
			{'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
			{
				'base': 'r',
				'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
			},
			{
				'base': 's',
				'letters': /[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
			},
			{'base': 'ss', 'letters': /[\u00DF]/g},
			{
				'base': 't',
				'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
			},
			{'base': 'tz', 'letters': /[\uA729]/g},
			{
				'base': 'u',
				'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
			},
			{'base': 'ue', 'letters': /[\u00FC]/g},
			{'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
			{'base': 'vy', 'letters': /[\uA761]/g},
			{'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
			{'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
			{
				'base': 'y',
				'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
			},
			{
				'base': 'z',
				'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
			}
		];

		var formattedString;

		for (var i = 0; i < diacriticsMap.length; i++) {
			formattedString = val.replace(diacriticsMap[i].letters, diacriticsMap[i].base);
			val = formattedString.replace(/ /g, '_').toLowerCase();
		}

		if (comp) {
			return val + '_' + arg + '_' + comp;
		} else {
			return val + '_' + arg;
		}
	};

	rivets.formatters.itemAt = function (val, index) {
		if (!(val && val instanceof Array)) {
			return null; // throw some error if required
		}
		return val[index || 0];
	};

	rivets.formatters.length = function (val) {
		return val ? (val.length || 0) : 0;
	};

	rivets.formatters.limit = function (el, arg) {
		if (el && el.length > arg) {
			return true;
		}
	};

	rivets.formatters.maxPages = function (val) {
		return Math.ceil(val / GlobalFunctions.getUrlParameter('num'));
	};

	rivets.formatters.negate = function (val) {
		return !val;
	};

	rivets.formatters.property = function (val, arg) {
		var query = decodeURIComponent(val);
		var key = query.split('dnavs=').pop().split(':')[0];
		var value = query.split(':').pop().split('&')[0];
		if (arg) {
			return key.toLowerCase() + '-' + value.toLowerCase() + arg;
		} else {
			return key.toLowerCase() + '-' + value.toLowerCase();
		}
	};

	rivets.formatters.visibleCheck = function (value1, value2, value3) {
		if (value1 === value2 && !value3) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Binders
	 */
	rivets.binders.searchValue = function (el, value) {
		el.value = value;
	};
}));

/* global _ */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp
	);
}(function(_, $, app) {

	'use strict';

	/**
	 * This controller may be moved to a service file to be re-used.
	 *
	 * @typedef ProductSelectController
	 * @param {*} data
	 * @param {function} onTechnologyChanged
	 * @param {function} onProductChanged
	 * @constructor
	 */
	function ProductSelectController(data, onTechnologyChanged, onProductChanged) {
		this.data = data;
		this.onTechnologyChanged = onTechnologyChanged;
		this.onProductChanged = onProductChanged;
	}

	/**
	 * @memberOf ProductSelectController
	 * @param {Event} event
	 * @param {ProductSelectController} scope
	 */
	ProductSelectController.prototype.technologyChanged = function(event, scope) {
		scope.data.products.selectedItemId = null;
		scope.data.products.collection = null;

		_.each(scope.data.products.collectionList, function(item) {
			var collectionId = String(item.id),
				selectedItemId = String(scope.data.technologies.selectedItemId);

			if (collectionId === selectedItemId) {
				scope.data.products.collection = item.collection;
				return false;
			}
		});

		scope.onTechnologyChanged();
	};

	/**
	 * @memberOf ProductSelectController
	 * @param {Event} event
	 * @param {ProductSelectController} scope
	 */
	ProductSelectController.prototype.productChanged = function(event, scope) {
		scope.onProductChanged();
	};

	/**
	 * @memberOf ProductSelectController
	 * @returns {string|undefined}
	 */
	ProductSelectController.prototype.getUrl = function() {
		var scope = this,
			item;

		item = _.find(scope.data.products.collection, function(item) {
			var itemId = String(item.id),
				selectedItemId = String(scope.data.products.selectedItemId);

			return itemId === selectedItemId;
		});

		return item
			? item.url
			: undefined;
	};

	app.controller('ProductSelectController', ProductSelectController);

}));

/* globals jQuery */

(function(factory) {
	factory(
		jQuery
	);
}(function($) {

	'use strict';

	$.fn.componentPiDateTime = function() {
		this.each(function (index, element) {

			var startTime = function() {
				var today = new Date();
				var h = today.getHours();
				var m = today.getMinutes();
				var ampm = h >= 12 ? 'pm' : 'am';
				var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
				h = h % 12;
				h = h ? h : 12; // the hour '0' should be '12'
				m = m < 10 ? '0' + m : m;
				element.querySelector('.time-date').innerHTML = h + ":" + m + ' ' + ampm.toUpperCase() + ' ' + date;
				setTimeout(startTime, 500);
			};

			startTime();

			return this;
		});
	};

}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('GlobalFunctions'),
		window.dcApp.service('EventHub')
	);
}(function(_, $, GlobalFunctions, EventHub) {

	'use strict';

	$.fn.componentPiMetaNav = function() {
		this.each(function (index, element) {

			EventHub.on('toggle-pi-meta-nav', 'toggle', function (payload) {
				if (element.classList.contains('mobile')) {
					GlobalFunctions.slideToggle(element, 350, 'active', true);
				}
			});

			return this;
		});
	};

}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery
	);
}(function(_, $) {

	'use strict';

	$.fn.componentPiStartStop = function () {
		this.each(function (index, element) {
			var btnStart = element.querySelector('.trigger-start'),
				btnStop = element.querySelector('.trigger-stop'),
				btnLoad = element.querySelector('.trigger-loading'),
				program = element.querySelector('.custom-select'),
				activeProgramID = '';


				program.addEventListener('change', function() {
					if (element.classList.contains('running')) {
						stop();
					}
				});

				btnStart.addEventListener('click', function () {
					start();
				});

				btnStop.addEventListener('click', function () {
					stop();
				});


				function start() {
					activeProgramID = program.options[program.selectedIndex].value;
					console.log('Starting: ' + activeProgramID);
					element.classList.add('running');
					btnStart.classList.add('d-none');
					btnLoad.classList.remove('d-none');

					// add Stuff to do here





					//remove Timeout function and use a callback to show loading state
					setTimeout( function () {
						btnLoad.classList.add('d-none');
						btnStop.classList.remove('d-none');
					}, 1500)
				}

				function stop() {
					console.log('Stopping: ' + activeProgramID);
					element.classList.remove('running');
					btnStop.classList.add('d-none');
					btnLoad.classList.remove('d-none');

					// add Stuff to do here





					//remove Timeout function and use a callback to show loading state
					setTimeout( function () {
						btnLoad.classList.add('d-none');
						btnStart.classList.remove('d-none');
					}, 1500)
				}

			return this
		});
	};

}));

/* global _, jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('GlobalFunctions')
	);
}(function (_, $, GlobalFunctions) {

	'use strict';

	$.fn.moduleAccordion = function () {
		this.each(function (index, element) {
			var $module = $(element),
				$head = $module.find('.item-head'),
				$listHead = $module.find('.accordion-trigger'),
				$item = $module.find('.accordion-item.open'),
				filterGroup = element.querySelectorAll('.filter-group'),
				datePickerGroupWrapper = element.querySelectorAll('.date-picker-group-wrapper');

			// images will be force loaded to be seen while printing
			$module.find('img.lazyload').addClass('lazypreload');

			if ($module.hasClass('checkbox-list')) {
				$listHead.on('click', function () {
					var $this = $(this),
						$content = $this.parent().next('.accordion-content');

					$content.slideToggle('fast');

					$this
						.parent().parent()
						.toggleClass('active')
						.removeClass('open');
				});
			} else {
				$head.on('click', function () {
					var $this = $(this),
						$content = $this.next('.accordion-content');

					$content.slideToggle('fast');

					$this
						.parent()
						.toggleClass('active')
						.removeClass('open');
				});
			}



			if ($item) {
				var $content = $item.find('.accordion-content');
				$content.slideToggle(0);
				$item.addClass('active').removeClass('open');
			}

			var toggleOptions = function () {
				var toggleButton = element.querySelectorAll('.toggle-options');
				for (var smob = 0; smob < toggleButton.length; smob++) {
					var thisButton = toggleButton[smob];
					thisButton.addEventListener('click', function (event) {
						var thisEvent = event.target,
							filterGroup = thisEvent.parentElement.previousElementSibling,
							buttonNode = thisEvent.parentElement;

						if (filterGroup.classList.contains('truncate')) {
							filterGroup.classList.remove('truncate');
							buttonNode.classList.add('d-none');
						}
					});
				}
			};

			if (element.classList.contains('filter-accordion')) {
				for (var i = 0; i < filterGroup.length; i++) {
					var wrapperCount = filterGroup[i].querySelectorAll('.filter-wrapper').length;
					if (wrapperCount > 7) {
						filterGroup[i].classList.add('truncate');
					}
				}

				// check if datepicker exists - set class 'has-datepicker' to module
				for (var dpgw = 0; dpgw < datePickerGroupWrapper.length; dpgw++) {
					(function () {
						var thisDatePickerGroupWrapper = datePickerGroupWrapper[dpgw],
							thisParent = thisDatePickerGroupWrapper.parentNode,
							controlInput = thisParent.querySelector('.custom-control-input');

						thisParent.classList.add('has-datepicker');
						thisParent.classList.add('exclude');

						var setActiveState = function () {
							if (controlInput.checked && thisParent.classList.contains('has-datepicker')) {
								thisDatePickerGroupWrapper.classList.add('active');
							} else {
								thisDatePickerGroupWrapper.classList.remove('active');
							}
						};

						element.addEventListener('input', function () {
							setActiveState();
						});

						setActiveState();
					})();
				}

				toggleOptions();
			}



		});

		return this;
	};

}));

/* global jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('EventHub')
	);
}(function(_, $, EventHub) {

	'use strict';

	$.fn.moduleAddField = function() {
		this.each(function(index, element) {
			var $this = $(element),
				template = $this.find('.input-template').html(),
				$newRow = $(template),
				$backup = $newRow,
				values = [],
				isChildOfForm = $this.parents('.module-form').length,
				isRequired,
				idPrefix,
				namePrefix;

			if (isChildOfForm) {
				idPrefix = $backup.find('input').attr('id');
				namePrefix = $backup.find('input').attr('name');
				addValidation($backup, idPrefix + '-' + values.length);
			}

			function firstLoad() {
				$this.empty();
				$backup.find('.remove-field').closest('.module-button').remove();
				$this.append($backup);
			}

			function init() {
				var $textField = $this.find('.form-control'),
					$addField = $this.find('.add-field'),
					$removeField = $this.find('.remove-field');

				isRequired = $textField.is('[required]');

				$this.find('input').on('blur', function(e) {
					setTimeout(function () {
						var $fieldWrapper = $(e.target).closest('.field-wrapper');
						if ($fieldWrapper.find('.has-error').length) {
							$addField.addClass('disabled');
						}
					}, 100);
				});

				$textField.on('keyup', function() {
					if (this.value.length > 0 && !$this.find('.has-error').length) {
						$addField.removeClass('disabled');
					} else {
						$addField.addClass('disabled');
					}
				});

				$addField.on('click', function(e) {
					var $form = $(e.target).parents('form');

					EventHub.trigger('add-field', 'add-enable', {
						$inputs: $this.find('input'),
						$form: $form ? $form : null
					});
				});

				$removeField.on('click', function() {
					values = [];

					remove(this);
				});

				/**
				 * Animate input label on init
				 */
				$textField.on('focus blur', function(event) {
					$(this).parents('.floating-label').toggleClass('is-focused', event.type === 'focus' || this.value.length > 0);
				}).trigger('blur');
			}

			/**
			 * Appends a Texfield
			 */
			function append() {
				$.each(values, function(i) {
					var newId = idPrefix + '-' + i,
						newName = namePrefix + '-' + i,
						$input;

					$newRow = $(template);
					$input = $newRow.find('.form-control');

					$input.attr('id', newId);
					$input.attr('name', newName);
					$input.attr('value', values[i]);

					if (values.length > 1) {
						$newRow.find('.add-field').closest('.module-button').remove();
						if (i === 0) {
							$newRow.find('.control-wrapper').empty();
						}
					}

					if (i === values.length - 1) {
						$newRow.addClass('animate-in');
						$newRow.find('.input-animation-wrapper input').removeAttr('required');
					}

					if (isRequired && isChildOfForm) {
						addValidation($newRow, newId);
					}

					$this.append($newRow);
					$this.find('.module-input').moduleInput();
				});

				$newRow = $(template);
				$newRow.addClass('animate-in');
				$newRow.find('.input-wrapper').empty();
				$newRow.find('.remove-field').closest('.module-button').remove();
				$this.append($newRow);

				init();
			}

			/**
			 * Removes a Textfield
			 * @param element
			 */
			function remove(element) {
				var $elementsWrapper = $(element).closest('.field-wrapper');

				$elementsWrapper.addClass('animate-out');

				window.setTimeout(function() {
					$elementsWrapper.remove();
					if ($this.find('.module-input').length === 1) {
						firstLoad();
						init();
					} else if ($this.find('.field-wrapper:nth-last-child(2) .form-control').val()) {
						$this.find('.field-wrapper:last-child .btn').removeClass('disabled');
					}
				}, 700);

				//Set New Array after Removed Textfield
				setFieldArray();
			}

			/**
			 * Sets new Array of active Fields
			 */
			function setFieldArray() {
				var $textField = $this.find('.form-control');

				$textField.each(function() {
					values.push(this.value);
				});
			}

			/**
			 * Prepares input elements for validation
			 */
			function addValidation($inputContainer, id) {
				var $input = $inputContainer.find('input'),
					$errorContainer = $inputContainer.find('.input-animation-wrapper').next('.error-message-wrapper'),
					$label = $inputContainer.find('label');

				$errorContainer.attr('id', id + '-error');
				$label.attr('for', id);
				$input.attr({
					'id': id,
					'data-bouncer-target': '#' + id + '-error'
				});
			}

			/**
			 * Listen to EventHub and enables the add field button if 'add-enable' event is triggered.
			 */
			EventHub.on('add-field', 'add-enable', function() {
				values = [];

				setFieldArray();

				values.push('');

				$this.empty();

				append();
			});

			firstLoad();
			init();
		});
		return this;
	};
}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('BrowserEvents')
	);
}(function(_, $, BrowserEvents) {

	'use strict';

	$.fn.moduleBackToTop = function () {
		this.each(function (index, element) {
			var $this = $(element),
				$html = $('html, body');

			BrowserEvents.on('scroll', function () {
				var $headerHeight = $('.module-header').height(),
					$footer = $('.module-footer'),
					$footerHeight = $footer.height(),
					$footerContentHeight = $footer.find('.container-fluid').height(),
					offsetTop = $(window).scrollTop() + $(window).height(),
					heightExcludingFooter = $(document).height() - $footerHeight;

				if ($(this).scrollTop() > $headerHeight) {
					$this.fadeIn();
				} else {
					$this.fadeOut();
				}

				if (offsetTop < heightExcludingFooter) {
					$this.css({
						'position': 'fixed',
						'bottom': '10%'
					});
				}
				if (offsetTop > heightExcludingFooter) {
					$this.css('position', 'relative');

					if ($(window).width() > 768) {
						if ($(window).width() >= 1920) {
							$this.css('bottom', $footerContentHeight + 120); //120px is the max visible height of the diagonal line - half of button height
						} else {
							$this.css('bottom', $footerContentHeight + $footer.find('.diagonal-line-wrapper').height());
						}
					} else {
						$this.css('bottom', $footerHeight + 20);
					}
				}
			});

			$this.on('click', function () {
				$html.animate({
					scrollTop: 0
				});
				return false;
			});
		});

		return this;
	};
}));

/* global _, jQuery */

(function (factory) {
	factory(_, jQuery, window.dcApp.service("AutoComplete"));
})(function (_, $, AutoComplete) {
	"use strict";

	$.fn.moduleBlogSearch = function () {
		this.each(function (index, element) {
			var form = element.querySelector("form"),
				searchInput = form.querySelector("input"),
				submitButton = form.querySelector("button");

			function bindListeners() {
				form.addEventListener("submit", SearchSubmit);
				searchInput.addEventListener("keyup", toggleKeywordSubmit);
			}

			/**
			 * Disable/Enable Search Submit Button
			 */
			function SearchSubmit(event) {
				if (searchInput.value) {
					event.preventDefault();
					submitForm(form);
				} else {
					event.preventDefault();
				}
			}

			function submitForm(element) {
				element.removeEventListener("submit", SearchSubmit, false);
				element.submit();
			}

			function toggleKeywordSubmit() {
				if (searchInput.value.length > 0) {
					submitButton.removeAttribute("disabled");
					submitButton.classList.add("active");
				} else {
					submitButton.setAttribute("disabled", "disabled");
					submitButton.classList.remove("active");
				}
			}

			if (searchInput) {
				AutoComplete({
					selector: searchInput,
					url: searchInput.dataset.searchUrl,
					menuClass: "product-autocomplete",
					responseHook: function (response) {
						var result = [];

						_.each(response.results, function (responseItem) {
							result.push(responseItem.name);
							if (result.length >= 5) {
								return false;
							}
						});

						return result;
					},
				});
			}

			bindListeners();
		});

		return this;
	};
});

/* global _, jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp
	);
}(function(_, $, app) {

	'use strict';

	$.fn.moduleCallout = function() {
		this.each(function(index, element) {
			var $element = $(element),
				displayTime = $element.data('displayTime');

			if(displayTime > 0) {
				window.setTimeout(function() {
					$element.fadeOut();
				}, displayTime);
			}
		});

		return this;
	};
}));

/* globals jQuery */

(function (factory) {
	factory(
		_,
		jQuery
	);
}(function (_, $) {

	'use strict';

	$.fn.moduleChart = function () {
		this.each(function (index, element) {
			var $this = $(element),
				$chartContent = $this.find('.chart-content'),
				$chartLegend = $this.find('.chartjs-legend'),
				chartDataAttributes = $this.data(),
				labelsAxisX = getArray(chartDataAttributes.xAxisLabels),
				labelsAxisY = getArray(chartDataAttributes.yAxisLabels),
				graphDatasets = [],
				chart,
				baseGraphSettings = {
					label: 'graph title',
					lineTension: 0,
					data: [],
					borderColor: [],
					backgroundColor: [],
					borderWidth: chartDataAttributes.graphsWidth,
					fill: false
				},
				axisFontSettings = {
					fontFamily: 'Bosch Sans',
					fontColor: '#002B49',
					fontSize: 14,
					fontStyle: 'bold'
				};

			chart = new Chart($chartContent, {
				type: 'line',
				data: {
					labels: labelsAxisX,
					datasets: getGraphDatasets()
				},
				options: {
					responsive: true,
					legend: false,
					elements: {
						point: {
							radius: 0
						}
					},
					scales: {
						yAxes: [
							{
								afterBuildTicks: function (chart) {
									chart.ticks = labelsAxisY;
								},
								ticks: $.extend({},
									axisFontSettings,
									{
										min: 0,
										max: labelsAxisY[labelsAxisY.length - 1]
									})
							}
						],
						xAxes: [
							{
								ticks: axisFontSettings
							}
						]
					}
				}
			});

			$chartLegend.html(chart.generateLegend());

			/**
			 * Initial method that processes all defined data attributes.
			 * Returns the final datasets of all graphs for the chart plugin.
			 *
			 * @returns {Array}
			 */
			function getGraphDatasets() {
				var i = 1,
					graphAttributes = getNextGraphAttributes(i);

				graphDatasets = [];

				while (graphAttributes.length) {
					setGraphSettings(graphAttributes);
					graphAttributes = getNextGraphAttributes(++i);
				}

				return graphDatasets;
			}

			/**
			 * Returns all graph attributes, depending on the given number, as an array,
			 * that includes name and value of the attributes.
			 *
			 * @param number
			 * @returns {Array}
			 */
			function getNextGraphAttributes(number) {
				return $.map(Object.entries(chartDataAttributes), function (attributes) {
					return attributes[0].indexOf('graph-' + number) >= 0
						? [attributes]
						: null;
				});
			}

			/**
			 * Populates the graph datasets depending on the given attributes.
			 *
			 * @param attributes
			 */
			function setGraphSettings(attributes) {
				var graphSettings = {},
					attributeName,
					attributeValue;

				$.each(attributes, function (index, attribute) {
					attributeName = attribute[0];
					attributeValue = attribute[1];

					if (attributeName.indexOf('Title') > -1) {
						graphSettings.label = attributeValue;
					} else if (attributeName.indexOf('Data') > -1) {
						graphSettings.data = getArray(attributeValue);
					} else if (attributeName.indexOf('Color') > -1) {
						graphSettings.borderColor = attributeValue;
						graphSettings.backgroundColor = attributeValue;
					}
				});

				graphDatasets.push(
					$.extend({}, baseGraphSettings, graphSettings)
				);
			}
		});

		/**
		 * Returns the given pipe-separated data-string (e.g. "1|2|3")
		 * as an array of int values.
		 *
		 * @param data
		 * @returns {Array}
		 */
		function getArray(data) {
			return $.map(data.split('|'), function (value) {
				if (!value.length) {
					return;
				}

				return parseInt(value);
			});
		}
	};
}));

/* global jQuery, _, tns */

(function(factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service('EventHub'),
		window.dcApp.service('BodyScrolling')
	);
}(function(_, $, tns, EventHub, BodyScrolling) {

	'use strict';

	/**
	 * @param {HTMLElement} element
	 * @constructor
	 */
	function Plugin(element) {
		this._initialize(element);
	}

	/**
	 * @param {HTMLElement} element
	 * @private
	 */
	Plugin.prototype._initialize = function (element) {
		this._element = element;
		this._$element = $(element);
		this._$modal = this._$element.find('.modal');
		this._stories = element.querySelectorAll('.story');

		this._id = element.dataset.id;
		this._progressHandle = null;
		this._currentStoryIndex = 0;
		this._isOpen = false;

		this._registerListener();
	};

	/**
	 * @param {string} id
	 * @returns {string}
	 */
	Plugin.getOpenKey = function (id) {
		return 'open-' + id;
	};

	/**
	 * @private
	 */
	Plugin.prototype._registerListener = function () {
		var self = this,
			openKey = Plugin.getOpenKey(this._id);

		EventHub.on('detail-page-story', openKey, function (storyIndex) {
			self._open();
			self._showStory(storyIndex);
		}, function () {
			self._close();
		});
	};

	/**
	 * @private
	 */
	Plugin.prototype._open = function () {
		this._$modal.moduleModal('open');
		this._isOpen = true;

		// Header close interferes and enables scrolling.
		window.setTimeout(function () {
			BodyScrolling.disable();
		}, 0);
	};

	/**
	 * @private
	 */
	Plugin.prototype._close = function () {
		if (!this._isOpen) {
			return;
		}

		this._hideStories();

		this._$modal.moduleModal('close');
		this._isOpen = false;

		BodyScrolling.enable();
	};

	/**
	 * @param {number} storyIndex
	 * @private
	 */
	Plugin.prototype._showStory = function (storyIndex) {
		var self = this,
			storyElement = this._getStoryElement(storyIndex);

		if (!storyElement) {
			self._close(); // close Modal after last slide
			return;
		}

		this._hideStories();
		this._currentStoryIndex = storyIndex;

		storyElement.classList.add('show');

		if (storyElement.storyInitialized) {
			this._replayStory(storyElement, storyIndex);
			return;
		}

		// Already block now, to prevent double-initialisation.
		storyElement.storyInitialized = true;

		// Wait for it to become visible, otherwise tns may not work properly.
		window.setTimeout(function () {
			self._bindNavigation(storyElement, storyIndex);
			self._createProgress(storyElement);
			self._createSlider(storyElement, storyIndex);

			storyElement.classList.add('initialized');
		}, 500); // Must be greater than transition time (350ms).
	};

	Plugin.prototype._hideStories = function () {
		this._clearProgressTimer();

		this._stories.forEach(function (story) {
			// Only if already initialized.
			if (story.slider) {
				story.slider.goTo(0);
			}

			story.classList.remove('show');
		});
	};

	/**
	 * @param {number} storyIndex
	 * @returns {Element}
	 * @private
	 */
	Plugin.prototype._getStoryElement = function (storyIndex) {
		return this._stories[storyIndex];
	};

	/**
	 * @param {HTMLElement|Element} storyElement
	 * @private
	 */
	Plugin.prototype._getStorySlideElements = function (storyElement) {
		return storyElement.querySelectorAll('.slide');
	};

	/**
	 * @param {HTMLElement|Element} storyElement
	 * @param {number} storyIndex
	 * @private
	 */
	Plugin.prototype._bindNavigation = function (storyElement, storyIndex) {
		var buttonStoryPrev = storyElement.querySelector('.story-prev'),
			buttonStoryNext = storyElement.querySelector('.story-next');

		this._bindNavigationLink(buttonStoryPrev, storyIndex - 1);
		this._bindNavigationLink(buttonStoryNext, storyIndex + 1);
	};

	/**
	 * @param {HTMLAnchorElement} anchor
	 * @param {number} storyIndex
	 * @private
	 */
	Plugin.prototype._bindNavigationLink = function (anchor, storyIndex) {
		var self = this;

		if (!this._stories[storyIndex]) {
			anchor.classList.add('disabled');
			return;
		}

		anchor.addEventListener('click', function () {
			self._showStory(storyIndex);
		});
	};

	/**
	 * @param {HTMLElement|Element} storyElement
	 * @private
	 */
	Plugin.prototype._createProgress = function (storyElement) {
		var storyProgress = storyElement.querySelector('.story-progress'),
			template = storyProgress.innerHTML,
			steps = this._getStorySlideElements(storyElement).length,
			html = '';
			// html = template.repeat(steps); // Use this in post IE11 times.

		while (steps > 0) {
			html += template;
			steps -= 1;
		}

		storyProgress.innerHTML = html;
	};

	/**
	 * @param {HTMLElement|Element} storyElement
	 * @param {number} storyIndex
	 * @param {number} slideIndex
	 * @private
	 */
	Plugin.prototype._updateProgress = function (storyElement, storyIndex, slideIndex) {
		if (this._currentStoryIndex !== storyIndex) {
			return; // Skip all the rewind events.
		}

		// console.log('Updating Story: ' + storyIndex);
		this._updateProgressVisual(storyElement, slideIndex);
		this._updateProgressTimer(storyElement, storyIndex);
	};

	/**
	 * @param {HTMLElement|Element} storyElement
	 * @param {number} slideIndex
	 * @private
	 */
	Plugin.prototype._updateProgressVisual = function (storyElement, slideIndex) {
		var slides = this._getStorySlideElements(storyElement),
			progressSteps = storyElement.querySelectorAll('.progress-step');

		slides.forEach(function (slide, index) {
			var progressStep = progressSteps[index];

			progressStep.classList.remove('waiting', 'active');
			if (index < slideIndex) {
				return;
			}

			if (index > slideIndex) {
				progressStep.classList.add('waiting');
			}
			else {
				progressStep.classList.add('active');
			}
		});
	};

	/**
	 * @param {HTMLElement|Element} storyElement
	 * @param {number} storyIndex
	 * @private
	 */
	Plugin.prototype._updateProgressTimer = function (storyElement, storyIndex) {
		var self = this;

		this._clearProgressTimer();

		// Duration must be synced with keyframes animation. #storyProgress
		this._progressHandle = window.setTimeout(function () {
			var slider = storyElement.slider,
				sliderInfo = slider.getInfo(),
				isLastSlide = sliderInfo.index === sliderInfo.slideItems.length - 1;

			// console.log([
			// 	'Finished Story: ' + storyIndex,
			// 	'Index: ' + sliderInfo.index + ' / ' + (sliderInfo.slideItems.length - 1),
			// 	'Progress: ' + isLastSlide
			// ].join(', '));

			if (isLastSlide) {
				// console.log('Opening Story: ', storyIndex + 1);
				self._showStory(storyIndex + 1);
			}
			else {
				slider.goTo('next');
			}

			self._progressHandle = null;
		}, 5000);
	};

	/**
	 * @private
	 */
	Plugin.prototype._clearProgressTimer = function () {
		if (this._progressHandle) {
			window.clearTimeout(this._progressHandle);

			// Needs to be reset, too. Otherwise it continues in IE11.
			this._progressHandle = null;
		}
	};

	/**
	 * @param {HTMLElement|Element} storyElement
	 * @param {number} storyIndex
	 * @private
	 */
	Plugin.prototype._replayStory = function (storyElement, storyIndex) {
		if (storyElement.requiresRebuild) {
			this._rebuildSlider(storyElement, storyIndex);
		}

		// console.log('Replaying Story: ' + storyIndex);
		this._updateProgress(storyElement, storyIndex, 0);
	};

	/**
	 * @param {HTMLElement|Element} storyElement
	 * @returns {boolean}
	 * @private
	 */
	Plugin.prototype._isActiveStory = function (storyElement) {
		return storyElement.classList.contains('show');
	};

	/**
	 * @param {HTMLElement|Element} storyElement
	 * @param {number} storyIndex
	 * @private
	 */
	Plugin.prototype._createSlider = function (storyElement, storyIndex) {
		var self = this,
			sliderElement = storyElement.querySelector('.slider'),
			sliderPrev = storyElement.querySelector('.slider-prev'),
			sliderNext = storyElement.querySelector('.slider-next'),
			slides = this._getStorySlideElements(storyElement),
			slider;

		// The tns does not initialize is this case.
		if (slides.length === 1) {
			storyElement.classList.add('single-slide');
		}

		if (slides.length > 0) {
			slides[0].classList.add('active-center-slide');
		}

		slider = tns({
			container: sliderElement,
			items: 1,
			slideBy: 1,
			loop: false,
			rewind: false,
			prevButton: sliderPrev,
			nextButton: sliderNext,
			nav: false,
			mouseDrag: true,
			/*
			 * Prevents "Unable to preventDefault inside passive event listener invocation."
			 * @link https://github.com/ganlanyuan/tiny-slider/issues/370
			 */
			preventScrollOnTouch: 'auto',
			responsive: {
				768: {
					edgePadding: 637
				}
			}
		});

		slider.events.on("transitionEnd", function (info) {
			info.slideItems[info.indexCached].classList.remove('active-center-slide');
			info.slideItems[info.index].classList.add('active-center-slide');

			self._updateProgress(storyElement, storyIndex, info.index);
		});

		// slider.events.on('newBreakpointStart', function (info) {
		// 	console.log('start', info);
		// });

		slider.events.on('newBreakpointEnd', function (info) {
			if (self._isActiveStory(storyElement)) {
				self._rebuildSlider(storyElement, storyIndex);

				return;
			}

			// Slide currently inactive and cannot be rebuilt, because it is invisible.
			storyElement.requiresRebuild = true;
		});

		this._updateProgress(storyElement, storyIndex, 0);

		storyElement.slider = slider;
	};

	/**
	 * @param {HTMLElement|Element} storyElement
	 * @param {number} storyIndex
	 * @private
	 */
	Plugin.prototype._rebuildSlider = function (storyElement, storyIndex) {
		if (storyElement.slider) {
			// console.log('Destroying Story: ' + storyIndex);
			storyElement.slider.destroy();
		}

		// console.log('Creating Story: ' + storyIndex);
		this._createSlider(storyElement, storyIndex);

		// Rebuilding crashes lazysizes, images are there (from first loading) but remain in loading state.
		// Just a security net, gives time to load but if the listeners are gone, fixes it.
		window.setTimeout(function () {
			storyElement.querySelectorAll('.lazyloading').forEach(function (element) {
				element.classList.remove('lazyloading');
				element.classList.add('lazyloaded');
			});
		}, 2000);
	};

	$.fn.moduleDetailPageStory = function() {
		this.each(function(index, element) {
			if (element.plugin) {
				return;
			}

			element.plugin = new Plugin(element);
		});

		return this;
	};

	$.moduleDetailPageStory = {
		open: function (id, index) {
			var openKey = Plugin.getOpenKey(id);

			EventHub.trigger('detail-page-story', openKey, index);
		}
	};


}));

/* global jQuery */

(function (factory) {
	factory(
		_,
		jQuery
	);
}(function (_, $) {

	'use strict';

	function FileDragArea() {
	}

	FileDragArea.prototype.initialize = function ($module) {
		var self = this,
			$dragArea = $module.find('.file-drag-area');

		['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
			$dragArea.on(eventName, function(e){
				self.preventDefaults(e);
			});
		});

		['dragenter', 'dragover'].forEach(function (eventName) {
			$dragArea.on(eventName, function() {
				self.highlight($dragArea);
			});
		});

		['dragleave', 'drop'].forEach(function (eventName) {
			$dragArea.on(eventName, function() {
				self.unhighlight($dragArea);
			});
		});

		$module[0].querySelector('.file-drag-area').addEventListener('drop', function(e) {
			self.handleDrop(e, self, $module);
		});

		$module[0].querySelector('input').addEventListener('change', function(e) {
			self.handleChange(e, self, $module);
		});
	};

	FileDragArea.prototype.preventDefaults = function(e) {
		e.preventDefault();
		e.stopPropagation();
	};

	FileDragArea.prototype.highlight = function($dragArea) {
		$dragArea.addClass('highlight');
	};

	FileDragArea.prototype.unhighlight = function($dragArea) {
		$dragArea.removeClass('highlight');
	};

	FileDragArea.prototype.handleDrop = function(e, self, $module) {
		var dt = e.dataTransfer;
		var files = dt.files;

		self.handleFiles(e, files, $module);
	};

	FileDragArea.prototype.handleChange = function(e, self, $module) {
		var files = $module[0].querySelector('input').files;

		self.handleFiles(e, files, $module);
	};

	FileDragArea.prototype.handleFiles = function(e, files, $module) {
		var filesArray = [];

		for (var i = 0; i < files.length; i++) {
			filesArray.push(files[i]);
		}

		if ($module[0].callback) {
			$module[0].callback(e, filesArray);
		}
	};

	/**
	 * Helper Function to set a Callback
	 * @param callback - Function
	 */
	FileDragArea.prototype.setCallback = function(callbackObject) {
		callbackObject.module.callback = callbackObject.callback;
	};

	$.moduleFileDragArea = new FileDragArea();

	/**
	 * @param {string} [command]
	 * @returns {jQuery}
	 */
	$.fn.moduleFileDragArea = function (command, options) {
		this.each(function (index, element) {
			var $element = $(element);

			if (command) {
				$.moduleFileDragArea[command](options);
			} else {
				$.moduleFileDragArea.initialize($element);
			}
		});

		return this;
	};

}));

/* global jQuery */

(function(factory) {
	factory(
		_,
		jQuery
	);
}(function(_, $) {

	'use strict';

	function FileSelector() {
	}

	FileSelector.prototype.initialize = function($module) {
		var self = this,
			$fileInput = $module.find('input');

		$fileInput.on('change', function(event) {
			self.setFileName(event, self, $module);
		});
	};

	/**
	 * Sets Filename without Path and also Calls Callback Method
	 * @param self
	 * @param $module
	 */
	FileSelector.prototype.setFileName = function(event, self, $module) {
		var inputFile = $module[0].querySelector('input').files,
			file = inputFile[0],
			$fileNameLabel = $module.find('.file-name');

		if ($module[0].callback) {
			$module[0].callback(event, file);
		}
		$module.addClass('active');
		$fileNameLabel.text(file.name);

	};

	/**
	 * Helper Function to set a Callback
	 * @param callback - Function
	 */
	FileSelector.prototype.setCallback = function(callbackObject) {
		callbackObject.module.callback = callbackObject.callback;
	};

	$.moduleFileSelector = new FileSelector();

	/**
	 * @param {string} [command]
	 * @returns {jQuery}
	 */
	$.fn.moduleFileSelector = function(command, options) {
		this.each(function(index, element) {
			var $element = $(element);

			if (command) {
				$.moduleFileSelector[command](options);
			} else {
				$.moduleFileSelector.initialize($element);
			}
		});

		return this;
	};

}));

/* global _, jQuery, noUiSlider */

(function (factory) {
	factory(
		_,
		jQuery,
		noUiSlider,
		window.dcApp.service("EventHub"),
		window.dcApp.service("GlobalFunctions")
	);
})(function (_, $, noUiSlider, EventHub, GlobalFunctions) {
	"use strict";

	$.fn.moduleFilterBar = function () {
		this.each(function (index, element) {
			var $this = $(element),
				contentItem = GlobalFunctions.closestParent(
					element,
					".content-item",
					".tab-content"
				),
				filterSectionTag = element.querySelector(".filter-section-tag"),
				filterTagBars = document.querySelectorAll(".filter-tag-bar"),
				filterTagBar,
				tagModule = element.querySelector(".module-tags"),
				tagModuleClone,
				tagTemplate = element.querySelector(".tag-template").innerHTML,
				tagWrapper = tagModule.querySelector(".tag-wrapper"),
				labels = element.querySelectorAll(".custom-control-label"),
				clearAllBtn = element.querySelector(".clear-all"),
				$filterModal = $(".filter-modal"),
				$modalTrigger = $(".btn-filter"),
				$applyFilter = $(".filter-apply");

			for (var ftb = 0; ftb < filterTagBars.length; ftb++) {
				tagModuleClone = filterTagBars[ftb].querySelector(".module-tags-clone");
				filterTagBar = filterTagBars[ftb];
			}

			$applyFilter.on("click", function () {
				$filterModal.moduleModal("close");
			});

			$modalTrigger.on("click", function () {
				$filterModal.moduleModal("open");
			});

			var tagClickListener = function (event) {
				var tagTarget = event,
					tagInner = tagTarget.parentElement,
					tagOuter = tagInner.parentElement,
					optionData = tagOuter.getAttribute("data-option-id"),
					target = document.getElementById(optionData),
					clickTarget;

				if (target.type === "checkbox") {
					clickTarget = target.nextElementSibling;
					clickTarget.click();
				}
				if (target.type === "radio") {
					var filterGroupFirstElement = GlobalFunctions.closestParent(
							target,
							".filter-group",
							"body"
						).firstElementChild,
						resetInputId = filterGroupFirstElement.querySelector("input").id,
						resetLabel = filterGroupFirstElement.querySelector("label");

					// check if first input in group is reset option
					if (resetLabel.htmlFor === resetInputId) {
						clickTarget = resetLabel;
					} else {
						// if not, search for static reset id option
						var dateRangeResetInput = document.getElementById(resetInputId),
							dateRangeResetLabel = dateRangeResetInput.nextElementSibling;

						if (dateRangeResetLabel.tagName !== "LABEL") {
							dateRangeResetLabel = dateRangeResetLabel.querySelector("label");
							clickTarget = dateRangeResetLabel;
						} else {
							clickTarget = dateRangeResetLabel;
						}
					}
					clickTarget.click();
				}
				if (target.classList.contains("module-range-slider")) {
					target.setAttribute("data-range-checked", "false");
					tagOuter.parentNode.removeChild(tagOuter);
					target.querySelector(".range").noUiSlider.reset();
				}

				EventHub.trigger("check-tags", "toggleTagFilterButtons");
			};

			var removeAllTags = function () {
				var tag = tagWrapper.querySelectorAll(".tag");
				for (var t = 0; t < tag.length; t++) {
					tag[t].remove();
				}

				if (filterTagBars.length > 0) {
					var clonedTag = filterTagBar.querySelectorAll(".tag");
					for (var ct = 0; ct < clonedTag.length; ct++) {
						clonedTag[ct].remove();
					}

					if (contentItem !== null) {
						var cloneFilterSectionTag = contentItem.querySelector(
							".filter-tag-bar .filter-section-tag"
						);

						if (cloneFilterSectionTag !== null) {
							while (cloneFilterSectionTag.firstChild) {
								cloneFilterSectionTag.removeChild(
									cloneFilterSectionTag.firstChild
								);
							}
						}
					}
				}
			};

			var clearAll = function () {
				removeAllTags();
				var checks = element.querySelectorAll('input[type="checkbox"]');
				for (var c = 0; c < checks.length; c++) {
					var check = checks[c];
					if (!check.disabled) {
						check.checked = false;
					}
				}
				var checksRadio = element.querySelectorAll('input[type="radio"]');
				for (var r = 0; r < checksRadio.length; r++) {
					var checkRadio = checksRadio[r];
					if (!checkRadio.disabled) {
						checkRadio.checked = false;
					}
					if (checkRadio.dataset.defaultRadio == "true") {
						checkRadio.checked = true;
					}
				}

				var ranges = element.querySelectorAll(".range");
				for (var m = 0; m < ranges.length; m++) {
					var range = ranges[m];
					range.noUiSlider.reset();
				}

				filterSectionTag.classList.toggle("hide");
			};

			var copyTagWrapper = function () {
				if (contentItem !== null) {
					var cloneFilterSectionTag = contentItem.querySelector(
						".filter-tag-bar .filter-section-tag"
					);

					setTimeout(function () {
						var moduleTags = element.querySelector(".module-tags"),
							clonedModuleTags = moduleTags.cloneNode(true);
						if (cloneFilterSectionTag) {
							cloneFilterSectionTag.appendChild(clonedModuleTags);
							clonedModuleTags.classList.add("module-tags-clone");

							setTimeout(function () {
								var clonedTags = cloneFilterSectionTag.querySelectorAll(
									".tag-wrapper .tag"
								);
								for (var ct = 0; ct < clonedTags.length; ct++) {
									var clonedTag = clonedTags[ct],
										tagClose = clonedTag.querySelector(".icon-dc_close");

									tagClose.addEventListener("click", function (event) {
										tagClickListener(event.target);
									});
								}

								var clearFilterButtons = cloneFilterSectionTag.querySelectorAll(
									".clear-all"
								);
								for (var cfb = 0; cfb < clearFilterButtons.length; cfb++) {
									var clearFilterButton = clearFilterButtons[cfb];
									clearFilterButton.addEventListener("click", function () {
										// search for clear-all button in scope
										var clearFilterTarget = element.querySelector(
											".module-tags .button-wrapper .clear-all"
										);
										clearFilterTarget.click();
									});
								}

								var showFilterButtons = cloneFilterSectionTag.querySelectorAll(
									".show-tags"
								);
								for (var sfb = 0; sfb < showFilterButtons.length; sfb++) {
									var showFilterButton = showFilterButtons[sfb];
									showFilterButton.addEventListener("click", function (event) {
										var showButton = event.target,
											thisParent = showButton.parentElement,
											thisButtonText = thisParent.querySelector(
												".content-text"
											);

										if (!clonedModuleTags.classList.contains("show-all")) {
											clonedModuleTags.classList.add("show-all");
											thisButtonText.innerHTML = "Show less";
										} else {
											clonedModuleTags.classList.remove("show-all");
											thisButtonText.innerHTML = "Show more";
										}
									});
								}
							}, 0);
						}
					}, 0);
				}
			};

			var createCustomTagNode = function (label, action) {
				var tagContainer = document.createElement("div");

				tagContainer.className = "tag tag-limit";
				tagContainer.setAttribute("data-option-id", action);
				tagContainer.innerHTML = tagTemplate;

				var tagInner = tagContainer.children[0],
					tagLabel = tagInner.children[0],
					tagClose = tagInner.children[1];

				tagLabel.textContent = label;

				tagClose.addEventListener("click", function (event) {
					tagClickListener(event.target);
				});

				tagWrapper.appendChild(tagContainer);

				var rangeTag = tagWrapper.querySelectorAll(
					'.tag[data-option-id^="range-slider"]'
				);
				var rangeTagArray = [];

				for (var i = 0; i > rangeTag.length; i++) {
					rangeTagArray.push(rangeTag[i]);
				}

				EventHub.trigger("check-tags", "toggleTagFilterButtons");
			};

			var createTagNode = function (event) {
				var isOptionChecked, label, labelContext, option, optionId;

				if (event.classList.contains("module-range-slider")) {
					option = event;
					optionId = option.id;

					var lower = option.querySelector(".noUi-handle-lower"),
						lowerNow =
							lower !== null ? lower.getAttribute("aria-valuenow") : "",
						upper = option.querySelector(".noUi-handle-upper"),
						upperNow =
							upper !== null ? upper.getAttribute("aria-valuenow") : "",
						suffix = option.getAttribute("data-range-suffix"),
						suffixString = suffix !== null ? " " + suffix : "",
						lowerValue = parseInt(lowerNow),
						upperValue = parseInt(upperNow);

					label = option.querySelector(".range-label");
					label = label !== null ? label.innerHTML + ": " : "";
					if (lower && upper) {
						labelContext =
							label +
							lowerValue +
							suffixString +
							" - " +
							upperValue +
							suffixString;
					} else if (lower && !upper) {
						labelContext = label + lowerValue + suffixString;
					} else {
						return false;
					}
					if (option.getAttribute("data-range-checked") === "true") {
						isOptionChecked = true;
					} else {
						isOptionChecked = false;
					}
				} else {
					option = event.querySelector("input");
					optionId = option.id;
					label = event.querySelector("label .label-title");
					labelContext = label.textContent;

					isOptionChecked = option.checked;
				}

				if (isOptionChecked) {
					if (!event.classList.contains("has-datepicker")) {
						var tagContainer = document.createElement("div");

						tagContainer.className = "tag tag-limit";
						tagContainer.setAttribute("data-option-id", optionId);
						tagContainer.innerHTML = tagTemplate;

						var tagInner = tagContainer.children[0],
							tagLabel = tagInner.children[0],
							tagClose = tagInner.children[1];

						tagLabel.textContent = labelContext;

						tagClose.addEventListener("click", function (event) {
							tagClickListener(event.target);
						});

						tagWrapper.appendChild(tagContainer);

						EventHub.trigger("check-tags", "toggleTagFilterButtons");
					}
				} else {
					EventHub.trigger("check-tags", "toggleTagFilterButtons");
				}
			};

			var rangeSliderInit = function (payload) {
				if (typeof payload === "object" || typeof payload === "function") {
					var tagValue,
						label = "",
						rangeElement = document.getElementById(payload.id),
						tag = element.querySelector(
							'.tag[data-option-id="' + payload.id + '"]'
						);

					if (payload.value) {
						tagValue = payload.value;
					}

					if (payload.value1 && payload.value2) {
						tagValue = payload.value1 + " - " + payload.value2;
					}

					if (payload.label && payload.label !== false) {
						label = payload.label + ": ";
					}

					if (tag !== null) {
						tag.querySelector(".tag-inner > p").innerHTML = label + tagValue;
					} else {
						// createCustomTagNode(label + tagValue, payload.id);
						createTagNode(rangeElement);
					}
				}
			};

			var datePickerButton = function (state) {
				var datePickerApply = element.querySelectorAll(".date-picker-apply");
				for (var dpa = 0; dpa < datePickerApply.length; dpa++) {
					var thisDatePickerApply = datePickerApply[dpa];
					thisDatePickerApply.disabled = state;
				}
			};

			var datePickerInput = function (group, values) {
				var dateInputs = group.querySelectorAll("input");

				for (var di = 0; di < dateInputs.length; di++) {
					var thisInput = dateInputs[di],
						moduleContainer = GlobalFunctions.closestParent(
							thisInput,
							".has-datepicker",
							".range-wrapper"
						);

					if (values) {
						if (thisInput.id.indexOf("start") > -1) {
							thisInput.value = values.start;
						}
						if (thisInput.id.indexOf("end") > -1) {
							thisInput.value = values.end;
						}
					}

					if (thisInput.value === "") {
						if (moduleContainer) {
							moduleContainer.classList.add("exclude");
						}
						datePickerButton(true);
						return false;
					} else {
						if (moduleContainer) {
							moduleContainer.classList.remove("exclude");
						}
						datePickerButton(false);
					}
				}
			};

			var datePickerInit = function (values) {
				var datePickerWrapper = element.querySelectorAll(
					".date-picker-group-wrapper"
				);

				if (datePickerWrapper) {
					for (var dpw = 0; dpw < datePickerWrapper.length; dpw++) {
						var datePickerGroup = datePickerWrapper[dpw].querySelectorAll(
							".date-picker-group"
						);

						if (datePickerGroup) {
							for (var dpg = 0; dpg < datePickerGroup.length; dpg++) {
								(function () {
									var thisGroup = datePickerGroup[dpw];

									thisGroup.addEventListener("input", function () {
										datePickerInput(thisGroup);
									});

									datePickerInput(thisGroup, values);
								})();
							}
						}
					}
				}
			};

			var initOptions = function () {
				var checkboxes = element.querySelectorAll(".module-checkbox"),
					radios = element.querySelectorAll(".module-radio"),
					rangeSliders = element.querySelectorAll(".module-range-slider");

				for (var cb = 0; cb < checkboxes.length; cb++) {
					// prevent rendering the module if excluded
					if (!checkboxes[cb].classList.contains("exclude")) {
						createTagNode(checkboxes[cb]);
					}

					// checkboxes[cb].addEventListener('input', function () {
					// 	initOptions();
					// });
				}

				for (var r = 0; r < radios.length; r++) {
					// prevent rendering the module if excluded
					if (!radios[r].classList.contains("exclude")) {
						createTagNode(radios[r]);
					}
				}

				for (var rs = 0; rs < rangeSliders.length; rs++) {
					// prevent rendering the module if excluded
					if (!rangeSliders[rs].classList.contains("exclude")) {
						createTagNode(rangeSliders[rs]);
					}
				}

				copyTagWrapper();
			};

			var init = function () {
				// Clear all Tags before create
				removeAllTags();

				//  get all filters from filter bar
				initOptions();

				// date range picker init
				datePickerInit();

				// toggle buttons
				EventHub.trigger("check-tags", "toggleTagFilterButtons");
			};

			init();

			for (var l = 0; l < labels.length; l++) {
				labels[l].addEventListener("click", function () {
					setTimeout(function () {
						init();
					}, 0);
				});
			}

			clearAllBtn.addEventListener("click", function () {
				clearAll();
			});

			EventHub.on("module-filter-bar", "date-picker-values", function (event) {
				var dateStringOptions = {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
					},
					label =
						GlobalFunctions.parseDate(event.start).toLocaleDateString(
							"DE-de",
							dateStringOptions
						) +
						" - " +
						GlobalFunctions.parseDate(event.end).toLocaleDateString(
							"DE-de",
							dateStringOptions
						);
				setTimeout(function () {
					if (element.querySelector(".has-datepicker")) {
						createCustomTagNode(label, "daterange_reset");
						datePickerInit(event);
					}
				}, 0);
			});

			EventHub.on("module-filter-bar", "api-loaded", function (event) {
				if (event.loaded) {
					init();
				}
			});

			EventHub.on("range-slider-values", "slider-multiple", function (payload) {
				setTimeout(function () {
					init(); // necessary for right order in tag list
					rangeSliderInit(payload);
				}, 0);
			});

			EventHub.on("range-slider-values", "slider-single", function (payload) {
				setTimeout(function () {
					init(); // necessary for right order in tag list
					rangeSliderInit(payload);
				}, 0);
			});
		});
	};
});

/* global jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('EventBubbling'),
		window.dcApp.service('BodyScrolling'),
		window.dcApp.service('BrowserEvents'),
		window.dcApp.service('Breakpoint'),
		window.dcApp.service('Animate')
	);
}(function(_, $, EventBubbling, BodyScrolling, BrowserEvents, Breakpoint, Animate) {

	'use strict';

	var iterator = 0,
		transitionDurationFast = 250, // Keep in sync with css #modal-animation.
		activeClass = 'active',
		fullSizeFlyoutClass = 'full-size-flyout',
		$body = $('body');

	$.fn.moduleFlyout = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$flyoutTitle = $this.find('.flyout-title'),
				$flyoutContent = $this.find('.flyout-content'),
				$flyoutFixedContent = $this.find('.flyout-content-fixed'),
				$flyoutClose = $this.find('.flyout-close'),
				eventBubblingName = 'flyout.outsideClick' + iterator++;

			function open() {
				$flyoutTitle.toggleClass(activeClass);

				animate($flyoutContent).in();
				resetFlyoutPosition($flyoutContent);

				if (!$this.hasClass('fixed-content')) {
					return;
				}

				if (Breakpoint.to('md')) {
					setTimeout(function() {
						BodyScrolling.disable();
					}, 0);

					$body.addClass(fullSizeFlyoutClass);

					updateFlyoutSpacings();
				} else {
					calculateFlyoutPosition($flyoutContent);
					updateFlyoutSpacings(true);
				}
			}

			function close() {
				if (!isOpen()) {
					return;
				}

				animate($flyoutContent).out();

				$flyoutTitle.removeClass(activeClass);

				BodyScrolling.enable();

				$body.removeClass(fullSizeFlyoutClass);
			}

			function updateFlyoutSpacings(reset) {
				var offset = 40;
				if ($flyoutContent.parents('.full-size-content').length) {
					offset = 0;
				}

				$flyoutContent.css({
					paddingBottom: reset ? 0 : $flyoutFixedContent.height() + offset
				});
			}

			function isOpen() {
				return $flyoutTitle.hasClass(activeClass);
			}

			$flyoutTitle.on('click', function() {
				EventBubbling.intercept(eventBubblingName);

				if (isOpen()) {
					close();
				} else {
					open();
				}
			});

			$flyoutContent.on('click', function(e) {
				var $this = $(e.target);

				if (!$this.parents('.fixed-content').length) {
					return;
				}

				EventBubbling.intercept(eventBubblingName);
			});

			$flyoutClose.on('click', function() {
				close();
			});

			EventBubbling.on(eventBubblingName, function() {
				close();
			});

			Breakpoint.onBreakPointChange(function() {
				if (!isOpen()) {
					return;
				}

				if (Breakpoint.to('md')) {
					BodyScrolling.disable();
					updateFlyoutSpacings();

					$body.addClass(fullSizeFlyoutClass);
				} else {
					BodyScrolling.enable();
					updateFlyoutSpacings(true);

					$body.removeClass(fullSizeFlyoutClass);
				}
			});

			BrowserEvents.on('resize', function() {
				resetFlyoutPosition($flyoutContent);

				if (!Breakpoint.to('md')) {
					calculateFlyoutPosition($flyoutContent);
				}
			});
		});

		function animate($module) {
			return new Animate($module, {
				duration: transitionDurationFast
			});
		}

		function calculateFlyoutPosition($flyoutContainer) {
			var flyoutOffsetLeft = $flyoutContainer.offset().left,
				//Offset for Design Purposes
				offsetRight = 20,
				flyoutWidth = $flyoutContainer.outerWidth(),
				difference = $(window).width() - (flyoutOffsetLeft + flyoutWidth + offsetRight);

			if (difference < 0) {
				$flyoutContainer.css('left', difference);
			}
		}

		function resetFlyoutPosition($flyoutContainer) {
			$flyoutContainer.css('left', 0);
		}

		return this;
	};
}));

/* global jQuery */

(function(factory) {
	factory(
		_,
		jQuery
	);
}(function(_, $) {

	'use strict';

	$.fn.moduleFooter = function() {
		this.each(function (index, element) {
			var $this = $(element),
				$locationSelect = $this.find('.location-select'),
				$languageSelect = $this.find('.language-select');

			// Showcase redirect
			$locationSelect.on('change', function () {
				redirect($locationSelect.val());
			});

			// Showcase redirect
			$languageSelect.on('change', function () {
				redirect($languageSelect.val());
			});

			function redirect(url) {
				window.location.href = url;
			}

			return this;
		});
	};
}));

/* global jQuery, Bouncer */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('EventHub')
	);
}(function(_, $, EventHub) {

	'use strict';

	var $header = $('.module-header');

	$.fn.moduleForm = function() {
		this.each(function(index, element) {
			var $this = $(element),
				form = null,
				$form = $this.find('form'),
				$validationContainer = $this.find('.validation-messages'),
				$radioElements = $this.find('input[type="radio"]'),
				$datePickers = $this.find('input[type="date"]'),
				validationMessageObj = getValidationMessageObj();

			prepareDatepickers();

			form = new Bouncer('form', {
				messageCustom: 'data-bouncer-message',
				messages: validationMessageObj
			});

			/**
			 * Makes sure that both - supported and not supported datepickers show validation messages.
			 */
			function prepareDatepickers() {
				$datePickers.each(function (idx, el) {
					var $datePicker = $(el);

					if (hasNativeDatepickerSupport()) {
						$datePicker
							.removeAttr('pattern')
							.removeAttr('data-bouncer-message');
					}
				});
			}

			/**
			 * check for datepicker support
			 * see: https://gomakethings.com/how-to-check-if-a-browser-supports-native-input-date-pickers/
			 *
			 * @returns {boolean}
			 */
			function hasNativeDatepickerSupport() {
				var input = document.createElement('input'),
					value = 'a';

				input.setAttribute('type', 'date');
				input.setAttribute('value', value);

				return input.value !== value;
			}

			function getValidationMessageObj() {
				var $validationMessages = $validationContainer.find('[data-message-type]'),
					messages = {};

				$.each($validationMessages, function (idx, messageType) {
					var $messageType = $(messageType),
						messageTypeName = $messageType.data('message-type'),
						elementMessages = {};

					if (!messageTypeName) {
						return;
					}

					$.each(messageType.children, function (idx, elementType) {
						var $elementType = $(elementType),
							elementTypeName = $elementType.data('element-type');

						if (!elementTypeName) {
							return;
						}

						if (elementTypeName === 'select-multiple') {
							elementTypeName = '\'' + elementTypeName + '\'';
						}

						elementMessages[elementTypeName] = $elementType.html();
					});

					messages[_.camelCase(messageTypeName)] = elementMessages;
				});

				$validationContainer.remove();

				return messages;
			}

			$radioElements.on('change', function (e) {
				var $radio = $(e.target),
					currentGroupName = $radio.attr('name');

				$radioElements
					.filter('[name=' + currentGroupName + ']')
					.parents('.module-radio')
					.removeClass('has-error');
			});

			EventHub.on('add-field', 'add-button', function (payload) {
				var errors = false;

				if (!$form.is(payload.$form)) {
					return;
				}

				$.each(payload.$inputs, function (idx, el) {
					var validity = form.validate(el);

					if (validity && !validity.valid) {
						errors = true;
					}
				});

				if (!errors) {
					EventHub.trigger('add-field', 'add-enable');
				}
			});
		});

		document.addEventListener('bouncerShowError', function (event) {
			var field = event.target,
				$itemContainer = $(field).parents('[class^="module-"]').first();

			$itemContainer.addClass('has-error');
		}, false);

		document.addEventListener('bouncerFormInvalid', function (event) {
			$('html, body').animate({
				scrollTop: $(event.detail.errors[0]).offset().top - ($header.height() + 10)
			}, 0);
		}, false);

		document.addEventListener('bouncerRemoveError', function (event) {
			var field = event.target,
				$itemContainer = $(field).parents('[class^="module-"]').first();

			$itemContainer.removeClass('has-error');
		}, false);

		return this;
	};
}));

/* global _, jQuery */

(function (factory) {
	'use strict';
	factory(
		_,
		jQuery,
		window.dcApp.service('EventHub'),
		window.dcApp.service('AutoComplete'),
		window.dcApp.service('EventBubbling'),
		window.dcApp.service('BodyScrolling'),
		window.dcApp.service('BrowserEvents'),
		window.dcApp.service('Breakpoint')
	);
}(function (_, $, EventHub, AutoComplete, EventBubbling, BodyScrolling, BrowserEvents, Breakpoint) {

	'use strict';

	$.fn.moduleHeader = function () {
		this.each(function (index, element) {
			var navigationButton = element.querySelector('.btn-navigation'),
				fixedContainer = element.querySelector('.fixed-container'),
				searchArea = element.querySelector('.module-header-search'),
				searchForm = element.querySelector('.header-search'),
				searchField = element.querySelector('.search-field'),
				closeSearchWrapper = element.querySelector('.search-close'),
				closeSearch = element.querySelector('.search-close button'),
				metaNav = document.querySelector('.meta-nav'),
				toggleMetaNav = element.querySelector('.toggle-meta-nav'),
				toggleHeaderSearch = element.querySelector('.toggle-header-search'),
				toggleUserMenuAnchor = element.querySelector('.action-toggle-user-menu'),
				$toggleBasketItems = $('.toggle-basket-items'),
				basketWrapper = $('.basket-wrapper'),
				mobile,
				lastScrollTop = 0,
				startToggleHeader = 0; // value in px when header starts to hide

			bindListeners();
			initStickyHeader();


			/**
			 * Initial binding of Eventlisteners
			 */
			function bindListeners() {
				if (navigationButton) {
					navigationButton.addEventListener('click', function () {
						toggleNavigation();
					});
				}

				// Search
				if (searchArea) {
					searchArea.addEventListener('click', openSearchField);
				}
				if (closeSearch) {
					closeSearch.addEventListener('click', closeSearchField);
				}
				if (searchForm) {
					searchForm.addEventListener('submit', toggleSearchSubmit);
				}

				if (toggleMetaNav) {
					$toggleBasketItems.on('click', function () {
						toggleItems();
					});
				}

				if (toggleMetaNav) {
					toggleMetaNav.addEventListener('click', function () {
						toggleMetaNavigation();
					});
				}

				if (toggleHeaderSearch) {
					toggleHeaderSearch.addEventListener('click', function () {
						toggleHeaderSearchLayer();
					});
				}

				EventBubbling.on('header.outsideClick', function () {
					if (searchField && searchField.value.length < 1) {
						EventHub.trigger('header-element-toggle', 'outside-click', {
							active: false,
							fixScrolling: true
						});
					}
				});

				// Close Search on Outside Click
				EventHub.on('header-element-toggle', 'outside-click', function (event) {
					if (searchField && searchField.value.length === 0) {
						closeSearchField(event);
					}
				});

				// @TODO Remove when meta navigation is a single module.
				if (toggleUserMenuAnchor) {
					toggleUserMenuAnchor && toggleUserMenuAnchor.addEventListener('click', toggleUserMenu);
				}
			}

			function isMobile() {
				mobile = !!Breakpoint.to('md');

				EventHub.trigger('search-input-toggle', 'search-type', {
					mobileReady: mobile
				});
			}

			function toggleItems() {
				$(basketWrapper).toggleClass('no-items');
			}

			/**
			 * Open/Close Navigation
			 *
			 * @param {boolean} [force]
			 */
			function toggleNavigation(force) {
				var isActive;

				$(navigationButton).toggleClass('active', force);
				isActive = navigationButton.classList.contains('active');
				$(element).find('.header-top').toggleClass('active');

				if ($(element).find('.header-top').hasClass('active')) {
					BodyScrolling.disable();
				}

				EventHub.trigger('header-element-toggle', 'navigation', {
					active: isActive,
					fixScrolling: true
				});
			}

			EventHub.on('header-navigation-button', 'set-state', function (payload) {
				$(navigationButton).toggleClass('active', payload.active);
			});

			EventHub.on('header-meta-navigation-button', 'set-state', function (payload) {
				$(toggleMetaNav).toggleClass('active', payload.active);
			});

			/**
			 * Disable/Enable Search Submit Button
			 */
			function toggleSearchSubmit(event) {
				if (searchField && !searchField.value) {
					event.preventDefault();
				}
			}

			/**
			 * Expand the Search Area Desktop
			 */
			function openSearchField(event) {
				if (event.target !== closeSearch) {
					if (searchArea) {
						searchArea.classList.add('open');
					}
					if (searchField) {
						searchField.focus();
					}

					window.setTimeout(function () {
						if (searchArea) {
							searchArea.classList.add('animation-complete');
						}
					}, 350);
				}
			}

			/**
			 * Expand the Search Area Desktop
			 */
			function openSearchFieldInstant(event) {// jshint ignore:line
				if (event.target !== closeSearch) {
					if (searchArea) {
						searchArea.style.transition = 'none';
						searchArea.classList.add('open');
						searchArea.classList.add('animation-complete');
					}
					if (searchField) {
						searchField.focus();
					}
				}
			}

			/**
			 * Reduce the Search Area Desktop
			 */
			function closeSearchField() {
				if (searchArea) {
					searchArea.classList.remove('open');
					searchArea.addEventListener('click', openSearchField);
				}
				if (searchField) {
					searchField.value = '';
				}

				window.setTimeout(function () {
					if (searchArea) {
						searchArea.classList.remove('animation-complete');
					}
				}, 350);
			}

			/**
			 * Toggles the Meta Navigation Mobile
			 *
			 * @param {boolean} [state]
			 */
			function toggleMetaNavigation(state) {
				var isActive;

				$(toggleMetaNav).toggleClass('active', state);
				isActive = toggleMetaNav.classList.contains('active');

				EventHub.trigger('header-element-toggle', 'meta-navigation', {
					active: isActive
				});
			}

			/**
			 * Toggles the search layer on mobile breakpoint
			 *
			 * @param {boolean} [state]
			 */
			function toggleHeaderSearchLayer(state) {
				var isActive;

				$(toggleHeaderSearch).toggleClass('active', state);
				isActive = toggleHeaderSearch.classList.contains('active');

				EventHub.trigger('header-element-toggle', 'search', {
					active: isActive
				});
			}

			/**
			 * The meta navigation not yet is a module of its own, hence we need to bind twice.
			 * This method is to be deleted as soon as the meta navigation is finished.
			 * Keep in sync with #toggle-user-menu
			 *
			 * @deprecated The same function is within the meta navigation.
			 * @param {Event} event
			 */
			function toggleUserMenu(event) {
				event.preventDefault();

				EventHub.trigger('header-element-toggle', 'user-menu', {
					event: event,
					fixScrolling: true
				});
			}

			/**
			 * Listens to scroll events and sets sticky class to header. Animation via CSS.
			 */
			function initStickyHeader() {

				$(window).scroll(function () {
					if ($('.module-header.lock-header').length) {
						return false;
					}

					var st = $(this).scrollTop();

					if (st === lastScrollTop) {
						return;
					}

					if (st > lastScrollTop && st > startToggleHeader) {
						if (!$('body').hasClass('body-no-scroll')) {
							if (Breakpoint.to('sm')) { // mobile
								if (fixedContainer) {
									fixedContainer.classList.add('state-hidden');
								}
							} else { // tablet & desktop
								if (searchField && searchField.value.length > 0) {
									if (fixedContainer) {
										fixedContainer.classList.remove('state-hidden');
									}
								} else {
									if (fixedContainer) {
										fixedContainer.classList.add('state-hidden');
									}
								}
							}
						}
					} else {
						fixedContainer.classList.remove('state-hidden');
					}

					lastScrollTop = st;
				});
			}

			var handleOrientaton = function () {
				$(window).on('orientationchange', function () {
					isMobile();
				});
			};
			handleOrientaton();

			var handleResize = function () {
				var width = $(window).width();
				$(window).on('resize', function () {
					if ($(this).width() !== width) {
						width = $(this).width();
						isMobile();
					}
				});
			};
			handleResize();


			/*
			 * @TODO Legacy code, this must be moved into the meta nav module code as soon as finished.
			 */
			EventHub.on('header-meta-navigation-data', 'desktop', function (callback) {
				var $metaNavigation = $(metaNav);

				callback({
					height: $metaNavigation.height(),
					offsetTop: 0,
					isVisible: $metaNavigation.is(':visible'),
					$userMenuAnchor: $(toggleUserMenuAnchor)
				});
			});

			/*
			 * @TODO Legacy code, this can also be found inside the meta navigation, but is currently split up because it does not reuse the module.
			 */
			EventHub.on('header-meta-navigation-user-menu', 'set-state', function (payload) {
				$(toggleUserMenuAnchor).toggleClass('active', payload.active);
			});

			window.setTimeout(function () {
				if (closeSearchWrapper) {
					closeSearchWrapper.classList.add('initialized');
				}
			}, 500);

			EventHub.on('search-input-toggle', 'search-type', function (payload) {
				if (searchField && searchField.value.length > 0) {
					if (payload.mobileReady) {
						if (fixedContainer) {
							fixedContainer.classList.add('has-sort-filter');
						}
						window.setTimeout(function () {
							toggleHeaderSearchLayer(true);
						}, 500);
					} else {
						toggleHeaderSearchLayer(false);

						window.setTimeout(function () {
							openSearchField(true);
						}, 500);
					}
				} else {
					if (fixedContainer) {
						fixedContainer.classList.remove('has-sort-filter');
					}
				}
			});

			EventHub.on('search-input-toggle', 'search-state', function (payload) {
				if (payload.isOpen) {
					EventHub.trigger('search-input-toggle', 'search-state-callback', {
						isOpen: true
					});
				} else {
					EventHub.trigger('search-input-toggle', 'search-state-callback', {
						isOpen: false
					});
				}
			});

			EventHub.on('search-sort', 'sticky-sort', function (payload) {
				if (element.querySelector('.filter-sorting-bar-clone') !== null && element.querySelector('.filter-sorting-bar-clone').childNodes.length > 0) {
					element.querySelector('.sort-title').innerHTML = payload.selectTitle;
				}
			});
		});
	};

}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('EventHub'),
		window.dcApp.service('Animate'),
		window.dcApp.service('BodyScrolling')
	);
}(function(_, $, EventHub, Animate, BodyScrolling) {

	'use strict';

	$.fn.moduleHorizontalNavigation = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$reference = null,
				$headerElement = null,
				$closeNav = $this.find('.close-flyout'),
				$toggleFlyout = $this.find('.toggle-flyout'),
				$horizontalNavFlyout = $this.find('.horizontal-nav-flyout'),
				transitionDurationFast = 250; // Keep in sync with css #header-horizontal-navigation.

			function open(headElement) {
				close();
				$toggleFlyout.not(headElement).removeClass('active');
				$(headElement).toggleClass('active');
				new Animate($reference, {
					duration: transitionDurationFast
				}).in();
				BodyScrolling.disable();
			}

			function close(fixScrolling) {
				$toggleFlyout.removeClass('active');
				if (fixScrolling) {
					BodyScrolling.enable();
				}
				new Animate($horizontalNavFlyout.filter('.show'), {
					duration: transitionDurationFast
				}).out();
			}

			/**
			 * EventHub for open/close function
			 */
			EventHub.on(
				'header-element-toggle',
				'horizontal-navigation',
				function(payload) {
					if (payload.element) {
						$reference = $(payload.element[0]);
						$headerElement = $(payload.headerElement[0]);
					}

					payload.active
						? open($headerElement)
						: close(payload.fixScrolling);
				},
				function() {
					close();
				}
			);

			/**
			 * Open/Close Horizontal Navigation
			 */
			$toggleFlyout.on('click', function() {
				var $headerElement = $(this),
					flyoutId = $headerElement.data('flyoutid'),
					$element = $('#' + flyoutId);

				EventHub.trigger('header-element-toggle', 'horizontal-navigation', {
					active: !$element.hasClass('show'),
					element: $element,
					headerElement: $headerElement,
					fixScrolling: true
				});
			});

			/**
			 * Close Horizontal Navigation on click on Close Button
			 */
			$closeNav.on('click', function() {
				EventHub.trigger('header-element-toggle', 'horizontal-navigation', {
					active: false,
					fixScrolling: true
				});
			});
		});

		return this;
	};

}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('EventHub')
	);
}(function(_, $, EventHub) {

	'use strict';

	$.fn.moduleHeaderMetaNavigation = function() {
		var $this = this,
			$toggleUserMenu = $this.find('.action-toggle-user-menu');

		/**
		 * @param {boolean} instant true to prevent the animation.
		 */
		function open(instant) {
			$this.addClass('activate');

			if (instant) {
				$this.addClass('show');
				return;
			}

			window.setTimeout(function() {
				$this.addClass('show');
			}, 0);
		}

		function close() {
			$this.removeClass('show');

			window.setTimeout(function() {
				$this.removeClass('activate');
			}, 350); // Keep in sync with css #header-meta-navigation.

			EventHub.trigger('header-meta-navigation-button', 'set-state', {
				active: false
			});
		}

		/*
		 * Since this module only covers the meta navigation extension another
		 * listener is necessary within the header.
		 *
		 * Keep in sync with #toggle-user-menu
		 */
		$this.find('.action-toggle-user-menu').on('click', function(event) {
			event.preventDefault();

			EventHub.trigger('header-element-toggle', 'user-menu', {
				event: event,
				ignoreMetaNavigation: true,
				fixScrolling: true
			});
		});

		EventHub.on('header-meta-navigation-user-menu', 'set-state', function(payload) {
			$toggleUserMenu.toggleClass('active', payload.active);
		});

		EventHub.on('header-element-toggle', 'meta-navigation',
			function(payload) {
				payload.active
					? open(payload.instaOpen)
					: close();
			},
			function(payload) {
				if (!payload.ignoreMetaNavigation) {
					close();
				}
			}
		);

		// Using a different event to prevent other elements to be closed.
		EventHub.on('header-single-element-toggle', 'meta-navigation', function(payload) {
			open(payload.instaOpen);
		});

		// @TODO Use this as soon as a common module serves both meta navigations, using a data-switch or something.
		EventHub.on('header-meta-navigation-data', 'mobile', function(callback) {
			// Provide a block of data for whatever use. The requester may pick what he needs.
			callback({
				height: $this.height(),
				offsetTop: $this.parents('.module-header').find('.header-top').height(),
				isVisible: $this.is(':visible'),
				$userMenuAnchor: $this.find('.action-toggle-user-menu')
			});
		});

		return this;
	};

}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('Animate'),
		window.dcApp.service('BodyScrolling'),
		window.dcApp.service('Breakpoint'),
		window.dcApp.service('EventHub'),
		window.dcApp.service('BrowserEvents')
	);
}(function(_, $, Animate, BodyScrolling, Breakpoint, EventHub, BrowserEvents) {

	'use strict';

	var fullSizeFlyoutClass = 'full-size-flyout',
		$body = $('body');

	$.fn.moduleHeaderNavigation = function() {
		var $this = this,
			topLevelId = $this.data('top-level-id'),
			$breadcrumbs = $this.find('.header-navigation-breadcrumbs'),
			$navigationBlocks = $this.find('.header-navigation-block'),
			$topLevelNavigation = $this.find('#' + topLevelId),
			transitionDurationFast = 250, // Keep in sync with css #header-navigation.
			linkHeight = 50, // Keep the link height in sync with css #header-navigation.
			animateModule,
			isOpen = false;

		function open() {
			isOpen = true;

			BodyScrolling.disable();
			animateModule.in();
		}

		function close(fixScrolling) {
			isOpen = false;

			window.setTimeout(resetNavigationBlock, transitionDurationFast);
			if (fixScrolling && !$body.hasClass(fullSizeFlyoutClass)) {
				BodyScrolling.enable();
			}
			animateModule.out();

			EventHub.trigger('header-navigation-button', 'set-state', {
				active: false
			});
		}

		/**
		 * We could read out the height of an individual link, but the
		 * first one may be multi-lined and we'd link to use the base-height
		 * as our foundation. Hence in the rush of time given, the value
		 * just is predefined here.
		 */
		function updateLinkListHeight($navigationBlock) {
			var $content = $navigationBlock.find('.header-navigation-content'),
				minAmountOfLinks = 4,
				columnsCount = 1,
				linkCount,
				linksPerColumn,
				height;

			if (Breakpoint.is('md')) {
				columnsCount = 2;
			}
			else if (
				Breakpoint.is('lg') ||
				Breakpoint.is('xl')
			) {
				columnsCount = 3;
			}

			linkCount = $content.find('.content-item').length;

			linksPerColumn = linkCount / columnsCount;
			linksPerColumn = Math.ceil(linksPerColumn);
			linksPerColumn = Math.max(minAmountOfLinks - 1, linksPerColumn);
			linksPerColumn += 1; // -1 min amount and +1 here makes space for multi-line links.

			height = linksPerColumn * linkHeight;

			// Do not use max-height, since it will not work with ie11 flex wrap.
			$content.find('.list-content').css('height', height + 'px');
		}

		/**
		 * @param {jQuery} $navigationBlock
		 */
		function updateBreadcrumbs($navigationBlock) {
			var breadcrumbsHtml = $navigationBlock
				.find('.header-navigation-breadcrumbs-template')
				.html();

			$breadcrumbs.html(breadcrumbsHtml);
		}

		function resetNavigationBlock() {
			$navigationBlocks.removeClass('show animate-left-out animate-right-out animate-left-in animate-right-in');
			$topLevelNavigation.addClass('show');

			updateBreadcrumbs($topLevelNavigation);
			updateLinkListHeight($topLevelNavigation);
		}

		/**
		 * @param {jQuery} $blockToActivate
		 */
		function activateNavigationBlock($blockToActivate) {
			var $blockToDeactivate = getActiveNavigationBlock(),
				animateClassIn = 'animate-left-in',
				animateClassOut = 'animate-left-out';

			if (
				$blockToDeactivate.length > 0 &&
				$blockToDeactivate.data('level') > $blockToActivate.data('level')
			) {
				animateClassIn = 'animate-right-in';
				animateClassOut = 'animate-right-out';
			}

			$blockToDeactivate
				.removeClass('animate-left-in animate-right-in')
				.addClass(animateClassOut);

			updateBreadcrumbs($blockToActivate);

			window.setTimeout(function() {
				$blockToDeactivate.removeClass('show animate-left-out animate-right-out');

				$blockToActivate
					.addClass('show')
					.addClass(animateClassIn);

				updateLinkListHeight($blockToActivate);
			}, transitionDurationFast);
		}

		/**
		 * @returns {jQuery}
		 */
		function getActiveNavigationBlock() {
			return $navigationBlocks.filter('.show');
		}

		animateModule = new Animate($this, {
			duration: transitionDurationFast
		});

		EventHub.on(
			'header-element-toggle',
			'outside-click',
			function(payload) {
				payload.active
					? open()
					: close(payload.fixScrolling);
			}
		);

		EventHub.on('header-element-toggle', 'navigation',
			function(payload) {
				payload.active
					? open()
					: close(payload.fixScrolling);
			},
			function() {
				close();
			}
		);

		BrowserEvents.on('resize', function() {
			if (!isOpen) {
				return;
			}

			updateLinkListHeight(
				getActiveNavigationBlock()
			);
		});

		$this.on('click', '.action-header-navigate', function(event) {
			var targetId = this.dataset.targetId,
				$target;

			if (!targetId) {
				return;
			}

			event.preventDefault();
			$target = $('#' + targetId);
			activateNavigationBlock($target);
		});

		resetNavigationBlock();

		return this;
	};
}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('AutoComplete'),
		window.dcApp.service('EventHub'),
		window.dcApp.service('GlobalFunctions')
	);
}(function(_, $, AutoComplete, EventHub, GlobalFunctions) {

	'use strict';

	$.fn.moduleHeaderSearch = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$searchField = $this.find('.search-field'),
				$searchClose = $this.find('.search-close'),
				$searchToggle = $this.find('.toggle-header-search'), // @TODO It is not really clear why this appears twice. Refactor with header refactoring.
				$form = $this.find('form');

			if (GlobalFunctions.getUrlParameter('q')) {
				$searchField.val(GlobalFunctions.getUrlParameter('q'));
			}

			$form.on('submit', function(e) {
				if ($searchField.val().length === 0) {
					e.preventDefault();
				} else {
					$searchField.val($searchField.val().trim());
				}
			});

			if (GlobalFunctions.getUrlParameter('q')) {
				$searchField.val(GlobalFunctions.getUrlParameter('q'));
			}

			$searchClose.on('click', function() {
				EventHub.trigger('header-element-toggle', 'search', {
					active: false
				});

				$searchToggle.removeClass('active');
			});

			EventHub.on('header-element-toggle', 'search',
				function(payload) {
					payload.active ? open() : close();
				},
				function() {
					close();
				}
			);

			function open() {
				$this.addClass('activate');
				$searchToggle.addClass('active');

				EventHub.trigger('search-input-toggle', 'search-state', {
					isOpen: true
				});

				window.setTimeout(function() {
					$this.addClass('show');
				}, 0);

				window.setTimeout(function() {
					$this.addClass('opened');
					$searchField.focus();
				}, 350);
			}

			function close() {
				$this.removeClass('show opened');
				$searchToggle.removeClass('active');

				EventHub.trigger('search-input-toggle', 'search-state', {
					isOpen: false
				});

				window.setTimeout(function() {
					$this.removeClass('activate');
				}, 350); // Keep in sync with css #header-search.
			}

			AutoComplete({
				selector: $searchField.get(0),
				url: $searchField.get(0).dataset.searchUrl,
				minChars: 3,
				responseHook: function(response) {
					var result = [];

					_.each(response.results, function(responseItem) {
						result.push(responseItem.name);
						if (result.length >= 5) {
							return false;
						}
					});

					return result;
				}
			});

			setTimeout(function(){
				$searchClose.addClass('initialized');
			},500);

		});
		return this;
	};

}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('Animate'),
		window.dcApp.service('BodyScrolling'),
		window.dcApp.service('EventHub')
	);
}(function(_, $, Animate, BodyScrolling, EventHub) {

	'use strict';

	$.fn.moduleHeaderUserMenu = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$closeMenu = $this.find('.action-close-menu'),
				transitionDurationFast = 250, // Keep in sync with css #header-user-menu.
				animateModule,
				isOpen = false;

			function open() {
				isOpen = true;

				BodyScrolling.disable();
				animateModule.in();

				update();

				updateIcon(isOpen);
			}

			function close(fixScrolling) {
				isOpen = false;


				if (fixScrolling) {
					BodyScrolling.enable();
				}
				animateModule.out();

				updateIcon(isOpen);
			}

			function update() {
				/**
				 * @param {number} offset of the mobile meta navigation.
				 * @param {number} height of the mobile meta navigation.
				 */
				function updateModuleOffset(offset, height) {
					var marginTop = 0,
						maxHeight = 'none',
						paddingMenuBottom = parseInt($this.css('paddingBottom'));

					if (offset > 0) {
						marginTop = height + 'px';
						maxHeight = 'calc(100vh - {height}px)'.replace('{height}', offset + height - paddingMenuBottom);
					}

					$this.css({
						marginTop: marginTop,
						maxHeight: maxHeight
					});
				}

				EventHub.trigger('header-meta-navigation-data', 'desktop', function(payload) {
					if (payload.isVisible) {
						updateModuleOffset(0, 0);

						return;
					}

					if (isOpen) {
						EventHub.trigger('header-single-element-toggle', 'meta-navigation', {
							instaOpen: true
						});
					}

					EventHub.trigger('header-meta-navigation-data', 'mobile', function(payload) {
						updateModuleOffset(payload.offsetTop, payload.height);
					});
				});
			}

			/**
			 * @param {boolean} state of the trigger user menu icon.
			 */
			function updateIcon(state) {
				EventHub.trigger('header-meta-navigation-user-menu', 'set-state', {
					active: state
				});
			}

			animateModule = new Animate($this, {
				duration: transitionDurationFast
			});

			EventHub.on(
				'header-element-toggle',
				'user-menu',
				function(payload) {
					// payload.event.target is also available.

					isOpen = payload.active === undefined
						? !isOpen // Toggle.
						: !!payload.active; // Take new state.

					isOpen
						? open()
						: close(payload.fixScrolling);
				},
				function() {
					close();
				}
			);

			$closeMenu.on('click', function() {
				EventHub.trigger('header-element-toggle', 'user-menu', {
					active: false,
					fixScrolling: true
				});
			});

			$(window).on('resize', function() {
				// A real world example should also debounce this.
				if (!isOpen) {
					return;
				}

				update();
			});

			update();
		});

		return this;
	};

}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		tns
	);
}(function(_, $, tns) {

	'use strict';

	$.fn.moduleImageGallery = function() {
		this.each(function(index, element) {
			var $this = $(element),
				tnsOptions = {
					container: $this.find('.img-gallery').get(0),
					controls: true,
					controlsContainer: $this.find('.arrows').get(0),
					nav: true,
					navContainer: $this.find('.dots').get(0),
					navPosition: 'bottom',
					mouseDrag: true,
					touch: true,
					autoWidth: false,
					autoHeight: false,
					speed: 350, // Keep in sync with CSS #gallery-animation-speed
					loop: true,
					items: 1,
					arrowKeys: true
				},
				pauseOnHover = $this.data('pause-on-hover'),
				gallerySlider;

			if($this.hasClass('autoplay')) {
				tnsOptions.autoplay = true;
				tnsOptions.autoplayTimeout = $this.data('autoplayspeed');
				tnsOptions.autoplayHoverPause = pauseOnHover ? pauseOnHover : false;
				tnsOptions.autoplayButtonOutput = false;

				if (pauseOnHover) {
					var $controls = $this.find('.prev, .next');

					// stops autoplay on mouseover of nav controls
					$controls.on('mouseenter', function () {
						gallerySlider.pause();
					});

					// starts autoplay on mouseleave of nav controls
					$controls.on('mouseleave', function () {
						gallerySlider.play();
					});

					// prevents focus/active state on mobile and makes sure, that autoplay will not be interrupted.
					$controls.on('touchstart', function (e) {
						e.preventDefault();
						$(this).trigger('click');
					});
				}
			}

			gallerySlider = tns(tnsOptions);
		});

		return this;
	};

}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('BrowserEvents'),
		window.dcApp.service('Breakpoint')
	);
}(function(_, $, BrowserEvents, Breakpoint) {

	'use strict';

	$.fn.moduleImageHotspot = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$hotspotToggles = $this.find('.hotspot-toggle'),
				$hotspotContentContainer = $this.find('.hotspot-contents-container'),
				$hotspotContentClose = $this.find('.hotspot-content-close');

			alignHotspotToggles($hotspotToggles);

			$hotspotToggles.on('click', showHotspotInfoLayer.bind(null, $this));

			$hotspotContentClose.on('click', function() {
				closeHotspotInfoLayer($hotspotContentContainer, $this);
			});

			BrowserEvents.on('resize', function() {
				var breakpoint = Breakpoint.getCurrentBreakpoint();

				if (breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md') {
					$hotspotToggles.removeAttr('style');
					hideHotspotToggles($hotspotToggles);
				} else {
					alignHotspotToggles($hotspotToggles);
				}

				resizeModule($this);
			});
		});

		/**
		 * Resize Module on browserresize
		 * @param container
		 * @param reset
		 */
		function resizeModule(container, reset) {
			var current = $('.hotspot-content.active').find('.hotspot-content-image').height(),
				$hotspotTeaserContainer = $(container).find('.hotspot-teaser-container'),
				teaserContainerHeight = $hotspotTeaserContainer.height(),
				margin = current - teaserContainerHeight;

			if (reset) {
				setTimeout(function() {
					$hotspotTeaserContainer.css('margin-bottom', 0);
					return;
				}, 600);
			}

			if (current) {
				if (margin > 0) {
					$hotspotTeaserContainer.css('margin-bottom', margin);
				} else {
					$hotspotTeaserContainer.css('margin-bottom', '0');
				}
			}
		}

		/**
		 * Initializes the positioning of all hotspot toggles
		 *
		 * @param $toggles
		 */
		function alignHotspotToggles($toggles) {
			$.each($toggles, initHotspotToggle);
		}

		/**
		 * Aligns the given hotspot toggle on it's defined position on the image.
		 * The coordinates are percentage values from the top left corner.
		 *
		 * @param idx
		 * @param toggle
		 */
		function initHotspotToggle(idx, toggle) {
			var $toggle = $(toggle),
				dataPos = $toggle.data('pos'),
				pos = dataPos && dataPos.toString().indexOf('|') > -1 ? dataPos.split('|') : [0,0];

			$toggle.css({
				left: pos[0] + '%',
				top: pos[1] + '%'
			});

			$toggle.addClass('active');
		}

		/**
		 * Hides all hotspot toggles
		 *
		 * @param $hotspotToggles
		 */
		function hideHotspotToggles($hotspotToggles) {
			$hotspotToggles.removeClass('active');
		}

		/**
		 * Shows the hotspot information layer of the selected toggle.
		 *
		 * @param $module
		 * @param event
		 */
		function showHotspotInfoLayer($module, event) {
			var $toggle = $(event.currentTarget),
				$hotspotContents = $module.find('.hotspot-content'),
				dataHotspotName = $toggle.data('hotspot-name'),
				$currentHotspotContent;

			$hotspotContents.removeClass('active');

			if (dataHotspotName) {
				$currentHotspotContent = $hotspotContents.filter('[data-hotspot-name="' + $toggle.data('hotspot-name') + '"]');
			}

			if (!$currentHotspotContent) {
				return;
			}

			$currentHotspotContent
				.addClass('active')
				.parent().addClass('show');


			resizeModule($module);

		}

		/**
		 * Hides the shown info layer
		 * @param $hotspotContentContainer
		 * @param $this
		 */
		function closeHotspotInfoLayer($hotspotContentContainer, $this) {

			$hotspotContentContainer
				.removeClass('show');

			setTimeout(function() {
				$hotspotContentContainer.find('.active').removeClass('active');
			}, 600);

			resizeModule($this, true);
		}

		return this;
	};
}));

/* global jQuery, PinchZoom */

(function (factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('BodyScrolling'),
		PinchZoom
	);
}(function (_, $, BodyScrolling, PinchZoom) {

	'use strict';

	function hasTouch() {
		return 'ontouchstart' in document.documentElement;
	}

	$.fn.moduleImageZoom = function () {
		this.each(function (index, element) {
			var $this = $(element),
				$img_ele = null,
				event_start = hasTouch() ? 'touchstart' : 'mousedown',
				event_move = hasTouch() ? 'touchmove' : 'mousemove',
				event_end = hasTouch() ? 'touchend' : 'mouseup',
				$increment = $this.find('.increment'),
				$decrement = $this.find('.decrement'),
				$container = $this.find('.module-image'),
				$zoomValue = $this.find('.form-control'),
				x_img_ele = null,
				y_img_ele = null,
				myElement = document.getElementById('drag-img'),
				zoomSteps = [25, 33, 50, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500],
				zoomIndex = 6,
				maxZoom = Math.max.apply(null, zoomSteps),
				minZoom = Math.min.apply(null, zoomSteps);

			$zoomValue.attr({
				"max": maxZoom,
				"min": minZoom
			});

			function disableZoom() {
				var value = parseInt($zoomValue.val());

				if (value === parseInt(maxZoom)) {
					$increment.addClass('disabled');
				} else {
					$increment.removeClass('disabled');
				}

				if (value === parseInt(minZoom)) {
					$decrement.addClass('disabled');
				} else {
					$decrement.removeClass('disabled');
				}
			}

			function zoom(zoomincrement) {
				$img_ele = document.getElementById('drag-img');

				var pre_width = document.getElementsByClassName('zoom-wrapper')[0].getBoundingClientRect().width,
					pre_height = document.getElementsByClassName('zoom-wrapper')[0].getBoundingClientRect().height;

				zoomincrement = zoomincrement / 100;

				setTimeout(function () {
					$img_ele.style.width = (pre_width * zoomincrement) + 'px';
					$img_ele.style.height = (pre_height * zoomincrement) + 'px';
					$img_ele = null;
				}, 0);
			}

			$decrement.on('click', function () {
				setTimeout(function () {
					zoomIndex--;
					zoom(zoomSteps[zoomIndex]);
					$zoomValue.val(zoomSteps[zoomIndex]);
					resetPosition();
					disableZoom();
				}, 0);
			});

			$increment.on('click', function () {
				setTimeout(function () {
					zoomIndex++;
					zoom(zoomSteps[zoomIndex]);
					$zoomValue.val(zoomSteps[zoomIndex]);
					resetPosition();
					disableZoom();
				}, 0);
			});

			function resetPosition() {
				var $img_ele = document.getElementById('drag-img');

				$img_ele.style.left = 0 + '%';
				$img_ele.style.top = 0 + '%';

			}

			function start_drag(event) {
				BodyScrolling.disable();
				var x_cursor = hasTouch() ? event.changedTouches[0].clientX : event.clientX,
					y_cursor = hasTouch() ? event.changedTouches[0].clientY : event.clientY;

				$img_ele = document.getElementById('drag-img');
				zoomHelper(x_cursor, y_cursor);
			}

			function stop_drag() {
				$img_ele = null;
				BodyScrolling.enable();
			}

			function zoomHelper(x_cursor, y_cursor) {
				var $img_ele = document.getElementById('drag-img');
				x_img_ele = x_cursor - $img_ele.offsetLeft;
				y_img_ele = y_cursor - $img_ele.offsetTop;
			}

			function while_drag(event) {

				var x_cursor = hasTouch() ? event.changedTouches[0].clientX : event.clientX,
					y_cursor = hasTouch() ? event.changedTouches[0].clientY : event.clientY;
				if ($img_ele !== null) {
					$img_ele.style.left = (x_cursor - x_img_ele) + 'px';
					$img_ele.style.top = (y_cursor - y_img_ele) + 'px';
				}
			}

			document.getElementById('drag-img').addEventListener(event_start, start_drag);
			$container.on(event_move, while_drag);
			$container.on(event_end, stop_drag);

			setTimeout(function () {
				var pz = new PinchZoom(myElement, {
					draggableUnzoomed: false,
					minZoom: 0.25
				});
			}, 0);

		});
	};
}));

/* global jQuery */

(function(factory) {
	factory(
		_,
		jQuery
	);
}(function(_, $) {

	'use strict';

	$.fn.moduleInput = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$input = $this.find('input, textarea').not($this.find('input[type=hidden]')),
				$remainingCharacters = $this.find('.remaining-characters'),
				maxLength,
				rawText;

			function update() {
				var remainingCharacters = maxLength - $input.val().length;

				$remainingCharacters.text(
					rawText.replace('!!!remainingCharacters!!!', remainingCharacters)
				);
			}

			$input.on('focus blur', function(event) {
				$(this).parents('.floating-label').toggleClass('is-focused', event.type === 'focus' || this.value.length > 0);
			}).trigger('blur');

			if (!$remainingCharacters.length) {
				return;
			}

			maxLength = $input.attr('maxlength');
			rawText = $remainingCharacters.data('text');
			$input.on('keyup', update);

			update();
		});

		return this;
	};
}));

/* global jQuery */

(function (factory) {

	'use strict';

	factory(
		_,
		jQuery,
		window.dcApp.service('Animate'),
		window.dcApp.service('EventHub'),
		window.dcApp.service('BodyScrolling'),
		window.dcApp.service('Breakpoint')
	);
}(function (_, $, Animate, EventHub, BodyScrolling, Breakpoint) {

	'use strict';

	$.fn.moduleLanguageLocationSelect = function () {
		this.each(function (index, element) {
			var $this = $(element),
				$languageFlyout = $this.find('.flyout'),
				$closeFlyout = $this.find('.close-flyout'),
				$toggleWrapper = $this.find('.flyout-toggle-wrapper'),
				$toggleFlyout = $('.flyout-toggle'),
				$languageElement = $this.find('.module-dropdown.language'),// jshint ignore:line
				$locationSelect = $this.find('.module-dropdown.location select'),
				$languageSelect = $this.find('.module-dropdown.language select'),
				$languageModal = $this.closest('.module-header').find('.modal-language-select');

			EventHub.on(
				'header-element-toggle',
				'current-location',
				function (payload) {
					payload.active
						? open()
						: close(payload.fixScrolling);
				},
				function () {
					close();
				}
			);

			/**
			 * Open/Close
			 */
			$toggleFlyout.on('click', function () {
				if (!$this.hasClass('inside-modal')) {
					EventHub.trigger('header-element-toggle', 'current-location', {
						active: !$languageFlyout.hasClass('active'),
						fixScrolling: true
					});
				}
			});

			$closeFlyout.on('click', function () {
				EventHub.trigger('header-element-toggle', 'current-location', {
					active: false,
					fixScrolling: true
				});
			});

			/**
			 * Close Language Selects on Breakpointchange
			 */
			Breakpoint.onBreakPointChange(function () {
				$closeFlyout.trigger('click');
				$languageModal.moduleModal('close');
			});

			function open() {
				if (window.pageYOffset !== 0) {
					$('html, body').animate({scrollTop: 0}, 'slow');
				}

				BodyScrolling.disable();
				$languageFlyout.slideDown().addClass('active');
				$toggleWrapper.addClass('active');
			}

			function close(fixScrolling) {
				if (fixScrolling) {
					BodyScrolling.enable();
				}

				$languageFlyout.slideUp().removeClass('active');
				$toggleWrapper.removeClass('active');
			}

			// if (!$this.hasClass('show') && $this.closest('.module-top').hasClass('active')) {
			// 	BodyScrolling.disable();
			// }

			// Showcase redirect
			$locationSelect.on('change', function () {
				redirect($locationSelect.val());
			});

			// Showcase redirect
			$languageSelect.on('change', function () {
				redirect($languageSelect.val());
			});

			$('.open-language-select').on('click', function () {
				if ($('.fixed-container').hasClass('state-hidden')) {
					$('.fixed-container').removeClass('state-hidden');
				}
				$languageModal.moduleModal('open');
			});

			function redirect(url) {
				window.location.href = url;
			}
		});

		return this;
	};

}));

/* global jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service("Animate"),
		window.dcApp.service("BodyScrolling"),
		window.dcApp.service("Breakpoint"),
		window.dcApp.service("EventHub"),
		window.dcApp.service("BrowserEvents")
	);
})(function (
	_,
	$,
	tns,
	Animate,
	BodyScrolling,
	Breakpoint,
	EventHub,
	BrowserEvents
) {
	"use strict";

	var transitionDurationFast = 250, // Keep in sync with css #modal-animation.
		$html = $("html"),
		activeClass = "modal-active",
		$zoomPreviewSlider = null;

	function Modal() {}

	/**
	 * @param $module
	 */
	Modal.prototype.initialize = function ($module) {
		var self = this;

		// console.log($module);

		$module.find(".modal-close, .modal-continue").on("click", function () {
			self.close($module);
		});

		if (!$module.hasClass("modal-disclaimer")) {
			$module.on("click", function (event) {
				if (event.target === this) {
					self.close($module);
				}
			});
		}

		if ($module.hasClass("modal-disclaimer")) {
			var $scrollArea = $module.find(".modal-body"),
				$closeModal = $module.find(".disclaimer-close");

			$scrollArea.on("scroll", function () {
				if (
					$scrollArea[0].scrollHeight -
						$scrollArea[0].scrollTop -
						$scrollArea[0].clientHeight <
					1
				) {
					$closeModal.removeClass("disabled");
				}
			});
		}

		Breakpoint.onBreakPointChange(function () {
			paddings($module);
		});
	};

	Modal.prototype.animate = function ($module) {
		return new Animate($module, {
			duration: transitionDurationFast,
		});
	};

	/**
	 * @param $module
	 */
	Modal.prototype.open = function ($module) {
		var isFullWidthVideo = $module.hasClass("fullwidth-video");

		BodyScrolling.disable();
		this.animate($module).in();
		paddings($module);
		$html.addClass(activeClass);

		$zoomPreviewSlider = $module.find(".zoom-modal-slider");

		if ($zoomPreviewSlider.length) {
			EventHub.trigger("zoom-preview-slider", "init", {
				$zoomPreviewSlider: $zoomPreviewSlider,
			});
		}

		if (isFullWidthVideo) {
			EventHub.trigger("fullwidth-video", "play", {
				$player: $module.find(".plyr"),
			});

			calculateModalHeight($module, isFullWidthVideo);
		}

		BrowserEvents.on("resize", function () {
			calculateModalHeight($module, isFullWidthVideo);
		});

		setTimeout(function () {
			EventHub.trigger("rebuild-slider", "rebuild");
		}, transitionDurationFast);

		if ($module.hasClass("modal-disclaimer")) {
			var $scrollArea = $module.find(".modal-body"),
				$closeModal = $module.find(".disclaimer-close");

			if (
				!(
					$scrollArea[0].scrollWidth > $scrollArea[0].clientWidth ||
					$scrollArea[0].scrollHeight > $scrollArea[0].clientHeight
				)
			) {
				$closeModal.removeClass("disabled");
			}
		}
	};

	function calculateModalHeight($module, isFullWidthVideo) {
		var windowHeight = $(window).height();

		$module.removeClass("bigger-than-screen");

		if (windowHeight <= $module.find(".modal-dialog").height()) {
			$module.addClass("bigger-than-screen");
		} else {
			$module.removeClass("bigger-than-screen");
		}

		if (isFullWidthVideo) {
			$module
				.find(".modal-dialog")
				.css("maxWidth", (windowHeight - 60) * (16 / 9));
		}
	}

	/**
	 * @param $element
	 */
	function paddings($element) {
		var $this = $element,
			$modalContent = $this.find(".modal-content"),
			$stickyFooter = $this.find(".modal-footer");

		if (!$stickyFooter.length) {
			return;
		}

		if (
			Breakpoint.to("md") &&
			($this.hasClass("mobile-fullscreen") ||
				$this.hasClass("modal-sticky-footer"))
		) {
			$modalContent.css({ paddingBottom: $stickyFooter[0].clientHeight });
		} else {
			$modalContent.css({ paddingBottom: 0 });
		}
	}

	/**
	 * @param $module
	 */
	Modal.prototype.close = function ($module) {
		var isFullWidthVideo = $module.hasClass("fullwidth-video");

		if ($module[0].callback) {
			$module[0].callback(event, $module[0]);
		}

		if (
			!$module.closest(".module-header").find(".header-top").hasClass("active")
		) {
			BodyScrolling.enable();
		}

		this.animate($module).out();
		$html.removeClass(activeClass);

		if (isFullWidthVideo) {
			EventHub.trigger("fullwidth-video", "stop", {
				$player: $module.find(".plyr"),
			});
		}

		var resizeEvent = window.document.createEvent("UIEvents");
		resizeEvent.initUIEvent("resize", true, false, window, 0);
		window.dispatchEvent(resizeEvent);
	};

	/**
	 * Helper Function to set a Callback
	 * @param callback - Function
	 */
	Modal.prototype.setCloseCallback = function (element, callbackObject) {
		callbackObject.module.callback = callbackObject.callback;
	};

	$.moduleModal = new Modal();

	/**
	 * @param {string} [command]
	 * @returns {jQuery}
	 */
	$.fn.moduleModal = function (command, options) {
		this.each(function (index, element) {
			var $element = $(element);

			if (command) {
				$.moduleModal[command]($element, options);
			} else {
				$.moduleModal.initialize($element);
			}
		});

		return this;
	};

});

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('Breakpoint')
	);
}(function(_, $, Breakpoint) {

	'use strict';

	$.fn.modulePagination = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$input = $this.find('input[type="number"]');

			$input.on('keydown', function (e) {
				if (!$.isNumeric(e.key) &&
					e.keyCode !== 37 &&	e.keyCode !== 38 &&	e.keyCode !== 39 &&	e.keyCode !== 40 &&
					e.keyCode !== 46 &&	e.keyCode !== 8 && e.keyCode !== 13
				) {
					e.preventDefault();
				}
			});
		});

		return this;
	};

}));

/* global _, jQuery, rivets */

(function (factory) {
	factory(
		_,
		jQuery,
		rivets,
		window.dcApp.service('AutoComplete'),
		window.dcApp.service('DataContainer'),
		window.dcApp.controller('ProductSelectController')
	);
}(function (_, $, rivets, AutoComplete, DataContainer, ProductSelectController) {

	'use strict';

	$.fn.moduleProductFinder = function () {
		this.each(function (index, element) {
			var $this = $(element),
				$formCategory = $this.find('.form-category'),
				$formKeyword = $this.find('.form-keyword'),
				$keywordSearch = $formKeyword.find(':input'),
				$keywordSubmit = $formKeyword.find(':button'),
				isInBranch = $this.hasClass('module-product-finder-small'),
				productgroup,
				product;


			function bindListeners() {
				initializeRivets();

				$formKeyword.on('submit', SearchSubmit);
				$keywordSearch.on('keyup', toggleKeywordSubmit);
			}

			function initializeRivets() {
				var data = DataContainer.get('product-finder-select'),
					$moduleTechnology = $formCategory.find('.technology-select-container'),
					$moduleProduct = $formCategory.find('.product-select-container'),
					$selectProduct = $formCategory.find('.product-select'),
					$submitModule = $formCategory.find('.submit'),
					$submitButton = $submitModule.find('.btn'),
					scope;

				function onTechnologyChanged() {
					if (isInBranch) {
						//$submitButton.attr('disabled', 'disabled');
						$moduleProduct.removeClass('default-hidden');
						$submitModule.addClass('visibility-hidden');
					}
					else {
						$moduleTechnology.removeClass('no-margin');
						$moduleProduct.addClass('no-margin');
						$moduleProduct.removeClass('default-hidden');
						$submitModule.addClass('default-hidden');
					}

					$selectProduct.prop('selectedIndex', 0);
				}

				function onProductChanged() {
					if (isInBranch) {
						//$submitButton.removeAttr('disabled');
						$submitModule.removeClass('visibility-hidden');
					}
					else {
						$moduleProduct.removeClass('no-margin');
						$submitModule.removeClass('default-hidden');
					}
				}

				scope = new ProductSelectController(data, onTechnologyChanged, onProductChanged);

				rivets.bind($this, scope);

				$formCategory.on('submit', function(e) {
					e.preventDefault();
				});

				$submitButton.on('click', function (e) {
					e.preventDefault();

					productgroup = $this.find('.technology-select :selected').val();
					product = $this.find('.product-select :selected').val();

					// place tracking call here
					if (window.utag) {
						utag.link(
							{
								"event_subtype" : "productfinder",
								"event_action" : "dropdown_search",
								"event_label": productgroup + '_' + product
							},
							function () {  // callback function
								console.log('callback true');
								var url = scope.getUrl();

								if (url) {
									window.location.href = url;
								}
							}
						);
					}else {
						var url = scope.getUrl();

						if (url) {
							window.location.href = url;
						}
					}
				});
			}

			/**
			 * Disable/Enable Search Submit Button
			 */
			function SearchSubmit(event) {
				if ($keywordSearch.val()) {
					event.preventDefault();

					var keyword = $keywordSearch.val();
					// place tracking call here

					if (window.utag) {
						utag.link(
							{
								"event_subtype" : "productfinder",
								"event_action" : "dropdown_search",
								"event_label": keyword
							},
							function () {  // callback function
								submitForm($formKeyword);
							}
						);
					}else{
						submitForm($formKeyword);
					}
				}else {
					event.preventDefault();
				}
			}

			function submitForm($element) {
				console.log('Callback true');
				$element.off('submit');
				$element.submit();
			}

			function toggleKeywordSubmit() {
				if ($keywordSearch.val().length > 0) {
					$keywordSubmit.removeAttr('disabled').addClass('active');
				} else {
					$keywordSubmit.attr('disabled', 'disabled').removeClass('active');
				}
			}

			if ($keywordSearch.length) {
				AutoComplete({
					selector: $keywordSearch.get(0),
					url: $keywordSearch.data('search-url'),
					menuClass: 'product-autocomplete',
					responseHook: function (response) {
						var result = [];

						_.each(response.results, function (responseItem) {
							result.push(responseItem.name);
							if (result.length >= 5) {
								return false;
							}
						});

						return result;
					}
				});
			}

			bindListeners();
		});

		return this;
	};
}));

/* globals jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('EventHub'),
		window.dcApp.service('EventBubbling')
	);
}(function (_, $, EventHub, EventBubbling) {

	'use strict';

	$.fn.modulePiHeader = function () {
		this.each(function (index, element) {
			var metaNavToggle = element.querySelector('.toggle-meta-nav'),
				mainNavButton = element.querySelector('.btn-navigation');

			mainNavButton.addEventListener('click', function () {
				// event to open menu
				EventHub.trigger('toggle-pi-sidebar', 'toggle', {
					trigger: mainNavButton
				});
			})

			metaNavToggle.addEventListener('click', function() {
				metaNavToggle.classList.toggle('active');
				EventHub.trigger('toggle-pi-meta-nav', 'toggle');
				EventHub.trigger('toggle-pi-sidebar', 'close', {
					trigger: mainNavButton
				});
				EventHub.trigger('toggle-pi-sidebar-z-index', 'toggle');
			});

			EventBubbling.on('header.outsideClick', function () {
				if(metaNavToggle.classList.contains('active')) {
					metaNavToggle.classList.remove('active');
					EventHub.trigger('toggle-pi-meta-nav', 'toggle');
					EventHub.trigger('toggle-pi-sidebar-z-index', 'toggle');
				}
				EventHub.trigger('toggle-pi-sidebar', 'close', {
					trigger: mainNavButton
				});
			});

		});
	};

}));

/* globals jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('EventHub'),
		window.dcApp.service('EventBubbling'),
		window.dcApp.service('GlobalFunctions')
	);
}(function (_, $, EventHub, EventBubbling, GlobalFunctions) {

	'use strict';

	var moduleIndex = 0;

	$.fn.modulePiNestedCheckboxes = function () {
		this.each(function (index, element) {
			var inputSelector = 'input[type="checkbox"]',
				listSelector = 'ul',
				// select the root of the complete list
				mainListElement = element.querySelector(listSelector + '.checkbox-list'),
				// select ALL checkboxes that are in the list
				checkboxes = mainListElement.querySelectorAll('ul input[type="checkbox"]');

			element.setAttribute('id', 'nested-checkboxes_' + moduleIndex);

			moduleIndex++;

			// apply the event listener to all items
			checkboxes.forEach(function (e) {

				var idArray = e.id.split('_', 2),
					newId = idArray[0] + '-' + moduleIndex + '_' + idArray[1];
				e.id = newId; // select clicked input and change attribute id
				e.name = newId; // select clicked input and change attribute name
				e.nextElementSibling.htmlFor = newId; // select and change label attribute for

				e.addEventListener('click', function () {
					switchChilds.call(e);
					if (e.checked) {
						e.indeterminate = false;
					}
					indeterminateParents.call(e, mainListElement);
				});
			});

			// selects all child input checkboxes and applies the checked
			// item of the one that has been clicked on
			function switchChilds() {
				var thisElement = this,
					childs = GlobalFunctions.closestParent(thisElement,'li', 'ul').querySelectorAll(listSelector + ' ' + inputSelector);
				childs.forEach(function (e) {
					e.checked = thisElement.checked;
				});
			}

			function checkParent() {
				var thisElement = this,
					closestList = GlobalFunctions.closestParent(thisElement,'ul', 'ul.checkbox-list'),
					parents = closestList.previousElementSibling.querySelector(inputSelector),
					childs = closestList.querySelectorAll(inputSelector),
					checkedChildsLength = 0;

				childs.forEach(function (e) {
					if (e.checked) {
						checkedChildsLength++;
					}
				});

				if (childs.length === checkedChildsLength) {
					parents.indeterminate = false;
					parents.checked = true;
				} else {
					parents.indeterminate = true;
					parents.checked = false;
				}
			}

			// checks if the childs is somewhere in the DOM of the parent
			function contains(parent, child) {
				/* https://stackoverflow.com/questions/2234979/how-to-check-in-javascript-if-one-element-is-contained-within-another */
				var node = child.parentNode;
				while (node !== null) {
					if (node === parent) {
						return true;
					}
					node = node.parentNode;
				}
				return false;
			}

			// checks if all given checkboxes are unchecked
			function allUnchecked(checkboxes) {
				var isChecked = false;
				checkboxes.forEach(function (item, index) {
					if (item.checked) {
						isChecked = true;
					}
				});
				return !isChecked;
			}

			// updates the indeterminate status of the parents
			function indeterminateParents(ul) {
				var childs = ul.childNodes;

				for (var i = 0; i < childs.length; ++i) {
					if (contains(childs[i], this) === false) {
						continue;
					}

					var nextCheckbox = childs[i].querySelector(inputSelector);
					if (nextCheckbox === this) {
						return true;
					}

					var allDescendantBoxes = childs[i].querySelectorAll(inputSelector);
					if (allUnchecked(allDescendantBoxes)) {
						nextCheckbox.indeterminate = false;
					} else {
						nextCheckbox.indeterminate = true;
						checkParent.call(this);
					}

					indeterminateParents.call(this, childs[i].querySelector(listSelector));
					break;
				}
				return true;
			}
		});
	};

}));

/* globals jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('EventHub'),
		window.dcApp.service('GlobalFunctions'),
		window.dcApp.service('BodyScrolling'),
		window.dcApp.service('Breakpoint')
	);
}(function (_, $, EventHub, GlobalFunctions, BodyScrolling, Breakpoint) {

	'use strict';

	$.fn.modulePiSidebar = function () {
		this.each(function (index, element) {
			var subMenuTrigger = element.querySelectorAll('.sub-menu-trigger'),
				subMenu = element.querySelectorAll('.sub-menu-content');


			EventHub.on('toggle-pi-sidebar', 'toggle', function (payload) {
				if(element.classList.contains('active')) {
					closeAllSubMenus();
				};

				payload.trigger.classList.toggle('active');
				element.classList.toggle('active');

				if (Breakpoint.to('md') && element.classList.contains('active')) {
					BodyScrolling.disable();
				} else {
					BodyScrolling.enable();
				}
			}, function(payload) {
				closeAllSubMenus();
				payload.trigger.classList.remove('active');
				element.classList.remove('active');
				BodyScrolling.enable();
			});

			EventHub.on('toggle-pi-sidebar-z-index', 'toggle', function () {
				if (element.classList.contains('zindex')) {
					setTimeout(function() {
						element.classList.toggle('zindex');
					}, 350)
				} else {
					element.classList.toggle('zindex');
				}
			});

			Breakpoint.onBreakPointChange(function () {
				if (element.classList.contains('active') && Breakpoint.to('md')) {
					BodyScrolling.disable();
				} else if (Breakpoint.from('md')) {
					BodyScrolling.enable();
				}
			});

			for (var i = 0; i < subMenuTrigger.length; i++) {
				subMenuTrigger[i].addEventListener('click', function(e) {
					this.classList.toggle('active');
					toggleSubMenu(this);
				});
			}

			function toggleSubMenu(sub) {
				var menu = element.querySelector('[data-sub-menu="' + sub.dataset.subMenuId + '"]');

				GlobalFunctions.slideToggle(menu, 350, 'active', true);
			}

			function closeAllSubMenus() {
				for (var i = 0; i < subMenu.length; i++) {
					subMenuTrigger[i].classList.remove('active');
					GlobalFunctions.slideUp(subMenu[i], 350, 'active');
				}
			}

		});
	};

}));

/* global jQuery */

(function (factory) {
	factory(
		_,
		jQuery
	);
}(function (_, $) {

	'use strict';

	function Progressbar() {
	}

	Progressbar.prototype.setProgress = function ($module, progress) {
		var $value = $module.find('.progress-value'),
			$progresbar = $module.find('.progress-bar');

		$progresbar.css('width', progress + '%');
		$value.html(progress + '%');

		if (progress > 20) {
			$value.addClass('fit-inside');
		} else {
			$value.removeClass('fit-inside');
		}
	};

	$.componentProgressbar = new Progressbar();

	$.fn.componentProgressbar = function (command, progress) {
		this.each(function (index, element) {
			var $element = $(element);

			if (command) {
				$.componentProgressbar[command]($element, progress);
			}
		});

		return this;
	};

}));

/* global jQuery, noUiSlider, wNumb */

(function (factory) {
	factory(
		_,
		jQuery,
		noUiSlider,
		wNumb,
		window.dcApp.service('EventHub')
	);
}(function (_, $, noUiSlider, wNumb, EventHub) {

	'use strict';

	// define rangeslider index
	var rangeIndex = 0;

	$.fn.rangeSlider = function () {
		this.each(function (index, element) {
			var nonLinearSlider = element.querySelector('.range'),
				rangeMin = element.dataset.rangeMin,
				rangeMax = element.dataset.rangeMax,
				rangeStep = element.dataset.rangeStep,
				rangeDecimals = element.dataset.rangeDecimals,
				rangeSuffix = element.dataset.rangeSuffix,
				rangeStart = element.dataset.rangeStart,
				rangeEnd = element.dataset.rangeEnd,
				rangeOrientation = element.dataset.rangeOrientation,
				rangeDirection = element.dataset.rangeDirection,
				rangeHeight = element.dataset.rangeHeight,
				customRange = element.dataset.range,
				rangeLabel,
				hiddenInput = element.querySelector('.hidden-input'),
				indicatorTop = element.querySelector('.indicator-top'),
				indicatorBottom = element.querySelector('.indicator-bottom'),
				indicatorTopStart,
				indicatorTopEnd,
				indicatorBottomStart,
				indicatorBottomEnd,
				indicatorLeft = element.querySelector('.indicator-left'),
				indicatorRight = element.querySelector('.indicator-right'),
				indicatorLeftStart,
				indicatorLeftEnd,
				indicatorRightStart,
				indicatorRightEnd;

			element.setAttribute('id', 'range-slider_' + rangeIndex);

			// set rangeslider index + 1
			rangeIndex++;

			if (element.querySelector('.range-label')) {
				rangeLabel = element.querySelector('.range-label').innerHTML;
			} else {
				rangeLabel = false;
			}

			rangeStep = parseFloat(rangeStep);
			rangeMin = parseFloat(rangeMin);
			rangeMax = parseFloat(rangeMax);
			rangeStart = parseFloat(rangeStart);
			rangeEnd = parseFloat(rangeEnd);

			function sp(event) {
				event.stopPropagation();
			}

			function makeTT(i, slider) {
				var tooltip = document.createElement('div'),
					input = document.createElement('input'),
					randId = (Math.floor(Math.random() * 100) + 1) + '_input';

				// Add the input to the tooltip
				tooltip.className = 'noUi-tooltip';
				input.className = 'noUi-tooltip-input';
				input.setAttribute('id', randId);
				tooltip.appendChild(input);

				// On change, set the slider
				input.addEventListener('change', function (event) {
					var values = [null, null];
					values[i] = parseFloat(this.value);
					slider.noUiSlider.set(values);
				});

				// Catch all selections and make sure they don't reach the handle
				input.addEventListener('mousedown', sp);
				input.addEventListener('keydown', sp);
				input.addEventListener('touchstart', sp);
				input.addEventListener('pointerdown', sp);
				input.addEventListener('MSPointerDown', sp);

				// Find the lower/upper slider handle and insert the tooltip
				slider.querySelector(i ? '.noUi-handle-upper' : '.noUi-handle-lower').appendChild(tooltip);

				return input;
			}

			var Format = wNumb({
				suffix: ' ' + rangeSuffix,
				decimals: rangeDecimals,
				thousand: ','
			});

			if (element.classList.contains('two-handles')) {
				var leftValue = element.querySelector('.left-value-input'),
					rightValue = element.querySelector('.right-value-input');

				if (!customRange) {
					noUiSlider.create(nonLinearSlider, {
						start: [rangeStart, rangeEnd],
						orientation: rangeOrientation,
						keyboardSupport: false,
						connect: [false, true, false],
						behaviour: 'hover-snap',
						step: rangeStep,
						animate: true,
						direction: rangeDirection,
						range: {
							'min': rangeMin,
							'max': rangeMax
						}
					});
				} else {
					var rangeValue = JSON.parse(customRange);
					noUiSlider.create(nonLinearSlider, {
						start: [rangeStart, rangeEnd],
						orientation: rangeOrientation,
						keyboardSupport: false,
						connect: [false, true, false],
						behaviour: 'hover-snap',
						animate: true,
						direction: rangeDirection,
						range: rangeValue
					});
				}


				nonLinearSlider.noUiSlider.on('update', function (values) {
					leftValue.value = Format.to(parseFloat(values[0]));
					rightValue.value = Format.to(parseFloat(values[1]));
				});

				leftValue.addEventListener('change', function () {
					var value = parseFloat(this.value);
					nonLinearSlider.noUiSlider.set([value, null]);
				});

				rightValue.addEventListener('change', function () {
					var value = parseFloat(this.value);
					nonLinearSlider.noUiSlider.set([null, value]);
				});

				// When the slider drag end/change - https://refreshless.com/nouislider/events-callbacks/
				nonLinearSlider.noUiSlider.on('set', function (values) {
					if (rangeStart === parseFloat(values[0]) && rangeEnd === parseFloat(values[1])) {
						element.setAttribute('data-range-checked', false);
					} else {
						element.setAttribute('data-range-checked', true);
					}
					EventHub.trigger('range-slider-values', 'slider-multiple', {
						value1: Format.to(parseFloat(values[0])),
						value2: Format.to(parseFloat(values[1])),
						label: rangeLabel,
						id: element.id
					});
				});
			} else if (element.classList.contains('solo-input')) {
				var singleValue = element.querySelector('.single-value-input');

				if (!customRange) {
					noUiSlider.create(nonLinearSlider, {
						start: rangeStart,
						orientation: rangeOrientation,
						keyboardSupport: false,
						connect: [true, false],
						behaviour: 'hover-snap',
						step: rangeStep,
						animate: true,
						direction: rangeDirection,
						range: {
							'min': rangeMin,
							'max': rangeMax
						}
					});
				} else {
					var rangeValue = JSON.parse(customRange);
					noUiSlider.create(nonLinearSlider, {
						start: rangeStart,
						orientation: rangeOrientation,
						keyboardSupport: false,
						connect: [true, false],
						behaviour: 'hover-snap',
						animate: true,
						direction: rangeDirection,
						range: rangeValue
					});
				}


				nonLinearSlider.noUiSlider.on('update', function (values) {
					singleValue.value = Format.to(parseFloat(values));
				});

				singleValue.addEventListener('change', function () {
					var value = parseFloat(this.value);
					nonLinearSlider.noUiSlider.set([value, null]);
				});

				// When the slider changes, update the inputfield
				nonLinearSlider.noUiSlider.on('update', function (values, handle) {
					hiddenInput.value = parseFloat(values);
				});

				var handle = element.querySelector('.noUi-handle'),
				filledLine = element.querySelector('.noUi-connect');

				handle.addEventListener('pointerdown', function () {
					if (filledLine) {
						filledLine.classList.add('is-active');

						document.addEventListener('pointerup', function () {
							filledLine.classList.remove('is-active');
						});
					}
				});

				element.querySelector('.noUi-base').addEventListener('pointerdown', function () {
					if (filledLine) {
						filledLine.classList.add('is-active');

						document.addEventListener('pointerup', function () {
							filledLine.classList.remove('is-active');
						});
					}
				});

			}else {
				if (!customRange) {
					noUiSlider.create(nonLinearSlider, {
						start: rangeStart,
						orientation: rangeOrientation,
						keyboardSupport: false,
						connect: [true, false],
						behaviour: 'hover-snap',
						step: rangeStep,
						animate: true,
						direction: rangeDirection,
						range: {
							min: rangeMin,
							max: rangeMax
						}
					});
				} else {
					var rangeValue = JSON.parse(customRange);
					noUiSlider.create(nonLinearSlider, {
						start: rangeStart,
						orientation: rangeOrientation,
						keyboardSupport: false,
						connect: [true, false],
						behaviour: 'hover-snap',
						animate: true,
						direction: rangeDirection,
						range: rangeValue
					});
				}


				var handle = element.querySelector('.noUi-handle'),
					filledLine = element.querySelector('.noUi-connect');

				handle.addEventListener('pointerdown', function () {
					if (filledLine) {
						filledLine.classList.add('is-active');

						document.addEventListener('pointerup', function () {
							filledLine.classList.remove('is-active');
						});
					}
				});

				element.querySelector('.noUi-base').addEventListener('pointerdown', function () {
					if (filledLine) {
						filledLine.classList.add('is-active');

						document.addEventListener('pointerup', function () {
							filledLine.classList.remove('is-active');
						});
					}
				});

				// An 0/1 indexed array of input elements
				var tooltipInputs = [makeTT(0, nonLinearSlider)];

				var handleTooltip = handle.querySelector('.noUi-tooltip'),
					handleInput = handle.querySelector('.noUi-tooltip-input');

				handleInput.addEventListener('focus', function() {
					handleTooltip.classList.add('input-active');
				});

				handleInput.addEventListener('blur', function() {
					handleTooltip.classList.remove('input-active');
				});

				// When the slider changes, update the tooltip
				nonLinearSlider.noUiSlider.on('update', function (values, handle) {
					hiddenInput.value = parseFloat(values[handle]);
					tooltipInputs[handle].value = Format.to(parseFloat(values[handle]));
				});

				// When the slider drag end/change - https://refreshless.com/nouislider/events-callbacks/
				nonLinearSlider.noUiSlider.on('set', function (values) {
					if (rangeStart === parseFloat(values[0])) {
						element.setAttribute('data-range-checked', false);
					} else {
						element.setAttribute('data-range-checked', true);
					}
					EventHub.trigger('range-slider-values', 'slider-single', {
						value: Format.to(parseFloat(values[0])),
						label: rangeLabel,
						id: element.id
					});
				});
			}

			if (rangeOrientation === 'vertical') {
				element.querySelector('.range').style.height = rangeHeight;
			}

			//style Indicator Lines
			if (indicatorTop && indicatorBottom) {
				indicatorTopStart = indicatorTop.dataset.start;
				indicatorTopEnd = 100 - indicatorTop.dataset.end;
				indicatorBottomStart = indicatorBottom.dataset.start;
				indicatorBottomEnd = 100 - indicatorBottom.dataset.end;

				indicatorTop.style.left = indicatorTopStart + '%';
				indicatorTop.style.right = indicatorTopEnd + '%';

				indicatorBottom.style.left = indicatorBottomStart + '%';
				indicatorBottom.style.right = indicatorBottomEnd + '%';
			}

			if (indicatorLeft && indicatorRight) {
				indicatorLeftStart = indicatorLeft.dataset.start;
				indicatorLeftEnd = 100 - indicatorLeft.dataset.end;
				indicatorRightStart = indicatorRight.dataset.start;
				indicatorRightEnd = 100 - indicatorRight.dataset.end;

				indicatorLeft.style.bottom = indicatorLeftStart + '%';
				indicatorLeft.style.top = indicatorLeftEnd + '%';

				indicatorRight.style.bottom = indicatorRightStart + '%';
				indicatorRight.style.top = indicatorRightEnd + '%';
			}
		});
	};
}));

/* global _, jQuery, rivets, WHATWGFetch */

(function (factory) {
	factory(
		_,
		jQuery,
		rivets,
		WHATWGFetch,
		window.dcApp.service('EventHub'),
		window.dcApp.service('BrowserEvents'),
		window.dcApp.service('Breakpoint'),
		window.dcApp.service('GlobalFunctions')
	);
}(function (_, $, rivets, WHATWGFetch, EventHub, BrowserEvents, Breakpoint, GlobalFunctions) {

	'use strict';

	$.fn.apiSearch = function () {
		this.each(function (index, element) {
			var $this = $(element),
				$filterModalCatalog = $(element).find('.filter-modal-catalog'),
				$filterModalWebsite = $(element).find('.filter-modal-website'),
				apiCatalogM = './data/search-catalog-M.json',
				apiCatalogO = './data/search-catalog-O.json',
				apiCatalogOld = 'https://api.boschrexroth.com/searchws/product/search',
				apiCatalogT = './data/search-catalog-T.json',
				// apiWebsite = './data/search-website.json',
				apiWebsite = './data/search-website-spelling.json',
				apiWebsiteOld = 'https://search.internet.bosch.com/RB.SEARCH/search/dc-de-p/search.json',
				btnCatalog = element.querySelector('.btn-catalog'),
				btnCatalogLoaded = false,
				btnWebsite = element.querySelector('.btn-website'),
				btnWebsiteLoaded = false,
				catalogData = {},
				catalogSearchData = false,
				catalogItems,
				catalogReady = false,
				componentSearchTermLabel,
				entries,
				header = document.querySelector('header.module-header'),
				headerExtensions = header.querySelector('.header-extensions'),
				headerExtensionsModuleHeaderSearch = headerExtensions.querySelector('.module-header-search'),
				headerFixedContainer = header.querySelector('.fixed-container'),
				modalButtonCatalog = element.querySelector('.btn-filter-catalog'),
				modalButtonWebsite = element.querySelector('.btn-filter-website'),
				modalCatalog,
				modalFooterButton = element.querySelector('.filter-modal .modal-footer button'),
				modalWebsite,
				modalWebsiteFilterBar = element.querySelector('.module-filter-bar-website.filter-bar-modal'),
				modalCatalogFilterBar = element.querySelector('.module-filter-bar-catalog.filter-bar-modal'),
				moduleTabNavigation,
				param,
				readyM = false,
				readyO = false,
				readyT = false,
				resultAmount,
				resultItems,
				searchDataController = {},
				typeM,
				typeO,
				typeT,
				websiteData = {},
				websiteDummyData = false,
				websiteReady = false,
				websiteSearchData = false;

			if (element.classList.contains('demo-states')) {
				if (element.dataset.urlWebsite) {
					apiWebsiteOld = element.dataset.urlWebsite;
				}
				if (element.dataset.urlCatalog) {
					apiCatalogT = element.dataset.urlCatalog;
					apiCatalogO = element.dataset.urlCatalog;
					apiCatalogM = element.dataset.urlCatalog;
				}
			}

			var queryHandling = function (handling) {
				var q = GlobalFunctions.getUrlParameter('q'),
					dnavs = GlobalFunctions.getUrlParameter('dnavs'),
					num = GlobalFunctions.getUrlParameter('num'),
					lang = GlobalFunctions.getUrlParameter('lang'),
					s = GlobalFunctions.getUrlParameter('s'),
					queryArr = [],
					resultQuery;

				if (q !== '') {
					queryArr.push({'q': q});
				}
				if (dnavs !== '' && handling) {
					queryArr.push({'dnavs': dnavs});
				}
				if (num !== '') {
					queryArr.push({'num': num});
				}
				if (lang !== '') {
					queryArr.push({'lang': lang});
				}
				if (s !== '') {
					queryArr.push({'s': s});
				}

				resultQuery = GlobalFunctions.parseQueryArray(queryArr).join('&');
				// resultQuery = resultQuery + '&assortclass=' + url;

				return resultQuery;
			};

			var handleDatePickerData = function () {
				var datePickerContainer = element.querySelectorAll('.date-picker-group-wrapper'),
					datePickerValueStart,
					datePickerValueEnd;

				for (var dpc = 0; dpc < datePickerContainer.length; dpc++) {
					var datePickerInputs = datePickerContainer[dpc].querySelectorAll('input');

					for (var dpv = 0; dpv < datePickerInputs.length; dpv++) {
						if (datePickerInputs[dpv].id.indexOf('specific-date-range-start') > -1) {
							datePickerValueStart = datePickerInputs[dpv].value;
						}
						if (datePickerInputs[dpv].id.indexOf('specific-date-range-end') > -1) {
							datePickerValueEnd = datePickerInputs[dpv].value;
						}
					}

					if (datePickerValueStart && datePickerValueEnd) {
						return datePickerValueStart + '..' + datePickerValueEnd;
					}
				}
			};

			catalogData = {
				typeT: [],
				typeO: [],
				typeM: [],
				filter: [
					{
						"optionGroupID": 1,
						"label": "Assortclass",
						"options": [
							{
								"id": 1,
								"label": "DCMA",
								"active": false,
								"selected": false
							},
							{
								"id": 2,
								"label": "SRDC",
								"active": false,
								"selected": false
							},
							{
								"id": 3,
								"label": "GoTo",
								"active": false,
								"selected": false
							}
						]
					}
				],
				content: {
					sortSelect: function (value) {
						EventHub.trigger('search-sort', 'sort-catalog', {
							bindData: value.currentTarget.value,
							name: value.currentTarget.options[value.currentTarget.selectedIndex].text
						});
					},
					sortFlyout: function (value) {
						EventHub.trigger('search-sort', 'sort-catalog', {
							bindData: value.currentTarget.dataset.sort,
							name: value.currentTarget.dataset.name
						});
					}
				},
				"ctotal": '',
				"ctotalTO": '',
				catalogFunctions: {
					search: function (url) {
						if (url) {
							GlobalFunctions.startProgressIcon(modalCatalogFilterBar);

							EventHub.trigger('search-filter-options', 'filter', {
								bindData: '?' + queryHandling(true),
								api: 'catalog'
							});
						}
					},
					clear: function () {
						GlobalFunctions.startProgressIcon(modalCatalogFilterBar);

						// 	EventHub.trigger('search-filter-options', 'filter', {
						// 		bindData: '?' + queryHandling(false),
						// 		api: 'catalog'
						// 	});
					}
				}
			};

			websiteData = {
				category: [],
				data: [],
				entries: [],
				content: {
					search: function (url) {
						if (url) {
							GlobalFunctions.startProgressIcon(modalWebsiteFilterBar);

							if (url.indexOf('daterange%3Aspecific') > -1) {
								var currentDate = new Date().toISOString().slice(0, 10);
								url = url.replace('specific', '0000-00-00..' + currentDate);
							}

							EventHub.trigger('search-filter-options', 'filter', {
								bindData: '?' + url,
								api: 'website'
							});
						}
					},
					get: function (url) {
						if (url) {
							GlobalFunctions.startProgressIcon(modalWebsiteFilterBar);

							if (url.indexOf('daterange%3Aspecific') > -1) {
								url = url.replace('specific', handleDatePickerData());
							}

							EventHub.trigger('search-filter-options', 'filter', {
								bindData: '?' + url,
								api: 'website'
							});
						}
					},
					clear: function () {
						GlobalFunctions.startProgressIcon(modalWebsiteFilterBar);

						EventHub.trigger('search-filter-options', 'filter', {
							bindData: '?' + queryHandling(false),
							api: 'website'
						});

					},
					paging: function (url) {
						if (url) {
							EventHub.trigger('search-items', 'paging', {
								bindData: '?' + url,
								api: 'website'
							});
						}
					},
					amount: function (amount) {
						param = window.location.search;
						resultAmount = GlobalFunctions.getUrlParameter('num');
						EventHub.trigger('search-items', 'amount', {
							bindData: param,
							amount: amount,
							api: 'website'
						});
					}
				}
			};

			var goToSelectedTab = function (element, url, haystack, needle) {
				var selector = element,
					uri = url,
					field = haystack;

				if (selector) {
					if (GlobalFunctions.getUrlParameter('s') === needle) {
						if (uri.indexOf('?' + field + '=') > -1 || uri.indexOf('&' + field + '=') > -1) {
							selector.click();
						} else {
							selector.click();
						}
					} else {
						selector.click();
					}
				}
				return needle;
			};

			var urlState = function (param) {
				var uri;
				if (GlobalFunctions.getUrlParameter('s') === '' || GlobalFunctions.getUrlParameter('s') === 'catalog') {
					if (history.pushState) {
						if (GlobalFunctions.getUrlParameter('s') === 'website') {
							uri = window.location.href;
							history.pushState('website', null, uri.replace('website', 'catalog'));
						} else {
							history.pushState('website', null, param);
						}
					} else {
						//IE
						history.forward();
					}
					goToSelectedTab(btnCatalog, window.location.href, 's', 'catalog');
				} else {
					if (history.pushState) {
						if (GlobalFunctions.getUrlParameter('s') === 'catalog') {
							uri = window.location.href;
							history.pushState('website', null, uri.replace('catalog', 'website'));
						} else {
							history.pushState('website', null, param);
						}
					} else {
						//IE
						history.forward();
					}
					goToSelectedTab(btnWebsite, window.location.href, 's', 'website');
				}
			};

			var tabState = function (state) {
				var uri = window.location.href;
				if (GlobalFunctions.getUrlParameter('s') === '') {
					if (history.pushState) {
						history.pushState(state, null, uri + '&s=' + state);
					} else {
						//IE
						history.forward();
					}
				} else {
					var stateBefore = GlobalFunctions.getUrlParameter('s');
					if (history.pushState) {
						history.pushState(stateBefore, null, uri.replace(stateBefore, state));
					} else {
						//IE
						history.forward();
					}
				}
			};

			var isSearchDataAvailable = function () {
				var tabNavigation = element.querySelector('.module-tab-navigation'),
					searchTermLabel = element.querySelector('.component-search-term-label');

				searchDataController.query = GlobalFunctions.getUrlParameter('q');

				EventHub.on('component-search-term', 'spelling-suggestions', function (event) {
					searchDataController.didYouMean = event.didYouMean;
					searchDataController.spellingSuggestions = event.spellingSuggestions;
				});

				if (catalogSearchData && websiteSearchData) {
					searchDataController.searchData = false;
					searchDataController.result = false;

					if (moduleTabNavigation) {
						moduleTabNavigation.update(searchDataController);
					} else {
						moduleTabNavigation = rivets.bind(tabNavigation, searchDataController);
					}

					if (componentSearchTermLabel) {
						componentSearchTermLabel.update(searchDataController);
					} else {
						componentSearchTermLabel = rivets.bind(searchTermLabel, searchDataController);
					}
				} else {
					searchDataController.result = true;
					searchDataController.searchData = true;
					// searchDataController.didYouMean = false;

					if (componentSearchTermLabel) {
						componentSearchTermLabel.update(searchDataController);
					} else {
						componentSearchTermLabel = rivets.bind(searchTermLabel, searchDataController);
					}
				}
			};

			var catalogDataHandling = function (data1, data2, data3) {

				var count = data1.RESULTS.RES[0].TOTAL + data2.RESULTS.RES[0].TOTAL + data3.RESULTS.RES[0].TOTAL,
					//var count = 0,
					countTO = data1.RESULTS.RES[0].TOTAL + data2.RESULTS.RES[0].TOTAL,
					DCMA = false,
					DCMA_iam = false,
					SRDC = false,
					GoTo = false;


				catalogData.typeT = data1;
				catalogData.typeO = data2;
				catalogData.typeM = data3;
				catalogData.ctotal = count;
				catalogData.ctotalTO = countTO;

				if (count > 0) {
					data1.RESULTS.RES[0].R.sort(GlobalFunctions.compareValues('name', 'asc'));
					data2.RESULTS.RES[0].R.sort(GlobalFunctions.compareValues('name', 'asc'));
					data3.RESULTS.RES[0].R.sort(GlobalFunctions.compareValues('name', 'asc'));

					for (var i = 0; i < catalogData.typeM.RESULTS.RES[0].R.length; i++) {
						if ('attr_DCMA_Icon' in catalogData.typeM.RESULTS.RES[0].R[i]) {
							catalogData.filter[0].options[0].active = true;
							DCMA = true;
						}

						if ('attr_SRDC_Icon' in catalogData.typeM.RESULTS.RES[0].R[i]) {
							catalogData.filter[0].options[1].active = true;
							SRDC = true;
						}

						if ('attr_GoTo_Icon' in catalogData.typeM.RESULTS.RES[0].R[i]) {
							catalogData.filter[0].options[2].active = true;
							GoTo = true;
						}
					}
				}

				if (btnCatalogLoaded) {
					btnCatalogLoaded.update(catalogData);
				} else {
					btnCatalogLoaded = rivets.bind(btnCatalog, catalogData);
				}

				if (modalCatalog) {
					modalCatalog.update(catalogData);
				} else {
					modalCatalog = rivets.bind(element.querySelector('.filter-modal-catalog'), catalogData);
				}

				if (catalogItems) {
					catalogItems.update(catalogData);
				} else {
					catalogItems = rivets.bind(element.querySelector('.catalog-tab'), catalogData);
				}

				if (catalogData.ctotal === 0) {
					catalogSearchData = true;
				}

				if (modalCatalogFilterBar) {
					GlobalFunctions.stopProgressIcon(modalCatalogFilterBar);
				}

				catalogReady = true;
				loaded();
			};

			var websiteDataHandling = function (data) {
				var paramObjectKey;

				websiteData.data = [];
				websiteData.entries = [];
				websiteData.category = [];
				websiteData.wtotal = 0;
				websiteData.paged = 0;

				if ('result' in data) {

					websiteData.wtotal = data.result.count;

					entries = data.result.entries;

					for (var entryKey in entries) {
						if (entries.hasOwnProperty(entryKey)) {
							paramObjectKey = entries[entryKey].metaData;

							if (!paramObjectKey.hasOwnProperty('DCSext.wtg_contenttype')) {
								paramObjectKey['DCSext.wtg_contenttype'] = 'default';
							}
						}
					}

					entries = _.unescape(JSON.stringify(entries));

					for (var i = 0; i < data.result.entries.length; i++) {
						entries = entries.replace('DCSext.wtg_contenttype', 'DCSextwtg_contenttype');
					}

					entries = JSON.parse(entries);

					// remove all text after "|" ( | also included )
					for (var x = 0; x < entries.length; x++) {
						entries[x].title = entries[x].title.split('|')[0];
					}

					if (entries.length > 0) {
						websiteData.paged = (data.result.startIndex - 1) / entries.length + 1;
					}

					websiteData.entries = entries;
				}

				websiteData.data = data;
				websiteData.category = data.postSearchNavigation;

				var categoryOptionsArray = [],
					hasSelectedOption = 0;

				for (var y = 0; y < websiteData.category.length; y++) {

					var categoryOptions = websiteData.category[y].options;

					if (categoryOptions.length > 0) {

						for (var key in categoryOptions) {

							if (categoryOptions.hasOwnProperty(key)) {
								categoryOptionsArray.push(categoryOptions[key]);

								if (categoryOptions[key].selected === true) {
									hasSelectedOption++;
								}
							}
						}
					}
				}

				websiteData.category.options = categoryOptionsArray;
				websiteData.category.options.selected = hasSelectedOption;

				if (btnWebsiteLoaded) {
					btnWebsiteLoaded.update(websiteData);
				} else {
					btnWebsiteLoaded = rivets.bind(btnWebsite, websiteData);
				}

				if (modalWebsite) {
					modalWebsite.update(websiteData);
				} else {
					modalWebsite = rivets.bind(element.querySelector('.filter-modal-website'), websiteData);
				}

				if (typeof resultItems === 'undefined') {
					resultItems = rivets.bind(element.querySelector('.website-tab'), websiteData);
				} else {
					resultItems.update(websiteData);
				}

				if (websiteData.wtotal === 0) {
					websiteSearchData = true;

					isSearchDataAvailable();

					if ('spellingSuggestions' in data) {
						EventHub.trigger('component-search-term', 'spelling-suggestions', {
							didYouMean: true,
							spellingSuggestions: data.spellingSuggestions[0]
						});
					}
				}

				if (modalWebsiteFilterBar) {
					GlobalFunctions.stopProgressIcon(modalWebsiteFilterBar);
				}

				websiteReady = true;
				loaded();
			};

			var apiFetch = function (param) {

				loadingSpinner(false, false);
				catalogFetch(param);

				if (param.indexOf('assortclass') < 1) {
					if (websiteDummyData) {
						fetch(apiWebsite, {
							headers: {'Accept': 'application/json'}
						}).then(function (response) {
							return response.json();
						}).then(function (data) {
							websiteDataHandling(data);
							urlState(param);
						}).catch(function (error) {
							console.log('Error Website API');
							console.log(error);
						});
					} else {
						fetch(apiWebsiteOld + param, {
							headers: {'Accept': 'application/json'}
						}).then(function (response) {
							return response.json();
						}).then(function (data) {
							websiteDataHandling(data);
							urlState(param);
						}).catch(function (error) {
							console.log('Error Website API');
							console.log(error);
						});
					}
				} else {
					websiteReady = true;
					loaded();
				}
			};

			var checkCatalog = function (param) {
				if (readyT && readyO && readyM) {
					catalogDataHandling(typeT, typeO, typeM);
					urlState(param);
				}
			};

			var catalogFetch = function (param) {

				// Just for demo
				if (param.indexOf('assortclass%3ADCMA') > -1) {
					console.log('DMCA');
				}

				if (param.indexOf('assortclass%3SRDC') > -1) {
					console.log('SRDC');
				}

				if (param.indexOf('assortclass%3GoTo') > -1) {
					console.log('GoTo');
				}


				// Fetch for Type 'T'
				fetch(apiCatalogT, {
					headers: {'Accept': 'application/json'}
				}).then(function (response) {
					return response.json();
				}).then(function (data) {
					typeT = data;
					readyT = true;
					checkCatalog(param);
				}).catch(function (error) {
					console.log('Error Catalog API TYPE: T');
					console.log(error);
				});

				// Fetch for Type 'O'
				fetch(apiCatalogO, {
					headers: {'Accept': 'application/json'}
				}).then(function (response) {
					return response.json();
				}).then(function (data) {
					typeO = data;
					readyO = true;
					checkCatalog(param);
				}).catch(function (error) {
					console.log('Error Catalog API TYPE: O');
					console.log(error);
				});

				// Fetch for Type 'M'
				fetch(apiCatalogM, {
					headers: {'Accept': 'application/json'}
				}).then(function (response) {
					return response.json();
				}).then(function (data) {
					typeM = data;
					readyM = true;
					checkCatalog(param);
				}).catch(function (error) {
					console.log('Error Catalog API TYPE: M');
					console.log(error);
				});
			};

			var init = function () {
				if (window.location.href.indexOf('?') > -1) {
					param = window.location.search;
					apiFetch(param);
					// var searchFields = document.getElementsByClassName('search-field'), i;
					// for (i = 0; i < searchFields.length; i++) {
					// 	rivets.bind(searchFields[i], {q: [GlobalFunctions.getUrlParameter('q')]});
					// }
				}
			};

			var cloneSortingFilter = function (selector) {
				var containerFluid = headerExtensions.querySelector('.filter-sorting-bar-clone'),
					hasCloneContainer = typeof containerFluid !== 'undefined' && containerFluid !== null,
					hasClonedElement = typeof headerExtensions.querySelector('.filter-sorting-bar-clone > *') !== 'undefined' && headerExtensions.querySelector('.filter-sorting-bar-clone > *') !== null,
					sortFilterBarClone = selector.cloneNode(true);

				if (!hasCloneContainer) {
					containerFluid = document.createElement('div');
					containerFluid.className = 'container-fluid filter-sorting-bar-clone';
					headerExtensions.appendChild(containerFluid);
				}

				if (!hasClonedElement) {
					sortFilterBarClone.setAttribute('class', 'row filter-sorting-bar');

					containerFluid.appendChild(sortFilterBarClone);

					var filterModule = sortFilterBarClone.querySelector('.module-button.filter-btn'),
						filterModuleButton = filterModule.querySelector('button'),
						sortModule = sortFilterBarClone.querySelector('.module-flyout.sort-btn');

					if (sortModule) {
						$(sortModule).moduleFlyout();
						rivets.bind(sortModule, catalogData);
					}

					filterModuleButton.addEventListener('click', function (event) {
						var target = event.target;
						if (target.classList.contains('btn-filter-website')) {
							$filterModalCatalog.moduleModal('close');
							$filterModalWebsite.moduleModal('open');
						} else if (target.classList.contains('btn-filter-catalog')) {
							$filterModalWebsite.moduleModal('close');
							$filterModalCatalog.moduleModal('open');
						} else {
							$filterModalCatalog.moduleModal('close');
							$filterModalWebsite.moduleModal('close');
						}
					});
				}
			};

			var removeClonedSortingFilter = function () {
				var sortFilterBarClone = headerExtensions.querySelector('.filter-sorting-bar-clone > *'),
					hasClonedElement = typeof sortFilterBarClone !== 'undefined' && sortFilterBarClone !== null;

				if (hasClonedElement) {
					sortFilterBarClone.parentElement.removeChild(sortFilterBarClone);
				}
			};

			var stickySortingFilter = function () {
				var activeContentTab,
					headerHeight,
					sortFilterBar,
					sortFilterContainerOffset;

				if (headerFixedContainer.classList.contains('has-sort-filter')) {
					if (headerFixedContainer.classList.contains('state-hidden')) {
						headerHeight = headerExtensionsModuleHeaderSearch.offsetHeight;
					} else {
						headerHeight = headerExtensionsModuleHeaderSearch.offsetHeight + header.offsetHeight;
					}
				} else {
					headerHeight = header.offsetHeight;
				}

				activeContentTab = element.querySelector('.tab-content .tns-slide-active');
				if (activeContentTab) {
					sortFilterBar = activeContentTab.querySelector('.filter-sorting-bar');

					if (sortFilterBar) {
						if (Breakpoint.to('lg') && !element.classList.contains('loading')) {
							if (sortFilterBar.querySelector('.filter-sort-wrapper')) {
								sortFilterContainerOffset = GlobalFunctions.getOffset(sortFilterBar).y;

								if (sortFilterContainerOffset <= headerHeight) {
									sortFilterBar.classList.add('cloned');
									headerExtensions.classList.add('has-cloned-node');
									cloneSortingFilter(sortFilterBar);
								} else {
									sortFilterBar.classList.remove('cloned');
									headerExtensions.classList.remove('has-cloned-node');
									removeClonedSortingFilter();
								}
							}
						} else {
							sortFilterBar.classList.remove('cloned');
							headerExtensions.classList.remove('has-cloned-node');
							removeClonedSortingFilter();
						}
					}
				}
			};

			var toggleAccordion = function () {
				var accordionModule = element.querySelectorAll('.module-accordion');
				for (var am = 0; am < accordionModule.length; am++) {
					var filterInput = accordionModule[am].querySelector('input:checked');

					if (filterInput !== null) {
						var accordionItem = GlobalFunctions.closestParent(filterInput, '.accordion-item', '.module-accordion'),
							accordionContent = accordionItem.querySelector('.accordion-content'),
							itemHead = accordionItem.querySelector('.item-head'),
							excludeItem = GlobalFunctions.closestParent(filterInput, '.exclude', '.accordion-content');

						if (!itemHead.parentElement.classList.contains('active') && !excludeItem) {
							itemHead.parentElement.classList.add('open');
						}
					}
				}
			};

			var loadingSpinner = function (loaded, searchData) {
				if (loaded && !searchData) {
					element.querySelector('.website-tab').classList.remove('loading');
					element.querySelector('.catalog-tab').classList.remove('loading');
					element.querySelector('.loading-screen-filter').classList.remove('loading');
				} else if (loaded && searchData) {
					element.querySelector('.loading-screen-filter').classList.remove('loading');
				} else {
					element.querySelector('.website-tab').classList.add('loading');
					element.querySelector('.catalog-tab').classList.add('loading');
					element.querySelector('.loading-screen-filter').classList.add('loading');
				}
			};

			var searchDataHandling = function () {
				toggleAccordion();

				$this.find('.module-tooltip').not('.initialized').addClass('initialized').moduleTooltip();
				$this.find('.module-accordion').not('.initialized').addClass('initialized').moduleAccordion();

				if (window.addEventListener) {
					window.addEventListener('popstate', function (event) {
						if (event) {
							if (event.state !== null) {
								if (event.state === 'catalog') {
									goToSelectedTab(btnCatalog, window.location.href, 's', event.state);
								} else if (event.state === 'website') {
									goToSelectedTab(btnWebsite, window.location.href, 's', event.state);
								} else {
									return false;
								}
							}
						} else {
							console.log('Something went wrong: event not defined');
						}
					});
				}

				var handleResize = BrowserEvents.on('resize', function () {
					loadedCallback();
				});
				handleResize();

				var handleScroll = BrowserEvents.on('scroll', function () {
					stickySortingFilter();
				});
				handleScroll();

				stickySortingFilter();

				EventHub.trigger('module-filter-bar', 'api-loaded', {
					loaded: true
				});

				if (catalogData.ctotal === 0 && websiteData.wtotal > 0) {
					goToSelectedTab(btnWebsite, window.location.href, 's', 'website');
				}

				if (websiteData.wtotal === 0 && catalogData.ctotal > 0) {
					goToSelectedTab(btnCatalog, window.location.href, 's', 'catalog');
				}
			};

			var dateRangeCheck = function () {
				var dnavsParams = GlobalFunctions.getUrlParameter('dnavs');
				if (dnavsParams.indexOf('daterange') > -1 && dnavsParams.indexOf('..') > -1) {
					var dateRrangeStart = dnavsParams.substring(0, dnavsParams.indexOf('..')).split(':')[1],
						dateRrangeEndTemp = dnavsParams.split('..')[1],
						dateRrangeEnd = dateRrangeEndTemp.split('+')[0];

					if (dateRrangeStart !== '0000-00-00' && dateRrangeStart !== '' && dateRrangeEnd !== '') {
						EventHub.trigger('module-filter-bar', 'date-picker-values', {
							start: dateRrangeStart,
							end: dateRrangeEnd
						});
					}
				}
			};

			var loadedCallback = function () {
				if (!Breakpoint.to('lg')) {
					$filterModalWebsite.moduleModal('close');
					$filterModalCatalog.moduleModal('close');
				}
				// remove initial spinner with white background
				GlobalFunctions.stopProgressIcon(element);
			};

			var loaded = function () {
				if (websiteReady && catalogReady) {
					isSearchDataAvailable();

					dateRangeCheck();

					loadedCallback();

					if (catalogSearchData && websiteSearchData) {
						// remove filter spinner with transparent background
						loadingSpinner(true, true);
						// if no results = destroy tabnavigation
						EventHub.trigger('destroy-slider', 'destroy');
					} else {
						searchDataHandling();
						// remove filter spinner with transparent background
						loadingSpinner(true, false);
					}

					catalogSearchData = false;
					websiteSearchData = false;

					catalogReady = false;
					websiteReady = false;
				}
			};

			var sortCatalog = function (key, direction) {
				catalogData.typeM.RESULTS.RES[0].R.sort(GlobalFunctions.compareValues(key, direction));
			};

			if (btnCatalog) {
				btnCatalog.addEventListener('click', function (e) {
					tabState('catalog');
				}, false);
			}

			if (btnWebsite) {
				btnWebsite.addEventListener('click', function () {
					tabState('website');
				}, false);
			}

			if (modalFooterButton) {
				modalFooterButton.addEventListener('click', function () {
					$filterModalWebsite.moduleModal('close');
					$filterModalCatalog.moduleModal('close');
					GlobalFunctions.scrollToTop(0);
				}, false);
			}

			if (modalButtonWebsite) {
				modalButtonWebsite.addEventListener('click', function () {
					$filterModalWebsite.moduleModal('open');
					GlobalFunctions.scrollToTop(0);
				});
			}

			if (modalButtonCatalog) {
				modalButtonCatalog.addEventListener('click', function () {
					$filterModalCatalog.moduleModal('open');
					GlobalFunctions.scrollToTop(0);
				});
			}

			EventHub.on('search-input-toggle', 'search-state-callback', function (payload) {
				if (payload.isOpen) {
					element.classList.add('search-open');
					stickySortingFilter();
				} else {
					element.classList.remove('search-open');
					stickySortingFilter();
				}
			});

			EventHub.on('search-filter-options', 'filter', function (event) {
				var data = event.bindData;
				apiFetch(data);
			});

			EventHub.on('search-items', 'paging', function (event) {
				GlobalFunctions.scrollToTop(0);
				var data = event.bindData,
					amount = '&num=10';
				if (event.amount) {
					amount = event.amount;
				}
				apiFetch(data);
			});

			EventHub.on('search-items', 'amount', function (event) {
				var param;
				param = GlobalFunctions.setUrlParameter('num', event.amount, event.bindData);
				GlobalFunctions.scrollToTop(0);
				apiFetch(param);
			});

			EventHub.on('search-sort', 'sort-catalog', function (event) {
				var sort = event.bindData;

				element.querySelector('.sort-title').innerHTML = event.name;
				element.querySelector('.sort-select').value = sort;

				EventHub.trigger('search-sort', 'sticky-sort', {
					selectTitle: event.name,
				});

				sort = sort.split('-');
				sortCatalog(sort[0], sort[1]);
			});

			init();
		});
	};
}));

/* global jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('AutoComplete')
	);
}(function(_, $, AutoComplete) {

	'use strict';

	// @TODO This needs to be refactored into a common search module or a product finder search module.
	$.fn.moduleSearchOnDark = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$searchInput = $this.find(':input'),
				$submitButton = $this.find(':button');

			$searchInput.on('keyup', toggleSubmitButton);

			function toggleSubmitButton() {
				if ($searchInput.val().length > 0) {
					$submitButton.removeAttr('disabled');
				}
				else {
					$submitButton.attr('disabled', 'disabled');
				}
			}

			AutoComplete({
				selector: $searchInput.get(0),
				url: $searchInput.get(0).dataset.searchUrl,
				minChars: 2,
				responseHook: function(response) {
					var result = [];

					_.each(response.results, function(responseItem) {
						result.push(responseItem.name);
						if (result.length >= 5) {
							return false;
						}
					});

					return result;
				}
			});
		});

		return this;
	};
}));

/* global jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('AutoComplete')
	);
}(function(_, $, AutoComplete) {

	'use strict';

	$.fn.moduleSearch = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$searchInput = $this.find(':input'),
				$submitButton = $this.find(':button'),
				$form = $this.find('form');

			function toggleSubmitButton() {
				if ($searchInput.val().length > 0) {
					$submitButton.removeAttr('disabled');
				}
				else {
					$submitButton.attr('disabled', 'disabled');
				}
			}

			$searchInput.on('keyup', toggleSubmitButton);

			$form.on('submit', function(e) {
				if ($searchInput.val().length === 0) {
					e.preventDefault();
				}
			});

			AutoComplete({
				selector: $searchInput.get(0),
				url: $searchInput.get(0).dataset.searchUrl,
				minChars: 3,
				responseHook: function(response) {
					var result = [];

					_.each(response.results, function(responseItem) {
						result.push(responseItem.name);
						if (result.length >= 5) {
							return false;
						}
					});

					return result;
				}
			});
		});

		return this;
	};
}));

/* global jQuery, tns, Plyr */

(function (factory) {
	factory(
		_,
		jQuery,
		tns,
		Plyr
	);
}(function (_, $, tns, Plyr) {

	'use strict';

	/**
	 * @param {jQuery|*} $module
	 */
	function slideInfoActive($module) {
		$module.find('.slide-info').removeClass('active');
		$module.find('.tns-slide-active').find('.slide-info').addClass('active');
	}

	/**
	 * @param {jQuery|*} $module
	 * @param {tns[]|*[]} players
	 */
	function togglePlayer($module, players) {
		var $videoSlide = $module.find('.slide-video'),
			index = $('.tns-slide-active').index('.slide-video');

		if (!$videoSlide.length) {
			return;
		}

		$.each(players, function (i) {
			players[i].stop();
		});

		if ($videoSlide.hasClass('tns-slide-active')) {
			players[index].play();
		}
	}

	/**
	 * @param {jQuery|*} $module
	 * @param {tns|*} slider
	 * @param {Plyr.setup[]|*[]} players
	 */
	function bindListeners($module, slider, players) {
		var $controls = $module.find('.prev, .next'),
			$videoSlide = $module.find('.slide-video');

		slider.events.on('transitionStart', function () {
			togglePlayer($module, players);
		});

		slider.events.on('transitionEnd', function () {
			slideInfoActive($module);
		});

		// stops autoplay on mouseover of nav controls
		$controls.on('mouseenter', function () {
			slider.pause();
		});

		// starts autoplay on mouseleave of nav controls
		$controls.on('mouseleave', function () {
			slider.play();
		});

		// prevents focus/active state on mobile and makes sure, that autoplay will not be interrupted.
		$controls.on('touchstart', function (e) {
			e.preventDefault();
			$(this).trigger('click');
		});

		// plays video in first slide if video
		if ($videoSlide && $videoSlide.hasClass('tns-slide-active')) {
			players[0].on('ready', function() {
				players[0].togglePlay();
			});
		}
	}

	$.fn.moduleStage = function () {
		this.each(function (index, element) {
			var $this = $(element),
				stageSlider,
				$players = $this.find('.stage-player'),
				playerElements,
				players,
				tnsOptions = {
					container: $this.find('.slider').get(0),
					controls: false,
					controlsContainer: $this.find('.arrows').get(0),
					nav: true,
					navContainer: $this.find('.dots').get(0),
					navPosition: 'bottom',
					mouseDrag: true,
					touch: true,
					autoWidth: false,
					loop: false,
					items: 1,
					rewind: true,
					speed: 500,
					arrowKeys: true,
					responsive: {
						992: {
							touch: false
						},
						768: {
							controls: true
						}
					}
				},
				pauseOnHover = $this.data('pause-on-hover');

			if ($this.hasClass('autoplay')) {
				tnsOptions.autoplay = true;
				tnsOptions.autoplayTimeout = $this.data('autoplayspeed');
				tnsOptions.autoplayHoverPause = pauseOnHover ? pauseOnHover : false;
				tnsOptions.autoplayButtonOutput = false;
			}

			stageSlider = tns(tnsOptions);

			playerElements = $players.get(); // NodeList
			playerElements = _.values(playerElements); // HTMLElement[]

			players = Plyr.setup(playerElements, {
				autoplay: false,
				controls: false,
				loop: {
					active: true
				}
			});

			bindListeners($this, stageSlider, players);

		});

		return this;
	};
}));


/* global jQuery, tns, Handlebars */

(function (factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service('BrowserEvents'),
		window.dcApp.service('EventHub')
	);
}(function (_, $, tns, BrowserEvents, EventHub) {

	'use strict';

	var counter = 0,
		tabBody = [];

	/**
	 * TODOS
	 * This für Selektoren nutzem
	 * Not Secondary Variante
	 */
	$.fn.moduleTabNavigation = function () {
		this.each(function (index, element) {
			var $this = $(element),
				tabHead = $this.find('.tab-head').get(0),
				tabContent = $this.find('.tab-content').get(0),
				$prevButton = $this.find('.tab-navigation-prev-button'),
				$nextButton = $this.find('.tab-navigation-next-button'),
				tabNavigation,
				tabFixedHeader;

			// @link https://github.com/ganlanyuan/tiny-slider
			tabNavigation = tns({
				container: tabHead, // HTMLElement
				controls: false,
				nav: false,
				gutter: 10,
				slideBy: 1,
				mouseDrag: true,
				swipeAngle: false,
				autoWidth: true,
				loop: false,
				onInit: function (sliderInstance) {
					$('.module-tab-navigation-fixed-header-wrapper .head-item:nth-child(' + (sliderInstance.index + 1) + ')').addClass('tns-nav-active');
				}
			});

			tabBody.push(tns({
				container: tabContent, // HTMLElement
				controls: false,
				nav: true,
				navContainer: tabHead, // HTMLElement
				items: 1,
				slideBy: 1,
				mouseDrag: false,
				touch: false,
				loop: false
			}));

			if ($this.hasClass('variation-fixed-header')) {
				tabFixedHeader = initFixedHeader($this, tabHead, index);
				checkTabHeaderWidth(tabHead, tabFixedHeader);
			}

			$prevButton.on('click', function () {
				var $this = $(this),
					fixedHeaderSelectorIndex = getFixedHeaderIndex($this);

				EventHub.trigger('switch-slide', 'switch' + fixedHeaderSelectorIndex, {
					slide: 'prev',
					index: fixedHeaderSelectorIndex
				});
			});

			$nextButton.on('click', function () {
				var $this = $(this),
					fixedHeaderSelectorIndex = getFixedHeaderIndex($this);

				EventHub.trigger('switch-slide', 'switch' + fixedHeaderSelectorIndex, {
					slide: 'next',
					index: fixedHeaderSelectorIndex
				});
			});

			//Synchronize fixed header index with onChange
			tabBody[counter].events.on('indexChanged', function (sliderInstance) {
				var $fixedHeaderSelectorIndex = getIndexfromInstance(sliderInstance);

				EventHub.trigger('tab-body-slide-changed', 'switch' + $fixedHeaderSelectorIndex, sliderInstance);

				//Check if First Slide
				if (sliderInstance.index > 0) {
					$this.addClass('not-first-slide');
					$prevButton.addClass('active');
				} else {
					$this.removeClass('not-first-slide');
					$prevButton.removeClass('active');
				}

				//Check if Last Slide
				if ((sliderInstance.index + 1) < sliderInstance.slideCount) {
					$nextButton.addClass('active');
				} else {
					$this.removeClass('not-first-slide');
					$nextButton.removeClass('active');
				}
			});

			tabBody[counter].events.on('transitionEnd', function (sliderInstance) {
				if ($this.hasClass('variation-fixed-header')) {
					var $fixedHeaderSelectorIndex = getIndexfromInstance(sliderInstance);

					onTabTransitionEnd(tabBody[$fixedHeaderSelectorIndex]);
				} else {
					//Remove after Refactoring
					onTabTransitionEnd(tabBody[0]);
				}
			});

			EventHub.on('rebuild-slider', 'rebuild', function () {
				window.dispatchEvent(new Event('resize'));
			});

			EventHub.on('switch-slide', 'switch' + counter, function (sliderObject) {
				tabBody[sliderObject.index].goTo(sliderObject.slide);
			});

			EventHub.on('destroy-slider', 'destroy', function () {
				tabNavigation.destroy();
			});

			$this.addClass('initialized');

			function onTabTransitionEnd(tabBody) {
				moveActiveTabToCenter(tabBody, tabNavigation, tabFixedHeader);
				triggerTransitionEnd();
			}

			counter++;
		});

		/**
		 * Initialize Sticky Header
		 * @param $element
		 * @param tabHead
		 */
		function initFixedHeader($element, tabHead) {
			var $fixedHeader = $(tabHead).clone(),
				fixedHeaderHTML = $fixedHeader.html(),
				tabVariant = checkTabVariant($element),
				html = createHeaderHTML(fixedHeaderHTML, tabVariant),
				fixedHeaderNavigation,
				$fixedHeaderSelector,
				$fixedHeaderWrapper,
				$prevButton,
				$nextButton;

			$('.module-header .header-extensions').append(html);

			fixedHeaderNavigation = tns({
				container: $('.module-header .module-tab-navigation-fixed-header-wrapper:last-of-type .tab-head').get(0), // HTMLElement
				controls: false,
				nav: false,
				gutter: 10,
				items: 1,
				slideBy: 1,
				mouseDrag: true,
				swipeAngle: false,
				autoWidth: true,
				loop: false,
				onInit: function (sliderInstance) {
					$fixedHeaderWrapper = $(sliderInstance)[0].container.closest('.module-tab-navigation-fixed-header-wrapper');
					$fixedHeaderWrapper = $($fixedHeaderWrapper);
					$fixedHeaderWrapper.addClass('tab-navigation-slider-' + sliderInstance.container.id);
					$fixedHeaderSelector = $('.tab-navigation-slider-' + sliderInstance.container.id);
					$prevButton = $fixedHeaderSelector.find('.tab-navigation-prev-button');
					$nextButton = $fixedHeaderSelector.find('.tab-navigation-next-button');

					$element.find('.tab-content').attr('data-connected-slider', sliderInstance.container.id);

					//Click Handler for Synchronisation
					$fixedHeaderSelector.find('.head-item').on('click', function (e) {
						var $this = $(this),
							fixedHeaderIndex = $this.closest('.header-extensions').children('.module-tab-navigation-fixed-header-wrapper').index($fixedHeaderSelector);
						$this.addClass('tns-nav-active').siblings().removeClass('tns-nav-active');
						EventHub.trigger('switch-slide', 'switch' + fixedHeaderIndex, {
							slide: $fixedHeaderSelector.find('.head-item').index(this),
							index: fixedHeaderIndex
						});
						scrollToTopOfTabNav($element);
					});

					$prevButton.on('click', function () {
						var $this = $(this),
							fixedHeaderIndex = $this.closest('.header-extensions').children('.module-tab-navigation-fixed-header-wrapper').index($fixedHeaderSelector);

						EventHub.trigger('switch-slide', 'switch' + fixedHeaderIndex, {
							slide: 'prev',
							index: fixedHeaderIndex
						});
						scrollToTopOfTabNav($element);
					});

					$nextButton.on('click', function () {
						var $this = $(this),
							fixedHeaderIndex = $this.closest('.header-extensions').children('.module-tab-navigation-fixed-header-wrapper').index($fixedHeaderSelector);

						EventHub.trigger('switch-slide', 'switch' + fixedHeaderIndex, {
							slide: 'next',
							index: fixedHeaderIndex
						});
						scrollToTopOfTabNav($element);
					});

					BrowserEvents.on('scroll', function () {
						checkScrollOverlap($element, $fixedHeaderSelector);
					});

					checkScrollOverlap($element, $fixedHeaderSelector);
				}
			});

			EventHub.on('tab-body-slide-changed', 'switch' + counter, function (sliderInstance) {
				$fixedHeaderSelector.find('.head-item:nth-child(' + (sliderInstance.index + 1) + ')').addClass('tns-nav-active').siblings().removeClass('tns-nav-active');
				fixedHeaderNavigation.goTo(sliderInstance.index);

				//Check if First Slide
				if (sliderInstance.index > 0) {
					$fixedHeaderSelector.addClass('not-first-slide');
					$prevButton.addClass('active');
				} else {
					$fixedHeaderSelector.removeClass('not-first-slide');
					$prevButton.removeClass('active');
				}

				//Check if Last Slide
				if ((sliderInstance.index + 1) < sliderInstance.slideCount) {
					$nextButton.addClass('active');
				} else {
					$fixedHeaderSelector.removeClass('not-first-slide');
					$nextButton.removeClass('active');
				}
			});

			return fixedHeaderNavigation;
		}

		/**
		 * @param {tns|*} tabBody
		 * @param {tns|*} tabNavigation
		 */
		function moveActiveTabToCenter(tabBody, tabNavigation, tabFixedHeader) {
			var info = tabBody.getInfo(),
				indexCurrent = info.index;

			tabNavigation.goTo(indexCurrent);

			if (typeof tabFixedHeader !== 'undefined') {
				tabFixedHeader.goTo(indexCurrent);
			}
		}

		/**
		 * Nested modules may listen to this event to update themselves.
		 *
		 * Note:
		 * This may be extended with the current container to allow
		 * updating only what became visible (performance).
		 */
		function triggerTransitionEnd() {
			EventHub.trigger('tab-navigation', 'transition-end');
		}

		/**
		 * Create HTML for Sticky Header
		 * @param fixedHeaderHTML
		 */
		function createHeaderHTML(fixedHeaderHTML, tabVariant) {
			var $fixedHeaderTPL = $('#tab-navigation-fixed-header-tpl'),
				context = {'tab-navigation-header': fixedHeaderHTML},
				template = null,
				html = null;

			if(tabVariant === "tab-secondary") {
				context.tabNavigationHeaderVariant = 'is-secondary';
			}

			if(tabVariant === "tab-dark") {
				context.tabNavigationHeaderVariant = 'is-dark';
			}



			template = Handlebars.compile($fixedHeaderTPL.html());
			html = template(context);

			return html;
		}

		/**
		 * Show fixed header if header overlaps Tab Navigation
		 * @param $tabnavigation - jQuery Selector of Tab Navigation
		 * @param $fixedHeaderSelector - jQuery Selector of Fixed Header
		 */
		function checkScrollOverlap($tabnavigation, $fixedHeaderSelector) {

			var headerPosition = $('header .fixed-container').offset().top,
				fixedNavHeight = $fixedHeaderSelector.height(),
				headerHeight = $('.module-header').height() + fixedNavHeight,
				tabnavigationPosition = $tabnavigation.offset().top,
				tabnavigationHeight = $tabnavigation.height(),
				tabnavigationHeaderHeight = $tabnavigation.find('.tab-head').height();

			if (headerPosition + headerHeight < tabnavigationPosition + tabnavigationHeaderHeight) {
				$fixedHeaderSelector.removeClass('show');
			} else if (headerPosition + headerHeight > tabnavigationPosition + tabnavigationHeight) {
				$fixedHeaderSelector.removeClass('show');
			} else {
				$fixedHeaderSelector.addClass('show');
				EventHub.trigger('rebuild-slider', 'rebuild');
			}
		}

		/**
		 * Check wdth of wab tavigation head and show Prev/Next button if needed
		 * @param $tabnavigation
		 * @param $fixedHeaderSelector
		 */
		function checkTabHeaderWidth(tabnavigation, fixedHeaderSelector) {
			var sum = 0,
				$tabnavigation = $(tabnavigation);

			$tabnavigation.children().each(function (index, element) {
				sum = sum + parseFloat($(element).outerWidth());
			});

			checkTabHeaderWidthHelper(sum, $tabnavigation, fixedHeaderSelector);

			BrowserEvents.on('resize', function () {
				checkTabHeaderWidthHelper(sum, $tabnavigation, fixedHeaderSelector);
			});
		}

		function checkTabHeaderWidthHelper(sum, $tabnavigation, fixedHeaderSelector) {
			if (sum > $tabnavigation.outerWidth()) {
				$tabnavigation.closest('.module-tab-navigation').addClass('show-prev-next');
				$('.module-tab-navigation-fixed-header-wrapper').addClass('show-prev-next');
			} else {
				$tabnavigation.closest('.module-tab-navigation').removeClass('show-prev-next');
				$('.module-tab-navigation-fixed-header-wrapper').removeClass('show-prev-next');
			}
		}

		function scrollToTopOfTabNav($element) {
			var $headerSelector = $('.module-header');

			$headerSelector.addClass('lock-header');

			$('html, body').animate({
					scrollTop: $element.offset().top
				},
				{
					duration: 500,
					easing: '',
					complete: function () {
						$headerSelector.removeClass('lock-header');
					}
				});
		}

		function getFixedHeaderIndex($this) {
			var fixedHeaderSelector = $this.closest('.module-tab-navigation').find('.tab-content').attr('data-connected-slider'),
				$fixedHeaderSelector = $('.tab-navigation-slider-' + fixedHeaderSelector),
				$fixedHeaderSelectorIndex = $fixedHeaderSelector.closest('.header-extensions').children('.module-tab-navigation-fixed-header-wrapper').index($fixedHeaderSelector);

			return $fixedHeaderSelectorIndex;
		}

		function getIndexfromInstance(sliderInstance) {
			var fixedHeaderSelector = sliderInstance.container.dataset.connectedSlider,
				$fixedHeaderSelector = $('.tab-navigation-slider-' + fixedHeaderSelector),
				$fixedHeaderSelectorIndex = $fixedHeaderSelector.closest('.header-extensions').children('.module-tab-navigation-fixed-header-wrapper').index($fixedHeaderSelector);

			return $fixedHeaderSelectorIndex;
		}

		/**
		 * Check for variant of Tab Navigation
		 */
		function checkTabVariant($element) {
			if ($element.hasClass('module-tab-navigation-secondary')) {
				return "tab-secondary";
			} else if ($element.hasClass('module-tab-navigation-dark')){
				return "tab-dark";
			} else {
				return "tab-normal"
			}
		}

		return this;
	};
}));


/* global _, jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('EventHub'),
		window.dcApp.service('GlobalFunctions')
	);
}(function (_, $, EventHub, GlobalFunctions) {

	'use strict';

	$.fn.moduleTags = function () {
		this.each(function (index, element) {
			var showMoreTags = element.querySelectorAll('.show-tags'),
				filterSection = GlobalFunctions.closestParent(element, '.filter-section-tag', '.module-filter-bar'),
				clearWrapper = element.querySelector('.module-tags .button-wrapper .clear-wrapper'),
				showWrapper = element.querySelector('.module-tags .button-wrapper .show-wrapper');

			for (var smt = 0; smt < showMoreTags.length; smt++) {
				(function () {
					showMoreTags[smt].addEventListener('click', function (event) {
						var thisButton = event.target,
							thisParent = thisButton.parentElement,
							thisButtonText = thisParent.querySelector('.content-text');

						if (!element.classList.contains('show-all')) {
							element.classList.add('show-all');
							thisButtonText.innerHTML = 'Show less';
						} else {
							element.classList.remove('show-all');
							thisButtonText.innerHTML = 'Show more';
						}
					});
				})();
			}

			var getTagLength = function () {
				return element.querySelector('.tag-wrapper').children.length;
			};

			var toggleTagFilterButtons = function () {
				if (getTagLength() > 0) {
					filterSection.classList.remove('hide');
					clearWrapper.classList.remove('hide');
				} else {
					filterSection.classList.add('hide');
					clearWrapper.classList.add('hide');
				}
				if (getTagLength() > 3) {
					showWrapper.classList.remove('hide');
				} else {
					showWrapper.classList.add('hide');
				}
			};

			EventHub.on('check-tags', 'toggleTagFilterButtons', function () {
				toggleTagFilterButtons();
			});
		});
	};
}));

/* global jQuery, _, tns */

(function(factory) {
	factory(
		_,
		jQuery
	);
}(function(_, $) {

	'use strict';

	/**
	 * @param {HTMLElement} element
	 * @constructor
	 */
	function Plugin(element) {
		this._initialize(element);
	}

	/**
	 * @param {HTMLElement} element
	 * @private
	 */
	Plugin.prototype._initialize = function (element) {
		this._element = element;

		this._registerListeners();
		this._showNext();
	};

	Plugin.prototype._registerListeners = function () {
		var self = this,
			button = this._element.querySelector('.action-load-more'),
			container = this._element.querySelector('.load-more-container');

		button.addEventListener('click', function () {
			var nextBlock;

			self._showNext();

			nextBlock = self._getNextBlock();
			if (nextBlock) {
				return;
			}

			container.classList.add('hide');
		});
	};

	Plugin.prototype._showNext = function () {
		var articleBlock = this._getNextBlock(),
			delay = 0;

		if (!articleBlock) {
			return;
		}

		articleBlock.classList.add('show');
		articleBlock.querySelectorAll('.frame-limiter').forEach(function (articleFrame) {
			window.setTimeout(function () {
				articleFrame.classList.add('animate');
			}, delay);

			delay += 250;
		});
	};

	Plugin.prototype._getNextBlock = function () {
		return this._element.querySelector('.article-block:not(.show)');
	};

	$.fn.moduleTeaserArticle = function() {
		this.each(function(index, element) {
			if (element.plugin) {
				return;
			}

			element.plugin = new Plugin(element);
		});

		return this;
	};
}));

/* globals jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service('BrowserEvents')
	);
}(function (_, $, tns, BrowserEvents) {

	'use strict';

	$.fn.teaserBlogSlider = function () {
		this.each(function (index, element) {
			var slider = element.querySelector('.slider-container'),
				prev = element.querySelector('.prev'),
				next = element.querySelector('.next'),
				arrows = element.querySelector('.arrows'),
				tnsBaseConfig,
				teaserSlider;

			tnsBaseConfig = {
				container: slider,
				prevButton: prev,
				nextButton: next,
				rewind: true,
				nav: true,
				navPosition: 'bottom',
				mouseDrag: true,
				touch: true,
				speed: 350,
				items: 1,
				slideBy: 1,
				gutter: 30,
				responsive: {
					768: {
						items: 2,
						slideBy: 2
					},
					1200: {
						items: 3,
						slideBy: 3
					}
				}
			};

			teaserSlider = tns(tnsBaseConfig);

			function calcArrowPosition() {

				var position;

				var imageContainer = element.querySelector('.image-wrapper'),
					img = imageContainer.querySelector('img'),
					aspectRatio = img.naturalWidth / img.naturalHeight,
					calcImgHeight = imageContainer.offsetWidth / aspectRatio;

				position = calcImgHeight / 2;
				//position = position + 30;

				arrows.style.top = position + "px";
			}

			//trigger resize to calculate arrow position. Long version for IE11
			setTimeout( function() {
				var resizeEvent = window.document.createEvent('UIEvents');
				resizeEvent.initUIEvent('resize', true, false, window, 0);
				window.dispatchEvent(resizeEvent);
				//window.dispatchEvent(new Event('resize'));
			}, 0);

			BrowserEvents.on('resize', calcArrowPosition);
		});

		return this;
	};

}));

/* global jQuery, _, tns */

(function(factory) {
	factory(
		_,
		jQuery
	);
}(function(_, $) {

	'use strict';

	/**
	 * @param {HTMLElement} element
	 * @constructor
	 */
	function Plugin(element) {
		this._initialize(element);
	}

	/**
	 * @param {HTMLElement} element
	 * @private
	 */
	Plugin.prototype._initialize = function (element) {
		this._element = element;

		this._registerListeners();
		this._showNext();
	};

	Plugin.prototype._registerListeners = function () {
		var self = this,
			button = this._element.querySelector('.action-load-more'),
			container = this._element.querySelector('.load-more-container');

		button.addEventListener('click', function () {
			var nextBlock;

			self._showNext();

			nextBlock = self._getNextBlock();
			if (nextBlock) {
				return;
			}

			container.classList.add('d-none');
		});
	};

	Plugin.prototype._showNext = function () {
		var articleBlock = this._getNextBlock(),
			delay = 0;

		if (!articleBlock) {
			return;
		}

		articleBlock.classList.add('show');
		articleBlock.querySelectorAll('.col-lg-4').forEach(function (articleFrame) {
			window.setTimeout(function () {
				articleFrame.classList.add('animate');
			}, delay);

			delay += 250;
		});
	};

	Plugin.prototype._getNextBlock = function () {
		return this._element.querySelector('.teaser-container .row:not(.show)');
	};

	$.fn.moduleTeaserBlogFilter = function() {
		this.each(function(index, element) {
			if (element.plugin) {
				return;
			}

			element.plugin = new Plugin(element);
		});

		return this;
	};
}));

/* global jQuery */

(function(factory) {
	factory(
		_,
		jQuery
	);
}(function(_, $) {

	'use strict';

	$.fn.moduleTeaserFloating = function() {
		this.each(function(index, element) {
			var teaserWrapper = element.querySelector('.teaser-wrapper');

			var macyInstance = Macy({
				container: teaserWrapper,
				columns: 3,
				margin: 30,
				trueOrder: true,
				breakAt: {
				  767: {
					columns: 1
				  }
				}
			  });
		});

		return this;
	};
}));

/* globals jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service('BrowserEvents'),
		window.dcApp.service('EventHub')
	);
}(function (_, $, tns, BrowserEvents, EventHub) {

	'use strict';

	$.fn.teaserPodcast = function () {
		this.each(function (index, element) {
			var $this = $(element),
				$container = $this.find('.teaser-wrapper').get(0),
				prev = element.querySelector('.prev'),
				next = element.querySelector('.next'),
				tnsBaseConfig,
				teaserSlider;

			tnsBaseConfig = {
				container: $container,
				controls: false,
				nav: true,
				navPosition: 'bottom',
				gutter: 0,
				mouseDrag: true,
				touch: true,
				speed: 350,
				items: 1,
				slideBy: 1,
				prevButton: prev,
				nextButton: next,
				responsive: {
					768: {
						items: 3,
						slideBy: 'page',
						gutter: 30
					},
					992: {
						controls: true
					}
				}
			};

			teaserSlider = tns(tnsBaseConfig);
		});

		return this;
	};

}));

/* globals jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service("BrowserEvents"),
		window.dcApp.service("EventHub")
	);
})(function (_, $, tns, BrowserEvents, EventHub) {
	"use strict";

	$.fn.teaserPortraitBlog = function () {
		this.each(function (index, element) {
			var slider = element.querySelector(".teaser-wrapper"),
				prev = element.querySelector(".prev"),
				next = element.querySelector(".next"),
				arrows = element.querySelector(".arrows"),
				tnsBaseConfig,
				teaserSlider;

			tnsBaseConfig = {
				container: slider,
				prevButton: prev,
				nextButton: next,
				nav: true,
				navPosition: "bottom",
				gutter: 0,
				mouseDrag: true,
				rewind: false,
				loop: false,
				touch: true,
				speed: 350,
				items: 1,
				slideBy: 1,
				responsive: {
					768: {
						items: 2,
						gutter: 30,
						slideBy: 2,
					},
					992: {
						items: 3,
						gutter: 30,
						slideBy: 3,
					},
				},
			};

			teaserSlider = tns(tnsBaseConfig);

			function calcArrowPosition() {
				var position;

				var imageContainer = element.querySelector(".slide-img"),
					img = imageContainer.querySelector("img");

				position = img.offsetHeight / 2;

				arrows.style.top = position + "px";
			}

			//trigger resize to calculate arrow position. Long version for IE11
			setTimeout(function () {
				var resizeEvent = window.document.createEvent("UIEvents");
				resizeEvent.initUIEvent("resize", true, false, window, 0);
				window.dispatchEvent(resizeEvent);
				//window.dispatchEvent(new Event('resize'));
			}, 0);

			BrowserEvents.on("resize", calcArrowPosition);
		});

		return this;
	};
});

/* globals jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service('BrowserEvents'),
		window.dcApp.service('EventHub')
	);
}(function (_, $, tns, BrowserEvents, EventHub) {

	'use strict';

	$.fn.teaserPortrait = function () {
		this.each(function (index, element) {
			var $this = $(element),
				$container = $this.find('.teaser-wrapper').get(0),
				tnsBaseConfig,
				teaserSlider;

			tnsBaseConfig = {
				container: $container,
				controls: false,
				nav: true,
				navPosition: 'bottom',
				gutter: 0,
				mouseDrag: true,
				touch: true,
				speed: 350,
				items: 1,
				slideBy: 1,
				responsive: {
					768: {
						items: 3,
						gutter: 30
					}
				}
			};

			teaserSlider = tns(tnsBaseConfig);
		});

		return this;
	};

}));

/* global jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service('Breakpoint')
	);
}(function(_, $, tns, Breakpoint) {

	'use strict';

	$.fn.moduleTeaserSliderStory = function() {
		this.each(function(index, element) {
			var sliderContainer = element.querySelector('.slider-wrapper'),
				dotsContainer = element.querySelector('.dots'),
				slideCount = element.querySelectorAll('.slide').length,
				prev = element.querySelector('.prev'),
				next = element.querySelector('.next'),
				dots = element.querySelector('.dots'),
				slide = element.querySelectorAll('.slide'),
				detailPageStoryId = element.dataset.detailPageStoryId;

			var calcDots = function() {
				var count;

				if (Breakpoint.from('md')) {
					count = Math.ceil(slideCount/3); //used ceil for round up. If round is used there is a bug when using 1,4,7 etc. slides
				} else {
					count = slideCount;
				}

				dotsContainer.innerHTML = '';

				for (var i = 0; i < count; i++) {
					dotsContainer.appendChild(document.createElement('div'))
					.className = 'dot';
				}
			};

			calcDots(); // initial calculation of dot(navigation) amount

			var slider = tns({
				container: sliderContainer,
				loop: false,
				rewind: false,
				prevButton: prev,
				nextButton: next,
				navContainer: dots,
				mouseDrag: true,
				items: 1,
				edgePadding: 120,
				center: true,
				gutter: 60,
				slideBy: 'page',
				nav: true,
				responsive: {
					768: {
						items: 3,
						edgePadding: 0,
						center: false,
						gutter: 80,
						slideBy: 3,
					}
				}
			});

			slider.events.on("transitionEnd", function (info) { // add class to active center slide (only for mobile)
				info.slideItems[info.indexCached].classList.remove('active-center-slide');
				info.slideItems[info.index].classList.add('active-center-slide');
			});

			Breakpoint.onBreakPointChange(function() {
				calcDots(); // dots will be recalculated
				slider.refresh(); // refresh slider for dot index after recalc of dots
			});

			slide.forEach(function (clickedSlide) {
				clickedSlide.addEventListener('click', function () {
					var dataDetailPageStoryIndex = parseInt(clickedSlide.id.substr(9));

					$.moduleDetailPageStory.open(detailPageStoryId, dataDetailPageStoryIndex);
				});
			});
		});

		return this;
	};
}));

/* global jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		window.dcApp.service('EventBubbling')
	);
}(function(_, $, EventBubbling) {

	'use strict';

	var slideUp = function slideUp(target, duration) {
		if (duration === void 0) {
			duration = 500;
		}

		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.boxSizing = 'border-box';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(function () {
			target.style.display = 'none';
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property'); //alert("!");
		}, duration);
	};

	var slideDown = function slideDown(target, duration) {
		if (duration === void 0) {
			duration = 500;
		}

		target.style.removeProperty('display');
		var display = window.getComputedStyle(target).display;
		if (display === 'none') display = 'block';
		target.style.display = display;
		var height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.boxSizing = 'border-box';
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(function () {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
		}, duration);
	};

	var slideToggle = function slideToggle(target, duration) {
		if (duration === void 0) {
			duration = 500;
		}

		if (window.getComputedStyle(target).display === 'none') {
			return slideDown(target, duration);
		} else {
			return slideUp(target, duration);
		}
	};

	$.fn.moduleTeaserExpand = function() {
		this.each(function(index, element) {
			var toggleExpand = element.querySelector('.desktop-trigger'),
				toggleModal = element.querySelector('.modal-trigger'),
				$expandModal = $(element).find('.expand-modal'),
				expandContainer = element.querySelector('.expand-content-wrapper'),
				previewImage = element.querySelector('.preview-image'),
				previewImageUrl = previewImage.src,
				subFamily = expandContainer.querySelectorAll('.subfamily'),
				btnWrapper = element.querySelector('.module-button'),
				showBtn = element.querySelector('.show-more'),
				subFamilyContainer = element.querySelector('.sub-container'),
				countsubFamily = subFamily.length;

			showBtn.addEventListener('click', function () {
				subFamilyContainer.classList.remove('limit');
				btnWrapper.style.display = 'none';
			});

			function prepareImage(e) {
				var $img = $(e),
					formatFactor = e.naturalWidth / e.naturalHeight;

				if (formatFactor < 1) {
					$img.addClass('portrait');
				}else {
					$img.removeClass('portrait');
				}
				$img.addClass('ready');
			}

			function getDimensions(image){
				var img = new Image();
				img.addEventListener("load", function(){
					var formatFactor = this.naturalWidth / this.naturalHeight;

					if (formatFactor < 1) {
						image.dataset.portrait = 'true';
					}else {
						image.dataset.portrait = 'false';
					}
				});
				img.src = image.dataset.image;
			}

			if (element.classList.contains('auto')) {
				element.querySelectorAll('img').forEach(function (item) {
					item.addEventListener('load', prepareImage(item));
				});

				for (var i = 0; i < subFamily.length; i++) {
					getDimensions(subFamily[i]);
				}
			}

			for (var i = 0; i < subFamily.length; i++) {
				subFamily[i].addEventListener('mouseover', function(e) {
					var dataUrl = e.target.dataset.image,
						portrait = e.target.dataset.portrait;

					previewImage.src = dataUrl;

					if (portrait == 'true' && element.classList.contains('auto')) {
						previewImage.classList.add('portrait');
					}else {
						previewImage.classList.remove('portrait');
					}
				});

				subFamily[i].addEventListener('mouseleave', function() {
					previewImage.src = previewImageUrl;
					prepareImage(previewImage);
				});
			}

			toggleModal.addEventListener('click', function () {
				$expandModal.moduleModal('open');
			});

			toggleExpand.addEventListener('click', function () {
				if(countsubFamily > 9) {
					subFamilyContainer.classList.add('limit');
					btnWrapper.style.display = 'block';
				}

				toggleExpand.classList.toggle('active');
				element.classList.toggle('active');
				slideToggle(expandContainer, 350);
			});

			document.addEventListener('click', function(event) {
				var isClickInside = element.contains(event.target);

				if (!isClickInside) {
					if (element.classList.contains('active')) {
						toggleExpand.classList.remove('active');
						element.classList.remove('active');
						slideUp(expandContainer, 350);
					}
				}
			});
		});
	};
}));

/* global jQuery, tns */

(function (factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service('BrowserEvents'),
		window.dcApp.service('Breakpoint')
	);
}(function(_, $, tns, BrowserEvents, Breakpoint) {

	'use strict';

	$.fn.moduleTeaserGrid = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$sliderContainer = $this.find('.slider'),
				$dotsContainer = $this.find('.dots'),
				teaserSlider,
				tnsConfigBase,
				tnsConfigFixedWidth,
				tnsConfig,
				hasFixedSlideWidths;

			/**
			 * Differentiates between default teaser slider variant and the fixed width variant as necessary for teaser support slider.
			 * Triggers an update for the sliders visualization.
			 */
			function onSliderInit() {
				if (hasFixedSlideWidths) {
					$this.find('.tns-outer').addClass('fixed-width');
				}

				window.setTimeout(updateTeasersVisualization, 0);
			}

			/**
			 * Decides between breakpoints and initializes the teasers visualization. Slider or non-slider type.
			 */
			function updateTeasersVisualization() {
				if (Breakpoint.from('md')) {
					destroySlider();
				}
				else {
					rebuildSlider();
				}
			}

			function rebuildSlider() {
				if (!teaserSlider.isOn) {
					teaserSlider = teaserSlider.rebuild();
				}
			}

			function destroySlider() {
				if (teaserSlider.destroy) {
					teaserSlider.destroy();
				}
			}

			if (!$sliderContainer.length) {
				return;
			}

			tnsConfigBase = {
				container: $sliderContainer.get(0),
				controls: false,
				mouseDrag: true,
				touch: true,
				rewind: true,
				loop: false,
				speed: 500,
				nav: true,
				navContainer: $dotsContainer.get(0),
				onInit: onSliderInit
			};

			tnsConfigFixedWidth = {
				edgePadding: 15,
				gutter: 30,
				autoWidth: false,
				rewind: false,
				loop: true
			};

			hasFixedSlideWidths = $sliderContainer.data('has-fixed-width');

			// Merges base and specialized slider config parameters.
			// Base config is necessary for sliders without fixed width on mobile devices, as it's used for e.g. news teasers.
			tnsConfig = hasFixedSlideWidths
				? $.extend({}, tnsConfigBase, tnsConfigFixedWidth)
				: tnsConfigBase;

			teaserSlider = tns(tnsConfig);

			Breakpoint.onBreakPointChange(updateTeasersVisualization);
		});

		return this;
	};
}));

/* globals jQuery, Handlebars */

(function(factory) {
	factory(
		_,
		jQuery
	);
}(function(_, $) {

	'use strict';

	$.fn.moduleTeaserLoadMore = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$btnLoadMore = $this.find('.module-teaser-load-more'),
				$targetContainer = $this.find($btnLoadMore.data('target-container-selector')),
				teaserClasses = $btnLoadMore.data('teaser-classes'),
				targetTemplateSelector = $btnLoadMore.data('target-template-selector'),
				url = $btnLoadMore.find('.btn').attr('href'),
				template = Handlebars.compile($(targetTemplateSelector).html());

			update(true);

			function update(initialLoading) {
				$.ajax({
					url: url,
					method: 'GET',
					dataType: 'json'
				}).done(function(response) {
					$.each(response.teasers, function (idx, data) {
						data.teaserClasses = teaserClasses;

						if (!initialLoading) {
							data.loadedClass = 'move-up';
						}

						setTimeout(function () {
							$targetContainer.append(template(data));
						}, initialLoading ? 0 : idx * 200);
					});

					$btnLoadMore.addClass('active');

					if (response.nextUrl) {
						url = response.nextUrl;
						$btnLoadMore.find('a').attr('href', response.nextUrl);
					} else {
						$btnLoadMore.remove();
					}
				});
			}

			$btnLoadMore.on('click', function(e) {
				e.preventDefault();
				update(false);
			});
		});

		return this;
	};
}));

/* globals jQuery */

(function (factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service('BrowserEvents'),
		window.dcApp.service('EventHub')
	);
}(function (_, $, tns, BrowserEvents, EventHub) {

	'use strict';

	$.fn.moduleTeaserSlider = function () {
		this.each(function (index, element) {
			var $this = $(element),
				$container = $this.find('.teaser-wrapper').get(0),
				$arrows = $this.find('.arrows'),
				$imageContainer,
				tnsConfig,
				tnsBaseConfig,
				tnsInitial4,
				tnsInitial3,
				tnsInitial2,
				pauseOnHover = $this.data('pause-on-hover'),
				teaserSlider;

			tnsBaseConfig = {
				container: $container,
				controls: true,
				controlsContainer: $arrows.get(0),
				nav: true,
				navPosition: 'bottom',
				gutter: 0,
				mouseDrag: true,
				touch: true,
				autoWidth: false,
				autoHeight: false,
				speed: 350,
				loop: false,
				rewind: true,
				items: 1,
				slideBy: 1
			};
			tnsInitial4 = {
				responsive: {
					1200: {
						items: 4,
						slideBy: 4,
						gutter: 30
					},
					768: {
						items: 3,
						slideBy: 3,
						gutter: 30
					}
				}
			};
			tnsInitial3 = {
				responsive: {
					768: {
						items: 3,
						slideBy: 3,
						gutter: 30
					}
				}
			};
			tnsInitial2 = {
				responsive: {
					768: {
						items: 2,
						slideBy: 2,
						gutter: 30
					}
				}
			};


			if ($this.hasClass('initial4')) {
				tnsConfig = $.extend({}, tnsBaseConfig, tnsInitial4);
			} else if ($this.hasClass('initial3')) {
				tnsConfig = $.extend({}, tnsBaseConfig, tnsInitial3);
			} else if ($this.hasClass('initial2')) {
				tnsConfig = $.extend({}, tnsBaseConfig, tnsInitial2);
			} else {
				tnsConfig = tnsBaseConfig;
			}

			if ($this.hasClass('autoplay')) {
				tnsConfig.autoplay = true;
				tnsConfig.autoplayTimeout = $this.data('autoplayspeed');
				tnsConfig.autoplayHoverPause = pauseOnHover ? pauseOnHover : false;
				tnsConfig.autoplayButtonOutput = false;

				if (pauseOnHover) {
					var $controls = $this.find('.prev, .next');

					// stops autoplay on mouseover of nav controls
					$controls.on('mouseenter', function () {
						teaserSlider.pause();
					});

					// starts autoplay on mouseleave of nav controls
					$controls.on('mouseleave', function () {
						teaserSlider.play();
					});

					// prevents focus/active state on mobile and makes sure, that autoplay will not be interrupted.
					$controls.on('touchstart', function (e) {
						e.preventDefault();
						$(this).trigger('click');
					});
				}
			}

			teaserSlider = tns(tnsConfig);

			function calcArrowPosition() {

				var position;

				if ($this.hasClass('tools-slider')) {
					$imageContainer = $this.find('.module-teaserlist');
					var teaser = $imageContainer.find('a.teaser').get(0);

					position = teaser.offsetHeight / 2;
				} else {
					$imageContainer = $this.find('.slide-img');
					var img = $imageContainer.find('img').get(0),
						aspectRatio = img.naturalWidth / img.naturalHeight,
						calcImgHeight = $imageContainer.width() / aspectRatio;

					position = calcImgHeight / 2;
				}

				$arrows.css({
					'top': position
				});
			}


			setTimeout( function() {
				$(window).trigger('resize');
			}, 0);

			BrowserEvents.on('resize', calcArrowPosition);

			// Necessary for recalculation after a tab change (tab-navigation module), if there is a teaser-slider inside a tab-navigation module.
			EventHub.on('tab-navigation', 'transition-end', function () {
				calcArrowPosition();
			});
		});

		return this;
	};

}));

/* global jQuery, tippy */

(function (factory) {
	factory(
		_,
		jQuery,
		tippy,
		window.dcApp
	);
}(function (_, $, tippy, App) {

	'use strict';

	$.fn.moduleTooltip = function () {
		this.each(function (index, element) {
			var content = element.querySelector('.tooltip-tk'),
				trigger = element.querySelector('.tooltip-trigger');

			var tt = tippy(trigger, {
				content: content.innerHTML,
				arrow: true,
				trigger: 'click',
				theme: 'rexroth',
				interactive: true,
				maxWidth: 320,
				sticky: true,
				flipBehavior: ['left', 'top', 'right', 'top', 'top', 'bottom', 'bottom', 'top'],
				onShown: function() {
					App.compilePlugins($('body').find('.tippy-popper'));
				},
			});
		});
	};
}));

/* global jQuery */

(function(factory) {
	factory(
		_,
		jQuery
	);
}(function(_, $) {

	'use strict';

	$.fn.moduleValueIndicator = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$input = $this.find('input[type="number"]'),
				$increment = $this.find('.increment'),
				$decrement = $this.find('.decrement'),
				attrMaxLength = $input.attr('maxLength'),
				attrMinValue = $input.attr('min'),
				attrMaxValue = $input.attr('max'),
				attrStepValue = $input.attr('step'),
				maxLength = attrMaxLength ? parseInt(attrMaxLength) : 6,
				maxValue = attrMaxValue ? parseInt(attrMaxValue) : 999999,
				value;

			function update() {
				setMinValue();

				$input.prop('value', value);
				disableButton();
			}

			function disableButton() {
				value = getValue();

				// disable plus button if value is MaxValue
				if (value === parseInt(attrMaxValue)) {
					$increment.addClass('disabled');
				} else {
					$increment.removeClass('disabled');
				}

				// disable minus button if value is MinValue
				if (value === parseInt(attrMinValue)) {
					$decrement.addClass('disabled');
				} else {
					$decrement.removeClass('disabled');
				}
			}

			function getValue() {
				return parseInt($input.val());
			}

			function setMinValue() {
				if (value < attrMinValue) {
					value = attrMinValue;
				}
			}

			function isOutOfBounds() {
				value = getValue();
				return (value + 1).toString().length > maxLength;
			}

			$input.on('click', function() {
				$(this).select();
			});

			$input.on('keydown', function (e) {
				if (!$.isNumeric(e.key) &&
					e.keyCode !== 37 &&	e.keyCode !== 38 &&	e.keyCode !== 39 &&	e.keyCode !== 40 &&
					e.keyCode !== 46 &&	e.keyCode !== 8
				) {
					e.preventDefault();
				}
			});

			$input.on('keyup change blur', function() {
				value = getValue();

				if (isOutOfBounds()) {
					value = maxValue;
				}

				if (isNaN(value)) {
					value = attrMinValue;
				}

				update();
			});

			$increment.on('click', function() {
				if (isOutOfBounds()) {
					return;
				}

				if (attrStepValue > 1) {
					value += parseInt(attrStepValue);
				} else {
					value += 1;
				}

				update();
			});

			$decrement.on('click', function() {
				if (attrStepValue > 1) {
					value = Math.max(attrMinValue, value - parseInt(attrStepValue));
				} else {
					value = Math.max(attrMinValue, value - 1);
				}
				update();
			});

			value = getValue();
			update();
		});

		return this;
	};
}));

/* global jQuery, Plyr */

(function (factory) {
	factory(
		_,
		jQuery,
		Plyr,
		window.dcApp.service('EventHub')
	);
}(function (_, $, Plyr, EventHub) {

	'use strict';

	$.fn.moduleVideo = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$player = $this.find('.player'),
				$videoContainer = $this.parents('.video-with-text').find('.video-container'),
				$modal = $this.closest('.module-modal'),
				providerPoster = $this.data('provider-poster'),
				player;

			player = new Plyr($player, {
				autoplay: false
			});

			player.toggleControls(false);

			player.on('ready', function() {
				if ($this.hasClass('is-provider-video')) {
					player.poster = providerPoster;
				}

				// Fixes video visibility for IE 11
				$this.find('.plyr__video-wrapper.plyr__video-embed').css('opacity', 1);

				$this.find('.plyr__control--overlaid')
					.addClass('icon-dc_play')
					.find('svg').remove();

				$this.addClass('initialized');
			});

			if ($modal) {
				$videoContainer.on('click', function () {
					$modal.moduleModal('open');
				});
			}

			// Fixes video size for IE 11
			if ($player.parents('.module-modal.fullwidth-video').length) {
				player.on('enterfullscreen', function(e) {
					var $this = $(e.target);

					if (!$this.parents('.fullwidth-video.show').length) {
						return;
					}

					$this.addClass('max-width');
				});

				player.on('exitfullscreen', function(e) {
					if (!$(e.target).parents('.fullwidth-video.show').length) {
						return;
					}

					$this.removeClass('max-width');
				});
			}

			EventHub.on('fullwidth-video', 'play', function(playload) {
				if (!$this.find('.plyr').is(playload.$player)) {
					return;
				}

				player.play();
			});

			EventHub.on('fullwidth-video', 'stop', function(playload) {
				if (!$this.find('.plyr').is(playload.$player)) {
					return;
				}

				player.stop();
			});
		});

		return this;
	};
}));

/* globals jQuery */

(function(factory) {
	factory(
		_,
		jQuery,
		tns,
		window.dcApp.service('BrowserEvents'),
		window.dcApp.service('Breakpoint'),
		window.dcApp.service('EventHub')
	);
}(function(_, $, tns, BrowserEvents, Breakpoint, EventHub) {

	'use strict';

	$.fn.moduleZoom = function() {
		this.each(function(index, element) {
			var $this = $(element),
				$previewContainer = $this.find('.zoom-preview'),
				$previewModalContent,
				previewSlider,
				zoomPreviewSlider,
				activeSlide = 0;

			toggleZoom($previewContainer);

			$previewContainer.on('click', function () {
				var $this = $(this),
					$modal = $('[data-modal=' + $this.data('modal-name') + ']');

				if ($this.hasClass('disable-on-mobile')) {
					return;
				}

				$modal.moduleModal('open');
			});

			BrowserEvents.on('resize', function() {
				toggleZoom($previewContainer);
				calculateZoomSlider($previewModalContent);
			});

			if (!$this.hasClass('has-gallery')) {
				return;
			}

			var modalName = $previewContainer.data('modal-name'),
				modalImages = $('[data-modal="' + modalName + '"]').find('img'),
				previewImages = $previewContainer.find('img'),
				images = $.merge(modalImages, previewImages);

			images.on('load', prepareImage);

			previewSlider = tns({
				mode: 'gallery',
				container: element.querySelector('.image-container'),
				controls: false,
				navContainer: element.querySelector('.zoom-thumbnails'),
				navAsThumbnails: true,
				speed: 350,
				loop: true,
				items: 1,
				touch: true
			});

			previewSlider.events.on('indexChanged', function (e) {
				activeSlide = e.index;
			});

			EventHub.on('zoom-preview-slider', 'init', function (payload) {
				initZoomPreviewSlider(payload.$zoomPreviewSlider);
			});

			function initZoomPreviewSlider($zoomPreviewSlider) {
				$previewModalContent = $zoomPreviewSlider.parents('.modal-content');

				if (!zoomPreviewSlider) {
					zoomPreviewSlider = tns({
						container: $zoomPreviewSlider.get(0),
						controls: true,
						controlsContainer: $previewModalContent.find('.arrows').get(0),
						nav: true,
						navContainer: $previewModalContent.find('.dots').get(0),
						navPosition: 'bottom',
						mouseDrag: true,
						touch: true,
						autoWidth: false,
						autoHeight: false,
						speed: 350, // Keep in sync with CSS #gallery-animation-speed
						loop: true,
						items: 1,
						arrowKeys: true
					});
				}

				zoomPreviewSlider.goTo(activeSlide);

				$(window).trigger('resize');
			}

			/**
			 * calculates zoom slider content and recalculates modal height
			 *
			 * @param $modalContent
			 */
			function calculateZoomSlider($modalContent) {
				if (!$modalContent) {
					return;
				}

				var $modalDialog = $modalContent.parent(),
					modalHeight,
					maxWidth = 1170,
					modalHeaderHeight = 63,
					modalFooterSpace = 60;

				$modalDialog.removeAttr('style');

				modalHeight = $modalContent.parents('.module-modal').height() - modalHeaderHeight - modalFooterSpace;

				// Prevents odd height values
				if (modalHeight % 2 !== 0) {
					modalHeight -= 1;
				}

				if (maxWidth > modalHeight) {
					$modalDialog.css('max-width', modalHeight);
				}

				$modalContent.find('.module-image').height(
					$modalContent.find('.tns-outer').width()
				);
			}
		});

		function prepareImage(e) {
			var $img = $(e.target),
				formatFactor = e.target.naturalWidth / e.target.naturalHeight;

			if (formatFactor < 1) {
				$img.addClass('portrait');
			}
		}

		function toggleZoom($container) {
			var breakpoint = Breakpoint.getCurrentBreakpoint();

			if (breakpoint === 'xs' || breakpoint === 'sm') {
				$container.addClass('disable-on-mobile');
			} else {
				$container.removeClass('disable-on-mobile');
			}
		}

		return this;
	};

}));
