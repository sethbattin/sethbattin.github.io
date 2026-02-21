function GameLoop(canvas){

var self = this;
var _canvas = canvas;
        
var drawContext = null;
var _setDrawContext = function(context){
    drawContext = context;
}
this.setDrawContext = _setDrawContext;
this.getDrawContext = function (){
    return drawContext;
};

var initialized = false;
var initEvents = [];
this.onInit = function (f){
    initEvents.push(f);
};
var _fireInitEvents = function(){
    for (var i = 0; i < initEvents.length; i++) {
        initEvents[i].call(self);
    }
}

this.initialize = function(){

    // skip setting if context is already known.
    if (drawContext == null){
        if (typeof(_canvas) == "string"){
            _canvas = document.getElementById(canvas);
        }
        if (_canvas.getContext){
            var ctx = _canvas.getContext('2d');
            _setDrawContext(ctx);
        }
    }

    // TODO: implement window-visibility loss detection
    // http://stackoverflow.com/a/1060034/1004027
         
    //unify browser functions
    (function(w) {
      var requestAnimationFrame =  window.requestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.msRequestAnimationFrame ||
        function(f){ return w.setTimeOut(f, 33);};  // IE9?
         
        
      w.requestAnimationFrame = requestAnimationFrame;
    })(window);

    // setup main loop
    var jsloop = function(timestamp) {

        if (initialized){
            update(timestamp);
            draw(timestamp);
        }
        
        requestAnimationFrame(jsloop);
    };
    window.requestAnimationFrame(jsloop);
    
    initialized = true;
    _fireInitEvents();
}

// self initialize or queue
if (document.readyState == "complete") {
    this.initialize();
} else {
    var loop = this;
    var prevORSC = document.onreadystatechange;  //save previous event
    document.onreadystatechange = function () {
        
        if (typeof(prevORSC) == "function"){
            prevORSC();
        }
            
        if (document.readyState == "complete") {
            loop.initialize();
        }
            
    }   
}


// setup up exceptions structure

function GameException(message){
    this.message = message;
    this.name = "GameException";
}


var prevUpdate = 0;
var prevDraw = 0;
var updateables = [];
var drawables = [];

var targetRate = 33;

function update(timestamp){

    var timediff = timestamp - prevUpdate;
    prevUpdate = timestamp;

    timediff = timediff % (2 * targetRate);

    for (var i = 0; i < updateables.length; i++){
        updateables[i].update(drawContext, timediff, timestamp);
    }
}

function draw (timestamp){
    var timediff = timestamp - prevDraw;
    prevDraw = timestamp;
    for (var i = 0; i < drawables.length; i++){
        if (typeof(drawContext.save) == 'function'){
            drawContext.save();
        }
        drawables[i].draw(drawContext, timediff, timestamp);
        if (typeof(drawContext.restore) == 'function') {
            drawContext.restore();
        }
    }
}


// public methods

/**
 * Add and item to one or both of the update and draw lists
 * @param objectable {Object} with function member "update" or "draw" or both
 */
this.addItem = function(objectable){
    if (objectable){
        if (typeof(objectable.draw) == "function"){
            this.addDrawable(objectable);
        }
        if (typeof(objectable.update) == "function"){
            this.addUpdateable(objectable);
        }
    }
}

/**
 * Add an item to the list of items in the update list
 * @param updateable {Object} with function member "update"
 * @returns {Number} New count of updateable components
 * @throws {GameException} if object does not contain "update" function
 */
this.addUpdateable = function(updateable){
    if (updateable && updateable.update && typeof(updateable.update) == "function"){
        updateables.push(updateable);
    } else {
        throw new GameException("invalid updateable object added.");
    }
    //crude identifier, invalidated by each removal
    return updateables.length;
}


/**
 * Add an item to the list of items in the draw list
 * @param drawable {Object} with function member "draw"
 * @returns {Number} New count of drawable components
 * @throws {GameException} if object does not contain "draw" function
 */
this.addDrawable = function (drawable) {
    if (drawable && drawable.draw && typeof(drawable.draw) == "function"){
        drawables.push(drawable);
    } else {
        throw new GameException("invalid drawable object added.");
    }
    return drawables.length;
}

this.remove = function(item){
    for (var i = 0; i < drawables.length; ++i){
        if (drawables[i] === item){
            drawables.splice(i, 1);
            break;
        }
    }
    for (var i = 0; i < updateables.length; ++i){
        if (updateables[i] === item){
            updateables.splice(i, 1);
            break;
        }
    }
}


return this;

};

function Clear(color){

	if (typeof(color) != "undefined") {
		this.color = color;
	} else {
		this.color = null;
	}


    this.draw = function(context, timediff, timestamp) {
        
        var width = context.canvas.width;
        var height = context.canvas.height;
        context.setTransform(1, 0, 0, 1, 0, 0);        
		if (this.color == null){

	        context.clearRect(0, 0, width, height);

		} else {
            context.save();
			context.fillStyle = this.color;
			context.fillRect(0, 0, width, height);
            context.restore();
		}
        
    };
    
    return this;
};


