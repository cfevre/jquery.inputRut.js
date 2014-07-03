(function($) {
	var pluginName="inputRut";
	var validTags=["input"];

    $[pluginName] = function(element, options) {

        var defaults = {
			dvSeparator:'-',
			thousandsSeparator:'.',
			showPlaceHolder:true,
			placeHolderText:'Ej: 1.234.567-8',
			errorClass:'invalid',
			maxLength:12,
			addMaxLength:true,
			isRequired:true,
			keepFocusOnError:false,
			
            onBlur: function() {},
            onFocus: function() {},
            onInvalid: function() {},
            onValid: function() {}
        };

        var plugin = this;

        plugin.settings = {};

        var $element = $(element);

        plugin.init = function() {

            plugin.settings = $.extend({}, defaults, options);

			$element.focus(function(){
				onFocus();
			});
			
			$element.blur(function(){
				onBlur();
			});
			
			if(plugin.settings.addMaxLength){
				$element.attr('maxlength',plugin.settings.maxLength);
			}			
			if(plugin.settings.showPlaceHolder){
				$element.attr('placeholder',plugin.settings.placeHolderText);
			}
        };

        plugin.isValid= function() {
			var value=cleanValue($element.val());
			if(value.length===0 && !plugin.settings.isRequired){
				return true;
			}
			return value.length>1?(calculaDV(value)===value.substring(value.length-1)):false;
        };

		var onFocus=function(){
			if(plugin.isValid()){
				normalizeValue();
			}
			setTimeout(function(){
				$element.select();
				plugin.settings.onFocus();
			},50);
		};

		var onBlur=function(){
			if(!plugin.isValid())
			{
				$element.addClass(plugin.settings.errorClass);
				plugin.settings.onInvalid($element);
				plugin.settings.onBlur($element);
				if(plugin.settings.keepFocusOnError){
					$element.focus();
				}
				return;
			}
			normalizeValue();
			$element.removeClass(plugin.settings.errorClass);

			formatInput();

			plugin.settings.onValid($element);
			plugin.settings.onBlur($element);
		};

		var normalizeValue=function(){
			$element.val(cleanValue($element.val()));
		};

		var cleanValue=function(value){
			var cleaned=value.trim().replace(/\./gi,'').replace(/\-/gi,'').toUpperCase();
			while(cleaned.length>0 && cleaned[0]=='0')
			{
				cleaned=cleaned.substring(1);
			}
			return cleaned;
		};

		var calculaDV=function(rut){
			var largo = rut.length;	
			if ( largo < 2 ){
				return '';
			}
			
			rut = rut.substring(0, largo - 1);	
			
			var suma = 0;	
			var multiplicador  = 2;
			for (var i=rut.length-1;i>=0;i--){	
				suma = suma + rut.charAt(i) * multiplicador;
				multiplicador= (multiplicador==7) ? 2 : multiplicador+1;				
			}	
			var resultado = suma % 11;
			
			if (resultado===1){			
				return  'K';
			}
			
			if (resultado===0){
				return '0';
			}
			
			return ""+(11-resultado);
		};

		var formatInput=function(){
			var value=$element.val().toUpperCase();
			if(value.length<2){
				return;
			}
			var body=value.substring(0,value.length-1);
			var formatted="";
			while(body.length>2){
				formatted=body.substring(body.length-3)+formatted;
				body=body.substring(0,body.length-3);
				formatted=(body.length>0)? plugin.settings.thousandsSeparator + formatted : formatted;
			}
			formatted=body+formatted;
			value = formatted + plugin.settings.dvSeparator + value.substr(value.length-1);
			$element.val(value);
		};
		
        plugin.init();
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
			var $this=$(this);
            if (undefined === $this.data(pluginName) && (validTags.length===0 || validTags.indexOf($this.prop("tagName").toLowerCase())>=0)) {
                var plugin = new $[pluginName](this, options);
                $this.data(pluginName, plugin);
            }
        });
    };
})(jQuery);
