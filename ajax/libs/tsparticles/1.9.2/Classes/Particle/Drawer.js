"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Drawer = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ShapeType = require("../../Enums/ShapeType");

/**
 * Particle draw manager
 */
var Drawer = /*#__PURE__*/function () {
  function Drawer(container, particle, bubbler) {
    (0, _classCallCheck2["default"])(this, Drawer);
    this.particle = void 0;
    this.container = void 0;
    this.bubbler = void 0;
    this.text = void 0;
    this.container = container;
    this.particle = particle;
    this.bubbler = bubbler;
    var options = this.container.options;

    if (this.particle.shape === _ShapeType.ShapeType["char"] || particle.shape === _ShapeType.ShapeType.character) {
      var value = options.particles.shape.character.value;

      if (typeof value === "string") {
        this.text = value;
      } else {
        this.text = value[Math.floor(Math.random() * value.length)];
      }
    }
  }

  (0, _createClass2["default"])(Drawer, [{
    key: "draw",
    value: function draw() {
      var container = this.container;
      var options = container.options;
      var particle = this.particle;
      var radius;
      var opacity;
      var colorValue;

      if (this.bubbler.radius !== undefined) {
        radius = this.bubbler.radius;
      } else {
        radius = particle.radius;
      }

      if (this.bubbler.opacity !== undefined) {
        opacity = this.bubbler.opacity;
      } else {
        opacity = particle.opacity.value;
      }

      if (particle.color) {
        colorValue = "rgba(".concat(particle.color.r, ", ").concat(particle.color.g, ", ").concat(particle.color.b, ", ").concat(opacity, ")");
      }

      if (!container.canvas.context || !colorValue) {
        return;
      }

      var ctx = container.canvas.context;
      ctx.save(); // TODO: Performance issues, the canvas shadow is really slow
      // const shadow = options.particles.shadow;
      // if (shadow.enable) {
      //     ctx.shadowBlur = shadow.blur;
      //     ctx.shadowColor = shadow.color;
      //     ctx.shadowOffsetX = shadow.offset.x;
      //     ctx.shadowOffsetY = shadow.offset.y;
      // } else {
      //     delete ctx.shadowBlur;
      //     delete ctx.shadowColor;
      //     delete ctx.shadowOffsetX;
      //     delete ctx.shadowOffsetY;
      // }

      ctx.fillStyle = colorValue;
      var pos = {
        x: particle.position.x,
        y: particle.position.y
      };
      ctx.translate(pos.x, pos.y);
      ctx.beginPath();

      if (particle.angle !== 0) {
        ctx.rotate(particle.angle * Math.PI / 180);
      }

      if (options.backgroundMask.enable) {
        ctx.globalCompositeOperation = 'destination-out';
      }

      this.drawShape(radius);
      ctx.closePath();

      if (options.particles.shape.stroke.width > 0) {
        ctx.strokeStyle = options.particles.shape.stroke.color;
        ctx.lineWidth = options.particles.shape.stroke.width;
        ctx.stroke();
      }

      ctx.fill();
      ctx.restore();
    }
  }, {
    key: "drawShape",
    value: function drawShape(radius) {
      var container = this.container;
      var options = container.options;
      var particle = this.particle;
      var ctx = container.canvas.context;

      if (!ctx) {
        return;
      }

      var pos = {
        x: particle.offset.x,
        y: particle.offset.y
      };

      switch (particle.shape) {
        case _ShapeType.ShapeType.line:
          ctx.moveTo(0, 0);
          ctx.lineTo(0, radius);
          ctx.strokeStyle = options.particles.shape.stroke.color;
          ctx.lineWidth = options.particles.shape.stroke.width;
          ctx.stroke();
          break;

        case _ShapeType.ShapeType.circle:
          ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, false);
          break;

        case _ShapeType.ShapeType.edge:
        case _ShapeType.ShapeType.square:
          ctx.rect(-radius, -radius, radius * 2, radius * 2);
          break;

        case _ShapeType.ShapeType.triangle:
          {
            var start = {
              x: -radius,
              y: radius / 1.66
            };
            var side = {
              count: {
                denominator: 2,
                numerator: 3
              },
              length: radius * 2
            };
            Drawer.subDrawShape(ctx, start, side);
          }
          break;

        case _ShapeType.ShapeType.polygon:
          {
            var _start = {
              x: -radius / (options.particles.shape.polygon.sides / 3.5),
              y: -radius / (2.66 / 3.5)
            };
            var _side = {
              count: {
                denominator: 1,
                numerator: options.particles.shape.polygon.sides
              },
              length: radius * 2.66 / (options.particles.shape.polygon.sides / 3)
            };
            Drawer.subDrawShape(ctx, _start, _side);
          }
          break;

        case _ShapeType.ShapeType.star:
          {
            var _start2 = {
              x: -radius * 2 / (options.particles.shape.polygon.sides / 4),
              y: -radius / (2 * 2.66 / 3.5)
            };
            var _side2 = {
              count: {
                denominator: 2,
                numerator: options.particles.shape.polygon.sides
              },
              length: radius * 2 * 2.66 / (options.particles.shape.polygon.sides / 3)
            };
            Drawer.subDrawShape(ctx, _start2, _side2);
          }
          break;

        case _ShapeType.ShapeType.heart:
          {
            var x = -radius / 2;
            var y = -radius / 2;
            ctx.moveTo(x, y + radius / 4);
            ctx.quadraticCurveTo(x, y, x + radius / 4, y);
            ctx.quadraticCurveTo(x + radius / 2, y, x + radius / 2, y + radius / 4);
            ctx.quadraticCurveTo(x + radius / 2, y, x + radius * 3 / 4, y);
            ctx.quadraticCurveTo(x + radius, y, x + radius, y + radius / 4);
            ctx.quadraticCurveTo(x + radius, y + radius / 2, x + radius * 3 / 4, y + radius * 3 / 4);
            ctx.lineTo(x + radius / 2, y + radius);
            ctx.lineTo(x + radius / 4, y + radius * 3 / 4);
            ctx.quadraticCurveTo(x, y + radius / 2, x, y + radius / 4);
          }
          break;

        case _ShapeType.ShapeType["char"]:
        case _ShapeType.ShapeType.character:
          {
            var style = options.particles.shape.character.style;
            var weight = options.particles.shape.character.weight;
            var size = Math.round(radius) * 2;
            var font = options.particles.shape.character.font;
            var text = this.text;
            ctx.font = "".concat(style, " ").concat(weight, " ").concat(size, "px ").concat(font);

            if (text) {
              var _x = -radius / 2;

              var _y = radius / 2;

              if (options.particles.shape.character.fill) {
                ctx.fillText(text, _x, _y);
              } else {
                ctx.strokeText(text, _x, _y);
              }
            }
          }
          break;

        case _ShapeType.ShapeType.image:
          if (particle.image && particle.image.data.obj) {
            this.subDraw(ctx, particle.image.data.obj, radius);
          }

          break;
      }
    }
  }, {
    key: "subDraw",
    value: function subDraw(ctx, imgObj, radius) {
      var particle = this.particle;
      var ratio = 1;

      if (particle.image) {
        ratio = particle.image.ratio;
      }

      var pos = {
        x: -radius,
        y: -radius
      };
      ctx.drawImage(imgObj, pos.x, pos.y, radius * 2, radius * 2 / ratio);
    }
  }], [{
    key: "subDrawShape",
    value: function subDrawShape(ctx, start, side) {
      // By Programming Thomas - https://programmingthomas.wordpress.com/2013/04/03/n-sided-shapes/
      var sideCount = side.count.numerator * side.count.denominator;
      var decimalSides = side.count.numerator / side.count.denominator;
      var interiorAngleDegrees = 180 * (decimalSides - 2) / decimalSides;
      var interiorAngle = Math.PI - Math.PI * interiorAngleDegrees / 180; // convert to radians

      ctx.save();
      ctx.beginPath();
      ctx.translate(start.x, start.y);
      ctx.moveTo(0, 0);

      for (var i = 0; i < sideCount; i++) {
        ctx.lineTo(side.length, 0);
        ctx.translate(side.length, 0);
        ctx.rotate(interiorAngle);
      } // c.stroke();


      ctx.fill();
      ctx.restore();
    }
  }]);
  return Drawer;
}();

