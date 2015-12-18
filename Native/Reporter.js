var make = function make(elm) {
    elm.Native = elm.Native || {};
    elm.Native.Reporter = elm.Native.Reporter || {};


    if (elm.Native.Reporter.values) {
        return elm.Native.Reporter.values;
    }

    window._elmSnapshots = [];

    var stealNotify = function(a) {
        var originalNotify = elm.notify;

        elm.notify = function(id, value){
            var changed = originalNotify(id, value);

            window._elmSnapshots.push(takeSnapshot(flattenSignalGraph(elm)));

            return changed;
        }

        return a;
    }


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
