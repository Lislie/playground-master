!function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {exports: {}};
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }

    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    s
}({
    1: [function (require, module, exports) {
        "use strict";

        function shuffle(array) {
            for (var counter = array.length, temp = 0, index = 0; counter > 0;) index = Math.floor(Math.random() * counter), counter--, temp = array[counter], array[counter] = array[index], array[index] = temp
        }

        function classifyTwoGaussData(numSamples, noise) {
            function genGauss(cx, cy, label) {
                for (var i = 0; i < numSamples / 2; i++) {
                    var x = normalRandom(cx, variance), y = normalRandom(cy, variance);
                    points.push({x: x, y: y, label: label})
                }
            }

            var points = [], varianceScale = d3.scale.linear().domain([0, .5]).range([.5, 4]),
                variance = varianceScale(noise);
            return genGauss(2, 2, 1), genGauss(-2, -2, -1), points
        }

        function regressPlane(numSamples, noise) {
            for (var labelScale = d3.scale.linear().domain([-10, 10]).range([-1, 1]), getLabel = function (x, y) {
                return labelScale(x + y)
            }, points = [], i = 0; i < numSamples; i++) {
                var x = randUniform(-6, 6), y = randUniform(-6, 6), noiseX = randUniform(-6, 6) * noise,
                    noiseY = randUniform(-6, 6) * noise, label = getLabel(x + noiseX, y + noiseY);
                points.push({x: x, y: y, label: label})
            }
            return points
        }

        function regressGaussian(numSamples, noise) {
            function getLabel(x, y) {
                var label = 0;
                return gaussians.forEach(function (_a) {
                    var cx = _a[0], cy = _a[1], sign = _a[2],
                        newLabel = sign * labelScale(dist({x: x, y: y}, {x: cx, y: cy}));
                    Math.abs(newLabel) > Math.abs(label) && (label = newLabel)
                }), label
            }

            for (var points = [], labelScale = d3.scale.linear().domain([0, 2]).range([1, 0]).clamp(!0), gaussians = [[-4, 2.5, 1], [0, 2.5, -1], [4, 2.5, 1], [-4, -2.5, -1], [0, -2.5, 1], [4, -2.5, -1]], i = 0; i < numSamples; i++) {
                var x = randUniform(-6, 6), y = randUniform(-6, 6), noiseX = randUniform(-6, 6) * noise,
                    noiseY = randUniform(-6, 6) * noise, label = getLabel(x + noiseX, y + noiseY);
                points.push({x: x, y: y, label: label})
            }
            return points
        }

        function classifySpiralData(numSamples, noise) {
            function genSpiral(deltaT, label) {
                for (var i = 0; i < n; i++) {
                    var r = i / n * 5, t = 1.75 * i / n * 2 * Math.PI + deltaT,
                        x = r * Math.sin(t) + randUniform(-1, 1) * noise,
                        y = r * Math.cos(t) + randUniform(-1, 1) * noise;
                    points.push({x: x, y: y, label: label})
                }
            }

            var points = [], n = numSamples / 2;
            return genSpiral(0, 1), genSpiral(Math.PI, -1), points
        }

        function classifyCircleData(numSamples, noise) {
            function getCircleLabel(p, center) {
                return dist(p, center) < 2.5 ? 1 : -1
            }

            for (var points = [], i = 0; i < numSamples / 2; i++) {
                var r = randUniform(0, 2.5), angle = randUniform(0, 2 * Math.PI), x = r * Math.sin(angle),
                    y = r * Math.cos(angle), noiseX = randUniform(-5, 5) * noise, noiseY = randUniform(-5, 5) * noise,
                    label = getCircleLabel({x: x + noiseX, y: y + noiseY}, {x: 0, y: 0});
                points.push({x: x, y: y, label: label})
            }
            for (var i = 0; i < numSamples / 2; i++) {
                var r = randUniform(3.5, 5), angle = randUniform(0, 2 * Math.PI), x = r * Math.sin(angle),
                    y = r * Math.cos(angle), noiseX = randUniform(-5, 5) * noise, noiseY = randUniform(-5, 5) * noise,
                    label = getCircleLabel({x: x + noiseX, y: y + noiseY}, {x: 0, y: 0});
                points.push({x: x, y: y, label: label})
            }
            return points
        }

        function classifyXORData(numSamples, noise) {
            function getXORLabel(p) {
                return p.x * p.y >= 0 ? 1 : -1
            }

            for (var points = [], i = 0; i < numSamples; i++) {
                var x = randUniform(-5, 5);
                x += x > 0 ? .3 : -.3;
                var y = randUniform(-5, 5);
                y += y > 0 ? .3 : -.3;
                var noiseX = randUniform(-5, 5) * noise, noiseY = randUniform(-5, 5) * noise,
                    label = getXORLabel({x: x + noiseX, y: y + noiseY});
                points.push({x: x, y: y, label: label})
            }
            return points
        }

        function randUniform(a, b) {
            return Math.random() * (b - a) + a
        }

        function normalRandom(mean, variance) {
            void 0 === mean && (mean = 0), void 0 === variance && (variance = 1);
            var v1, v2, s;
            do v1 = 2 * Math.random() - 1, v2 = 2 * Math.random() - 1, s = v1 * v1 + v2 * v2; while (s > 1);
            var result = Math.sqrt(-2 * Math.log(s) / s) * v1;
            return mean + Math.sqrt(variance) * result
        }

        function dist(a, b) {
            var dx = a.x - b.x, dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy)
        }

        exports.shuffle = shuffle, exports.classifyTwoGaussData = classifyTwoGaussData, exports.regressPlane = regressPlane, exports.regressGaussian = regressGaussian, exports.classifySpiralData = classifySpiralData, exports.classifyCircleData = classifyCircleData, exports.classifyXORData = classifyXORData
    }, {}],
    2: [function (require, module, exports) {
        "use strict";

        function reduceMatrix(matrix, factor) {
            if (matrix.length !== matrix[0].length) throw new Error("The provided matrix must be a square matrix");
            if (matrix.length % factor != 0) throw new Error("The width/height of the matrix must be divisible by the reduction factor");
            for (var result = new Array(matrix.length / factor), i = 0; i < matrix.length; i += factor) {
                result[i / factor] = new Array(matrix.length / factor);
                for (var j = 0; j < matrix.length; j += factor) {
                    for (var avg = 0, k = 0; k < factor; k++) for (var l = 0; l < factor; l++) avg += matrix[i + k][j + l];
                    avg /= factor * factor, result[i / factor][j / factor] = avg
                }
            }
            return result
        }

        var HeatMap = function () {
            function HeatMap(width, numSamples, xDomain, yDomain, container, userSettings) {
                this.settings = {showAxes: !1, noSvg: !1}, this.numSamples = numSamples;
                var height = width, padding = userSettings.showAxes ? 20 : 0;
                if (null != userSettings) for (var prop in userSettings) this.settings[prop] = userSettings[prop];
                this.xScale = d3.scale.linear().domain(xDomain).range([0, width - 2 * padding]), this.yScale = d3.scale.linear().domain(yDomain).range([height - 2 * padding, 0]);
                var tmpScale = d3.scale.linear().domain([0, .5, 1]).range(["#f59322", "#e8eaeb", "#0877bd"]).clamp(!0),
                    colors = d3.range(0, 1 + 1e-9, 1 / 30).map(function (a) {
                        return tmpScale(a)
                    });
                if (this.color = d3.scale.quantize().domain([-1, 1]).range(colors), container = container.append("div").style({
                    width: width + "px",
                    height: height + "px",
                    position: "relative",
                    top: "-" + padding + "px",
                    left: "-" + padding + "px"
                }), this.canvas = container.append("canvas").attr("width", numSamples).attr("height", numSamples).style("width", width - 2 * padding + "px").style("height", height - 2 * padding + "px").style("position", "absolute").style("top", padding + "px").style("left", padding + "px"), this.settings.noSvg || (this.svg = container.append("svg").attr({
                    width: width,
                    height: height
                }).style({
                    position: "absolute",
                    left: "0",
                    top: "0"
                }).append("g").attr("transform", "translate(" + padding + "," + padding + ")"), this.svg.append("g").attr("class", "train"), this.svg.append("g").attr("class", "test")), this.settings.showAxes) {
                    var xAxis = d3.svg.axis().scale(this.xScale).orient("bottom"),
                        yAxis = d3.svg.axis().scale(this.yScale).orient("right");
                    this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + (height - 2 * padding) + ")").call(xAxis), this.svg.append("g").attr("class", "y axis").attr("transform", "translate(" + (width - 2 * padding) + ",0)").call(yAxis)
                }
            }

            return HeatMap.prototype.updateTestPoints = function (points) {
                if (this.settings.noSvg) throw Error("Can't add points since noSvg=true");
                this.updateCircles(this.svg.select("g.test"), points)
            }, HeatMap.prototype.updatePoints = function (points) {
                if (this.settings.noSvg) throw Error("Can't add points since noSvg=true");
                this.updateCircles(this.svg.select("g.train"), points)
            }, HeatMap.prototype.updateBackground = function (data, discretize) {
                var dx = data[0].length, dy = data.length;
                if (dx !== this.numSamples || dy !== this.numSamples) throw new Error("The provided data matrix must be of size numSamples X numSamples");
                for (var context = this.canvas.node().getContext("2d"), image = context.createImageData(dx, dy), y = 0, p = -1; y < dy; ++y) for (var x = 0; x < dx; ++x) {
                    var value = data[x][y];
                    discretize && (value = value >= 0 ? 1 : -1);
                    var c = d3.rgb(this.color(value));
                    image.data[++p] = c.r, image.data[++p] = c.g, image.data[++p] = c.b, image.data[++p] = 160
                }
                context.putImageData(image, 0, 0)
            }, HeatMap.prototype.updateCircles = function (container, points) {
                var _this = this, xDomain = this.xScale.domain(), yDomain = this.yScale.domain();
                points = points.filter(function (p) {
                    return p.x >= xDomain[0] && p.x <= xDomain[1] && p.y >= yDomain[0] && p.y <= yDomain[1]
                });
                var selection = container.selectAll("circle").data(points);
                selection.enter().append("circle").attr("r", 3), selection.attr({
                    cx: function (d) {
                        return _this.xScale(d.x)
                    }, cy: function (d) {
                        return _this.yScale(d.y)
                    }
                }).style("fill", function (d) {
                    return _this.color(d.label)
                }), selection.exit().remove()
            }, HeatMap
        }();
        exports.HeatMap = HeatMap, exports.reduceMatrix = reduceMatrix
    }, {}],
    3: [function (require, module, exports) {
        "use strict";
        var AppendingLineChart = function () {
            function AppendingLineChart(container, lineColors) {
                this.data = [], this.minY = Number.MAX_VALUE, this.maxY = Number.MIN_VALUE, this.lineColors = lineColors, this.numLines = lineColors.length;
                var node = container.node(), totalWidth = node.offsetWidth, totalHeight = node.offsetHeight,
                    margin = {top: 2, right: 0, bottom: 2, left: 2}, width = totalWidth - margin.left - margin.right,
                    height = totalHeight - margin.top - margin.bottom;
                this.xScale = d3.scale.linear().domain([0, 0]).range([0, width]), this.yScale = d3.scale.linear().domain([0, 0]).range([height, 0]), this.svg = container.append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"), this.paths = new Array(this.numLines);
                for (var i = 0; i < this.numLines; i++) this.paths[i] = this.svg.append("path").attr("class", "line").style({
                    fill: "none",
                    stroke: lineColors[i],
                    "stroke-width": "1.5px"
                })
            }

            return AppendingLineChart.prototype.reset = function () {
                this.data = [], this.redraw(), this.minY = Number.MAX_VALUE, this.maxY = Number.MIN_VALUE
            }, AppendingLineChart.prototype.addDataPoint = function (dataPoint) {
                var _this = this;
                if (dataPoint.length !== this.numLines) throw Error("Length of dataPoint must equal number of lines");
                dataPoint.forEach(function (y) {
                    _this.minY = Math.min(_this.minY, y), _this.maxY = Math.max(_this.maxY, y)
                }), this.data.push({x: this.data.length + 1, y: dataPoint}), this.redraw()
            }, AppendingLineChart.prototype.redraw = function () {
                var _this = this;
                this.xScale.domain([1, this.data.length]), this.yScale.domain([this.minY, this.maxY]);
                for (var getPathMap = function (lineIndex) {
                    return d3.svg.line().x(function (d) {
                        return _this.xScale(d.x)
                    }).y(function (d) {
                        return _this.yScale(d.y[lineIndex])
                    })
                }, i = 0; i < this.numLines; i++) this.paths[i].datum(this.data).attr("d", getPathMap(i))
            }, AppendingLineChart
        }();
        exports.AppendingLineChart = AppendingLineChart
    }, {}],
    4: [function (require, module, exports) {
        "use strict";

        function buildNetwork(networkShape, activation, outputActivation, regularization, inputIds, initZero) {
            for (var numLayers = networkShape.length, id = 1, network = [], layerIdx = 0; layerIdx < numLayers; layerIdx++) {
                var isOutputLayer = layerIdx === numLayers - 1, isInputLayer = 0 === layerIdx, currentLayer = [];
                network.push(currentLayer);
                for (var numNodes = networkShape[layerIdx], i = 0; i < numNodes; i++) {
                    var nodeId = id.toString();
                    isInputLayer ? nodeId = inputIds[i] : id++;
                    var node = new Node(nodeId, isOutputLayer ? outputActivation : activation, initZero);
                    if (currentLayer.push(node), layerIdx >= 1) for (var j = 0; j < network[layerIdx - 1].length; j++) {
                        var prevNode = network[layerIdx - 1][j],
                            link = new Link(prevNode, node, regularization, initZero);
                        prevNode.outputs.push(link), node.inputLinks.push(link)
                    }
                }
            }
            return network
        }

        function forwardProp(network, inputs) {
            var inputLayer = network[0];
            if (inputs.length !== inputLayer.length) throw new Error("The number of inputs must match the number of nodes in the input layer");
            for (var i = 0; i < inputLayer.length; i++) {
                var node = inputLayer[i];
                node.output = inputs[i]
            }
            for (var layerIdx = 1; layerIdx < network.length; layerIdx++) for (var currentLayer = network[layerIdx], i = 0; i < currentLayer.length; i++) {
                var node = currentLayer[i];
                node.updateOutput()
            }
            return network[network.length - 1][0].output
        }

        function backProp(network, target, errorFunc) {
            var outputNode = network[network.length - 1][0];
            outputNode.outputDer = errorFunc.der(outputNode.output, target);
            for (var layerIdx = network.length - 1; layerIdx >= 1; layerIdx--) {
                for (var currentLayer = network[layerIdx], i = 0; i < currentLayer.length; i++) {
                    var node = currentLayer[i];
                    node.inputDer = node.outputDer * node.activation.der(node.totalInput), node.accInputDer += node.inputDer, node.numAccumulatedDers++
                }
                for (var i = 0; i < currentLayer.length; i++) for (var node = currentLayer[i], j = 0; j < node.inputLinks.length; j++) {
                    var link = node.inputLinks[j];
                    link.isDead || (link.errorDer = node.inputDer * link.source.output, link.accErrorDer += link.errorDer, link.numAccumulatedDers++)
                }
                if (1 !== layerIdx) for (var prevLayer = network[layerIdx - 1], i = 0; i < prevLayer.length; i++) {
                    var node = prevLayer[i];
                    node.outputDer = 0;
                    for (var j = 0; j < node.outputs.length; j++) {
                        var output = node.outputs[j];
                        node.outputDer += output.weight * output.dest.inputDer
                    }
                }
            }
        }

        function updateWeights(network, learningRate, regularizationRate) {
            for (var layerIdx = 1; layerIdx < network.length; layerIdx++) for (var currentLayer = network[layerIdx], i = 0; i < currentLayer.length; i++) {
                var node = currentLayer[i];
                node.numAccumulatedDers > 0 && (node.bias -= learningRate * node.accInputDer / node.numAccumulatedDers, node.accInputDer = 0, node.numAccumulatedDers = 0);
                for (var j = 0; j < node.inputLinks.length; j++) {
                    var link = node.inputLinks[j];
                    if (!link.isDead) {
                        var regulDer = link.regularization ? link.regularization.der(link.weight) : 0;
                        if (link.numAccumulatedDers > 0) {
                            link.weight = link.weight - learningRate / link.numAccumulatedDers * link.accErrorDer;
                            var newLinkWeight = link.weight - learningRate * regularizationRate * regulDer;
                            link.regularization === RegularizationFunction.L1 && link.weight * newLinkWeight < 0 ? (link.weight = 0, link.isDead = !0) : link.weight = newLinkWeight, link.accErrorDer = 0, link.numAccumulatedDers = 0
                        }
                    }
                }
            }
        }

        function forEachNode(network, ignoreInputs, accessor) {
            for (var layerIdx = ignoreInputs ? 1 : 0; layerIdx < network.length; layerIdx++) for (var currentLayer = network[layerIdx], i = 0; i < currentLayer.length; i++) {
                var node = currentLayer[i];
                accessor(node)
            }
        }

        function getOutputNode(network) {
            return network[network.length - 1][0]
        }

        var Node = function () {
            function Node(id, activation, initZero) {
                this.inputLinks = [], this.bias = .1, this.outputs = [], this.outputDer = 0, this.inputDer = 0, this.accInputDer = 0, this.numAccumulatedDers = 0, this.id = id, this.activation = activation, initZero && (this.bias = 0)
            }

            return Node.prototype.updateOutput = function () {
                this.totalInput = this.bias;
                for (var j = 0; j < this.inputLinks.length; j++) {
                    var link = this.inputLinks[j];
                    this.totalInput += link.weight * link.source.output
                }
                return this.output = this.activation.output(this.totalInput), this.output
            }, Node
        }();
        exports.Node = Node;
        var Errors = function () {
            function Errors() {
            }

            return Errors
        }();
        Errors.SQUARE = {
            error: function (output, target) {
                return .5 * Math.pow(output - target, 2)
            }, der: function (output, target) {
                return output - target
            }
        }, exports.Errors = Errors, Math.tanh = Math.tanh || function (x) {
            if (x === 1 / 0) return 1;
            if (x === -(1 / 0)) return -1;
            var e2x = Math.exp(2 * x);
            return (e2x - 1) / (e2x + 1)
        };
        var Activations = function () {
            function Activations() {
            }

            return Activations
        }();
        Activations.TANH = {
            output: function (x) {
                return Math.tanh(x)
            }, der: function (x) {
                var output = Activations.TANH.output(x);
                return 1 - output * output
            }
        }, Activations.RELU = {
            output: function (x) {
                return Math.max(0, x)
            }, der: function (x) {
                return x <= 0 ? 0 : 1
            }
        }, Activations.SIGMOID = {
            output: function (x) {
                return 1 / (1 + Math.exp(-x))
            }, der: function (x) {
                var output = Activations.SIGMOID.output(x);
                return output * (1 - output)
            }
        }, Activations.LINEAR = {
            output: function (x) {
                return x
            }, der: function (x) {
                return 1
            }
        }, exports.Activations = Activations;
        var RegularizationFunction = function () {
            function RegularizationFunction() {
            }

            return RegularizationFunction
        }();
        RegularizationFunction.L1 = {
            output: function (w) {
                return Math.abs(w)
            }, der: function (w) {
                return w < 0 ? -1 : w > 0 ? 1 : 0
            }
        }, RegularizationFunction.L2 = {
            output: function (w) {
                return .5 * w * w
            }, der: function (w) {
                return w
            }
        }, exports.RegularizationFunction = RegularizationFunction;
        var Link = function () {
            function Link(source, dest, regularization, initZero) {
                this.weight = Math.random() - .5, this.isDead = !1, this.errorDer = 0, this.accErrorDer = 0, this.numAccumulatedDers = 0, this.id = source.id + "-" + dest.id, this.source = source, this.dest = dest, this.regularization = regularization, initZero && (this.weight = 0)
            }

            return Link
        }();
        exports.Link = Link, exports.buildNetwork = buildNetwork, exports.forwardProp = forwardProp, exports.backProp = backProp, exports.updateWeights = updateWeights, exports.forEachNode = forEachNode, exports.getOutputNode = getOutputNode
    }, {}],
    5: [function (require, module, exports) {
        "use strict";

        function scrollTween(offset) {
            return function () {
                var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
                return function (t) {
                    scrollTo(0, i(t))
                }
            }
        }

        function makeGUI() {
            d3.select("#reset-button").on("click", function () {
                reset(), userHasInteracted(), d3.select("#play-pause-button")
            }), d3.select("#play-pause-button").on("click", function () {
                userHasInteracted(), player.playOrPause()
            }), player.onPlayPause(function (isPlaying) {
                d3.select("#play-pause-button").classed("playing", isPlaying)
            }), d3.select("#next-step-button").on("click", function () {
                player.pause(), userHasInteracted(), 0 === iter && simulationStarted(), oneStep()
            }), d3.select("#data-regen-button").on("click", function () {
                generateData(), parametersChanged = !0
            });
            var dataThumbnails = d3.selectAll("canvas[data-dataset]");
            dataThumbnails.on("click", function () {
                var newDataset = state_1.datasets[this.dataset.dataset];
                newDataset !== state.dataset && (state.dataset = newDataset, dataThumbnails.classed("selected", !1), d3.select(this).classed("selected", !0), generateData(), parametersChanged = !0, reset())
            });
            var datasetKey = state_1.getKeyFromValue(state_1.datasets, state.dataset);
            d3.select("canvas[data-dataset=" + datasetKey + "]").classed("selected", !0);
            var regDataThumbnails = d3.selectAll("canvas[data-regDataset]");
            regDataThumbnails.on("click", function () {
                var newDataset = state_1.regDatasets[this.dataset.regdataset];
                newDataset !== state.regDataset && (state.regDataset = newDataset, regDataThumbnails.classed("selected", !1), d3.select(this).classed("selected", !0), generateData(), parametersChanged = !0, reset())
            });
            var regDatasetKey = state_1.getKeyFromValue(state_1.regDatasets, state.regDataset);
            d3.select("canvas[data-regDataset=" + regDatasetKey + "]").classed("selected", !0), d3.select("#add-layers").on("click", function () {
                state.numHiddenLayers >= 6 || (state.networkShape[state.numHiddenLayers] = 2, state.numHiddenLayers++, parametersChanged = !0, reset())
            }), d3.select("#remove-layers").on("click", function () {
                state.numHiddenLayers <= 0 || (state.numHiddenLayers--, state.networkShape.splice(state.numHiddenLayers), parametersChanged = !0, reset())
            }), d3.select("#show-test-data").on("change", function () {
                state.showTestData = this.checked, state.serialize(), userHasInteracted(), heatMap.updateTestPoints(state.showTestData ? testData : [])
            }).property("checked", state.showTestData), d3.select("#discretize").on("change", function () {
                state.discretize = this.checked, state.serialize(), userHasInteracted(), updateUI()
            }).property("checked", state.discretize), d3.select("#percTrainData").on("input", function () {
                state.percTrainData = this.value, d3.select("label[for='percTrainData'] .value").text(this.value), generateData(), parametersChanged = !0, reset()
            }).property("value", state.percTrainData), d3.select("label[for='percTrainData'] .value").text(state.percTrainData), d3.select("#noise").on("input", function () {
                state.noise = this.value, d3.select("label[for='noise'] .value").text(this.value), generateData(), parametersChanged = !0, reset()
            }).property("value", state.noise), d3.select("label[for='noise'] .value").text(state.noise), d3.select("#batchSize").on("input", function () {
                state.batchSize = this.value, d3.select("label[for='batchSize'] .value").text(this.value), parametersChanged = !0, reset()
            }).property("value", state.batchSize), d3.select("label[for='batchSize'] .value").text(state.batchSize), d3.select("#activations").on("change", function () {
                state.activation = state_1.activations[this.value], parametersChanged = !0, reset()
            }).property("value", state_1.getKeyFromValue(state_1.activations, state.activation)), d3.select("#learningRate").on("change", function () {
                state.learningRate = +this.value, state.serialize(), userHasInteracted(), parametersChanged = !0
            }).property("value", state.learningRate), d3.select("#regularizations").on("change", function () {
                state.regularization = state_1.regularizations[this.value], parametersChanged = !0, reset()
            }).property("value", state_1.getKeyFromValue(state_1.regularizations, state.regularization)), d3.select("#regularRate").on("change", function () {
                state.regularizationRate = +this.value, parametersChanged = !0, reset()
            }).property("value", state.regularizationRate), d3.select("#problem").on("change", function () {
                state.problem = state_1.problems[this.value], generateData(), drawDatasetThumbnails(), parametersChanged = !0, reset()
            }).property("value", state_1.getKeyFromValue(state_1.problems, state.problem));
            var x = d3.scale.linear().domain([-1, 1]).range([0, 144]),
                xAxis = d3.svg.axis().scale(x).orient("bottom").tickValues([-1, 0, 1]).tickFormat(d3.format("d"));
            d3.select("#colormap g.core").append("g").attr("class", "x axis").attr("transform", "translate(0,10)").call(xAxis), window.addEventListener("resize", function () {
                var newWidth = document.querySelector("#main-part").getBoundingClientRect().width;
                newWidth !== mainWidth && (mainWidth = newWidth, drawNetwork(network), updateUI(!0))
            }), state.hideText && (d3.select("#article-text").style("display", "none"), d3.select("div.more").style("display", "none"), d3.select("header").style("display", "none"))
        }

        function updateBiasesUI(network) {
            nn.forEachNode(network, !0, function (node) {
                d3.select("rect#bias-" + node.id).style("fill", colorScale(node.bias))
            })
        }

        function updateWeightsUI(network, container) {
            for (var layerIdx = 1; layerIdx < network.length; layerIdx++) for (var currentLayer = network[layerIdx], i = 0; i < currentLayer.length; i++) for (var node = currentLayer[i], j = 0; j < node.inputLinks.length; j++) {
                var link = node.inputLinks[j];
                container.select("#link" + link.source.id + "-" + link.dest.id).style({
                    "stroke-dashoffset": -iter / 3,
                    "stroke-width": linkWidthScale(Math.abs(link.weight)),
                    stroke: colorScale(link.weight)
                }).datum(link)
            }
        }

        function drawNode(cx, cy, nodeId, isInput, container, node) {
            var x = cx - 15, y = cy - 15, nodeGroup = container.append("g").attr({
                class: "node",
                id: "node" + nodeId,
                transform: "translate(" + x + "," + y + ")"
            });
            nodeGroup.append("rect").attr({x: 0, y: 0, width: 30, height: 30});
            var activeOrNotClass = state[nodeId] ? "active" : "inactive";
            if (isInput) {
                var label = null != INPUTS[nodeId].label ? INPUTS[nodeId].label : nodeId,
                    text = nodeGroup.append("text").attr({class: "main-label", x: -10, y: 15, "text-anchor": "end"});
                if (/[_^]/.test(label)) {
                    for (var myRe = /(.*?)([_^])(.)/g, myArray = void 0, lastIndex = void 0; null != (myArray = myRe.exec(label));) {
                        lastIndex = myRe.lastIndex;
                        var prefix = myArray[1], sep = myArray[2], suffix = myArray[3];
                        prefix && text.append("tspan").text(prefix), text.append("tspan").attr("baseline-shift", "_" === sep ? "sub" : "super").style("font-size", "9px").text(suffix)
                    }
                    label.substring(lastIndex) && text.append("tspan").text(label.substring(lastIndex))
                } else text.append("tspan").text(label);
                nodeGroup.classed(activeOrNotClass, !0)
            }
            isInput || nodeGroup.append("rect").attr({
                id: "bias-" + nodeId,
                x: -7,
                y: 28,
                width: 5,
                height: 5
            }).on("mouseenter", function () {
                updateHoverCard(HoverType.BIAS, node, d3.mouse(container.node()))
            }).on("mouseleave", function () {
                updateHoverCard(null)
            });
            var div = d3.select("#network").insert("div", ":first-child").attr({
                id: "canvas-" + nodeId,
                class: "canvas"
            }).style({position: "absolute", left: x + 3 + "px", top: y + 3 + "px"}).on("mouseenter", function () {
                selectedNodeId = nodeId, div.classed("hovered", !0), nodeGroup.classed("hovered", !0), updateDecisionBoundary(network, !1), heatMap.updateBackground(boundary[nodeId], state.discretize)
            }).on("mouseleave", function () {
                selectedNodeId = null, div.classed("hovered", !1), nodeGroup.classed("hovered", !1), updateDecisionBoundary(network, !1), heatMap.updateBackground(boundary[nn.getOutputNode(network).id], state.discretize)
            });
            isInput && (div.on("click", function () {
                state[nodeId] = !state[nodeId], parametersChanged = !0, reset()
            }), div.style("cursor", "pointer")), isInput && div.classed(activeOrNotClass, !0);
            var nodeHeatMap = new heatmap_1.HeatMap(30, 10, xDomain, xDomain, div, {noSvg: !0});
            div.datum({heatmap: nodeHeatMap, id: nodeId})
        }

        function drawNetwork(network) {
            var svg = d3.select("#svg");
            svg.select("g.core").remove(), d3.select("#network").selectAll("div.canvas").remove(), d3.select("#network").selectAll("div.plus-minus-neurons").remove();
            var co = d3.select(".column.output").node(), cf = d3.select(".column.features").node(),
                width = co.offsetLeft - cf.offsetLeft;
            svg.attr("width", width);
            var node2coord = {}, container = svg.append("g").classed("core", !0).attr("transform", "translate(3,3)"),
                numLayers = network.length,
                layerScale = d3.scale.ordinal().domain(d3.range(1, numLayers - 1)).rangePoints([118, width - 30], .7),
                nodeIndexScale = function (nodeIndex) {
                    return 55 * nodeIndex
                }, calloutThumb = d3.select(".callout.thumbnail").style("display", "none"),
                calloutWeights = d3.select(".callout.weights").style("display", "none"), idWithCallout = null,
                targetIdWithCallout = null, cx = 65, nodeIds = Object.keys(INPUTS),
                maxY = nodeIndexScale(nodeIds.length);
            nodeIds.forEach(function (nodeId, i) {
                var cy = nodeIndexScale(i) + 15;
                node2coord[nodeId] = {cx: cx, cy: cy}, drawNode(cx, cy, nodeId, !0, container)
            });
            for (var layerIdx = 1; layerIdx < numLayers - 1; layerIdx++) {
                var numNodes = network[layerIdx].length, cx_1 = layerScale(layerIdx) + 15;
                maxY = Math.max(maxY, nodeIndexScale(numNodes)), addPlusMinusControl(layerScale(layerIdx), layerIdx);
                for (var i = 0; i < numNodes; i++) {
                    var node_1 = network[layerIdx][i], cy_1 = nodeIndexScale(i) + 15;
                    node2coord[node_1.id] = {
                        cx: cx_1,
                        cy: cy_1
                    }, drawNode(cx_1, cy_1, node_1.id, !1, container, node_1);
                    var numNodes_1 = network[layerIdx].length, nextNumNodes = network[layerIdx + 1].length;
                    null == idWithCallout && i === numNodes_1 - 1 && nextNumNodes <= numNodes_1 && (calloutThumb.style({
                        display: null,
                        top: 23 + cy_1 + "px",
                        left: cx_1 + "px"
                    }), idWithCallout = node_1.id);
                    for (var j = 0; j < node_1.inputLinks.length; j++) {
                        var link = node_1.inputLinks[j],
                            path = drawLink(link, node2coord, network, container, 0 === j, j, node_1.inputLinks.length).node(),
                            prevLayer = network[layerIdx - 1], lastNodePrevLayer = prevLayer[prevLayer.length - 1];
                        if (null == targetIdWithCallout && i === numNodes_1 - 1 && link.source.id === lastNodePrevLayer.id && (link.source.id !== idWithCallout || numLayers <= 5) && link.dest.id !== idWithCallout && prevLayer.length >= numNodes_1) {
                            var midPoint = path.getPointAtLength(.7 * path.getTotalLength());
                            calloutWeights.style({
                                display: null,
                                top: midPoint.y + 5 + "px",
                                left: midPoint.x + 3 + "px"
                            }), targetIdWithCallout = link.dest.id
                        }
                    }
                }
            }
            cx = width + 15;
            var node = network[numLayers - 1][0], cy = nodeIndexScale(0) + 15;
            node2coord[node.id] = {cx: cx, cy: cy};
            for (var i = 0; i < node.inputLinks.length; i++) {
                var link = node.inputLinks[i];
                drawLink(link, node2coord, network, container, 0 === i, i, node.inputLinks.length)
            }
            svg.attr("height", maxY);
            var height = Math.max(getRelativeHeight(calloutThumb), getRelativeHeight(calloutWeights), getRelativeHeight(d3.select("#network")));
            d3.select(".column.features").style("height", height + "px")
        }

        function getRelativeHeight(selection) {
            var node = selection.node();
            return node.offsetHeight + node.offsetTop
        }

        function addPlusMinusControl(x, layerIdx) {
            var div = d3.select("#network").append("div").classed("plus-minus-neurons", !0).style("left", x - 10 + "px"),
                i = layerIdx - 1, firstRow = div.append("div").attr("class", "ui-numNodes" + layerIdx);
            firstRow.append("button").attr("class", "mdl-button mdl-js-button mdl-button--icon").on("click", function () {
                state.networkShape[i] >= 8 || (state.networkShape[i]++, parametersChanged = !0, reset())
            }).append("i").attr("class", "material-icons").text("add"), firstRow.append("button").attr("class", "mdl-button mdl-js-button mdl-button--icon").on("click", function () {
                state.networkShape[i] <= 1 || (state.networkShape[i]--, parametersChanged = !0, reset())
            }).append("i").attr("class", "material-icons").text("remove");
            var suffix = state.networkShape[i] > 1 ? "s" : "";
            div.append("div").text(state.networkShape[i] + " neuron" + suffix)
        }

        function updateHoverCard(type, nodeOrLink, coordinates) {
            var hovercard = d3.select("#hovercard");
            if (null == type) return hovercard.style("display", "none"), void d3.select("#svg").on("click", null);
            d3.select("#svg").on("click", function () {
                hovercard.select(".value").style("display", "none");
                var input = hovercard.select("input");
                input.style("display", null), input.on("input", function () {
                    null != this.value && "" !== this.value && (type === HoverType.WEIGHT ? nodeOrLink.weight = +this.value : nodeOrLink.bias = +this.value, updateUI())
                }), input.on("keypress", function () {
                    13 === d3.event.keyCode && updateHoverCard(type, nodeOrLink, coordinates)
                }), input.node().focus()
            });
            var value = type === HoverType.WEIGHT ? nodeOrLink.weight : nodeOrLink.bias,
                name = type === HoverType.WEIGHT ? "Weight" : "Bias";
            hovercard.style({
                left: coordinates[0] + 20 + "px",
                top: coordinates[1] + "px",
                display: "block"
            }), hovercard.select(".type").text(name), hovercard.select(".value").style("display", null).text(value.toPrecision(2)), hovercard.select("input").property("value", value.toPrecision(2)).style("display", "none")
        }

        function drawLink(input, node2coord, network, container, isFirst, index, length) {
            var line = container.insert("path", ":first-child"), source = node2coord[input.source.id],
                dest = node2coord[input.dest.id], datum = {
                    source: {y: source.cx + 15 + 2, x: source.cy},
                    target: {y: dest.cx - 15, x: dest.cy + (index - (length - 1) / 2) / length * 12}
                }, diagonal = d3.svg.diagonal().projection(function (d) {
                    return [d.y, d.x]
                });
            return line.attr({
                "marker-start": "url(#markerArrow)",
                class: "link",
                id: "link" + input.source.id + "-" + input.dest.id,
                d: diagonal(datum, 0)
            }), container.append("path").attr("d", diagonal(datum, 0)).attr("class", "link-hover").on("mouseenter", function () {
                updateHoverCard(HoverType.WEIGHT, input, d3.mouse(this))
            }).on("mouseleave", function () {
                updateHoverCard(null)
            }), line
        }

        function updateDecisionBoundary(network, firstTime) {
            if (firstTime) {
                boundary = {}, nn.forEachNode(network, !0, function (node) {
                    boundary[node.id] = new Array(100)
                });
                for (var nodeId in INPUTS) boundary[nodeId] = new Array(100)
            }
            var xScale = d3.scale.linear().domain([0, 99]).range(xDomain),
                yScale = d3.scale.linear().domain([99, 0]).range(xDomain), i = 0, j = 0;
            for (i = 0; i < 100; i++) {
                if (firstTime) {
                    nn.forEachNode(network, !0, function (node) {
                        boundary[node.id][i] = new Array(100)
                    });
                    for (var nodeId in INPUTS) boundary[nodeId][i] = new Array(100)
                }
                for (j = 0; j < 100; j++) {
                    var x = xScale(i), y = yScale(j), input = constructInput(x, y);
                    if (nn.forwardProp(network, input), nn.forEachNode(network, !0, function (node) {
                        boundary[node.id][i][j] = node.output
                    }), firstTime) for (var nodeId in INPUTS) boundary[nodeId][i][j] = INPUTS[nodeId].f(x, y)
                }
            }
        }

        function getLoss(network, dataPoints) {
            for (var loss = 0, i = 0; i < dataPoints.length; i++) {
                var dataPoint = dataPoints[i], input = constructInput(dataPoint.x, dataPoint.y),
                    output = nn.forwardProp(network, input);
                loss += nn.Errors.SQUARE.error(output, dataPoint.label)
            }
            return loss / dataPoints.length
        }

        function updateUI(firstStep) {
            function zeroPad(n) {
                return ("000000" + n).slice(-"000000".length)
            }

            function addCommas(s) {
                return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }

            function humanReadable(n) {
                return n.toFixed(3)
            }

            void 0 === firstStep && (firstStep = !1), updateWeightsUI(network, d3.select("g.core")), updateBiasesUI(network), updateDecisionBoundary(network, firstStep);
            var selectedId = null != selectedNodeId ? selectedNodeId : nn.getOutputNode(network).id;
            heatMap.updateBackground(boundary[selectedId], state.discretize), d3.select("#network").selectAll("div.canvas").each(function (data) {
                data.heatmap.updateBackground(heatmap_1.reduceMatrix(boundary[data.id], 10), state.discretize)
            }), d3.select("#loss-train").text(humanReadable(lossTrain)), d3.select("#loss-test").text(humanReadable(lossTest)), d3.select("#iter-number").text(addCommas(zeroPad(iter))), lineChart.addDataPoint([lossTrain, lossTest])
        }

        function constructInputIds() {
            var result = [];
            for (var inputName in INPUTS) state[inputName] && result.push(inputName);
            return result
        }

        function constructInput(x, y) {
            var input = [];
            for (var inputName in INPUTS) state[inputName] && input.push(INPUTS[inputName].f(x, y));
            return input
        }

        function oneStep() {
            iter++, trainData.forEach(function (point, i) {
                var input = constructInput(point.x, point.y);
                nn.forwardProp(network, input), nn.backProp(network, point.label, nn.Errors.SQUARE), (i + 1) % state.batchSize == 0 && nn.updateWeights(network, state.learningRate, state.regularizationRate)
            }), lossTrain = getLoss(network, trainData), lossTest = getLoss(network, testData), updateUI()
        }

        function getOutputWeights(network) {
            for (var weights = [], layerIdx = 0; layerIdx < network.length - 1; layerIdx++) for (var currentLayer = network[layerIdx], i = 0; i < currentLayer.length; i++) for (var node = currentLayer[i], j = 0; j < node.outputs.length; j++) {
                var output = node.outputs[j];
                weights.push(output.weight)
            }
            return weights
        }

        function reset(onStartup) {
            void 0 === onStartup && (onStartup = !1), lineChart.reset(), state.serialize(), onStartup || userHasInteracted(), player.pause();
            var suffix = 1 !== state.numHiddenLayers ? "s" : "";
            d3.select("#layers-label").text("Hidden layer" + suffix), d3.select("#num-layers").text(state.numHiddenLayers), iter = 0;
            var numInputs = constructInput(0, 0).length, shape = [numInputs].concat(state.networkShape).concat([1]),
                outputActivation = state.problem === state_1.Problem.REGRESSION ? nn.Activations.LINEAR : nn.Activations.TANH
            ;network = nn.buildNetwork(shape, state.activation, outputActivation, state.regularization, constructInputIds(), state.initZero), lossTrain = getLoss(network, trainData), lossTest = getLoss(network, testData), drawNetwork(network), updateUI(!0)
        }

        function initTutorial() {
            if (null != state.tutorial && "" !== state.tutorial && !state.hideText) {
                d3.selectAll("article div.l--body").remove();
                var tutorial = d3.select("article").append("div").attr("class", "l--body");
                d3.html("tutorials/" + state.tutorial + ".html", function (err, htmlFragment) {
                    if (err) throw err;
                    tutorial.node().appendChild(htmlFragment);
                    var title = tutorial.select("title");
                    title.size() && (d3.select("header h1").style({
                        "margin-top": "20px",
                        "margin-bottom": "20px"
                    }).text(title.text()), document.title = title.text())
                })
            }
        }

        function drawDatasetThumbnails() {
            function renderThumbnail(canvas, dataGenerator) {
                canvas.setAttribute("width", 100), canvas.setAttribute("height", 100);
                var context = canvas.getContext("2d");
                dataGenerator(200, 0).forEach(function (d) {
                    context.fillStyle = colorScale(d.label), context.fillRect(100 * (d.x + 6) / 12, 100 * (d.y + 6) / 12, 4, 4)
                }), d3.select(canvas.parentNode).style("display", null)
            }

            if (d3.selectAll(".dataset").style("display", "none"), state.problem === state_1.Problem.CLASSIFICATION) for (var dataset in state_1.datasets) {
                var canvas = document.querySelector("canvas[data-dataset=" + dataset + "]"),
                    dataGenerator = state_1.datasets[dataset];
                renderThumbnail(canvas, dataGenerator)
            }
            if (state.problem === state_1.Problem.REGRESSION) for (var regDataset in state_1.regDatasets) {
                var canvas = document.querySelector("canvas[data-regDataset=" + regDataset + "]"),
                    dataGenerator = state_1.regDatasets[regDataset];
                renderThumbnail(canvas, dataGenerator)
            }
        }

        function hideControls() {
            var hiddenProps = state.getHiddenProps();
            hiddenProps.forEach(function (prop) {
                var controls = d3.selectAll(".ui-" + prop);
                0 === controls.size() && console.warn("0 html elements found with class .ui-" + prop), controls.style("display", "none")
            });
            var hideControls = d3.select(".hide-controls");
            HIDABLE_CONTROLS.forEach(function (_a) {
                var text = _a[0], id = _a[1],
                    label = hideControls.append("label").attr("class", "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect"),
                    input = label.append("input").attr({type: "checkbox", class: "mdl-checkbox__input"});
                hiddenProps.indexOf(id) === -1 && input.attr("checked", "true"), input.on("change", function () {
                    state.setHideProperty(id, !this.checked), state.serialize(), userHasInteracted(), d3.select(".hide-controls-link").attr("href", window.location.href)
                }), label.append("span").attr("class", "mdl-checkbox__label label").text(text)
            }), d3.select(".hide-controls-link").attr("href", window.location.href)
        }

        function generateData(firstTime) {
            void 0 === firstTime && (firstTime = !1), firstTime || (state.seed = Math.random().toFixed(5), state.serialize(), userHasInteracted()), Math.seedrandom(state.seed);
            var numSamples = state.problem === state_1.Problem.REGRESSION ? 1200 : 500,
                generator = state.problem === state_1.Problem.CLASSIFICATION ? state.dataset : state.regDataset,
                data = generator(numSamples, state.noise / 100);
            dataset_1.shuffle(data);
            var splitIndex = Math.floor(data.length * state.percTrainData / 100);
            trainData = data.slice(0, splitIndex), testData = data.slice(splitIndex), heatMap.updatePoints(trainData), heatMap.updateTestPoints(state.showTestData ? testData : [])
        }

        function userHasInteracted() {
            if (firstInteraction) {
                firstInteraction = !1;
                var page = "index";
                null != state.tutorial && "" !== state.tutorial && (page = "/v/tutorials/" + state.tutorial), ga("set", "page", page), ga("send", "pageview", {sessionControl: "start"})
            }
        }

        function simulationStarted() {
            ga("send", {
                hitType: "event",
                eventCategory: "Starting Simulation",
                eventAction: parametersChanged ? "changed" : "unchanged",
                eventLabel: null == state.tutorial ? "" : state.tutorial
            }), parametersChanged = !1
        }

        var mainWidth, nn = require("./nn"), heatmap_1 = require("./heatmap"), state_1 = require("./state"),
            dataset_1 = require("./dataset"), linechart_1 = require("./linechart");
        d3.select(".more button").on("click", function () {
            d3.transition().duration(1e3).tween("scroll", scrollTween(800))
        });
        var HoverType;
        !function (HoverType) {
            HoverType[HoverType.BIAS = 0] = "BIAS", HoverType[HoverType.WEIGHT = 1] = "WEIGHT"
        }(HoverType || (HoverType = {}));
        var INPUTS = {
                x: {
                    f: function (x, y) {
                        return x
                    }, label: "X_1"
                }, y: {
                    f: function (x, y) {
                        return y
                    }, label: "X_2"
                }, xSquared: {
                    f: function (x, y) {
                        return x * x
                    }, label: "X_1^2"
                }, ySquared: {
                    f: function (x, y) {
                        return y * y
                    }, label: "X_2^2"
                }, xTimesY: {
                    f: function (x, y) {
                        return x * y
                    }, label: "X_1X_2"
                }, sinX: {
                    f: function (x, y) {
                        return Math.sin(x)
                    }, label: "sin(X_1)"
                }, sinY: {
                    f: function (x, y) {
                        return Math.sin(y)
                    }, label: "sin(X_2)"
                }
            },
            HIDABLE_CONTROLS = [["Show test data", "showTestData"], ["Discretize output", "discretize"], ["Play button", "playButton"], ["Step button", "stepButton"], ["Reset button", "resetButton"], ["Learning rate", "learningRate"], ["Activation", "activation"], ["Regularization", "regularization"], ["Regularization rate", "regularizationRate"], ["Problem type", "problem"], ["Which dataset", "dataset"], ["Ratio train data", "percTrainData"], ["Noise level", "noise"], ["Batch size", "batchSize"], ["# of hidden layers", "numHiddenLayers"]],
            Player = function () {
                function Player() {
                    this.timerIndex = 0, this.isPlaying = !1, this.callback = null
                }

                return Player.prototype.playOrPause = function () {
                    this.isPlaying ? (this.isPlaying = !1, this.pause()) : (this.isPlaying = !0, 0 === iter && simulationStarted(), this.play())
                }, Player.prototype.onPlayPause = function (callback) {
                    this.callback = callback
                }, Player.prototype.play = function () {
                    this.pause(), this.isPlaying = !0, this.callback && this.callback(this.isPlaying), this.start(this.timerIndex)
                }, Player.prototype.pause = function () {
                    this.timerIndex++, this.isPlaying = !1, this.callback && this.callback(this.isPlaying)
                }, Player.prototype.start = function (localTimerIndex) {
                    var _this = this;
                    d3.timer(function () {
                        return localTimerIndex < _this.timerIndex || (oneStep(), !1)
                    }, 0)
                }, Player
            }(), state = state_1.State.deserializeState();
        state.getHiddenProps().forEach(function (prop) {
            prop in INPUTS && delete INPUTS[prop]
        });
        var boundary = {}, selectedNodeId = null, xDomain = [-6, 6],
            heatMap = new heatmap_1.HeatMap(300, 100, xDomain, xDomain, d3.select("#heatmap"), {showAxes: !0}),
            linkWidthScale = d3.scale.linear().domain([0, 5]).range([1, 10]).clamp(!0),
            colorScale = d3.scale.linear().domain([-1, 0, 1]).range(["#f59322", "#e8eaeb", "#0877bd"]).clamp(!0),
            iter = 0, trainData = [], testData = [], network = null, lossTrain = 0, lossTest = 0, player = new Player,
            lineChart = new linechart_1.AppendingLineChart(d3.select("#linechart"), ["#777", "black"]);
        exports.getOutputWeights = getOutputWeights;
        var firstInteraction = !0, parametersChanged = !1;
        drawDatasetThumbnails(), initTutorial(), makeGUI(), generateData(!0), reset(!0), hideControls()
    }, {"./dataset": 1, "./heatmap": 2, "./linechart": 3, "./nn": 4, "./state": 6}],
    6: [function (require, module, exports) {
        "use strict";

        function getKeyFromValue(obj, value) {
            for (var key in obj) if (obj[key] === value) return key
        }

        function endsWith(s, suffix) {
            return s.substr(-suffix.length) === suffix
        }

        function getHideProps(obj) {
            var result = [];
            for (var prop in obj) endsWith(prop, "_hide") && result.push(prop);
            return result
        }

        var nn = require("./nn"), dataset = require("./dataset");
        exports.activations = {
            relu: nn.Activations.RELU,
            tanh: nn.Activations.TANH,
            sigmoid: nn.Activations.SIGMOID,
            linear: nn.Activations.LINEAR
        }, exports.regularizations = {
            none: null,
            L1: nn.RegularizationFunction.L1,
            L2: nn.RegularizationFunction.L2
        }, exports.datasets = {
            circle: dataset.classifyCircleData,
            xor: dataset.classifyXORData,
            gauss: dataset.classifyTwoGaussData,
            spiral: dataset.classifySpiralData
        }, exports.regDatasets = {
            "reg-plane": dataset.regressPlane,
            "reg-gauss": dataset.regressGaussian
        }, exports.getKeyFromValue = getKeyFromValue;
        var Type;
        !function (Type) {
            Type[Type.STRING = 0] = "STRING", Type[Type.NUMBER = 1] = "NUMBER", Type[Type.ARRAY_NUMBER = 2] = "ARRAY_NUMBER", Type[Type.ARRAY_STRING = 3] = "ARRAY_STRING", Type[Type.BOOLEAN = 4] = "BOOLEAN", Type[Type.OBJECT = 5] = "OBJECT"
        }(Type = exports.Type || (exports.Type = {}));
        var Problem;
        !function (Problem) {
            Problem[Problem.CLASSIFICATION = 0] = "CLASSIFICATION", Problem[Problem.REGRESSION = 1] = "REGRESSION"
        }(Problem = exports.Problem || (exports.Problem = {})), exports.problems = {
            classification: Problem.CLASSIFICATION,
            regression: Problem.REGRESSION
        };
        var State = function () {
            function State() {
                this.learningRate = .03, this.regularizationRate = 0, this.showTestData = !1, this.noise = 0, this.batchSize = 10, this.discretize = !1, this.tutorial = null, this.percTrainData = 50, this.activation = nn.Activations.TANH, this.regularization = null, this.problem = Problem.CLASSIFICATION, this.initZero = !1, this.hideText = !1, this.collectStats = !1, this.numHiddenLayers = 1, this.hiddenLayerControls = [], this.networkShape = [4, 2], this.x = !0, this.y = !0, this.xTimesY = !1, this.xSquared = !1, this.ySquared = !1, this.cosX = !1, this.sinX = !1, this.cosY = !1, this.sinY = !1, this.dataset = dataset.classifyCircleData, this.regDataset = dataset.regressPlane
            }

            return State.deserializeState = function () {
                function hasKey(name) {
                    return name in map && null != map[name] && "" !== map[name].trim()
                }

                function parseArray(value) {
                    return "" === value.trim() ? [] : value.split(",")
                }

                for (var map = {}, _i = 0, _a = window.location.hash.slice(1).split("&"); _i < _a.length; _i++) {
                    var keyvalue = _a[_i], _b = keyvalue.split("="), name_1 = _b[0], value = _b[1];
                    map[name_1] = value
                }
                var state = new State;
                return State.PROPS.forEach(function (_a) {
                    var name = _a.name, type = _a.type, keyMap = _a.keyMap;
                    switch (type) {
                        case Type.OBJECT:
                            if (null == keyMap) throw Error("A key-value map must be provided for state variables of type Object");
                            hasKey(name) && map[name] in keyMap && (state[name] = keyMap[map[name]]);
                            break;
                        case Type.NUMBER:
                            hasKey(name) && (state[name] = +map[name]);
                            break;
                        case Type.STRING:
                            hasKey(name) && (state[name] = map[name]);
                            break;
                        case Type.BOOLEAN:
                            hasKey(name) && (state[name] = "false" !== map[name]);
                            break;
                        case Type.ARRAY_NUMBER:
                            name in map && (state[name] = parseArray(map[name]).map(Number));
                            break;
                        case Type.ARRAY_STRING:
                            name in map && (state[name] = parseArray(map[name]));
                            break;
                        default:
                            throw Error("Encountered an unknown type for a state variable")
                    }
                }), getHideProps(map).forEach(function (prop) {
                    state[prop] = "true" === map[prop]
                }), state.numHiddenLayers = state.networkShape.length, null == state.seed && (state.seed = Math.random().toFixed(5)), Math.seedrandom(state.seed), state
            }, State.prototype.serialize = function () {
                var _this = this, props = [];
                State.PROPS.forEach(function (_a) {
                    var name = _a.name, type = _a.type, keyMap = _a.keyMap, value = _this[name];
                    null != value && (type === Type.OBJECT ? value = getKeyFromValue(keyMap, value) : type !== Type.ARRAY_NUMBER && type !== Type.ARRAY_STRING || (value = value.join(",")), props.push(name + "=" + value))
                }), getHideProps(this).forEach(function (prop) {
                    props.push(prop + "=" + _this[prop])
                }), window.location.hash = props.join("&")
            }, State.prototype.getHiddenProps = function () {
                var result = [];
                for (var prop in this) endsWith(prop, "_hide") && "true" === String(this[prop]) && result.push(prop.replace("_hide", ""));
                return result
            }, State.prototype.setHideProperty = function (name, hidden) {
                this[name + "_hide"] = hidden
            }, State
        }();
        State.PROPS = [{name: "activation", type: Type.OBJECT, keyMap: exports.activations}, {
            name: "regularization",
            type: Type.OBJECT,
            keyMap: exports.regularizations
        }, {name: "batchSize", type: Type.NUMBER}, {
            name: "dataset",
            type: Type.OBJECT,
            keyMap: exports.datasets
        }, {name: "regDataset", type: Type.OBJECT, keyMap: exports.regDatasets}, {
            name: "learningRate",
            type: Type.NUMBER
        }, {name: "regularizationRate", type: Type.NUMBER}, {name: "noise", type: Type.NUMBER}, {
            name: "networkShape",
            type: Type.ARRAY_NUMBER
        }, {name: "seed", type: Type.STRING}, {name: "showTestData", type: Type.BOOLEAN}, {
            name: "discretize",
            type: Type.BOOLEAN
        }, {name: "percTrainData", type: Type.NUMBER}, {name: "x", type: Type.BOOLEAN}, {
            name: "y",
            type: Type.BOOLEAN
        }, {name: "xTimesY", type: Type.BOOLEAN}, {name: "xSquared", type: Type.BOOLEAN}, {
            name: "ySquared",
            type: Type.BOOLEAN
        }, {name: "cosX", type: Type.BOOLEAN}, {name: "sinX", type: Type.BOOLEAN}, {
            name: "cosY",
            type: Type.BOOLEAN
        }, {name: "sinY", type: Type.BOOLEAN}, {name: "collectStats", type: Type.BOOLEAN}, {
            name: "tutorial",
            type: Type.STRING
        }, {name: "problem", type: Type.OBJECT, keyMap: exports.problems}, {
            name: "initZero",
            type: Type.BOOLEAN
        }, {name: "hideText", type: Type.BOOLEAN}], exports.State = State
    }, {"./dataset": 1, "./nn": 4}]
}, {}, [5]);