var GLInput = {};
GLInput.keyboard = new (function (receiver) {
    this.keys = {};
    var keyProperty = 'key';
    this.getKeyProperty = function(){return keyProperty;};
    
    var self = this;

    receiver.addEventListener('keydown', function keyEventAnalyze (e){
        var backups = ['key', 'which', 'keyCode'];
        var prop = keyProperty;
        while(!e.hasOwnProperty(prop)){
            prop = backups.shift();
            if (backups.length == 0){
                //TODO: figure out what to do about this situation.
                break;
            }
        }
        keyProperty = prop;
        receiver.removeEventListener('keydown', keyEventAnalyze);
    });

    receiver.addEventListener('keydown', function(e){
        self.keys[e[keyProperty]] = true;
    });
    receiver.addEventListener('keyup', function(e){
        self.keys[e[keyProperty]] = false;
    });
    this.isKeyDown = function(value){
        return (self.keys[value])
    };
    this.isPushed = this.isKeyDown;
    this.anyKey = function(){
        for (var key in this.keys){
            if (this.keys[key]){ return true;}
        }
    };
    
})(document);
GLInput.mouse = new (function(){
    
    // if canvas size mismatches css/event size
    var vp_pixel_ratio_x = 1;
    var vp_pixel_ratio_y = 1;
    var getOffset = function(e){
        return {x: vp_pixel_ratio_x * e.offsetX, 
            y: vp_pixel_ratio_y * e.offsetY};
    };

    // browser compatibility section    
    document.addEventListener('mousemove', function mouseAnalyze(e){
        if (!('offsetX' in e)){
            getOffset = function (e){
                var x = e.clientX;
                var y = e.clientY;
                var bcr = e.target.getBoundingClientRect();
                return {x: vp_pixel_ratio_x * (x - bcr.left), 
                    y: vp_pixel_ratio_y * (y - bcr.top)};
            };
        }
        document.removeEventListener('mousemove', mouseAnalyze);
    });
    
    
    
    var viewport = null;
    this.position = {x: -1, y: -1};
    var tracking = false;
    var self = this;
    
    this.getPosition = function(){
        if (typeof(this.position.x) == "undefined"){
            var breakhere = true;
        }
        return this.position;
    };
    this.isTracking = function(){
        return tracking;
    };
    this.getIsWithinUI = function(region){
        return this.isTracking() && region.contains(this.getPosition());
    };
    
    
    var over = function(e){
        tracking = true;
    };
    var out = function (e){
        tracking = false;
        self.position = {x: -1, y: -1};
    };
    var move = function(e){
        if (self.isTracking()) {
            self.position = getOffset(e);
        }
    };
    var buttons = {};
    var down = function(e){
        if (tracking) {
            buttons[e.which] = true;
        }
    };
    var up = function(e){
        buttons[e.which] = false;
    };
    var click = function(e){
    };

    document.addEventListener('mouseup', up);
    document.addEventListener('mousedown', down);

    var wireEvents = function(){
        if (viewport !== null) {
            viewport.addEventListener('click', click);
            viewport.addEventListener('mouseover', over);
            viewport.addEventListener('mouseout', out);
            viewport.addEventListener('mousemove', move);
        }
    };
    var unwireEvents = function(){
        if (viewport !== null){
            viewport.removeEventListener('click', click);
            viewport.removeEventListener('mouseover', over);
            viewport.removeEventListener('mouseout', out);
            viewport.removeEventListener('mousemove', move);
        }
    };
    this.setViewPort = function(canvas){
        unwireEvents();
        viewport = canvas;
        vp_pixel_ratio_x = canvas.width / canvas.clientWidth;
        vp_pixel_ratio_y = canvas.height / canvas.clientHeight;
        wireEvents();
    };
    this.hasViewport = function(){
        return (viewport !== null);
    };
    this.isPushed = function(id){
        return ((id in buttons) && buttons[id]);
    };
    this.anyButton = function(){
        for (var b in buttons){
            if (buttons[b]){
                return true;
            }
        }
        return false;
    }

})();
GLInput.gamepad = new (function(nav, win, output){
    
    var gamepadNumber = null;
    var gamepadName = "";
    var axisCount = 0;
    var buttonCount = 0;
    win.addEventListener('gamepadconnected', function(e){
        
        GLInput.gamepad.update();
        GLInput.gamepad.onConnect(e);
        
    });
    win.addEventListener('gamepaddisconnected', function(e){
        //output.log("gamepad disconnected.", e);
        if (gamepadNumber == e.gamepad.index){
            gamepadNumber = null;
            gamepadName = "";
            axisCount = 0;
            buttonCount = 0;
        }
        GLInput.gamepad.onDisconnect(e);
    });
    
    this.exists = function(){
        return (typeof nav.getGamepads == "function" && this.hasGamepad());
    };

    var gamepads;
    this.update = function(){
        gamepads = nav.getGamepads();
        if (!this.hasGamepad()){
            for (var i = 0; i < gamepads.length; ++i){
                if (gamepads[i]){
                    gamepadNumber = i;
                    gamepadName = gamepads[i].id;
                    axisCount = gamepads[i].axes.length;
                    buttonCount = gamepads[i].buttons.length;
                }
            }
        }
    };
    this.hasGamepad = function(){
        return (gamepadNumber !== null && gamepads.hasOwnProperty(gamepadNumber));
    };
    this.getGamepad = function(){
        if (this.hasGamepad()){
            return gamepads[gamepadNumber];
        }
        return null;
    };
        
    this.getAxis = function(id){
        if (this.hasGamepad() && (id < axisCount)){
            return this.getGamepad().axes[id];
        }
        return 0;
    };
    this.isPushed = function(id){
        if (this.hasGamepad() && (id < buttonCount)){
            return this.getGamepad().buttons[id].pressed;
        }
        return false;
    };
    this.anyButton = function(){
        if (this.hasGamepad()){
            var gp = this.getGamepad();
            for (var i = 0; i < gp.buttons.length; ++i){
                if (gp.buttons[i].pressed){
                    return true;
                }
            }
        }
        return false;
    };
    var listeners = {
        'connect' : [],
        'disconnect': []
    };
    this.addListener = function(type, f, context){
        if (type == 'connect' || type == 'disconnect'){
            listeners[type].push({func: f, context: context});
        }
    };
    this.addListener('connect', function(e){
        this.log("gamepad connected.", e);
    }, output);
    this.addListener('disconnect', function(e){
        this.log("gamepad disconnected.", e);
    }, output);
    
    this.onConnect = function(e){
        for (var l in listeners.connect){
            var li = listeners.connect[l]; 
            li.func.call(li.context, e);
        }
    };
    this.onDisconnect = function(e){
        for (var l in listeners.disconnect){
            var li = listeners.disconnect[l];
            li.func.call(li.context, e);
        }
    };
    
    win.requestAnimationFrame(function runAnimation()
    {
        win.requestAnimationFrame(runAnimation);
        GLInput.gamepad.update();
    });
    
    
    
})(navigator, window, console);

GLInput.touch = new (function(nav, win, output){


    var getOffset = function (t){
        var x = t.clientX;
        var y = t.clientY;
        var bcr = t.target.getBoundingClientRect();
        return {x: Math.round(x - bcr.left), y: Math.round(y - bcr.top)};
    };
    
    this.exists = function(){
        return ('ontouchstart' in win);
    };

    // not really TouchList objects
    var touchList = [];

    this.getIsWithinUI = function(region){
        var result = false;
        for (var i = 0; i < touchList.length; ++i){
            if (region.contains(touchList[i].offset)){
                result = true;
                break;
            }
        }
        return result;
    };
    
    this.anyTouch = function(){
        return (!!touchList.length);
    };
    this.getTouchCount = function(){
        return touchList.length;
    };
    this.getFirstTouchPosition = function(){
        if (!this.anyTouch()){
            return {x: -1, y: -1};
        }
        return this.getPosition(touchList[0].identifier);
    };
    
    var start = function(e){
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; ++i) {
            // This inner loop should not be necessary.  
            // Implement it as an error to make certain.
            
            // Confirmed: not necessary to check against current touches
            //for (var j = 0; j < touchList.length; ++j) {
            //    if (touchList[j].identifier == touches[i].identifier){
            //        output.error('touchstart event with nonunique identifer.');
            //    }
            //}
            touches[i].offset = getOffset(touches[i]);
            touchList.push(touches[i]);
        }
    };
    var end = function(e){
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; ++i){
            for (var j = 0 ; j < touchList.length; ++j){
                if (touchList[j].identifier == touches[i].identifier){
                    touchList.splice(j, 1);
                    --j;
                }
            }
        }
    };
    var move = function(e){
        e.preventDefault();
        var touches = e.changedTouches;
        //trying the TouchList object API
        for (var i = 0; i < touches.length; ++i) {
            for (var j = 0; j < touchList.length; ++j) {
                if (touchList[j].identifier == touches[i].identifier) {
                    touchList[j].offset = getOffset(touches[i]);
                }
            }
        }
    };

    var wireEvents = function(){
        if (viewport !== null) {
            viewport.addEventListener('touchstart', start);
            viewport.addEventListener('touchend', end);
            viewport.addEventListener('touchmove', move);
        }
    };
    var unwireEvents = function(){
        if (viewport !== null){
            viewport.removeEventListener('touchstart', start);
            viewport.removeEventListener('touchend', end);
            viewport.removeEventListener('touchmove', move);
        }
    };
    // this seems correct...but not 100% sure
    win.addEventListener('touchend', end);

    var viewport = null;
    this.setViewPort = function(canvas){
        unwireEvents();
        viewport = canvas;
        wireEvents();
    };
    this.hasViewport = function(){
        return (viewport !== null);
    };

    var getTouch = function(id){
        for (var i = 0; i < touchList.length; ++i){
            if (touchList[i].identifier == id){
                return touchList[i];
            }
        }
        return null;
    };

    this.getPosition = function(id){
        var t = getTouch(id);
        if (t){ 
            return t.offset;
        }
        return {x: -1, y: -1};
    };
    this.isPushed = function(id){
        return (!!(getTouch(id)));
    };
    
})(navigator, window, console);

