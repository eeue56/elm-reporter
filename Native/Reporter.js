var make = function make(elm) {
    elm.Native = elm.Native || {};
    elm.Native.Reporter = elm.Native.Reporter || {};


    if (elm.Native.Reporter.values) {
        return elm.Native.Reporter.values;
    }
    // we want snapshots on the window so we can send out things if elm dies
    window._elmSnapshots = [];
    var reporter = console.log;

    var stealNotify = function(a) {
        var originalNotify = elm.notify;

        elm.notify = function(id, value){
            try {
                var changed = originalNotify(id, value);
            } catch (e) {
                report(window._elmSnapshots);
            }

            window._elmSnapshots.push(takeSnapshot(flattenSignalGraph(elm)));

            return changed;
        }

        return a;
    }

    var report = function(stuff){
        console.warn("Reporter was called!");
        reporter(stuff);
        return stuff;
    };


    var setReporter = function(reporterSwitch){
        switch (reporterSwitch.ctor){
            case 'Logger':
                reporter = console.log;
                break;
            case 'RemoteLogger':
                reporter = console.log;
                break;
        }

        return reporter;
    };

    // returns array of node references, indexed by node id (?)
    function flattenSignalGraph(runtime) {
        var nodesById = {};

        function addAllToDict(node)
        {
            nodesById[node.id] = node;
            if(node.kids) {
                node.kids.forEach(addAllToDict);
            }
        }
        runtime.inputs.forEach(addAllToDict);

        return nodesById;
    }


    // returns snapshot
    function takeSnapshot(signalGraphNodes)
    {
        var nodeValues = {};

        Object.keys(signalGraphNodes).forEach(function(nodeId) {
            var node = signalGraphNodes[nodeId];
            nodeValues[nodeId] = node.value;
        });

        return nodeValues;
    }


    return {
        stealNotify: stealNotify
    };
};

Elm.Native.Reporter = {};
Elm.Native.Reporter.make = make;
