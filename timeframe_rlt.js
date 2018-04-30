module.exports = function(RED) {
    "use strict";
//timeframe rate limit trigger
    function timeframe_rlt(config) {
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

        this.on("input", function(msg) {
            // time frame
            if( isNaN(node.timeLimit) || !isFinite(node.timeLimit) ) {
            return this.error("time limit is not numeric", msg);
            }

            var now = Math.floor(Date.now());
            var resetmsgcount = function() { 
                node.count = 0;
                };

            if( node.time + node.timeLimit < now ) {
                node.time = now;
                setTimeout(resetmsgcount, node.timeLimit);
            }

            // by count
            if( node.throttleType === "count" ) {
                if( isNaN(node.countLimit) || !isFinite(node.countLimit) ) {
                    return this.error("count limit is not numeric", msg);
                }

                ++node.count;

                if( node.count >= node.countLimit ) {
                    node.send(msg);
                    node.count = 0;
                }
            }

            // by reset
            else if( node.throttleType === "reset" ) {
                if( isNaN(node.byresetcountLimit) || !isFinite(node.byresetcountLimit) ) {
                    return this.error("count limit is not numeric", msg);
                }
                
                ++node.count;

                if( ( node.count >= node.byresetcountLimit && !node.reset ) || ( !node.count >= node.byresetcountLimit && node.reset ) ) {
                    node.reset = true;
                    node.send(msg);
                }

                else if( msg.reset ) {
                    node.count = 0;
                    node.reset = false;
                }
            }

            // unknown throttle type
            else {
                this.error("unknown throttle type '" + node.throttleType + "'", msg);
            }
        });
    }

    RED.nodes.registerType("timeframe_rlt", timeframe_rlt);
};