function UIRegion(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};
UIRegion.prototype.contains = function(o){
    return (
    (o.x > this.x) && (o.x < (this.x + this.w)) &&
    (o.y > this.y) && (o.y < (this.y + this.h))
    );
};
UIRegion.prototype.center = function(){
    return {x: this.x + this.w / 2, y: this.y + this.h / 2}
};

var Input = function(){
    var _inputs = {
        mouse : GLInput.mouse,
        keyboard : GLInput.keyboard,
        gamepad : GLInput.gamepad,
        touch : GLInput.touch
    };
    
    var axes = {};
    var buttons = {};
    var prevButtons = {};
    var currButtons = {};
    
    var UIList = {};
    var currUI = {};
    var prevUI = {};
    
    this.getPointer = function(){
        return _inputs.mouse;
    };
    
    this.setUI = function(id, region, buttons){
        if (!buttons){ buttons = []; }
        
        // validate region object
        if (typeof region.contains != "function"){
            throw ("invalid");
        }
        UIList[id] = {region: region, buttons: buttons};
    };
    this.removeUI = function(id){
        delete UIList[id];
        delete currUI[id];
        delete prevUI[id];
    };
    
    this.setAxisId = function(id, type, typeid, typeid2){
        if (!_inputs.hasOwnProperty(type)) return;
        axes[id] = {type: type, id: typeid, id2: typeid2};
    };
    this.setButtonId = function(id, type, typeid){
        if (!_inputs.hasOwnProperty(type)) return;
        buttons[id] = {type: type, id: typeid};
    };
    
    this.getAxis = function(id, frompos){
        var val = 0;
        var type = axes[id].type;
        switch (type){
            case ('mouse'):
            case ('touch'):    
                if (_inputs[type].isTracking(axes[id].id)){
                    var dir = _inputs[type].getPosition(axes[id].id);
                    var coord = axes[id].id;
                    var other = (coord == 'x') ? 'y' : 'x';
                    var unnormal = dir[coord] - frompos[coord];
                    var unsign = (unnormal < 0) ? -1 : 1;
                    var otherUnnormal = dir[other] - frompos[other];
                    var othersign = (otherUnnormal < 0) ? -1 : 1;
                    val = unsign * Math.sqrt(unnormal * unnormal / 
                        (unnormal * unnormal + otherUnnormal * otherUnnormal));
                }
                break;
            case ('keyboard'):
                var keyPos = axes[id].id;
                var keyNeg = axes[id].id2;
                if (_inputs.keyboard.isKeyDown(keyNeg)){
                    val -= 1; 
                }
                if (_inputs.keyboard.isKeyDown(keyPos)){
                    val += 1;
                }
                break;
            case ('gamepad'):
                val = _inputs.gamepad.getAxis(axes[id].id);
                break;
        }
        return val;
    };
    this.isButtonDown = function(id){
        return (currButtons.hasOwnProperty(id) && currButtons[id]);
    };
    this.newButtonPush = function(id){
        return (
            currButtons.hasOwnProperty(id) 
            && currButtons[id]
            && !prevButtons[id]
        );
    };
    
    this.isUIOver = function(id){
        return (currUI.hasOwnProperty(id) && currUI[id]);
    };
    
    this.isUIPush = function(id){
        
        // default false
        var result = false;
        // check that the element is being interacted with, and that the element has buttons
        if (currUI.hasOwnProperty(id) && UIList[id].buttons.length ){
            // iterate the element's buttons
            for (var b = 0; b < UIList[id].buttons.length; ++b){
                if (this.isButtonDown(UIList[id].buttons[b])){
                    // keyboard and gamepad are button-only,
                    // mouse and touch also require position
                    var type = buttons[UIList[id].buttons[b]].type; 
                    if (type == 'keyboard' || type == 'gamepad' ){
                        result = true;
                    } else if (type == 'mouse' || type == 'touch'){
                        result = this.isUIOver(id);
                    }
                    // stop iterating for any success
                    if (result) { break; }
                }
            }
        }
        
        return result;
    };
    
    
    this.anyPress = function(){
        return _inputs.keyboard.anyKey() || 
            _inputs.gamepad.anyButton() ||
            _inputs.mouse.anyButton() ||
            _inputs.touch.anyTouch();
    };
    this.has = function(type){
        switch (type){
            case 'keyboard':
                return true;
            case 'mouse':
                return true;
            case 'touch':
                return _inputs.touch.exists();
            case 'gamepad':
                return _inputs.gamepad.exists();
            default:
                return false;
        }
    };
    var getButtons = function(){
        
        for (var butt in buttons){
            prevButtons[butt] = currButtons[butt];
            currButtons[butt] = _inputs[buttons[butt].type].isPushed(buttons[butt].id);
        }
    };
    var getUI = function(){
        for (var id in UIList){
            prevUI[id] = currUI[id];
            currUI[id] = (
                _inputs['mouse'].getIsWithinUI(UIList[id].region)
                || _inputs['touch'].getIsWithinUI(UIList[id].region) 
            );
        }
    };
    
    this.update = function(context, timediff, timestamp){
        if (!_inputs.mouse.hasViewport()){
            _inputs.mouse.setViewPort(context.canvas);
        }
        if (!_inputs.touch.hasViewport()){
            _inputs.touch.setViewPort(context.canvas);
        }
        getButtons();
        getUI();
    };
    
    
    
};


/**
 * Tier 3: input objects used by games.
 * I am attempting to use GameInput as a prototype for some examples.
 */
var GameInput = function(){
    this.input = new Input();
    this.getInput = function(){ return this.input; };
};
GameInput.prototype.update = function(context, timediff, timestamp){
    this.getInput().update(context, timediff, timestamp);
};
GameInput.prototype.anyPress = function(){ 
    return this.getInput().anyPress(); 
};
GameInput.prototype.getPointer = function(){
    return this.getInput().getPointer().getPosition();
};

// placeholder 
var nullInput = function() {
    this.getX = function() {
        return 0;
    };
    this.getY = function() {
        return 0;
    };
    this.isShooting = function(){
        return false;
    };
    this.update = function(context, timediff, timestamp){
        return;
    };
}