exports.Drawer = Drawer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9DbGFzc2VzL1BhcnRpY2xlL0RyYXdlci50cyJdLCJuYW1lcyI6WyJEcmF3ZXIiLCJjb250YWluZXIiLCJwYXJ0aWNsZSIsImJ1YmJsZXIiLCJ0ZXh0Iiwib3B0aW9ucyIsInNoYXBlIiwiU2hhcGVUeXBlIiwiY2hhcmFjdGVyIiwidmFsdWUiLCJwYXJ0aWNsZXMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJyYWRpdXMiLCJvcGFjaXR5IiwiY29sb3JWYWx1ZSIsInVuZGVmaW5lZCIsImNvbG9yIiwiciIsImciLCJiIiwiY2FudmFzIiwiY29udGV4dCIsImN0eCIsInNhdmUiLCJmaWxsU3R5bGUiLCJwb3MiLCJ4IiwicG9zaXRpb24iLCJ5IiwidHJhbnNsYXRlIiwiYmVnaW5QYXRoIiwiYW5nbGUiLCJyb3RhdGUiLCJQSSIsImJhY2tncm91bmRNYXNrIiwiZW5hYmxlIiwiZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uIiwiZHJhd1NoYXBlIiwiY2xvc2VQYXRoIiwic3Ryb2tlIiwid2lkdGgiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsImZpbGwiLCJyZXN0b3JlIiwib2Zmc2V0IiwibGluZSIsIm1vdmVUbyIsImxpbmVUbyIsImNpcmNsZSIsImFyYyIsImVkZ2UiLCJzcXVhcmUiLCJyZWN0IiwidHJpYW5nbGUiLCJzdGFydCIsInNpZGUiLCJjb3VudCIsImRlbm9taW5hdG9yIiwibnVtZXJhdG9yIiwic3ViRHJhd1NoYXBlIiwicG9seWdvbiIsInNpZGVzIiwic3RhciIsImhlYXJ0IiwicXVhZHJhdGljQ3VydmVUbyIsInN0eWxlIiwid2VpZ2h0Iiwic2l6ZSIsInJvdW5kIiwiZm9udCIsImZpbGxUZXh0Iiwic3Ryb2tlVGV4dCIsImltYWdlIiwiZGF0YSIsIm9iaiIsInN1YkRyYXciLCJpbWdPYmoiLCJyYXRpbyIsImRyYXdJbWFnZSIsInNpZGVDb3VudCIsImRlY2ltYWxTaWRlcyIsImludGVyaW9yQW5nbGVE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SCxJQUFJLENBQUNDLEtBQUwsQ0FBV0MsV0FBcEQ7QUFDQSxVQUFNdUIsWUFBWSxHQUFHekIsSUFBSSxDQUFDQyxLQUFMLENBQVdFLFNBQVgsR0FBdUJILElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxXQUF2RDtBQUNBLFVBQU13QixvQkFBb0IsR0FBSSxPQUFPRCxZQUFZLEdBQUcsQ0FBdEIsQ0FBRCxHQUE2QkEsWUFBMUQ7QUFDQSxVQUFNRSxhQUFhLEdBQUczRSxJQUFJLENBQUN5QixFQUFMLEdBQVV6QixJQUFJLENBQUN5QixFQUFMLEdBQVVpRCxvQkFBVixHQUFpQyxHQUFqRSxDQUwrRixDQUt6Qjs7QUFFdEU1RCxNQUFBQSxHQUFHLENBQUNDLElBQUo7QUFDQUQsTUFBQUEsR0FBRyxDQUFDUSxTQUFKO0FBQ0FSLE1BQUFBLEdBQUcsQ0FBQ08sU0FBSixDQUFjMEIsS0FBSyxDQUFDN0IsQ0FBcEIsRUFBdUI2QixLQUFLLENBQUMzQixDQUE3QjtBQUNBTixNQUFBQSxHQUFHLENBQUN5QixNQUFKLENBQVcsQ0FBWCxFQUFjLENBQWQ7O0FBRUEsV0FBSyxJQUFJcUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0osU0FBcEIsRUFBK0JJLENBQUMsRUFBaEMsRUFBb0M7QUFDaEM5RCxRQUFBQSxHQUFHLENBQUMwQixNQUFKLENBQVdRLElBQUksQ0FBQzdDLE1BQWhCLEVBQXdCLENBQXhCO0FBQ0FXLFFBQUFBLEdBQUcsQ0FBQ08sU0FBSixDQUFjMkIsSUFBSSxDQUFDN0MsTUFBbkIsRUFBMkIsQ0FBM0I7QUFDQVcsUUFBQUEsR0FBRyxDQUFDVSxNQUFKLENBQVdtRCxhQUFYO0FBQ0gsT0FoQjhGLENBa0IvRjs7O0FBQ0E3RCxNQUFBQSxHQUFHLENBQUNxQixJQUFKO0FBQ0FyQixNQUFBQSxHQUFHLENBQUNzQixPQUFKO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHtCdWJibGVyfSBmcm9tIFwiLi9CdWJibGVyXCI7XG5pbXBvcnQge0NvbnRhaW5lcn0gZnJvbSBcIi4uL0NvbnRhaW5lclwiO1xuaW1wb3J0IHtJU2lkZX0gZnJvbSBcIi4uLy4uL0ludGVyZmFjZXMvSVNpZGVcIjtcbmltcG9ydCB7SUNvb3JkaW5hdGVzfSBmcm9tIFwiLi4vLi4vSW50ZXJmYWNlcy9JQ29vcmRpbmF0ZXNcIjtcbmltcG9ydCB7UGFydGljbGV9IGZyb20gXCIuLi9QYXJ0aWNsZVwiO1xuaW1wb3J0IHtTaGFwZVR5cGV9IGZyb20gXCIuLi8uLi9FbnVtcy9TaGFwZVR5cGVcIjtcblxuLyoqXG4gKiBQYXJ0aWNsZSBkcmF3IG1hbmFnZXJcbiAqL1xuZXhwb3J0IGNsYXNzIERyYXdlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXJ0aWNsZTogUGFydGljbGU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBjb250YWluZXI6IENvbnRhaW5lcjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGJ1YmJsZXI6IEJ1YmJsZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSB0ZXh0Pzogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBDb250YWluZXIsIHBhcnRpY2xlOiBQYXJ0aWNsZSwgYnViYmxlcjogQnViYmxlcikge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZSA9IHBhcnRpY2xlO1xuICAgICAgICB0aGlzLmJ1YmJsZXIgPSBidWJibGVyO1xuXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmNvbnRhaW5lci5vcHRpb25zO1xuXG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlLnNoYXBlID09PSBTaGFwZVR5cGUuY2hhciB8fCBwYXJ0aWNsZS5zaGFwZSA9PT0gU2hhcGVUeXBlLmNoYXJhY3Rlcikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zLnBhcnRpY2xlcy5zaGFwZS5jaGFyYWN0ZXIudmFsdWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gdmFsdWVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdmFsdWUubGVuZ3RoKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHN1YkRyYXdTaGFwZShjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgc3RhcnQ6IElDb29yZGluYXRlcywgc2lkZTogSVNpZGUpOiB2b2lkIHtcbiAgICAgICAgLy8gQnkgUHJvZ3JhbW1pbmcgVGhvbWFzIC0gaHR0cHM6Ly9wcm9ncmFtbWluZ3Rob21hcy53b3JkcHJlc3MuY29tLzIwMTMvMDQvMDMvbi1zaWRlZC1zaGFwZXMvXG4gICAgICAgIGNvbnN0IHNpZGVDb3VudCA9IHNpZGUuY291bnQubnVtZXJhdG9yICogc2lkZS5jb3VudC5kZW5vbWluYXRvcjtcbiAgICAgICAgY29uc3QgZGVjaW1hbFNpZGVzID0gc2lkZS5jb3VudC5udW1lcmF0b3IgLyBzaWRlLmNvdW50LmRlbm9taW5hdG9yO1xuICAgICAgICBjb25zdCBpbnRlcmlvckFuZ2xlRGVncmVlcyA9ICgxODAgKiAoZGVjaW1hbFNpZGVzIC0gMikpIC8gZGVjaW1hbFNpZGVzO1xuICAgICAgICBjb25zdCBpbnRlcmlvckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgKiBpbnRlcmlvckFuZ2xlRGVncmVlcyAvIDE4MDsgLy8gY29udmVydCB0byByYWRpYW5zXG5cbiAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgudHJhbnNsYXRlKHN0YXJ0LngsIHN0YXJ0LnkpO1xuICAgICAgICBjdHgubW92ZVRvKDAsIDApO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2lkZUNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGN0eC5saW5lVG8oc2lkZS5sZW5ndGgsIDApO1xuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShzaWRlLmxlbmd0aCwgMCk7XG4gICAgICAgICAgICBjdHgucm90YXRlKGludGVyaW9yQW5nbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYy5zdHJva2UoKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhdygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXI7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBjb250YWluZXIub3B0aW9ucztcbiAgICAgICAgY29uc3QgcGFydGljbGUgPSB0aGlzLnBhcnRpY2xlO1xuXG4gICAgICAgIGxldCByYWRpdXM6IG51bWJlcjtcbiAgICAgICAgbGV0IG9wYWNpdHk6IG51bWJlcjtcbiAgICAgICAgbGV0IGNvbG9yVmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAodGhpcy5idWJibGVyLnJhZGl1cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByYWRpdXMgPSB0aGlzLmJ1YmJsZXIucmFkaXVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmFkaXVzID0gcGFydGljbGUucmFkaXVzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYnViYmxlci5vcGFjaXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wYWNpdHkgPSB0aGlzLmJ1YmJsZXIub3BhY2l0eTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wYWNpdHkgPSBwYXJ0aWNsZS5vcGFjaXR5LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcnRpY2xlLmNvbG9yKSB7XG4gICAgICAgICAgICBjb2xvclZhbHVlID0gYHJnYmEoJHtwYXJ0aWNsZS5jb2xvci5yfSwgJHtwYXJ0aWNsZS5jb2xvci5nfSwgJHtwYXJ0aWNsZS5jb2xvci5ifSwgJHtvcGFjaXR5fSlgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb250YWluZXIuY2FudmFzLmNvbnRleHQgfHwgIWNvbG9yVmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN0eCA9IGNvbnRhaW5lci5jYW52YXMuY29udGV4dDtcbiAgICAgICAgY3R4LnNhdmUoKTtcblxuICAgICAgICAvLyBUT0RPOiBQZXJmb3JtYW5jZSBpc3N1ZXMsIHRoZSBjYW52YXMgc2hhZG93IGlzIHJlYWxseSBzbG93XG4gICAgICAgIC8vIGNvbnN0IHNoYWRvdyA9IG9wdGlvbnMucGFydGljbGVzLnNoYWRvdztcblxuICAgICAgICAvLyBpZiAoc2hhZG93LmVuYWJsZSkge1xuICAgICAgICAvLyAgICAgY3R4LnNoYWRvd0JsdXIgPSBzaGFkb3cuYmx1cjtcbiAgICAgICAgLy8gICAgIGN0eC5zaGFkb3dDb2xvciA9IHNoYWRvdy5jb2xvcjtcbiAgICAgICAgLy8gICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gc2hhZG93Lm9mZnNldC54O1xuICAgICAgICAvLyAgICAgY3R4LnNoYWRvd09mZnNldFkgPSBzaGFkb3cub2Zmc2V0Lnk7XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICBkZWxldGUgY3R4LnNoYWRvd0JsdXI7XG4gICAgICAgIC8vICAgICBkZWxldGUgY3R4LnNoYWRvd0NvbG9yO1xuICAgICAgICAvLyAgICAgZGVsZXRlIGN0eC5zaGFkb3dPZmZzZXRYO1xuICAgICAgICAvLyAgICAgZGVsZXRlIGN0eC5zaGFkb3dPZmZzZXRZO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yVmFsdWU7XG5cbiAgICAgICAgY29uc3QgcG9zID0ge1xuICAgICAgICAgICAgeDogcGFydGljbGUucG9zaXRpb24ueCxcbiAgICAgICAgICAgIHk6IHBhcnRpY2xlLnBvc2l0aW9uLnksXG4gICAgICAgIH07XG5cbiAgICAgICAgY3R4LnRyYW5zbGF0ZShwb3MueCwgcG9zLnkpO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgaWYgKHBhcnRpY2xlLmFuZ2xlICE9PSAwKSB7XG4gICAgICAgICAgICBjdHgucm90YXRlKHBhcnRpY2xlLmFuZ2xlICogTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5iYWNrZ3JvdW5kTWFzay5lbmFibGUpIHtcbiAgICAgICAgICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3V0JztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKHJhZGl1cyk7XG5cbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgICAgIGlmIChvcHRpb25zLnBhcnRpY2xlcy5zaGFwZS5zdHJva2Uud2lkdGggPiAwKSB7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBvcHRpb25zLnBhcnRpY2xlcy5zaGFwZS5zdHJva2UuY29sb3I7XG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5wYXJ0aWNsZXMuc2hhcGUuc3Ryb2tlLndpZHRoO1xuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdTaGFwZShyYWRpdXM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcjtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRhaW5lci5vcHRpb25zO1xuICAgICAgICBjb25zdCBwYXJ0aWNsZSA9IHRoaXMucGFydGljbGU7XG4gICAgICAgIGNvbnN0IGN0eCA9IGNvbnRhaW5lci5jYW52YXMuY29udGV4dDtcblxuICAgICAgICBpZiAoIWN0eCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zID0ge1xuICAgICAgICAgICAgeDogcGFydGljbGUub2Zmc2V0LngsXG4gICAgICAgICAgICB5OiBwYXJ0aWNsZS5vZmZzZXQueSxcbiAgICAgICAgfTtcblxuICAgICAgICBzd2l0Y2ggKHBhcnRpY2xlLnNoYXBlKSB7XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5saW5lOlxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCwgMCk7XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbygwLCByYWRpdXMpO1xuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IG9wdGlvbnMucGFydGljbGVzLnNoYXBlLnN0cm9rZS5jb2xvcjtcbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5wYXJ0aWNsZXMuc2hhcGUuc3Ryb2tlLndpZHRoO1xuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuY2lyY2xlOlxuICAgICAgICAgICAgICAgIGN0eC5hcmMocG9zLngsIHBvcy55LCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5lZGdlOlxuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuc3F1YXJlOlxuICAgICAgICAgICAgICAgIGN0eC5yZWN0KC1yYWRpdXMsIC1yYWRpdXMsIHJhZGl1cyAqIDIsIHJhZGl1cyAqIDIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUudHJpYW5nbGU6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydDogSUNvb3JkaW5hdGVzID0ge1xuICAgICAgICAgICAgICAgICAgICB4OiAtcmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICB5OiByYWRpdXMgLyAxLjY2LFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzaWRlOiBJU2lkZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbm9taW5hdG9yOiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtZXJhdG9yOiAzLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IHJhZGl1cyAqIDIsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIERyYXdlci5zdWJEcmF3U2hhcGUoY3R4LCBzdGFydCwgc2lkZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5wb2x5Z29uOiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQ6IElDb29yZGluYXRlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgeDogLXJhZGl1cyAvIChvcHRpb25zLnBhcnRpY2xlcy5zaGFwZS5wb2x5Z29uLnNpZGVzIC8gMy41KSxcbiAgICAgICAgICAgICAgICAgICAgeTogLXJhZGl1cyAvICgyLjY2IC8gMy41KSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpZGU6IElTaWRlID0ge1xuICAgICAgICAgICAgICAgICAgICBjb3VudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVub21pbmF0b3I6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBudW1lcmF0b3I6IG9wdGlvbnMucGFydGljbGVzLnNoYXBlLnBvbHlnb24uc2lkZXMsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogcmFkaXVzICogMi42NiAvIChvcHRpb25zLnBhcnRpY2xlcy5zaGFwZS5wb2x5Z29uLnNpZGVzIC8gMyksXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIERyYXdlci5zdWJEcmF3U2hhcGUoY3R4LCBzdGFydCwgc2lkZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5zdGFyOiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQ6IElDb29yZGluYXRlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgeDogLXJhZGl1cyAqIDIgLyAob3B0aW9ucy5wYXJ0aWNsZXMuc2hhcGUucG9seWdvbi5zaWRlcyAvIDQpLFxuICAgICAgICAgICAgICAgICAgICB5OiAtcmFkaXVzIC8gKDIgKiAyLjY2IC8gMy41KSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpZGU6IElTaWRlID0ge1xuICAgICAgICAgICAgICAgICAgICBjb3VudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVub21pbmF0b3I6IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBudW1lcmF0b3I6IG9wdGlvbnMucGFydGljbGVzLnNoYXBlLnBvbHlnb24uc2lkZXMsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogcmFkaXVzICogMiAqIDIuNjYgLyAob3B0aW9ucy5wYXJ0aWNsZXMuc2hhcGUucG9seWdvbi5zaWRlcyAvIDMpLFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBEcmF3ZXIuc3ViRHJhd1NoYXBlKGN0eCwgc3RhcnQsIHNpZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5oZWFydDoge1xuICAgICAgICAgICAgICAgIGNvbnN0IHggPSAtcmFkaXVzIC8gMjtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gLXJhZGl1cyAvIDI7XG5cbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHgsIHkgKyByYWRpdXMgLyA0KTtcbiAgICAgICAgICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgcmFkaXVzIC8gNCwgeSk7XG4gICAgICAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHJhZGl1cyAvIDIsIHksIHggKyByYWRpdXMgLyAyLCB5ICsgcmFkaXVzIC8gNCk7XG4gICAgICAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHJhZGl1cyAvIDIsIHksIHggKyByYWRpdXMgKiAzIC8gNCwgeSk7XG4gICAgICAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHJhZGl1cywgeSwgeCArIHJhZGl1cywgeSArIHJhZGl1cyAvIDQpO1xuICAgICAgICAgICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyByYWRpdXMsIHkgKyByYWRpdXMgLyAyLCB4ICsgcmFkaXVzICogMyAvIDQsIHkgKyByYWRpdXMgKiAzIC8gNCk7XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzIC8gMiwgeSArIHJhZGl1cyk7XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzIC8gNCwgeSArIHJhZGl1cyAqIDMgLyA0KTtcbiAgICAgICAgICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5ICsgcmFkaXVzIC8gMiwgeCwgeSArIHJhZGl1cyAvIDQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5jaGFyOlxuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuY2hhcmFjdGVyOiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBvcHRpb25zLnBhcnRpY2xlcy5zaGFwZS5jaGFyYWN0ZXIuc3R5bGU7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2VpZ2h0ID0gb3B0aW9ucy5wYXJ0aWNsZXMuc2hhcGUuY2hhcmFjdGVyLndlaWdodDtcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gTWF0aC5yb3VuZChyYWRpdXMpICogMjtcbiAgICAgICAgICAgICAgICBjb25zdCBmb250ID0gb3B0aW9ucy5wYXJ0aWNsZXMuc2hhcGUuY2hhcmFjdGVyLmZvbnQ7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMudGV4dDtcblxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gYCR7c3R5bGV9ICR7d2VpZ2h0fSAke3NpemV9cHggJHtmb250fWA7XG5cbiAgICAgICAgICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gLXJhZGl1cyAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHkgPSByYWRpdXMgLyAyO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnBhcnRpY2xlcy5zaGFwZS5jaGFyYWN0ZXIuZmlsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVRleHQodGV4dCwgeCwgeSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgU2hhcGVUeXBlLmltYWdlOlxuICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5pbWFnZSAmJiBwYXJ0aWNsZS5pbWFnZS5kYXRhLm9iaikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YkRyYXcoY3R4LCBwYXJ0aWNsZS5pbWFnZS5kYXRhLm9iaiwgcmFkaXVzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3ViRHJhdyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgaW1nT2JqOiBIVE1MSW1hZ2VFbGVtZW50LCByYWRpdXM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBwYXJ0aWNsZSA9IHRoaXMucGFydGljbGU7XG5cbiAgICAgICAgbGV0IHJhdGlvID0gMTtcblxuICAgICAgICBpZiAocGFydGljbGUuaW1hZ2UpIHtcbiAgICAgICAgICAgIHJhdGlvID0gcGFydGljbGUuaW1hZ2UucmF0aW87XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB7XG4gICAgICAgICAgICB4OiAtcmFkaXVzLFxuICAgICAgICAgICAgeTogLXJhZGl1cyxcbiAgICAgICAgfTtcblxuICAgICAgICBjdHguZHJhd0ltYWdlKGltZ09iaiwgcG9zLngsIHBvcy55LCByYWRpdXMgKiAyLCByYWRpdXMgKiAyIC8gcmF0aW8pO1xuICAgIH1cbn1cbiJdfQ==