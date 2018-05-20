module.exports = function(RED) {
    "use strict";
//Thanks to allot of code written by Daniel 'Eisbehr' Kern and his [node-red-contrib-throttle](http://github.com/eisbehr-/node-red-throttle). I based and copied allot of code off his work as his node did not quite do what i needed.
    function timeframerlt(config) {
        RED.nodes.createNode(this, config);

        var node = this;

        // config
        this.throttleType = config.throttleType || "count";
        this.timeLimitType = config.timeLimitType || "seconds";
        this.timeLimit = Number(config.timeLimit || 0);
        this.countLimit = Number(config.countLimit || 0);
        this.byresetcountLimit = Number(config.byresetcountLimit || 0);
        // helpers
        this.time = Math.floor(Date.now());
        this.count = 0;
        this.reset = false;
        

        // calculate time limit in milliseconds
        if( this.timeLimitType === "hours" ) {
            this.timeLimit *= 60 * 60 * 1000;
        }
        else if( this.timeLimitType === "minutes" ) {
            this.timeLimit *= 60 * 1000;
        }
        else if( this.timeLimitType === "seconds" ) {
            this.timeLimit *= 1000;
        }

        // Node Status Icon - waiting for msg clear status
        if( node.count == 0 ) {

            node.status({
            });
        }

        this.on("input", function(msg) {
            // time frame
            if( isNaN(node.timeLimit) || !isFinite(node.timeLimit) ) {
            return this.error("time limit is not numeric", msg);
            }

            var now = Math.floor(Date.now());
            var status_reset = function() {
                node.status({
                    fill: 'yellow',
                    shape: 'dot',
                    text: 'reset'
                });               
            };
            var status_waitingformsg = function() {
                node.status({
                });               
            };
            var status_waitingformsgreset = function() {
                node.status({
                    fill: 'red',
                    shape: 'ring',
                    text: 'waiting for manual msg.reset'
                });               
            };
            var status_sent = function() {
                node.status({
                    fill: 'green',
                    shape: 'dot',
                    text: 'sent'
                    });               
            };
            var status_count = function() {
                    node.status({
                        fill: 'blue',
                        shape: 'dot',
                        text: 'msg ' + node.count + ' of ' + node.countLimit
                    });
            };

            // timelimit
            if ( node.reset === true ) {
                setTimeout(status_waitingformsgreset, 0);
            }
            else if( node.time + node.timeLimit < now ) {
                node.time = now;
                node.count = 0;
                setTimeout(status_reset, node.timeLimit);
                setTimeout(status_waitingformsg, node.timeLimit + 500);
                
            }




            // by count
            if( node.throttleType === "count" ) {
                if( isNaN(node.countLimit) || !isFinite(node.countLimit) ) {
                    return this.error("count limit is not numeric", msg);
                }
                
                ++node.count;
                setTimeout(status_count, 0);

                if( node.count >= node.countLimit ) {
                    node.send(msg);
                    node.count = 0;
                    setTimeout(status_sent, 0);
                }
            }

            // by reset
            else if( node.throttleType === "reset" ) {
                if( isNaN(node.byresetcountLimit) || !isFinite(node.byresetcountLimit) ) {
                    return this.error("count limit is not numeric", msg);
                }
                
                ++node.count;
                if ( node.reset === false ) {
                    setTimeout(status_count, 0);
                }

                if( ( node.count >= node.byresetcountLimit && !node.reset ) || ( !node.count >= node.byresetcountLimit && node.reset ) ) {
                    node.reset = true;
                    node.send(msg);
                    setTimeout(status_sent, 0);
                    setTimeout(status_waitingformsgreset, node.timeLimit + 501);

                }

                if( msg.reset ) {
                    node.count = 0;
                    node.reset = false;
                    setTimeout(status_reset, node.timeLimit);
                    setTimeout(status_waitingformsg, node.timeLimit + 500);
                }
            }

            // unknown throttle type
            else {
                this.error("unknown throttle type '" + node.throttleType + "'", msg);
            }
        });
    }

    RED.nodes.registerType("timeframerlt", timeframerlt);
};