var MenuInput = function(){
    var menuMoveTime = 0;
    this.canMove = function (timediff){
        menuMoveTime -= timediff;
        menuMoveTime = Math.max(menuMoveTime, 0);
        return (menuMoveTime <= 0);
    };
    this.menuMove = function(time){
        menuMoveTime += time;
    };
    this.menuThreshold = 0.75;
    this.menuDelay = 300;
    
    this._up = false;
    this._down = false;
    this._select = false;

    this.getInput().setAxisId('menuupdown', 'keyboard', 40, 38);
    this.getInput().setAxisId('menuupdown2', 'gamepad', 1);
    this.getInput().setAxisId('menuupdown3', 'gamepad', 3);
    this.getInput().setAxisId('menuupdown4', 'gamepad', 5);
    
    this.getInput().setButtonId('menuselect1', 'keyboard', 13);
    this.getInput().setButtonId('menuselect2', 'keyboard', 32);
    this.getInput().setButtonId('menuselect3', 'gamepad', 0);
    this.getInput().setButtonId('menuclick', 'mouse', 1);
    
    this.getInput().setButtonId('menuback1', 'keyboard', 27);
    this.getInput().setButtonId('menuback2', 'gamepad', 1);
    
};
MenuInput.prototype = new GameInput();
MenuInput.constructor = MenuInput;

MenuInput.prototype.update = function(context, timediff, timestamp){
    GameInput.prototype.update.call(this, context, timediff, timestamp);
    this.menuUpdate(timediff);
};
MenuInput.prototype.menuUpdate = function(timediff){

    if (!this.canMove(timediff)){
        this._down = false;
        this._up = false;
        this._select = false;
        return;
    }
    if (this.getInput().newButtonPush('menuselect1') ||
        this.getInput().newButtonPush('menuselect2') ||
        this.getInput().newButtonPush('menuselect3') 
    ){
        this.menuMove(this.menuDelay);
        this._select = true;
    } else {
        this._select = false;
    }
    var menuupdown = 
        this.getInput().getAxis('menuupdown') +
        this.getInput().getAxis('menuupdown2') +
        this.getInput().getAxis('menuupdown3') +
        this.getInput().getAxis('menuupdown4');    
    
    if (menuupdown >= this.menuThreshold){
        this._down = true;
        this.menuMove(this.menuDelay);
    } else {
        this._down = false;
    }
    if (menuupdown <= (-1 * this.menuThreshold)){
        this._up = true;
        this.menuMove(this.menuDelay);
    } else {
        this._up = false;
    }
};
MenuInput.prototype.menuDown = function(){
    return this._down;
};
MenuInput.prototype.menuUp = function(){
    return this._up;
};
MenuInput.prototype.menuSelect = function(){
    return this._select;
};
MenuInput.prototype.menuClick = function(){
    return this.getInput().newButtonPush('menuclick');
};
MenuInput.prototype.menuBack = function(){
    return this.getInput().newButtonPush('menuback1') ||
        this.getInput().newButtonPush('menuback2');
}

var Camera = function(){
    var _position;
    var _zoom;
    this.debug = false;
    this.lerpRate = 0.07;
    this.position = _position = {x: 0, y: 0};
    this.offset = {x: 0, y: 0};
    this.zoom = _zoom = 1;

    this.update = function(context, timediff, timestamp) {

        _zoom += (this.zoom - _zoom) * this.lerpRate;
        _position.x += (this.position.x - _position.x) * this.lerpRate;
        _position.y += (this.position.y - _position.y) * this.lerpRate;

        if (Math.abs(this.zoom - _zoom) < 0.001){
            _zoom = this.zoom;
        }
        if (Math.abs(this.position.x - _position.x) < 0.001){
            _position.x = this.position.x;
        }
        if (Math.abs(this.position.y - _position.y) < 0.001){
            _position.y = this.position.y;
        }

        if (this.debug) {
            this.updateDebug(context, timediff, timestamp);
        }

        // set transform outside of draw, because otherwise automatic 
        // context save and restore will wipe out the change.
        this.offset = {
            x: context.canvas.width / 2  - (_position.x * _zoom),
            y: context.canvas.height / 2  - (_position.y * _zoom)
        };

        context.setTransform(_zoom, 0, 0, _zoom, this.offset.x, this.offset.y);
    };

    this.getWorldCoords = function(viewX, viewY){
        // inverse of offset calc in update()
        return {
            x: (viewX - this.offset.x) / _zoom,
            y: (viewY - this.offset.y) / _zoom
        };
    };
    this.updateDebug = function(context, timediff, timestamp) {

        this.cursorx = this.cursorx || 0;
        this.cursory = this.cursory || 0;


        if (GLInput.keyboard.isKeyDown(38)) {
            this.position.y -= 10;
        }
        if (GLInput.keyboard.isKeyDown(40)) {
            this.position.y += 10;
        }

        if (GLInput.keyboard.isKeyDown(49)) { // 1
            this.cursorx -= 5;
        }
        if (GLInput.keyboard.isKeyDown(50)) { // 2
            this.cursorx += 5;
        }
        if (GLInput.keyboard.isKeyDown(51)) { // 3
            this.cursory -= 5;
        }
        if (GLInput.keyboard.isKeyDown(52)) { // 4
            this.cursory += 5;
        }


        if (GLInput.mouse.isPushed(2)){
            var p = GLInput.mouse.position;
            var pp = this.getWorldCoords(p.x, p.y, context.canvas);
            this.cursorx = pp.x;
            this.cursory = pp.y;
            console.log(pp);
        }


        if (GLInput.keyboard.isKeyDown(38)) { // up arrow
            this.position.y -= 10;
        }
        if (GLInput.keyboard.isKeyDown(40)) { // down arrow
            this.position.y += 10;
        }
        if (GLInput.keyboard.isKeyDown(37)) { // left arrow
            this.position.x -= 10;
        }
        if (GLInput.keyboard.isKeyDown(39)) { // right arrow
            this.position.x += 10;
        }
        if (GLInput.keyboard.isKeyDown(189)) { // -/_ 
            this.zoom /= 1.02;
        }
        if (GLInput.keyboard.isKeyDown(187)) { // +/=
            this.zoom *= 1.02;
        }

        if (GLInput.keyboard.isKeyDown(67)){
            this.tracking = false;
        }
        if (GLInput.keyboard.isKeyDown(86)){
            this.tracking = true;
        }
    };

    this.draw = function(context, timediff, timestamp) {
        if (this.debug){
            this.drawDebug(context, timediff, timestamp);
        }
    };
    this.drawDebug = function(context, timediff, timestamp) {

        context.fillStyle = "yellow";
        context.fillRect(0, 0, 100, 1);
        context.fillStyle = "purple";
        context.fillRect(0, 0, 1, 100);


        context.fillStyle = "brown";
        context.fillRect(this.cursorx, this.cursory, 100, 1);
        context.fillStyle = "darkgreen";
        context.fillRect(this.cursorx, this.cursory, 1, 100);

        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = "rgba(255, 255, 255, 0.5)";
        context.font = "bold 16px arial";
        var pos_text = ' x: ' + GLInput.mouse.position.x.toFixed(1) +
            ', y: ' + GLInput.mouse.position.y.toFixed(1) + ' ';
        var text_width = context.measureText(pos_text).width;
        if (text_width > (canvas.width - 20 - GLInput.mouse.position.x)){
            context.textAlign = 'right';
        } else {
            context.textAlign = 'left';
        }
        if (GLInput.mouse.position.y < 20){
            context.textBaseline = 'top';
        }
        context.fillText(
            pos_text,
            GLInput.mouse.position.x,
            GLInput.mouse.position.y);

        context.fillRect(
            GLInput.mouse.position.x,
            GLInput.mouse.position.y,
            -50,
            1);
        context.fillRect(
            GLInput.mouse.position.x,
            GLInput.mouse.position.y,
            1,
            -50);
        context.restore();

        context.fillStyle = "yellow";
        context.fillRect(context.canvas.width / -2, context.canvas.height / -2, 100, 1);
        context.fillStyle = "purple";
        context.fillRect(context.canvas.width / -2, context.canvas.height / -2, 1, 100);
    };

};
var TrackingCamera = function(){
    
    this.tracking = true;
    this.baseViewables = [];
    
    this.trackViewables = function(context){

        if (!this.tracking) { return; }
        // find the minimum rectangle that will enclose the viewables

        var PADDING = 50;

        var xMin = 0;
        var xMax = 0;
        var yMin = 0;
        var yMax = 0;
        var bounds = function(obj) {
            var pos = obj.getCoords();
            xMin = Math.min(xMin, pos.x);
            xMax = Math.max(xMax, pos.x);
            yMin = Math.min(yMin, pos.y);
            yMax = Math.max(yMax, pos.y);
        };

        this.baseViewables.forEach(bounds);
        this.viewables.forEach(bounds);

        // pad the rectangle.  Vary with zoom?
        xMin -= PADDING;
        xMax += PADDING;
        yMin -= PADDING;
        yMax += PADDING;

        // get size and center
        var height = yMax - yMin;
        var centerY = (yMax + yMin) / 2;
        var width = xMax - xMin;
        var centerX = (xMax + xMin) / 2;
        var scale = 1;

        //determine whether height- or width-limited
        var cs = {x: context.canvas.width, y: context.canvas.height};
        if (width < ((cs.x / cs.y) * height)){
            scale = ((height) / cs.y);
        } else {
            scale = ((width) / cs.x);
        }

        // to fit the viewport
        this.zoom = 1 / scale;
        this.position = {x: centerX, y: centerY};

    };

    var trackable = function(x, y){
        this.x = x;
        this.y = y;
    };
    trackable.prototype.getCoords = function(){
        return {x: this.x, y: this.y};
    };
    this.makeTrackable = function(x, y){
        return new trackable(x, y);
    };

    this.viewables = [];

    this.update = function(context, timestamp, timediff) {
        this.trackViewables(context);
        TrackingCamera.prototype.update.call(this, context, timestamp, timediff);
    };
};
TrackingCamera.prototype = new Camera();
var ParticleType = function(options){
    var defaults = {
        fillStyle: "white",
        duration: 1,
        accel: {x: 0, y: 100},
        velocity: {x: 0, y: 0}
    };
    for (var prop in options){
        defaults[prop] = options[prop];
    }
    for (var prop in defaults){
        
        this[prop] = defaults[prop];
    }
    
};
ParticleType.prototype.draw = function(context){
    context.save();
    context.fillStyle = this.fillStyle;

    var xMod = this.velocity.x * this.time + 
        0.5 * this.accel.y * this.time * this.time;
    
    var yMod = this.velocity.y * this.time +
        0.5 * this.accel.y * this.time * this.time;
        
    context.translate(
        this.position.x + xMod,
        this.position.y + yMod
    );

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(3, 0);
    context.lineTo(0, 3);
    context.closePath();
    context.fill();
    context.restore();
};
ParticleType.prototype.reset = function(){
    this.position = {x:0, y: 0};
    this.time = 0 ;

};
ParticleType.prototype.make = function(){
    var p = Object.create(this);
    p.reset();
    return p;
};

