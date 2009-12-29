jQuery(function ($) {
	$.fn.qs = function (target, opt) {
		
		var timeout, cache, rowcache, jq_results, e = this, options = $.extend({ 
			delay: 200,
			selector: null,
			stripeRows: null,
			loader: null,
			noResults: '',
			onBefore: function () { 
				return;
			},
			onAfter: function () { 
				return;
			},
			filter: function (i) { 
				return i;
			}
		}, opt);
		
		
		this.go = function (val) {
			
			var i = 0, noresults = true, vals = val.split(' ');
			
			var rowcache_length = rowcache.length;
			for (var i = 0; i < rowcache_length; i++)
			{
				if (this.test(vals, cache[i]) || val == "") {
					rowcache[i].style.display = "";
					noresults = false;
				} else {
					rowcache[i].style.display = "none";
				}
			}
			
			if (noresults) {
				this.results(false);
			} else {
				this.results(true);
				this.stripe();
			}
			
			this.loader(false);
			options.onAfter();
			
			return this;
		};
		
		this.stripe = function () {
			
			if (typeof options.stripeRows === "object" && options.stripeRows !== null)
			{
				var joined = options.stripeRows.join(' ');
				var stripeRows_length = options.stripeRows.length;
				
				jq_results.not(':hidden').each(function (i) {
					$(this).removeClass(joined).addClass(options.stripeRows[i % stripeRows_length]);
				});
			}
			
			return this;
		};
		
		this.strip_html = function (input) {
			var output = input.replace(new RegExp('/<[^<]+\>/g'), "");
			output = $.trim(output.toLowerCase());
			return output;
		};
		
		this.results = function (bool) {
			if (typeof options.noResults === "string" && options.noResults !== "") {
				if (bool) {
					$(options.noResults).hide();
				} else {
					$(options.noResults).show();
				}
			}
			return this;
		};
		
		this.loader = function (bool) {
			if (typeof options.loader === "string" && options.loader !== "") {
				 (bool) ? $(options.loader).show() : $(options.loader).hide();
			}
			return this;
		};
		
		this.test = function (vals, t) {
			for (var i = 0; i < vals.length; i += 1) {
				if (t.indexOf(vals[i]) === -1) {
					return false;
				}
			}
			return true;
		};
		
		this.cache = function () {
			
			jq_results = $(target);
			
			if (typeof options.noResults === "string" && options.noResults !== "") {
				jq_results = jq_results.not(options.noResults);
			}
			
			var t = (typeof options.selector === "string") ? jq_results.find(options.selector) : $(target).not(options.noResults);
			cache = t.map(function () {
				return e.strip_html(this.innerHTML);
			});
			
			rowcache = jq_results.map(function () {
				return this;
			});
			
			return this;
		};
		
		this.trigger = function (val) {
			this.loader(true);
			options.onBefore();
			
			window.clearTimeout(timeout);
			timeout = window.setTimeout(function () {
				console.time('go_' + val);
				e.go(val);
				console.timeEnd('go_' + val);
			}, options.delay);
		};
		
		this.cache();
		this.results(true);
		this.stripe();
		this.loader(false);
		
		return this.each(function () {
			$(this).bind('keyup', function () {
				var val = $(this).val();
				e.trigger(val);
			});
		});
		
	};
});