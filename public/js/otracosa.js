//write n get cookies n show flash
//work around to delete cookies
let flash = function () { };
let style = {};
let mainDivs = {};
style.default = "opacity: 1;float:left;padding: .3em .4em;margin:0 auto .5em;display:inline-block;clear:both;position:relative;min-width:120px; /* 610/13 */ *max-width:45.750em; /* 610/13.3333 - for IE */";
/* style.tl = "top:0;left:0;";
style.t = "right:45%;top:0;";
style.tr = "top-default";
style.r = "right:0;top:45%;";
style.br = "roght:0;bottom:0;";
style.b = "right:45%;bottom:0;";
style.bl = "bottom:0;left:0;";
style.l = "left:0;top:45%;"; */
style.success = "success";
style.error = "error";
flash.prototype.clearFlash = function (cname) {
    let d = new Date();
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + "; " + expires;
}
flash.prototype.getFlash = function () {
    let name = "flash-";
    let flash = [];
    let ca = document.cookie.split(';');
    //console.log(ca);
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
      
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          let str = c.substring(name.length + 5, c.length);
          str = JSON.parse(unescape(str));
          flash.push(str);
          this.show(str);
          this.clearFlash(c.substring(name.length + 5, 0));
        }
    }
    return flash;
}
flash.prototype.show = function (flash) {
   let div = document.createElement("div");
    let flashDiv = document.createElement('div');
    div.classList.add(this.getFlashStyle(flash));
    const mensajes=flash.msg;
    if (mensajes instanceof Array) {
      mensajes.map((mensaje, i) => {
        div.innerHTML = `<div class="${this.getFlashStyle(
          flash
        )}">${mensaje}</div>`;
        flashDiv.appendChild(div.children[0]);
      });
    }else{
        div.innerHTML = `<div class="${this.getFlashStyle(
          flash
        )}">${mensajes}</div>`;
        flashDiv.appendChild(div.children[0]);
    }
    
   // flashDiv.setAttribute("class", this.getFlashStyle(flash));
    this.getMainDiv(flash.option).appendChild(flashDiv);
    setTimeout(this.fadeOut, flash.option.duration, flashDiv);
    return flashDiv;
}
flash.prototype.getFlashStyle = function (flash) {
    return  style[flash.type];
}
flash.prototype.getMainDiv = function (option) {
    let div;
    if (mainDivs[option.position]) {
        return mainDivs[option.position];
    } else {
        div = document.createElement("div");
        div.setAttribute('class', [option.position]);
        div.style.position = "fixed";
        mainDivs[option.position] = div;
        document.body.appendChild(div);
    }
    return div;
}
flash.prototype.fadeOut = function (div) {
    //div.style.opacity=1;
    let i = 100;
    let fn = setInterval(function () {
        if (i == 0) {
            clearInterval(fn);
            div.parentNode.removeChild(div);
        } else {
            div.style.opacity = (i - 5) * .01;
            i = i - 5;
        }
    }, 5);

}

let f = new flash();
let d = f.getFlash();