var ParticleSystem = function(particleType){
    
    this.type = particleType;
    
    if (!(this instanceof ParticleSystem)){
        return new ParticleSystem();
    }
    this.pool = [];
    this.activeCount = 0;
    
};

ParticleSystem.prototype.add = function(pos){
    if (this.pool.length == this.activeCount){
        this.pool.push(this.type.make());
    } else {
        this.pool[this.activeCount].reset();
    }
    this.pool[this.activeCount].position = pos;
    this.activeCount++;
};

ParticleSystem.prototype.update = function(context, timediff, timestamp){
    var temp;
    for (var i = 0; i < this.activeCount; ++i){
        this.pool[i].time += (timediff / 1000);
        if (this.pool[i].time > this.type.duration){
            temp = this.pool[i];
            this.pool[i] = this.pool[this.activeCount - 1];
            this.pool[this.activeCount - 1] = temp;
            --this.activeCount;
            --i;
        }
    }
};

ParticleSystem.prototype.draw = function(context, timediff, tiemstamp){
    for (var i = 0; i < this.activeCount; ++i){
        this.pool[i].draw(context);
    }
};
var PaddleInput = function(upCode, downCode, hitCode, boostCode){
    this.input = new Input();
    this.getInput().setButtonId('up', 'keyboard', upCode);
    this.getInput().setButtonId('down', 'keyboard', downCode);
    this.getInput().setButtonId('hit', 'keyboard', hitCode);
    this.getInput().setButtonId('boost', 'keyboard', boostCode);
};
PaddleInput.prototype = new GameInput();
PaddleInput.prototype.movingUp = function(){
    return (this.getInput().isButtonDown('up'));
};
PaddleInput.prototype.movingDown = function(){
    return this.getInput().isButtonDown('down');
};
PaddleInput.prototype.boosting = function(){
    return this.getInput().isButtonDown('boost');
};
PaddleInput.prototype.hit = function(){
    return this.getInput().newButtonPush('hit');
};
var Rail = function(bottom, top, dir){
    this.bot = bottom;
    this.top = top;
    this.dir = dir;
};
Rail.prototype.getCoords = function(pos){
    return {
        x: (-1 * pos / (this.top.y - this.bot.y)) * (this.top.x - this.bot.x) + this.bot.x,
        y: (-1 * pos / (this.top.y - this.bot.y)) * (this.top.y - this.bot.y) + this.bot.y
    }
};
Rail.prototype.ballScores = function(pos){
    // cross product of 2d: z = x1*y2 - y1*x2
    // assume straight rails
    var a = {x: this.top.x - this.bot.x, y: this.top.y - this.bot.y};
    var b = {x: 20 * this.dir.x + pos.x - this.bot.x, y: pos.y - this.bot.y};
    return (( this.dir.x * (a.x * b.y - b.x * a.y)) < 0);
};
Rail.prototype.limitPosition = function(position){
    // positive position yields negative y-coordinate
    return Math.min(Math.max(position, 0), this.bot.y - this.top.y);
};

