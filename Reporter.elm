module Reporter where

import Native.Reporter

type Reporter = Logger | RemoteLogger

stealNotify : a -> a
stealNotify =
    Native.Reporter.stealNotify

setReporter : Reporter -> (a -> a)
setReporter =
    Native.Reporter.setReporter

reportNow : () -> ()
reportNow = Native.Reporter.reportNow
