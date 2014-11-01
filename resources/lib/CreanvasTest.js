var TEST = !0, DEBUG = !1, CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};
window.CreJs = CreJs;
CreJs.Creanvas = CreJs.Creanvas;
TEST && (CreJs.Test = CreJs.Test || {}, CreJs.Test = CreJs.Test);
(function() {
  var a = CreJs.Core = CreJs.Core || {};
  a.Vector = function(e, c, d) {
    var b = this;
    this.vectorX = e;
    this.vectorY = c;
    this.vectorZ = d || 0;
    this.draw = function(a, d, c, e) {
      a.lineWidth = 5;
      a.strokeStyle = e;
      a.beginPath();
      a.moveTo(d, c);
      a.lineTo(d + 100 * b.vectorX, c + 100 * b.vectorY);
      a.stroke();
      a.lineWidth = 1;
      a.strokeStyle = "#000";
    };
    this.getCoordinates = function(g) {
      return{u:a.scalarProduct(b, g.u), v:a.scalarProduct(b, g.v), w:a.scalarProduct(b, g.w)};
    };
    this.setCoordinates = function(a, d, c, e) {
      e = e || 0;
      b.vectorX = d * a.u.vectorX + c * a.v.vectorX + e * a.w.vectorX;
      b.vectorY = d * a.u.vectorY + c * a.v.vectorY + e * a.w.vectorY;
      b.vectorZ = d * a.u.vectorZ + c * a.v.vectorZ + e * a.w.vectorZ;
    };
  };
  Object.defineProperty(a.Vector.prototype, "x", {get:function() {
    return this.vectorX;
  }, set:function(a) {
    this.vectorX = a;
  }});
  Object.defineProperty(a.Vector.prototype, "y", {get:function() {
    return this.vectorY;
  }, set:function(a) {
    this.vectorY = a;
  }});
  Object.defineProperty(a.Vector.prototype, "z", {get:function() {
    return this.vectorZ;
  }, set:function(a) {
    this.vectorZ = a;
  }});
  a.getUnitVectors = function(e, c, d, b) {
    e = d - e;
    c = b - c;
    b = Math.sqrt(e * e + c * c);
    return{u:new a.Vector(e / b, c / b, 0), v:new a.Vector(-c / b, e / b, 0), w:new a.Vector(0, 0, 0)};
  };
  a.drawUnitVectors = function(a, c, d, b, g) {
    a.lineWidth = 5;
    a.strokeStyle = g;
    a.beginPath();
    a.moveTo(c, d);
    a.lineTo(c + 100 * b.u.vectorX, d + 100 * b.u.vectorY);
    a.moveTo(c, d);
    a.lineTo(c + 50 * b.v.vectorX, d + 50 * b.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.drawCoordinateVector = function(a, c, d, b, g, k, h) {
    a.lineWidth = 5;
    a.strokeStyle = h;
    a.beginPath();
    a.moveTo(c, d);
    a.lineTo(c + 100 * g * b.u.vectorX, d + 100 * g * b.u.vectorY);
    a.lineTo(c + 100 * g * b.u.vectorX + 100 * k * b.v.vectorX, d + 100 * g * b.u.vectorY + 100 * k * b.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.scalarProduct = function(a, c) {
    return a.vectorX * c.vectorX + a.vectorY * c.vectorY;
  };
  a.vectorProduct = function(e, c) {
    return new a.Vector(e.vectorY * c.vectorZ - e.vectorZ * c.vectorY, e.vectorZ * c.vectorX - e.vectorX * c.vectorZ, e.vectorX * c.vectorY - e.vectorY * c.vectorX);
  };
  CreJs.Core = CreJs.Core;
  CreJs.Core.Vector = CreJs.Core.Vector;
})();
TEST && function() {
  (CreJs.Test.Core = CreJs.Test.Core || {}).test_Vector_constructor = function() {
    var a = new CreJs.Core.Vector(1, 2, 3);
    return 1 != a.vectorX ? "FAILED! vector.x: Expected 1, was " + a.vectorX : 2 != a.vectorY ? "FAILED! vector.y: Expected 2, was " + a.vectorY : 3 != a.vectorZ ? "FAILED! vector.z: Expected 3, was " + a.vectorZ : "OK";
  };
}();
(function() {
  CreJs.Creanvas.CollisionSolver = function(a) {
    var e = function(b, a) {
      var d, c, f, e, n, r, p;
      e = b.getClientRect();
      n = a.getClientRect();
      d = Math.max(e.leftInPoints, n.leftInPoints) - 1;
      c = Math.min(e.rightInPoints, n.rightInPoints) + 1;
      f = Math.max(e.topInPoints, n.topInPoints) - 1;
      e = Math.min(e.bottomInPoints, n.bottomInPoints) + 1;
      if (!(0 >= c - d || 0 >= e - f)) {
        d = b.collisionContext.getImageData(0, 0, b.widthInPoints, b.heightInPoints);
        b.collisionContext.scale(1 / (b.elementScaleX || 1), 1 / (b.elementScaleY || 1));
        b.collisionContext.rotate(-(b.elementAngle || 0));
        b.collisionContext.translate(a.elementX * b.controller.lengthScale - b.elementX * b.controller.lengthScale, a.elementY * b.controller.lengthScale - b.elementY * b.controller.lengthScale);
        b.collisionContext.rotate(a.elementAngle || 0);
        b.collisionContext.scale(a.elementScaleX || 1, a.elementScaleY || 1);
        b.collisionContext.globalCompositeOperation = "destination-out";
        b.collisionContext.drawImage(a.collidedContext.canvas, 0, 0, a.widthInPoints, a.heightInPoints, a.leftInPoints, a.topInPoints, a.widthInPoints, a.heightInPoints);
        b.collisionContext.scale(1 / (a.elementScaleX || 1), 1 / (a.elementScaleY || 1));
        b.collisionContext.rotate(-a.elementAngle || 0);
        b.collisionContext.translate(-a.elementX * b.controller.lengthScale + b.elementX * b.controller.lengthScale, -a.elementY * b.controller.lengthScale + b.elementY * b.controller.lengthScale);
        b.collisionContext.rotate(b.elementAngle || 0);
        b.collisionContext.scale(b.elementScaleX || 1, b.elementScaleY || 1);
        r = b.collisionContext.getImageData(0, 0, b.widthInPoints, b.heightInPoints);
        b.collisionContext.globalCompositeOperation = "source-over";
        b.collisionContext.putImageData(d, 0, 0);
        p = [];
        b.edges.forEach(function(a) {
          90 > r.data[a.y * b.widthInPoints * 4 + 4 * a.x + 3] && p.push(a);
        });
        if (2 > p.length) {
          return null;
        }
        var q;
        f = c = 0;
        d = p.length - 1;
        for (e = 1;e < p.length;e++) {
          for (n = e + 1;n < p.length;n++) {
            q = p[e].x - p[n].x;
            var m = p[e].y - p[n].y;
            q = Math.sqrt(q * q + m * m);
            q > c && (c = q, f = e, d = n);
          }
        }
        c = b.getWebappXY(p[f].x + b.left, p[f].y + b.topInPoints);
        d = b.getWebappXY(p[d].x + b.left, p[d].y + b.topInPoints);
        return c.x == d.x && c.y == d.y ? null : {x:(c.x + d.x) / 2, y:(c.y + d.y) / 2, vectors:CreJs.Core.getUnitVectors(c.x, c.y, d.x, d.y)};
      }
    }, c = function(b, a, d) {
      var c, e, l, n, r, p, q;
      c = d.vectors;
      n = new CreJs.Core.Vector(d.x - b.elementX, d.y - b.elementY);
      p = CreJs.Core.vectorProduct(n, c.v).z;
      q = new CreJs.Core.Vector(d.x - a.elementX, d.y - a.elementY);
      d = CreJs.Core.vectorProduct(q, c.v).z;
      var m = CreJs.Core.vectorProduct(n, c.v), s = CreJs.Core.vectorProduct(q, c.v);
      e = new CreJs.Core.Vector(b.movingSpeed.x, b.movingSpeed.y);
      l = new CreJs.Core.Vector(a.movingSpeed.x, a.movingSpeed.y);
      b.elementScaleSpeed && (e.x += n.x * b.elementScaleSpeed.x, e.y += n.y * b.elementScaleSpeed.y);
      a.elementScaleSpeed && (l.x += q.x * a.elementScaleSpeed.x, l.y += q.y * a.elementScaleSpeed.y);
      n = e.getCoordinates(c);
      r = l.getCoordinates(c);
      l = b.fixedPoint ? Infinity : b.elementMass;
      e = a.fixedPoint ? Infinity : a.elementMass;
      q = b.fixed ? Infinity : b.getMomentOfInertia();
      var t = a.fixed ? Infinity : a.getMomentOfInertia(), m = b.collisionCoefficient * a.collisionCoefficient * 2 * (r.v - n.v + a.omega * s.z - b.omega * m.z) / (1 / e + 1 / l + s.z * s.z / t + m.z * m.z / q);
      b.movingSpeed.x += m / l * c.v.x;
      b.movingSpeed.y += m / l * c.v.y;
      a.movingSpeed.x -= m / e * c.v.x;
      a.movingSpeed.y -= m / e * c.v.y;
      b.omega += m * p / q;
      a.omega -= m * d / t;
    }, d = function() {
      return a.elements.filter(function(a) {
        return a.isSolid;
      });
    };
    this.solveCollision = function(a) {
      var g = d(), k, h, f = null;
      k = a.getCenter();
      g = g.filter(function(d) {
        var g;
        if (d.elementId === a.elementId || !(d.movingSpeed.x || d.movingSpeed.y || a.movingSpeed.x || a.movingSpeed.y || d.elementScaleSpeed || a.elementScaleSpeed || a.omega || d.omega)) {
          return!1;
        }
        g = d.getCenter();
        return Math.sqrt((k.x - g.x) * (k.x - g.x) + (k.y - g.y) * (k.y - g.y)) > a.getRadius() + d.getRadius() ? !1 : !0;
      });
      if (0 == g.length) {
        return!0;
      }
      h = null;
      g.forEach(function(d) {
        h || (h = e(a, d)) && (f = d);
      });
      if (!h) {
        return!0;
      }
      c(a, f, h);
      a.elementEvents.getEvent("collision").dispatch({element:f, collisionPoint:h});
      f.elementEvents.getEvent("collision").dispatch({element:a, collisionPoint:h});
      return!1;
    };
  };
})();
(function() {
  var a = CreJs.Creanvas;
  a.Controller = function(b) {
    var d = b.canvas;
    this.logger = b.log;
    this.lengthScale = b.lengthScale || d.height / b.realHeight || d.width / b.realWidth || 1;
    timeScale = b.timeScale || 1;
    var k = 0;
    setInterval(function() {
      k += 10 * timeScale / 1E3;
    }, 10);
    this.getTime = function() {
      return k;
    };
    DEBUG && this.logMessage("Starting controller");
    this.needRedraw = !0;
    this.isDrawing = !1;
    this.refreshTime = b["controller.refreshTime"] || a.Controller.DEFAULT_REFRESH_TIME;
    this.elements = [];
    this.elementEvents = new CreJs.Creevents.EventContainer;
    this.context = d.getContext("2d");
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.registerCanvasPointerEvent("click", "click");
    this.registerCanvasPointerEvent("mousedown", "pointerDown");
    this.registerCanvasPointerEvent("touchstart", "pointerDown");
    this.registerTouchIdentifierEvent("mousemove", "pointerMove");
    this.registerTouchIdentifierEvent("touchmove", "pointerMove");
    this.registerTouchIdentifierEvent("mouseup", "pointerUp");
    this.registerTouchIdentifierEvent("touchend", "pointerUp");
    e.call(this, b.drawBackground, b.backgroundStyle);
    c.call(this);
  };
  var e = function(b, d) {
    var c = this;
    DEBUG && c.logMessage("Adding background");
    c.add(["name", "background"], ["image", {left:0, top:0, width:c.context.canvas.width / c.lengthScale, height:c.context.canvas.height / c.lengthScale, draw:b || function(b) {
      b.fillStyle = d || a.Controller.DEFAULT_BACKGROUND_COLOUR;
      b.fillRect(0, 0, c.context.canvas.width / c.lengthScale, c.context.canvas.height / c.lengthScale);
    }}], ["position", {z:-Infinity}]);
  }, c = function() {
    var a = this;
    setInterval(function() {
      a.needRedraw && !a.isDrawing ? (a.isDrawing = !0, a.elements.sort(function(a, b) {
        return(a.elementZ || 0) - (b.elementZ || 0);
      }).forEach(function(g) {
        d.call(a, g);
      }), a.isDrawing = !1) : DEBUG && a.logMessage("No redraw");
    }, a.refreshTime);
  }, d = function(a) {
    this.context.translate(a.elementX * this.lengthScale, a.elementY * this.lengthScale);
    this.context.rotate(a.elementAngle || 0);
    this.context.scale(a.elementScaleX || 1, a.elementScaleY || 1);
    this.context.drawImage(a.temporaryRenderingContext.canvas, 0, 0, a.widthInPoints, a.heightInPoints, a.leftInPoints, a.topInPoints, a.widthInPoints, a.heightInPoints);
    this.context.scale(1 / (a.elementScaleX || 1), 1 / a.elementScaleY || 1);
    this.context.rotate(-(a.elementAngle || 0));
    this.context.translate(-a.elementX * this.lengthScale, -a.elementY * this.lengthScale);
  };
  a.Controller.prototype.logMessage = function(a) {
    this.logger && this.logger(a);
  };
  a.Controller.prototype.triggerPointedElementEvent = function(a, d) {
    var c = !1;
    this.elements.filter(function(d) {
      return d.canHandleEvent(a);
    }).sort(function(a, b) {
      return b.elementZ || 0 - a.elementZ || 0;
    }).forEach(function(e) {
      !c && e.hit(d.x, d.y) && (e.elementEvents.getEvent(a).dispatch(d), c = !0);
    });
  };
  a.Controller.prototype.triggerElementEventByIdentifier = function(a, d) {
    this.elements.forEach(function(c) {
      c.touchIdentifier == d.touchIdentifier && c.elementEvents.getEvent(a).dispatch(d);
    });
  };
  a.Controller.prototype.registerCanvasPointerEvent = function(a, d) {
    var c = this;
    c.context.canvas.addEventListener(a, function(e) {
      setTimeout(function() {
        var f = function(e, f) {
          DEBUG && c.logMessage("Canvas event " + a + " with touchIdentifier " + f);
          var h = c.getWebappXYFromClientXY(e);
          h.touchIdentifier = f;
          c.triggerPointedElementEvent(d, h);
        };
        if (e.changedTouches) {
          for (var l = 0;l < e.changedTouches.length;l++) {
            f(e.changedTouches[l], e.changedTouches[l].identifier);
          }
        } else {
          f(e, -1);
        }
      });
    });
  };
  a.Controller.prototype.registerTouchIdentifierEvent = function(a, d) {
    var c = this;
    this.context.canvas.addEventListener(a, function(e) {
      setTimeout(function() {
        var f = function(e, f) {
          DEBUG && c.logMessage("Canvas event " + a + " with touchIdentifier " + f);
          var h = c.getWebappXYFromClientXY(e);
          h.touchIdentifier = f;
          c.triggerElementEventByIdentifier(d, h);
        };
        if (e.changedTouches) {
          for (var l = 0;l < e.changedTouches.length;l++) {
            f(e.changedTouches[l], e.changedTouches[l].identifier);
          }
        } else {
          f(e, -1);
        }
      });
    });
  };
  a.Controller.prototype.stopController = function() {
    this.elementEvents.getEvent("deactivate").dispatch();
    this.elements = [];
  };
  a.Controller.prototype.triggerRedraw = function() {
    this.needRedraw = !0;
  };
  a.Controller.prototype.getWebappXYFromClientXY = function(a) {
    var d = this.context.canvas.getBoundingClientRect(), d = {x:(a.clientX - d.left) * this.context.canvas.width / d.width / this.lengthScale, y:(a.clientY - d.top) * this.context.canvas.height / d.height / this.lengthScale};
    DEBUG && this.logMessage("ClientXY: (" + a.clientX + "," + a.clientY + ") - WebAppXY: (" + d.x + "," + d.y + ")");
    return d;
  };
  a.Controller.prototype.add = function() {
    DEBUG && this.logMessage("Controller.addElement: Adding element - args:" + arguments.length);
    var a = [].slice.call(arguments), d = a.filter(function(a) {
      return a && "name" == a[0];
    })[0] || ["name", "Unknown"], c = a.filter(function(a) {
      return a && "image" == a[0];
    })[0], e = a.filter(function(a) {
      return a && "position" == a[0];
    })[0], d = new CreJs.Creanvas.Element(this, d, c, e);
    d.elementId = 0 == this.elements.length ? 0 : this.elements[this.elements.length - 1].elementId + 1;
    a = a.filter(function(a) {
      return a && "name" != a[0] && "position" != a[0] && "image" != a[0];
    });
    0 < a.length && CreJs.Creanvas.elementDecorators && (DEBUG && d.debug("New element", "apply " + a.length + " decorators"), d.applyElementDecorators.apply(d, a));
    this.elements.push(d);
    return d;
  };
  a.Controller.DEFAULT_REFRESH_TIME = 50;
  a.Controller.DEFAULT_BACKGROUND_COLOUR = "#FFF";
  a.Controller = a.Controller;
  a.Controller.prototype.addElement = a.Controller.prototype.add;
  a.Controller.prototype.redraw = a.Controller.prototype.triggerRedraw;
  a.Controller.prototype.stop = a.Controller.prototype.stopController;
})();
(function() {
  var a = CreJs.Creanvas;
  a.Element = function(a, b, g, k) {
    var h = this;
    this.controller = a;
    this.cachedValues = [];
    this.clonerData = [];
    this.elementEvents = this.elementEvents || new CreJs.Creevents.EventContainer;
    h.elementName = b[1];
    e(h, g[1]);
    c(h, k[1]);
    this.clonerData.push(b);
    this.clonerData.push(g);
    this.clonerData.push(k);
    h.controller.elementEvents.getEvent("deactivate").addListener(function(a) {
      h.deactivate();
    });
  };
  var e = function(a, b) {
    var c = b.width, k = b.height;
    a.top = 0 == b.top ? 0 : b.top || -k / 2;
    a.left = 0 == b.left ? 0 : b.left || -c / 2;
    a.bottom = 0 == b.bottom ? 0 : b.bottom || a.top + k;
    a.right = 0 == b.right ? 0 : b.right || a.left + c;
    a.elementWidth = c || a.right - a.left;
    a.elementHeight = k || a.bottom - a.top;
    a.topInPoints = Math.round(a.top * a.controller.lengthScale);
    a.leftInPoints = Math.round(a.left * a.controller.lengthScale);
    a.bottomInPoints = Math.round(a.bottom * a.controller.lengthScale);
    a.rightInPoints = Math.round(a.right * a.controller.lengthScale);
    a.widthInPoints = Math.round(a.elementWidth * a.controller.lengthScale);
    a.heightInPoints = Math.round(a.elementHeight * a.controller.lengthScale);
    c = a.controller.context.canvas.ownerDocument.createElement("canvas");
    a.temporaryRenderingContext = c.getContext("2d");
    a.elementScaleX = b.scaleX || 1;
    a.elementScaleY = b.scaleY || 1;
    b.rawImage ? (a.elementImage = b.rawImage, a.temporaryRenderingContext.putImageData(a.elementImage, 0, 0)) : (k = b.draw, c.width = a.widthInPoints, c.height = a.heightInPoints, a.temporaryRenderingContext.beginPath(), a.temporaryRenderingContext.translate(-a.leftInPoints, -a.topInPoints), a.temporaryRenderingContext.scale(a.controller.lengthScale, a.controller.lengthScale), k.call(a, a.temporaryRenderingContext), a.elementImage = a.temporaryRenderingContext.getImageData(0, 0, a.widthInPoints, 
    a.heightInPoints));
  }, c = function(a, b) {
    a.elementX = b.x || 0;
    a.elementY = b.y || 0;
    a.elementZ = b.z || 0;
    a.elementAngle = b.angle || 0;
  };
  a.Element.prototype.hit = function(a, b) {
    var c = this.getElementXY(a, b), k = c.x - this.leftInPoints, c = c.y - this.topInPoints;
    return 0 <= k && k <= this.widthInPoints && 0 <= c && c <= this.heightInPoints && 0 < this.elementImage.data[4 * c * this.widthInPoints + 4 * k + 3];
  };
  a.Element.prototype.applyElementDecorator = function(a, b) {
    DEBUG && this.debug("applyElementDecorator", a);
    var c = CreJs.Creanvas.elementDecorators[a];
    c ? (this.clonerData.push([a, b]), c.applyTo(this, b)) : DEBUG && this.debug("applyElementDecorator", "Not found: " + a);
  };
  a.Element.prototype.getCacheableValue = function(a, b, c) {
    if (this.cachedValues[a] && this.cachedValues[a].key == b) {
      return this.cachedValues[a].value;
    }
    c = c.call(this);
    this.cachedValues[a] = {key:b, value:c};
    return c;
  };
  a.Element.prototype.cloneElement = function(a) {
    DEBUG && this.debug("cloneElement", "start cloning");
    var b = a ? this.clonerData.filter(function(b) {
      return a.every(function(a) {
        return a != b[0];
      });
    }) : this.clonerData;
    DEBUG && this.debug("cloneElement", "apply " + b.length + " stuff");
    return this.controller.add.apply(this.controller, b);
  };
  a.Element.prototype.canHandleEvent = function(a) {
    return "click" == a || "pointerDown" == a || this.elementEvents.hasEvent(a);
  };
  a.Element.prototype.deactivate = function() {
    this.temporaryRenderingContext = null;
  };
  a.Element.prototype.triggerRedraw = function() {
    this.controller.triggerRedraw();
  };
  a.Element.prototype.getWebappXY = function(a, b) {
    return{x:this.elementX + (a * this.elementScaleX * Math.cos(this.elementAngle) - b * this.elementScaleY * Math.sin(this.elementAngle)) / this.controller.lengthScale, y:this.elementY + (a * this.elementScaleX * Math.sin(this.elementAngle) + b * this.elementScaleY * Math.cos(this.elementAngle)) / this.controller.lengthScale};
  };
  a.Element.prototype.getElementXY = function(a, b) {
    return{x:Math.round(((a - this.elementX) * this.controller.lengthScale * Math.cos(this.elementAngle) + (b - this.elementY) * this.controller.lengthScale * Math.sin(this.elementAngle)) / this.elementScaleX), y:Math.round(((b - this.elementY) * this.controller.lengthScale * Math.cos(this.elementAngle) - (a - this.elementX) * this.controller.lengthScale * Math.sin(this.elementAngle)) / this.elementScaleY)};
  };
  a.Element.prototype.getCenter = function() {
    return this.getWebappXY(this.leftInPoints + this.widthInPoints / 2, this.topInPoints + this.heightInPoints / 2);
  };
  a.Element.prototype.getClientCorners = function() {
    var a = this;
    return this.getCacheableValue("getClientCorners", a.elementX + "" + a.elementY + "" + a.elementAngle + "" + a.elementScaleX + "" + a.elementScaleX, function() {
      var b = [];
      b.push({x:a.leftInPoints, y:a.topInPoints});
      b.push({x:a.rightInPoints, y:a.topInPoints});
      b.push({x:a.rightInPoints, y:a.bottomInPoints});
      b.push({x:a.leftInPoints, y:a.bottomInPoints});
      return b.map(function(b) {
        return a.getWebappXY(b.x, b.y);
      });
    });
  };
  a.Element.prototype.getClientRect = function() {
    var a = this;
    return this.getCacheableValue("getClientRect", a.elementX + "" + a.elementY + "" + a.elementAngle + "" + a.elementScaleX + "" + a.elementScaleX, function() {
      var b = a.getClientCorners();
      return{top:b.reduce(function(a, b) {
        return Math.min(a, b.y);
      }, Infinity), bottom:b.reduce(function(a, b) {
        return Math.max(a, b.y);
      }, -Infinity), left:b.reduce(function(a, b) {
        return Math.min(a, b.x);
      }, Infinity), right:b.reduce(function(a, b) {
        return Math.max(a, b.x);
      }, -Infinity)};
    });
  };
  a.Element.prototype.applyElementDecorators = function() {
    var a = this;
    [].slice.apply(arguments).forEach(function(b) {
      a.applyElementDecorator(b[0], b[1]);
    });
  };
  DEBUG && (a.Element.prototype.debug = function(a, b) {
    this.controller.logMessage("Element." + a + ": " + b + ". Element: " + this.elementName + "/" + this.elementId);
  });
  a.Element.prototype.clone = a.Element.prototype.cloneElement;
  a.Element.prototype.applyDecorator = a.Element.prototype.applyElementDecorator;
  a.Element.prototype.applyDecorators = a.Element.prototype.applyElementDecorators;
  Object.defineProperty(a.Element.prototype, "width", {get:function() {
    return this.elementWidth;
  }, set:function(a) {
    this.elementWidth = a;
  }});
  Object.defineProperty(a.Element.prototype, "height", {get:function() {
    return this.elementHeight;
  }, set:function(a) {
    this.elementHeight = a;
  }});
  Object.defineProperty(a.Element.prototype, "scaleX", {get:function() {
    return this.elementScaleX;
  }, set:function(a) {
    this.elementScaleX = a;
  }});
  Object.defineProperty(a.Element.prototype, "scaleY", {get:function() {
    return this.elementScaleY;
  }, set:function(a) {
    this.elementScaleY = a;
  }});
  Object.defineProperty(a.Element.prototype, "x", {get:function() {
    return this.elementX;
  }, set:function(a) {
    this.elementX = a;
  }});
  Object.defineProperty(a.Element.prototype, "y", {get:function() {
    return this.elementY;
  }, set:function(a) {
    this.elementY = a;
  }});
  Object.defineProperty(a.Element.prototype, "z", {get:function() {
    return this.elementZ;
  }, set:function(a) {
    this.elementZ = a;
  }});
  Object.defineProperty(a.Element.prototype, "angle", {get:function() {
    return this.elementAngle;
  }, set:function(a) {
    this.elementAngle = a;
  }});
  Object.defineProperty(a.Element.prototype, "name", {get:function() {
    return this.elementName;
  }});
  Object.defineProperty(a.Element.prototype, "id", {get:function() {
    return this.elementId;
  }});
  Object.defineProperty(a.Element.prototype, "image", {get:function() {
    return this.elementImage;
  }});
  Object.defineProperty(a.Element.prototype, "events", {get:function() {
    return this.elementEvents;
  }});
})();
(function() {
  var a = CreJs.Creanvas;
  a.NodeJsController = function(b) {
    var c = b.canvas;
    this.logger = b.log;
    this.lengthScale = b.lengthScale || c.height / b.realHeight || c.width / b.realWidth || 1;
    timeScale = b.timeScale || 1;
    this.nodeSocket = b.nodeSocket;
    DEBUG && this.logMessage("Starting controller");
    this.refreshTime = b["controller.refreshTime"] || a.Controller.DEFAULT_REFRESH_TIME;
    this.elements = [];
    this.elementEvents = new CreJs.Creevents.EventContainer;
    this.context = c.getContext("2d");
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.registerCanvasPointerEvent("click", "click");
    this.registerCanvasPointerEvent("mousedown", "pointerDown");
    this.registerCanvasPointerEvent("touchstart", "pointerDown");
    this.registerTouchIdentifierEvent("mousemove", "pointerMove");
    this.registerTouchIdentifierEvent("touchmove", "pointerMove");
    this.registerTouchIdentifierEvent("mouseup", "pointerUp");
    this.registerTouchIdentifierEvent("touchend", "pointerUp");
    e.call(this, b.drawBackground, b.backgroundStyle);
    d.call(this);
  };
  var e = function(b, c) {
    var d = this;
    DEBUG && d.logMessage("Adding background");
    d.add(["name", "background"], ["image", {left:0, top:0, width:d.context.canvas.width / d.lengthScale, height:d.context.canvas.height / d.lengthScale, draw:b || function(b) {
      b.fillStyle = c || a.Controller.DEFAULT_BACKGROUND_COLOUR;
      b.fillRect(0, 0, d.context.canvas.width / d.lengthScale, d.context.canvas.height / d.lengthScale);
    }}], ["position", {z:-Infinity}]);
  }, c = function(a) {
    this.context.translate(a.elementX * this.lengthScale, a.elementY * this.lengthScale);
    this.context.rotate(a.elementAngle || 0);
    this.context.scale(a.elementScaleX || 1, a.elementScaleY || 1);
    this.context.drawImage(a.temporaryRenderingContext.canvas, 0, 0, a.widthInPoints, a.heightInPoints, a.leftInPoints, a.topInPoints, a.widthInPoints, a.heightInPoints);
    this.context.scale(1 / (a.elementScaleX || 1), 1 / a.elementScaleY || 1);
    this.context.rotate(-(a.elementAngle || 0));
    this.context.translate(-a.elementX * this.lengthScale, -a.elementY * this.lengthScale);
  }, d = function() {
    var a = this;
    setInterval(function() {
      a.needRedraw && !a.isDrawing ? (a.isDrawing = !0, a.elements.sort(function(a, b) {
        return(a.elementZ || 0) - (b.elementZ || 0);
      }).forEach(function(d) {
        c.call(a, d);
      }), a.isDrawing = !1) : DEBUG && a.logMessage("No redraw");
    }, a.refreshTime);
  };
  a.NodeJsController.prototype.logMessage = function(a) {
    this.logger && this.logger(a);
  };
  a.NodeJsController.prototype.triggerPointedElementEvent = function(a, c) {
    var d = !1;
    this.elements.filter(function(c) {
      return c.canHandleEvent(a);
    }).sort(function(a, b) {
      return b.elementZ || 0 - a.elementZ || 0;
    }).forEach(function(e) {
      !d && e.hit(c.x, c.y) && (this.nodeSocket.emit("dispatchEvent", JSON.stringify({element:e.id, event:a})), d = !0);
    });
  };
  a.NodeJsController.prototype.triggerElementEventByIdentifier = function(a, c) {
    this.elements.forEach(function(d) {
      d.touchIdentifier == c.touchIdentifier && d.elementEvents.getEvent(a).dispatch(c);
    });
  };
  a.NodeJsController.prototype.registerCanvasPointerEvent = function(a, c) {
    var d = this;
    d.context.canvas.addEventListener(a, function(e) {
      setTimeout(function() {
        var f = function(e, f) {
          DEBUG && d.logMessage("Canvas event " + a + " with touchIdentifier " + f);
          var h = d.getWebappXYFromClientXY(e);
          h.touchIdentifier = f;
          d.triggerPointedElementEvent(c, h);
        };
        if (e.changedTouches) {
          for (var l = 0;l < e.changedTouches.length;l++) {
            f(e.changedTouches[l], e.changedTouches[l].identifier);
          }
        } else {
          f(e, -1);
        }
      });
    });
  };
  a.NodeJsController.prototype.registerTouchIdentifierEvent = function(a, c) {
    var d = this;
    this.context.canvas.addEventListener(a, function(e) {
      setTimeout(function() {
        var f = function(e, f) {
          DEBUG && d.logMessage("Canvas event " + a + " with touchIdentifier " + f);
          var h = d.getWebappXYFromClientXY(e);
          h.touchIdentifier = f;
          d.triggerElementEventByIdentifier(c, h);
        };
        if (e.changedTouches) {
          for (var l = 0;l < e.changedTouches.length;l++) {
            f(e.changedTouches[l], e.changedTouches[l].identifier);
          }
        } else {
          f(e, -1);
        }
      });
    });
  };
  a.NodeJsController.prototype.stopController = function() {
    this.elementEvents.getEvent("deactivate").dispatch();
    this.elements = [];
  };
  a.NodeJsController.prototype.triggerRedraw = function() {
    this.needRedraw = !0;
  };
  a.NodeJsController.prototype.getWebappXYFromClientXY = function(a) {
    var c = this.context.canvas.getBoundingClientRect(), c = {x:(a.clientX - c.left) * this.context.canvas.width / c.width / this.lengthScale, y:(a.clientY - c.top) * this.context.canvas.height / c.height / this.lengthScale};
    DEBUG && this.logMessage("ClientXY: (" + a.clientX + "," + a.clientY + ") - WebAppXY: (" + c.x + "," + c.y + ")");
    return c;
  };
  a.NodeJsController.prototype.add = function() {
    DEBUG && this.logMessage("Controller.addElement: Adding element - args:" + arguments.length);
    var a = [].slice.call(arguments), c = a.filter(function(a) {
      return a && "name" == a[0];
    })[0] || ["name", "Unknown"], d = a.filter(function(a) {
      return a && "image" == a[0];
    })[0], e = a.filter(function(a) {
      return a && "position" == a[0];
    })[0], c = new CreJs.Creanvas.Element(this, c, d, e);
    c.elementId = 0 == this.elements.length ? 0 : this.elements[this.elements.length - 1].elementId + 1;
    a = a.filter(function(a) {
      return a && "name" != a[0] && "position" != a[0] && "image" != a[0];
    });
    0 < a.length && CreJs.Creanvas.elementDecorators && (DEBUG && c.debug("New element", "apply " + a.length + " decorators"), c.applyElementDecorators.apply(c, a));
    this.elements.push(c);
    return c;
  };
  a.NodeJsController.DEFAULT_REFRESH_TIME = 50;
  a.NodeJsController.DEFAULT_BACKGROUND_COLOUR = "#FFF";
  a.NodeJsController = a.NodeJsController;
  a.NodeJsController.prototype.addElement = a.NodeJsController.prototype.add;
  a.NodeJsController.prototype.redraw = a.NodeJsController.prototype.triggerRedraw;
  a.NodeJsController.prototype.stop = a.NodeJsController.prototype.stopController;
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.clickable = {applyTo:function(a, e) {
    var c = !1, d = e.ondown, b = e.onup, g = e.onclick;
    this.touchIdentifier = null;
    g && a.elementEvents.getEvent("click").addListener(function(b) {
      DEBUG && a.debug("Clickable", "onclick");
      g.call(a, b);
      a.triggerRedraw();
    });
    d && a.elementEvents.getEvent("pointerDown").addListener(function(b) {
      DEBUG && a.debug("Clickable", "onDown: Identifier: " + b.touchIdentifier);
      a.touchIdentifier = b.touchIdentifier;
      c = !0;
      d.call(a, event);
      a.triggerRedraw();
    });
    b && a.elementEvents.getEvent("pointerUp").addListener(function(d) {
      c && a.touchIdentifier == d.touchIdentifier && (DEBUG && a.debug("Clickable", "onUp: Identifier: " + d.touchIdentifier), c = !1, b.call(a, event), a.triggerRedraw());
    });
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.customTimer = {applyTo:function(a, e) {
    setInterval(function() {
      e.action.call(a);
    }, e.time);
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.droppable = {applyTo:function(a, e) {
    a.isDroppable = !0;
    a.elementDropZone = e.dropZone;
    DEBUG && a.debug("droppable.applyTo", "Now droppable");
    Object.defineProperty(a, "dropZone", {get:function() {
      return this.elementDropZone;
    }, set:function(a) {
      this.elementDropZone = a;
    }});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.dropzone = {applyTo:function(a, e) {
    var c = e.availableSpots, d = e.dropX, b = e.dropY;
    a.droppedElementsList = [];
    a.elementEvents.getEvent("drop").addListener(function(e) {
      0 >= c || (DEBUG && a.debug("dropzone.drop", "dropping: " + e.droppedElement.id), c--, e.droppedElement.x = d || a.elementX, e.droppedElement.y = b || a.elementY, e.droppedElement.dropZone = a, a.droppedElementsList.push(e.droppedElement), e.droppedElement.elementEvents.getEvent("dropped").dispatch({dropZone:a, droppedElement:e.droppedElement}), a.elementEvents.getEvent("droppedIn").dispatch({dropZone:a, droppedElement:e.droppedElement}), a.triggerRedraw());
    });
    a.drag = function(b) {
      DEBUG && a.debug("dropzone.drag", "dragging  " + b.id);
      b.dropZone = null;
      c++;
      a.droppedElementsList.splice(a.droppedElementsList.indexOf(b), 1);
      a.triggerRedraw();
    };
    Object.defineProperty(a, "droppedElements", {get:function() {
      return a.droppedElementsList;
    }});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.duplicable = {applyTo:function(a, e) {
    var c = e.isBlocked, d = e.generatorCount || Infinity;
    DEBUG && a.debug("duplicable.applyTo", "generatorCount is " + d);
    var b = !1;
    a.elementEvents.getEvent("pointerDown").addListener(function(e) {
      0 <= e.touchIdentifier && (b = !0);
      if (!(b && 0 > e.touchIdentifier || c && c() || (DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount was: " + d), 0 >= d))) {
        d--;
        DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount is now: " + d);
        var k = a.cloneElement(["duplicable"]);
        k.elementName += " (duplicate)";
        k.applyElementDecorator("movable", {isBlocked:c});
        k.startMoving(e);
        a.triggerRedraw();
      }
    });
  }};
})();
(function() {
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators;
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.movable = {applyTo:function(a, e) {
    var c = !1, d = this.touchIdentifier = null, b = e.isBlocked;
    a.startMoving = function(b) {
      DEBUG && a.debug("movable.startMoving", "identifier: " + b.touchIdentifier);
      c = !0;
      a.touchIdentifier = b.touchIdentifier;
      d = {x:b.x, y:b.y};
      a.dropZone && (a.dropZone.drag(a), a.dropZone = null);
    };
    a.moveCompleted = function(b) {
      DEBUG && a.debug("movable.moveCompleted", "identifier: " + b.touchIdentifier);
      c = !1;
      d = null;
      a.isDroppable && (DEBUG && a.debug("movable.moveCompleted", "trigger drop - identifier: " + b.touchIdentifier), a.controller.triggerPointedElementEvent("drop", {x:b.x, y:b.y, droppedElement:a}));
    };
    a.elementEvents.getEvent("pointerDown").addListener(function(c) {
      b && b() || a.startMoving(c);
    });
    var g = !1;
    a.elementEvents.getEvent("pointerMove").addListener(function(e) {
      !c || b && b() || (g || (g = !0, DEBUG && a.debug("movable.move", "identifier: " + a.touchIdentifier)), a.elementX += e.x - d.x, a.elementY += e.y - d.y, d = {x:e.x, y:e.y}, a.triggerRedraw());
    });
    a.elementEvents.getEvent("pointerUp").addListener(function(e) {
      !c || b && b() || (DEBUG && a.debug("movable.moveend", "identifier: " + a.touchIdentifier), a.elementX += e.x - d.x, a.elementY += e.y - d.y, a.moveCompleted(e), a.touchIdentifier = null, g = !1, a.triggerRedraw());
    });
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.moving = {type:"moving", applyTo:function(a, e) {
    var c, d, b, g, k, h = e.vx, f = e.vy, l = e.ax, n = e.ay, r = e.rotationSpeed;
    DEBUG && a.debug("moving", "applyTo");
    var p, q, m;
    a.movingSpeed = new CreJs.Core.Vector(h || 0, f || 0);
    a.movingAcceleration = new CreJs.Core.Vector(l || 0, n || 0);
    a.omega = r || 0;
    p = a.controller.getTime();
    setInterval(function() {
      q = a.controller.getTime();
      m = q - p;
      if (!(.001 > m) && (p = q, a.movingSpeed.x += a.movingAcceleration.x * m, a.movingSpeed.y += a.movingAcceleration.y * m, 0 != a.movingSpeed.x || 0 != a.movingSpeed.y || 0 != a.omega || a.elementScaleSpeed && (0 != a.elementScaleSpeed.x || 0 != a.elementScaleSpeed.y))) {
        c = a.elementX;
        d = a.elementY;
        b = a.elementAngle;
        g = a.elementScaleX;
        k = a.elementScaleY;
        a.elementX += a.movingSpeed.x * m;
        a.elementY += a.movingSpeed.y * m;
        a.elementAngle += a.omega * m;
        a.elementScaleSpeed && (a.elementScaleX += a.elementScaleSpeed.x * m, a.elementScaleY += a.elementScaleSpeed.y * m);
        var e = !0;
        a.preMove && a.preMove.forEach(function(b) {
          e && (b.call(a) || (e = !1));
        });
        e || (a.elementX = c, a.elementY = d, a.elementAngle = b, a.elementScaleX = g, a.elementScaleY = k);
      }
    }, 20);
    Object.defineProperty(a, "speed", {get:function() {
      return this.movingSpeed;
    }, set:function(a) {
      this.movingSpeed = a;
    }});
    Object.defineProperty(a, "acceleration", {get:function() {
      return this.movingAcceleration;
    }, set:function(a) {
      this.movingAcceleration = a;
    }});
    Object.defineProperty(a, "rotationSpeed", {get:function() {
      return this.omega;
    }, set:function(a) {
      this.omega = a;
    }});
    Object.defineProperty(a, "scaleSpeed", {get:function() {
      return this.elementScaleSpeed;
    }, set:function(a) {
      this.elementScaleSpeed = a;
    }});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.solid = {applyTo:function(c, d) {
    c.isSolid = !0;
    c.elementMass = d.mass || 1;
    var b = d.onCollision, g = d.coefficient;
    c.fixed = d.fixed || !1;
    c.fixedPoint = c.fixed || d.fixedPoint || !1;
    c.controller.collisionSolver = c.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(c.controller);
    c.collisionCoefficient = g || 0 === g ? g : 1;
    c.movingSpeed = c.movingSpeed || new CreJs.Core.Vector(0, 0);
    c.movingAcceleration = c.movingAcceleration || new CreJs.Core.Vector(0, 0);
    c.omega = c.omega || 0;
    c.elementEvents.getEvent("collision").addListener(function(a) {
      b && b.call(c, a);
    });
    c.preMove = this.preMove || [];
    c.preMove.push(function() {
      return c.controller.collisionSolver.solveCollision(c);
    });
    a.call(c);
    e.call(c);
    c.getMomentOfInertia = function() {
      return c.elementMass / 12 * (c.widthInPoints * c.elementScaleX * c.widthInPoints * c.elementScaleX + c.heightInPoints * c.elementScaleY * c.heightInPoints * c.elementScaleY);
    };
    c.getRadius = function() {
      return this.getCacheableValue("getRadius", c.elementWidth + "" + c.elementHeight + "" + c.elementScaleX + "" + c.elementScaleY, function() {
        return Math.sqrt(this.elementWidth * this.elementWidth * this.elementScaleX * this.elementScaleX + this.elementHeight * this.elementHeight * this.elementScaleY * this.elementScaleY) / 2;
      });
    };
    Object.defineProperty(c, "mass", {get:function() {
      return this.elementMass;
    }, set:function(a) {
      this.elementMass = a;
    }});
  }};
  var a = function() {
    var a = this.controller.context.canvas.ownerDocument.createElement("canvas");
    a.width = this.widthInPoints;
    a.height = this.heightInPoints;
    this.collidedContext = a.getContext("2d");
    this.collidedContext.putImageData(this.elementImage, 0, 0);
    this.collidedContext.globalCompositeOperation = "source-atop";
    this.collidedContext.fillStyle = "#000";
    this.collidedContext.fillRect(0, 0, this.widthInPoints, this.heightInPoints);
  }, e = function() {
    var a = this.controller.context.canvas.ownerDocument.createElement("canvas");
    a.width = this.widthInPoints;
    a.height = this.heightInPoints;
    this.collisionContext = a.getContext("2d");
    this.collisionContext.globalCompositeOperation = "source-over";
    this.collisionContext.drawImage(this.collidedContext.canvas, 0, 0);
    var a = this.collisionContext.getImageData(0, 0, this.widthInPoints, this.heightInPoints), d = this.collisionContext.createImageData(this.widthInPoints, this.heightInPoints);
    this.edges = [];
    for (var b = 0;b < this.widthInPoints;b++) {
      for (var e = 0;e < this.heightInPoints;e++) {
        if (!(200 > a.data[e * this.widthInPoints * 4 + 4 * b + 3])) {
          for (var k = !1, h = -1;2 > h;h++) {
            for (var f = -1;2 > f;f++) {
              if (0 > e + h || 0 > b + f || e + h > this.heightInPoints - 1 || b + h > this.elementWidth - 1 || 100 > a.data[(e + h) * this.elementWidth * 4 + 4 * (b + f) + 3]) {
                k = !0, f = h = 2;
              }
            }
          }
          this.collisionContext.putImageData(d, 0, 0);
          k && (this.edges.push({x:b, y:e}), d.data[e * this.widthInPoints * 4 + 4 * b] = 0, d.data[e * this.widthInPoints * 4 + 4 * b + 1] = 0, d.data[e * this.widthInPoints * 4 + 4 * b + 2] = 0, d.data[e * this.widthInPoints * 4 + 4 * b + 3] = 255);
        }
      }
    }
    this.collisionContext.putImageData(d, 0, 0);
    this.collisionContext.translate(-this.leftInPoints, -this.topInPoints);
  };
})();
(function() {
  var a = CreJs.Creevents = CreJs.Creevents || {};
  a.Event = function(a) {
    this.eventId = a;
    var c = 0, d = [], b = new CreJs.Crelog.Logger;
    this.dispatch = function(a, c) {
      var e = d.length;
      d.forEach(function(d) {
        setTimeout(function() {
          DEBUG && a && "pointerMove" != a.eventId && b.logMessage("Handling " + a.eventId);
          d.handleEvent(a);
          e--;
          0 == e && c && c();
        });
      });
    };
    this.addListener = function(a, b) {
      var e = c++;
      d.push({handlerId:e, handleEvent:a, rank:b});
      d = d.sort(function(a, b) {
        return(a.rank || Infinity) - (b.rank || Infinity);
      });
      return e;
    };
    this.removeListener = function(a) {
      d = d.filter(function(b) {
        return b.handlerId != a;
      });
    };
    this.addEventListener = this.addListener;
    this.removeEventListener = this.removeListener;
  };
  CreJs.Creevents = a;
  a.Event = a.Event;
})();
(function() {
  var a = CreJs.Creevents = CreJs.Creevents || {};
  a.EventContainer = function() {
    var e = {};
    this.hasEvent = function(a) {
      return void 0 != e[a];
    };
    this.getEvent = this.getEvent = function(c) {
      e[c] || (e[c] = new a.Event(c));
      return e[c];
    };
  };
  a.EventContainer = a.EventContainer;
})();
(function() {
  var a = CreJs.Crelog = CreJs.Crelog || {};
  a.Logger = function() {
    this.logMessage = function(a) {
      console.log(a);
    };
  };
  CreJs.Crelog = a;
  a.Logger = a.Logger;
  a.Logger.log = a.Logger.logMessage;
})();