var Paddle = function(rail, input, ball, color){
    if (!(this instanceof Paddle)){
        return new Paddle(rail, color);
    }
    this.rail = rail;
    this.input = input;
    this.ball = ball;
    this.color = color;
    this.speed = 200;
    this.railPosition = 50;
    this.length = 60;
    this.thickness = 12;
    this.state = 'ready';
    this.nextSwing = 'forehand';
    this.hasHit = false;
    this.facing = 1;
    this.angle = 45;
    this.swingSpeed = 250;
    if (rail.dir.x < 1){
        this.facing = -1;
    }
    
    this.debug = {lines: []};
    
    this.initParticleSystem();
    
    
    return this;
};
Paddle.prototype.initParticleSystem = function(){
        
    var particle = new ParticleType({accel: {x: 0, y: 0}});
    particle.reset = function(){
        this.velocity = {
            x: Math.random() * 30 - 15,
            y: Math.random() * 30 - 15
        };
        //this.fillStyle = ['blue', 'yellow', 'green'][Math.floor(Math.random() * 3)];
        this.time = Math.random() / 10 - 0.05;
    };
    particle.getGradient = function(context){
        if (!this.gradient){
            var start = -10;
            var end = 10;
            var grd = context.createLinearGradient(start, 0, end, 0);
            grd.addColorStop(0, 'yellow');
            grd.addColorStop(0.3, 'orange');
            grd.addColorStop(0.8, 'gray');
            grd.addColorStop(1, 'rgba(0,0,0,0)');
            this.gradient = grd;

        }
        return this.gradient;
    };
    particle.draw = function(context){


        context.save();
        context.fillStyle = this.getGradient(context);

        var xMod = this.velocity.x * this.time +
            0.5 * this.accel.y * this.time * this.time;

        var yMod = this.velocity.y * this.time +
            0.5 * this.accel.y * this.time * this.time;

        var gradientMod = 20 * (this.time) - 10;

        context.translate(
            this.position.x + xMod - gradientMod,
            this.position.y + yMod
        );

        context.beginPath();
        context.moveTo(gradientMod, 0);
        context.lineTo(gradientMod + 3, 0);
        context.lineTo(gradientMod, 3);
        context.closePath();
        context.fill();
        context.restore();


    };
    this.particles = new ParticleSystem(particle);
};


Paddle.prototype.reset = function(){
    this.railPosition = 50;
    this.angle = 45;
    this.nextSwing = 'forehand';
    this.hasHit = false;
    this.state = 'ready';
};

Paddle.prototype.getCoords = function(){
    return this.rail.getCoords(this.railPosition);
};
Paddle.prototype.update = function(context, timediff, timestamp) {
    this.input.update(context, timediff, timestamp);
    this.particles.update(context, timediff, timestamp);
    switch (this.state){
        case 'backhand':
            this.updateReady(context, timediff, timestamp);
            this.updateMove(timediff);
            this.updateBackhand(context, timediff, timestamp);
            this.updateHitBall(context);
            break;
        case 'forehand':
            this.updateReady(context, timediff, timestamp);
            this.updateMove(timediff);
            this.updateForehand(context, timediff, timestamp);
            this.updateHitBall(context);
            break;
        case 'ready':
        default:
            this.updateMove(timediff);
            this.updateReady(context, timediff, timestamp);
            break;
    }
};
Paddle.prototype.updateMove = function(timediff){
    var mult = this.input.boosting() ? 5 : 1;
    if (this.input.movingUp()){
        this.move(mult * this.speed * timediff / 1000);
    } else if (this.input.movingDown()){
        this.move(mult * this.speed * timediff / -1000);
    }
};
Paddle.prototype.updateBackhand = function(context, timediff, timestamp) {
    this.angle -= this.swingSpeed * timediff / 1000;
    if (this.angle < 45) {
        this.angle = 45;
        this.state = 'ready';
        this.hasHit = false;
    }
};
Paddle.prototype.updateForehand = function(context, timediff, timestamp) {
    this.angle += this.swingSpeed * timediff / 1000;
    if (this.angle > 315) {
        this.angle = 315;
        this.state = 'ready';
        this.hasHit = false;
    }
};
Paddle.prototype.updateHitBall = function(context, timediff){

    if (this.hasHit){ return; } // avoid double-hitting
    
    var coords = this.getCoords();
    var trig = this.getTrig();
    
    this.debug.lines = [];
    
    var toBall = {
        x: this.ball.position.x - coords.x,
        y: this.ball.position.y - coords.y
    };
    
    // from paddle line to ball (point-line distance)
    var toBallDist = trig.normal.x * toBall.x + trig.normal.y * toBall.y;
    var ballNearestPoint = {
        x: this.ball.position.x - trig.normal.x * toBallDist,
        y: this.ball.position.y - trig.normal.y * toBallDist
    };

    //from paddle fulcrum to point-line vector intersection
    var toBallLateral = {
        x: ballNearestPoint.x - coords.x,
        y: ballNearestPoint.y - coords.y
    };
    var pointDistSqr = (Math.pow(toBallLateral.x, 2) + Math.pow(toBallLateral.y, 2)); 
    
    if (
        // direction of nearest point must be with PI/2 of paddle direction (positive dot product)
        (((ballNearestPoint.x - coords.x) * trig.x +
        (ballNearestPoint.y - coords.y) * trig.y) > 0) &&
        
        // ball must be directly on paddle line
        (Math.abs(toBallDist) < (this.ball.radius + 0.5 * this.thickness)) &&
        
        // ball must be within the length of the paddle
        (pointDistSqr < Math.pow(this.length, 2))
    ) {
        this.hasHit = true;
        
        var paddleSpeed = this.swingSpeed * Math.PI / 180 / 4;
        var paddleSpeedPartial = paddleSpeed * (Math.sqrt(pointDistSqr) / this.length);
        var paddleV = {
            x: trig.normal.x * paddleSpeedPartial,
            y: trig.normal.y * paddleSpeedPartial
        };
        
        var relativeNormalSpeed = Math.abs(paddleV.x - this.ball.velocity.x) + 
            Math.abs(paddleV.y - this.ball.velocity.y);
        
        var x = 0.2;

        this.ball.velocity.x += (2 - x) * relativeNormalSpeed * trig.normal.x;
        this.ball.velocity.y += (2 - x) * relativeNormalSpeed * trig.normal.y;
    }
    
    
};
Paddle.prototype.updateReady = function(context, timediff, timestamp) {
    if (this.input.hit()){
        this.state = this.nextSwing;
        if (this.nextSwing == 'forehand'){
            this.nextSwing = 'backhand';
        } else {
            this.nextSwing = 'forehand';
        }
    }
};
Paddle.prototype.move = function(dist){
    this.railPosition += dist;
    this.railPosition = this.rail.limitPosition(this.railPosition);
    var pos = this.getCoords();
    var xMod, yMod;
    for (var i = 0; i < 10; ++i) {
        xMod = Math.floor(Math.random() * 4) - 2;
        yMod = Math.floor(Math.random() * 4) - 2;
        this.particles.add({x: pos.x + xMod, y: pos.y + yMod});
    }
    
};
Paddle.prototype.getTrig = function(){
    //depends on paddle face direction and swing direction 
    
    var angle = this.angle * Math.PI / 180;
    var x = Math.cos(angle);
    var y = -1 * Math.sin(angle);
    var scale = {x: 1, y: 1};
    var normal = {x: y, y: -1 * x};
    if (this.facing == 1){
        x *= -1;
        normal = {x: -1 * y, y: x};
        scale.x *= -1;
    }
    if (this.state == 'backhand'){
        normal.x *= -1;
        normal.y *= -1;
    }
    
    return {x: x, y: y, normal: normal, angle: angle, scale: scale};
};
Paddle.prototype.draw = function(context, timediff, timestamp){
    this.particles.draw(context, timediff, timestamp);
    context.save();
    var coords = this.getCoords();
    var trig = this.getTrig();
    
    context.translate(coords.x, coords.y);
    context.scale(trig.scale.x, trig.scale.y);
    context.rotate(-1 * trig.angle);

    // no absoluteness here
    //context.setTransform(trig.cos, trig.sin, -1 * trig.sin, trig.cos, coords.x, coords.y);
    context.fillStyle = this.color;
    context.fillRect(-0.5 * this.thickness, -6, this.length, this.thickness);

    context.restore();
    
    for (var i = 0; i < this.debug.lines.length; ++i) {
        
        context.save();
        context.strokeStyle = this.debug.lines[i].style; 
        context.beginPath();
        context.moveTo(this.debug.lines[i].x1, this.debug.lines[i].y1);
        context.lineTo(this.debug.lines[i].x2, this.debug.lines[i].y2);
        context.closePath();
        context.stroke();
        
        context.restore();
    }
};

function debugLine(context, x1, y1, x2, y2, color){
    return {
        style: getGradient(context, x1, y1, x2, y2, '#333', color),
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    }
}

function getGradient(context, x1, y1, x2, y2, color1, color2){
    var linearGradient = context.createLinearGradient(x1, y1, x2, y2);
    linearGradient.addColorStop(0, color1);
    linearGradient.addColorStop(1, color2);
    return linearGradient;
}
(function(global, io, doc){
    var canvas;
    global.canvas = canvas = doc.getElementById('game');
    canvas.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
    });
    var loop = new GameLoop(canvas);
    GLInput.mouse.setViewPort(canvas);
    
    var camera = new TrackingCamera();
    camera.baseViewables.push(new camera.makeTrackable(0, 175));  //center of arena floor
    camera.baseViewables.push(new camera.makeTrackable(0, -225));  // minimum height
    
    var FLOOR = 150;
    
    var Ball = function(position){
        this.gravity = 2;
        this.radius = 10;
        this.color = 'red';
        this.position = position;
        this.velocity = {x: 0, y: 0};
    };
    
    Ball.prototype.update = function(context, timediff, timestamp) {
        this.velocity.y += this.gravity * timediff / 1000;

        // DEBUG STUFF
        //if (GLInput.keyboard.isKeyDown(90)){
        //    this.gravity = 0;
        //}
        //if (GLInput.keyboard.isKeyDown(88)){
        //    this.gravity = 2;
        //}
        //if (GLInput.mouse.isPushed(1)){
        //    this.velocity = {x: 0, y: 0};
        //    var p = GLInput.mouse.position;
        //    this.position = camera.getWorldCoords(p.x, p.y, context.canvas);
        //    
        //}


        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y > (FLOOR - this.radius)){
            this.position.y = FLOOR - this.radius;
            this.velocity.y *= -0.9;
        }

    };
    
    Ball.prototype.getCoords = function(){
        var lead = 10;
        return {
            x: this.position.x + this.velocity.x * lead,
            y: this.position.y + this.velocity.y * lead
        };
    };
    
    Ball.prototype.draw = function(context, timediff, timestamp){
        context.save();
        context.fillStyle = this.color;
        context.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );
        context.fill();

        if (this.position.y < -1 * this.radius){
            if (Math.floor(timestamp * 0.004) % 2){
                //TODO: adjust for camera differences
                //context.beginPath();
                //context.moveTo(this.position.x, 0);
                //context.lineTo(this.position.x - this.radius, this.radius);
                //context.lineTo(this.position.x + this.radius, this.radius);
                //context.closePath();
                //context.fill();
            }
        }
        
        context.restore();
    };

    var trackOne = new Rail({x: -300, y: FLOOR},{x: -800, y: FLOOR - 2000}, {x: 5, y: -2});
    var trackTwo = new Rail({x: 300, y: FLOOR},{x: 800, y: FLOOR - 2000}, {x: -5, y: -2});

    var inputOne = new PaddleInput(87, 83, 68, 16);
    var inputTwo = new PaddleInput(38, 40, 37, 39);

    var paddleOne = new Paddle(trackOne, inputOne, null, 'limegreen');
    var paddleTwo = new Paddle(trackTwo, inputTwo, null, 'white');
    
    var gameState = {
        players: [paddleOne, paddleTwo],
        server: Math.round(Math.random()),
        scores: [0, 0],
        state: 'intro',
        stateTemp: {timer: 0, alt: false},
        input: (function(){
            var i = new GameInput();
            i.getInput().setButtonId('help', 'keyboard', 27);  // escape key
            i.help = function(){
                return this.getInput().newButtonPush('help');
            };
            return i;
        })(),
        ball: null,
        getServer: function(){
            return this.players[this.server];
        },
        update: function(context, timediff, timestamp){
            this.input.update(context, timediff, timestamp);
            if (this.input.help()){
                if (this.state == 'help') {
                    this.state = this.prevState;
                    delete this.prevState;
                } else {
                    this.prevState = this.state;
                    this.state = 'help';
                }
            }
            switch (this.state){
                case 'intro':
                    if (this.input.anyPress()){
                        this.stateTemp = {timer: 3};
                        this.state = 'roundstart';
                    }
                    this.stateTemp.timer -= timediff / 1000;
                    if (this.stateTemp.timer < 0){
                        this.stateTemp.timer = 0.5;
                        this.stateTemp.alt = !this.stateTemp.alt;
                    }
                    break;
                case 'help':
                    break;
                case 'roundstart':
                    this.stateTemp.timer -= timediff / 1000;
                    if (this.stateTemp.timer < -1) {
                        this.setServe();
                    }
                    break;
                case 'serve':
                    this.updatePlayers(context, timediff, timestamp);
                    this.stateTemp.timer -= timediff / 1000;
                    if (this.stateTemp.timer < 0){
                        this.state = 'play';
                        this.stateTemp.timer = 0;
                    }
                    break;
                case 'play':
                    this.updatePlayers(context, timediff, timestamp);
                    this.updateBall(context, timediff, timestamp);
                    this.stateTemp.timer += timediff / 1000;
                    break;
                case 'goal':
                    this.stateTemp.timer -= timediff / 1000;
                    if (this.stateTemp.timer < 0){
                        this.setServe();
                    }
                    break;
                default:
                    debugger;
                    break;
                    
            }
        },
        updatePlayers: function(context, timediff, timestamp){
            for (var i = 0; i < this.players.length; ++i){
                this.players[i].update(context, timediff, timestamp);
            }
        },
        updateBall: function(context, timediff, timestamp){
            this.ball.update(context, timediff, timestamp);
            if (this.players[0].rail.ballScores(this.ball.position)){
                this.setGoal(1);
            } else if (this.players[1].rail.ballScores(this.ball.position)){
                this.setGoal(0);
            }
        },
        setGoal: function(playerIndex){

            this.state = 'goal';
            this.scores[playerIndex]++;
            this.server = playerIndex;
            this.stateTemp = {scorer: playerIndex, timer: 2};
        },
        setServe: function(){
            for (var i = 0; i < this.players.length; ++i){
                this.players[i].reset();
            }
            
            
            this.state = 'serve';
            this.stateTemp = {timer: 1};
            var ballPos = this.getServer().getCoords();
            ballPos.y -= 150;
            ballPos.x += this.getServer().facing * 20;
            this.ball = new Ball(ballPos);

            camera.zoom = 1;
            camera.position = { x: 0, y: 0};
            camera.viewables = [
                this.ball,
                this.players[0],
                this.players[1]
            ];

            for (var j = 0; j < this.players.length; ++j){
                this.players[j].ball = this.ball;
                
            }
        },
        draw: function(context, timediff, timestamp){
            switch (this.state){
                case 'intro':
                    this.drawIntro(context);
                    break;
                case 'help':
                    this.drawHelp(context);
                    break;
                case 'roundstart':
                    this.drawArena(context);
                    this.drawPlayers(context);
                    this.drawCountdown(context);
                    if (this.stateTemp < 0){
                        this.drawBall(context);
                    }
                    break;
                case 'serve':
                    this.drawArena(context);
                    this.drawPlayers(context);
                    this.blinkBall(context, timediff, timestamp);
                    break;
                case 'play':
                    this.drawArena(context);
                    this.drawPlayers(context);
                    this.drawBall(context, timediff, timestamp);
                    break;
                case 'goal':
                    this.drawArena(context);
                    this.drawPlayers(context);
                    this.drawBall(context, timediff, timestamp);
                    this.drawGoal(context);
                    break;
                default:
                    debugger;
                    break;
            }
        },
        drawIntro: function(context){
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.fillStyle = 'deeppink';
            context.strokeStyle = 'deepskyblue';
            context.strokeWidth = 2;
            context.font = "bolder oblique 72px arial";
            context.textAlign = "left";
            context.textBaseline = "top";
            context.shadowOffsetX = 1;
            context.shadowOffsetY = 1;
            context.shadowColor = "white";
            context.shadowBlur = 1;
            context.fillText('RADminton', 200, 100);
            context.strokeText('RADminton', 200, 100);


            context.font = "bolder oblique 32px arial";
            
            if (this.stateTemp.alt){
                context.fillStyle = 'deepskyblue';
                context.strokeStyle = 'deeppink';
            } else {
                context.fillStyle = 'deeppink';
                context.strokeStyle = 'deepskyblue';
            }
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowColor = "white";
            context.shadowBlur = 0;
            
            context.fillText('Press any key', 300, 200);
            context.strokeText('Press any key', 300, 200);
            
            context.restore();
        },
        drawHelp: function(context){
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.fillStyle = 'deeppink';
            context.strokeStyle = 'deepskyblue';
            context.textBaseline = "top";
            context.font = "bolder oblique 48px arial";
            context.strokeWidth = 2;
            context.textAlign = "center";


            context.fillText('How to Play:', 400, 50);
            context.strokeText('How to Play:', 400, 50);
            context.font = "bolder oblique 24px arial";
            context.fillText('Move up and down.', 400, 100);
            context.fillText('Swing to hit the ball.', 400, 130);
            
            var self = this;
            var controlChunk = function(anchorx, anchory, player, controls){
                context.font = "bolder oblique 24px arial";
                context.fillStyle = 'deeppink';
                context.textAlign = "left";
                context.fillText("up:", anchorx, anchory + 40);
                context.fillText("down:", anchorx, anchory + 65);
                context.fillText("swing:", anchorx, anchory + 90);
                context.fillText("boost:", anchorx, anchory + 115);

                context.textAlign = "right";
                context.fillText(controls[0], anchorx + 200, anchory + 40);
                context.fillText(controls[1], anchorx + 200, anchory + 65);
                context.fillText(controls[2], anchorx + 200, anchory + 90);
                context.fillText(controls[3], anchorx + 200, anchory + 115);

                context.textAlign = "left";
                context.font = "bolder oblique 36px arial";
                context.fillStyle = self.players[player].color;
                context.fillText("Player " + (player + 1), anchorx, anchory);
            };
            
            controlChunk(80, 200, 0, [
                'w', 's', 'd', 'L shift'    
            ]);
            controlChunk(525, 200, 1, [
                'up', 'down', 'left', 'R control'
            ]);
            
            
            
            context.restore();
        },
        drawArena:function(context){
            context.fillStyle = "deeppink";
            context.strokeStyle = "deepskyblue";
            context.lineWidth = 3;

            context.fillRect(-350, FLOOR, 700, 10);
            context.beginPath();
            context.moveTo(trackTwo.bot.x, trackTwo.bot.y);
            context.lineTo(trackTwo.top.x, trackTwo.top.y);
            context.moveTo(trackOne.bot.x, trackOne.bot.y);
            context.lineTo(trackOne.top.x, trackOne.top.y);
            context.closePath();
            context.stroke();
        },
        drawPlayers: function(context){
            
            for (var i = 0; i < this.players.length; ++i){
                this.players[i].draw(context);
            }

            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.fillStyle = 'deeppink';
            context.strokeStyle = 'deepskyblue';
            context.strokeWidth = 1;
            context.font = "bolder oblique 24px arial";
            context.textBaseline = "bottom";
            
            context.textAlign = "left";
            context.fillText(this.scores[0], 20, 445);
            context.strokeText(this.scores[0], 20, 445);

            context.textAlign = "right";
            context.fillText(this.scores[1], 780, 445);
            context.strokeText(this.scores[1], 780, 445);
            
            context.restore();

        },
        blinkBall: function(context, timediff, timestamp) {
            var on = Math.floor(this.stateTemp.timer * 4) % 2;
            if (on){
                this.drawBall(context, timediff, timestamp);
            }
        },
        drawBall: function(context, timediff, timestamp){
            if (this.ball){
                this.ball.draw(context, timediff, timestamp);
            }
            
        },
        drawCountdown: function(context){
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.fillStyle = 'deeppink';
            context.strokeStyle = 'deepskyblue';
            context.strokeWidth = 1;
            context.font = "bolder oblique 48px arial";
            context.textAlign = "center";
            context.fillText('GET READY!', 400, 100);
            context.strokeText('GET READY!', 400, 100);
            
            context.font = "bolder oblique 18px arial";
            context.fillText('press ESC for help', 400, 135);
            //context.strokeText('press ESC for instructions', 400, 150);

            context.font = "bolder oblique 72px arial";
            var number = Math.ceil(this.stateTemp.timer);
            if (number == 0){ number = 'GO!';}
            
            context.fillText(number, 400, 200);
            context.strokeText(number, 400, 200);
            
            context.restore();
        },
        drawGoal: function(context){
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.fillStyle = 'deeppink';
            context.strokeStyle = 'deepskyblue';
            context.strokeWidth = 0.5;
            context.font = "bolder oblique 48px arial";
            context.textAlign = "center";
            var goalString = 'Goal Player ' + (this.server + 1) + '!';
            context.fillText(goalString, 400, 100);
            context.strokeText(goalString, 400, 100);
            context.restore();
        }
    };
    loop.addItem(new Clear('black'));
    loop.addItem(camera);
    loop.addItem(gameState);

    global.camera = camera;
    global.ball = gameState.ball;
    
})(window, console, document);
